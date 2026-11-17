-- =====================================================================
-- Caminho Livre — Script de criação (Oracle 19c+ / Oracle FIAP)
-- Global Solution 2026.2 · Grupo OctoFlow
-- Rodar inteiro: apaga e recria todas as tabelas, índices e triggers.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Limpeza (ignora "tabela não existe" na primeira execução)
-- ---------------------------------------------------------------------
BEGIN
  FOR t IN (SELECT column_value AS nome FROM TABLE(sys.odcivarchar2list(
              'ROTA_FAVORITA', 'TRECHO', 'PREFERENCIA_ROTA', 'CONFIRMACAO',
              'OCORRENCIA', 'LOCALIZACAO', 'CATEGORIA_OCORRENCIA', 'USUARIO'))) LOOP
    BEGIN
      EXECUTE IMMEDIATE 'DROP TABLE ' || t.nome || ' CASCADE CONSTRAINTS PURGE';
    EXCEPTION
      WHEN OTHERS THEN
        IF SQLCODE != -942 THEN RAISE; END IF;
    END;
  END LOOP;
END;
/

-- ---------------------------------------------------------------------
-- 1. USUARIO (US01, US12, US13, US17–US19)
--    Login só pelo Google: não há coluna de senha (RNF06).
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
  id                  NUMBER(10)    GENERATED ALWAYS AS IDENTITY,
  nome                VARCHAR2(100) NOT NULL,
  email               VARCHAR2(150) NOT NULL,
  google_id           VARCHAR2(255) NOT NULL,
  mobilidade_reduzida CHAR(1)       DEFAULT 'N' NOT NULL,
  foto_url            VARCHAR2(500),
  pontos              NUMBER(8)     DEFAULT 0 NOT NULL,
  dt_cadastro         TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_usuario             PRIMARY KEY (id),
  CONSTRAINT uk_usuario_email       UNIQUE (email),
  CONSTRAINT uk_usuario_google_id   UNIQUE (google_id),
  CONSTRAINT ck_usuario_mobilidade  CHECK (mobilidade_reduzida IN ('S', 'N')),
  CONSTRAINT ck_usuario_pontos      CHECK (pontos >= 0),
  CONSTRAINT ck_usuario_email       CHECK (email LIKE '%_@_%._%')
);

-- ---------------------------------------------------------------------
-- 2. CATEGORIA_OCORRENCIA (US02, US04, US11)
-- ---------------------------------------------------------------------
CREATE TABLE categoria_ocorrencia (
  id                  NUMBER(5)    GENERATED ALWAYS AS IDENTITY,
  nome                VARCHAR2(50) NOT NULL,
  tipo                VARCHAR2(15) NOT NULL,
  peso_base           NUMBER(5,2)  NOT NULL,
  peso_noturno        NUMBER(5,2)  NOT NULL,
  bloqueia_mobilidade CHAR(1)      DEFAULT 'N' NOT NULL,
  CONSTRAINT pk_categoria              PRIMARY KEY (id),
  CONSTRAINT uk_categoria_nome         UNIQUE (nome),
  CONSTRAINT ck_categoria_tipo         CHECK (tipo IN ('ACESSIBILIDADE', 'SEGURANCA', 'CLIMA')),
  CONSTRAINT ck_categoria_peso_base    CHECK (peso_base >= 0),
  CONSTRAINT ck_categoria_peso_noturno CHECK (peso_noturno >= 0),
  CONSTRAINT ck_categoria_bloqueia     CHECK (bloqueia_mobilidade IN ('S', 'N'))
);

-- ---------------------------------------------------------------------
-- 3. LOCALIZACAO (US02, US04, US14) — vértices do grafo e pontos dos alertas
-- ---------------------------------------------------------------------
CREATE TABLE localizacao (
  id         NUMBER(10)    GENERATED ALWAYS AS IDENTITY,
  latitude   NUMBER(9,6)   NOT NULL,
  longitude  NUMBER(9,6)   NOT NULL,
  logradouro VARCHAR2(150),
  bairro     VARCHAR2(80),
  CONSTRAINT pk_localizacao     PRIMARY KEY (id),
  CONSTRAINT ck_localizacao_lat CHECK (latitude  BETWEEN -90  AND 90),
  CONSTRAINT ck_localizacao_lon CHECK (longitude BETWEEN -180 AND 180)
);

