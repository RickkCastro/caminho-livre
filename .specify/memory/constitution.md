# Caminho Livre Constitution

<!--
Sync Impact Report
- Version: 1.0.0 → 1.1.0 (rota passa a ser calculada na API Java; Python e Data Science isolados)
- Version: (template) → 1.0.0
- Princípios criados: I–V; seções: Restrições do projeto, Fluxo de trabalho
- Templates: plan/spec/tasks compatíveis (sem alteração necessária)
- Fonte: agile/backlog.md (MoSCoW, RF01–RF25, RNF01–RNF12)
-->

## Core Principles

### I. Backlog é a fonte da verdade
Toda spec, plano e tarefa DEVE rastrear para uma história (US01–US22) e seus requisitos (RF/RNF) de `agile/backlog.md`. Itens **Won't** (US21, US22) NÃO entram. Funcionalidade sem história não é implementada.

### II. MVP primeiro (MoSCoW)
Must (US01–US06) é entregue e demonstrável antes de qualquer Should; Should antes de Could. Cada história deve ser testável de forma independente.

### III. Acessibilidade não é opcional
Toda tela DEVE cumprir WCAG 2.1 AA (contraste ≥ 4,5:1, texto alternativo), fonte base ≥ 16 px, áreas de toque ≥ 48×48 px, ícone sempre acompanhado de texto e informação nunca transmitida apenas por cor. Enviar um alerta em até 4 toques.

### IV. Privacidade por padrão (LGPD)
Autenticação apenas via Google; o sistema não armazena senhas e valida o token no back-end. Coletar só nome, e-mail e foto. Quem enviou um alerta nunca é exibido publicamente. Excluir a conta apaga os dados pessoais e anonimiza os alertas. Toda comunicação usa HTTPS. Credenciais nunca são commitadas.

### V. Contrato único entre camadas
A tabela de endpoints de `api-java/README.md` e o DER de `database/README.md` são o contrato. Front, API e cálculo de rota usam os mesmos nomes e formatos (incluindo o formato de erro padrão). Mudança de contrato exige atualizar os dois READMEs no mesmo commit.

## Restrições do projeto

- API REST em Java 21 + Spring Boot, banco Oracle (FIAP), camadas model / DAO / BO / controller / exception; deploy no Render até 15/11.
- Front em Next.js (App Router) + TypeScript + Tailwind + React Leaflet, mobile first; deploy na Vercel.
- Cálculo de rota (Dijkstra) na própria API Java (`GET /rotas`). Dynamic Programming (Python) e Data Science são entregas isoladas e não integram o app.
- Desempenho: mapa com alertas em ≤ 3 s e rota em ≤ 5 s em 4G.
- Entrega final 19/11, 23h55; commits após o prazo zeram a parte técnica.

## Fluxo de trabalho

- Specs em `specs/NNN-nome/` via `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
- Código versionado no GitHub; mensagens de commit em português.
- Revisão: antes do merge, conferir rastreabilidade (história → RF → endpoint → tabela) e os critérios de acessibilidade.

## Governance

Esta constituição prevalece sobre outras práticas do repositório. Emendas: alterar este arquivo, subir a versão (MAJOR remove/redefine princípio, MINOR adiciona, PATCH esclarece) e registrar no Sync Impact Report.

**Version**: 1.1.0 | **Ratified**: 2026-11-12 | **Last Amended**: 2026-11-12
