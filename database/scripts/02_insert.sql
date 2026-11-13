-- =====================================================================
-- Caminho Livre — Carga inicial (rodar logo após 01_create.sql)
-- Os IDs são gerados por IDENTITY a partir de 1; como 01_create.sql recria
-- as tabelas, os IDs citados nos comentários são estáveis.
-- Usuários são fictícios (acordo da equipe: nenhum dado pessoal real).
-- Pontos da Av. Paulista/Al. Santos: trocar pelos pontos fotografados
-- pela equipe na pesquisa de campo, se houver.
-- =====================================================================

-- ---------------------------------------------------------------------
-- USUARIO (10) — ids 1..10
-- ---------------------------------------------------------------------
INSERT INTO usuario (nome, email, google_id, mobilidade_reduzida, foto_url, pontos, dt_cadastro)
VALUES ('Marta Souza',      'marta.souza@exemplo.com',    'g-100000000000000000001', 'S', NULL, 26, SYSTIMESTAMP - INTERVAL '30' DAY);
INSERT INTO usuario (nome, email, google_id, mobilidade_reduzida, foto_url, pontos, dt_cadastro)
VALUES ('Julia Lima',       'julia.lima@exemplo.com',     'g-100000000000000000002', 'N', NULL, 16, SYSTIMESTAMP - INTERVAL '28' DAY);
INSERT INTO usuario (nome, email, google_id, mobilidade_reduzida, foto_url, pontos, dt_cadastro)
VALUES ('Antonio Ribeiro',  'antonio.ribeiro@exemplo.com','g-100000000000000000003', 'N', NULL, 14, SYSTIMESTAMP - INTERVAL '25' DAY);
INSERT INTO usuario (nome, email, google_id, mobilidade_reduzida, foto_url, pontos, dt_cadastro)
VALUES ('Bruno Carvalho',   'bruno.carvalho@exemplo.com', 'g-100000000000000000004', 'N', NULL, 14, SYSTIMESTAMP - INTERVAL '22' DAY);
INSERT INTO usuario (nome, email, google_id, mobilidade_reduzida, foto_url, pontos, dt_cadastro)
VALUES ('Carla Mendes',     'carla.mendes@exemplo.com',   'g-100000000000000000005', 'S', NULL, 14, SYSTIMESTAMP - INTERVAL '20' DAY);
INSERT INTO usuario (nome, email, google_id, mobilidade_reduzida, foto_url, pontos, dt_cadastro)
VALUES ('Diego Alves',      'diego.alves@exemplo.com',    'g-100000000000000000006', 'N', NULL, 12, SYSTIMESTAMP - INTERVAL '18' DAY);
INSERT INTO usuario (nome, email, google_id, mobilidade_reduzida, foto_url, pontos, dt_cadastro)
VALUES ('Elisa Rocha',      'elisa.rocha@exemplo.com',    'g-100000000000000000007', 'N', NULL, 12, SYSTIMESTAMP - INTERVAL '15' DAY);
INSERT INTO usuario (nome, email, google_id, mobilidade_reduzida, foto_url, pontos, dt_cadastro)
VALUES ('Fabio Nunes',      'fabio.nunes@exemplo.com',    'g-100000000000000000008', 'S', NULL, 12, SYSTIMESTAMP - INTERVAL '12' DAY);
INSERT INTO usuario (nome, email, google_id, mobilidade_reduzida, foto_url, pontos, dt_cadastro)
VALUES ('Gabriela Pires',   'gabriela.pires@exemplo.com', 'g-100000000000000000009', 'N', NULL, 12, SYSTIMESTAMP - INTERVAL '10' DAY);
INSERT INTO usuario (nome, email, google_id, mobilidade_reduzida, foto_url, pontos, dt_cadastro)
VALUES ('Heitor Campos',    'heitor.campos@exemplo.com',  'g-100000000000000000010', 'N', NULL, 10, SYSTIMESTAMP - INTERVAL '9' DAY);

