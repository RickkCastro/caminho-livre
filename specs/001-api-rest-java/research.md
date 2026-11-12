# Research: API REST Caminho Livre

## Acesso a dados: JdbcTemplate em DAOs
- **Decision**: DAOs com `JdbcTemplate` + `RowMapper`, SQL escrito à mão.
- **Rationale**: A avaliação pede camadas DAO e BO explícitas e model "de acordo com o banco"; SQL direto segue o DER do Caio sem mapeamento ORM.
- **Alternatives**: Spring Data JPA (esconde o DAO, mais difícil de justificar na rubrica); JDBC puro (mais boilerplate de conexão).

## Autenticação: ID token Google revalidado
- **Decision**: `GoogleIdTokenVerifier` (google-api-client) com `GOOGLE_CLIENT_ID`. `POST /auth/google` faz upsert do usuário; um filtro valida `Authorization: Bearer <idToken>` nas rotas de escrita e põe o usuário na request. Nos GETs públicos o token é opcional (se vier válido, identifica o usuário para `minha`).
- **Rationale**: Atende RNF06 sem guardar segredo próprio nem emitir JWT; token do Google dura 1 h, o front renova pelo Google Identity Services.
- **Alternatives**: Spring Security OAuth2 Resource Server (mais config para o mesmo resultado); JWT próprio (mais código e segredo para gerenciar).

## Expiração (US08)
- **Decision**: `@Scheduled(cron = "0 0 3 * * *", zone = "America/Sao_Paulo")` + chamada do mesmo `UPDATE` antes de `GET /ocorrencias`.
- **Rationale**: Render free dorme; o update na leitura garante RNF10 mesmo se o cron não rodar.
- **Alternatives**: Job no Oracle (DBMS_SCHEDULER) — fora do controle da API e do repositório Java.

## "Ocorrência próxima" de um trecho
- **Decision**: Distância Haversine em Java ≤ 30 m da origem ou do destino do trecho.
- **Rationale**: Volume de demo é pequeno; evita Oracle Spatial.
- **Bloqueio por mobilidade**: coluna `bloqueia_mobilidade` em CATEGORIA_OCORRENCIA em vez de comparar nomes (renomear na carga quebraria a regra).
- **Alternatives**: Oracle Spatial (não garantido no Oracle da FIAP); FK ocorrência→trecho (muda o DER congelado).

## Rota: Dijkstra na API
- **Decision**: `RotaBO` com Dijkstra (`PriorityQueue` do JDK) sobre o grafo não direcionado de TRECHO, rodado duas vezes: custo = distância (comum) e custo = peso sem trechos bloqueados (Caminho Livre).
- **Rationale**: Só Java e front integram o app; o grafo de demo é pequeno, então o cálculo em memória a cada chamada atende ≤ 2 s sem cache.
- **Alternatives**: Serviço Python (Dynamic Programming é entrega isolada, sem deploy); cálculo no front (espalha regra de negócio no cliente).

## Deploy
- **Decision**: Dockerfile multi-stage (maven → eclipse-temurin:21-jre) no Render; `DB_URL`, `DB_USER`, `DB_PASSWORD`, `GOOGLE_CLIENT_ID`, `FRONT_URL` como env vars.
- **Rationale**: Render não tem runtime Java nativo; Docker é o caminho suportado.
