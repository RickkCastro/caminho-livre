# Graph Report - caminho-livre  (2026-11-16)

## Corpus Check
- 185 files · ~84,910 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: (none) 7, .css 2, .properties 2)

## Summary
- 1266 nodes · 2817 edges · 85 communities (56 shown, 29 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 169 edges (avg confidence: 0.86)
- Token cost: 1,040,542 input · 4,099 output

## Graph Freshness
- Built from commit: `5084e461`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Casos de uso e atores
- Contrato REST da API
- Caminho Livre Constitution
- nova/page.tsx
- usecase.js
- steps
- common.ps1
- Briefing da GS CitizenTech
- Tabela OCORRENCIA
- Ficha CitizenTech e rede
- Front: telas e sessão
- Tasks: [FEATURE NAME]
- Ciclo de vida da ocorrência
- LGPD: login e exclusão
- Entregáveis de Agile
- speckit-analyze/SKILL.md
- Front: sessão e usuário
- Entregáveis Banco e Java
- Front: envio com foto
- Front: rota e endereço
- Exclusão de conta
- Erro padrão
- Vídeo 3D
- Entregável AR-VR
- Entregável Data Science
- Entregável Dynamic Programming
- Research da API
- Checklist de qualidade
- Tipo Categoria
- Tipo OcorrenciaDetalhe
- Tipo OcorrenciaResumo
- Tipo Preferencia
- Tipo Rota
- front-next/package.json
- compilerOptions
- Execution Steps
- index.ts
- Feature Specification: [FEATURE NAME]
- AuthService
- speckit-plan/SKILL.md
- speckit-specify/SKILL.md
- speckit-tasks/SKILL.md
- Core Principles
- BuscaEndereco.tsx
- Implementation Plan: [FEATURE]
- speckit-checklist/SKILL.md
- Trecho
- speckit-clarify/SKILL.md
- speckit-implement/SKILL.md
- MapaLeaflet.tsx
- speckit-constitution/SKILL.md
- MapaLeaflet.tsx
- PaginaNovaOcorrencia
- [CHECKLIST TYPE] Checklist: [FEATURE NAME]
- CLAUDE.md
- .claude/CLAUDE.md
- postcss.config.mjs
- Backlog MoSCoW (22 historias, 81 SP)
- Mapa colaborativo de alertas
- Tabela de endpoints (contrato com o front)
- .criar
- GoogleTokenFilter.java
- org.junit.jupiter.api.Test
- RankingController
- Localizacao
- CategoriaOcorrencia
- RecursoNaoEncontradoException
- tipos.ts
- lib/sessao.ts
- Usuario
- OcorrenciaRepository
- OcorrenciaServiceTest.java
- Localizacao
- PerfilServiceTest
- .entrar
- Dicionário de dados — Caminho Livre
- RotaService.java
- CaminholivreApplication.java
- Modelos — Caminho Livre
- ranking/page.tsx
- br.com:caminholivre

## God Nodes (most connected - your core abstractions)
1. `Usuario` - 89 edges
2. `Ocorrencia` - 39 edges
3. `Localizacao` - 37 edges
4. `OcorrenciaRepository` - 31 edges
5. `CategoriaOcorrencia` - 30 edges
6. `UsuarioRepository` - 29 edges
7. `StatusOcorrencia` - 26 edges
8. `OcorrenciaService` - 26 edges
9. `Diagrama de Casos de Uso - Caminho Livre` - 26 edges
10. `api()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Camadas controller → service → repository` --references--> `GlobalExceptionHandler`  [INFERRED]
  api-java/caminholivre-backend/docs/diagrama-classes.md → api-java/caminholivre-backend/src/main/java/br/com/caminholivre/exception/GlobalExceptionHandler.java
- `Postes inteligentes (sensores de luminosidade)` --conceptually_related_to--> `Tabela OCORRENCIA`  [INFERRED]
  network/README.md → database/README.md
- `Rota acessivel desviando de alertas` --conceptually_related_to--> `Calculo de rota Dijkstra (GET /rotas)`  [INFERRED]
  README.md → .specify/memory/constitution.md
- `Caminho Livre (project README)` --references--> `Backlog MoSCoW (agile/backlog.md)`  [EXTRACTED]
  README.md → .specify/memory/constitution.md
- `Caminho Livre (project README)` --references--> `Backlog MoSCoW (22 historias, 81 SP)`  [EXTRACTED]
  README.md → agile/backlog.md

## Import Cycles
- 2-file cycle: `front-next/src/lib/api.ts -> front-next/src/lib/sessao.ts -> front-next/src/lib/api.ts`

## Hyperedges (group relationships)
- **Personas que orientam o backlog** — agile_agile_gs_caminholivre_persona_dona_marta, agile_agile_gs_caminholivre_persona_julia, agile_agile_gs_caminholivre_persona_seu_antonio [EXTRACTED 1.00]
- **Modelo de dados do Caminho Livre** — database_readme_usuario, database_readme_categoria_ocorrencia, database_readme_localizacao, database_readme_ocorrencia, database_readme_confirmacao, database_readme_preferencia_rota, database_readme_trecho [EXTRACTED 1.00]
- **Seven disciplines, one CitizenTech project** — docs_gs_citizentech_2es_fev_fiap_2026_agile, docs_gs_citizentech_2es_fev_fiap_2026_arvr, docs_gs_citizentech_2es_fev_fiap_2026_data_science, docs_gs_citizentech_2es_fev_fiap_2026_database_design, docs_gs_citizentech_2es_fev_fiap_2026_ddd_java, docs_gs_citizentech_2es_fev_fiap_2026_dynamic_programming, docs_gs_citizentech_2es_fev_fiap_2026_network [EXTRACTED 1.00]
- **Front-end External Integrations** — specs_002_front_next_web_research_google_identity, specs_002_front_next_web_research_nominatim, specs_002_front_next_web_plan_vercel_blob, specs_002_front_next_web_research_leaflet [EXTRACTED 1.00]
- **Front-end MVP Core Flow** — front_next_app_page, front_next_app_login_page, front_next_app_ocorrencias_nova_page, front_next_app_rota_page [EXTRACTED 1.00]
- **Calculo de rota ponderada** — api_java_readme_get_rotas, api_java_readme_trechos_pesos, database_readme_trecho, api_java_readme_regras_negocio_bo [INFERRED 0.85]
- **Client-Side Data Persistence** — specs_002_front_next_web_data_model_sessao, specs_002_front_next_web_data_model_nova_ocorrencia, specs_002_front_next_web_plan_vercel_blob [INFERRED 0.85]
- **spec-kit specify-plan-tasks-implement workflow** — _specify_memory_constitution_workflow [INFERRED 0.85]
- **Calculo de rota acessivel** — specs_001_api_rest_java_contracts_api_get_rotas, specs_001_api_rest_java_data_model_rotabo, specs_001_api_rest_java_data_model_peso_trecho, specs_001_api_rest_java_research_haversine_30m, specs_001_api_rest_java_research_dijkstra_na_api [INFERRED 0.85]

## Communities (85 total, 29 thin omitted)

### Community 0 - "Casos de uso e atores"
Cohesion: 0.15
Nodes (27): Ator: Administrador (Won't), Diagrama de Casos de Uso - Caminho Livre, Sistema externo: Google, Ator: Sistema, UC01 Entrar com Google (Must), UC02 Validar token no Google, UC03 Responder onboarding de perfil (Should), UC04 Sair da conta (Must) (+19 more)

### Community 1 - "Contrato REST da API"
Cohesion: 0.07
Nodes (27): Specification Quality Checklist, API Java Contract, Contrato REST API Caminho Livre, Erro padrao {timestamp,status,erro}, GET /rotas, GET /trechos/pesos, OcorrenciaDetalhe.minha flag, /ocorrencias endpoints (+19 more)

### Community 2 - "Caminho Livre Constitution"
Cohesion: 0.12
Nodes (11): Caminho Livre Constitution, Backlog MoSCoW (agile/backlog.md), API Java README (endpoints), Database README (DER), Calculo de rota Dijkstra (GET /rotas), Rota acessivel desviando de alertas, Arquitetura Next.js -> Spring Boot -> Oracle, Caminho Livre (project README) (+3 more)

### Community 3 - "nova/page.tsx"
Cohesion: 0.29
Nodes (15): PaginaMinhas(), PaginaDetalhe(), avaliar(), PaginaOnboarding(), responder(), PaginaPerfil(), tentar(), Aviso() (+7 more)

### Community 4 - "usecase.js"
Cohesion: 0.05
Nodes (34): build(), CSS, fs, { mdToPdf }, OUT, path, SRC, dependencies (+26 more)

### Community 5 - "steps"
Cohesion: 0.05
Nodes (37): args, inputs, integration, spec, speckit_review_plan_verdict, speckit_review_spec_verdict, default, prompt (+29 more)

### Community 6 - "common.ps1"
Cohesion: 0.16
Nodes (19): Find-SpecifyRoot(), Format-SpecKitCommand(), Get-CurrentBranch(), Get-FeaturePathsEnv(), Get-InvokeSeparator(), Get-NormalizedPriority(), Get-Python3Command(), Get-RepoRoot() (+11 more)

### Community 7 - "Briefing da GS CitizenTech"
Cohesion: 0.15
Nodes (13): Be My Eyes (caso de referencia), Casos: hackathon UNICEF Salvador, Aqualuz (UNESCO), CitizenTech - Tecnologia para pessoas, CitizenTech Studio (QR - descubra sua ideia), Problema: desperdicio de alimentos e fome, Global Solution 2026.2 (FIAP), Problema: mobilidade urbana e acessibilidade, ODS (Objetivos de Desenvolvimento Sustentavel) (+5 more)

### Community 8 - "Tabela OCORRENCIA"
Cohesion: 0.21
Nodes (11): Analise Data Science (teste de hipotese), Fontes publicas (SSP-SP, SP156, GeoSampa, OSM), Tabela CATEGORIA_OCORRENCIA, Tabela CONFIRMACAO, Tabela LOCALIZACAO, Tabela OCORRENCIA, Tabela PREFERENCIA_ROTA, Tabela ROTA_FAVORITA (Could) (+3 more)

### Community 9 - "Ficha CitizenTech e rede"
Cohesion: 0.22
Nodes (7): GS CitizenTech Briefing (2ES Fev 2026), Accessible Sidewalks Starting Point, CitizenTech, Ficha da CitizenTech (README header), Network Architect Solutions deliverable (Packet Tracer, VLANs, NAT, ACL), UN SDGs (ODS 2,3,4,9,10,11,13), GS Rules (deadline 19/11 23h55, up to 5 students)

### Community 10 - "Front: telas e sessão"
Cohesion: 0.25
Nodes (8): API REST Java (001), Login Page (/login), Home Page (/), Map Component, API Client, Session Management, Google Identity Services, Feature Specification: Front-end web Caminho Livre (Next.js)

### Community 11 - "Tasks: [FEATURE NAME]"
Cohesion: 0.07
Nodes (26): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation for User Story 1, Implementation for User Story 2, Implementation for User Story 3, Implementation Strategy, Incremental Delivery, MVP First (User Story 1 Only) (+18 more)

### Community 14 - "Entregáveis de Agile"
Cohesion: 0.67
Nodes (3): Agile Methodology With Squad Framework deliverable, Product Backlog with MoSCoW and Planning Poker, Video Pitch (max 3 min, YouTube)

### Community 15 - "speckit-analyze/SKILL.md"
Cohesion: 0.08
Nodes (25): 1. Initialize Analysis Context, 2. Load Artifacts (Progressive Disclosure), 3. Build Semantic Models, 4. Detection Passes (Token-Efficient Analysis), 5. Severity Assignment, 6. Produce Compact Analysis Report, 7. Provide Next Actions, 8. Offer Remediation (+17 more)

### Community 16 - "Front: sessão e usuário"
Cohesion: 0.67
Nodes (3): Sessao, Usuario, Google Identity Services

### Community 35 - "front-next/package.json"
Cohesion: 0.06
Nodes (38): react-dom@19.1.0, devDependencies, @axe-core/playwright@^4.14.0, eslint@^9, eslint-config-next@15.5.29, @eslint/eslintrc@^3, @playwright/test@^1.65.0, tailwindcss@^4 (+30 more)

### Community 36 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 37 - "Execution Steps"
Cohesion: 0.12
Nodes (15): 1. Initialize Convergence Context, 2. Load Artifacts (Progressive Disclosure), 3. Build the Intent Inventory, 4. Assess the Codebase and Classify Findings, 5. Assign Severity, 6. Present the In-Session Findings Summary, 7. Append Convergence Tasks (or report converged), 8. Provide Next Actions (Handoff) (+7 more)

### Community 38 - "index.ts"
Cohesion: 0.14
Nodes (8): OcorrenciaDetalhe, Preferencia, avaliadas, detalhes, erro(), mock(), preferencias, usuario

### Community 39 - "Feature Specification: [FEATURE NAME]"
Cohesion: 0.15
Nodes (12): Assumptions, Edge Cases, Feature Specification: [FEATURE NAME], Functional Requirements, Key Entities *(include if feature involves data)*, Measurable Outcomes, Requirements *(mandatory)*, Success Criteria *(mandatory)* (+4 more)

### Community 40 - "AuthService"
Cohesion: 0.08
Nodes (6): ExpiracaoJob, GoogleTokenFilter, AuthController, ConfirmacaoRequest, LoginRequest, AuthService

### Community 41 - "speckit-plan/SKILL.md"
Cohesion: 0.18
Nodes (10): Completion Report, Done When, Key rules, Mandatory Post-Execution Hooks, Outline, Phase 0: Outline & Research, Phase 1: Design & Contracts, Phases (+2 more)

### Community 42 - "speckit-specify/SKILL.md"
Cohesion: 0.18
Nodes (10): Completion Report, Done When, For AI Generation, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, Quick Guidelines, Section Requirements (+2 more)

### Community 43 - "speckit-tasks/SKILL.md"
Cohesion: 0.18
Nodes (10): Checklist Format (REQUIRED), Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Phase Structure, Pre-Execution Checks, Task Generation Rules (+2 more)

### Community 44 - "Core Principles"
Cohesion: 0.18
Nodes (10): Core Principles, Governance, [PRINCIPLE_1_NAME], [PRINCIPLE_2_NAME], [PRINCIPLE_3_NAME], [PRINCIPLE_4_NAME], [PRINCIPLE_5_NAME], [PROJECT_NAME] Constitution (+2 more)

### Community 45 - "BuscaEndereco.tsx"
Cohesion: 0.15
Nodes (16): Lugar, PaginaRota(), tocar(), verRota(), BuscaEndereco(), cache, Lugar, MINHA_LOCALIZACAO (+8 more)

### Community 46 - "Implementation Plan: [FEATURE]"
Cohesion: 0.22
Nodes (8): Complexity Tracking, Constitution Check, Documentation (this feature), Implementation Plan: [FEATURE], Project Structure, Source Code (repository root), Summary, Technical Context

### Community 47 - "speckit-checklist/SKILL.md"
Cohesion: 0.25
Nodes (7): Anti-Examples: What NOT To Do, Checklist Purpose: "Unit Tests for English", Example Checklist Types & Sample Items, Execution Steps, Post-Execution Checks, Pre-Execution Checks, User Input

### Community 48 - "Trecho"
Cohesion: 0.11
Nodes (7): TrechoController, TrechoPeso, Vertice, TrechoRequest, Trecho, TrechoRepository, TrechoService

### Community 49 - "speckit-clarify/SKILL.md"
Cohesion: 0.29
Nodes (6): Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, User Input

### Community 50 - "speckit-implement/SKILL.md"
Cohesion: 0.29
Nodes (6): Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, User Input

### Community 51 - "MapaLeaflet.tsx"
Cohesion: 0.11
Nodes (17): nextConfig, dependencies, google-auth-library@^11.3.4, lucide-react@^1.72.0, next@15.5.29, react@19.1.0, @vercel/blob@^2.9.0, google (+9 more)

### Community 52 - "speckit-constitution/SKILL.md"
Cohesion: 0.33
Nodes (5): Outline, Post-Execution Checks, Pre-Execution Checks, Scope Guard, User Input

### Community 53 - "MapaLeaflet.tsx"
Cohesion: 0.19
Nodes (13): leaflet@^1.9.4, react-leaflet@^5.0.0, CENTRO, Controle(), MapaLeaflet(), pino(), Props, escapar() (+5 more)

### Community 54 - "PaginaNovaOcorrencia"
Cohesion: 0.32
Nodes (6): PaginaNovaOcorrencia(), enviar(), escolherFoto(), Passo(), enviarFoto(), reduzirFoto()

### Community 55 - "[CHECKLIST TYPE] Checklist: [FEATURE NAME]"
Cohesion: 0.40
Nodes (4): [Category 1], [Category 2], [CHECKLIST TYPE] Checklist: [FEATURE NAME], Notes

### Community 59 - "Backlog MoSCoW (22 historias, 81 SP)"
Cohesion: 0.22
Nodes (10): Diagrama de casos de uso UC01-UC22, Agile GS Caminho Livre (documento de entrega), Escopo do MVP (Must US01-US06, 32 SP), ODS 3, 9, 10, 11, Backlog MoSCoW (22 historias, 81 SP), Planning Poker (Fibonacci, referencia US06), Requisitos nao funcionais RNF01-RNF12, Entregaveis Agile (PDF unico, prototipo, pitch) (+2 more)

### Community 60 - "Mapa colaborativo de alertas"
Cohesion: 0.20
Nodes (8): Mapa colaborativo de alertas, Persona Dona Marta, Persona Julia, Problema: pedestres sem informacao de calcadas e ruas, Calculo de rota Dijkstra na API Java (GET /rotas), Matriz de rastreabilidade (historia-requisito-endpoint-tabela), Requisitos funcionais RF01-RF25, Status de alerta CONFIRMADA/RESOLVIDA/EXPIRADA

### Community 61 - "Tabela de endpoints (contrato com o front)"
Cohesion: 0.25
Nodes (7): POST /auth/google, GET /rotas (Dijkstra na API), Tabela de endpoints (contrato com o front), GET /trechos/pesos, Front-end Next.js Caminho Livre, React Leaflet + OpenStreetMap, Mocks em src/mocks no formato da API

### Community 62 - ".criar"
Cohesion: 0.14
Nodes (5): RotaFavoritaController, RotaFavoritaRequest, RotaFavorita, RotaFavoritaService, RotaFavoritaServiceTest

### Community 63 - "GoogleTokenFilter.java"
Cohesion: 0.14
Nodes (6): Camada model (entidades JPA = tabelas do Oracle), Camadas controller → service → repository, Diagrama de classes — Caminho Livre API, ConflitoException, ErroResponse, GlobalExceptionHandler

### Community 64 - "org.junit.jupiter.api.Test"
Cohesion: 0.05
Nodes (20): OcorrenciaController, NovaOcorrenciaRequest, OcorrenciaDetalhe, OcorrenciaResumo, TotaisResponse, Ocorrencia, StatusOcorrencia, ABERTA (+12 more)

### Community 67 - "Localizacao"
Cohesion: 0.20
Nodes (3): Confirmacao, Chave, PreferenciaRota

### Community 69 - "CategoriaOcorrencia"
Cohesion: 0.11
Nodes (7): CategoriaController, Bairro, RankingBairros, CategoriaOcorrencia, CategoriaRepository, CategoriaService, RankingServiceTest

### Community 70 - "RecursoNaoEncontradoException"
Cohesion: 0.18
Nodes (6): UsuarioController, RecursoNaoEncontradoException, PreferenciaRotaRepository, RotaFavoritaRepository, PreferenciaService, UsuarioService

### Community 72 - "tipos.ts"
Cohesion: 0.19
Nodes (15): Totais, Rascunho, PaginaMapa(), FiltroTipos(), FormaTipo(), CHAVE_RASCUNHO, Categoria, ErroApi (+7 more)

### Community 73 - "lib/sessao.ts"
Cohesion: 0.23
Nodes (18): LogoGoogle(), PaginaLogin(), api(), avisarAcordando(), USA_MOCKS, assinar(), botaoGoogle(), carregarGoogle() (+10 more)

### Community 75 - "Usuario"
Cohesion: 0.17
Nodes (3): UsuarioPublico, UsuarioResponse, Usuario

### Community 76 - "OcorrenciaRepository"
Cohesion: 0.24
Nodes (6): ConfirmacaoRepository, LocalizacaoRepository, OcorrenciaRepository, UsuarioRepository, ConfirmacaoService, RankingService

### Community 77 - "OcorrenciaServiceTest.java"
Cohesion: 0.14
Nodes (3): AcessoNegadoException, NaoAutorizadoException, RegraNegocioException

### Community 78 - "Localizacao"
Cohesion: 0.12
Nodes (3): LocalizacaoController, Localizacao, LocalizacaoService

### Community 79 - "PerfilServiceTest"
Cohesion: 0.22
Nodes (3): AtualizarUsuarioRequest, PreferenciaDto, PerfilServiceTest

### Community 81 - "Dicionário de dados — Caminho Livre"
Cohesion: 0.17
Nodes (12): CATEGORIA_OCORRENCIA, CONFIRMACAO, Dicionário de dados — Caminho Livre, LOCALIZACAO, Normalização, Objetos auxiliares, OCORRENCIA, PREFERENCIA_ROTA (+4 more)

### Community 84 - "RotaService.java"
Cohesion: 0.06
Nodes (14): CorsConfig, RotaController, Ponto, RotaResponse, Trajeto, Detalhe, Feature, Geometria (+6 more)

### Community 86 - "Modelos — Caminho Livre"
Cohesion: 0.18
Nodes (10): API RESTful Spring Boot (Caminho Livre), Deploy no Render, 1. Modelo conceitual, 2. Modelo lógico, 3. Modelo físico (Oracle), Modelos — Caminho Livre, Modelo relacional Caminho Livre (Oracle), ACL estendida, SSH e WPA2 (+2 more)

### Community 87 - "ranking/page.tsx"
Cohesion: 0.50
Nodes (4): Lista(), PaginaRanking(), Pessoa, RankingBairros

## Knowledge Gaps
- **88 isolated node(s):** `ABERTA`, `CONFIRMADA`, `EXPIRADA`, `RESOLVIDA`, `ACESSIBILIDADE` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 470 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Usuario` connect `Usuario` to `org.junit.jupiter.api.Test`, `RankingController`, `Localizacao`, `CategoriaOcorrencia`, `RecursoNaoEncontradoException`, `AuthService`, `list`, `OcorrenciaRepository`, `OcorrenciaServiceTest.java`, `Localizacao`, `PerfilServiceTest`, `Trecho`, `.entrar`, `.criar`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `ABERTA`, `CONFIRMADA`, `EXPIRADA` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Casos de uso e atores` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._
- **Why does `RotaService` connect `RotaService.java` to `AuthService`, `RecursoNaoEncontradoException`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Should `Contrato REST da API` be split into smaller, more focused modules?**
  _Cohesion score 0.07007575757575757 - nodes in this community are weakly interconnected._
- **Why does `Localizacao` connect `Localizacao` to `org.junit.jupiter.api.Test`, `Localizacao`, `CategoriaOcorrencia`, `RecursoNaoEncontradoException`, `AuthService`, `list`, `OcorrenciaRepository`, `OcorrenciaServiceTest.java`, `Trecho`, `RotaService.java`, `.criar`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Should `Caminho Livre Constitution` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._