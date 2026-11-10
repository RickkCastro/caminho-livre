# 📌 Tarefas — Caminho Livre (cards do Trello)

> Base para criar os cards do quadro. Cada card tem **título**, **responsável**, **prazo**, **etiquetas** e **checklist**.
> Entrega final: **19/11 às 23h55**. Hoje: 09/11.

---

## 🗓️ Marcos

| Data | Marco |
|---|---|
| **10/11 (seg)** | Pesquisa de campo feita, Ficha preenchida, **DER congelado**, contratos de integração combinados |
| **12/11 (qua)** | Banco criado e populado no Oracle da FIAP |
| **15/11 (sáb)** | **API Java no Render** conectada ao Oracle · todas as partes funcionando de forma isolada (com mocks) |
| **18/11 (ter)** | **Integração** (front + API + rota) · pitch gravado · todos os PDFs prontos |
| **19/11 (qua)** | Revisão cruzada de manhã e **envio até 18h** (margem de segurança) |

---

## 🏷️ Etiquetas

### Disciplina (uma por card)
| Etiqueta | Cor |
|---|---|
| `Database` | 🟢 verde |
| `Java` | 🟠 laranja |
| `Agile` | 🔵 azul |
| `Front` | 🩵 céu |
| `Dynamic Programming` | 🟣 roxo |
| `Data Science` | 🩷 rosa |
| `Network` | 🟡 amarelo |
| `AR/VR` | 🟤 lima |
| `Geral` | ⚫ preto |

### Tipo / estado
| Etiqueta | Cor | Quando usar |
|---|---|---|
| `Entrega` | 🔴 vermelho | Card que gera um arquivo enviado no Teams/Portal |
| `Integração` | 🟠 laranja | Depende de outra parte ou é dependência de outra parte |
| `Documentação` | ⚪ cinza | PDF, README, diagramas |
| `MVP` | 🔵 azul | Funcionalidade obrigatória do MVP |
| `Bloqueado` | 🔴 vermelho | Esperando outra pessoa (comentar o motivo) |

### Listas sugeridas
`Backlog` → `A fazer (semana)` → `Fazendo` → `Revisão` → `Pronto` → `Enviado ✅`

---

## 👥 Geral (todos)

### G1 · Pesquisa de campo e entrevista
- **Responsável:** todos (coordenação: Rickk) · **Prazo:** 10/11 · **Etiquetas:** `Geral`
- [ ] Escolher o bairro/trajeto real
- [ ] Fotografar 15 a 30 obstáculos e ruas escuras, anotando endereço e horário
- [ ] Entrevistar pelo menos 1 pessoa real (roteiro em `docs/README.md`)
- [ ] Registrar em `docs/entrevista.md` e `docs/campo/`

### G2 · Ficha da CitizenTech e equipe
- **Responsável:** Rickk · **Prazo:** 10/11 · **Etiquetas:** `Geral` `Documentação`
- [ ] Ajustar cidade/bairro e o problema em uma frase na Ficha do README
- [ ] Preencher nomes completos e RMs de todos
- [ ] Adicionar todos como colaboradores no GitHub

### G3 · Contratos de integração
- **Responsável:** Caio + Ulisses + Rickk + Dudu · **Prazo:** 10/11 · **Etiquetas:** `Geral` `Integração`
- [ ] DER congelado (nomes de tabelas e colunas)
- [ ] Tabela de endpoints e formato JSON fechados
- [ ] Formato de `/trechos/pesos` combinado com o Dudu
- [ ] Mocks JSON criados para o front e o Python

### G4 · Registro de prompts
- **Responsável:** todos · **Prazo:** contínuo até 19/11 · **Etiquetas:** `Geral` `Documentação`
- [ ] Cada um registra em `prompts.md` os prompts que usou

### G5 · Revisão cruzada e envio
- **Responsável:** todos · **Prazo:** 19/11 · **Etiquetas:** `Geral` `Entrega`
- [ ] Cada um revisa o PDF de outra pessoa (nomes, RMs, links funcionando)
- [ ] Testar o link do YouTube em aba anônima
- [ ] Testar o deploy da API e do front
- [ ] Último commit antes das 23h55 de 19/11 (ideal: até 18h)
- [ ] Enviar cada disciplina (1 integrante por envio) e marcar como `Enviado ✅`

---

## 🗄️ Database — Caio

### DB1 · Modelo conceitual e lógico
- **Prazo:** 10/11 · **Etiquetas:** `Database` `Integração`
- [ ] Conceitual com as 8 entidades e cardinalidades
- [ ] Lógico com PKs, FKs e tipos
- [ ] Validar com Ulisses (DER congelado)

