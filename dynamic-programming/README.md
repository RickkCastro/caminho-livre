# 🧮 Dynamic Programming — Caminho Livre

**Global Solution 2026.2 · CitizenTech · FIAP** — Engenharia de Software, 2º ano (2ESPV) · **Grupo OctoFlow**

**Entrega:** ZIP único no Teams até 19/11/2026, 23h55 (código-fonte completo + este README)

Algoritmo em Python que calcula a **rota a pé mais acessível e segura** do Caminho Livre, *o mapa da cidade que mostra o que o GPS não vê*, aplicando as três técnicas pedidas: **Grafos, Memoização e Tabulação**.

## Integrantes

| Nome | RM |
|---|---|
| Henrique Castro de Matos | 564560 |
| Caio Nascimento Caminha | 564789 |
| Eduardo Ulisses Pereira da Silva | 566339 |
| Eduardo Duran Del Ciel | 562017 |
| Laura Tigre Amaral | 565281 |

---

## 1. O problema

Os aplicativos de rota tratam toda calçada como transitável e toda rua como segura a qualquer hora. No Caminho Livre, os moradores registram **alertas** (degrau, falta de rampa, buraco, calçada quebrada, obra, rua escura, local deserto, assalto e alagamento) e a comunidade os confirma. Esta parte do projeto responde à pergunta central do produto: **com esses alertas, por onde a pessoa deve ir?**

As personas do projeto (documento de Agile) dão os cenários de teste:

| Persona | Trajeto | O que importa |
|---|---|---|
| **Dona Marta**, 68 anos, usa andador | casa → posto de saúde, 10h | degrau ou guia sem rampa **impedem** a passagem |
| **Júlia**, 21 anos, estudante | faculdade → metrô, 23h | evitar rua escura e deserta, mesmo andando mais |
| **Seu Antônio**, 74 anos | casa → padaria, 8h | a esquina de casa alaga e esconde um buraco |

### Modelagem

O bairro vira um **grafo não direcionado** `G = (V, E)`:

- **V (pontos):** esquinas e lugares (tabela `LOCALIZACAO` do banco);
- **E (trechos):** trechos de calçada entre dois pontos, com a distância em metros (tabela `TRECHO`).

O peso de cada trecho segue **a mesma regra do `TrechoBO` da API Java** ([data-model](../specs/001-api-rest-java/data-model.md)):

```text
noturno   = hora >= 19 ou hora < 6
ativas    = alertas ABERTA ou CONFIRMADA a até 30 m de uma das pontas do trecho,
            fora das categorias que a pessoa pediu para ignorar
bloqueado = perfil com mobilidade reduzida e algum alerta ativo que bloqueia (degrau, falta de rampa)
peso      = distância × (1 + Σ peso da categoria no horário)
risco     = peso − distância          (a parte do peso que vem dos alertas)
```

Com isso, o programa responde a três perguntas:

1. **Rota comum:** menor distância, passando por qualquer trecho (o que um GPS comum sugere).
2. **Rota Caminho Livre:** menor peso, sem passar por trechos bloqueados para o perfil.
3. **Rota mais segura com limite:** menor risco andando **no máximo X metros a mais** que a rota comum, mais a lista de opções "andar um pouco mais para correr menos risco". Aqui está a programação dinâmica propriamente dita.

---

## 2. Técnicas aplicadas

| Técnica | Arquivo | Para que serve no Caminho Livre | Complexidade |
|---|---|---|---|
| **Grafos** | `grafo.py`, `dijkstra.py` | Ruas em lista de adjacência; Dijkstra para a rota comum e para a rota Caminho Livre | O((V + E) log V) |
| **Memoização** | `memo.py` | (a) recorrência da rota mais segura resolvida de cima para baixo com memo; (b) cache de rotas por `(origem, destino, perfil, faixa horária, categorias ignoradas)` | (a) O(L · (V + E)) no pior caso; (b) O(1) por consulta repetida |
| **Tabulação** | `tabulacao.py` | A mesma recorrência preenchida de baixo para cima; **uma tabela responde a qualquer limite** e gera as opções de rota | O(L · (V + E)) de tempo, O(L · V) de memória |

