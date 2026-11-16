# Caminho Livre

**O mapa da cidade que mostra o que o GPS não vê.**

Projeto da **Global Solution 2026.2 — CitizenTech** da FIAP (Engenharia de Software, 2º ano, turma 2ESPV), do **Grupo OctoFlow**.

## O projeto

Quem anda a pé (idosos, cadeirantes, pais com carrinho de bebê, quem volta à noite) não sabe de antemão onde há degrau, buraco, calçada quebrada, rua escura ou alagamento. O Caminho Livre é um app web colaborativo em que:

- o usuário **avisa um problema na rua** com foto, categoria e local;
- a comunidade **confirma ou nega** os alertas, e os não confirmados expiram;
- o app sugere uma **rota acessível** que desvia dos alertas, comparada com a rota comum.

## Arquitetura

```
Usuário ──▶ Front Next.js (Vercel) ──HTTP──▶ API Java Spring Boot (Render) ──JDBC──▶ Oracle (FIAP)
                                               └─ rota por ruas reais (OpenRouteService)
```

Dynamic Programming (Python), Data Science, Network e AR/VR são entregas **isoladas** e não se conectam ao app.

## Estrutura do repositório

| Pasta | Disciplina |
|---|---|
| [`agile/`](agile/) | Agile Methodology With Squad Framework: personas, casos de uso, [backlog](agile/backlog.md), protótipo e pitch |
| [`api-java/`](api-java/) | Domain Driven Design – Java: API REST |
| [`database/`](database/) | Database Design: modelos e scripts SQL |
| [`front-next/`](front-next/) | Front-end web (apoio ao Agile e ao Java) |
| [`dynamic-programming/`](dynamic-programming/) | Dynamic Programming: algoritmo de rota em Python (isolado) |
| [`data-science/`](data-science/) | Data Science & Statistical Computing (isolado) |
| [`network/`](network/) | Network Architect Solutions: rede no Packet Tracer |
| [`ar-vr/`](ar-vr/) | AR-VR Modelling And Simulation: vídeo 3D |
| [`docs/`](docs/) | Material comum: fotos de campo e pitch |
| [`specs/`](specs/) | Especificações geradas com o [spec-kit](https://github.com/github/spec-kit) (API e front) |

## Grupo OctoFlow

| Integrante | RM |
|---|---|
| Henrique Castro de Matos | 564560 |
| Caio Nascimento Caminha | 564789 |
| Eduardo Ulisses Pereira da Silva | 566339 |
| Eduardo Duran Del Ciel | 562017 |
| Laura Tigre Amaral | 565281 |

**Entrega:** 19/11/2026, 23h55.

## Ferramentas de desenvolvimento

- **[spec-kit](https://github.com/github/spec-kit):** specs em `specs/` e princípios em `.specify/memory/constitution.md`. Fluxo: `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
- **[graphify](https://github.com/Graphify-Labs/graphify):** grafo de conhecimento do repositório para o Claude Code. Gerar com `/graphify .` (saída em `graphify-out/`).
