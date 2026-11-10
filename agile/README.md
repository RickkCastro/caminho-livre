# 🧭 Agile Methodology With Squad Framework — Rickk

**Disciplina:** Agile Methodology With Squad Framework · **Entrega:** Teams até 19/11, 23h55

## Conceito
Documentação completa do design da solução Caminho Livre, aplicando as técnicas do ano.

## Entregáveis (PDF único, com todos os membros identificados)
| # | Item | Pontos | Status |
|---|---|---|---|
| 1 | Apresentação descritiva da ideia (problema, foco, público-alvo, solução e justificativas) | 10 | [ ] |
| 2 | Persona(s) com descrição narrativa | 10 | [ ] |
| 3 | Diagrama de casos de uso (escopo total, todos os atores) | 20 | [ ] |
| 4 | Backlog do produto: histórias, MoSCoW, story points (Planning Poker), MVP destacado | 20 | [ ] |
| 5 | Protótipo de **no mínimo 3 telas**, com comentários de UX | 20 | [ ] |
| 6 | Vídeo pitch de até 3 min, narrado pelo grupo (YouTube **não listado**) | 20 | [ ] |

> ⚠️ Mais de um PDF ou entrega por link externo (Google Docs etc.) custa **-10 pontos**. Vídeo inacessível vale zero no item.
> A **coerência entre os entregáveis** também é avaliada.

## Personas (rascunho)
- **Dona Marta, 68 anos:** usa andador e mora a 600 m do posto de saúde. Desiste de sair quando a calçada está quebrada.
- **Júlia, 21 anos:** estudante que sai da faculdade às 23h e caminha até o metrô. Muda de rota "no feeling" quando a rua está escura.
- **Sr. Roberto, gestor da subprefeitura:** recebe reclamações espalhadas e não sabe o que priorizar.

## Atores e casos de uso
**Atores:** Cidadão, Pessoa com mobilidade reduzida (PMR), Gestor público, Contato de confiança, Sistema (agendador)

| Caso de uso | Atores |
|---|---|
| Cadastrar-se / autenticar | Cidadão, PMR, Gestor |
| Registrar ocorrência | Cidadão, PMR |
| Confirmar ou negar ocorrência | Cidadão, PMR |
| Consultar mapa de ocorrências | Todos |
| Calcular rota acessível/segura | Cidadão, PMR |
| Salvar rota frequente | Cidadão, PMR |
| Compartilhar trajeto | Cidadão, Contato de confiança |
| Resolver ocorrência | Gestor |
| Visualizar painel do bairro | Gestor |
| Expirar ocorrências antigas | Sistema |

## Backlog (rascunho)
| ID | História | MoSCoW | SP |
|---|---|---|---|
| US01 | Como cidadão, quero registrar uma ocorrência com foto e local para alertar outras pessoas | **Must (MVP)** | *poker* |
| US02 | Como pedestre, quero ver no mapa os obstáculos e as ruas perigosas próximas | **Must (MVP)** | |
| US03 | Como cidadão, quero confirmar uma ocorrência para que o mapa seja confiável | **Must (MVP)** | |
| US04 | Como PMR, quero uma rota que evite obstáculos de acessibilidade | **Must (MVP)** | |
| US05 | Como gestor, quero marcar uma ocorrência como resolvida | Should | |
| US06 | Como pedestre, quero salvar minhas rotas frequentes | Should | |
| US07 | Como gestor, quero um painel de ocorrências por bairro | Should | |
| US08 | Como pedestre, quero compartilhar meu trajeto com um contato | Could | |
| US09 | Como cidadão, quero que a IA classifique a foto automaticamente | Won't (agora) | |

## Protótipo (telas)
1. **Mapa** com camadas Acessibilidade e Segurança
2. **Registrar ocorrência** (foto → categoria → local → enviar)
3. **Rota sugerida** (rota comum × rota Caminho Livre)
4. *(extra)* **Painel do gestor**

As telas reais do [`front-next/`](../front-next/) podem ser usadas como protótipo, com os comentários de UX (contraste, fonte grande, poucos toques, linguagem simples).

## Matriz de rastreabilidade (diferencial)
| Caso de uso | História | Endpoint | Tabela |
|---|---|---|---|
| Registrar ocorrência | US01 | `POST /ocorrencias` | OCORRENCIA |
| Consultar mapa | US02 | `GET /ocorrencias` | OCORRENCIA, LOCALIZACAO |
| Confirmar ocorrência | US03 | `POST /ocorrencias/{id}/confirmacoes` | CONFIRMACAO |
| Calcular rota | US04 | `GET /trechos/pesos` + Python | TRECHO |
| Resolver ocorrência | US05 | `PUT /ocorrencias/{id}/resolver` | OCORRENCIA |

## Pitch (3 min)
| Tempo | Conteúdo |
|---|---|
| 0:00–0:30 | Problema, com a fala da pessoa entrevistada |
| 0:30–2:00 | Solução funcionando (front + API + rota) |
| 2:00–2:40 | Ecossistema e impacto (indicadores) |
| 2:40–3:00 | ODS e encerramento |

> O mesmo vídeo serve para o pitch exigido em Testing.
