# Dicionário de dados — Caminho Livre

Banco: **Oracle 19c+ (FIAP)** · Scripts em [`scripts/`](scripts/) · Modelos em [`modelos/`](modelos/)

Convenções: nomes em minúsculas com `_`; chaves primárias `id` com `IDENTITY`; flags `CHAR(1)` com `CHECK ('S','N')`; datas `TIMESTAMP` no fuso America/Sao_Paulo. Constraints nomeadas `pk_`, `fk_`, `uk_`, `ck_`; índices `ix_`.

## Normalização
- **1FN:** todos os atributos são atômicos (latitude e longitude separadas; nada de listas em colunas).
- **2FN:** a única PK composta (`preferencia_rota`) tem `considerar` dependendo das duas colunas da chave.
- **3FN:** atributos que dependem da categoria (tipo, pesos, bloqueio) ficam em `categoria_ocorrencia`, e não se repetem em `ocorrencia`; endereço e bairro ficam em `localizacao`.
- **Derivados não armazenados:** totais de 👍/👎 e o peso de cada trecho são calculados em consulta. Exceções conscientes: `usuario.pontos` é guardado (somado pela API) para o ranking não recalcular todo o histórico, e `ocorrencia.status` guarda `CONFIRMADA` e `RESOLVIDA`, que derivam da contagem em `confirmacao`, para o mapa filtrar alertas ativos sem contar votos a cada leitura. A API atualiza os dois na mesma transação do voto.
- **Bairro como texto:** `localizacao.bairro` fica como texto, preenchido a partir do endereço, e não como tabela própria. Uma tabela `BAIRRO` evitaria grafias diferentes no ranking, mas mudaria a API perto da entrega. Fica como evolução.

---

## USUARIO
Pessoa que usa o app. Autenticada só pelo Google (sem senha, RNF06). Histórias: US01, US12, US13, US17–US19.

| Coluna | Tipo | Nulo | Padrão | Restrições | Descrição |
|---|---|---|---|---|---|
| id | NUMBER(10) | Não | identity | PK | Identificador |
| nome | VARCHAR2(100) | Não | | | Nome vindo do Google, editável |
| email | VARCHAR2(150) | Não | | UNIQUE, CHECK formato | E-mail da conta Google |
| google_id | VARCHAR2(255) | Não | | UNIQUE | `sub` do ID token do Google |
| mobilidade_reduzida | CHAR(1) | Não | 'N' | CHECK S/N | Resposta do onboarding |
| foto_url | VARCHAR2(500) | Sim | | | URL da foto (Google ou Vercel Blob) |
| pontos | NUMBER(8) | Não | 0 | CHECK ≥ 0 | +10 por alerta, +2 por avaliação |
| dt_cadastro | TIMESTAMP | Não | SYSTIMESTAMP | | Primeiro login |

## CATEGORIA_OCORRENCIA
Tipos de problema e seus pesos no cálculo da rota. Histórias: US02, US04, US11.

| Coluna | Tipo | Nulo | Padrão | Restrições | Descrição |
|---|---|---|---|---|---|
| id | NUMBER(5) | Não | identity | PK | Identificador |
| nome | VARCHAR2(50) | Não | | UNIQUE | Ex.: Degrau, Rua escura, Alagamento |
| tipo | VARCHAR2(15) | Não | | CHECK ACESSIBILIDADE, SEGURANCA, CLIMA | Camada do mapa |
| peso_base | NUMBER(5,2) | Não | | CHECK ≥ 0 | Peso entre 6h e 19h |
| peso_noturno | NUMBER(5,2) | Não | | CHECK ≥ 0 | Peso entre 19h e 6h |
| bloqueia_mobilidade | CHAR(1) | Não | 'N' | CHECK S/N | S = trecho intransponível para mobilidade reduzida |

## LOCALIZACAO
Ponto geográfico: vértice do grafo de ruas ou local de um alerta. Histórias: US02, US04, US14.

| Coluna | Tipo | Nulo | Padrão | Restrições | Descrição |
|---|---|---|---|---|---|
| id | NUMBER(10) | Não | identity | PK | Identificador |
| latitude | NUMBER(9,6) | Não | | CHECK -90..90 | Graus decimais |
| longitude | NUMBER(9,6) | Não | | CHECK -180..180 | Graus decimais |
| logradouro | VARCHAR2(150) | Sim | | | Rua, cruzamento ou referência |
| bairro | VARCHAR2(80) | Sim | | índice | Usado no ranking de bairros |

## OCORRENCIA
Alerta enviado por um usuário. Histórias: US02, US03, US07–US10.

| Coluna | Tipo | Nulo | Padrão | Restrições | Descrição |
|---|---|---|---|---|---|
| id | NUMBER(10) | Não | identity | PK | Identificador |
| id_usuario | NUMBER(10) | **Sim** | | FK → usuario, ON DELETE SET NULL | Autor; NULL após exclusão da conta (LGPD) |
| id_categoria | NUMBER(5) | Não | | FK → categoria_ocorrencia | Tipo do problema |
| id_localizacao | NUMBER(10) | Não | | FK → localizacao | Onde está |
| descricao | VARCHAR2(500) | Sim | | | Texto livre |
| foto_url | VARCHAR2(500) | Sim | | | URL no Vercel Blob |
| status | VARCHAR2(10) | Não | 'ABERTA' | CHECK ABERTA, CONFIRMADA, EXPIRADA, RESOLVIDA | Ciclo de vida |
| dt_registro | TIMESTAMP | Não | SYSTIMESTAMP | | Envio |
| dt_expiracao | TIMESTAMP | Não | trigger: registro + 15 dias | CHECK > dt_registro | Validade sem confirmação |

