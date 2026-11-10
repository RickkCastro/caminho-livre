# 🧮 Dynamic Programming — Dudu

**Disciplina:** Dynamic Programming · **Entrega:** ZIP único no Teams até 19/11, 23h55

## Conceito
Algoritmo em Python que calcula a **rota mais acessível e segura** do Caminho Livre, aplicando técnicas de programação dinâmica.

## Entregáveis
- [ ] Código-fonte completo
- [ ] `README` com **RMs e nomes**, descrição dos algoritmos e funcionalidades implementadas
- [ ] Tudo em **um único ZIP**

## Técnicas exigidas → aplicação no projeto
| Técnica | Uso no Caminho Livre |
|---|---|
| **Grafos** | Ruas como grafo: `LOCALIZACAO` = vértices, `TRECHO` = arestas. **Dijkstra** com custo = distância × (1 + penalidades) |
| **Memoização** | Cache de rotas já calculadas por `(origem, destino, perfil, faixa_horária)` |
| **Tabulação** | Tabela PD para "rota de **menor risco** com no máximo X metros a mais" (custo restrito, estilo mochila sobre caminhos) |

## Funcionalidades sugeridas
1. Carregar o grafo de um JSON (mock) ou de `GET /trechos/pesos?idUsuario=&hora=`
2. Calcular a rota mais curta (comum) × a rota Caminho Livre e comparar distância e risco
3. Perfis: `PEDESTRE`, `MOBILIDADE_REDUZIDA` (degrau = intransponível)
4. Horário: penalidade de segurança maior entre 19h e 6h
5. Medir tempo com e sem memoização (noção de eficiência)

## Formato de entrada
```json
[{ "origem": 1, "destino": 2, "distanciaM": 120, "peso": 3.5 }]
```

## Estrutura sugerida
```
dynamic-programming/
├── main.py              menu no terminal
├── grafo.py             carga e representação (lista de adjacência)
├── dijkstra.py
├── memo.py
├── tabulacao.py
└── dados/grafo_mock.json
```

## Integrações
- ⬅️ **Ulisses:** endpoint `/trechos/pesos` (até lá, usar o mock)
