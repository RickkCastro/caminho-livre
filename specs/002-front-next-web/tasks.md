---
description: "Task list — Front-end web Caminho Livre (Next.js)"
---

# Tasks: Front-end web Caminho Livre (Next.js)

**Input**: `specs/002-front-next-web/` (plan, spec, research, data-model, contracts/telas.md, quickstart)

**Tests**: Playwright + axe nos fluxos P1 e na acessibilidade (plan.md). Demais histórias validadas pelo [quickstart](quickstart.md).

**Raiz**: `front-next/` (abreviado `…/` = `front-next/src/`).

**Labels**: `[USn]` = história *n* da spec 002. Equivalência com o backlog: US1 = US01+US06 · US2 = US03 · US3 = US02 · US4 = US04+US11 · US5 = US05 · US6 = US07+US09 · US7 = US12+US13 · US8 = US10+US11 · US9 = US14 · US10 = US15 · US11 = US16–US19.

## Phase 1: Setup

- [X] T001 Criar o app com `create-next-app` (TypeScript, App Router, Tailwind 4, `src/`) em `front-next/` e adicionar `react-leaflet`, `leaflet`, `@vercel/blob`, `@playwright/test`, `@axe-core/playwright` em `front-next/package.json`
- [X] T002 [P] Criar `front-next/.env.example` com `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_USE_MOCKS=true`
- [X] T003 [P] Configurar Playwright (viewport 375×812, servidor `npm run dev` com mocks) em `front-next/playwright.config.ts`

## Phase 2: Foundational (bloqueia todas as histórias)

- [X] T004 Definir tokens no `@theme` (`--color-marca-escuro: #2A4B25`, `--color-marca-agua: #76C1A9`, `--color-fundo: #FFFFFF`, `--color-tipo-acessibilidade: #1F5FAD`, `--color-tipo-seguranca: #B3261E`, `--color-tipo-clima: #6A3FA0`), fonte base 16 px e `:focus-visible` com contorno `#2A4B25` em `…/app/globals.css`
- [X] T005 [P] Criar tipos do contrato (`Usuario`, `Categoria`, `OcorrenciaResumo`, `OcorrenciaDetalhe` com `minha`, `NovaOcorrencia` com descricao ≤ 500, `Preferencia`, `Rota`, `ErroApi { status, erro }`) em `…/lib/tipos.ts`
- [X] T006 [P] Criar mocks no formato do contrato da API (`categorias.json`, `ocorrencias.json`, `ocorrencia-1.json`, `rotas.json`, `usuario.json`, `ranking-bairros.json`) em `…/mocks/`
- [X] T007 Criar `…/lib/api.ts`: `fetch` com `NEXT_PUBLIC_API_URL`, header `Authorization: Bearer` quando houver sessão (inclusive GETs públicos, para `minha`), leitura dos mocks se `NEXT_PUBLIC_USE_MOCKS=true` ou sem `NEXT_PUBLIC_API_URL`, timeout de 60 s com estado "Acordando o servidor…", e conversão do erro em `ErroApi`
- [X] T008 [P] Criar componentes base acessíveis (alvos ≥ 48×48 px, ícone + texto): `Botao` (principal: fundo `#2A4B25` texto branco; secundário: contorno e texto `#2A4B25`), `Aviso` (`role="status"`/`role="alert"`) em `…/components/`
- [X] T009 Criar `layout.tsx` com `lang="pt-BR"`, cabeçalho branco com logo `#76C1A9` (componente `Casca`), navegação Mapa · Rota · Avisar · Perfil (inferior no celular, no cabeçalho ≥ 768 px) e aviso de sem internet (`navigator.onLine`) em `…/app/layout.tsx`

**Checkpoint**: app sobe com mocks, layout e cores aplicados.

## Phase 3: US1 — Entrar e sair (P1, MVP)

**Goal**: login Google e "Sair". **Test**: quickstart 3, 9, 10.

