-- =====================================================================
-- Caminho Livre — Consultas do projeto (rodar após 02_insert.sql)
-- "Ativa" = status ABERTA ou CONFIRMADA (RNF10).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Ocorrências ativas por bairro e tipo — camadas do mapa (US03)
-- ---------------------------------------------------------------------
SELECT l.bairro,
       c.tipo,
       COUNT(*) AS total_ativas
  FROM ocorrencia o
  JOIN categoria_ocorrencia c ON c.id = o.id_categoria
  JOIN localizacao l          ON l.id = o.id_localizacao
 WHERE o.status IN ('ABERTA', 'CONFIRMADA')
 GROUP BY l.bairro, c.tipo
 ORDER BY l.bairro, c.tipo;

-- ---------------------------------------------------------------------
-- 2. Ranking dos bairros, do melhor (menor gravidade) ao pior (US14)
--    Bairros sem alertas ativos aparecem com pontuação 0.
-- ---------------------------------------------------------------------
SELECT l.bairro,
       NVL(SUM(CASE WHEN o.status IN ('ABERTA', 'CONFIRMADA') THEN c.peso_base END), 0) AS pontuacao_gravidade,
       COUNT(CASE WHEN o.status IN ('ABERTA', 'CONFIRMADA') THEN 1 END)                 AS total_ativas,
       RANK() OVER (ORDER BY NVL(SUM(CASE WHEN o.status IN ('ABERTA', 'CONFIRMADA') THEN c.peso_base END), 0)) AS posicao
  FROM localizacao l
  LEFT JOIN ocorrencia o           ON o.id_localizacao = l.id
  LEFT JOIN categoria_ocorrencia c ON c.id = o.id_categoria
 WHERE l.bairro IS NOT NULL
 GROUP BY l.bairro
 ORDER BY posicao, l.bairro;

-- ---------------------------------------------------------------------
-- 3. Ocorrências com 3 ou mais confirmações positivas (US07)
-- ---------------------------------------------------------------------
SELECT o.id,
       c.nome   AS categoria,
       l.logradouro,
       o.status,
       COUNT(*) AS total_positivas
  FROM ocorrencia o
  JOIN confirmacao f          ON f.id_ocorrencia = o.id AND f.confirma = 'S'
  JOIN categoria_ocorrencia c ON c.id = o.id_categoria
  JOIN localizacao l          ON l.id = o.id_localizacao
 GROUP BY o.id, c.nome, l.logradouro, o.status
HAVING COUNT(*) >= 3
 ORDER BY total_positivas DESC, o.id;

-- ---------------------------------------------------------------------
-- 4. Expirar ocorrências vencidas e não confirmadas (US08)
--    Mesma regra da rotina da API: só ABERTA vira EXPIRADA.
-- ---------------------------------------------------------------------
-- 4a. Quais serão expiradas (conferência antes do UPDATE)
SELECT o.id, o.dt_registro, o.dt_expiracao
  FROM ocorrencia o
 WHERE o.status = 'ABERTA'
   AND o.dt_expiracao < SYSTIMESTAMP
   AND o.id NOT IN (SELECT f.id_ocorrencia
                      FROM confirmacao f
                     WHERE f.confirma = 'S'
                     GROUP BY f.id_ocorrencia
                    HAVING COUNT(*) >= 3);

-- 4b. Atualização
UPDATE ocorrencia o
   SET o.status = 'EXPIRADA'
 WHERE o.status = 'ABERTA'
   AND o.dt_expiracao < SYSTIMESTAMP
   AND o.id NOT IN (SELECT f.id_ocorrencia
                      FROM confirmacao f
                     WHERE f.confirma = 'S'
                     GROUP BY f.id_ocorrencia
                    HAVING COUNT(*) >= 3);
COMMIT;

