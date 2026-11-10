# 📊 Data Science & Statistical Computing — Dudu

**Disciplina:** Data Science & Statistical Computing · **Entrega:** arquivos e links no Teams até 19/11, 23h55

## Conceito
Usar dados reais ligados ao tema do Caminho Livre para **testar uma hipótese** sobre segurança e acessibilidade de pedestres. **Entrega isolada**, sem conexão com o app.

## Entregáveis
- [ ] Base de dados + **fonte** citada
- [ ] Notebook ou script (`analise.ipynb`)
- [ ] Visualizações
- [ ] Conclusão curta: resultados, limitações e possível uso futuro na solução

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

## Escopo: entrega isolada
Esta análise **não se conecta ao app** (banco, API e rota não dependem dela). Ela usa o mesmo tema do Caminho Livre e, na conclusão, descreve como **poderia** apoiar a solução no futuro, por exemplo calibrando os pesos de risco por horário.

## Estrutura sugerida
```
data-science/
├── dados/           CSVs brutos + README com a fonte
├── analise.ipynb
├── graficos/
└── conclusao.md
```