V = pontos (31 no mapa), E = trechos (40), A = alertas ativos (10) e L = limite em metros.

### 2.1 Grafos: Dijkstra (`dijkstra.py`)

O mapa é uma **lista de adjacência** (`vértice -> [(vizinho, trecho)]`, memória O(V + E)). O Dijkstra com fila de prioridade (`heapq`) roda duas vezes:

- **comum:** custo = distância;
- **Caminho Livre:** custo = peso, ignorando os trechos bloqueados.

Por que Dijkstra: todos os custos são **não negativos** (distância > 0 e pesos de categoria ≥ 0, conferidos na carga do mapa), e o algoritmo também é uma forma de programação dinâmica. `custos[v]` guarda a resposta do subproblema "menor custo da origem até v", e toda rota mínima é formada por sub-rotas mínimas (princípio da otimalidade). A fila só decide em que ordem os subproblemas ficam prontos. Antes disso, calcular o peso de todos os trechos custa O(E × A).

### 2.2 A recorrência da rota mais segura com limite

Pergunta: *qual o caminho com menos risco até o destino andando no máximo L metros?* (L = rota comum + X).

**Subproblema** `f(v, b)`: o melhor par `(risco, distância)` para ir do ponto `v` até o destino com um orçamento de `b` metros.

```text
f(destino, b) = (0, 0)
f(v, b)       = min  (risco(t), d(t)) + f(u, b − metros(t))
                para cada trecho t = (v, u) não bloqueado com metros(t) <= b
                (nenhum trecho cabe no orçamento: infinito)
```

- **Subestrutura ótima:** se o melhor caminho de `v` começa pelo trecho `(v, u)`, o resto dele é o melhor caminho de `u` com o orçamento que sobrou.
- **Subproblemas repetidos:** caminhos diferentes chegam ao mesmo ponto com o mesmo orçamento, por exemplo `A→B→C` e `A→D→C` com a mesma distância. Sem memória, `f(C, b)` seria calculado de novo para cada um.
- **Termina mesmo com ciclos:** todo trecho tem pelo menos 1 m, então o orçamento `b` sempre diminui.
- **Desempate:** os pares são comparados primeiro pelo risco e depois pela distância. Entre rotas de mesmo risco fica a mais curta, então a resposta nunca dá voltas desnecessárias.
- É uma "mochila sobre caminhos": o orçamento é a distância e o valor a minimizar é o risco. O problema geral (caminho mínimo com restrição) é NP-difícil, mas com distâncias inteiras em metros a PD resolve em tempo **pseudo-polinomial**, proporcional a L.

### 2.3 Memoização (`memo.py`)

`rota_mais_segura_recursiva` implementa `f(v, b)` como função recursiva com um dicionário `memo[(v, b)]`, e o dicionário `escolha[(v, b)]` guarda o próximo trecho para remontar a rota no final. Com `usar_memo=False`, a mesma função vira a recursão "ingênua", usada só para comparar:

- **sem memo:** percorre todos os passeios que cabem no orçamento e cresce de forma **exponencial** (cerca de 3 vezes a cada 100 m a mais de limite no mapa de teste);
- **com memo:** cada par `(v, b)` é resolvido uma única vez. São no máximo V × (L + 1) subproblemas e, na prática, bem menos, porque só os orçamentos alcançáveis a partir da origem aparecem.

A recursão tem um limite natural (a pilha do Python): a função confere a profundidade máxima (`L / menor trecho`) antes de começar e recomenda a tabulação se ela passar do limite.

**Cache de rotas (`CacheDeRotas`).** Muitas pessoas pedem a mesma rota (casa → metrô, casa → posto). A resposta só depende de `(origem, destino, perfil, faixa horária, categorias ignoradas)`, então fica guardada num dicionário. A **hora exata não entra na chave**: o peso só muda entre dia e noite, logo 20h e 23h dão a mesma rota (há um teste que confere isso). O grafo com pesos de cada `(faixa, perfil, ignoradas)` também é memorizado, porque calcular os pesos é a parte mais cara, O(E × A).

