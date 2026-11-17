# 🗄️ Database Design — Henrique

**Disciplina:** Database Design · **Entrega:** Teams até 19/11, 23h55

## Conceito
Projetar a base relacional que registra e consulta as informações do Caminho Livre: usuários, ocorrências, confirmações, localizações e trechos de rota.

## Entregáveis (rubrica da GS)
| # | Item | Pontos | Onde | Status |
|---|---|---|---|---|
| 1 | Apresentação: capa (integrantes em ordem alfabética, RM, equipe, solução), sumário, objetivo e escopo, funcionalidades | 10 | [`Database_GS_CaminhoLivre.pdf`](Database_GS_CaminhoLivre.pdf) | [x] |
| 2 | **Diagrama do modelo lógico feito no Oracle Data Modeler** | 20 | mesmo PDF, imagens `modelos/Relational_1.png` e `modelos/Logical.png` | [x] |
| 3 | Script **DDL** | 20 | `scripts/01_create.sql` | [x] |
| 4 | Script **DML** (≥ 5 linhas por tabela) | 20 | `scripts/02_insert.sql` | [x] |
| 5 | Script **DQL**: A1 INNER JOIN · A2 INNER JOIN + GROUP BY · A3 LEFT OUTER JOIN + WHERE + ORDER BY, todas com 2 tabelas | 30 | `scripts/03_consultas.sql` (Parte A) | [x] |

**Envio no Teams:** o PDF (itens 1 e 2) e os três `.sql` (itens 3 a 5) como arquivos de texto. Não incluir links para diagramas em nuvem.

### Diagrama no Oracle Data Modeler
1. Rode `01_create.sql` no Oracle da FIAP, se ainda não rodou.
2. No Data Modeler (ou SQL Developer → *View → Data Modeler → Browser*): **File → Import → Data Dictionary**, conecte no Oracle da FIAP, escolha o seu schema e marque as 8 tabelas → *Finish*. Também funciona por **File → Import → DDL File** com o `01_create.sql`, sem conectar.
3. Organize o diagrama relacional (botão direito → *Layout → Resize Objects to Visible* e arraste para não cruzar linhas). Confira se aparecem PK, FK e as cardinalidades.
4. **Engineer to Logical Model** gera a visão de entidades. Nela, marque como opcional o lado da tabela referenciada em cada relacionamento (duplo clique na linha → *Source/Target Optional*): a metade tracejada fica do lado do pai, e `usuario`–`ocorrencia` fica toda tracejada. Não use *Engineer to Relational Model* depois disso: ele recria o relacional com nomes padrão (`usuario_id`, `localizacao_id1`) que não batem com o `01_create.sql`.
5. **File → Data Modeler → Print Diagram → To Image File**, e salve como `database/modelos/Relational_1.png` (relacional) e `Logical.png` (entidades).
6. Gere o PDF de novo:
   ```bash
   cd agile/pdf && npm install && node build.js ../../database/Database_GS_CaminhoLivre.md Database
   ```

Material de apoio (não vai no PDF da entrega): modelos conceitual, lógico e físico em Mermaid ([`modelos/modelos.md`](modelos/modelos.md)) e o [dicionário de dados](dicionario-dados.md).

## Tabelas
Alinhadas ao [backlog MoSCoW](../agile/backlog.md). A coluna "Histórias" mostra de onde cada tabela vem.

| Tabela | Colunas principais | Histórias |
|---|---|---|
| `USUARIO` | id, nome, email (UNIQUE), google_id (UNIQUE), mobilidade_reduzida (S/N), foto_url, pontos (DEFAULT 0), dt_cadastro | US01, US12, US13, US17–US19 |
| `CATEGORIA_OCORRENCIA` | id, nome, tipo (CHECK: ACESSIBILIDADE, SEGURANCA, CLIMA), peso_base, peso_noturno, bloqueia_mobilidade (S/N, DEFAULT N) | US02 |
| `LOCALIZACAO` | id, latitude, longitude, logradouro, bairro | US02, US04, US14 |
| `OCORRENCIA` | id, id_usuario (FK, NULL quando a conta é excluída), id_categoria (FK), id_localizacao (FK), descricao, foto_url, status (CHECK: ABERTA, CONFIRMADA, EXPIRADA, RESOLVIDA), dt_registro, dt_expiracao | US02, US08–US10 |
| `CONFIRMACAO` | id, id_ocorrencia (FK), id_usuario (FK), confirma (S/N), dt_confirmacao, UNIQUE(id_ocorrencia, id_usuario) | US07 |
| `PREFERENCIA_ROTA` | id_usuario (FK), id_categoria (FK), considerar (S/N), PK(id_usuario, id_categoria) | US11 |
| `TRECHO` | id, id_origem (FK LOCALIZACAO), id_destino (FK LOCALIZACAO), distancia_m, iluminado (S/N) | US04 |
| `ROTA_FAVORITA` *(Could)* | id, id_usuario (FK), id_origem (FK), id_destino (FK), apelido, dt_criacao | US16 |

> Categorias da carga inicial: Degrau\*, Falta de rampa\*, Buraco, Calçada quebrada, Obra (ACESSIBILIDADE); Rua escura, Local deserto, Assalto (SEGURANCA); **Alagamento** (CLIMA). \* `bloqueia_mobilidade = S`.
> `CONTATO_CONFIANCA` saiu do modelo: o "acompanhar trajeto" (US20) é Could e depende de tempo real, fora do escopo do banco.

## Consultas complementares (Parte B do `03_consultas.sql`)
1. Ocorrências ativas por bairro e tipo (`GROUP BY`) → mapa (US03)
2. **Ranking dos melhores e piores bairros** por ocorrências ativas ponderadas pelo peso (US14)
3. Ocorrências com 3 ou mais confirmações positivas (`JOIN` + `HAVING`) (US07)
4. Ocorrências vencidas sem confirmação que devem passar para `EXPIRADA` (`UPDATE` com subquery) (US08)
5. Histórico de ocorrências de um usuário com o total de 👍/👎 (US10)
6. Ranking de usuários por pontos (US19)

## Como executar
No Oracle da FIAP (SQL Developer, F5 "Executar script"), nesta ordem: `scripts/01_create.sql` → `scripts/02_insert.sql` → `scripts/03_consultas.sql`. O 01 apaga e recria tudo, então pode ser rodado de novo.

## Integrações
- ➡️ **Ulisses (Java):** o DER é o contrato, então congelar os nomes até **11/11** (depois do backlog do MVP). O mesmo DER entra no PDF de Java.
- Pesos das categorias (`peso_base`, `peso_noturno`) são definidos pela equipe na carga. O Data Science é uma entrega isolada.
- Rodar os scripts no **Oracle da FIAP** antes da conexão da API.

## Estrutura
```
database/
├── Database_GS_CaminhoLivre.md / .pdf   documento da entrega (itens 1 e 2)
├── modelos/        modelos.md (Mermaid) e Relational_1.png e Logical.png (Data Modeler)
├── scripts/        01_create.sql, 02_insert.sql, 03_consultas.sql
└── dicionario-dados.md
```
