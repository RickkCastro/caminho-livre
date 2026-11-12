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
- **Seu Antônio, 74 anos:** mora em rua que alaga. Usa pouco o celular e precisa de botões grandes e textos simples (US05).

## Atores e casos de uso
**Atores:** Usuário (inclui quem tem mobilidade reduzida, informado no perfil), Sistema, Google (autenticação), Administrador *(Won't, aparece só no escopo total)*

| Caso de uso | Atores | Prioridade |
|---|---|---|
| Entrar com Google | Usuário, Google | Must |
| Sair da conta | Usuário | Must |
| Excluir conta | Usuário | Should |
| Enviar alerta (inclui alagamento) | Usuário | Must |
| Consultar alertas no mapa | Usuário | Must |
| Calcular rota acessível | Usuário, Sistema | Must |
| Avaliar alerta (👍/👎) | Usuário | Should |
| Ver detalhe da ocorrência | Usuário | Should |
| Ver minhas ocorrências | Usuário | Should |
| Personalizar rota e perfil (onboarding) | Usuário | Should |
| Ver ranking de bairros | Usuário | Should |
| Expirar alertas não confirmados | Sistema | Should |
| Favoritar rota · pontuar · ranking de usuários · acompanhar trajeto | Usuário | Could |
| Painel de indicadores | Administrador | Won't |
| Conectar-se a outros usuários | Usuário | Won't |

## Backlog
👉 **Backlog completo em [`backlog.md`](backlog.md)**, a partir do quadro MoSCoW da equipe: 22 histórias (6 Must, 9 Should, 5 Could, 2 Won't), 25 requisitos funcionais, 12 não funcionais e rastreabilidade para endpoints e tabelas.

**MVP (Must):** entrar com Google, sair da conta, enviar alerta (incluindo alagamento), ver alertas no mapa, rota acessível conforme alertas e interface acessível.

Pendente: **story points** via Planning Poker.

## Protótipo (telas)
1. **Entrar com Google + onboarding de perfil** (US01, US12)
2. **Mapa de alertas** com filtros Acessibilidade, Segurança e Alagamento (US03)
3. **Enviar alerta** (foto → categoria → local → enviar) (US02)
4. **Rota acessível** (rota comum × rota Caminho Livre) (US04)
5. *(extra)* **Detalhe da ocorrência com 👍/👎** (US07, US09)

As telas reais do [`front-next/`](../front-next/) podem ser usadas como protótipo, com os comentários de UX (contraste, fonte grande, poucos toques, linguagem simples), que atendem à US05.

## Matriz de rastreabilidade (diferencial)
Ver a seção "Rastreabilidade" em [`backlog.md`](backlog.md).

## Pitch (3 min)
| Tempo | Conteúdo |
|---|---|
| 0:00–0:30 | Problema, contado pelas personas |
| 0:30–2:00 | Solução funcionando (front + API + rota) |
| 2:00–2:40 | Ecossistema e impacto (indicadores) |
| 2:40–3:00 | ODS e encerramento |

> O mesmo vídeo serve para o pitch exigido em Testing.