- [X] T010 [US1] Criar `…/lib/sessao.ts`: carregar Google Identity Services, `entrar()` → `POST /auth/google` → salvar `{ usuario, idToken, expiraEm }` em `localStorage` (`cl.sessao`); `renovar()` via `google.accounts.id.prompt()` com `auto_select`; `sair()` apaga `cl.sessao` e `cl.rascunho`; hook `useSessao()`
- [X] T011 [US1] Em `…/lib/api.ts`, ao receber 401: `renovar()` e repetir a chamada uma vez; se falhar, redirecionar a `/login?voltar=<rota>` mantendo o rascunho
- [X] T012 [US1] Criar tela `/login` com botão "Entrar com Google", mensagem "Não foi possível entrar. Tente de novo." e retorno a `voltar`; se `primeiroAcesso`, ir a `/onboarding` em `…/app/login/page.tsx`
- [X] T013 [US1] Criar guarda `exigirLogin()` usada pelas telas 🔒 do contrato de telas em `…/lib/sessao.ts`
- [X] T014 [US1] Botão "Sair" no perfil com volta a `/` (cabeçalho mostra inicial/foto que leva ao perfil) em `…/app/perfil/page.tsx`

## Phase 4: US2 — Ver alertas no mapa (P1, MVP)

**Goal**: mapa público com filtros. **Test**: quickstart 1–2.

- [X] T015 [P] [US2] Criar `Mapa` client-only (`dynamic(..., { ssr: false })`), OpenStreetMap, centro na posição do usuário ou no centro de SP com aviso em texto se o GPS for negado, em `…/components/Mapa.tsx`
- [X] T016 [P] [US2] Criar marcadores `divIcon` com forma + cor + rótulo por tipo (círculo Acessibilidade, triângulo Segurança, gota Clima) e `aria-label` em `…/components/MarcadorAlerta.tsx`
- [X] T017 [US2] Criar `FiltroTipos` (três chips; ativo com fundo `#76C1A9` e texto `#2A4B25`, `aria-pressed`) em `…/components/FiltroTipos.tsx`
- [X] T018 [US2] Montar a tela `/` com `GET /ocorrencias?tipo=`, filtros, resumo ao tocar no marcador (link para o detalhe), estado vazio "Nenhum problema avisado por aqui" e botão "Avisar problema" em `…/app/page.tsx`

## Phase 5: US3 — Enviar alerta em até 4 toques (P1, MVP)

**Goal**: foto → categoria → local → enviar. **Test**: quickstart 3–5, 12.

- [X] T019 [P] [US3] Criar `…/app/api/upload/route.ts` com `handleUpload` do Vercel Blob aceitando só `image/*` e ≤ 2 MB; em `onBeforeGenerateToken`, exigir `Authorization: Bearer <idToken>` válido (verificado com `google-auth-library`, audience = `NEXT_PUBLIC_GOOGLE_CLIENT_ID`) e responder 401 sem token
- [X] T020 [P] [US3] Criar `reduzirFoto(file)` (canvas, lado maior ≤ 1280 px, JPEG 0,8) em `…/lib/foto.ts`
- [X] T021 [US3] Criar tela `/ocorrencias/nova` 🔒: foto opcional (se o upload falhar, avisar e permitir enviar sem foto) → categoria (`GET /categorias`, obrigatória) → local ("Usar minha localização" ou toque no mapa, obrigatório) → descrição opcional (≤ 500) → "Enviar" desabilitado com texto do que falta; rascunho em `sessionStorage` (`cl.rascunho`) em `…/app/ocorrencias/nova/page.tsx`
- [X] T022 [US3] Ao enviar: `POST /ocorrencias`; sucesso → "Alerta enviado" e volta ao mapa com o marcador novo; erro → mostrar `erro` da API mantendo os dados, em `…/app/ocorrencias/nova/page.tsx`

## Phase 6: US4 — Rota acessível comparada (P1, MVP)

**Goal**: rota comum × Caminho Livre. **Test**: quickstart 6–7.

