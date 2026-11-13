# Modelos — Caminho Livre

Os diagramas abaixo estão em [Mermaid](https://mermaid.js.org/) e aparecem desenhados no GitHub. As imagens `conceitual.png`, `logico.png` e `fisico.png` desta pasta são exportadas deles. Detalhe de cada coluna: [dicionário de dados](../dicionario-dados.md).

## 1. Modelo conceitual

Entidades e relacionamentos, sem atributos técnicos.

```mermaid
erDiagram
    USUARIO ||--o{ OCORRENCIA : "envia"
    USUARIO ||--o{ CONFIRMACAO : "avalia"
    OCORRENCIA ||--o{ CONFIRMACAO : "recebe"
    CATEGORIA ||--o{ OCORRENCIA : "classifica"
    LOCALIZACAO ||--o{ OCORRENCIA : "situa"
    USUARIO }o--o{ CATEGORIA : "prefere considerar na rota"
    LOCALIZACAO ||--o{ TRECHO : "liga (origem e destino)"
    USUARIO ||--o{ ROTA_FAVORITA : "salva"
    LOCALIZACAO ||--o{ ROTA_FAVORITA : "começa / termina"
```

## 2. Modelo lógico

Atributos, chaves e cardinalidades; o N:N de preferências vira a entidade associativa `PREFERENCIA_ROTA`.

```mermaid
erDiagram
    USUARIO {
        int id PK
        string nome
        string email UK
        string google_id UK
        char mobilidade_reduzida
        string foto_url
        int pontos
        timestamp dt_cadastro
    }
    CATEGORIA_OCORRENCIA {
        int id PK
        string nome UK
        string tipo
        decimal peso_base
        decimal peso_noturno
        char bloqueia_mobilidade
    }
    LOCALIZACAO {
        int id PK
        decimal latitude
        decimal longitude
        string logradouro
        string bairro
    }
    OCORRENCIA {
        int id PK
        int id_usuario FK "NULL = anonimizada"
        int id_categoria FK
        int id_localizacao FK
        string descricao
        string foto_url
        string status
        timestamp dt_registro
        timestamp dt_expiracao
    }
    CONFIRMACAO {
        int id PK
        int id_ocorrencia FK
        int id_usuario FK
        char confirma
        timestamp dt_confirmacao
    }
    PREFERENCIA_ROTA {
        int id_usuario PK, FK
        int id_categoria PK, FK
        char considerar
    }
    TRECHO {
        int id PK
        int id_origem FK
        int id_destino FK
        decimal distancia_m
        char iluminado
    }
    ROTA_FAVORITA {
        int id PK
        int id_usuario FK
        int id_origem FK
        int id_destino FK
        string apelido
        timestamp dt_criacao
    }

    USUARIO |o--o{ OCORRENCIA : "envia"
    CATEGORIA_OCORRENCIA ||--o{ OCORRENCIA : "classifica"
    LOCALIZACAO ||--o{ OCORRENCIA : "situa"
    OCORRENCIA ||--o{ CONFIRMACAO : "recebe"
    USUARIO ||--o{ CONFIRMACAO : "avalia"
    USUARIO ||--o{ PREFERENCIA_ROTA : "define"
    CATEGORIA_OCORRENCIA ||--o{ PREFERENCIA_ROTA : "é preferida em"
    LOCALIZACAO ||--o{ TRECHO : "origem"
    LOCALIZACAO ||--o{ TRECHO : "destino"
    USUARIO ||--o{ ROTA_FAVORITA : "salva"
    LOCALIZACAO ||--o{ ROTA_FAVORITA : "origem / destino"
```

## 3. Modelo físico (Oracle)

Tipos Oracle, nulidade e constraints, como em [`01_create.sql`](../scripts/01_create.sql).

```mermaid
erDiagram
    USUARIO {
        NUMBER_10 id PK "IDENTITY"
        VARCHAR2_100 nome "NOT NULL"
        VARCHAR2_150 email UK "NOT NULL"
        VARCHAR2_255 google_id UK "NOT NULL"
        CHAR_1 mobilidade_reduzida "DEFAULT N, CHECK S/N"
        VARCHAR2_500 foto_url
        NUMBER_8 pontos "DEFAULT 0, CHECK >= 0"
        TIMESTAMP dt_cadastro "DEFAULT SYSTIMESTAMP"
    }
    CATEGORIA_OCORRENCIA {
        NUMBER_5 id PK "IDENTITY"
        VARCHAR2_50 nome UK "NOT NULL"
        VARCHAR2_15 tipo "CHECK ACESSIBILIDADE/SEGURANCA/CLIMA"
        NUMBER_5_2 peso_base "CHECK >= 0"
        NUMBER_5_2 peso_noturno "CHECK >= 0"
        CHAR_1 bloqueia_mobilidade "DEFAULT N, CHECK S/N"
    }
    LOCALIZACAO {
        NUMBER_10 id PK "IDENTITY"
        NUMBER_9_6 latitude "CHECK -90..90"
        NUMBER_9_6 longitude "CHECK -180..180"
        VARCHAR2_150 logradouro
        VARCHAR2_80 bairro "INDEX"
    }
    OCORRENCIA {
        NUMBER_10 id PK "IDENTITY"
        NUMBER_10 id_usuario FK "NULL, ON DELETE SET NULL"
        NUMBER_5 id_categoria FK "NOT NULL"
        NUMBER_10 id_localizacao FK "NOT NULL"
        VARCHAR2_500 descricao
        VARCHAR2_500 foto_url
        VARCHAR2_10 status "DEFAULT ABERTA, CHECK"
        TIMESTAMP dt_registro "DEFAULT SYSTIMESTAMP"
        TIMESTAMP dt_expiracao "TRIGGER +15 dias, CHECK > registro"
    }
    CONFIRMACAO {
        NUMBER_10 id PK "IDENTITY"
        NUMBER_10 id_ocorrencia FK "ON DELETE CASCADE"
        NUMBER_10 id_usuario FK "ON DELETE CASCADE"
        CHAR_1 confirma "CHECK S/N"
        TIMESTAMP dt_confirmacao "DEFAULT SYSTIMESTAMP"
    }
    PREFERENCIA_ROTA {
        NUMBER_10 id_usuario PK, FK "ON DELETE CASCADE"
        NUMBER_5 id_categoria PK, FK "ON DELETE CASCADE"
        CHAR_1 considerar "DEFAULT S, CHECK S/N"
    }
    TRECHO {
        NUMBER_10 id PK "IDENTITY"
        NUMBER_10 id_origem FK "UK com destino"
        NUMBER_10 id_destino FK "CHECK <> origem"
        NUMBER_7_1 distancia_m "CHECK > 0"
        CHAR_1 iluminado "DEFAULT S, CHECK S/N"
    }
    ROTA_FAVORITA {
        NUMBER_10 id PK "IDENTITY"
        NUMBER_10 id_usuario FK "ON DELETE CASCADE"
        NUMBER_10 id_origem FK
        NUMBER_10 id_destino FK "CHECK <> origem"
        VARCHAR2_60 apelido "NOT NULL"
        TIMESTAMP dt_criacao "DEFAULT SYSTIMESTAMP"
    }

    USUARIO |o--o{ OCORRENCIA : "fk_ocorrencia_usuario"
    CATEGORIA_OCORRENCIA ||--o{ OCORRENCIA : "fk_ocorrencia_categoria"
    LOCALIZACAO ||--o{ OCORRENCIA : "fk_ocorrencia_localizacao"
    OCORRENCIA ||--o{ CONFIRMACAO : "fk_confirmacao_ocorrencia"
    USUARIO ||--o{ CONFIRMACAO : "fk_confirmacao_usuario"
    USUARIO ||--o{ PREFERENCIA_ROTA : "fk_preferencia_usuario"
    CATEGORIA_OCORRENCIA ||--o{ PREFERENCIA_ROTA : "fk_preferencia_categoria"
    LOCALIZACAO ||--o{ TRECHO : "fk_trecho_origem"
    LOCALIZACAO ||--o{ TRECHO : "fk_trecho_destino"
    USUARIO ||--o{ ROTA_FAVORITA : "fk_rota_favorita_usuario"
    LOCALIZACAO ||--o{ ROTA_FAVORITA : "fk_rota_favorita_origem/destino"
```

Triggers do físico: `trg_ocorrencia_expiracao` (validade de 15 dias) e `trg_confirmacao_autor` (autor não avalia o próprio alerta).