### DB2 · Modelo físico e script de criação
- **Prazo:** 12/11 · **Etiquetas:** `Database`
- [ ] `scripts/01_create.sql` com PK, FK, CHECK, UNIQUE e sequences/identity
- [ ] Executar no Oracle da FIAP
- [ ] Exportar a imagem do modelo físico

### DB3 · Carga de dados
- **Prazo:** 12/11 · **Etiquetas:** `Database`
- [ ] `scripts/02_insert.sql` com cerca de 10 linhas por tabela
- [ ] Usar os locais reais fotografados (G1)
- [ ] Atualizar `peso_noturno` com o resultado do Data Science (DS3) até 15/11

### DB4 · Consultas do projeto
- **Prazo:** 14/11 · **Etiquetas:** `Database`
- [ ] 6 consultas em `scripts/03_consultas.sql` (GROUP BY, JOIN, HAVING, subquery, UPDATE de expiração)
- [ ] Comentar o objetivo de cada consulta

### DB5 · Dicionário de dados e entrega
- **Prazo:** 18/11 · **Etiquetas:** `Database` `Documentação` `Entrega`
- [ ] Dicionário (tabela, coluna, tipo, restrição, descrição)
- [ ] Justificativa da normalização (3FN)
- [ ] Juntar modelos + dicionário + scripts e enviar no Teams

---

## ☕ Java — Ulisses

### J1 · Setup do projeto Spring Boot
- **Prazo:** 11/11 · **Etiquetas:** `Java`
- [ ] Projeto Spring Boot (JDK 21) em `api-java/`
- [ ] Conexão com o Oracle da FIAP via variáveis de ambiente
- [ ] Estrutura de pacotes: model, dao, bo, controller, exception, config

### J2 · Camada model
- **Prazo:** 12/11 · **Etiquetas:** `Java` `MVP`
- [ ] 8 classes de acordo com o DER

### J3 · Camadas DAO e BO
- **Prazo:** 13/11 · **Etiquetas:** `Java` `MVP`
- [ ] DAO por entidade
- [ ] BO com as regras: expiração (15 dias), 3 confirmações → CONFIRMADA, não confirmar a própria, só GESTOR resolve
- [ ] Cálculo de peso do trecho por perfil e horário

### J4 · Controllers (GET/POST/PUT/DELETE)
- **Prazo:** 14/11 · **Etiquetas:** `Java` `MVP` `Integração`
- [ ] CRUD de todas as entidades
- [ ] `POST /ocorrencias/{id}/confirmacoes`, `PUT /ocorrencias/{id}/resolver`, `GET /trechos/pesos`
- [ ] Filtros em `GET /ocorrencias`
- [ ] CORS para o front

### J5 · Tratamento de exceções
- **Prazo:** 14/11 · **Etiquetas:** `Java`
- [ ] `@ControllerAdvice` com o JSON de erro padrão
- [ ] `RecursoNaoEncontradoException` (404) e `RegraNegocioException` (400/422)

### J6 · Deploy no Render ⚠️ 30 pts
- **Prazo:** 15/11 · **Etiquetas:** `Java` `Entrega` `Integração`
- [ ] Dockerfile ou build do Render configurado
- [ ] Variáveis de ambiente do Oracle no Render
- [ ] Testar todos os endpoints na URL pública
- [ ] Passar a URL para o Rickk, o Dudu e a Lau

### J7 · Documentação PDF (30 pts)
- **Prazo:** 18/11 · **Etiquetas:** `Java` `Documentação` `Entrega`
- [ ] Capa (nome do projeto, nomes completos, RMs), índice, descrição, justificativa, objetivos
- [ ] Diagrama de classes gerado a partir do código final
- [ ] Protótipos de tela (prints do front), tabela de endpoints e DER
- [ ] Instruções de execução (ferramentas, versões, links do GitHub e do deploy, passo a passo)
- [ ] ZIP com PDF + link do GitHub + link do deploy → **Portal do Aluno**

---

## 🧭 Agile — Rickk

### A1 · Apresentação descritiva da ideia (10 pts)
- **Prazo:** 12/11 · **Etiquetas:** `Agile` `Documentação`
- [ ] Problema, foco, público-alvo, solução e justificativas das escolhas
- [ ] Usar a entrevista e as fotos de campo

### A2 · Personas (10 pts)
- **Prazo:** 12/11 · **Etiquetas:** `Agile`
- [ ] Dona Marta, Júlia e Sr. Roberto (gestor), com narrativa, dores, objetivos e contexto

### A3 · Diagrama de casos de uso (20 pts)
- **Prazo:** 13/11 · **Etiquetas:** `Agile` `Integração`
- [ ] Todos os atores (Cidadão, PMR, Gestor, Contato de confiança, Sistema)
- [ ] Escopo total (MVP e além)
- [ ] Exportar a imagem

