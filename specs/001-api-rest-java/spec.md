# Feature Specification: API REST Caminho Livre (Java)

**Feature Branch**: `001-api-rest-java`

**Created**: 2026-11-12

**Status**: Draft

**Input**: User description: "API REST do Caminho Livre baseada no backlog MoSCoW (agile/backlog.md): login Google, alertas (ocorrências), confirmações, expiração, cálculo da rota acessível (Dijkstra na própria API), perfil, preferências, ranking e exclusão de conta (LGPD)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar com Google e sair (Priority: P1) — US01, US06

O front envia o ID token do Google; a API valida o token, cria o usuário no primeiro acesso (nome, e-mail, foto) e devolve os dados dele. Sair é descartar a sessão no front.

**Why this priority**: Sem identidade não há alerta nem avaliação. Base do MVP.

**Independent Test**: `POST /auth/google` com token válido cria/retorna o usuário; com token inválido retorna 401.

**Acceptance Scenarios**:

1. **Given** um token Google válido de alguém sem conta, **When** chama `POST /auth/google`, **Then** o usuário é criado com nome, e-mail, foto, `pontos = 0`, e é devolvido (201).
2. **Given** um token válido de usuário existente, **When** chama `POST /auth/google`, **Then** devolve o usuário existente sem duplicar (200).
3. **Given** um token inválido ou expirado, **When** chama `POST /auth/google`, **Then** responde 401 no formato de erro padrão.

---

### User Story 2 - Enviar alerta (Priority: P1) — US02

Usuário registra uma ocorrência com categoria e localização (obrigatórias), foto e descrição (opcionais).

**Why this priority**: É o dado que alimenta mapa e rota.

**Independent Test**: `POST /ocorrencias` cria a ocorrência `ABERTA` com expiração em +15 dias.

**Acceptance Scenarios**:

1. **Given** categoria e localização válidas, **When** chama `POST /ocorrencias`, **Then** cria com status `ABERTA`, `dt_expiracao = dt_registro + 15 dias`, e devolve 201.
2. **Given** sem categoria ou sem localização, **When** chama `POST /ocorrencias`, **Then** responde 400 indicando o campo.
3. **Given** categoria inexistente, **When** envia, **Then** responde 404.

---

### User Story 3 - Listar alertas para o mapa (Priority: P1) — US03

Front lista ocorrências ativas com filtros por tipo (ACESSIBILIDADE, SEGURANCA, CLIMA), status e bairro.

**Why this priority**: Mostrar o mapa é o valor visível do MVP.

**Independent Test**: `GET /ocorrencias?tipo=SEGURANCA` devolve só ocorrências ativas desse tipo.

**Acceptance Scenarios**:

1. **Given** ocorrências de vários tipos e status, **When** chama `GET /ocorrencias` sem filtro, **Then** devolve apenas `ABERTA` e `CONFIRMADA`, com categoria, tipo, coordenadas e status, sem identificar o autor.
2. **Given** filtro `tipo=CLIMA`, **When** consulta, **Then** devolve só alagamentos ativos.

---

### User Story 4 - Rota acessível (Priority: P1) — US04, US11

O front pede a rota entre origem e destino; a API pede ao OpenRouteService a rota comum (a pé) e a rota Caminho Livre, que desvia dos alertas relevantes para o horário e o perfil (mobilidade reduzida e categorias ignoradas, sem identificar o usuário — LGPD), por ruas reais de todo o Brasil.

**Why this priority**: Rota que desvia de alertas é o diferencial do produto.

**Independent Test**: `GET /rotas` devolve duas rotas com distâncias; a Caminho Livre desvia do trecho com alerta. `GET /trechos/pesos` expõe os pesos usados (depuração e rubrica).

**Acceptance Scenarios**:

