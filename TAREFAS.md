# 📌 Tarefas — Caminho Livre (cards do Trello)

> Base para criar os cards do quadro. Cada card tem **título**, **responsável**, **prazo**, **etiquetas** e **checklist**.
> Entrega final: **19/11 às 23h55** (meta interna: enviar até 18h). Hoje: 09/11.

---

## 🧭 Ordem de execução

```
FASE 1  Descoberta + Backlog        09–11/11   ──┐
FASE 2  Tabelas (banco)             11–12/11     │  caminho crítico do app
FASE 3  API ║ Front (em paralelo)   12–15/11     │
FASE 4  Integração                  16–18/11   ──┘
FASE 5  Vídeo pitch + envio         18–19/11

EM PARALELO (09–18/11, sem depender do app até a integração):
  Network · AR/VR · Dynamic Programming · Data Science (isolada)
```

| Fase | Período | O que sai | Cards |
|---|---|---|---|
| **1. Descoberta + Backlog** | 09–11/11 | Campo, Ficha, personas, casos de uso, **backlog priorizado (MVP)** | G1, G2, A1, A2, A3, A4 |
| **2. Tabelas** | 11–12/11 | DER congelado a partir do backlog, banco criado e populado no Oracle | G3, DB1, DB2, DB3 |
| **3. API ║ Front** | 12–15/11 | **API no Render (15/11)** e front com mocks, em paralelo | J1–J6, F1–F4 |
| **4. Integração** | 16–18/11 | Front ligado à API, rota do Python no front, PDFs técnicos | F5, F6, DP5, J7, A5, DB4, DB5 |
| **5. Pitch + envio** | 18–19/11 | Vídeo pitch gravado com o app integrado, PDF de Agile, revisão e envio | A6, A7, G5 |
| **Paralelo** | 09–18/11 | Entregas independentes | N1–N5, AR1–AR3, DP1–DP4, DS1–DS4 |

> **Por que essa ordem:** o backlog define o escopo do MVP → o MVP define as tabelas → as tabelas definem as classes da API e os mocks do front → com a API no ar o front é integrado → só então o pitch mostra a solução funcionando.

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

### Fase
| Etiqueta | Cor |
|---|---|
| `Fase 1 · Backlog` | ⚪ cinza |
| `Fase 2 · Tabelas` | ⚪ cinza |
| `Fase 3 · API/Front` | ⚪ cinza |
| `Fase 4 · Integração` | ⚪ cinza |
| `Fase 5 · Pitch` | ⚪ cinza |
| `Paralelo` | ⚪ cinza |

### Tipo / estado
| Etiqueta | Cor | Quando usar |
|---|---|---|
| `Entrega` | 🔴 vermelho | Card que gera um arquivo enviado no Teams/Portal |
| `MVP` | 🔵 azul | Funcionalidade obrigatória do MVP |
| `Documentação` | ⚪ cinza | PDF, README, diagramas |
| `Bloqueado` | 🔴 vermelho | Esperando outra pessoa (comentar o motivo) |

### Listas sugeridas
`Backlog` → `A fazer (semana)` → `Fazendo` → `Revisão` → `Pronto` → `Enviado ✅`

---

# FASE 1 · Descoberta + Backlog (09–11/11)

### G1 · Pesquisa de campo e entrevista
- **Responsável:** todos (coordenação: Rickk) · **Prazo:** 10/11 · **Etiquetas:** `Geral` `Fase 1 · Backlog`
- [ ] Escolher o bairro/trajeto real
- [ ] Fotografar 15 a 30 obstáculos e ruas escuras, anotando endereço e horário
- [ ] Entrevistar pelo menos 1 pessoa real (roteiro em `docs/README.md`)
- [ ] Registrar em `docs/entrevista.md` e `docs/campo/`

