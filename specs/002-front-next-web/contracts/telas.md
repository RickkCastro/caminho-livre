# Contrato de telas — Front Caminho Livre

Coluna US = numeração do [backlog](../../../agile/backlog.md). Endpoints: ver [contrato da API](../../001-api-rest-java/contracts/api.md). 🔒 = exige login (redireciona para `/login?voltar=<rota>`).

| Rota | Tela | Chama | US | Prioridade |
|---|---|---|---|---|
| `/` | Mapa com filtros Acessibilidade / Segurança / Clima e botão "Avisar problema" | `GET /ocorrencias?tipo=`, `GET /categorias` | US03 | Must |
| `/login` | Botão "Entrar com Google" | `POST /auth/google` | US01 | Must |
| `/ocorrencias/nova` 🔒 | Passos: foto (opcional) → categoria → local → enviar | `POST /api/upload` 🔒 (Vercel Blob), `POST /ocorrencias` | US02 | Must |
| `/rota` | Origem e destino por endereço digitado ou "Usar minha localização" (origem começa no GPS), "Inverter", "Tenho mobilidade reduzida", duas rotas + distâncias; mapa só exibe (sem toque) | Nominatim, `GET /rotas` | US04, US11 | Must |
| `/ocorrencias/[id]` | Foto, dados, totais, "Ainda está lá" / "Já foi resolvido" | `GET /ocorrencias/{id}`, `POST …/confirmacoes` 🔒 | US07, US09 | Should |
| `/onboarding` 🔒 | "Você tem mobilidade reduzida?" Sim / Não | `PUT /usuarios/{id}` | US12 | Should |
| `/perfil` 🔒 | Nome, foto, mobilidade, pontos, "Ajustar rota", "Sair", "Excluir minha conta" | `GET/PUT /usuarios/{id}`, `GET/PUT …/preferencias`, `DELETE /usuarios/{id}` | US06, US11, US13, US15, US17 | Must (Sair) / Should |
| `/minhas` 🔒 | Lista dos meus alertas com status em texto | `GET /usuarios/{id}/ocorrencias` | US10 | Should |
| `/ranking` | Melhores e piores bairros (listas); aba usuários (Could) | `GET /ranking/bairros`, `GET /ranking/usuarios` | US14, US19 | Should / Could |
| `/favoritas` 🔒 | Rotas salvas: abrir, remover | `GET/POST/DELETE /rotas-favoritas` | US16 | Could |

## Elementos comuns
- **Cabeçalho** (fundo branco, logo sobre `#76C1A9`, texto `#2A4B25`): nome do app, inicial/foto (leva ao perfil) ou "Entrar". "Sair" fica no perfil.
- **Navegação** (ícone + texto, alvos ≥ 48 px): Mapa · Rota · Avisar · Perfil; barra inferior no celular, no cabeçalho a partir de 768 px. Item ativo com fundo `#76C1A9`.
- **Mapa** (`/`) em tela cheia, com filtros e "Avisar problema" flutuando sobre ele. Na `/rota`, painel lateral + mapa a partir de 768 px.
- **Botão principal**: fundo `#2A4B25`, texto branco. **Secundário**: borda cinza, texto `#2A4B25`. **Perigo** (excluir conta): borda e texto `#B3261E`.
- **Aviso** (`role="status"` / `role="alert"`): mostra o campo `erro` da API ou mensagem simples; informação em fundo `#E8F4EF`, erro em fundo vermelho claro.
