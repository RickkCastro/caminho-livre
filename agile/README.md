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
- **Seu Antônio, 74 anos:** mora em rua que alaga. Usa pouco o celular e precisa de botões grandes e textos simples (US07).

## Atores e casos de uso
**Atores:** Pedestre, Pessoa com mobilidade reduzida (PMR), Sistema, Administrador *(Won't, aparece só no escopo total)*

| Caso de uso | Atores | Prioridade |
|---|---|---|
| Criar conta / fazer login | Pedestre, PMR | Must |
| Enviar alerta (inclui alagamento) | Pedestre, PMR | Must |
| Consultar alertas no mapa | Pedestre, PMR | Must |
| Calcular rota acessível | Pedestre, PMR, Sistema | Must |
| Avaliar alerta (👍/👎) | Pedestre, PMR | Should |
| Ver detalhe da ocorrência | Pedestre, PMR | Should |
| Ver minhas ocorrências | Pedestre, PMR | Should |
| Personalizar rota e perfil (onboarding) | Pedestre, PMR | Should |
| Ver ranking de bairros | Pedestre, PMR | Should |
| Expirar alertas não confirmados | Sistema | Should |
| Favoritar rota · pontuar · ranking de usuários · acompanhar trajeto | Pedestre, PMR | Could |
| Painel de indicadores | Administrador | Won't |
| Conectar-se a outros usuários | Pedestre | Won't |

## Backlog
👉 **Backlog completo em [`backlog.md`](backlog.md)**, a partir do quadro MoSCoW da equipe: 22 histórias (7 Must, 8 Should, 5 Could, 2 Won't), com rastreabilidade para endpoints e tabelas.

**MVP (Must):** criar conta, login, enviar alerta, ver alertas no mapa, alerta de alagamento, rota acessível conforme alertas e interface acessível.

Pendente: **story points** via Planning Poker.

## Protótipo (telas)
1. **Login / criar conta + onboarding de perfil** (US01, US02, US13)
2. **Mapa de alertas** com filtros Acessibilidade, Segurança e Alagamento (US04, US05)
3. **Enviar alerta** (foto → categoria → local → enviar) (US03)
4. **Rota acessível** (rota comum × rota Caminho Livre) (US06)
5. *(extra)* **Detalhe da ocorrência com 👍/👎** (US08, US10)

As telas reais do [`front-next/`](../front-next/) podem ser usadas como protótipo, com os comentários de UX (contraste, fonte grande, poucos toques, linguagem simples), que atendem à US07.

## Matriz de rastreabilidade (diferencial)
Ver a seção "Rastreabilidade" em [`backlog.md`](backlog.md).

## Pitch (3 min)
| Tempo | Conteúdo |
|---|---|
| 0:00–0:30 | Problema, com a fala da pessoa entrevistada |
| 0:30–2:00 | Solução funcionando (front + API + rota) |
| 2:00–2:40 | Ecossistema e impacto (indicadores) |
| 2:40–3:00 | ODS e encerramento |

> O mesmo vídeo serve para o pitch exigido em Testing.
