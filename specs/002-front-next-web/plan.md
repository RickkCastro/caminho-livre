# Implementation Plan: Front-end web Caminho Livre (Next.js)

**Branch**: `002-front-next-web` | **Date**: 2026-11-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-front-next-web/spec.md`

## Summary

App web mobile first em Next.js que consome a API Java ([contrato](../001-api-rest-java/contracts/api.md)): mapa público de alertas com filtros, rota comum × Caminho Livre, envio de alerta em ≤ 4 toques (login Google), detalhe com 👍/👎, perfil/onboarding, histórico, ranking e exclusão de conta. Paleta `#2A4B25` / `#FFFFFF` / `#76C1A9` com regras de contraste (FR-014). Deploy na Vercel; mocks no formato da API enquanto o Render não está no ar.

## Technical Context

**Language/Version**: TypeScript 5, Node 20 LTS

**Primary Dependencies**: Next.js 15 (App Router), React 19, Tailwind CSS 4, react-leaflet 5 + Leaflet 1.9 (OpenStreetMap), Google Identity Services (script oficial), `@vercel/blob` (upload da foto), `google-auth-library` (validar o token no upload)

**Storage**: Sem banco no front. Sessão (usuário + ID token) em `localStorage`; fotos no Vercel Blob

**Testing**: Playwright + `@axe-core/playwright` para os fluxos P1 e a acessibilidade; sem testes unitários de componente

**Target Platform**: Navegadores atuais (Chrome, Safari, Edge), celular primeiro; Vercel

**Project Type**: web-app (front-end)

**Performance Goals**: mapa com alertas ≤ 3 s e rota ≤ 5 s em 4G simulado (SC-001)

**Constraints**: WCAG 2.1 AA (Lighthouse ≥ 95); Nominatim máx. 1 req/s; Render free dorme (cold start até ~60 s)

**Scale/Scope**: ~10 telas, demo acadêmica

## Constitution Check

| Princípio | Status | Como o plano atende |
|---|---|---|
| I. Backlog é a fonte da verdade | ✅ | Cada tela do [contrato de telas](contracts/telas.md) cita a US; sem US20–US22 |
| II. MVP primeiro | ✅ | Fases: login, mapa, enviar alerta, rota, acessibilidade (Must) → Should → Could |
| III. Acessibilidade | ✅ | Paleta validada (FR-014), alvos 48 px, fonte 16 px, ícone + texto, axe no Playwright |
| IV. Privacidade (LGPD) | ✅ | Sem autor nos alertas; "Sair" e exclusão apagam o `localStorage`; só HTTPS |
| V. Contrato único | ✅ | Tipos e mocks copiam o contrato da API 001; nenhum endpoint fora dele |

Pós-design: sem violações.

## Project Structure

### Documentation (this feature)

```text
specs/002-front-next-web/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/telas.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
front-next/
├── package.json
├── next.config.ts
├── .env.example                  NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID, BLOB_READ_WRITE_TOKEN, NEXT_PUBLIC_USE_MOCKS
├── src/
│   ├── app/
│   │   ├── layout.tsx            cabeçalho, fonte, paleta
│   │   ├── globals.css           tokens de cor (@theme)
│   │   ├── page.tsx              mapa (/)
│   │   ├── login/page.tsx
│   │   ├── onboarding/page.tsx
│   │   ├── ocorrencias/nova/page.tsx
│   │   ├── ocorrencias/[id]/page.tsx
│   │   ├── rota/page.tsx
│   │   ├── perfil/page.tsx
│   │   ├── minhas/page.tsx
│   │   ├── ranking/page.tsx
│   │   ├── favoritas/page.tsx     (Could)
│   │   └── api/upload/route.ts   token de upload do Vercel Blob
│   ├── components/               Mapa (client-only), Botao, FiltroTipos, BuscaEndereco, Aviso
│   ├── lib/
│   │   ├── api.ts                fetch + Bearer + renovação do token + erro padrão
│   │   ├── sessao.ts             login/sair com Google Identity Services
│   │   └── tipos.ts              tipos do contrato da API
│   └── mocks/                    JSON no formato do contrato
└── tests/e2e/                    Playwright + axe
```

**Structure Decision**: Projeto único em `front-next/`, App Router. Lógica de dados concentrada em `lib/api.ts` (um único cliente) para que trocar mocks pela API seja uma variável de ambiente.

## Complexity Tracking

Nenhuma violação.
