---
description: "Task list — API REST Caminho Livre (Java)"
---

# Tasks: API REST Caminho Livre (Java)

**Input**: `specs/001-api-rest-java/` (plan, spec, research, data-model, contracts/api.md, quickstart)

**Tests**: JUnit 5 + Mockito só nos BOs com regra de negócio (plan.md). Endpoints validados pelo [quickstart](quickstart.md).

**Pacote base**: `api-java/src/main/java/br/com/fiap/caminholivre/` (abreviado `…/` abaixo). Testes em `api-java/src/test/java/br/com/fiap/caminholivre/bo/`.

## Phase 1: Setup

- [ ] T000 Confirmar com o Caio a coluna `bloqueia_mobilidade` e as categorias Falta de rampa / Local deserto em `database/scripts/01_create.sql` e `02_insert.sql`
- [ ] T001 Criar projeto Spring Boot 3.3 / Java 21 com dependências web, jdbc, validation, ojdbc11 e google-api-client em `api-java/pom.xml` (+ Maven wrapper `api-java/mvnw`)
- [ ] T002 [P] Criar `api-java/src/main/resources/application.properties` lendo `DB_URL`, `DB_USER`, `DB_PASSWORD`, `GOOGLE_CLIENT_ID`, `FRONT_URL` de env vars e `spring.jackson.time-zone=America/Sao_Paulo`
- [ ] T003 [P] Criar `api-java/Dockerfile` multi-stage (maven:3-eclipse-temurin-21 → eclipse-temurin:21-jre) expondo `$PORT`
- [ ] T004 [P] Adicionar `api-java/target/` e `.env` em `.gitignore`

## Phase 2: Foundational (bloqueia todas as histórias)

- [ ] T005 Criar classe principal com `@EnableScheduling` em `…/CaminhoLivreApplication.java`
- [ ] T006 [P] Criar exceções `RecursoNaoEncontradoException` (404), `RegraNegocioException` (422), `ConflitoException` (409), `NaoAutorizadoException` (401), `AcessoNegadoException` (403) em `…/exception/`
- [ ] T007 Criar `GlobalExceptionHandler` (`@RestControllerAdvice`) em `…/exception/GlobalExceptionHandler.java` devolvendo `{ timestamp, status, erro }`; mapear também `MethodArgumentNotValidException` → 400 citando o campo e `DataAccessResourceFailureException` → 503, sem stack trace
- [ ] T008 [P] Criar `CorsConfig` liberando apenas `FRONT_URL` e `http://localhost:3000` em `…/config/CorsConfig.java`
- [ ] T009 [P] Criar model `Usuario` (id, nome, email, googleId, mobilidadeReduzida S/N, fotoUrl, pontos, dtCadastro) em `…/model/Usuario.java`
- [ ] T010 [P] Criar model `CategoriaOcorrencia` (tipo ∈ {ACESSIBILIDADE, SEGURANCA, CLIMA}; pesos ≥ 0; bloqueiaMobilidade S/N DEFAULT N) em `…/model/CategoriaOcorrencia.java`
- [ ] T011 [P] Criar model `Localizacao` (lat ∈ [-90, 90], lon ∈ [-180, 180] com `@DecimalMin/@DecimalMax`) em `…/model/Localizacao.java`
- [ ] T012 [P] Criar model `Ocorrencia` (idUsuario nullable; categoria e localização obrigatórias; descricao ≤ 500; status ABERTA/CONFIRMADA/EXPIRADA/RESOLVIDA) em `…/model/Ocorrencia.java`
- [ ] T013 Criar `UsuarioDAO` (buscarPorId, buscarPorGoogleId, listar, inserir, atualizar, excluir, somarPontos) com JdbcTemplate em `…/dao/UsuarioDAO.java`
- [ ] T014 [P] Criar `CategoriaDAO` (CRUD) em `…/dao/CategoriaDAO.java`
- [ ] T015 [P] Criar `LocalizacaoDAO` (CRUD) em `…/dao/LocalizacaoDAO.java`
- [ ] T016 Criar `AuthBO.verificar(idToken)` com `GoogleIdTokenVerifier` (audience = `GOOGLE_CLIENT_ID`) lançando `NaoAutorizadoException` em `…/bo/AuthBO.java`
- [ ] T017 Criar `GoogleTokenFilter` (`OncePerRequestFilter`) que, em POST/PUT/DELETE e rotas `/usuarios/**` e `/rotas-favoritas/**`, valida `Authorization: Bearer`, carrega o usuário pelo googleId e o coloca no atributo `usuarioLogado` da request; nos GETs públicos lê o token se vier (opcional, sem 401) para preencher `minha`; `/auth/google` fica livre — em `…/config/GoogleTokenFilter.java`
- [ ] T018 [P] Criar `CategoriaController` (GET lista, GET/POST/PUT/DELETE `/categorias/{id}`) e `LocalizacaoController` (CRUD `/localizacoes`) em `…/controller/`