1. **Given** um trecho sem ocorrências próximas, **When** consulta, **Then** peso = distância.
2. **Given** um trecho com ocorrências ativas próximas, **When** consulta às 14h, **Then** peso = `distância × (1 + Σ peso_base)`; às 22h usa `peso_noturno`.
3. **Given** `mobilidadeReduzida=S` e uma ocorrência de categoria com `bloqueia_mobilidade = S` (Degrau, Falta de rampa) no trecho, **When** consulta, **Then** o trecho vem marcado como bloqueado.
4. **Given** `ignorar=<id de Rua escura>` (o front envia as categorias desligadas nas preferências), **When** consulta, **Then** essa categoria não entra na soma.
5. **Given** ocorrências `EXPIRADA` ou `RESOLVIDA`, **When** consulta, **Then** são ignoradas.
6. **Given** origem e destino, **When** `GET /rotas`, **Then** devolve `comum` (menor distância, ignora pesos) e `caminhoLivre` (menor peso, sem trechos bloqueados), cada uma com a lista de pontos e `distanciaM`.
7. **Given** não existe caminho sem trecho bloqueado, **When** `GET /rotas`, **Then** `caminhoLivre` vem `null` com `aviso` em texto simples.

---

### User Story 5 - Avaliar alerta 👍/👎 (Priority: P2) — US07

**Why this priority**: Torna o mapa confiável; recomendado para a demo.

**Independent Test**: três 👍 de usuários distintos levam a ocorrência a `CONFIRMADA`.

**Acceptance Scenarios**:

1. **Given** ocorrência de outro usuário, **When** chama `POST /ocorrencias/{id}/confirmacoes` com `confirma=S`, **Then** registra (201).
2. **Given** o usuário já avaliou, **When** avalia de novo, **Then** responde 409.
3. **Given** a ocorrência é do próprio usuário, **When** avalia, **Then** responde 422 (regra de negócio).
4. **Given** 2 👍, **When** chega a 3ª, **Then** status → `CONFIRMADA`. **Given** 2 👎, **When** chega a 3ª, **Then** status → `RESOLVIDA`. A contagem é pelo total (não saldo): 👎 ≥ 3 resolve mesmo com 👍 ≥ 3.

---

### User Story 6 - Expiração automática (Priority: P2) — US08

**Independent Test**: ocorrência `ABERTA` com `dt_expiracao` no passado passa a `EXPIRADA` após a rotina.

**Acceptance Scenarios**:

1. **Given** ocorrência `ABERTA` vencida, **When** a rotina roda (agendada diariamente e também antes de listar), **Then** status → `EXPIRADA`.
2. **Given** ocorrência `CONFIRMADA` vencida, **When** a rotina roda, **Then** continua `CONFIRMADA`.

---

### User Story 7 - Detalhe e histórico (Priority: P2) — US09, US10

**Acceptance Scenarios**:

1. **Given** uma ocorrência, **When** `GET /ocorrencias/{id}`, **Then** devolve foto, descrição, categoria, data, status, total de 👍 e 👎.
2. **Given** id inexistente, **When** consulta, **Then** 404 `"Ocorrência {id} não encontrada"`.
3. **Given** um usuário, **When** `GET /usuarios/{id}/ocorrencias`, **Then** lista as dele com status e totais.

---

### User Story 8 - Perfil, onboarding e preferências (Priority: P2) — US11, US12, US13

**Acceptance Scenarios**:

1. **When** `PUT /usuarios/{id}` com nome, foto ou `mobilidadeReduzida`, **Then** atualiza e devolve o usuário.
2. **When** `GET /usuarios/{id}/preferencias`, **Then** lista todas as categorias com `considerar` (padrão `S`).
3. **When** `PUT /usuarios/{id}/preferencias`, **Then** grava quais categorias a rota considera.

---

### User Story 9 - Ranking de bairros (Priority: P2) — US14

**Acceptance Scenarios**:

1. **When** `GET /ranking/bairros`, **Then** devolve bairros ordenados por soma de `peso_base` das ocorrências ativas (melhores = menor soma, piores = maior).