-- ---------------------------------------------------------------------
-- CATEGORIA_OCORRENCIA (9) — ids 1..9. Pesos definidos pela equipe.
-- ---------------------------------------------------------------------
INSERT INTO categoria_ocorrencia (nome, tipo, peso_base, peso_noturno, bloqueia_mobilidade) VALUES ('Degrau',           'ACESSIBILIDADE', 5, 5, 'S');
INSERT INTO categoria_ocorrencia (nome, tipo, peso_base, peso_noturno, bloqueia_mobilidade) VALUES ('Falta de rampa',   'ACESSIBILIDADE', 5, 5, 'S');
INSERT INTO categoria_ocorrencia (nome, tipo, peso_base, peso_noturno, bloqueia_mobilidade) VALUES ('Buraco',           'ACESSIBILIDADE', 3, 4, 'N');
INSERT INTO categoria_ocorrencia (nome, tipo, peso_base, peso_noturno, bloqueia_mobilidade) VALUES ('Calçada quebrada', 'ACESSIBILIDADE', 3, 4, 'N');
INSERT INTO categoria_ocorrencia (nome, tipo, peso_base, peso_noturno, bloqueia_mobilidade) VALUES ('Obra',             'ACESSIBILIDADE', 2, 3, 'N');
INSERT INTO categoria_ocorrencia (nome, tipo, peso_base, peso_noturno, bloqueia_mobilidade) VALUES ('Rua escura',       'SEGURANCA',      1, 6, 'N');
INSERT INTO categoria_ocorrencia (nome, tipo, peso_base, peso_noturno, bloqueia_mobilidade) VALUES ('Local deserto',    'SEGURANCA',      1, 5, 'N');
INSERT INTO categoria_ocorrencia (nome, tipo, peso_base, peso_noturno, bloqueia_mobilidade) VALUES ('Assalto',          'SEGURANCA',      4, 8, 'N');
INSERT INTO categoria_ocorrencia (nome, tipo, peso_base, peso_noturno, bloqueia_mobilidade) VALUES ('Alagamento',       'CLIMA',          6, 6, 'N');

-- ---------------------------------------------------------------------
-- LOCALIZACAO (16) — ids 1..16
-- 1–10: vértices do grafo (cruzamentos da Av. Paulista e da Al. Santos)
-- 11–13: pontos de alerta a ~10 m de um vértice
-- 14–16: alertas em outros bairros (ranking)
-- ---------------------------------------------------------------------
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.558700, -46.662000, 'Av. Paulista x R. Augusta',                     'Consolação');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.561400, -46.658200, 'Av. Paulista x Al. Campinas',                   'Bela Vista');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.563600, -46.654500, 'Av. Paulista x R. Pamplona',                    'Bela Vista');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.566000, -46.651800, 'Av. Paulista x Al. Joaquim Eugênio de Lima',    'Bela Vista');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.568700, -46.647800, 'Av. Paulista x Av. Brigadeiro Luís Antônio',    'Bela Vista');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.561200, -46.664800, 'Al. Santos x R. Augusta',                       'Jardim Paulista');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.563600, -46.660500, 'Al. Santos x Al. Campinas',                     'Jardim Paulista');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.565700, -46.657600, 'Al. Santos x R. Pamplona',                      'Jardim Paulista');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.568200, -46.654700, 'Al. Santos x Al. Joaquim Eugênio de Lima',      'Jardim Paulista');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.570700, -46.650800, 'Al. Santos x Av. Brigadeiro Luís Antônio',      'Jardim Paulista');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.561450, -46.658280, 'Al. Campinas, perto da Av. Paulista',           'Bela Vista');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.563550, -46.660580, 'Al. Santos, perto da Al. Campinas',             'Jardim Paulista');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.565920, -46.651860, 'Av. Paulista, perto da Al. J. E. de Lima',      'Bela Vista');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.574100, -46.623500, 'Av. Lins de Vasconcelos, 1222',                 'Aclimação');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.555500, -46.635500, 'Praça da Liberdade',                            'Liberdade');
INSERT INTO localizacao (latitude, longitude, logradouro, bairro) VALUES (-23.575200, -46.641000, 'R. Tutóia',                                     'Paraíso');

