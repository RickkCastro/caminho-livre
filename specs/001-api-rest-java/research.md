# Research: API REST Caminho Livre

## Acesso a dados: Spring Data JPA
- **Decision**: Entidades JPA mapeadas nas tabelas existentes (`ddl-auto=none`, ids `IDENTITY`), `JpaRepository` por entidade e regras nos services.
- **Rationale**: É o padrão trabalhado em aula; repository cumpre o papel da camada DAO e service o da BO na rubrica, com menos código que SQL à mão.
- **Alternatives**: JdbcTemplate em DAOs (mais código, fora do padrão da aula); JDBC puro (mais boilerplate de conexão).

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

## Rota: OpenRouteService na API (desde 2026-11-16)
- **Decision**: `RotaService` chama o OpenRouteService (`/v2/directions/{perfil}/geojson`) duas vezes: `foot-walking` para a rota comum e, para a Caminho Livre, `foot-walking` (ou `wheelchair` com mobilidade reduzida) com `avoid_polygons` = quadrado de 50 m em volta de cada alerta ativo com peso ≥ 3 na hora pedida (ou `bloqueia_mobilidade = S`), sem as categorias de `ignorar` e sem alertas a até 60 m da origem/destino. Sem alertas a evitar e sem mobilidade reduzida, reaproveita a comum (um pedido só). Erros do ORS: 2010 → 422 (sem rua perto), 2004 → 422 (longe demais), 2009 → `caminhoLivre = null` + aviso, demais → 503. Chave em `ORS_API_KEY`, só no servidor.
- **Rationale**: o grafo da tabela TRECHO cobria só 10 esquinas da Av. Paulista e a linha ligava esquinas em reta; o ORS usa as ruas do OpenStreetMap no Brasil inteiro, desenha a geometria real e tem perfil de cadeira de rodas. Google Directions descartado: não evita áreas, não tem rota a pé acessível e exige mapa do Google.
- **Alternatives**: OSRM público (não evita áreas); GraphHopper (áreas limitadas no plano grátis); manter Dijkstra e importar a malha do OSM no Oracle (inviável no prazo).

## Rota: Dijkstra na API (substituída em 2026-11-16)
- **Decision**: `RotaService` com Dijkstra (`PriorityQueue` do JDK) sobre o grafo não direcionado de TRECHO, rodado duas vezes: custo = distância (comum) e custo = peso sem trechos bloqueados (Caminho Livre).
- **Rationale**: Só Java e front integram o app; o grafo de demo é pequeno, então o cálculo em memória a cada chamada atende ≤ 2 s sem cache.
- **Alternatives**: Serviço Python (Dynamic Programming é entrega isolada, sem deploy); cálculo no front (espalha regra de negócio no cliente).

## Deploy
- **Decision**: Dockerfile multi-stage (maven → eclipse-temurin:21-jre) no Render; `DB_URL`, `DB_USER`, `DB_PASSWORD`, `GOOGLE_CLIENT_ID`, `FRONT_URL` como env vars.
- **Rationale**: Render não tem runtime Java nativo; Docker é o caminho suportado.