-- ---------------------------------------------------------------------
-- 4. OCORRENCIA (US02, US03, US07–US10)
--    id_usuario fica NULL quando a conta é excluída (LGPD, US15):
--    ON DELETE SET NULL anonimiza o alerta e o mantém no mapa.
-- ---------------------------------------------------------------------
CREATE TABLE ocorrencia (
  id             NUMBER(10)    GENERATED ALWAYS AS IDENTITY,
  id_usuario     NUMBER(10),
  id_categoria   NUMBER(5)     NOT NULL,
  id_localizacao NUMBER(10)    NOT NULL,
  descricao      VARCHAR2(500),
  foto_url       VARCHAR2(500),
  status         VARCHAR2(10)  DEFAULT 'ABERTA' NOT NULL,
  dt_registro    TIMESTAMP     DEFAULT SYSTIMESTAMP NOT NULL,
  dt_expiracao   TIMESTAMP     NOT NULL,
  CONSTRAINT pk_ocorrencia             PRIMARY KEY (id),
  CONSTRAINT fk_ocorrencia_usuario     FOREIGN KEY (id_usuario)     REFERENCES usuario (id) ON DELETE SET NULL,
  CONSTRAINT fk_ocorrencia_categoria   FOREIGN KEY (id_categoria)   REFERENCES categoria_ocorrencia (id),
  CONSTRAINT fk_ocorrencia_localizacao FOREIGN KEY (id_localizacao) REFERENCES localizacao (id),
  CONSTRAINT ck_ocorrencia_status      CHECK (status IN ('ABERTA', 'CONFIRMADA', 'EXPIRADA', 'RESOLVIDA')),
  CONSTRAINT ck_ocorrencia_datas       CHECK (dt_expiracao > dt_registro)
);

-- ---------------------------------------------------------------------
-- 5. CONFIRMACAO (US07) — 👍 (S) / 👎 (N), uma por usuário por ocorrência
-- ---------------------------------------------------------------------
CREATE TABLE confirmacao (
  id             NUMBER(10) GENERATED ALWAYS AS IDENTITY,
  id_ocorrencia  NUMBER(10) NOT NULL,
  id_usuario     NUMBER(10) NOT NULL,
  confirma       CHAR(1)    NOT NULL,
  dt_confirmacao TIMESTAMP  DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_confirmacao            PRIMARY KEY (id),
  CONSTRAINT fk_confirmacao_ocorrencia FOREIGN KEY (id_ocorrencia) REFERENCES ocorrencia (id) ON DELETE CASCADE,
  CONSTRAINT fk_confirmacao_usuario    FOREIGN KEY (id_usuario)    REFERENCES usuario (id)    ON DELETE CASCADE,
  CONSTRAINT uk_confirmacao            UNIQUE (id_ocorrencia, id_usuario),
  CONSTRAINT ck_confirmacao_confirma   CHECK (confirma IN ('S', 'N'))
);

-- ---------------------------------------------------------------------
-- 6. PREFERENCIA_ROTA (US11) — ausência de linha = considerar 'S'
-- ---------------------------------------------------------------------
CREATE TABLE preferencia_rota (
  id_usuario   NUMBER(10) NOT NULL,
  id_categoria NUMBER(5)  NOT NULL,
  considerar   CHAR(1)    DEFAULT 'S' NOT NULL,
  CONSTRAINT pk_preferencia_rota     PRIMARY KEY (id_usuario, id_categoria),
  CONSTRAINT fk_preferencia_usuario  FOREIGN KEY (id_usuario)   REFERENCES usuario (id) ON DELETE CASCADE,
  CONSTRAINT fk_preferencia_categoria FOREIGN KEY (id_categoria) REFERENCES categoria_ocorrencia (id) ON DELETE CASCADE,
  CONSTRAINT ck_preferencia_considerar CHECK (considerar IN ('S', 'N'))
);

-- ---------------------------------------------------------------------
-- 7. TRECHO (US04) — aresta não direcionada entre duas localizações
-- ---------------------------------------------------------------------
CREATE TABLE trecho (
  id          NUMBER(10)  GENERATED ALWAYS AS IDENTITY,
  id_origem   NUMBER(10)  NOT NULL,
  id_destino  NUMBER(10)  NOT NULL,
  distancia_m NUMBER(7,1) NOT NULL,
  iluminado   CHAR(1)     DEFAULT 'S' NOT NULL,
  CONSTRAINT pk_trecho            PRIMARY KEY (id),
  CONSTRAINT fk_trecho_origem     FOREIGN KEY (id_origem)  REFERENCES localizacao (id),
  CONSTRAINT fk_trecho_destino    FOREIGN KEY (id_destino) REFERENCES localizacao (id),
  CONSTRAINT uk_trecho            UNIQUE (id_origem, id_destino),
  CONSTRAINT ck_trecho_distancia  CHECK (distancia_m > 0),
  CONSTRAINT ck_trecho_iluminado  CHECK (iluminado IN ('S', 'N')),
  CONSTRAINT ck_trecho_extremos   CHECK (id_origem <> id_destino)
);