-- ---------------------------------------------------------------------
-- OCORRENCIA (12) — ids 1..12. dt_expiracao = registro + 15 dias pelo trigger,
-- exceto as que já venceram (8 e 9), com data explícita.
-- ---------------------------------------------------------------------
INSERT INTO ocorrencia (id_usuario, id_categoria, id_localizacao, descricao, status, dt_registro)
VALUES (1, 1, 11, 'Degrau alto na calçada, sem rampa ao lado.', 'CONFIRMADA', SYSTIMESTAMP - INTERVAL '5' DAY);
INSERT INTO ocorrencia (id_usuario, id_categoria, id_localizacao, descricao, status, dt_registro)
VALUES (2, 6, 12, 'Dois postes apagados há semanas.', 'ABERTA', SYSTIMESTAMP - INTERVAL '2' DAY);
INSERT INTO ocorrencia (id_usuario, id_categoria, id_localizacao, descricao, status, dt_registro)
VALUES (3, 3, 13, 'Buraco grande perto da faixa de pedestres.', 'RESOLVIDA', SYSTIMESTAMP - INTERVAL '10' DAY);
INSERT INTO ocorrencia (id_usuario, id_categoria, id_localizacao, descricao, status, dt_registro)
VALUES (4, 9, 8, 'Calçada alaga quando chove forte.', 'ABERTA', SYSTIMESTAMP - INTERVAL '1' DAY);
INSERT INTO ocorrencia (id_usuario, id_categoria, id_localizacao, descricao, status, dt_registro)
VALUES (5, 2, 9, 'Esquina sem rampa de acesso.', 'CONFIRMADA', SYSTIMESTAMP - INTERVAL '7' DAY);
INSERT INTO ocorrencia (id_usuario, id_categoria, id_localizacao, descricao, status, dt_registro)
VALUES (6, 4, 14, 'Piso solto em frente ao portão.', 'ABERTA', SYSTIMESTAMP - INTERVAL '3' DAY);
INSERT INTO ocorrencia (id_usuario, id_categoria, id_localizacao, descricao, status, dt_registro)
VALUES (7, 8, 15, 'Relatos de assalto à noite.', 'ABERTA', SYSTIMESTAMP - INTERVAL '4' DAY);
INSERT INTO ocorrencia (id_usuario, id_categoria, id_localizacao, descricao, status, dt_registro, dt_expiracao)
VALUES (8, 5, 16, 'Obra ocupando a calçada.', 'EXPIRADA', SYSTIMESTAMP - INTERVAL '20' DAY, SYSTIMESTAMP - INTERVAL '5' DAY);
INSERT INTO ocorrencia (id_usuario, id_categoria, id_localizacao, descricao, status, dt_registro, dt_expiracao)
VALUES (9, 7, 10, 'Trecho vazio depois das 22h.', 'ABERTA', SYSTIMESTAMP - INTERVAL '18' DAY, SYSTIMESTAMP - INTERVAL '3' DAY);
-- Ocorrência 10: autor excluiu a conta (id_usuario NULL, alerta continua no mapa)
INSERT INTO ocorrencia (id_usuario, id_categoria, id_localizacao, descricao, status, dt_registro)
VALUES (NULL, 3, 6, 'Buraco na esquina.', 'ABERTA', SYSTIMESTAMP - INTERVAL '6' DAY);
INSERT INTO ocorrencia (id_usuario, id_categoria, id_localizacao, descricao, status, dt_registro)
VALUES (10, 6, 15, 'Rua sem iluminação perto da praça.', 'CONFIRMADA', SYSTIMESTAMP - INTERVAL '8' DAY);
INSERT INTO ocorrencia (id_usuario, id_categoria, id_localizacao, descricao, status, dt_registro)
VALUES (1, 9, 16, 'Alagamento no ponto de ônibus.', 'ABERTA', SYSTIMESTAMP - INTERVAL '2' DAY);

