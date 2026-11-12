# Graph Report - caminho-livre  (2026-11-12)

## Corpus Check
- 33 files · ~53,099 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .graphify-bak 1, .css 1)

## Summary
- 230 nodes · 241 edges · 35 communities (15 shown, 20 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.89)
- Token cost: 25,410 input · 4,099 output

## Community Hubs (Navigation)
- Casos de uso e atores
- Contrato REST da API
- Ideia, personas e escopo
- Constitution do projeto
- Gerador de PDF (build.js)
- Gerador do diagrama (usecase.js)
- API Java e endpoints
- Briefing da GS CitizenTech
- Banco e regras de negócio
- Ficha CitizenTech e rede
- Front: telas e sessão
- Front: stack e integrações
- Ciclo de vida da ocorrência
- LGPD: login e exclusão
- Entregáveis de Agile
- Front: telas, quickstart, tasks
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

## God Nodes (most connected - your core abstractions)
1. `Diagrama de Casos de Uso - Caminho Livre` - 26 edges
2. `Ator: Usuario` - 14 edges
3. `Caminho Livre Constitution` - 9 edges
4. `Caminho Livre (project README)` - 7 edges
5. `Global Solution 2026.2 (FIAP)` - 7 edges
6. `GS CitizenTech Briefing (2ES Fev 2026)` - 7 edges
7. `Backlog MoSCoW (22 historias, 81 SP)` - 6 edges
8. `Tabela de endpoints (contrato com o front)` - 6 edges
9. `Contrato REST API Caminho Livre` - 6 edges
10. `Implementation Plan API REST Java` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Postes inteligentes (sensores de luminosidade)` --conceptually_related_to--> `Tabela OCORRENCIA`  [INFERRED]
  network/README.md → database/README.md
- `Caminho Livre (project README)` --references--> `Backlog MoSCoW (agile/backlog.md)`  [EXTRACTED]
  README.md → .specify/memory/constitution.md
- `Rota acessivel desviando de alertas` --conceptually_related_to--> `Calculo de rota Dijkstra (GET /rotas)`  [INFERRED]
  README.md → .specify/memory/constitution.md
- `API RESTful Spring Boot (Caminho Livre)` --references--> `Modelo relacional Caminho Livre (Oracle)`  [EXTRACTED]
  api-java/README.md → database/README.md
- `Rede do Posto Caminho Livre (Packet Tracer)` --conceptually_related_to--> `API RESTful Spring Boot (Caminho Livre)`  [INFERRED]
  network/README.md → api-java/README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **spec-kit specify-plan-tasks-implement workflow** — _specify_memory_constitution_workflow [INFERRED 0.85]
- **Personas que orientam o backlog** — agile_agile_gs_caminholivre_persona_dona_marta, agile_agile_gs_caminholivre_persona_julia, agile_agile_gs_caminholivre_persona_seu_antonio [EXTRACTED 1.00]
- **Calculo de rota ponderada** — api_java_readme_get_rotas, api_java_readme_trechos_pesos, database_readme_trecho, api_java_readme_regras_negocio_bo [INFERRED 0.85]
- **Modelo de dados do Caminho Livre** — database_readme_usuario, database_readme_categoria_ocorrencia, database_readme_localizacao, database_readme_ocorrencia, database_readme_confirmacao, database_readme_preferencia_rota, database_readme_trecho [EXTRACTED 1.00]
- **Calculo de rota acessivel** — specs_001_api_rest_java_contracts_api_get_rotas, specs_001_api_rest_java_data_model_rotabo, specs_001_api_rest_java_data_model_peso_trecho, specs_001_api_rest_java_research_haversine_30m, specs_001_api_rest_java_research_dijkstra_na_api [INFERRED 0.85]
- **Seven disciplines, one CitizenTech project** — docs_gs_citizentech_2es_fev_fiap_2026_agile, docs_gs_citizentech_2es_fev_fiap_2026_arvr, docs_gs_citizentech_2es_fev_fiap_2026_data_science, docs_gs_citizentech_2es_fev_fiap_2026_database_design, docs_gs_citizentech_2es_fev_fiap_2026_ddd_java, docs_gs_citizentech_2es_fev_fiap_2026_dynamic_programming, docs_gs_citizentech_2es_fev_fiap_2026_network [EXTRACTED 1.00]
- **Front-end External Integrations** — specs_002_front_next_web_research_google_identity, specs_002_front_next_web_research_nominatim, specs_002_front_next_web_plan_vercel_blob, specs_002_front_next_web_research_leaflet [EXTRACTED 1.00]
- **Client-Side Data Persistence** — specs_002_front_next_web_data_model_sessao, specs_002_front_next_web_data_model_nova_ocorrencia, specs_002_front_next_web_plan_vercel_blob [INFERRED 0.85]
- **Front-end MVP Core Flow** — front_next_app_page, front_next_app_login_page, front_next_app_ocorrencias_nova_page, front_next_app_rota_page [EXTRACTED 1.00]

## Communities (35 total, 20 thin omitted)

### Community 0 - "Casos de uso e atores"
Cohesion: 0.15
Nodes (27): Ator: Administrador (Won't), Diagrama de Casos de Uso - Caminho Livre, Sistema externo: Google, Ator: Sistema, UC01 Entrar com Google (Must), UC02 Validar token no Google, UC03 Responder onboarding de perfil (Should), UC04 Sair da conta (Must) (+19 more)

### Community 1 - "Contrato REST da API"
Cohesion: 0.10
Nodes (18): Specification Quality Checklist, Contrato REST API Caminho Livre, Erro padrao {timestamp,status,erro}, GET /rotas, GET /trechos/pesos, OcorrenciaDetalhe.minha flag, /ocorrencias endpoints, POST /auth/google (+10 more)

### Community 2 - "Ideia, personas e escopo"
Cohesion: 0.11
Nodes (18): Diagrama de casos de uso UC01-UC22, Agile GS Caminho Livre (documento de entrega), Mapa colaborativo de alertas, Escopo do MVP (Must US01-US06, 32 SP), ODS 3, 9, 10, 11, Persona Dona Marta, Persona Julia, Problema: pedestres sem informacao de calcadas e ruas (+10 more)

### Community 3 - "Constitution do projeto"
Cohesion: 0.12
Nodes (11): Caminho Livre Constitution, Backlog MoSCoW (agile/backlog.md), API Java README (endpoints), Database README (DER), Calculo de rota Dijkstra (GET /rotas), Rota acessivel desviando de alertas, Arquitetura Next.js -> Spring Boot -> Oracle, Caminho Livre (project README) (+3 more)

### Community 4 - "Gerador de PDF (build.js)"
Cohesion: 0.11
Nodes (15): build(), CSS, fs, { mdToPdf }, OUT, path, SRC, dependencies (+7 more)

### Community 5 - "Gerador do diagrama (usecase.js)"
Cohesion: 0.14
Nodes (15): add(), ADM, C, dep(), dir, fs, GOOGLE, leg (+7 more)

### Community 6 - "API Java e endpoints"
Cohesion: 0.14
Nodes (13): API RESTful Spring Boot (Caminho Livre), POST /auth/google, Deploy no Render, GET /rotas (Dijkstra na API), Tabela de endpoints (contrato com o front), GET /trechos/pesos, Modelo relacional Caminho Livre (Oracle), Front-end Next.js Caminho Livre (+5 more)

### Community 7 - "Briefing da GS CitizenTech"
Cohesion: 0.15
Nodes (13): Be My Eyes (caso de referencia), Casos: hackathon UNICEF Salvador, Aqualuz (UNESCO), CitizenTech - Tecnologia para pessoas, CitizenTech Studio (QR - descubra sua ideia), Problema: desperdicio de alimentos e fome, Global Solution 2026.2 (FIAP), Problema: mobilidade urbana e acessibilidade, ODS (Objetivos de Desenvolvimento Sustentavel) (+5 more)

### Community 8 - "Banco e regras de negócio"
Cohesion: 0.21
Nodes (11): Analise Data Science (teste de hipotese), Fontes publicas (SSP-SP, SP156, GeoSampa, OSM), Tabela CATEGORIA_OCORRENCIA, Tabela CONFIRMACAO, Tabela LOCALIZACAO, Tabela OCORRENCIA, Tabela PREFERENCIA_ROTA, Tabela ROTA_FAVORITA (Could) (+3 more)

### Community 9 - "Ficha CitizenTech e rede"
Cohesion: 0.22
Nodes (7): GS CitizenTech Briefing (2ES Fev 2026), Accessible Sidewalks Starting Point, CitizenTech, Ficha da CitizenTech (README header), Network Architect Solutions deliverable (Packet Tracer, VLANs, NAT, ACL), UN SDGs (ODS 2,3,4,9,10,11,13), GS Rules (deadline 19/11 23h55, up to 5 students)

### Community 10 - "Front: telas e sessão"
Cohesion: 0.25
Nodes (8): API REST Java (001), Login Page (/login), Home Page (/), Map Component, API Client, Session Management, Google Identity Services, Feature Specification: Front-end web Caminho Livre (Next.js)

### Community 11 - "Front: stack e integrações"
Cohesion: 0.33
Nodes (6): API Java Contract, NovaOcorrencia, Next.js App Router, Vercel Blob, React Leaflet, Nominatim

### Community 14 - "Entregáveis de Agile"
Cohesion: 0.67
Nodes (3): Agile Methodology With Squad Framework deliverable, Product Backlog with MoSCoW and Planning Poker, Video Pitch (max 3 min, YouTube)

### Community 15 - "Front: telas, quickstart, tasks"
Cohesion: 0.67
Nodes (3): Contrato de telas — Front Caminho Livre, Quickstart: validar o front, Tasks: Front-end web Caminho Livre (Next.js)

### Community 16 - "Front: sessão e usuário"
Cohesion: 0.67
Nodes (3): Sessao, Usuario, Google Identity Services

## Knowledge Gaps
- **83 isolated node(s):** `API Java README (endpoints)`, `Database README (DER)`, `Grupo OctoFlow`, `Global Solution 2026.2 CitizenTech FIAP`, `Alertas colaborativos confirmados pela comunidade` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 122 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `API RESTful Spring Boot (Caminho Livre)` connect `API Java e endpoints` to `Banco e regras de negócio`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `API Java README (endpoints)`, `Database README (DER)`, `Grupo OctoFlow` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Casos de uso e atores` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._
- **Should `Contrato REST da API` be split into smaller, more focused modules?**
  _Cohesion score 0.09782608695652174 - nodes in this community are weakly interconnected._
- **Should `Ideia, personas e escopo` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Constitution do projeto` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._
- **Should `Gerador de PDF (build.js)` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._