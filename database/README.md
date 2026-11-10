# 🗄️ Database Design — Caio

**Disciplina:** Database Design · **Entrega:** Teams até 19/11, 23h55

## Conceito
Projetar a base relacional que registra e consulta as informações do Caminho Livre: usuários, ocorrências, confirmações, localizações e trechos de rota.

## Entregáveis
- [ ] Modelo **conceitual** (`modelos/conceitual.png`)
- [ ] Modelo **lógico** (`modelos/logico.png`)
- [ ] Modelo **físico** (`modelos/fisico.png`)
- [ ] **Dicionário de dados** (`dicionario-dados.md` ou `.pdf`)
- [ ] Script de **criação** (`scripts/01_create.sql`): PK, FK, CHECK, UNIQUE, sequences/identity
- [ ] Script de **carga** (`scripts/02_insert.sql`): cerca de 10 linhas por tabela, com os pontos reais fotografados pela equipe
- [ ] **Consultas** do projeto (`scripts/03_consultas.sql`)

## Avaliação
| Critério | Peso |
|---|---|
| Modelagem | 3 |
| Normalização e integridade | 3 |
| SQL | 3 |
| Documentação | 1 |

## Tabelas
Alinhadas ao [backlog MoSCoW](../agile/backlog.md). A coluna "Histórias" mostra de onde cada tabela vem.

| Tabela | Colunas principais | Histórias |
|---|---|---|
| `USUARIO` | id, nome, email (UNIQUE), senha_hash, perfil (CHECK: PEDESTRE, MOBILIDADE_REDUZIDA), foto_url, pontos (DEFAULT 0), dt_cadastro | US01, US02, US13, US14, US17–19 |
| `CATEGORIA_OCORRENCIA` | id, nome, tipo (CHECK: ACESSIBILIDADE, SEGURANCA, CLIMA), peso_base, peso_noturno | US03–US05 |
| `LOCALIZACAO` | id, latitude, longitude, logradouro, bairro | US03, US06, US15 |
| `OCORRENCIA` | id, id_usuario (FK), id_categoria (FK), id_localizacao (FK), descricao, foto_url, status (CHECK: ABERTA, CONFIRMADA, EXPIRADA, RESOLVIDA), dt_registro, dt_expiracao | US03–US05, US09–US11 |
| `CONFIRMACAO` | id, id_ocorrencia (FK), id_usuario (FK), confirma (S/N), dt_confirmacao, UNIQUE(id_ocorrencia, id_usuario) | US08 |
| `PREFERENCIA_ROTA` | id_usuario (FK), id_categoria (FK), considerar (S/N), PK(id_usuario, id_categoria) | US12 |
| `TRECHO` | id, id_origem (FK LOCALIZACAO), id_destino (FK LOCALIZACAO), distancia_m, iluminado (S/N) | US06 |
| `ROTA_FAVORITA` *(Could)* | id, id_usuario (FK), id_origem (FK), id_destino (FK), apelido, dt_criacao | US16 |

> Categorias da carga inicial: Degrau, Buraco, Calçada quebrada, Obra (ACESSIBILIDADE); Rua escura, Assalto (SEGURANCA); **Alagamento** (CLIMA).
> `CONTATO_CONFIANCA` saiu do modelo: o "acompanhar trajeto" (US20) é Could e depende de tempo real, fora do escopo do banco.

## Consultas sugeridas
1. Ocorrências ativas por bairro e tipo (`GROUP BY`) → mapa (US04)
2. **Ranking dos melhores e piores bairros** por ocorrências ativas ponderadas pelo peso (US15)
3. Ocorrências com 3 ou mais confirmações positivas (`JOIN` + `HAVING`) (US08)
4. Ocorrências vencidas sem confirmação que devem passar para `EXPIRADA` (`UPDATE` com subquery) (US09)
5. Histórico de ocorrências de um usuário com o total de 👍/👎 (US11)
6. Ranking de usuários por pontos (US19)

## Integrações
- ➡️ **Ulisses (Java):** o DER é o contrato, então congelar os nomes até **11/11** (depois do backlog do MVP). O mesmo DER entra no PDF de Java.
- Pesos das categorias (`peso_base`, `peso_noturno`) são definidos pela equipe na carga. O Data Science é uma entrega isolada.
- Rodar os scripts no **Oracle da FIAP** antes da conexão da API.

## Estrutura
```
database/
├── modelos/        conceitual, lógico e físico (imagens + arquivo da ferramenta)
├── scripts/        01_create.sql, 02_insert.sql, 03_consultas.sql
└── dicionario-dados.md
```