-- ---------------------------------------------------------------------
-- CONFIRMACAO (16) — S = 👍 ainda está lá · N = 👎 já foi resolvido
-- 1, 5 e 11: 3 👍 (CONFIRMADA) · 3: 3 👎 (RESOLVIDA)
-- ---------------------------------------------------------------------
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (1, 2, 'S', SYSTIMESTAMP - INTERVAL '4' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (1, 3, 'S', SYSTIMESTAMP - INTERVAL '4' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (1, 4, 'S', SYSTIMESTAMP - INTERVAL '3' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (2, 1, 'S', SYSTIMESTAMP - INTERVAL '1' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (3, 1, 'N', SYSTIMESTAMP - INTERVAL '8' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (3, 2, 'N', SYSTIMESTAMP - INTERVAL '7' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (3, 5, 'N', SYSTIMESTAMP - INTERVAL '6' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (4, 9, 'S', SYSTIMESTAMP - INTERVAL '12' HOUR);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (5, 6, 'S', SYSTIMESTAMP - INTERVAL '6' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (5, 7, 'S', SYSTIMESTAMP - INTERVAL '5' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (5, 8, 'S', SYSTIMESTAMP - INTERVAL '5' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (7, 1, 'S', SYSTIMESTAMP - INTERVAL '3' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (7, 2, 'N', SYSTIMESTAMP - INTERVAL '2' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (11, 3, 'S', SYSTIMESTAMP - INTERVAL '7' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (11, 4, 'S', SYSTIMESTAMP - INTERVAL '6' DAY);
INSERT INTO confirmacao (id_ocorrencia, id_usuario, confirma, dt_confirmacao) VALUES (11, 5, 'S', SYSTIMESTAMP - INTERVAL '6' DAY);

-- ---------------------------------------------------------------------
-- PREFERENCIA_ROTA (10) — só o que difere do padrão é obrigatório,
-- mas a carga também traz algumas linhas 'S' explícitas
-- ---------------------------------------------------------------------
INSERT INTO preferencia_rota (id_usuario, id_categoria, considerar) VALUES (1, 1, 'S');
INSERT INTO preferencia_rota (id_usuario, id_categoria, considerar) VALUES (1, 2, 'S');
INSERT INTO preferencia_rota (id_usuario, id_categoria, considerar) VALUES (2, 3, 'N');
INSERT INTO preferencia_rota (id_usuario, id_categoria, considerar) VALUES (2, 6, 'S');
INSERT INTO preferencia_rota (id_usuario, id_categoria, considerar) VALUES (3, 6, 'N');
INSERT INTO preferencia_rota (id_usuario, id_categoria, considerar) VALUES (3, 7, 'N');
INSERT INTO preferencia_rota (id_usuario, id_categoria, considerar) VALUES (4, 5, 'N');
INSERT INTO preferencia_rota (id_usuario, id_categoria, considerar) VALUES (5, 9, 'S');
INSERT INTO preferencia_rota (id_usuario, id_categoria, considerar) VALUES (6, 8, 'S');
INSERT INTO preferencia_rota (id_usuario, id_categoria, considerar) VALUES (7, 4, 'N');

-- ---------------------------------------------------------------------
-- TRECHO (13) — grafo em escada: Av. Paulista (1–5), Al. Santos (6–10)
-- e as transversais. Distâncias calculadas por Haversine.
-- ---------------------------------------------------------------------
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (1, 2, 490.1, 'S');
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (2, 3, 449.5, 'S');
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (3, 4, 383.3, 'S');
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (4, 5, 506.3, 'S');
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (6, 7, 513.1, 'N');
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (7, 8, 376.7, 'S');
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (8, 9, 405.8, 'S');
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (9, 10, 485.0, 'N');
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (1, 6, 398.4, 'S');
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (2, 7, 338.8, 'S');
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (3, 8, 392.9, 'S');
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (4, 9, 383.7, 'N');
INSERT INTO trecho (id_origem, id_destino, distancia_m, iluminado) VALUES (5, 10, 378.1, 'S');

-- ---------------------------------------------------------------------
-- ROTA_FAVORITA (6) — Could (US16)
-- ---------------------------------------------------------------------
INSERT INTO rota_favorita (id_usuario, id_origem, id_destino, apelido) VALUES (1, 1, 5,  'Casa - metrô Brigadeiro');
INSERT INTO rota_favorita (id_usuario, id_origem, id_destino, apelido) VALUES (1, 6, 3,  'Fisioterapia');
INSERT INTO rota_favorita (id_usuario, id_origem, id_destino, apelido) VALUES (2, 4, 1,  'Faculdade - metrô Consolação');
INSERT INTO rota_favorita (id_usuario, id_origem, id_destino, apelido) VALUES (3, 10, 2, 'Feira de sábado');
INSERT INTO rota_favorita (id_usuario, id_origem, id_destino, apelido) VALUES (5, 7, 9,  'Mercado');
INSERT INTO rota_favorita (id_usuario, id_origem, id_destino, apelido) VALUES (8, 2, 10, 'Trabalho');

COMMIT;