### A4 · Backlog do produto (20 pts)
- **Prazo:** 14/11 · **Etiquetas:** `Agile` `MVP`
- [ ] Histórias coerentes com o diagrama de casos de uso
- [ ] Priorizar com MoSCoW
- [ ] Sessão de Planning Poker com o grupo (registrar com print ou foto)
- [ ] Destacar o MVP
- [ ] Matriz de rastreabilidade (caso de uso → história → endpoint → tabela)

### A5 · Protótipo de 3+ telas (20 pts)
- **Prazo:** 16/11 · **Etiquetas:** `Agile` `Front`
- [ ] Mapa, Registrar ocorrência, Rota sugerida (+ painel do gestor)
- [ ] Comentários de UX em cada tela (acessibilidade, contraste, número de toques)

### A6 · Vídeo pitch de 3 min (20 pts)
- **Prazo:** 18/11 · **Etiquetas:** `Agile` `Geral` `Integração`
- [ ] Roteiro (`docs/pitch.md`)
- [ ] Gravar a narração com integrantes do grupo
- [ ] Mostrar a solução integrada funcionando
- [ ] Upload no YouTube como **não listado** e testar o link
- [ ] Enviar o link também em Testing

### A7 · PDF único e entrega
- **Prazo:** 18/11 · **Etiquetas:** `Agile` `Entrega`
- [ ] Juntar A1 a A6 em **um único PDF**, com todos os integrantes identificados
- [ ] Enviar no Teams

---

## 🎨 Front (Next.js) — Rickk

### F1 · Setup do projeto
- **Prazo:** 11/11 · **Etiquetas:** `Front`
- [ ] Next.js + TypeScript + Tailwind em `front-next/`
- [ ] Mocks em `src/mocks/` no formato da tabela de endpoints
- [ ] Deploy inicial na Vercel

### F2 · Tela do mapa
- **Prazo:** 13/11 · **Etiquetas:** `Front` `MVP`
- [ ] React Leaflet + OSM
- [ ] Marcadores por tipo (cor + ícone)
- [ ] Filtros Acessibilidade/Segurança e status

### F3 · Registrar e confirmar ocorrência
- **Prazo:** 14/11 · **Etiquetas:** `Front` `MVP`
- [ ] Formulário (foto, categoria, local no mapa, anônimo)
- [ ] Tela de detalhe com confirmar/negar

### F4 · Tela de rota sugerida
- **Prazo:** 16/11 · **Etiquetas:** `Front` `MVP` `Integração`
- [ ] Origem, destino e perfil
- [ ] Comparação rota comum × Caminho Livre (com o resultado do algoritmo do Dudu, pré-calculado em JSON se preciso)

### F5 · Painel do gestor *(Should)*
- **Prazo:** 17/11 · **Etiquetas:** `Front`
- [ ] Lista por bairro e botão "resolver"

### F6 · Integração com a API
- **Prazo:** 18/11 · **Etiquetas:** `Front` `Integração`
- [ ] Trocar os mocks por `NEXT_PUBLIC_API_URL` (Render)
- [ ] Testar o fluxo completo: registrar → confirmar → mapa → rota
- [ ] Prints das telas para Agile e Java

---

## 🧮 Dynamic Programming — Dudu

### DP1 · Grafo e mock de dados
- **Prazo:** 12/11 · **Etiquetas:** `Dynamic Programming` `Integração`
- [ ] `dados/grafo_mock.json` no formato combinado (com os locais reais do G1)
- [ ] Lista de adjacência em `grafo.py`

### DP2 · Dijkstra com pesos por perfil e horário
- **Prazo:** 14/11 · **Etiquetas:** `Dynamic Programming` `MVP`
- [ ] Rota comum (só distância) × rota Caminho Livre
- [ ] Perfil PMR: degrau intransponível
- [ ] Penalidade noturna (19h–6h)

### DP3 · Memoização
- **Prazo:** 15/11 · **Etiquetas:** `Dynamic Programming`
- [ ] Cache por (origem, destino, perfil, faixa horária)
- [ ] Medir o tempo com e sem cache

### DP4 · Tabulação
- **Prazo:** 16/11 · **Etiquetas:** `Dynamic Programming`
- [ ] Rota de menor risco com no máximo X metros a mais (tabela de PD)

### DP5 · Integração, README e entrega
- **Prazo:** 18/11 · **Etiquetas:** `Dynamic Programming` `Integração` `Entrega`
- [ ] Ler de `GET /trechos/pesos` (com fallback para o mock)
- [ ] Gerar JSON de rota para o front (F4)
- [ ] README com RMs, nomes, algoritmos e funcionalidades
- [ ] ZIP único no Teams

---

## 📊 Data Science — Dudu

