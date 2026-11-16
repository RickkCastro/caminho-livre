# ☕ Domain Driven Design — Java — Ulisses

**Disciplina:** Domain Driven Design – Java · **Entrega:** `.zip` no **Portal do Aluno** até 19/11, 23h55

## Conceito
API RESTful em **Spring Boot** com banco **Oracle (FIAP)**, implementando o núcleo do Caminho Livre: ocorrências, confirmações, expiração e pesos dos trechos.

## Entregáveis
O `.zip` contém o **PDF da documentação**, o **link do GitHub** e o **link do deploy**.

### Documentação: PDF único (30 pts)
- [ ] Especificação (5): capa com nome do projeto, nomes completos e RMs, índice, descrição, justificativa e objetivos
- [ ] Diagrama de classes refletindo o código (10): fonte em [`docs/diagrama-classes.md`](caminholivre-backend/docs/diagrama-classes.md)
- [ ] Protótipos de tela + tabela de endpoints (GET/POST/PUT/DELETE) + DER (10)
- [ ] Instruções de execução (5): ferramentas, versões (JDK 21, Oracle), links do GitHub e do deploy, passo a passo

### Parte técnica (70 pts)
- [x] Camada **model** com as classes de acordo com o banco (10)
- [x] Camadas **DAO** e **BO** (10): no padrão Spring Data JPA visto em aula, **repository** e **service**
- [x] **Controller** com GET, POST, PUT e DELETE (10)
- [x] **Tratamento de exceções** (10)
- [x] **Deploy no Render** (30): https://caminho-livre.onrender.com

> ⚠️ Commits feitos após a data de entrega **zeram toda a parte técnica**.

## Estrutura
Projeto em [`caminholivre-backend/`](caminholivre-backend/) (Spring Boot 4.1, Java 21, Spring Data JPA).
```
src/main/java/br/com/caminholivre/
├── model/        entidades JPA: Usuario, CategoriaOcorrencia, Localizacao, Ocorrencia, Confirmacao, PreferenciaRota, Trecho, RotaFavorita
├── repository/   um JpaRepository por entidade
├── service/      regras de negócio (confirmar, expirar, resolver, calcular peso, rota)
├── controller/   endpoints REST
├── dto/          corpos de requisição e respostas (sem googleId nem e-mail de terceiros)
├── exception/    GlobalExceptionHandler (@RestControllerAdvice) + exceções 401/403/404/409/422
└── config/       CORS para o front, filtro do token Google, job diário de expiração
```
Diagrama de classes: [`docs/diagrama-classes.md`](caminholivre-backend/docs/diagrama-classes.md).

