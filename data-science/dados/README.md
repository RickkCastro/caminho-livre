# Dados: fontes, extratos e dicionário

Todos os dados são **públicos** e **não têm dados pessoais**. Os arquivos originais são grandes (~680 MB), por isso o repositório guarda só os **extratos** usados no notebook, com o script que os gera a partir das fontes oficiais.

## Fontes

| Base | Quem publica | Onde | Arquivos usados | Versão | Licença |
|---|---|---|---|---|---|
| **Dados criminais 2025** (SP Dados, RES 160/516) | Secretaria da Segurança Pública do Estado de São Paulo (SSP-SP) | [ssp.sp.gov.br/estatistica/consultas](https://www.ssp.sp.gov.br/estatistica/consultas) → *Consultas – Base de Dados* → *Dados criminais* → 2025 | `SPDadosCriminais_2025.xlsx` (196 MB, 2 abas de dados + aba de dicionário `CAMPOS_DA_TABELA_SPDADOS`) | atualizado pela SSP em 30/06/2026 | dado público de transparência |
| **Dados do SP156 – Solicitações** | Prefeitura de São Paulo, Secretaria de Inovação e Tecnologia (SMIT) | [dados.prefeitura.sp.gov.br/dataset/dados-do-sp156](https://dados.prefeitura.sp.gov.br/dataset/dados-do-sp156) | 4 CSVs trimestrais de 2025 (`arquivo-final-N-trim-25.csv`, 485 MB) + dicionário (`dicionario-dados-abertos-sp156-2020-em-diante.txt`) | publicados em 10/08/2026 | Creative Commons CC0 |

Baixados em **16/11/2026**. A SSP e a Prefeitura podem atualizar os arquivos; os códigos SHA-256 abaixo identificam a versão exata usada.

| Arquivo bruto | SHA-256 |
|---|---|
| `SPDadosCriminais_2025.xlsx` | `4ab5b40229d245a0f50b65e74ea9e9b7750bbdb3bff7b02d961d78b9c4143d8c` |
| SP156 1º trimestre 2025 | `f9d02a8bf358f019a5851e0d3d05daa236f803f5b22f254b66fd7b69f63e5170` |
| SP156 2º trimestre 2025 | `66fc96cf4c4bed437b9f560f23aeb8d93c33d2ff7212fd0bc240742681bedc1e` |
| SP156 3º trimestre 2025 | `6b5c382dbc409074db3a3dbdb577c4c2abc76c8009757a457a2a418956e22c2d` |
| SP156 4º trimestre 2025 | `0a19e3451e30f33f1a8c2581608e1cc92d036915d0594737f0a2ceb0e05929cc` |

## Como reproduzir

A partir da pasta `data-science/`:

```bash
python dados/baixar_dados.py
```

```bash
python dados/gerar_extratos.py
```

O primeiro baixa os brutos para `dados/brutos/` (pasta ignorada pelo git). O segundo gera os três arquivos abaixo.

## Arquivos desta pasta

| Arquivo | O que é |
|---|---|
| `ssp_roubos_furtos_capital_2025.csv.gz` | Extrato da SSP: **346.702** registros de roubo e furto (naturezas *ROUBO - OUTROS* e *FURTO - OUTROS*) ocorridos na cidade de São Paulo e registrados em 2025 |
| `sp156_rua_e_bairro_2025.csv.gz` | Extrato do SP156: **336.555** solicitações do tema *Rua e bairro* abertas em 2025 |
| `funil_extracao.csv` | Quantas linhas sobraram em cada etapa da extração |
| `baixar_dados.py` | Baixa os arquivos originais das fontes oficiais |
| `gerar_extratos.py` | Faz o recorte e a anonimização e grava os extratos |

Os `.csv.gz` são CSV comuns compactados: o pandas lê direto (`pd.read_csv("arquivo.csv.gz")`), e qualquer descompactador abre.

### O que o `gerar_extratos.py` fez (e o que não fez)

**Fez:** recorte (cidade de São Paulo + naturezas de roubo e furto; tema "Rua e bairro") e anonimização:

* o número do boletim de ocorrência virou um **código pseudônimo** (12 primeiros caracteres do SHA-256 de delegacia + número + ano), que só serve para achar duplicatas;
* **logradouro, número e CEP foram descartados**;
* **latitude e longitude foram arredondadas** para 3 casas decimais (~100 m);
* no SP156, foram removidas as **305.671 linhas totalmente vazias** do arquivo do 1º trimestre (o CSV foi exportado do Excel e completado com linhas em branco até o limite de 1.048.576 linhas da planilha; os dados não foram cortados, as datas vão até 31/03).

**Não fez:** nenhuma limpeza de conteúdo. Os textos `"NULL"`, as duplicatas, as datas de outros anos, as grafias diferentes etc. continuam nos extratos e são tratados **passo a passo no notebook** (`analise.ipynb`, seções A.1 e B.1).

## Dicionário dos extratos

### `ssp_roubos_furtos_capital_2025.csv.gz`

Mesmos nomes de coluna do arquivo da SSP (inclusive a grafia `CIRCUNCRIÇÃO`). O texto `NULL` indica campo vazio no banco da SSP.

| Coluna | Descrição |
|---|---|
| `ID_BO_PSEUDONIMO` | Código pseudônimo do boletim (ver acima) |
| `DATA_REGISTRO` | Data do registro do BO |
| `DATA_OCORRENCIA_BO` | Data do fato |
| `HORA_OCORRENCIA_BO` | Hora do fato (`HH:MM:SS`); `NULL` quando a vítima não informou a hora exata |
| `DESC_PERIODO` | Período do fato quando não há hora exata: *Pela manhã*, *A tarde*, *A noite*, *De madrugada* ou *Em hora incerta* |
| `DESCR_TIPOLOCAL` | Grupo do tipo de local (*Via Pública*, *Residência*, *Terminal/Estação*...) |
| `DESCR_SUBTIPOLOCAL` | Subtipo do local (*Via Pública*, *Interior de Transporte Coletivo*...) |
| `BAIRRO` | Bairro informado no BO (texto livre, sem padronização) |
| `LATITUDE`, `LONGITUDE` | Coordenadas arredondadas (~100 m). Vazias em 38.976 linhas e iguais a `0.000` em 20.765, quando a SSP não divulga a localização |
| `NOME_DELEGACIA_CIRCUNCRIÇÃO` | Delegacia da área onde o fato aconteceu |
| `RUBRICA` | Natureza jurídica (*Roubo (art. 157)*, *Furto (art. 155)*...) |
| `DESCR_CONDUTA` | Circunstância (*Transeunte*, *Outros*, *Interior de Veículo*, *Fios e Cabos*...) |
| `NATUREZA_APURADA` | *ROUBO - OUTROS* ou *FURTO - OUTROS* (classificação validada pela SSP) |

### `sp156_rua_e_bairro_2025.csv.gz`

| Coluna | Descrição |
|---|---|
| `Data de Abertura` | Data em que a solicitação foi aberta (`dd/mm/aaaa`) |
| `Data de Finalização` | Data em que o protocolo foi encerrado; vazia se ainda não foi |
| `Tema` | Sempre *Rua e bairro* neste extrato |
| `Assunto` | Subdivisão do tema (*Calçadas, guias e postes*, *Reparos em Asfalto*...) |
| `Serviço` | Serviço pedido (*Tapa-buraco*, *Acessibilidade - solicitar avaliação de obstáculo na calçada*...) |
| `Status` | *Finalizada*, *Aberto*, *Em Andamento* ou *Cancelada* (na data de geração do arquivo, agosto de 2026) |
| `Latitude`, `Longitude` | Coordenadas arredondadas (~100 m) do local do pedido |
| `Prefeitura Operacional` | Subprefeitura (tem grafias alternativas e nomes de órgãos, corrigidos no notebook) |
| `Distrito` | Distrito administrativo (96 na cidade) |

## Problemas de qualidade encontrados (e como foram tratados)

| Base | Problema | Tratamento |
|---|---|---|
| SSP | Campo vazio escrito como o texto `"NULL"` | Convertido em nulo |
| SSP | 35% dos roubos/furtos a pedestres sem hora exata (48% dos furtos, 10% dos roubos) | Análise por hora só com quem tem hora; checagem de robustez com o período informado |
| SSP | Hora estimada: 34% dos horários terminam em `:00` e 85% em múltiplos de 5 minutos | Análise por hora cheia, não por minuto |
| SSP | BOs registrados em 2025 sobre fatos de anos anteriores | Mantidos só fatos de 2025 |
| SSP | 28 BOs aparecem duas vezes (como furto e como roubo) | Uma linha por BO, priorizando o roubo |
| SSP | Conduta "Transeunte" pouco usada; a maioria dos roubos de rua está como "Outros" | Pedestre = via pública + conduta Transeunte/Outros, fora de veículos; robustez só com "Transeunte" |
| SP156 | 305.671 linhas vazias no 1º trimestre | Removidas na extração |
| SP156 | Subprefeitura com grafias alternativas (*CASA VERDE-LIMAO-CACHOEIRINHA*, *PERUS-ANHANGUERA*) e nomes de órgãos | Grafias unificadas; órgãos viraram nulo |
| SP156 | Nenhuma categoria de iluminação pública em 2025 | A hipótese 2 do README (iluminação × crime) não pôde ser testada |
