# Graph Report - caminho-livre  (2026-11-18)

## Corpus Check
- 360 files · ~205,202 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 38 file(s) not represented in the graph (top: (none) 14, .csv 11, .css 2)

## Summary
- 2426 nodes · 5116 edges · 172 communities (129 shown, 43 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 296 edges (avg confidence: 0.88)
- Token cost: 1,040,542 input · 4,099 output

## Graph Freshness
- Built from commit: `b005b51b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Casos de uso e atores
- 🧮 Dynamic Programming — Caminho Livre
- Caminho Livre Constitution
- nova/page.tsx
- usecase.js
- steps
- common.ps1
- Briefing da GS CitizenTech
- Dados: fontes, extratos e dicionário
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
- ✅ Checklist da entrega — GS 2026.2 · Caminho Livre
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
- devDependencies
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
- Localizacao
- speckit-clarify/SKILL.md
- speckit-implement/SKILL.md
- MapaLeaflet.tsx
- speckit-constitution/SKILL.md
- tipos.ts
- nova/page.tsx
- [CHECKLIST TYPE] Checklist: [FEATURE NAME]
- CLAUDE.md
- .claude/CLAUDE.md
- postcss.config.mjs
- Backlog MoSCoW (22 historias, 81 SP)
- Mapa colaborativo de alertas
- Tabela de endpoints (contrato com o front)
- frases.py
- GoogleTokenFilter.java
- ed-mapa
- Demo.tsx
- OcorrenciaService
- remotion/package.json
- grafo.py
- CategoriaOcorrencia
- Localizacao
- org.junit.jupiter.api.Test
- Grafo
- lib/sessao.ts
- list
- ed-animar
- org.springframework.transaction.annotation.Transactional
- main.py
- RotaFavorita
- PerfilServiceTest
- Rota
- Dicionário de dados — Caminho Livre
- Network Architect Solutions — Relatório da rede do Posto Caminho Livre
- RotaService
- CaminholivreApplication.java
- Modelos — Caminho Livre
- Perfil
- br.com:caminholivre
- ed-assets
- .do_mapa
- ed-som
- gerar_extratos.py
- Casca.tsx
- ed-cortes
- ed-preparar
- Ofício de motion
- ref_cenas.py
- Database_GS_CaminhoLivre.md
- ed-iniciar
- fluxo-de-edicao
- gerar_som.py
- Decisões da entrevista
- Princípios do fluxo
- Etapa 4: motion-mapa (o plano das animações)
- @playwright/test
- 9. Testes de comunicação
- ver.py
- Estilo de motion — caminho-livre
- Roteiro v02 — pitch do Caminho Livre (tom de conversa)
- Contrato REST API Caminho Livre
- Regras comuns das skills ed-*
- transcrever_scribe.py
- 6. Serviços implementados
- Plano das cenas v01
- Montagem do fluxo de edição
- prints_app.mjs
- Roteiro v01 — pitch do Caminho Livre
- Fluxo de edição com o Claude Code
- remotion-base/package.json
- Fala no tempo da narração limpa
- Frases da narração
- sys
- Etapa 5: assets
- Etapa 7: câmera
- Referências e perfil
- Identidade visual — caminho-livre
- GET /rotas
- Entrega no programa de edição (ou o vídeo pronto)
- Etapa 3: cortes
- Etapa 6: motion-render
- Etapa 8: sfx (efeitos sonoros)
- pathlib
- Briefing — pitch do Caminho Livre
- Next.js App Router
- POST /auth/google
- editar
- Construir animações no HyperFrames
- scripts
- Diagrama de classes — Caminho Livre API
- CaminholivreApplicationTests.java
- Etapas 1 e 2: iniciar e preparar
- Modelo: estado do vídeo e o script de estado
- Modelo: perfil
- json
- Estilo de som — caminho-livre
- Estilo de cortes — caminho-livre
- Síntese das referências (2026-11-17)
- modelos/montagem.md
- modelos/regras-comuns.md
- skill-etapa.md
- skill-mestra.md
- compilerOptions
- inventario.md
- catalogo.md
- compilerOptions
- front-next/package.json
- som_gravar.py
- mais_segura_forca_bruta
- animar_dados.py
- CorsConfig.java
- mapa_fala.py
- assets_buscar.py
- Remotion video
- Remotion video
- YouTube: título e descrição do pitch
- @types/leaflet@^1.9.22
- creditos.md

## God Nodes (most connected - your core abstractions)
1. `Usuario` - 89 edges
2. `Grafo` - 51 edges
3. `ip()` - 48 edges
4. `Ocorrencia` - 44 edges
5. `Localizacao` - 34 edges
6. `OcorrenciaRepository` - 34 edges
7. `Perfil` - 34 edges
8. `CategoriaOcorrencia` - 31 edges
9. `gat()` - 31 edges
10. `Camera()` - 30 edges

## Surprising Connections (you probably didn't know these)
- `Scripts` --references--> `noMundo()`  [INFERRED]
  .claude/skills/ed-animar/SKILL.md → pitch/edicao/remotion/src/cenas/Demo.tsx
- `Scripts` --references--> `status()`  [INFERRED]
  .claude/skills/ed-iniciar/SKILL.md → pitch/fluxo/scripts/ver.py
- `Camadas controller → service → repository` --references--> `GlobalExceptionHandler`  [INFERRED]
  api-java/caminholivre-backend/docs/diagrama-classes.md → api-java/caminholivre-backend/src/main/java/br/com/caminholivre/exception/GlobalExceptionHandler.java
- ``sp156_rua_e_bairro_2025.csv.gz`` --references--> `Status`  [INFERRED]
  data-science/dados/README.md → front-next/src/lib/tipos.ts
- `main()` --indirect_call--> `f()`  [INFERRED]
  pitch/fluxo/scripts/ref_cenas.py → dynamic-programming/memo.py

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

## Communities (172 total, 43 thin omitted)

### Community 0 - "Casos de uso e atores"
Cohesion: 0.15
Nodes (27): Ator: Administrador (Won't), Diagrama de Casos de Uso - Caminho Livre, Sistema externo: Google, Ator: Sistema, UC01 Entrar com Google (Must), UC02 Validar token no Google, UC03 Responder onboarding de perfil (Should), UC04 Sair da conta (Must) (+19 more)

### Community 1 - "🧮 Dynamic Programming — Caminho Livre"
Cohesion: 0.15
Nodes (13): 10. Ligação com o restante do projeto, 11. Como gerar o ZIP da entrega, 1. O problema, 3. Eficiência (medições), 4. Funcionalidades implementadas, 5. Como executar, 6. Exemplos de entrada e saída, 7. Testes (+5 more)

### Community 2 - "Caminho Livre Constitution"
Cohesion: 0.12
Nodes (11): Caminho Livre Constitution, Backlog MoSCoW (agile/backlog.md), API Java README (endpoints), Database README (DER), Calculo de rota Dijkstra (GET /rotas), Rota acessivel desviando de alertas, Arquitetura Next.js -> Spring Boot -> Oracle, Caminho Livre (project README) (+3 more)

### Community 3 - "nova/page.tsx"
Cohesion: 0.27
Nodes (14): PaginaMinhas(), PaginaDetalhe(), avaliar(), PaginaOnboarding(), responder(), PaginaPerfil(), tentar(), Botao() (+6 more)

### Community 4 - "usecase.js"
Cohesion: 0.05
Nodes (34): [arg, ROTULO = 'Agile'], build(), CSS, fs, { mdToPdf }, OUT, path, dependencies (+26 more)

### Community 5 - "steps"
Cohesion: 0.05
Nodes (37): args, inputs, integration, spec, speckit_review_plan_verdict, speckit_review_spec_verdict, default, prompt (+29 more)

### Community 6 - "common.ps1"
Cohesion: 0.16
Nodes (19): Find-SpecifyRoot(), Format-SpecKitCommand(), Get-CurrentBranch(), Get-FeaturePathsEnv(), Get-InvokeSeparator(), Get-NormalizedPriority(), Get-Python3Command(), Get-RepoRoot() (+11 more)

### Community 7 - "Briefing da GS CitizenTech"
Cohesion: 0.15
Nodes (13): Be My Eyes (caso de referencia), Casos: hackathon UNICEF Salvador, Aqualuz (UNESCO), CitizenTech - Tecnologia para pessoas, CitizenTech Studio (QR - descubra sua ideia), Problema: desperdicio de alimentos e fome, Global Solution 2026.2 (FIAP), Problema: mobilidade urbana e acessibilidade, ODS (Objetivos de Desenvolvimento Sustentavel) (+5 more)

### Community 8 - "Dados: fontes, extratos e dicionário"
Cohesion: 0.08
Nodes (26): Conclusão · Data Science & Statistical Computing, Impactos esperados, Limitações, Perguntas, modelos e resultados, Recomendações de ações, Arquivos desta pasta, Como reproduzir, Dados: fontes, extratos e dicionário (+18 more)

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

### Community 24 - "✅ Checklist da entrega — GS 2026.2 · Caminho Livre"
Cohesion: 0.15
Nodes (11): Video 3D CitizenTech (AR-VR), 🧭 Agile Methodology With Squad Framework, 🥽 AR-VR Modelling And Simulation, ✅ Checklist da entrega — GS 2026.2 · Caminho Livre, 📊 Data Science & Statistical Computing — 🟢 pronto, falta enviar, 🗄️ Database Design — 🟢 pronto, falta enviar, ☕ Domain Driven Design – Java, 🧮 Dynamic Programming — 🟢 pronto, falta enviar (+3 more)

### Community 35 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, eslint@^9, eslint-config-next@15.5.29, @eslint/eslintrc@^3, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, eslint (+5 more)

### Community 36 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 37 - "Execution Steps"
Cohesion: 0.12
Nodes (15): 1. Initialize Convergence Context, 2. Load Artifacts (Progressive Disclosure), 3. Build the Intent Inventory, 4. Assess the Codebase and Classify Findings, 5. Assign Severity, 6. Present the In-Session Findings Summary, 7. Append Convergence Tasks (or report converged), 8. Provide Next Actions (Handoff) (+7 more)

### Community 38 - "index.ts"
Cohesion: 0.15
Nodes (7): Preferencia, avaliadas, detalhes, erro(), mock(), preferencias, usuario

### Community 39 - "Feature Specification: [FEATURE NAME]"
Cohesion: 0.15
Nodes (12): Assumptions, Edge Cases, Feature Specification: [FEATURE NAME], Functional Requirements, Key Entities *(include if feature involves data)*, Measurable Outcomes, Requirements *(mandatory)*, Success Criteria *(mandatory)* (+4 more)

### Community 40 - "AuthService"
Cohesion: 0.11
Nodes (4): ExpiracaoJob, GoogleTokenFilter, NaoAutorizadoException, AuthService

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
Cohesion: 0.18
Nodes (15): Lugar, PaginaRota(), tocar(), verRota(), Aviso(), BuscaEndereco(), cache, Lugar (+7 more)

### Community 46 - "Implementation Plan: [FEATURE]"
Cohesion: 0.22
Nodes (8): Complexity Tracking, Constitution Check, Documentation (this feature), Implementation Plan: [FEATURE], Project Structure, Source Code (repository root), Summary, Technical Context

### Community 47 - "speckit-checklist/SKILL.md"
Cohesion: 0.25
Nodes (7): Anti-Examples: What NOT To Do, Checklist Purpose: "Unit Tests for English", Example Checklist Types & Sample Items, Execution Steps, Post-Execution Checks, Pre-Execution Checks, User Input

### Community 48 - "Localizacao"
Cohesion: 0.08
Nodes (7): TrechoController, TrechoPeso, Vertice, TrechoRequest, Trecho, TrechoService, TrechoServiceTest

### Community 49 - "speckit-clarify/SKILL.md"
Cohesion: 0.29
Nodes (6): Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, User Input

### Community 50 - "speckit-implement/SKILL.md"
Cohesion: 0.29
Nodes (6): Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, User Input

### Community 51 - "MapaLeaflet.tsx"
Cohesion: 0.11
Nodes (22): nextConfig, dependencies, google-auth-library@^11.3.4, leaflet@^1.9.4, lucide-react@^1.72.0, next@15.5.29, react-leaflet@^5.0.0, @vercel/blob@^2.9.0 (+14 more)

### Community 52 - "speckit-constitution/SKILL.md"
Cohesion: 0.33
Nodes (5): Outline, Post-Execution Checks, Pre-Execution Checks, Scope Guard, User Input

### Community 53 - "tipos.ts"
Cohesion: 0.22
Nodes (14): Totais, PaginaMapa(), FiltroTipos(), FormaTipo(), ErroApi, OcorrenciaDetalhe, RankingBairros, Rota (+6 more)

### Community 54 - "nova/page.tsx"
Cohesion: 0.21
Nodes (10): PaginaNovaOcorrencia(), enviar(), escolherFoto(), Passo(), Rascunho, enviarFoto(), reduzirFoto(), CHAVE_RASCUNHO (+2 more)

### Community 55 - "[CHECKLIST TYPE] Checklist: [FEATURE NAME]"
Cohesion: 0.40
Nodes (4): [Category 1], [Category 2], [CHECKLIST TYPE] Checklist: [FEATURE NAME], Notes

### Community 59 - "Backlog MoSCoW (22 historias, 81 SP)"
Cohesion: 0.17
Nodes (13): Diagrama de casos de uso UC01-UC22, Agile GS Caminho Livre (documento de entrega), Escopo do MVP (Must US01-US06, 32 SP), ODS 3, 9, 10, 11, Backlog MoSCoW (22 historias, 81 SP), Planning Poker (Fibonacci, referencia US06), Requisitos nao funcionais RNF01-RNF12, Entregaveis Agile (PDF unico, prototipo, pitch) (+5 more)

### Community 60 - "Mapa colaborativo de alertas"
Cohesion: 0.20
Nodes (8): Mapa colaborativo de alertas, Persona Dona Marta, Persona Julia, Problema: pedestres sem informacao de calcadas e ruas, Calculo de rota Dijkstra na API Java (GET /rotas), Matriz de rastreabilidade (historia-requisito-endpoint-tabela), Requisitos funcionais RF01-RF25, Status de alerta CONFIRMADA/RESOLVIDA/EXPIRADA

### Community 61 - "Tabela de endpoints (contrato com o front)"
Cohesion: 0.14
Nodes (12): API RESTful Spring Boot (Caminho Livre), POST /auth/google, Deploy no Render, GET /rotas (Dijkstra na API), Tabela de endpoints (contrato com o front), GET /trechos/pesos, Front-end Next.js Caminho Livre, React Leaflet + OpenStreetMap (+4 more)

### Community 62 - "frases.py"
Cohesion: 0.23
Nodes (6): alinhar(), energia_voz(), ler_roteiro(), main(), norm(), _teste()

### Community 63 - "GoogleTokenFilter.java"
Cohesion: 0.13
Nodes (4): AuthController, LoginRequest, ErroResponse, GlobalExceptionHandler

### Community 64 - "ed-mapa"
Cohesion: 0.11
Nodes (18): 1. A fala no tempo da narração limpa, 2. Trechos, 3. Tipos de cena (do perfil, decisão 7), 4. Storyboard (obrigatório no gancho, opcional no resto), 5. Duração e sincronia, 6. Trocas de cena, 7. Assets, Aprovação (+10 more)

### Community 65 - "Demo.tsx"
Cohesion: 0.05
Nodes (110): Camera(), Em(), FormaVarre(), FORMAS, FundoFormas(), Icone(), MolduraCelular(), NumeroConta() (+102 more)

### Community 66 - "OcorrenciaService"
Cohesion: 0.08
Nodes (16): OcorrenciaController, ConfirmacaoRequest, NovaOcorrenciaRequest, OcorrenciaDetalhe, OcorrenciaResumo, Ocorrencia, StatusOcorrencia, ABERTA (+8 more)

### Community 67 - "remotion/package.json"
Cohesion: 0.06
Nodes (41): allowScripts, esbuild, dependencies, react@19.3.1, react-dom@19.3.1, remotion@4.0.545, @remotion/cli@4.0.545, @remotion/google-fonts@4.0.545 (+33 more)

### Community 68 - "grafo.py"
Cohesion: 0.08
Nodes (15): calcular_pesos(), carregar_mapa(), Categoria, distancia_haversine_m(), eh_noturno(), faixa_horaria(), Localizacao, Mapa (+7 more)

### Community 69 - "CategoriaOcorrencia"
Cohesion: 0.07
Nodes (7): CategoriaController, CategoriaOcorrencia, Confirmacao, Chave, PreferenciaRota, CategoriaRepository, CategoriaService

### Community 70 - "Localizacao"
Cohesion: 0.09
Nodes (5): LocalizacaoController, RecursoNaoEncontradoException, Localizacao, LocalizacaoRepository, LocalizacaoService

### Community 72 - "Grafo"
Cohesion: 0.09
Nodes (13): Comparacao, custo_distancia(), custo_peso(), dijkstra(), menor_rota(), rota_caminho_livre(), rota_comum(), sem_bloqueio() (+5 more)

### Community 73 - "lib/sessao.ts"
Cohesion: 0.20
Nodes (19): LogoGoogle(), PaginaLogin(), Lista(), PaginaRanking(), Pessoa, api(), avisarAcordando(), USA_MOCKS (+11 more)

### Community 74 - "list"
Cohesion: 0.16
Nodes (8): ConfirmacaoRepository, OcorrenciaRepository, PreferenciaRotaRepository, TrechoRepository, UsuarioRepository, ConfirmacaoService, RankingService, UsuarioService

### Community 75 - "ed-animar"
Cohesion: 0.12
Nodes (16): Aprovação, Conferir antes de renderizar, Construir cada cena, ed-animar, Medir (quando a fluidez estiver em dúvida), Ofício, Passo a passo, Perfil (+8 more)

### Community 76 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.12
Nodes (5): RankingController, PessoaRanking, Bairro, RankingBairros, RankingServiceTest

### Community 77 - "main.py"
Cohesion: 0.13
Nodes (30): alertas_txt(), cmd_demo(), cmd_desempenho(), cmd_limite(), cmd_mapa(), cmd_pesos(), cmd_rota(), criar_parser() (+22 more)

### Community 78 - "RotaFavorita"
Cohesion: 0.07
Nodes (10): RotaFavoritaController, RotaFavoritaRequest, TotaisResponse, AcessoNegadoException, ConflitoException, RegraNegocioException, RotaFavorita, RotaFavoritaRepository (+2 more)

### Community 79 - "PerfilServiceTest"
Cohesion: 0.09
Nodes (9): UsuarioController, AtualizarUsuarioRequest, PreferenciaDto, UsuarioPublico, UsuarioResponse, Usuario, PreferenciaService, AuthServiceTest (+1 more)

### Community 80 - "Rota"
Cohesion: 0.07
Nodes (12): montar_rota(), Rota, _conferir_pilha(), ResultadoRecursivo, rota_mais_segura_recursiva(), 2.1 Grafos: Dijkstra (`dijkstra.py`), 2.2 A recorrência da rota mais segura com limite, 2.3 Memoização (`memo.py`) (+4 more)

### Community 81 - "Dicionário de dados — Caminho Livre"
Cohesion: 0.17
Nodes (12): CATEGORIA_OCORRENCIA, CONFIRMACAO, Dicionário de dados — Caminho Livre, LOCALIZACAO, Normalização, Objetos auxiliares, OCORRENCIA, PREFERENCIA_ROTA (+4 more)

### Community 83 - "Network Architect Solutions — Relatório da rede do Posto Caminho Livre"
Cohesion: 0.15
Nodes (13): 10. Registro das decisões, 11. Expansão, 12. Conclusão, 1. A CitizenTech, 2. Cenário da rede, 3. Topologia, 4. Atendimento aos requisitos mínimos, 5. Plano de endereçamento (+5 more)

### Community 84 - "RotaService"
Cohesion: 0.09
Nodes (13): RotaController, Ponto, RotaResponse, Trajeto, Detalhe, Feature, Geometria, OrsErro (+5 more)

### Community 86 - "Modelos — Caminho Livre"
Cohesion: 0.33
Nodes (5): 1. Modelo conceitual, 2. Modelo lógico, 3. Modelo físico (Oracle), Modelos — Caminho Livre, Modelo relacional Caminho Livre (Oracle)

### Community 87 - "Perfil"
Cohesion: 0.12
Nodes (10): Perfil, CacheDeRotas, Consulta, gerar_consultas(), LimiteDeChamadas, MedicaoCache, MedicaoRecursao, medir_cache() (+2 more)

### Community 89 - "ed-assets"
Cohesion: 0.12
Nodes (16): Aprovação, Como mostrar, ed-assets, Fontes, Gravações de tela, Licenças, O que é de quem, Ofício (+8 more)

### Community 90 - ".do_mapa"
Cohesion: 0.12
Nodes (6): comparar_rotas(), TrechoPonderado, grafo_de(), TestDijkstraEmGrafoPequeno, TestPersonas, TestFormatoDaApi

### Community 91 - "ed-som"
Cohesion: 0.12
Nodes (15): 1. Eventos, 2. Princípios, 3. Biblioteca e geração (ElevenLabs), 4. Música, 5. Mixagem e render final, Aprovação, ed-som, Ofício (+7 more)

### Community 92 - "gerar_extratos.py"
Cohesion: 0.27
Nodes (4): arredondar_coordenada(), extrair_sp156(), extrair_ssp(), pseudonimo()

### Community 93 - "Casca.tsx"
Cohesion: 0.25
Nodes (8): metadata, RootLayout(), viewport, assinarRede(), Casca(), NAV, assinar(), useSessao()

### Community 94 - "ed-cortes"
Cohesion: 0.13
Nodes (14): Aprovação, Bordas (trabalho de script), Como decidir, ed-cortes, Marcas (a pessoa revisa ouvindo), Ofício, Passo a passo, Pausas e hesitações (do perfil) (+6 more)

### Community 95 - "ed-preparar"
Cohesion: 0.13
Nodes (14): Aprovação, ed-preparar, Inventário (ffprobe em cada arquivo), Ofício, Passo a passo, Perfil, Regras, Regras comuns (+6 more)

### Community 96 - "Ofício de motion"
Cohesion: 0.13
Nodes (14): 0. Princípio, 10. Render ou pós, 11. Evitar, 12. Como saber se ficou fluido, 1. Hierarquia de velocidade, 2. Curva por papel (GSAP), 3. Câmera virtual (dentro da animação), 4. Troca de cena (+6 more)

### Community 97 - "ref_cenas.py"
Cohesion: 0.20
Nodes (10): main(), quadro(), rotular(), magnitudes(), main(), melhor_curva(), decodificar(), main() (+2 more)

### Community 98 - "Database_GS_CaminhoLivre.md"
Cohesion: 0.29
Nodes (6): 1. Objetivo e escopo do projeto, 2. Principais funcionalidades, 3.1 Visão de entidades (Logical), 3. Diagrama do modelo lógico, 4. Tabelas e relacionamentos, 5. Scripts SQL entregues

### Community 99 - "ed-iniciar"
Cohesion: 0.14
Nodes (13): Aprovação, Briefing, ed-iniciar, Ofício, Passo a passo, Pasta e estado, Perfil, Regras (+5 more)

### Community 100 - "fluxo-de-edicao"
Cohesion: 0.14
Nodes (13): Arquivos desta skill (leia só o que a fase pedir), Como falar, Fase 0. Apresentar, Fase 1. Ambiente, Fase 2. Entrevista, Fase 3. Referências e perfil, Fase 4. Plano do fluxo, Fase 5. Escrever as skills (+5 more)

### Community 101 - "gerar_som.py"
Cohesion: 0.23
Nodes (5): cliente(), versao_livre(), efeito(), gravar(), musica()

### Community 102 - "Decisões da entrevista"
Cohesion: 0.15
Nodes (12): 10. Revisão e aprovação, 11. Nome e comandos, 1. Onde a pessoa revisa (pergunte primeiro: muda o fluxo inteiro), 2. Tipo de vídeo e formato, 3. Pasta e organização, 4. Transcrição (a base de tudo), 5. Notas faladas na gravação, 6. Cortes (+4 more)

### Community 103 - "Princípios do fluxo"
Cohesion: 0.15
Nodes (12): 10. Conferir antes de confiar, 11. Economia de limite, 1. Uma skill por etapa, uma etapa por vez, 2. Planejar inteiro, executar por partes, 3. A memória fica nos arquivos, não na conversa, 4. O Claude decide, os scripts calculam, 5. Ponto salvo, pendência e `/clear`, 6. O caderno de aprendizados (+4 more)

### Community 104 - "Etapa 4: motion-mapa (o plano das animações)"
Cohesion: 0.17
Nodes (11): 1. A fala no tempo da sequência, 2. Trechos e tipo de vídeo, 3. Storyboard (obrigatório no gancho, opcional no corpo), 4. Onde entra (e onde não), 5. Formato, 6. Duração e sincronia, 7. Câmera em volta (intenção em palavras), 8. Assets (+3 more)

### Community 105 - "@playwright/test"
Cohesion: 0.20
Nodes (7): @axe-core/playwright@^4.14.0, @playwright/test@^1.65.0, ROTAS, SE, logar(), @axe-core/playwright, @playwright/test

### Community 106 - "9. Testes de comunicação"
Cohesion: 0.17
Nodes (12): 9. Testes de comunicação, Teste 10 — NAT/PAT, Teste 11 — ACL bloqueando o Wi-Fi público, Teste 12 — Acesso remoto só por SSH, Teste 1 — Interfaces do R-POSTO, Teste 2 — VLANs e trunks no SW-CORE, Teste 3 — Link serial com PPP, Teste 4 — DHCP (+4 more)

### Community 107 - "ver.py"
Cohesion: 0.42
Nodes (7): caminho(), gravar(), ler(), main(), setar(), status(), _teste()

### Community 108 - "Estilo de motion — caminho-livre"
Cohesion: 0.18
Nodes (10): §1 Velocidade, §2 Curvas, §3 Câmera virtual, §4 Troca de cena, §5 Entradas e saídas, §6 Texto vivo, §8 Movimento secundário, Composição (decisão 7) (+2 more)

### Community 109 - "Roteiro v02 — pitch do Caminho Livre (tom de conversa)"
Cohesion: 0.20
Nodes (9): 1 · Gancho (0:00–0:18), 2 · Problema (0:18–0:42), 3 · Solução (0:42–0:55), 4 · Como funciona (0:55–1:55), 5 · Diferencial e impacto (1:55–2:20), 6 · Fechamento (2:20–2:32), Dicas de gravação, Notas (o que mudou em relação ao texto colado) (+1 more)

### Community 110 - "Contrato REST API Caminho Livre"
Cohesion: 0.27
Nodes (9): Specification Quality Checklist, Contrato REST API Caminho Livre, Erro padrao {timestamp,status,erro}, Implementation Plan API REST Java, Quickstart validar a API (cenarios 1-16), Feature Spec API REST Caminho Livre, Success Criteria SC-001..SC-005, GlobalExceptionHandler (T007) (+1 more)

### Community 111 - "Regras comuns das skills ed-*"
Cohesion: 0.22
Nodes (8): 1. Conversa e segurança, 2. Estado do vídeo sem ler inteiro, 3. Revisão assistindo (sem programa de edição), 4. Caderno de aprendizados (`edicao\aprendizados.md`), 5. Trechos, ponto salvo e fechar uma etapa, 6. Aplicar os aprendizados (quando a pessoa pedir), 7. Economia de limite, Regras comuns das skills ed-*

### Community 112 - "transcrever_scribe.py"
Cohesion: 0.33
Nodes (5): f(), para_palavras(), termos_validos(), _teste(), transcrever()

### Community 113 - "6. Serviços implementados"
Cohesion: 0.22
Nodes (9): 6.1 VLANs e trunks, 6.2 Roteamento, 6.3 DHCP, 6.4 NAT/PAT, 6.5 DNS, 6.6 Web, 6.7 E-mail, 6.8 Wi-Fi público (+1 more)

### Community 114 - "Plano das cenas v01"
Cohesion: 0.22
Nodes (8): Assets, demo (0:52.9–1:41.4), diferencial (1:41.4–2:01.3), fechamento (2:01.3–2:12.6), gancho (0:00.0–0:19.2), Plano das cenas v01, problema (0:19.2–0:42.0), solucao (0:42.0–0:52.9)

### Community 115 - "Montagem do fluxo de edição"
Cohesion: 0.22
Nodes (8): Ambiente, Decisões, Fluxo aprovado (2026-11-17), Montagem do fluxo de edição, Onde ficam as skills, Perfil, Próximo passo, Skills escritas

### Community 116 - "prints_app.mjs"
Cohesion: 0.25
Nodes (5): { chromium }, foto(), livre(), require, SE

### Community 117 - "Roteiro v01 — pitch do Caminho Livre"
Cohesion: 0.22
Nodes (8): 1 · Gancho (0:00–0:15), 2 · Problema (0:15–0:40), 3 · Solução (0:40–0:52), 4 · Como funciona (0:52–1:55), 5 · Diferencial e impacto (1:55–2:20), 6 · Fechamento (2:20–2:32), Dicas de gravação, Roteiro v01 — pitch do Caminho Livre

### Community 118 - "Fluxo de edição com o Claude Code"
Cohesion: 0.25
Nodes (7): Como instalar, Como usar, Depois de montar: como editar um vídeo, Fluxo de edição com o Claude Code, Licença, O que tem aqui, O que você precisa

### Community 119 - "remotion-base/package.json"
Cohesion: 0.06
Nodes (41): allowScripts, esbuild, dependencies, react@19.3.1, react-dom@19.3.1, remotion@4.0.545, @remotion/cli@4.0.545, @remotion/google-fonts@4.0.545 (+33 more)

### Community 120 - "Fala no tempo da narração limpa"
Cohesion: 0.25
Nodes (7): 1 · Gancho, 2 · Problema, 3 · Solução, 4 · Como funciona, 5 · Diferencial e impacto, 6 · Fechamento, Fala no tempo da narração limpa

### Community 121 - "Frases da narração"
Cohesion: 0.25
Nodes (7): 1 · Gancho, 2 · Problema, 3 · Solução, 4 · Como funciona, 5 · Diferencial e impacto, 6 · Fechamento, Frases da narração

### Community 122 - "sys"
Cohesion: 0.36
Nodes (3): conferir(), main(), mmss()

### Community 123 - "Etapa 5: assets"
Cohesion: 0.29
Nodes (6): Como mostrar, Etapa 5: assets, Fontes que funcionam bem, Licenças, O que é de quem, Resumo

### Community 124 - "Etapa 7: câmera"
Cohesion: 0.29
Nodes (6): 1. Base automática (feita por script), 2. Casar com as animações (o que mais dá dinamismo), 3. Ênfases, 4. Cuidados (cada um pareceu bug quando aconteceu), 5. Plano e revisão, Etapa 7: câmera

### Community 125 - "Referências e perfil"
Cohesion: 0.29
Nodes (6): 1. Juntar, 2. Olhar (o que se vê), 3. Medir (o que se sente), 4. Escrever o perfil, 5. Conferir com a pessoa, Referências e perfil

### Community 126 - "Identidade visual — caminho-livre"
Cohesion: 0.29
Nodes (6): Cores, Fonte, Identidade visual — caminho-livre, Logotipo, Material, Nunca

### Community 127 - "GET /rotas"
Cohesion: 0.29
Nodes (3): GET /rotas, GET /trechos/pesos, User Story 4 - Rota acessivel (US04, US11)

### Community 128 - "Entrega no programa de edição (ou o vídeo pronto)"
Cohesion: 0.33
Nodes (5): Caminho A: XML para Premiere (e outros que leem FCP7 XML), Caminho B: outros programas, Caminho C: sem programa (o Claude entrega o vídeo), Entrega no programa de edição (ou o vídeo pronto), Regras para qualquer caminho

### Community 129 - "Etapa 3: cortes"
Cohesion: 0.33
Nodes (5): Bordas (trabalho de script), Como decidir, Estado e entrega, Etapa 3: cortes, Marcadores (na linha do tempo, não no chat)

### Community 130 - "Etapa 6: motion-render"
Cohesion: 0.33
Nodes (5): Aprendizado, Ciclo, Etapa 6: motion-render, Por trecho, Revisão

### Community 131 - "Etapa 8: sfx (efeitos sonoros)"
Cohesion: 0.33
Nodes (5): 1. Eventos, 2. Princípios, 3. A biblioteca, 4. Gravar e entregar, Etapa 8: sfx (efeitos sonoros)

### Community 133 - "Briefing — pitch do Caminho Livre"
Cohesion: 0.33
Nodes (5): Briefing — pitch do Caminho Livre, Direcionamentos gerais (do documento), Duração máxima, Público e onde vai passar, Sobre o vídeo

### Community 134 - "Next.js App Router"
Cohesion: 0.33
Nodes (6): API Java Contract, NovaOcorrencia, Next.js App Router, Vercel Blob, React Leaflet, Nominatim

### Community 135 - "POST /auth/google"
Cohesion: 0.33
Nodes (5): OcorrenciaDetalhe.minha flag, /ocorrencias endpoints, POST /auth/google, User Story 1 - Entrar com Google (US01, US06), GoogleTokenFilter (T017)

### Community 136 - "editar"
Cohesion: 0.40
Nodes (4): editar, /editar, /editar aprendizados, Regras

### Community 137 - "Construir animações no HyperFrames"
Cohesion: 0.40
Nodes (4): Armadilhas (cada uma custou uma rodada), Construir animações no HyperFrames, Eventos para o som, Jeito de trabalhar

### Community 138 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 139 - "Diagrama de classes — Caminho Livre API"
Cohesion: 0.50
Nodes (3): Camada model (entidades JPA = tabelas do Oracle), Camadas controller → service → repository, Diagrama de classes — Caminho Livre API

### Community 141 - "Etapas 1 e 2: iniciar e preparar"
Cohesion: 0.50
Nodes (3): Etapas 1 e 2: iniciar e preparar, Iniciar, Preparar

### Community 142 - "Modelo: estado do vídeo e o script de estado"
Cohesion: 0.50
Nodes (3): Esqueleto (cresce a cada etapa), Modelo: estado do vídeo e o script de estado, O script de estado

### Community 143 - "Modelo: perfil"
Cohesion: 0.50
Nodes (3): Arquivos, Esqueleto de um `estilo-*.md`, Modelo: perfil

### Community 144 - "json"
Cohesion: 0.23
Nodes (9): conferir(), main(), set_estado(), sondar(), _teste(), item(), main(), niveis() (+1 more)

### Community 145 - "Estilo de som — caminho-livre"
Cohesion: 0.50
Nodes (3): Efeitos, Estilo de som — caminho-livre, Música

### Community 152 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib, module, moduleResolution, noEmit (+6 more)

### Community 157 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib, module, moduleResolution, noEmit (+6 more)

### Community 158 - "front-next/package.json"
Cohesion: 0.14
Nodes (13): react@19.1.0, react-dom@19.1.0, @types/react@^19, @types/react-dom@^19, typescript@^5, react, react-dom, @types/react (+5 more)

### Community 159 - "som_gravar.py"
Cohesion: 0.38
Nodes (7): avisos(), chaves_musica(), falas(), frame(), inicio_do_som(), main(), _teste()

### Community 160 - "mais_segura_forca_bruta"
Cohesion: 0.28
Nodes (5): caminhos_simples(), busca(), mais_segura_forca_bruta(), menor_soma(), cabe()

### Community 161 - "animar_dados.py"
Cohesion: 0.44
Nodes (6): cores(), dados(), frame(), main(), svg_limpo(), _teste()

### Community 163 - "mapa_fala.py"
Cohesion: 0.39
Nodes (5): main(), mmss(), montar_conversor(), conv(), para_seg()

### Community 164 - "assets_buscar.py"
Cohesion: 0.48
Nodes (3): baixar(), livre(), main()

### Community 165 - "Remotion video"
Cohesion: 0.29
Nodes (6): Commands, Docs, Help, Issues, License, Remotion video

### Community 166 - "Remotion video"
Cohesion: 0.29
Nodes (6): Commands, Docs, Help, Issues, License, Remotion video

### Community 167 - "YouTube: título e descrição do pitch"
Cohesion: 0.50
Nodes (3): Descrição, Título, YouTube: título e descrição do pitch

## Knowledge Gaps
- **87 isolated node(s):** `br.com:caminholivre`, `ABERTA`, `CONFIRMADA`, `EXPIRADA`, `RESOLVIDA` (+82 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1068 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Backlog MoSCoW (22 historias, 81 SP)` connect `Backlog MoSCoW (22 historias, 81 SP)` to `Caminho Livre Constitution`, `Mapa colaborativo de alertas`, `Tabela de endpoints (contrato com o front)`, `Modelos — Caminho Livre`?**
  _High betweenness centrality (0.246) - this node is a cross-community bridge._
- **Are the 30 inferred relationships involving `Grafo` (e.g. with `Comparacao` and `comparar_rotas()`) actually correct?**
  _`Grafo` has 30 INFERRED edges - model-reasoned connections that need verification._
- **What connects `br.com:caminholivre`, `ABERTA`, `CONFIRMADA` to the rest of the system?**
  _87 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Casos de uso e atores` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._
- **Why does `Contrato REST API Caminho Livre` connect `Contrato REST API Caminho Livre` to `POST /auth/google`, `Backlog MoSCoW (22 historias, 81 SP)`, `Next.js App Router`, `GET /rotas`?**
  _High betweenness centrality (0.245) - this node is a cross-community bridge._
- **Should `Caminho Livre Constitution` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._
- **Why does `Contrato de telas — Front Caminho Livre` connect `Backlog MoSCoW (22 historias, 81 SP)` to `Contrato REST API Caminho Livre`?**
  _High betweenness centrality (0.241) - this node is a cross-community bridge._