**Checkpoint**: app sobe, `GET /categorias` devolve a carga do banco.

## Phase 3: US1 — Entrar com Google (P1, MVP)

**Goal**: `POST /auth/google` cria ou devolve o usuário. **Test**: cenários 1–2 do quickstart.

- [ ] T019 [US1] Implementar `AuthBO.entrar(idToken)`: verifica token, faz upsert por googleId com nome/email/foto do payload, `pontos = 0`, devolve `primeiroAcesso` em `…/bo/AuthBO.java`; no mesmo commit, documentar `primeiroAcesso` em `api-java/README.md` (Princípio V)
- [ ] T020 [US1] Criar `AuthController` `POST /auth/google` `{ idToken }` → 201 novo / 200 existente em `…/controller/AuthController.java`

## Phase 4: US2 — Enviar alerta (P1, MVP)

**Goal**: `POST /ocorrencias` grava ABERTA com +15 dias. **Test**: cenários 3–4.

- [ ] T021 [US2] Criar `OcorrenciaDAO` (inserir, buscarPorId, listar com filtros tipo/status/bairro via JOIN categoria+localização, listarPorUsuario, atualizarStatus, expirarVencidas, anonimizarPorUsuario, atualizar, excluir) em `…/dao/OcorrenciaDAO.java`
- [ ] T022 [US2] Criar `OcorrenciaBO.criar(usuario, dto)`: valida categoria (404 se não existe), cria a `Localizacao`, grava `status = ABERTA`, `dtExpiracao = dtRegistro + 15 dias` em `…/bo/OcorrenciaBO.java`
- [ ] T023 [P] [US2] Criar DTO `NovaOcorrenciaRequest` (idCategoria e latitude/longitude `@NotNull`, descricao `@Size(max=500)`) em `…/controller/dto/NovaOcorrenciaRequest.java`
- [ ] T024 [US2] Criar `OcorrenciaController` `POST /ocorrencias` → 201 em `…/controller/OcorrenciaController.java`
- [ ] T025 [P] [US2] Teste `OcorrenciaBOTest`: status inicial ABERTA e expiração +15 dias; categoria inexistente → 404 em `api-java/src/test/java/br/com/fiap/caminholivre/bo/OcorrenciaBOTest.java`

## Phase 5: US3 — Alertas no mapa (P1, MVP)

**Goal**: `GET /ocorrencias` só ativas, sem autor. **Test**: cenário 5.

- [ ] T026 [US3] Implementar `OcorrenciaBO.listar(tipo, status, bairro)`: chama `expirarVencidas()` antes, padrão = ABERTA+CONFIRMADA, mapeia para `OcorrenciaResumo { id, categoria, tipo, latitude, longitude, status }` (sem autor) em `…/bo/OcorrenciaBO.java`
- [ ] T027 [US3] Adicionar `GET /ocorrencias?tipo=&status=&bairro=` em `…/controller/OcorrenciaController.java`

## Phase 6: US4 — Pesos dos trechos (P1, MVP)

**Goal**: `GET /rotas` (comum × Caminho Livre) e `GET /trechos/pesos`. **Test**: cenários 6–7, 15–16.

