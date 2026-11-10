# 📊 Data Science & Statistical Computing — Dudu

**Disciplina:** Data Science & Statistical Computing · **Entrega:** arquivos e links no Teams até 19/11, 23h55

## Conceito
Usar dados reais ligados ao problema para **testar uma hipótese** e **apoiar uma decisão** do Caminho Livre: definir os pesos de risco por horário e categoria.

## Entregáveis
- [ ] Base de dados + **fonte** citada
- [ ] Notebook ou script (`analise.ipynb`)
- [ ] Visualizações
- [ ] Conclusão curta: resultados, limitações e uso na solução

## Avaliação
| Critério | Peso |
|---|---|
| Dados e preparo | 3 |
| Método | 3 |
| Análise e interpretação | 3 |
| Clareza | 1 |

## Hipóteses sugeridas (escolher 1 ou 2)
1. **Roubos e furtos a pedestres concentram-se entre 19h e 23h** (teste qui-quadrado ou comparação de proporções por faixa horária)
2. **Ruas com reclamação de iluminação têm mais ocorrências criminais** (correlação / regressão)
3. **Algumas regiões concentram reclamações de calçada** (análise exploratória dos chamados do SP156)

## Fontes de dados públicas
- SSP-SP: dados de ocorrências criminais (transparência)
- Prefeitura de SP: dados abertos do SP156 (zeladoria, iluminação, calçadas)
- GeoSampa: iluminação pública e logradouros
- OpenStreetMap: tags `lit=*` e `wheelchair=*`

> Nada de dados pessoais. Anonimizar e citar a fonte.

## Saída usada pela solução
Uma tabela de pesos que alimenta `CATEGORIA_OCORRENCIA.PESO_NOTURNO` (banco do Caio) e as penalidades do Dijkstra:

| Categoria | peso_base | peso_noturno |
|---|---|---|
| Rua sem iluminação | *x* | *y* |
| Assalto | *x* | *y* |

## Estrutura sugerida
```
data-science/
├── dados/           CSVs brutos + README com a fonte
├── analise.ipynb
├── graficos/
└── conclusao.md
```