**Ciclo de vida:** nasce `ABERTA` → 3 👍 = `CONFIRMADA` · 3 👎 (total) = `RESOLVIDA` · `ABERTA` vencida = `EXPIRADA`. Ativas = `ABERTA` + `CONFIRMADA`.

## CONFIRMACAO
Avaliação de um usuário sobre o alerta de outra pessoa. História: US07.

| Coluna | Tipo | Nulo | Padrão | Restrições | Descrição |
|---|---|---|---|---|---|
| id | NUMBER(10) | Não | identity | PK | Identificador |
| id_ocorrencia | NUMBER(10) | Não | | FK → ocorrencia, ON DELETE CASCADE | Alerta avaliado |
| id_usuario | NUMBER(10) | Não | | FK → usuario, ON DELETE CASCADE | Quem avaliou |
| confirma | CHAR(1) | Não | | CHECK S/N | S = 👍 ainda está lá · N = 👎 já foi resolvido |
| dt_confirmacao | TIMESTAMP | Não | SYSTIMESTAMP | | Momento da avaliação |

Restrições extras: `UNIQUE (id_ocorrencia, id_usuario)` (uma avaliação por pessoa) e trigger `trg_confirmacao_autor` (o autor não avalia o próprio alerta, erro ORA-20001).

## PREFERENCIA_ROTA
Categorias que o usuário quer considerar na rota. Ausência de linha = considerar. História: US11.

| Coluna | Tipo | Nulo | Padrão | Restrições | Descrição |
|---|---|---|---|---|---|
| id_usuario | NUMBER(10) | Não | | PK, FK → usuario, ON DELETE CASCADE | Dono |
| id_categoria | NUMBER(5) | Não | | PK, FK → categoria_ocorrencia | Categoria |
| considerar | CHAR(1) | Não | 'S' | CHECK S/N | N = ignorar no cálculo |

## TRECHO
Segmento de rua entre duas localizações (aresta não direcionada do grafo). História: US04.

| Coluna | Tipo | Nulo | Padrão | Restrições | Descrição |
|---|---|---|---|---|---|
| id | NUMBER(10) | Não | identity | PK | Identificador |
| id_origem | NUMBER(10) | Não | | FK → localizacao | Ponta A |
| id_destino | NUMBER(10) | Não | | FK → localizacao, CHECK ≠ origem | Ponta B |
| distancia_m | NUMBER(7,1) | Não | | CHECK > 0 | Metros |
| iluminado | CHAR(1) | Não | 'S' | CHECK S/N | Informativo para o mapa |

Restrições extras: `UNIQUE (id_origem, id_destino)` e o índice único `uk_trecho_par` em `(LEAST(id_origem, id_destino), GREATEST(id_origem, id_destino))`, que impede cadastrar o mesmo trecho no sentido inverso.

## ROTA_FAVORITA *(Could)*
Rota salva com apelido. História: US16.

| Coluna | Tipo | Nulo | Padrão | Restrições | Descrição |
|---|---|---|---|---|---|
| id | NUMBER(10) | Não | identity | PK | Identificador |
| id_usuario | NUMBER(10) | Não | | FK → usuario, ON DELETE CASCADE | Dono |
| id_origem | NUMBER(10) | Não | | FK → localizacao | Início |
| id_destino | NUMBER(10) | Não | | FK → localizacao, CHECK ≠ origem | Fim |
| apelido | VARCHAR2(60) | Não | | | Ex.: "Casa - metrô" |
| dt_criacao | TIMESTAMP | Não | SYSTIMESTAMP | | Quando foi salva |

---

## Relacionamentos

| De | Para | Cardinalidade | Regra ao excluir |
|---|---|---|---|
| usuario | ocorrencia | 1 : 0..N | SET NULL (anonimiza) |
| categoria_ocorrencia | ocorrencia | 1 : 0..N | restrito |
| localizacao | ocorrencia | 1 : 0..N | restrito |
| ocorrencia | confirmacao | 1 : 0..N | CASCADE |
| usuario | confirmacao | 1 : 0..N | CASCADE |
| usuario × categoria_ocorrencia | preferencia_rota | N : N | CASCADE |
| localizacao | trecho (origem / destino) | 1 : 0..N (duas vezes) | restrito |
| usuario | rota_favorita | 1 : 0..N | CASCADE |
| localizacao | rota_favorita (origem / destino) | 1 : 0..N (duas vezes) | restrito |

## Objetos auxiliares

| Objeto | Tipo | Função |
|---|---|---|
| `trg_ocorrencia_expiracao` | Trigger BEFORE INSERT | Preenche `dt_registro` e `dt_expiracao = registro + 15 dias` (US08) |
| `trg_confirmacao_autor` | Trigger BEFORE INSERT OR UPDATE | Impede o autor de avaliar o próprio alerta (RF12) |
| `uk_trecho_par` | Índice único | Mesmo trecho não entra de novo no sentido inverso |
| `ix_ocorrencia_status` | Índice | Filtro do mapa e rotina de expiração (`status`, `dt_expiracao`) |
| `ix_localizacao_bairro` | Índice | Ranking de bairros |
| demais `ix_*` | Índices | Uma por FK, para JOINs e cascatas |
