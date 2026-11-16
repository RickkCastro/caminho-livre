# Contrato REST — API Caminho Livre

Base: `https://<servico>.onrender.com` · JSON · camelCase · 🔒 = exige `Authorization: Bearer <idToken Google>`.
Espelha `api-java/README.md` (Princípio V).

## Erro padrão
```json
{ "timestamp": "2026-11-12T10:00:00", "status": 404, "erro": "Ocorrência 99 não encontrada" }
```
400 validação · 401 token inválido · 403 não é o dono · 404 não encontrado · 409 avaliação duplicada · 422 regra de negócio · 503 banco indisponível

## Must
| Método | Rota | Corpo / query | Resposta | US |
|---|---|---|---|---|
| POST | `/auth/google` | `{ "idToken": "..." }` | 201 (novo) / 200 `Usuario` | US01 |
| GET | `/categorias` | — | 200 `[{ id, nome, tipo, pesoBase, pesoNoturno, bloqueiaMobilidade }]` | US02 |
| POST 🔒 | `/ocorrencias` | `{ idCategoria, latitude, longitude, logradouro?, bairro?, descricao?, fotoUrl? }` | 201 `OcorrenciaDetalhe` | US02 |
| GET | `/ocorrencias` | `?tipo=&status=&bairro=` (padrão: ativas) | 200 `[OcorrenciaResumo]` | US03 |
| GET | `/rotas` | `?origemLat=&origemLon=&destinoLat=&destinoLon=&hora=&mobilidadeReduzida=S\|N&ignorar=1,5` | 200 `{ comum:{ pontos:[{lat,lon}], distanciaM }, caminhoLivre:{...}\|null, aviso? }` · 422 fora da área | US04, US11 |
| GET | `/trechos/pesos` | `?hora=0-23&mobilidadeReduzida=S\|N&ignorar=1,5` (sem idUsuario — LGPD) | 200 `[{ idTrecho, origem:{id,lat,lon}, destino:{id,lat,lon}, distanciaM, peso, bloqueado }]` | US04 |

## Should
| Método | Rota | Corpo / query | Resposta | US |
|---|---|---|---|---|
| GET | `/ocorrencias/{id}` | — | 200 `OcorrenciaDetalhe` | US09 |
| POST 🔒 | `/ocorrencias/{id}/confirmacoes` | `{ "confirma": true }` | 201 `{ status, totalConfirma, totalNega }` | US07 |
| GET 🔒 | `/usuarios/{id}/ocorrencias` | — | 200 `[OcorrenciaDetalhe]` | US10 |
| GET / PUT 🔒 | `/usuarios/{id}/preferencias` | `[{ idCategoria, considerar }]` | 200 lista | US11 |
| GET / PUT 🔒 | `/usuarios/{id}` | `{ nome?, fotoUrl?, mobilidadeReduzida? }` | 200 `Usuario` | US12, US13 |
| DELETE 🔒 | `/usuarios/{id}` | — | 204 | US15 |
| GET | `/ranking/bairros` | — | 200 `{ melhores:[{bairro, pontuacao, totalAtivas}], piores:[...] }` | US14 |

## Could
| Método | Rota | Corpo | Resposta | US |
|---|---|---|---|---|
| GET | `/ranking/usuarios` | — | 200 `[{ nome, fotoUrl, pontos }]` | US19 |
| GET / POST 🔒 | `/rotas-favoritas` | `{ idOrigem, idDestino, apelido }` | 200 / 201 | US16 |
| DELETE 🔒 | `/rotas-favoritas/{id}` | — | 204 | US16 |

## CRUD exigido pela rubrica (GET/POST/PUT/DELETE)
`/categorias/{id}`, `/localizacoes`, `/localizacoes/{id}`, `/ocorrencias/{id}` (PUT/DELETE 🔒 só o autor), `/trechos`, `/trechos/{id}`, `GET /usuarios`.

## Schemas
- **Usuario**: `{ id, nome, email, fotoUrl, mobilidadeReduzida, pontos, primeiroAcesso }`
- **OcorrenciaResumo**: `{ id, categoria, tipo, latitude, longitude, status }` — sem autor (RNF08)
- **OcorrenciaDetalhe**: Resumo + `{ descricao, fotoUrl, bairro, dtRegistro, dtExpiracao, totalConfirma, totalNega, minha }`
- `minha` só é `true` quando o token (opcional nos GETs) é do autor; o front usa para esconder 👍/👎.
