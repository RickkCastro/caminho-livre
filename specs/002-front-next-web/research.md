# Research: Front-end Caminho Livre

## Login e sessão
- **Decision**: Google Identity Services (botão "Entrar com Google" + One Tap) no navegador; ID token enviado a `POST /auth/google` e guardado com o usuário em `localStorage`. Antes de expirar (ou ao receber 401), `google.accounts.id.prompt()` com `auto_select` renova o token sem interação; a chamada é repetida uma vez.
- **Rationale**: Atende "logado até tocar Sair" (clarificação) sem backend de sessão próprio e casa com a API, que revalida o token a cada chamada.
- **Alternatives**: NextAuth/Auth.js (cria sessão própria e cookie, duplica a validação da API); cookie httpOnly via route handler (mais seguro contra XSS, mas exige proxy de todas as chamadas — custo alto para a demo).

## Mapa
- **Decision**: react-leaflet com tiles do OpenStreetMap, carregado com `dynamic(..., { ssr: false })`. Marcadores com `divIcon` (forma + ícone + rótulo por tipo); rota comum tracejada e Caminho Livre contínua em `#2A4B25`.
- **Rationale**: Gratuito, sem chave; Leaflet precisa de `window`, por isso client-only.
- **Alternatives**: Google Maps / Mapbox (chave e cobrança).

## Busca de endereço
- **Decision**: Nominatim com debounce de 1 s, mínimo 3 letras, `countrycodes=br` e `viewbox` da área mapeada; cache em memória por texto. Falha → mensagem e toque no mapa (clarificação 2).
- **Rationale**: Política de uso do Nominatim (1 req/s); sem chave.
- **Alternatives**: Photon (mesmo dado, menos limite, menos estável); Google Places (chave paga).

## Foto
- **Decision**: Redimensionar no navegador (canvas, lado maior ≤ 1280 px, JPEG 0,8) e enviar via `@vercel/blob/client` `upload()`, com token gerado em `app/api/upload/route.ts` (aceita só `image/*`, ≤ 2 MB, e só para quem envia um ID token Google válido — evita que qualquer pessoa use a cota do Blob). A URL vai para `fotoUrl`.
- **Rationale**: Clarificação 1; o upload direto pelo cliente evita o limite de corpo da função.
- **Alternatives**: Upload via API Java (contrato não prevê).

## Paleta e tema
- **Decision**: Tokens no `@theme` do Tailwind 4: `--color-marca-escuro: #2A4B25`, `--color-marca-agua: #76C1A9`, `--color-fundo: #FFFFFF`; tipos de alerta com cor + forma: Acessibilidade `#1F5FAD` (círculo), Segurança `#B3261E` (triângulo), Clima `#6A3FA0` (gota), todos ≥ 4,5:1 sobre branco.
- **Rationale**: FR-014; as cores de tipo não competem com o verde da marca.

## Mocks e API fora do ar
- **Decision**: `NEXT_PUBLIC_USE_MOCKS=true` faz `lib/api.ts` ler `src/mocks/*.json`. Em produção, timeout de 60 s com mensagem "Acordando o servidor…" (Render free).
- **Rationale**: Front e API andam em paralelo até 15/11.

## Sem internet
- **Decision**: Detectar `navigator.onLine`/evento `offline`; mostrar aviso em texto, manter o último mapa em memória e o formulário de alerta em `sessionStorage`. Sem PWA/service worker.
- **Rationale**: Atende o caso de borda da spec com o mínimo; PWA fica fora do escopo.

## Testes
- **Decision**: Playwright cobrindo os fluxos P1 com mocks + `@axe-core/playwright` em todas as rotas; Lighthouse manual antes da entrega.
- **Rationale**: SC-003 e SC-002 são verificáveis no navegador; o front não tem regra de negócio que justifique teste unitário.