- [ ] T028 [P] [US4] Criar model `Trecho` (distanciaM > 0; origem ≠ destino) e `PreferenciaRota` em `…/model/`
- [ ] T029 [US4] Criar `TrechoDAO` (CRUD + listarComCoordenadas) e `PreferenciaRotaDAO` (listarPorUsuario, salvar) em `…/dao/`
- [ ] T030 [US4] Implementar `TrechoBO.calcularPesos(hora, mobilidadeReduzida, ignorar)` conforme data-model.md: noturno = hora ≥ 19 ou < 6; ocorrências ativas a ≤ 30 m (Haversine) da origem ou destino; ignora categorias em `ignorar`; `bloqueado` quando `mobilidadeReduzida = S` e alguma ocorrência ativa tem categoria com `bloqueiaMobilidade = S`; `peso = distanciaM × (1 + Σ pesos)`; `hora` ausente = hora atual em America/Sao_Paulo — em `…/bo/TrechoBO.java`
- [ ] T031 [US4] Criar `TrechoController` (CRUD `/trechos` + `GET /trechos/pesos?hora=&mobilidadeReduzida=&ignorar=`) em `…/controller/TrechoController.java`
- [ ] T032 [P] [US4] Teste `TrechoBOTest`: sem ocorrência peso = distância; noturno usa pesoNoturno; categoria em `ignorar` não soma; `bloqueiaMobilidade` bloqueia só com mobilidadeReduzida=S; EXPIRADA/RESOLVIDA ignoradas em `api-java/src/test/java/br/com/fiap/caminholivre/bo/TrechoBOTest.java`

- [ ] T052 [US4] Implementar `RotaBO.calcular(origem, destino, hora, mobilidadeReduzida, ignorar)` conforme data-model.md (vértice mais próximo, > 500 m → 422; Dijkstra com `PriorityQueue` por distância e por peso sem bloqueados; `caminhoLivre = null` + `aviso` se não houver caminho) em `…/bo/RotaBO.java`
- [ ] T053 [US4] Criar `RotaController` `GET /rotas?origemLat=&origemLon=&destinoLat=&destinoLon=&hora=&mobilidadeReduzida=&ignorar=` em `…/controller/RotaController.java`; no mesmo commit, adicionar a rota em `api-java/README.md`
- [ ] T054 [P] [US4] Teste `RotaBOTest`: grafo de 4 vértices, comum pega o mais curto, Caminho Livre desvia do trecho pesado, bloqueado sem alternativa → null + aviso em `api-java/src/test/java/br/com/fiap/caminholivre/bo/RotaBOTest.java`

**Checkpoint MVP (backend)**: US1–US4 + deploy (T047) até 15/11.

## Phase 7: US5 — Avaliar 👍/👎 (P2)

**Test**: cenários 8–9.

- [ ] T033 [P] [US5] Criar model `Confirmacao` e `ConfirmacaoDAO` (inserir, existe(idOcorrencia, idUsuario), contar) em `…/model/` e `…/dao/`
- [ ] T034 [US5] Implementar `ConfirmacaoBO.avaliar(usuario, idOcorrencia, confirma)`: 422 se é o autor ou se status ∉ {ABERTA, CONFIRMADA}; 409 se já avaliou; 3 👍 → CONFIRMADA; 3 👎 → RESOLVIDA (contagem pelo total, não saldo; 👎 ≥ 3 prevalece) em `…/bo/ConfirmacaoBO.java`
- [ ] T035 [US5] Adicionar `POST /ocorrencias/{id}/confirmacoes` `{ confirma }` → 201 `{ status, totalConfirma, totalNega }` em `…/controller/OcorrenciaController.java`
- [ ] T036 [P] [US5] Teste `ConfirmacaoBOTest`: autoavaliação 422, duplicada 409, 3ª 👍 confirma, 3ª 👎 resolve, 3 👍 + 3 👎 = RESOLVIDA em `api-java/src/test/java/br/com/fiap/caminholivre/bo/ConfirmacaoBOTest.java`

## Phase 8: US6 — Expiração (P2)

**Test**: cenário 10.

- [ ] T037 [US6] Criar `ExpiracaoJob` com `@Scheduled(cron = "0 0 3 * * *", zone = "America/Sao_Paulo")` chamando `OcorrenciaDAO.expirarVencidas()` (só ABERTA → EXPIRADA) em `…/config/ExpiracaoJob.java`

## Phase 9: US7 — Detalhe e histórico (P2)

- [ ] T038 [US7] Implementar `OcorrenciaBO.detalhar(id, usuarioLogado?)` → `OcorrenciaDetalhe` com totais e `minha`; 404 `"Ocorrência {id} não encontrada"`; e `listarDoUsuario(id)` em `…/bo/OcorrenciaBO.java`; no mesmo commit, documentar `OcorrenciaDetalhe` (com `minha`) em `api-java/README.md`
- [ ] T039 [US7] Adicionar `GET/PUT/DELETE /ocorrencias/{id}` (PUT/DELETE só autor → 403) em `…/controller/OcorrenciaController.java` e `GET /usuarios/{id}/ocorrencias` em `…/controller/UsuarioController.java`

