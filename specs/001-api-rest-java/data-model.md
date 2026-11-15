# Data Model: API REST Caminho Livre

Fonte: `database/README.md` (DER congelado em 11/11). Os nomes das classes do `model/` seguem as tabelas.

| Classe | Tabela | Campos | Validações |
|---|---|---|---|
| Usuario | USUARIO | id, nome, email, googleId, mobilidadeReduzida (S/N), fotoUrl, pontos, dtCadastro | email e googleId únicos; pontos ≥ 0 |
| CategoriaOcorrencia | CATEGORIA_OCORRENCIA | id, nome, tipo, pesoBase, pesoNoturno, bloqueiaMobilidade (S/N) | tipo ∈ {ACESSIBILIDADE, SEGURANCA, CLIMA}; pesos ≥ 0; bloqueiaMobilidade DEFAULT N |
| Localizacao | LOCALIZACAO | id, latitude, longitude, logradouro, bairro | lat ∈ [-90, 90], lon ∈ [-180, 180] |
| Ocorrencia | OCORRENCIA | id, idUsuario (nullable), idCategoria, idLocalizacao, descricao, fotoUrl, status, dtRegistro, dtExpiracao | categoria e localização obrigatórias; descricao ≤ 500 |
| Confirmacao | CONFIRMACAO | id, idOcorrencia, idUsuario, confirma (S/N), dtConfirmacao | único (idOcorrencia, idUsuario) |
| PreferenciaRota | PREFERENCIA_ROTA | idUsuario, idCategoria, considerar (S/N) | PK composta; ausência = S |
| Trecho | TRECHO | id, idOrigem, idDestino, distanciaM, iluminado (S/N) | distanciaM > 0; origem ≠ destino |
| RotaFavorita *(Could)* | ROTA_FAVORITA | id, idUsuario, idOrigem, idDestino, apelido, dtCriacao | apelido ≤ 60 |

## Ciclo de vida da Ocorrência

```text
ABERTA ──total 👍 ≥ 3──▶ CONFIRMADA
ABERTA ──total 👎 ≥ 3──▶ RESOLVIDA
CONFIRMADA ──total 👎 ≥ 3──▶ RESOLVIDA   (total, não saldo; 👎 prevalece)
ABERTA ──dt_expiracao < agora──▶ EXPIRADA
```
- Nasce `ABERTA`, `dtExpiracao = dtRegistro + 15 dias`.
- Ativa = `ABERTA` ou `CONFIRMADA`. `EXPIRADA`/`RESOLVIDA` não aceitam avaliação e somem do mapa e da rota.

## Peso do trecho (TrechoService)

```text
noturno = hora >= 19 || hora < 6
ativas  = ocorrências ativas a ≤ 30 m da origem ou destino, de categorias fora de `ignorar`
bloqueado = mobilidadeReduzida = S && alguma ativa tem categoria.bloqueiaMobilidade = S
peso = distanciaM × (1 + Σ (noturno ? pesoNoturno : pesoBase))
```

## Rota (RotaService)

```text
grafo   = TRECHO como arestas não direcionadas entre LOCALIZACAO
origem  = vértice mais próximo de (origemLat, origemLon); idem destino; > 500 m → 422
comum        = Dijkstra(custo = distanciaM)
caminhoLivre = Dijkstra(custo = peso, removendo bloqueado) ou null + aviso
resposta = { comum: { pontos:[{lat,lon}], distanciaM }, caminhoLivre: {...} | null, aviso? }
```

## Exclusão de conta (LGPD)
Em uma transação: `UPDATE OCORRENCIA SET id_usuario = NULL`, `DELETE` de CONFIRMACAO, PREFERENCIA_ROTA, ROTA_FAVORITA e USUARIO do usuário.