### DS1 · Coleta e preparo dos dados
- **Prazo:** 12/11 · **Etiquetas:** `Data Science`
- [ ] Baixar a base (SSP-SP, SP156 ou GeoSampa) e registrar a fonte
- [ ] Limpeza: datas, horários, bairros, nulos

### DS2 · Análise e teste de hipótese
- **Prazo:** 14/11 · **Etiquetas:** `Data Science`
- [ ] Análise exploratória
- [ ] Teste estatístico (ex.: qui-quadrado por faixa horária) ou modelo simples
- [ ] Gráficos (barras por hora, mapa de calor por bairro)

### DS3 · Pesos de risco para a solução
- **Prazo:** 15/11 · **Etiquetas:** `Data Science` `Integração`
- [ ] Tabela `peso_base` / `peso_noturno` por categoria
- [ ] Repassar ao Caio (DB3) e usar no Dijkstra (DP2)

### DS4 · Conclusão e entrega
- **Prazo:** 18/11 · **Etiquetas:** `Data Science` `Documentação` `Entrega`
- [ ] Conclusão curta: resultados, limitações e uso na solução
- [ ] Base, notebook, gráficos e links no Teams

---

## 🌐 Network — Lau

### N1 · Plano de endereçamento
- **Prazo:** 11/11 · **Etiquetas:** `Network`
- [ ] Confirmar o número X da equipe
- [ ] Sub-redes de `192.168.X.0/24` para Equipe, Cidadão e Servidores/Sensores (+ gateways)

### N2 · Topologia, VLANs e roteamento
- **Prazo:** 13/11 · **Etiquetas:** `Network`
- [ ] Switch com VLANs 10/20/30 e trunk 802.1Q
- [ ] Router-on-a-stick com subinterfaces

### N3 · Serviços
- **Prazo:** 14/11 · **Etiquetas:** `Network`
- [ ] DHCP com um pool por VLAN (exclusões)
- [ ] NAT/PAT até o roteador provedor + servidor "internet"
- [ ] Servidor com DNS e HTTP (página com a Ficha da CitizenTech)

### N4 · Segurança
- **Prazo:** 15/11 · **Etiquetas:** `Network`
- [ ] ACL estendida: o Wi-Fi do cidadão acessa só HTTP/DNS do servidor e a internet
- [ ] SSH, senhas e `enable secret`
- [ ] Wi-Fi WPA2

### N5 · Testes e PDF
- **Prazo:** 17/11 · **Etiquetas:** `Network` `Documentação` `Entrega`
- [ ] Prints: ping entre VLANs, DHCP, página por nome, `show ip nat translations`, acesso bloqueado pela ACL
- [ ] PDF: Ficha, topologia, plano de endereçamento, trechos de `show running-config`, testes
- [ ] Enviar `.pkt` + PDF

---

## 🥽 AR/VR — Lau

### AR1 · Roteiro e storyboard
- **Prazo:** 13/11 · **Etiquetas:** `AR/VR`
- [ ] Roteiro de 50 s (`ar-vr/README.md`)
- [ ] Escolher a ferramenta (Blender, Unity, Spline...)

### AR2 · Modelagem da cena 3D
- **Prazo:** 16/11 · **Etiquetas:** `AR/VR`
- [ ] Rua noturna, calçada com degrau, poste apagado, personagens
- [ ] Rota comum × rota Caminho Livre

### AR3 · Vídeo e entrega
- **Prazo:** 18/11 · **Etiquetas:** `AR/VR` `Entrega`
- [ ] Renderizar e editar (30–60 s)
- [ ] Upload no YouTube e testar o link
- [ ] PDF com nomes e link → Teams
- [ ] Passar trechos para o pitch (A6)

---

## 🔗 Dependências críticas

| Card | Depende de | Libera |
|---|---|---|
| DB1 (DER) | — | J2, A4 (rastreabilidade) |
| DB2/DB3 (banco no Oracle) | DB1 | J6 (deploy) |
| DS3 (pesos) | DS2 | DB3, DP2 |
| J6 (deploy) | J1–J5, DB2 | F6, DP5, N3 (referência no DNS) |
| DP5 (JSON de rota) | DP2 | F4 |
| F6 (front integrado) | J6 | A5, A6, J7 (prints) |
| AR3 (vídeo) | AR2 | A6 (trechos no pitch) |
| A6 (pitch) | F6, AR3 | G5 |

## 📊 Carga por pessoa
| Pessoa | Cards | Entregas |
|---|---|---|
| Caio | 5 | Database |
| Ulisses | 7 | Java (Portal do Aluno) |
| Rickk | 13 + G1/G2 | Agile, pitch |
| Dudu | 9 | Dynamic Programming, Data Science |
| Lau | 8 | Network, AR/VR |