## Phase 10: US8 — Perfil e preferências (P2)

- [ ] T040 [US8] Criar `UsuarioBO` (buscar, listar, atualizar nome/fotoUrl/mobilidadeReduzida; só o próprio usuário → 403) e `PreferenciaBO` (lista todas as categorias com `considerar` padrão S; salva) em `…/bo/`
- [ ] T041 [US8] Criar `UsuarioController` com `GET /usuarios`, `GET/PUT /usuarios/{id}`, `GET/PUT /usuarios/{id}/preferencias` em `…/controller/UsuarioController.java`

## Phase 11: US9 — Ranking de bairros (P2)

- [ ] T042 [US9] Criar `RankingBO.bairros()` (soma de peso_base das ocorrências ativas por bairro; melhores = menor, piores = maior, top 5 cada) e `RankingController` `GET /ranking/bairros` em `…/bo/RankingBO.java` e `…/controller/RankingController.java`

## Phase 12: US10 — Excluir conta (P2)

**Test**: cenário 11.

- [ ] T043 [US10] Implementar `UsuarioBO.excluir(id)` `@Transactional`: anonimiza ocorrências, apaga confirmações, preferências, rotas favoritas e o usuário; adicionar `DELETE /usuarios/{id}` → 204 em `…/bo/UsuarioBO.java` e `…/controller/UsuarioController.java`

## Phase 13: US11 — Pontos, ranking de usuários, rotas favoritas (P3, Could)

- [ ] T051 [US11] Somar pontos: +10 em `OcorrenciaBO.criar` e +2 em `ConfirmacaoBO.avaliar` via `UsuarioDAO.somarPontos` em `…/bo/OcorrenciaBO.java` e `…/bo/ConfirmacaoBO.java`
- [ ] T044 [US11] Adicionar `GET /ranking/usuarios` (nome, fotoUrl, pontos; ordem desc) em `…/bo/RankingBO.java` e `…/controller/RankingController.java`
- [ ] T045 [P] [US11] Criar model `RotaFavorita` (apelido ≤ 60), `RotaFavoritaDAO` em `…/model/` e `…/dao/`
- [ ] T046 [US11] Criar `RotaFavoritaController` `GET/POST /rotas-favoritas`, `DELETE /rotas-favoritas/{id}` (só o dono) em `…/controller/RotaFavoritaController.java`

## Phase 14: Polish

- [ ] T047 Publicar no Render (Docker, env vars do T002) e rodar o cenário 12 do quickstart — **até 15/11**
- [ ] T048 [P] Atualizar `api-java/README.md`: URL do Render e passo a passo de execução (campos do contrato já documentados em T019/T038)
- [ ] T049 [P] Gerar diagrama de classes a partir do `model/` para o PDF da disciplina em `api-java/docs/diagrama-classes.png`
- [ ] T050 Rodar todos os cenários de `specs/001-api-rest-java/quickstart.md` contra o deploy, incluindo a medição de tempo do cenário 13 (SC-001, SC-002)

## Dependencies

- Setup → Foundational → histórias. US1 é pré-requisito de toda rota 🔒 (US2, US5, US7, US8, US10, US11).
- US3 depende de US2 (OcorrenciaDAO). US4 depende de US2 (há ocorrências para pesar). US5–US7 dependem de US2. US10 depende de US5/US8 (tabelas a limpar).
- US9 e US11 só precisam do Foundational + US2.

## Parallel examples

- Foundational: T006, T008, T009–T012, T014, T015 juntos.
- Depois da US2: US3 (T026–T027) ∥ US4 (T028–T032, T052–T054) ∥ US5 (T033–T036).

## Implementation Strategy

1. **MVP (até 15/11)**: Phases 1–6 + T047 — login, enviar alerta, mapa, rota (Dijkstra), no ar no Render.
2. **Demo do pitch**: + US5, US6, US7 (confiança do dado).
3. **Should restante**: US8, US9, US10.
4. **Could**: US11 só se sobrar tempo antes de 19/11 (lembrete: commit após o prazo zera a parte técnica).