### 2.4 Tabulação (`tabulacao.py`)

`preencher_tabela` usa a **mesma recorrência**, mas preenche a tabela `T[b][v]` de baixo para cima, para `b = 0, 1, 2, ..., L`. Como todo trecho tem pelo menos 1 m, a linha `b` só consulta linhas anteriores (`b − metros(t) < b`), que já estão prontas.

O que a tabela ganha da versão recursiva:

- **não usa recursão**, então aceita limites grandes;
- **uma tabela preenchida até L responde a qualquer limite b ≤ L** sem recalcular nada. `melhor_rota(b)` só lê a linha `b`;
- **opções de rota:** percorrendo a coluna da origem, `T[0..L][origem]`, cada ponto em que o risco cai é uma opção. São as rotas de Pareto: nenhuma outra é ao mesmo tempo mais curta e menos arriscada (`opcoes()`).

Exemplo real (Júlia às 23h, uma tabela de 771 × 31 = 23.901 células):

| Distância | A mais | Risco | Alertas | |
|---:|---:|---:|---:|---|
| 610 m | +0 m | 3.980 | 3 | rota comum (2 postes apagados + rua deserta) |
| 616 m | +6 m | 1.920 | 1 | evita a rua deserta e um poste apagado |
| 770 m | +160 m | 0 | 0 | vai pela Avenida Central, iluminada |

Se a Júlia aceitar **até 100 m a mais**, a resposta é a de 616 m, lida na linha `b = 710` da mesma tabela.

---

## 3. Eficiência (medições)

Medições de `python main.py desempenho` (as mesmas das seções 5 e 6 de [`exemplos/saida_demo.txt`](exemplos/saida_demo.txt)): Júlia às 23h com limites cada vez maiores. Os tempos são de uma máquina Linux comum e mudam de computador para computador; o número de chamadas e de células não muda.

| Limite | Sem memo: chamadas | Tempo | Com memo: chamadas | Subproblemas | Tempo | Tabulação: células | Tempo |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 770 m | 1.253 | 0,001 s | 453 | 302 | 0,3 ms | 23.901 | 23 ms |
| 1.010 m | 16.925 | 0,010 s | 1.684 | 1.006 | 1,1 ms | 31.341 | 37 ms |
| 1.220 m (o dobro da rota comum) | 166.503 | 0,094 s | 4.465 | 2.453 | 2,9 ms | 37.851 | 48 ms |
| 1.410 m | **1.425.520** | 0,687 s | **8.968** | 4.540 | 6,1 ms | 43.741 | 56 ms |

O que os números mostram:

- **Sem memo** o número de chamadas explode: 640 m a mais de limite multiplicam as chamadas por mais de mil.
- **Com memo** os subproblemas nunca passam do tamanho da tabela, V × (L + 1). No limite de 1.410 m são 159 vezes menos chamadas que sem memo.
- **A tabulação** sempre preenche a tabela inteira (cresce linear em L). É mais lenta que a memoização aqui porque calcula também estados que a origem não alcança, mas não tem limite de recursão e devolve todas as opções de uma vez.
- Nas quatro linhas as três formas encontram **a mesma rota** (o programa confere).

**Cache de rotas** (1.000 pedidos simulados entre os 8 lugares do mapa, com hora e perfil sorteados e semente fixa):

| | Tempo | |
|---|---:|---|
| Sem cache | 0,522 s | 1.000 cálculos de pesos + 2 Dijkstras cada |
| Com cache | 0,008 s | 784 respostas do cache e 216 cálculos (no máximo 8 × 7 pares × 2 perfis × 2 faixas = 224 chaves) |

Nesta medição o cache deixou as consultas **67 vezes mais rápidas**, com respostas idênticas às calculadas sem cache. O ganho varia de máquina para máquina e cresce com o número de pedidos, porque a partir das 224 chaves possíveis toda consulta vem do cache.

---

## 4. Funcionalidades implementadas

