# 🎨 Front-end (Next.js) — Rickk

**Apoio a:** Agile (protótipo e pitch) e Java (protótipos de tela no PDF). Nenhuma disciplina avalia o front isoladamente: ele é a "cola" que mostra a solução funcionando.

## Objetivo
Interface web simples e acessível que consome a API Java e exibe o mapa, as ocorrências e a rota sugerida.

## Telas
- [ ] **Mapa** (`/`): Leaflet + OpenStreetMap, com camadas Acessibilidade e Segurança e filtros
- [ ] **Registrar ocorrência** (`/ocorrencias/nova`): foto, categoria, local no mapa, anônimo (S/N)
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
```
NEXT_PUBLIC_API_URL=https://<servico>.onrender.com
```
Enquanto a API não estiver no ar, usar mocks em `src/mocks/` com o **mesmo formato** da tabela de endpoints em [`api-java/README.md`](../api-java/README.md).

## Como executar *(completar)*
```bash
npm install
npm run dev
```
