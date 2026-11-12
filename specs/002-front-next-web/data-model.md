# Data Model: Front-end Caminho Livre

O front não tem banco. Os tipos espelham o [contrato da API](../001-api-rest-java/contracts/api.md) (Princípio V) e ficam em `front-next/src/lib/tipos.ts`.

| Tipo | Origem | Campos usados | Onde fica |
|---|---|---|---|
| `Sessao` | `POST /auth/google` | `usuario: Usuario`, `idToken`, `expiraEm` | `localStorage` (`cl.sessao`) |
| `Usuario` | API | id, nome, email, fotoUrl, mobilidadeReduzida, pontos, primeiroAcesso | dentro da sessão |
| `Categoria` | `GET /categorias` | id, nome, tipo, bloqueiaMobilidade | memória (carregada uma vez) |
| `OcorrenciaResumo` | `GET /ocorrencias` | id, categoria, tipo, latitude, longitude, status | memória |
| `OcorrenciaDetalhe` | `GET /ocorrencias/{id}` | + descricao, fotoUrl, bairro, dtRegistro, totalConfirma, totalNega, minha | memória |
| `NovaOcorrencia` | formulário | idCategoria*, latitude*, longitude*, descricao (≤ 500), fotoUrl | `sessionStorage` (`cl.rascunho`) até enviar |
| `Preferencia` | `GET /usuarios/{id}/preferencias` | idCategoria, considerar | memória; vira `ignorar` na rota |
| `Rota` | `GET /rotas` | comum {pontos, distanciaM}, caminhoLivre {…} \| null, aviso | memória |
| `ErroApi` | qualquer erro | status, erro | exibido em `Aviso` |

\* obrigatórios.

## Estados da sessão

```text
visitante ──Entrar com Google──▶ logado (primeiroAcesso? → /onboarding)
logado ──token expira / 401──▶ renovando ──ok──▶ logado
                                        └─falha─▶ visitante (vai a /login e volta à tela)
logado ──Sair ou Excluir conta──▶ visitante (apaga cl.sessao e cl.rascunho)
```

## Regras derivadas da spec
- Botão "Enviar" habilitado só com `idCategoria` e local (US3).
- 👍/👎 ocultos se `minha = true`; "Entre para avaliar" se visitante; desabilitados após avaliar (US6).
- Rota de visitante: `mobilidadeReduzida` vem do checkbox da tela; de logado, do perfil; `ignorar` só para logado (preferências).
