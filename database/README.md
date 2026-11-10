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
| Tabela | Colunas principais |
|---|---|
| `USUARIO` | id, nome, email (UNIQUE), senha_hash, perfil (CHECK: MOBILIDADE_REDUZIDA, PEDESTRE, GESTOR), dt_cadastro |
| `CATEGORIA_OCORRENCIA` | id, nome, tipo (CHECK: ACESSIBILIDADE, SEGURANCA), peso_base, peso_noturno |
| `LOCALIZACAO` | id, latitude, longitude, logradouro, bairro |
| `OCORRENCIA` | id, id_usuario (FK), id_categoria (FK), id_localizacao (FK), descricao, foto_url, status (CHECK: ABERTA, CONFIRMADA, RESOLVIDA, EXPIRADA), anonima (S/N), dt_registro, dt_expiracao |
| `CONFIRMACAO` | id, id_ocorrencia (FK), id_usuario (FK), confirma (S/N), dt_confirmacao, UNIQUE(id_ocorrencia, id_usuario) |
| `TRECHO` | id, id_origem (FK LOCALIZACAO), id_destino (FK LOCALIZACAO), distancia_m, iluminado (S/N) |
| `ROTA_SALVA` | id, id_usuario (FK), id_origem (FK), id_destino (FK), perfil_usado, dt_criacao |
| `CONTATO_CONFIANCA` | id, id_usuario (FK), nome, telefone *(simulado)* |

## Consultas sugeridas
1. Ocorrências abertas por bairro e tipo (`GROUP BY`)
2. As 5 ruas com mais relatos de segurança entre 19h e 23h
3. Ocorrências com 3 ou mais confirmações positivas (`JOIN` + `HAVING`)
4. Ocorrências vencidas que devem passar para `EXPIRADA` (`UPDATE` com subquery)
5. Tempo médio até a resolução por categoria
6. Usuários que mais contribuíram (ocorrências + confirmações)

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