1. **Carga do mapa** em JSON com as tabelas `LOCALIZACAO`, `TRECHO`, `CATEGORIA_OCORRENCIA` e `OCORRENCIA`, conferindo as referências entre elas.
2. **Peso de cada trecho** por horário (dia/noite), perfil (pedestre ou mobilidade reduzida) e categorias ignoradas, com a mesma regra da API. Alertas `EXPIRADA` e `RESOLVIDA` não entram.
3. **Rota comum × rota Caminho Livre** (Dijkstra), com distância extra, alertas no caminho, barreiras para mobilidade reduzida e **% de alertas evitados**, o indicador de impacto da Ficha da CitizenTech.
4. **Rota mais segura com limite de distância** (tabulação) e a **lista de opções** de Pareto. Quando nada cabe no limite, informa a menor rota sem barreiras.
5. **A mesma resposta por recursão com memo**, com a contagem de chamadas comparada à recursão sem memo.
6. **Cache de rotas** com medição de tempo, acertos e conferência das respostas.
7. **Mesmo formato da API:** exporta o grafo como `GET /trechos/pesos` (`pesos`), lê esse formato (`--trechos-pesos`) e devolve a rota como `GET /rotas` (`--json`).
8. **Busca de lugar pelo nome**, sem acento e por parte do nome (`metro`, `dona marta`).
9. **Menu no terminal**, comandos diretos e **demonstração** com as personas.

---

## 5. Como executar

Requisito: **Python 3.9 ou superior** (testado do 3.9 ao 3.13). Só usa a biblioteca padrão, não precisa de `pip install`.

```bash
cd dynamic-programming
python main.py                 # menu no terminal
python main.py demo            # demonstração completa (personas, tabulação, memoização, cache)
python main.py mapa            # lugares, esquinas, categorias e alertas
```

Comandos diretos (origem e destino aceitam o número do ponto ou parte do nome do lugar):

```bash
python main.py rota faculdade metro --hora 23
python main.py rota "dona marta" posto --hora 10 --perfil mobilidade-reduzida
python main.py rota faculdade metro --hora 23 --ignorar 6,7      # ignora Rua escura e Local deserto
python main.py rota faculdade metro --hora 23 --json             # formato de GET /rotas
python main.py limite faculdade metro --hora 23 --extra 100      # tabulação
python main.py desempenho                                        # recursão × memo × tabulação e cache
python main.py pesos --hora 23 --saida exemplos/trechos_pesos_23h.json
python main.py rota 2 14 --trechos-pesos exemplos/trechos_pesos_23h.json
```

No Windows, use `py` no lugar de `python` se for o caso.

---

## 6. Exemplos de entrada e saída

**Entrada:** o mapa `dados/grafo_mock.json` (trecho abaixo) ou um arquivo no formato `GET /trechos/pesos` (`exemplos/trechos_pesos_23h.json`).

```json
{
  "categorias":   [{ "id": 6, "nome": "Rua escura", "tipo": "SEGURANCA", "pesoBase": 0, "pesoNoturno": 8, "bloqueiaMobilidade": "N" }],
  "localizacoes": [{ "id": 2, "latitude": -23.564381, "longitude": -46.656355, "logradouro": "Rua das Acácias, 80", "bairro": "Bela Vista", "nome": "Faculdade" }],
  "trechos":      [{ "id": 2, "idOrigem": 2, "idDestino": 3, "distanciaM": 120, "logradouro": "Rua das Acácias" }],
  "ocorrencias":  [{ "id": 1, "idCategoria": 6, "idLocalizacao": 101, "status": "CONFIRMADA", "descricao": "Poste apagado há semanas" }]
}
```

**Exemplo 1: Júlia às 23h** (`python main.py rota faculdade metro --hora 23`)

```text
Faculdade -> Estação de Metrô · 23h (noite) · pedestre

  ROTA COMUM (menor distância, como um GPS comum)
    610 m · risco 3.980 · 3 alertas
    Rua das Acácias 400 m -> Rua dos Beija-flores 130 m -> Avenida Central 80 m
    Alertas: Rua escura (Rua das Acácias, 205) · Rua escura (Rua das Acácias, 396) · Local deserto (Rua dos Beija-flores, 70)
  ROTA CAMINHO LIVRE (menor peso, sem barreiras)
    770 m (+160 m) · risco 0 · 0 alertas
    Rua das Acácias 80 m -> Rua dos Sabiás 130 m -> Avenida Central 560 m
  => Evita 3 de 3 alertas (100%) andando 160 m a mais.
```