-- ---------------------------------------------------------------------
-- 8. ROTA_FAVORITA (US16 — Could)
-- ---------------------------------------------------------------------
CREATE TABLE rota_favorita (
  id         NUMBER(10)   GENERATED ALWAYS AS IDENTITY,
  id_usuario NUMBER(10)   NOT NULL,
  id_origem  NUMBER(10)   NOT NULL,
  id_destino NUMBER(10)   NOT NULL,
  apelido    VARCHAR2(60) NOT NULL,
  dt_criacao TIMESTAMP    DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT pk_rota_favorita         PRIMARY KEY (id),
  CONSTRAINT fk_rota_favorita_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id) ON DELETE CASCADE,
  CONSTRAINT fk_rota_favorita_origem  FOREIGN KEY (id_origem)  REFERENCES localizacao (id),
  CONSTRAINT fk_rota_favorita_destino FOREIGN KEY (id_destino) REFERENCES localizacao (id),
  CONSTRAINT ck_rota_favorita_extremos CHECK (id_origem <> id_destino)
);

-- ---------------------------------------------------------------------
-- 9. Índices nas FKs e nos filtros do mapa
-- ---------------------------------------------------------------------
CREATE INDEX ix_ocorrencia_usuario     ON ocorrencia (id_usuario);
CREATE INDEX ix_ocorrencia_categoria   ON ocorrencia (id_categoria);
CREATE INDEX ix_ocorrencia_localizacao ON ocorrencia (id_localizacao);
CREATE INDEX ix_ocorrencia_status      ON ocorrencia (status, dt_expiracao);
CREATE INDEX ix_confirmacao_usuario    ON confirmacao (id_usuario);
CREATE INDEX ix_preferencia_categoria  ON preferencia_rota (id_categoria);
CREATE INDEX ix_trecho_destino         ON trecho (id_destino);
CREATE INDEX ix_localizacao_bairro     ON localizacao (bairro);
CREATE INDEX ix_rota_favorita_usuario  ON rota_favorita (id_usuario);

-- Trecho é aresta não direcionada: (A, B) e (B, A) são o mesmo trecho.
-- uk_trecho só barra a repetição no mesmo sentido; este índice barra a inversa.
CREATE UNIQUE INDEX uk_trecho_par ON trecho (LEAST(id_origem, id_destino), GREATEST(id_origem, id_destino));

-- ---------------------------------------------------------------------
-- 10. Triggers de integridade
-- ---------------------------------------------------------------------
-- Ocorrência nasce com validade de 15 dias se dt_expiracao não vier (US08).
CREATE OR REPLACE TRIGGER trg_ocorrencia_expiracao
BEFORE INSERT ON ocorrencia
FOR EACH ROW
BEGIN
  IF :NEW.dt_registro IS NULL THEN
    :NEW.dt_registro := SYSTIMESTAMP;
  END IF;
  IF :NEW.dt_expiracao IS NULL THEN
    :NEW.dt_expiracao := :NEW.dt_registro + INTERVAL '15' DAY;
  END IF;
END;
/

-- Ninguém avalia o próprio alerta (RF12), nem por INSERT nem por UPDATE.
CREATE OR REPLACE TRIGGER trg_confirmacao_autor
BEFORE INSERT OR UPDATE OF id_ocorrencia, id_usuario ON confirmacao
FOR EACH ROW
DECLARE
  v_autor ocorrencia.id_usuario%TYPE;
BEGIN
  SELECT id_usuario INTO v_autor FROM ocorrencia WHERE id = :NEW.id_ocorrencia;
  IF v_autor = :NEW.id_usuario THEN
    RAISE_APPLICATION_ERROR(-20001, 'O autor não pode avaliar o próprio alerta.');
  END IF;
END;
/

-- ---------------------------------------------------------------------
-- 11. Comentários (dicionário de dados no próprio banco)
-- ---------------------------------------------------------------------
COMMENT ON TABLE usuario              IS 'Pessoa que usa o app; autenticada pelo Google, sem senha';
COMMENT ON TABLE categoria_ocorrencia IS 'Tipos de problema e seus pesos no cálculo da rota';
COMMENT ON TABLE localizacao          IS 'Ponto geográfico: vértice do grafo de ruas ou local de um alerta';
COMMENT ON TABLE ocorrencia           IS 'Alerta enviado por um usuário (degrau, buraco, rua escura, alagamento...)';
COMMENT ON TABLE confirmacao          IS 'Avaliação positiva (S) ou negativa (N) de um usuário sobre o alerta de outra pessoa';
COMMENT ON TABLE preferencia_rota     IS 'Categorias que o usuário quer considerar no cálculo da rota';
COMMENT ON TABLE trecho               IS 'Segmento de rua entre duas localizações (aresta do grafo)';
COMMENT ON TABLE rota_favorita        IS 'Rota salva pelo usuário com um apelido';
COMMENT ON COLUMN ocorrencia.id_usuario IS 'Autor; NULL depois que a conta é excluída (anonimização LGPD)';
COMMENT ON COLUMN categoria_ocorrencia.bloqueia_mobilidade IS 'S = trecho intransponível para quem tem mobilidade reduzida';
COMMENT ON COLUMN categoria_ocorrencia.peso_noturno IS 'Peso usado entre 19h e 6h';