-- ---------------------------------------------------------------------
-- 5. Histórico de um usuário com o total de 👍/👎 (US10)
--    Trocar :id_usuario pelo id desejado (ex.: 1).
-- ---------------------------------------------------------------------
SELECT o.id,
       c.nome AS categoria,
       l.logradouro,
       o.status,
       TO_CHAR(o.dt_registro, 'DD/MM/YYYY HH24:MI') AS registrado_em,
       COUNT(CASE WHEN f.confirma = 'S' THEN 1 END) AS total_confirma,
       COUNT(CASE WHEN f.confirma = 'N' THEN 1 END) AS total_nega
  FROM ocorrencia o
  JOIN categoria_ocorrencia c ON c.id = o.id_categoria
  JOIN localizacao l          ON l.id = o.id_localizacao
  LEFT JOIN confirmacao f     ON f.id_ocorrencia = o.id
 WHERE o.id_usuario = :id_usuario
 GROUP BY o.id, c.nome, l.logradouro, o.status, o.dt_registro
 ORDER BY o.dt_registro DESC;

-- ---------------------------------------------------------------------
-- 6. Ranking de usuários por pontos (US19) — só nome e pontos (LGPD)
-- ---------------------------------------------------------------------
SELECT DENSE_RANK() OVER (ORDER BY u.pontos DESC) AS posicao,
       u.nome,
       u.pontos
  FROM usuario u
 ORDER BY posicao, u.nome
 FETCH FIRST 10 ROWS ONLY;

-- ---------------------------------------------------------------------
-- 7. Peso de cada trecho à noite para uma pessoa com mobilidade reduzida
--    (mesma fórmula do TrechoBO, US04/US11):
--    peso = distância × (1 + Σ pesos das ocorrências ativas a ≤ 30 m
--    da origem ou do destino); bloqueado se houver categoria que
--    bloqueia mobilidade. Distância aproximada por equirretangular.
-- ---------------------------------------------------------------------
WITH proximas AS (
  SELECT DISTINCT t.id AS id_trecho, o.id AS id_ocorrencia,
         c.peso_noturno, c.bloqueia_mobilidade
    FROM trecho t
    JOIN localizacao lo ON lo.id IN (t.id_origem, t.id_destino)
    JOIN ocorrencia o   ON o.status IN ('ABERTA', 'CONFIRMADA')
    JOIN localizacao lx ON lx.id = o.id_localizacao
    JOIN categoria_ocorrencia c ON c.id = o.id_categoria
   WHERE 6371000 * SQRT(
           POWER((lx.latitude - lo.latitude) * ACOS(-1) / 180, 2) +
           POWER((lx.longitude - lo.longitude) * ACOS(-1) / 180 * COS(lo.latitude * ACOS(-1) / 180), 2)
         ) <= 30
)
SELECT t.id,
       o1.logradouro AS de,
       o2.logradouro AS para,
       t.distancia_m,
       ROUND(t.distancia_m * (1 + NVL(SUM(p.peso_noturno), 0)), 1) AS peso_noturno,
       CASE WHEN MAX(p.bloqueia_mobilidade) = 'S' THEN 'S' ELSE 'N' END AS bloqueado
  FROM trecho t
  JOIN localizacao o1 ON o1.id = t.id_origem
  JOIN localizacao o2 ON o2.id = t.id_destino
  LEFT JOIN proximas p ON p.id_trecho = t.id
 GROUP BY t.id, o1.logradouro, o2.logradouro, t.distancia_m
 ORDER BY t.id;

-- ---------------------------------------------------------------------
-- 8. Exclusão de conta (US15, LGPD) — demonstração
--    ON DELETE SET NULL anonimiza as ocorrências; confirmações,
--    preferências e rotas favoritas somem em cascata.
--    Desfeita com ROLLBACK para não alterar a carga.
-- ---------------------------------------------------------------------
DELETE FROM usuario WHERE id = 10;
SELECT id, id_usuario, status FROM ocorrencia WHERE id = 11;   -- id_usuario agora é NULL
ROLLBACK;