- [X] T023 [P] [US4] Criar `BuscaEndereco` (Nominatim, debounce 1 s, mínimo 3 letras, `countrycodes=br`, cache em memória; atalho "Usar minha localização"; sem resultado → "Endereço não encontrado. Tente com o número ou o bairro.") em `…/components/BuscaEndereco.tsx`
- [X] T024a [US4] Criar o formulário da tela `/rota`: origem e destino por `BuscaEndereco` (origem começa em "Minha localização"), botão "Inverter", toque no mapa com seletor Origem/Destino (T048), checkbox "Tenho mobilidade reduzida" (visitante; logado usa o perfil), `ignorar` das preferências se logado (opcional: vazio até a T032 existir) e chamada `GET /rotas` em `…/app/rota/page.tsx`
- [X] T024b [US4] Desenhar o resultado da rota: comum tracejada e Caminho Livre contínua `#2A4B25`, legenda em texto e distâncias; `caminhoLivre = null` → mostrar `aviso`; 422 → mostrar `erro` em `…/components/ResultadoRota.tsx`

## Phase 7: US5 — Interface acessível (P1, MVP)

**Test**: quickstart 13–14.

- [X] T025 [US5] Teste e2e `acessibilidade.spec.ts`: axe sem violações críticas em `/`, `/login`, `/rota`, `/ocorrencias/nova`, `/ocorrencias/1`, `/perfil`, `/minhas`, `/ranking` em `front-next/tests/e2e/acessibilidade.spec.ts`
- [X] T026 [US5] Teste e2e `fluxos-mvp.spec.ts` com mocks: mapa + filtro, enviar alerta em ≤ 4 toques, rota com duas linhas em `front-next/tests/e2e/fluxos-mvp.spec.ts`
- [ ] T027 [US5] Revisar todas as telas com fonte do sistema em 200% e navegação só por teclado; corrigir cortes e ordem de foco nos componentes de `…/components/`

**Checkpoint MVP (front)**: US1–US5 com mocks.

## Phase 8: US6 — Detalhe e avaliação 👍/👎 (P2)

- [X] T028 [US6] Criar tela `/ocorrencias/[id]`: foto com `alt`, categoria, data, status em texto, totais; botões "Ainda está lá" / "Já foi resolvido" (`POST …/confirmacoes`), ocultos se `minha`, "Entre para avaliar" para visitante, desabilitados com "Você já avaliou" após avaliar ou em 409; sem nome do autor em `…/app/ocorrencias/[id]/page.tsx`

## Phase 9: US7 — Onboarding e perfil (P2)

- [X] T029 [US7] Criar tela `/onboarding` 🔒 ("Você tem mobilidade reduzida?" Sim/Não → `PUT /usuarios/{id}` → mapa) em `…/app/onboarding/page.tsx`
- [X] T030 [US7] Criar tela `/perfil` 🔒: editar nome, foto (via Blob) e mobilidade (`PUT /usuarios/{id}`), atualizar sessão e cabeçalho, botão "Sair" em `…/app/perfil/page.tsx`

## Phase 10: US8 — Minhas ocorrências e ajustes de rota (P2)

- [X] T031 [P] [US8] Criar tela `/minhas` 🔒 com lista (categoria, data, status em texto, totais) de `GET /usuarios/{id}/ocorrencias` em `…/app/minhas/page.tsx`
- [X] T032 [US8] Adicionar seção "Ajustar rota" no perfil (liga/desliga categorias, `GET/PUT /usuarios/{id}/preferencias`) em `…/app/perfil/page.tsx`

## Phase 11: US9 — Ranking de bairros (P2)

- [X] T033 [P] [US9] Criar tela `/ranking` com duas listas ordenadas (posição, bairro, alertas ativos) de `GET /ranking/bairros` em `…/app/ranking/page.tsx`

## Phase 12: US10 — Excluir conta (P2)

- [X] T034 [US10] Adicionar "Excluir minha conta" no perfil com diálogo acessível explicando o que é apagado e que os alertas ficam anônimos; confirmar → `DELETE /usuarios/{id}` → `sair()` → `/login` em `…/app/perfil/page.tsx`

## Phase 13: US11 — Pontos, ranking de usuários, favoritas (P3, Could)

