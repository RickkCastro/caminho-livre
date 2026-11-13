# 🎨 Front-end (Next.js) — Rickk

**Apoio a:** Agile (protótipo e pitch) e Java (protótipos de tela no PDF). Nenhuma disciplina avalia o front isoladamente: ele é a "cola" que mostra a solução funcionando.

## Objetivo
Interface web simples e acessível que consome a API Java e exibe o mapa, as ocorrências e a rota sugerida.

## Telas
- [ ] **Mapa** (`/`): Leaflet + OpenStreetMap, com camadas Acessibilidade e Segurança e filtros
- [ ] **Registrar ocorrência** (`/ocorrencias/nova`): foto, categoria, local no mapa (inclui alagamento)
- [ ] **Detalhe da ocorrência** (`/ocorrencias/[id]`): confirmar ou negar
- [ ] **Rota sugerida** (`/rota`): origem/destino, perfil e comparação rota comum × Caminho Livre
- [ ] **Login / criar conta** (`/login`, `/cadastro`)
- [ ] *(Should)* **Perfil + onboarding** (`/perfil`), **Minhas ocorrências** (`/minhas`), **Ranking de bairros** (`/ranking`)

> Prioridades no [backlog](../agile/backlog.md). O painel de administrador é Won't.

## Diretrizes de UX (vão para os comentários do protótipo)
- Fonte mínima de 16px, alto contraste (WCAG AA) e botões grandes
- No máximo 3 toques para registrar uma ocorrência
- Linguagem simples, ícones com texto e ícones com cor + forma (não depender só de cor)
- Mobile first

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- React Leaflet
- Deploy na Vercel

## Configuração
Copie `.env.example` para `.env.local`:

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL da API Java (Render) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | OAuth Client ID do Google (origens: `http://localhost:3000` e a URL da Vercel) |
| `BLOB_READ_WRITE_TOKEN` | Token do Vercel Blob (fotos) |
| `NEXT_PUBLIC_USE_MOCKS` | `true` usa `src/mocks/` (mesmo formato do contrato da API) e um login falso, sem Google nem Blob |

## Como executar
```bash
npm install
npm run dev                      # http://localhost:3000
npx playwright install chromium  # só na primeira vez
npx playwright test              # fluxos do MVP + axe + fonte 200% (usa os mocks)
```

Specs, plano e tarefas: [`specs/002-front-next-web/`](../specs/002-front-next-web/).
