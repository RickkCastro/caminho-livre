# Quickstart: validar o front

## Pré-requisitos
Node 20, um OAuth Client ID do Google (origem `http://localhost:3000`), um token do Vercel Blob e, para o modo integrado, a API 001 rodando.

## Rodar
```bash
cd front-next
cp .env.example .env.local   # preencher as variáveis
npm install
npm run dev                  # NEXT_PUBLIC_USE_MOCKS=true para usar src/mocks
npx playwright test          # fluxos P1 + axe
```

## Cenários (ver [telas](contracts/telas.md))
| # | Ação | Esperado |
|---|---|---|
| 1 | Abrir `/` sem login | Mapa com alertas em ≤ 3 s (4G simulado no DevTools), cada um com forma + rótulo |
| 2 | Desmarcar "Segurança" | Só os alertas de segurança somem |
| 3 | Tocar "Avisar problema" sem login | Vai a `/login`; depois de entrar volta ao formulário |
| 4 | Enviar alerta: categoria → "Usar minha localização" → "Enviar" | ≤ 4 toques; "Alerta enviado"; marcador novo no mapa |
| 5 | Enviar com foto de 5 MB | Foto reduzida, `fotoUrl` do Blob gravada; falha no upload permite enviar sem foto |
| 6 | `/rota` sem login, destino por busca e por toque | Origem = "Minha localização"; duas linhas com legenda e distâncias em ≤ 5 s |
| 7 | Marcar "Tenho mobilidade reduzida" | Caminho Livre não usa trecho com degrau, ou aviso "não há caminho" |
| 8 | Detalhe de alerta próprio / de outro / como visitante | Sem botões / 👍👎 / "Entre para avaliar" |
| 9 | Deixar o token expirar (ou apagar e recarregar após 1 h) | Continua logado; chamada repetida sem perder o formulário |
| 10 | "Sair" e recarregar | Volta a visitante; `localStorage` sem `cl.sessao` |
| 11 | "Excluir minha conta" e confirmar | Volta ao login; o alerta enviado continua no mapa |
| 12 | Modo avião no formulário | Aviso de sem internet; dados mantidos ao voltar |
| 13 | Lighthouse + axe em todas as rotas, fonte do sistema 200% | Acessibilidade ≥ 95; zero violações críticas; nada cortado |
| 14 | Inspecionar textos sobre `#76C1A9` | Todos em `#2A4B25` (SC-006) |
