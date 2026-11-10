# 🚶 Caminho Livre — CitizenTech

> **Global Solution 2026.2 · FIAP · Engenharia de Software · 2º ano (Fev)**
> Entrega final: **19/11/2026 às 23h55** (Teams / Portal do Aluno)

O mapa da cidade que mostra o que o GPS não vê: **calçadas intransitáveis, ruas escuras e trechos perigosos**, mapeados por quem anda a pé.

---

## 📋 Ficha da CitizenTech

| Campo | Resposta |
|---|---|
| **Nome** | Caminho Livre |
| **Cidade e bairro** | São Paulo — entorno da FIAP Paulista *(ajustar após a observação de campo)* |
| **Cidadão beneficiado** | Pessoas com mobilidade reduzida (cadeirantes, idosos, pais com carrinho de bebê) e pedestres que voltam a pé à noite |
| **Problema, em uma frase** | Quem anda a pé não sabe quais calçadas são intransitáveis nem quais ruas estão escuras ou perigosas, e os apps de rota ignoram isso. |
| **Como funciona** | Cidadãos registram ocorrências (foto + categoria + local). A comunidade confirma; relatos sem confirmação expiram. O sistema calcula rotas que evitam obstáculos e trechos inseguros, com pesos que variam pelo perfil do usuário e pelo horário. Alertas negados pela comunidade são marcados como resolvidos. |
| **O que cada parte faz** | Ver [Partes da solução](#-partes-da-solução) |
| **Link do repositório** | *(preencher)* |
| **Indicador de impacto** | % de obstáculos/trechos escuros evitados por rota · ocorrências resolvidas por mês · tempo médio até a resolução |
| **ODS conectados** | **ODS 10** (redução das desigualdades) · **ODS 11** (cidades e comunidades sustentáveis) · **ODS 3** (saúde e bem-estar) · **ODS 9** (inovação e infraestrutura) |

### As seis perguntas do briefing
1. **Quem é o cidadão beneficiado?** Pessoas com mobilidade reduzida e pedestres noturnos, especialmente mulheres e estudantes.
2. **Qual problema será resolvido?** Falta de informação sobre acessibilidade e segurança das ruas no deslocamento a pé.
3. **Como a solução funcionará?** Mapeamento colaborativo, validação comunitária e roteamento com pesos por perfil e horário.
4. **Quais tecnologias?** Oracle, Java Spring Boot (API REST no Render), Next.js, Python (grafos/PD e análise de dados), rede projetada no Packet Tracer.
5. **Quem participa do ecossistema?** Cidadãos, pessoas com deficiência, coletivos de bairro, subprefeitura/zeladoria (SP156) e concessionária de iluminação.
6. **Como medir e ampliar o impacto?** Indicadores acima, piloto em um bairro e expansão por bairros com dados abertos (OpenStreetMap, SSP-SP, iluminação pública).

---

## 🧩 Partes da solução

```
            ┌──────────────┐        ┌──────────────────────┐
 Cidadão ──▶│  Front Next  │──HTTP─▶│  API Java Spring     │──JDBC──▶  Oracle (FIAP)
            │  (Vercel)    │        │  (Render)            │
            └──────────────┘        └──────────┬───────────┘
                                               │ GET /trechos/pesos
                                    ┌──────────▼───────────┐
                                    │ Python — Dijkstra/PD │
                                    └──────────────────────┘
   Rede física do "Posto Caminho Livre" → Packet Tracer   ·   Experiência 3D → AR/VR
   Data Science → análise isolada do tema (não integra o app)
```

| Pasta | Disciplina | Responsável | O que entrega |
|---|---|---|---|
| [`database/`](database/) | Database Design | **Caio** | Modelo relacional, scripts SQL e consultas |
| [`api-java/`](api-java/) | Domain Driven Design – Java | **Ulisses** | API REST Spring Boot + Oracle, deploy no Render |
| [`agile/`](agile/) | Agile Methodology With Squad Framework | **Rickk** | Documentação de design (personas, casos de uso, backlog, protótipo, pitch) |
| [`front-next/`](front-next/) | *(apoio: protótipo e pitch)* | **Rickk** | Interface web em Next.js consumindo a API |
| [`dynamic-programming/`](dynamic-programming/) | Dynamic Programming | **Dudu** | Algoritmo de rota (grafos, memoização, tabulação) |
| [`data-science/`](data-science/) | Data Science & Statistical Computing | **Dudu** | Análise de dados do tema (entrega isolada, sem conexão com o app) |
| [`network/`](network/) | Network Architect Solutions | **Lau** | Rede do posto físico no Packet Tracer |
| [`ar-vr/`](ar-vr/) | AR-VR Modelling And Simulation | **Lau** | Vídeo 3D de 30–60 s |
| [`docs/`](docs/) | Comum | Todos | Entrevista, fotos, ficha, materiais do pitch |

---

## 🔗 Contratos de integração

Estes pontos precisam ser combinados **antes** de cada um codar:

1. **DER congelado (Caio → Ulisses):** nomes de tabelas e colunas definidos em `database/`. As classes Java seguem 1:1.
2. **Tabela de endpoints (Ulisses ↔ Rickk):** mantida em `api-java/README.md`. O front consome exatamente esse contrato.
3. **Formato do grafo (Ulisses ↔ Dudu):** `GET /trechos/pesos?idUsuario=&hora=` retorna
   ```json
   [{ "origem": 1, "destino": 2, "distanciaM": 120, "peso": 3.5 }]
   ```
4. **URL do deploy (Ulisses → todos):** o front aponta para o Render, e a rede usa o nome no DNS do servidor.

### Modelo de domínio compartilhado
| Entidade | Papel |
|---|---|
| `USUARIO` | Pedestre ou pessoa com mobilidade reduzida, com foto e pontos |
| `CATEGORIA_OCORRENCIA` | Tipo de problema (acessibilidade, segurança ou clima/alagamento) com peso base e noturno |
| `LOCALIZACAO` | Ponto geográfico (lat/long, logradouro, bairro) |
| `OCORRENCIA` | Relato do cidadão, com status `ABERTA → CONFIRMADA → RESOLVIDA` ou `EXPIRADA` |
| `CONFIRMACAO` | Usuário confirma ou nega uma ocorrência (único por usuário/ocorrência) |
| `TRECHO` | Aresta do grafo entre duas localizações, com distância e iluminação |
| `PREFERENCIA_ROTA` | Quais categorias de alerta a rota de cada usuário considera |
| `ROTA_FAVORITA` | *(Could)* Rotas favoritas do usuário |

Backlog priorizado (MoSCoW): [`agile/backlog.md`](agile/backlog.md)

---

## 📅 Cronograma

Tarefas detalhadas (cards do Trello): [`TAREFAS.md`](TAREFAS.md)

| Data | Marco |
|---|---|
| **09–11/11** | Fase 1: pesquisa de campo, Ficha, personas, casos de uso e **backlog do MVP** |
| **11–12/11** | Fase 2: **DER congelado**, banco criado e populado no Oracle |
| **12–15/11** | Fase 3: **API** (no Render até 15/11) e **front** em paralelo, com mocks |
| **16–18/11** | Fase 4: **integração** front + API + rota e PDFs técnicos |
| **18–19/11** | Fase 5: **vídeo pitch** com o app integrado, revisão cruzada e envio até 18h |
| **09–18/11** | Em paralelo: Network, AR/VR, Dynamic Programming e Data Science (isolada) |

---

## ✅ Combinados da equipe
- **Simples primeiro:** uma função que funciona vale mais que dez pela metade.
- **Pensem em quem usa:** letra legível, bom contraste, linguagem simples.
- **IA como copiloto:** todo prompt usado vai para [`prompts.md`](prompts.md), e cada um sabe explicar cada linha.
- **Dados com cuidado:** nada de dados pessoais reais. Usem dados simulados ou públicos e citem a fonte.
- **Todo mundo constrói:** cada integrante sabe explicar o projeto inteiro.
- ⚠️ **Nenhum commit após 19/11 às 23h55** (zera a parte técnica de Java).

## 👥 Equipe
| Nome | RM | Partes |
|---|---|---|
| Caio | *RM* | Database |
| Ulisses | *RM* | Java |
| Rickk | *RM* | Agile, Front |
| Dudu | *RM* | Dynamic Programming, Data Science |
| Lau | *RM* | Network, AR/VR |