### G2 · Ficha da CitizenTech e equipe
- **Responsável:** Rickk · **Prazo:** 10/11 · **Etiquetas:** `Geral` `Fase 1 · Backlog` `Documentação`
- [ ] Ajustar cidade/bairro e o problema em uma frase na Ficha do README
- [ ] Preencher nomes completos e RMs de todos
- [ ] Adicionar todos como colaboradores no GitHub

### A1 · Apresentação descritiva da ideia (10 pts)
- **Responsável:** Rickk · **Prazo:** 10/11 · **Etiquetas:** `Agile` `Fase 1 · Backlog` `Documentação`
- [ ] Problema, foco, público-alvo, solução e justificativas das escolhas
- [ ] Usar a entrevista e as fotos de campo

### A2 · Personas (10 pts)
- **Responsável:** Rickk · **Prazo:** 10/11 · **Etiquetas:** `Agile` `Fase 1 · Backlog`
- [ ] Dona Marta, Júlia e Seu Antônio, com narrativa, dores, objetivos e contexto

### A3 · Diagrama de casos de uso (20 pts)
- **Responsável:** Rickk · **Prazo:** 11/11 · **Etiquetas:** `Agile` `Fase 1 · Backlog`
- [ ] Todos os atores (Pedestre, PMR, Sistema, Administrador como Won't)
- [ ] Escopo total (MVP e além)
- [ ] Exportar a imagem

### A4 · Backlog do produto (20 pts) 🔑 *libera a Fase 2*
- **Responsável:** Rickk (Planning Poker com todos) · **Prazo:** 11/11 · **Etiquetas:** `Agile` `Fase 1 · Backlog` `MVP`
- [ ] Histórias coerentes com o diagrama de casos de uso
- [x] Priorizar com MoSCoW (quadro da equipe → `agile/backlog.md`)
- [ ] Sessão de Planning Poker com o grupo (registrar com print ou foto)
- [x] **Fechar o escopo do MVP** (US01–US07) e repassar ao Caio, ao Ulisses e ao Dudu
- [ ] Exportar a imagem do quadro MoSCoW para o PDF

---

# FASE 2 · Tabelas (11–12/11)

### G3 · Contratos de integração
- **Responsável:** Caio + Ulisses + Rickk + Dudu · **Prazo:** 11/11 · **Etiquetas:** `Geral` `Fase 2 · Tabelas`
- [ ] Tabela de endpoints e formato JSON fechados (a partir do DER)
- [ ] Formato de `/trechos/pesos` combinado com o Dudu
- [ ] Mocks JSON criados para o front e o Python

### DB1 · Modelo conceitual e lógico (DER congelado)
- **Responsável:** Caio · **Prazo:** 11/11 · **Etiquetas:** `Database` `Fase 2 · Tabelas` `MVP`
- [ ] Conceitual com as entidades e cardinalidades (tabelas já mapeadas em `database/README.md` a partir do backlog)
- [ ] Lógico com PKs, FKs e tipos
- [ ] Validar com Ulisses e **congelar os nomes**

### DB2 · Modelo físico e script de criação
- **Responsável:** Caio · **Prazo:** 12/11 · **Etiquetas:** `Database` `Fase 2 · Tabelas`
- [ ] `scripts/01_create.sql` com PK, FK, CHECK, UNIQUE e sequences/identity
- [ ] Executar no Oracle da FIAP
- [ ] Exportar a imagem do modelo físico

### DB3 · Carga de dados
- **Responsável:** Caio · **Prazo:** 12/11 · **Etiquetas:** `Database` `Fase 2 · Tabelas`
- [ ] `scripts/02_insert.sql` com cerca de 10 linhas por tabela
- [ ] Usar os locais reais fotografados (G1)
- [ ] Pesos das categorias definidos pela equipe (valores simples, ex.: degrau = 10, rua escura = 3 de dia / 8 à noite)

---

# FASE 3 · API ║ Front em paralelo (12–15/11)

## ☕ API Java — Ulisses

### J1 · Setup do projeto Spring Boot
- **Prazo:** 12/11 · **Etiquetas:** `Java` `Fase 3 · API/Front`
- [ ] Projeto Spring Boot (JDK 21) em `api-java/` *(pode começar já na Fase 2)*
- [ ] Conexão com o Oracle da FIAP via variáveis de ambiente
- [ ] Estrutura de pacotes: model, dao, bo, controller, exception, config

### J2 · Camada model
- **Prazo:** 13/11 · **Etiquetas:** `Java` `Fase 3 · API/Front` `MVP`
- [ ] Classes de acordo com o DER

### J3 · Camadas DAO e BO
- **Prazo:** 14/11 · **Etiquetas:** `Java` `Fase 3 · API/Front` `MVP`
- [ ] DAO por entidade
- [ ] BO com as regras: expiração (15 dias), 3 👍 → CONFIRMADA, 3 👎 → RESOLVIDA, não avaliar a própria
- [ ] Cálculo de peso do trecho por perfil, horário e preferências do usuário
- [ ] Login simples (email + senha com hash)

### J4 · Controllers (GET/POST/PUT/DELETE)
- **Prazo:** 14/11 · **Etiquetas:** `Java` `Fase 3 · API/Front` `MVP`
- [ ] CRUD de todas as entidades
- [ ] Must: `POST /auth/login`, `POST /usuarios`, `POST/GET /ocorrencias`, `GET /trechos/pesos`
- [ ] Should: `/ocorrencias/{id}/confirmacoes`, `/usuarios/{id}/ocorrencias`, `/usuarios/{id}/preferencias`, `/ranking/bairros`
- [ ] Filtros em `GET /ocorrencias`
- [ ] CORS para o front

### J5 · Tratamento de exceções
- **Prazo:** 15/11 · **Etiquetas:** `Java` `Fase 3 · API/Front`
- [ ] `@ControllerAdvice` com o JSON de erro padrão
- [ ] `RecursoNaoEncontradoException` (404) e `RegraNegocioException` (400/422)

### J6 · Deploy no Render ⚠️ 30 pts
- **Prazo:** 15/11 · **Etiquetas:** `Java` `Fase 3 · API/Front` `Entrega`
- [ ] Dockerfile ou build do Render configurado *(dica: subir um hello world já no J1)*
- [ ] Variáveis de ambiente do Oracle no Render
- [ ] Testar todos os endpoints na URL pública
- [ ] Passar a URL para o Rickk, o Dudu e a Lau

## 🎨 Front (Next.js) — Rickk

### F1 · Setup do projeto
- **Prazo:** 12/11 · **Etiquetas:** `Front` `Fase 3 · API/Front`
- [ ] Next.js + TypeScript + Tailwind em `front-next/`
- [ ] Mocks em `src/mocks/` no formato da tabela de endpoints (G3)
- [ ] Deploy inicial na Vercel

### F2 · Login, criar conta e mapa
- **Prazo:** 13/11 · **Etiquetas:** `Front` `Fase 3 · API/Front` `MVP`
- [ ] Telas de login e criar conta (US01, US02)
- [ ] React Leaflet + OSM com os alertas (US04)
- [ ] Marcadores por tipo (cor + ícone), incluindo alagamento (US05)
- [ ] Filtros Acessibilidade / Segurança / Alagamento
- [ ] Interface acessível em todas as telas (US07)

### F3 · Enviar alerta e detalhe
- **Prazo:** 14/11 · **Etiquetas:** `Front` `Fase 3 · API/Front` `MVP`
- [ ] Formulário (foto, categoria, local no mapa) (US03, US05)
- [ ] *(Should)* Detalhe da ocorrência com 👍/👎 (US08, US10)

### F4 · Tela de rota sugerida
- **Prazo:** 15/11 · **Etiquetas:** `Front` `Fase 3 · API/Front` `MVP`
- [ ] Origem, destino e perfil (US06)
- [ ] *(Should)* Escolher quais tipos de alerta a rota considera (US12)
- [ ] Comparação rota comum × Caminho Livre (com JSON mockado no formato do DP5)

---

# FASE 4 · Integração (16–18/11)

### F5 · Perfil, histórico e ranking *(Should: cortar se apertar)*
- **Responsável:** Rickk · **Prazo:** 16/11 · **Etiquetas:** `Front` `Fase 4 · Integração`
- [ ] Onboarding de perfil e editar perfil com foto e nome (US13, US14)
- [ ] Minhas ocorrências (US11)
- [ ] Ranking de bairros (US15)

### F6 · Integração front ↔ API
- **Responsável:** Rickk + Ulisses · **Prazo:** 17/11 · **Etiquetas:** `Front` `Java` `Fase 4 · Integração` `MVP`
- [ ] Trocar os mocks por `NEXT_PUBLIC_API_URL` (Render)
- [ ] Testar o fluxo completo: criar conta → login → enviar alerta → mapa → rota
- [ ] Corrigir divergências de contrato com o Ulisses
- [ ] Prints das telas para Agile (A5) e Java (J7)

### DP5 · Integração da rota, README e entrega
- **Responsável:** Dudu · **Prazo:** 18/11 · **Etiquetas:** `Dynamic Programming` `Fase 4 · Integração` `Entrega`
- [ ] Ler de `GET /trechos/pesos` (com fallback para o mock)
- [ ] Gerar o JSON de rota consumido pela tela F4
- [ ] README com RMs, nomes, algoritmos e funcionalidades
- [ ] ZIP único no Teams

### A5 · Protótipo de 3+ telas (20 pts)
- **Responsável:** Rickk · **Prazo:** 17/11 · **Etiquetas:** `Agile` `Fase 4 · Integração`
- [ ] Login/onboarding, Mapa, Enviar alerta, Rota acessível (+ detalhe 👍/👎), a partir dos prints do F6
- [ ] Comentários de UX em cada tela (acessibilidade, contraste, número de toques), ligados à US07
- [ ] Matriz de rastreabilidade (já em `agile/backlog.md`)

### DB4 · Consultas do projeto
- **Responsável:** Caio · **Prazo:** 16/11 · **Etiquetas:** `Database` `Fase 4 · Integração`
- [ ] 6 consultas em `scripts/03_consultas.sql` (GROUP BY, JOIN, HAVING, subquery, UPDATE de expiração)
- [ ] Comentar o objetivo de cada consulta
- [ ] Conferir que batem com os dados gerados pela API

### DB5 · Dicionário de dados e entrega
- **Responsável:** Caio · **Prazo:** 18/11 · **Etiquetas:** `Database` `Fase 4 · Integração` `Documentação` `Entrega`
- [ ] Dicionário (tabela, coluna, tipo, restrição, descrição)
- [ ] Justificativa da normalização (3FN)
- [ ] Juntar modelos + dicionário + scripts e enviar no Teams

### J7 · Documentação PDF de Java (30 pts)
- **Responsável:** Ulisses · **Prazo:** 18/11 · **Etiquetas:** `Java` `Fase 4 · Integração` `Documentação` `Entrega`
- [ ] Capa (nome do projeto, nomes completos, RMs), índice, descrição, justificativa, objetivos
- [ ] Diagrama de classes gerado a partir do código final
- [ ] Protótipos de tela (prints do F6), tabela de endpoints e DER
- [ ] Instruções de execução (ferramentas, versões, links do GitHub e do deploy, passo a passo)
- [ ] ZIP com PDF + link do GitHub + link do deploy → **Portal do Aluno**

---

# FASE 5 · Vídeo pitch + envio (18–19/11)

### A6 · Vídeo pitch de 3 min (20 pts)
- **Responsável:** Rickk (narração com o grupo) · **Prazo:** 19/11 (manhã) · **Etiquetas:** `Agile` `Fase 5 · Pitch` `Entrega`
- [ ] Roteiro (`docs/pitch.md`): problema → solução funcionando → impacto → ODS
- [ ] Gravar a tela do app **integrado** (fluxo do F6)
- [ ] Usar trechos do vídeo 3D (AR3) e da entrevista
- [ ] Narração feita por integrantes do grupo
- [ ] Upload no YouTube como **não listado** e testar o link em aba anônima
- [ ] Enviar o link também em Testing

### A7 · PDF único de Agile e entrega
- **Responsável:** Rickk · **Prazo:** 19/11 · **Etiquetas:** `Agile` `Fase 5 · Pitch` `Entrega`
- [ ] Juntar A1 a A5 + link do pitch em **um único PDF**, com todos os integrantes identificados
- [ ] Enviar no Teams

### G5 · Revisão cruzada e envio
- **Responsável:** todos · **Prazo:** 19/11 (até 18h) · **Etiquetas:** `Geral` `Fase 5 · Pitch` `Entrega`
- [ ] Cada um revisa o PDF de outra pessoa (nomes, RMs, links funcionando)
- [ ] Testar o deploy da API e do front
- [ ] Último commit antes das 23h55 (ideal: até 18h)
- [ ] Conferir que todas as 7 disciplinas foram enviadas (1 integrante por envio) e mover para `Enviado ✅`

### G4 · Registro de prompts
- **Responsável:** todos · **Prazo:** contínuo até 19/11 · **Etiquetas:** `Geral` `Documentação`
- [ ] Cada um registra em `prompts.md` os prompts que usou

---

# EM PARALELO (09–18/11)

## 🧮 Dynamic Programming — Dudu
*Começa com o mock e só encosta no app na Fase 4 (DP5).*

### DP1 · Grafo e mock de dados
- **Prazo:** 12/11 · **Etiquetas:** `Dynamic Programming` `Paralelo`
- [ ] `dados/grafo_mock.json` no formato combinado no G3 (com os locais reais do G1)
- [ ] Lista de adjacência em `grafo.py`

### DP2 · Dijkstra com pesos por perfil e horário
- **Prazo:** 14/11 · **Etiquetas:** `Dynamic Programming` `Paralelo` `MVP`
- [ ] Rota comum (só distância) × rota Caminho Livre
- [ ] Perfil PMR: degrau intransponível
- [ ] Penalidade noturna (19h–6h)

### DP3 · Memoização
- **Prazo:** 15/11 · **Etiquetas:** `Dynamic Programming` `Paralelo`
- [ ] Cache por (origem, destino, perfil, faixa horária)
- [ ] Medir o tempo com e sem cache

### DP4 · Tabulação
- **Prazo:** 16/11 · **Etiquetas:** `Dynamic Programming` `Paralelo`
- [ ] Rota de menor risco com no máximo X metros a mais (tabela de PD)

## 📊 Data Science — Dudu *(isolada: sem conexão com o app)*
*Usa o mesmo tema (segurança e acessibilidade de pedestres), mas é uma entrega independente. Não alimenta o banco, a API nem a rota.*

### DS1 · Coleta e preparo dos dados
- **Prazo:** 12/11 · **Etiquetas:** `Data Science` `Paralelo`
- [ ] Baixar a base (SSP-SP, SP156 ou GeoSampa) e registrar a fonte
- [ ] Limpeza: datas, horários, bairros, nulos

### DS2 · Análise e teste de hipótese
- **Prazo:** 14/11 · **Etiquetas:** `Data Science` `Paralelo`
- [ ] Análise exploratória
- [ ] Teste estatístico (ex.: qui-quadrado por faixa horária) ou modelo simples
- [ ] Gráficos (barras por hora, mapa de calor por bairro)

### DS3 · Interpretação
- **Prazo:** 16/11 · **Etiquetas:** `Data Science` `Paralelo`
- [ ] Responder à hipótese com os resultados
- [ ] Descrever como a análise **poderia** ser usada no Caminho Livre no futuro (exigido em "possível uso na solução")

### DS4 · Conclusão e entrega
- **Prazo:** 18/11 · **Etiquetas:** `Data Science` `Paralelo` `Documentação` `Entrega`
- [ ] Conclusão curta: resultados, limitações e possível uso na solução
- [ ] Base, notebook, gráficos e links no Teams

## 🌐 Network — Lau

### N1 · Plano de endereçamento
- **Prazo:** 11/11 · **Etiquetas:** `Network` `Paralelo`
- [ ] Confirmar o número X da equipe
- [ ] Sub-redes de `192.168.X.0/24` para Equipe, Cidadão e Servidores/Sensores (+ gateways)

### N2 · Topologia, VLANs e roteamento
- **Prazo:** 13/11 · **Etiquetas:** `Network` `Paralelo`
- [ ] Switch com VLANs 10/20/30 e trunk 802.1Q
- [ ] Router-on-a-stick com subinterfaces

### N3 · Serviços
- **Prazo:** 14/11 · **Etiquetas:** `Network` `Paralelo`
- [ ] DHCP com um pool por VLAN (exclusões)
- [ ] NAT/PAT até o roteador provedor + servidor "internet"
- [ ] Servidor com DNS e HTTP (página com a Ficha da CitizenTech)

### N4 · Segurança
- **Prazo:** 15/11 · **Etiquetas:** `Network` `Paralelo`
- [ ] ACL estendida: o Wi-Fi do cidadão acessa só HTTP/DNS do servidor e a internet
- [ ] SSH, senhas e `enable secret`
- [ ] Wi-Fi WPA2

### N5 · Testes e PDF
- **Prazo:** 17/11 · **Etiquetas:** `Network` `Paralelo` `Documentação` `Entrega`
- [ ] Prints: ping entre VLANs, DHCP, página por nome, `show ip nat translations`, acesso bloqueado pela ACL
- [ ] PDF: Ficha, topologia, plano de endereçamento, trechos de `show running-config`, testes
- [ ] Enviar `.pkt` + PDF

## 🥽 AR/VR — Lau

### AR1 · Roteiro e storyboard
- **Prazo:** 13/11 · **Etiquetas:** `AR/VR` `Paralelo`
- [ ] Roteiro de 50 s (`ar-vr/README.md`)
- [ ] Escolher a ferramenta (Blender, Unity, Spline...)

### AR2 · Modelagem da cena 3D
- **Prazo:** 16/11 · **Etiquetas:** `AR/VR` `Paralelo`
- [ ] Rua noturna, calçada com degrau, poste apagado, personagens
- [ ] Rota comum × rota Caminho Livre

### AR3 · Vídeo e entrega
- **Prazo:** 18/11 · **Etiquetas:** `AR/VR` `Paralelo` `Entrega`
- [ ] Renderizar e editar (30–60 s)
- [ ] Upload no YouTube e testar o link
- [ ] PDF com nomes e link → Teams
- [ ] Passar trechos para o pitch (A6)

---

## 🔗 Dependências críticas

| Card | Depende de | Libera |
|---|---|---|
| A4 (backlog/MVP) | G1, A1–A3 | DB1, G3 |
| DB1 (DER) | A4 | DB2, J2, G3 |
| DB2/DB3 (banco no Oracle) | DB1 | J6 (deploy) |
| G3 (contratos/mocks) | DB1 | F1, DP1 |
| J6 (API no Render) | J1–J5, DB2 | F6, DP5 |
| F6 (front integrado) | J6, F1–F4 | A5, J7, A6 |
| AR3 (vídeo 3D) | AR2 | A6 |
| A6 (pitch) | F6, AR3 | A7, G5 |
| Data Science | — | — *(isolada)* |

## 📊 Carga por pessoa
| Pessoa | Cards | Entregas |
|---|---|---|
| Caio | 5 | Database |
| Ulisses | 7 (+F6 junto) | Java (Portal do Aluno) |
| Rickk | 12 + G1/G2 | Agile, pitch |
| Dudu | 9 | Dynamic Programming, Data Science |
| Lau | 8 | Network, AR/VR |