## Regras de negócio (services)
Alinhadas ao [backlog MoSCoW](../agile/backlog.md):
- Uma ocorrência nasce `ABERTA`, com `dt_expiracao` = registro + 15 dias (US08).
- Com **3 confirmações positivas (👍)** ela passa para `CONFIRMADA` (US07).
- Com **3 negações (👎)**, contadas no total e não como saldo, ela passa para `RESOLVIDA` ("o problema não existe mais"). Não há painel de gestor (US21 é Won't).
- Um usuário só avalia uma vez cada ocorrência e não avalia a própria.
- Ocorrências vencidas e não confirmadas passam para `EXPIRADA` (US08).
- O peso do trecho é `distância × (1 + Σ pesos das ocorrências ativas próximas)`, usando `peso_noturno` entre 19h e 6h, ignorando as categorias passadas em `ignorar` (o front lê de `PREFERENCIA_ROTA`, US11). Com `mobilidadeReduzida=S`, categorias com `bloqueia_mobilidade = S` (Degrau, Falta de rampa) bloqueiam o trecho. A rota não recebe `idUsuario` (LGPD).
- +10 pontos ao enviar um alerta e +2 ao avaliar (US17, US18).
- Excluir a conta anonimiza os alertas (continuam no mapa) e apaga confirmações, preferências e rotas favoritas, numa transação (US15, LGPD).
- Login com Google: `POST /auth/google` recebe o ID token, valida com o Google, cria o usuário no primeiro acesso e devolve os dados dele. A API não guarda senha.

## Tabela de endpoints (contrato com o front)
🔒 = exige `Authorization: Bearer <ID token do Google>` (sem ele: 401). 👤 = só o próprio usuário ou o autor (outro: 403). Nas rotas públicas o token é opcional.

| Método | Rota | Descrição | História |
|---|---|---|---|
| POST | `/auth/google` | Entrar com Google `{ idToken }`: 201 e `primeiroAcesso: true` ao criar a conta, 200 depois | US01 |
| GET 🔒 | `/usuarios` | Listar usuários (só id, nome, foto e pontos) | US01 |
| GET / PUT / DELETE 🔒👤 | `/usuarios/{id}` | Perfil / atualizar `{ nome?, fotoUrl?, mobilidadeReduzida? }` / excluir conta (204) | US12, US13, US15 |
| GET 🔒👤 | `/usuarios/{id}/ocorrencias` | Minhas ocorrências (todos os status, com totais) | US10 |
| GET / PUT 🔒👤 | `/usuarios/{id}/preferencias` | `[{ idCategoria, considerar: S\|N }]`; sem ajuste = S | US11 |
| GET / POST🔒 | `/categorias` | Listar / cadastrar | US02 |
| GET / PUT🔒 / DELETE🔒 | `/categorias/{id}` | Em uso por ocorrência → 409 | |
| GET / POST🔒 | `/localizacoes` | | |
| GET / PUT🔒 / DELETE🔒 | `/localizacoes/{id}` | Em uso → 409 | |
| GET | `/ocorrencias?bairro=&tipo=&status=` | Mapa: `OcorrenciaResumo`; sem `status` = só ativas | US03 |
| POST 🔒 | `/ocorrencias` | Enviar alerta `{ idCategoria, latitude, longitude, logradouro?, bairro?, descricao?, fotoUrl? }` → 201 | US02 |
| GET / PUT🔒👤 / DELETE🔒👤 | `/ocorrencias/{id}` | `OcorrenciaDetalhe` (`minha` = true se o token for do autor) / editar / remover (204) | US09 |
| POST 🔒 | `/ocorrencias/{id}/confirmacoes` | Avaliar `{ confirma }` → 201 `{ status, totalConfirma, totalNega }` | US07 |
| GET / POST🔒 | `/trechos` | | |
| GET / PUT🔒 / DELETE🔒 | `/trechos/{id}` | | |
| GET | `/rotas?origemLat=&origemLon=&destinoLat=&destinoLon=&hora=&mobilidadeReduzida=&ignorar=` | `{ comum, caminhoLivre \| null, aviso? }` por ruas reais do Brasil inteiro (OpenRouteService); coordenada fora da faixa → 400; ponto sem rua por perto → 422; ORS fora do ar → 503 | US04, US11 |
| GET | `/trechos/pesos?hora=&mobilidadeReduzida=&ignorar=` | Grafo com pesos (depuração; mesmo formato do mock do Dynamic Programming) | US04, US11 |
| GET | `/ranking/bairros` | Top 5 piores (só com alerta) e top 5 melhores, sem repetir bairro | US14 |
| GET | `/ranking/usuarios` | Pessoas por pontos (nome, foto, pontos) | US19 |
| GET / POST 🔒 | `/rotas-favoritas` | Minhas rotas favoritas `{ idOrigem, idDestino, apelido }` | US16 |
| DELETE 🔒👤 | `/rotas-favoritas/{id}` | | US16 |

**`OcorrenciaDetalhe`**: `{ id, categoria, tipo, latitude, longitude, status, descricao, fotoUrl, bairro, dtRegistro, dtExpiracao, totalConfirma, totalNega, minha }`.

Códigos: 400 validação · 401 token · 403 não é o dono · 404 · 409 duplicidade · 422 regra de negócio · 503 banco.

Formato de erro padrão:
```json
{ "timestamp": "2026-11-12T10:00:00", "status": 404, "erro": "Ocorrência 99 não encontrada" }
```

## Integrações
- ⬅️ **Caio:** DER e scripts SQL
- ➡️ **Rickk:** tabela de endpoints, CORS e URL do Render
- ➡️ **Lau:** URL ou nome do serviço para o DNS no Packet Tracer

## Como executar

**Deploy:** https://caminho-livre.onrender.com (Swagger em [`/swagger-ui.html`](https://caminho-livre.onrender.com/swagger-ui.html)). No plano gratuito o Render dorme após 15 min sem uso: a primeira chamada pode levar ~1 min.

**Ferramentas:** JDK 21 (ou mais novo), Maven via `./mvnw` (já vem no projeto), Oracle da FIAP, Docker (opcional).

1. **Banco:** no Oracle da FIAP, rode `database/scripts/01_create.sql` e depois `02_insert.sql`. ⚠️ O `01_create.sql` apaga e recria as tabelas.
2. **Credenciais:** crie `api-java/caminholivre-backend/.env` (ignorado pelo git; nunca commitar):
   ```properties
   DB_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
   DB_USER=rmXXXXXX
   DB_PASSWORD=sua_senha
   GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
   FRONT_URL=http://localhost:3000
   ORS_API_KEY=sua_chave_openrouteservice   # sem aspas; grátis em openrouteservice.org/dev
   ```
   `GOOGLE_CLIENT_ID` é o ID do cliente OAuth (tipo "Aplicativo da Web") do Google Cloud Console, o mesmo do front. Sem ele a API sobe, mas o login responde 401.
3. **Testes e execução:**
   ```bash
   cd api-java/caminholivre-backend
   ./mvnw test              # testes unitários + contextLoads (conecta no Oracle)
   ./mvnw spring-boot:run   # http://localhost:8080 e http://localhost:8080/swagger-ui.html
   ```
4. **Docker (o mesmo do Render):**
   ```bash
   docker build -t caminholivre-api .
   docker run -p 8080:8080 --env-file .env caminholivre-api
   ```

**Render:** Web Service com runtime Docker, Root Directory `api-java/caminholivre-backend`, branch `java`, e as mesmas variáveis do `.env` em *Environment* (`FRONT_URL` = URL do front na Vercel, sem barra no final). Cada push na branch gera um novo deploy.

Teste rápido: `curl https://caminho-livre.onrender.com/categorias` → 200 com as categorias.