Às 14h a mesma consulta devolve uma Caminho Livre de 616 m (+6 m): de dia, poste apagado não pesa e ela só desvia da rua deserta.

**Exemplo 2: Dona Marta com mobilidade reduzida** (`python main.py rota "dona marta" posto --hora 10 --perfil mobilidade-reduzida`)

```text
Casa da Dona Marta -> Posto de Saúde · 10h (dia) · mobilidade reduzida

  ROTA COMUM (menor distância, como um GPS comum)
    560 m · risco 2.240 · 2 alertas
    Rua das Paineiras 560 m
    Alertas: Calçada quebrada (Rua das Paineiras, 248) · Falta de rampa (Rua das Paineiras × Rua das Andorinhas) [BARREIRA]
  ROTA CAMINHO LIVRE (menor peso, sem barreiras)
    800 m (+240 m) · risco 0 · 0 alertas
    Rua das Paineiras 120 m -> Rua dos Bem-te-vis 120 m -> Avenida Central 320 m -> Rua dos Beija-flores 120 m -> Rua das Paineiras 120 m
  => Evita 2 de 2 alertas (100%) andando 240 m a mais.
```

**Exemplo 3: tabulação com limite** (`python main.py limite faculdade metro --hora 23 --extra 100`)

```text
Faculdade -> Estação de Metrô · 23h (noite) · pedestre · até 100 m a mais

  Rota comum: 610 m. Limite: 610 m + 100 m = 710 m
  Tabela T[b][v]: 711 linhas (b = 0 a 710 m) × 31 pontos = 22.041 células

  MELHOR ROTA COM ATÉ 710 m (menor risco)
    616 m (+6 m) · risco 1.920 · 1 alerta
    Rua das Acácias 240 m -> Rua das Andorinhas 136 m -> Avenida Central 240 m
    Alertas: Rua escura (Rua das Acácias, 205)

  Opções lidas na coluna da origem (cada uma troca distância por menos risco):
     distância      a mais      risco   alertas
         610 m        +0 m      3.980         3   <- rota comum
         616 m        +6 m      1.920         1
```

**Exemplo 4: resposta no formato da API** (`python main.py rota seu padaria --hora 8 --json`, pontos resumidos)

```json
{ "comum":        { "pontos": [{ "lat": -23.567349, "lon": -46.650861 }, "..."], "distanciaM": 320 },
  "caminhoLivre": { "pontos": [{ "lat": -23.567349, "lon": -46.650861 }, "..."], "distanciaM": 460 } }
```

Saídas completas na pasta [`exemplos/`](exemplos/):

| Arquivo | Conteúdo |
|---|---|
| [`saida_demo.txt`](exemplos/saida_demo.txt) | Saída de `python main.py demo` |
| [`rota_julia_23h.json`](exemplos/rota_julia_23h.json) | Rota da Júlia no formato de `GET /rotas` |
| [`trechos_pesos_23h.json`](exemplos/trechos_pesos_23h.json) | Grafo das 23h no formato de `GET /trechos/pesos` (serve de entrada para `--trechos-pesos`) |

---

## 7. Testes

```bash
cd dynamic-programming
python -m unittest discover -s tests -v
```

São **44 testes** (cerca de 3 s). Os mais importantes comparam cada técnica com uma **força bruta** que enumera todos os caminhos simples:

| Arquivo | O que verifica |
|---|---|
| `test_grafo.py` | Carga e validação do mapa; distâncias × coordenadas (Haversine); faixa noturna 19h–6h; peso de dia e de noite; soma de alertas; raio de 30 m; bloqueio só para mobilidade reduzida; categorias ignoradas; alertas expirados e resolvidos fora; ida e volta no formato `/trechos/pesos` |
| `test_dijkstra.py` | Grafo pequeno com resposta conhecida; sem caminho sem barreira (`aviso`); pontos desligados; cenários das personas; **Dijkstra = força bruta entre todos os pares de lugares** |
| `test_memo.py` | **Memo = força bruta** para vários limites; com e sem memo dão a mesma rota (com memo, mais de 10× menos chamadas); interrupção da recursão; proteção da pilha; acertos do cache, chave por faixa horária e respostas iguais ao cálculo direto |
| `test_tabulacao.py` | Grafo pequeno; opções da Júlia (610/616/770 m); opções de Pareto; uma tabela grande responde a limites menores; **tabulação = memoização** em 28 pares de lugares × 2 perfis × 4 limites |

---

## 8. Dados

`dados/grafo_mock.json` é um **bairro simulado no entorno da FIAP Paulista (Bela Vista, São Paulo)**: 31 pontos (8 lugares como faculdade, metrô, posto de saúde, padaria e as casas das personas), 40 trechos de calçada, 9 categorias e 12 alertas (10 ativos, 1 expirado e 1 resolvido). Ruas, coordenadas e alertas são **fictícios** e não há dados pessoais; as distâncias saem das coordenadas pela fórmula de Haversine.

| Categoria | Tipo | Peso de dia | Peso à noite | Bloqueia mobilidade reduzida |
|---|---|---:|---:|:---:|
| Degrau | ACESSIBILIDADE | 10 | 10 | sim |
| Falta de rampa | ACESSIBILIDADE | 8 | 8 | sim |
| Buraco | ACESSIBILIDADE | 3 | 5 | |
| Calçada quebrada | ACESSIBILIDADE | 2 | 3 | |
| Obra | ACESSIBILIDADE | 2 | 2 | |
| Rua escura | SEGURANCA | 0 | 8 | |
| Local deserto | SEGURANCA | 1 | 6 | |
| Assalto | SEGURANCA | 5 | 9 | |
| Alagamento | CLIMA | 6 | 6 | |

Os pesos são exemplos definidos para a demonstração. Para usar dados reais, basta trocar o JSON (mesmo formato, mesmos nomes das tabelas do banco) ou exportar `GET /trechos/pesos` da API e usar `--trechos-pesos`.

---

## 9. Estrutura

```text
dynamic-programming/
├── README.md
├── main.py              menu no terminal, comandos e demonstração
├── grafo.py             carga do mapa, peso dos trechos (regra do TrechoBO) e lista de adjacência
├── dijkstra.py          Grafos: rota comum × rota Caminho Livre
├── memo.py              Memoização: recursão com memo e cache de rotas
├── tabulacao.py         Tabulação: tabela T[b][v], melhor rota por limite e opções
├── dados/
│   └── grafo_mock.json  bairro simulado
├── exemplos/            saídas de exemplo (demo, GET /rotas, GET /trechos/pesos)
└── tests/               44 testes (unittest)
```

## 10. Ligação com o restante do projeto

Esta entrega é **isolada**, como combinado na equipe: não consome a API nem o banco. Ela usa as mesmas ideias e contratos:

- a **regra de peso** é a do `TrechoBO` da API Java (horário noturno, raio de 30 m, bloqueio por mobilidade, categorias ignoradas);
- o mapa usa os **nomes das tabelas** do banco (`LOCALIZACAO`, `TRECHO`, `CATEGORIA_OCORRENCIA`, `OCORRENCIA`);
- o grafo sai e entra no formato de **`GET /trechos/pesos`**, e a rota no formato de **`GET /rotas`**;
- a porcentagem de alertas evitados por rota é o **indicador de impacto** da Ficha da CitizenTech.

ODS conectados: **10** (redução das desigualdades), **11** (cidades e comunidades sustentáveis), **3** (saúde e bem-estar) e **9** (inovação e infraestrutura).

## 11. Como gerar o ZIP da entrega

Na raiz do repositório:

```bash
git archive --format=zip --output=dynamic-programming.zip HEAD dynamic-programming
```

O ZIP leva só os arquivos versionados: código-fonte completo, dados, exemplos, testes e este README.