- [X] T035 [US11] Mostrar pontos no perfil e "+10" / "+2" após enviar/avaliar em `…/app/perfil/page.tsx` e `…/app/ocorrencias/`
- [X] T036 [P] [US11] Aba "Pessoas" no ranking (`GET /ranking/usuarios`) em `…/app/ranking/page.tsx`
- [ ] T037 [US11] Criar `/favoritas` 🔒 (listar, abrir na rota, remover) e botão "Salvar rota" com apelido (≤ 60) na tela de rota em `…/app/favoritas/page.tsx` e `…/app/rota/page.tsx`

## Phase 13b: Ajustes de layout e mapa (2026-11-13)

- [X] T043 Layout minimalista e responsivo: mapa em tela cheia com filtros e "Avisar problema" flutuantes, cartões, ícones `lucide-react`, rota com painel lateral no desktop, em `…/components/` e `…/app/`
- [X] T044 Mocks automáticos sem `NEXT_PUBLIC_API_URL` em `…/lib/api.ts`
- [X] T045 Corrigir mapa em branco: `leaflet.css` global, `ResizeObserver` + `invalidateSize()`, tiles em `tile.openstreetmap.org`, enquadrar todos os pontos, em `…/components/MapaLeaflet.tsx` e `…/app/layout.tsx`
- [X] T046 Rota sem toque no mapa: origem e destino por endereço ou localização atual, "Inverter", em `…/app/rota/page.tsx` e `…/components/BuscaEndereco.tsx`

- [X] T047 Integração: enviar `bairro`/`logradouro` do alerta (Nominatim reverse), mapa abre na área da malha (Av. Paulista), foto do Google com `referrerPolicy="no-referrer"`, Playwright em porta própria (3100) sempre com mocks

- [X] T048 Rota: marcar origem/destino tocando no mapa (seletor flutuante, nome do ponto via `lib/endereco.ts`), alertas no mapa da rota e busca de endereço no Brasil inteiro, em `…/app/rota/page.tsx`

## Phase 14: Polish

- [ ] T038 Trocar mocks pela API do Render (`NEXT_PUBLIC_USE_MOCKS=false`) e corrigir divergências de contrato junto com a API 001 — **16/11: integração local (API em `localhost:8080` + Oracle FIAP) validada: mapa, detalhe (`minha`), ranking, rota, login Google, onboarding, enviar alerta (+10), meus alertas, preferências e DELETE do autor. Falta: avaliar 👍/👎, excluir conta, renovação do token após 1 h, foto (Blob) e repetir no Render**
- [ ] T039 Publicar na Vercel com as variáveis do `.env.example`; adicionar a URL da Vercel ao OAuth Client do Google e ao `FRONT_URL` da API
- [ ] T040 [P] Atualizar `front-next/README.md` com URL, variáveis e passo a passo
- [ ] T042 Teste de usabilidade com 3 pessoas pouco familiarizadas com tecnologia enviando um alerta sozinhas na primeira tentativa (SC-004); registrar resultado no PDF do Agile em `agile/`
- [ ] T041 Rodar todos os cenários de `specs/002-front-next-web/quickstart.md` no deploy, incluindo Lighthouse ≥ 95 e o tempo do mapa/rota em 4G simulado

## Dependencies

- Setup → Foundational → histórias. US1 (sessão) é pré-requisito das telas 🔒 (US3, US6 avaliação, US7, US8, US10, US11).
- US2 (mapa) é pré-requisito de US3 (marcar local) e US4 (desenhar rota). US5 roda depois de US1–US4.
- US6–US11 dependem só de Foundational + US1; T038 depende de a API 001 estar no Render (T047 da API).

## Parallel examples

- Foundational: T005, T006, T008 juntos.
- Depois do mapa (US2): US3 (T019–T022) ∥ US4 (T023–T024b).
- Should: T031, T033 em paralelo.

## Implementation Strategy

1. **MVP com mocks (até 15/11)**: Phases 1–7.
2. **Integração (16–17/11)**: T038–T039 com a API no Render.
3. **Demo do pitch**: + US6 (detalhe e 👍/👎).
4. **Should restante**: US7–US10; **Could** (US11) só se sobrar tempo antes de 19/11.