---

### User Story 10 - Excluir conta (Priority: P2) — US15

**Acceptance Scenarios**:

1. **When** `DELETE /usuarios/{id}`, **Then** apaga nome, e-mail, foto, google_id, preferências e confirmações pessoais; as ocorrências ficam com `id_usuario = NULL` e continuam no mapa; responde 204.

---

### User Story 11 - Pontos, ranking de usuários e rotas favoritas (Priority: P3) — US16–US19

**Acceptance Scenarios**:

1. **When** o usuário envia um alerta, **Then** ganha +10 pontos; **When** avalia, **Then** +2.
2. **When** `GET /ranking/usuarios`, **Then** devolve usuários por pontos (só nome e foto).
3. **When** `POST/GET/DELETE /rotas-favoritas`, **Then** salva, lista e remove rotas (origem, destino, apelido) do usuário.

### Edge Cases

- Coordenadas fora de faixa (lat ∉ [-90, 90], lon ∉ [-180, 180]) → 400.
- Foto: a API guarda só `foto_url`; upload do arquivo é responsabilidade do front/serviço de imagem.
- Avaliação de ocorrência `EXPIRADA`/`RESOLVIDA` → 422.
- Usuário excluído tentando entrar de novo com Google → nova conta (dados antigos não voltam).
- `ignorar` com id de categoria inexistente → ignorado.
- Origem ou destino sem rua por perto (ex.: no mar) → 422 "Não encontramos uma rua perto da origem ou do destino"; OpenRouteService fora do ar ou sem cota → 503.
- `hora` ausente em `/trechos/pesos` → usa a hora atual do servidor (America/Sao_Paulo).
- Banco indisponível → 503 no formato de erro padrão, sem stack trace.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001** (RF01, RNF06): A API DEVE validar o ID token do Google em `POST /auth/google` e nunca armazenar senha.
- **FR-002** (RF02): No primeiro login, DEVE criar o usuário com nome, e-mail, foto e google_id únicos.
- **FR-003** (RF04, RF05): DEVE criar ocorrências com categoria e localização obrigatórias; foto e descrição opcionais; categorias agrupadas em ACESSIBILIDADE, SEGURANCA, CLIMA.
- **FR-004** (RF07, RF08, RNF10): `GET /ocorrencias` DEVE devolver apenas ocorrências ativas por padrão e aceitar filtros `tipo`, `status`, `bairro`.
- **FR-005a** (RF09, RF11): `GET /rotas` DEVE calcular, pelo OpenRouteService (ruas reais do OpenStreetMap, Brasil inteiro), a rota comum (perfil `foot-walking`) e a rota Caminho Livre, que evita um quadrado de 50 m em volta de cada alerta ativo com peso ≥ 3 na hora pedida (ou com `bloqueia_mobilidade = S` para mobilidade reduzida, que também usa o perfil `wheelchair`), exceto categorias em `ignorar`. Sem caminho que desvie → `caminhoLivre = null` com aviso. (Até 16/11 era Dijkstra sobre a tabela TRECHO, restrito à Av. Paulista; `GET /trechos/pesos` continua disponível.)
- **FR-005** (RF09, RF10, RF17): `GET /trechos/pesos` e `GET /rotas` DEVEM calcular `peso = distância × (1 + Σ pesos ativos próximos)`, com `peso_noturno` entre 19h e 6h, ignorando as categorias de `ignorar` e marcando como bloqueados, quando `mobilidadeReduzida=S`, os trechos com categoria `bloqueia_mobilidade = S`. A rota não recebe nem expõe `idUsuario`.
- **FR-006** (RF12, RF13): DEVE aceitar uma avaliação por usuário por ocorrência, recusar a autoavaliação, e mudar status com 3 👍 (`CONFIRMADA`) ou 3 👎 (`RESOLVIDA`).
- **FR-007** (RF14): DEVE expirar ocorrências `ABERTA` 15 dias após o registro.
- **FR-008** (RF15, RF16): DEVE expor detalhe da ocorrência e o histórico do usuário com totais de 👍/👎.
- **FR-009** (RF18, RF19): DEVE permitir atualizar nome, foto e mobilidade reduzida.
- **FR-010** (RF20): DEVE expor ranking de bairros ponderado pela gravidade.
- **FR-011** (RF21, RNF08): `DELETE /usuarios/{id}` DEVE apagar dados pessoais e anonimizar ocorrências.
- **FR-012** (RNF08): Nenhuma resposta pública de ocorrência DEVE identificar o autor.
- **FR-013**: Todo erro DEVE seguir `{ "timestamp", "status", "erro" }` via `@ControllerAdvice` (400 validação, 401 token, 403 não é o dono, 404 não encontrado, 409 duplicidade, 422 regra de negócio, 503 banco indisponível).
- **FR-014** (RNF12): DEVE oferecer CRUD (GET/POST/PUT/DELETE) para categorias, localizações, ocorrências e trechos, organizado em model/repository/service/controller.
- **FR-015** (RF22–RF24, Could): DEVE somar pontos (+10 alerta, +2 avaliação), expor ranking de usuários e CRUD de rotas favoritas.
- **FR-016** (RNF07): DEVE ter CORS liberado apenas para o domínio do front (Vercel) e localhost em desenvolvimento.

### Key Entities

- **Usuario**: id, nome, email, google_id, mobilidade_reduzida, foto_url, pontos, dt_cadastro.
- **CategoriaOcorrencia**: id, nome, tipo (ACESSIBILIDADE/SEGURANCA/CLIMA), peso_base, peso_noturno, bloqueia_mobilidade (S/N).
- **Localizacao**: id, latitude, longitude, logradouro, bairro.
- **Ocorrencia**: id, usuario (opcional), categoria, localizacao, descricao, foto_url, status, dt_registro, dt_expiracao.
- **Confirmacao**: ocorrencia, usuario, confirma (S/N), dt_confirmacao; única por (ocorrência, usuário).
- **PreferenciaRota**: usuario, categoria, considerar.
- **Trecho**: origem, destino (Localizacao), distancia_m, iluminado.
- **RotaFavorita** *(Could)*: usuario, origem, destino, apelido, dt_criacao.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `GET /ocorrencias` responde em ≤ 1 s com a carga de demonstração, permitindo mapa em ≤ 3 s (RNF09).
- **SC-002**: `GET /rotas` responde em ≤ 2 s, permitindo rota em ≤ 5 s no front (RNF09).
- **SC-003**: 100% dos endpoints da tabela de contrato respondem no deploy do Render antes de 15/11.
- **SC-004**: 100% dos erros seguem o formato padrão (nenhum stack trace exposto).
- **SC-005**: Após excluir a conta, nenhuma consulta devolve nome, e-mail ou foto daquele usuário.

## Assumptions

- Sessão: após `POST /auth/google`, o front guarda o usuário; as chamadas seguintes enviam o ID token do Google no header `Authorization: Bearer`, revalidado pela API (sem JWT próprio). Em GETs públicos o token é opcional e serve só para calcular `minha`.
- Origem/destino são ligados ao vértice (`LOCALIZACAO` de trecho) mais próximo; o grafo é não direcionado.
- O algoritmo em Python (Dynamic Programming) é entrega isolada e não consome esta API.
- "Ocorrência próxima" de um trecho = localização da ocorrência a até 30 m da origem ou do destino do trecho.
- Fuso horário America/Sao_Paulo para regra noturna e expiração.
- Pesos das categorias vêm da carga inicial do banco.
- Upload de imagem fica fora da API (front envia para storage e manda a URL).
- US20 (trajeto em tempo real), US21 e US22 estão fora desta spec.
