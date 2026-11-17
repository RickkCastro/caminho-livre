import json
import os
import tempfile
import unittest

from apoio import MAPA, FACULDADE, METRO

from dijkstra import comparar_rotas
from grafo import (Categoria, Grafo, Localizacao, Mapa, Ocorrencia, Perfil, Trecho,
                   calcular_pesos, carregar_mapa, distancia_haversine_m, eh_noturno,
                   faixa_horaria)


def trecho(trechos, id_trecho):
    return next(t for t in trechos if t.id == id_trecho)


class TestCarga(unittest.TestCase):
    def test_tamanho_do_mapa(self):
        self.assertEqual(len(MAPA.vertices()), 31)
        self.assertEqual(len(MAPA.trechos), 40)
        self.assertEqual(len(MAPA.categorias), 9)
        self.assertEqual(len(MAPA.ocorrencias), 12)
        self.assertEqual(len(MAPA.ocorrencias_ativas()), 10)
        self.assertEqual(len(MAPA.lugares()), 8)

    def test_distancias_batem_com_as_coordenadas(self):
        for t in MAPA.trechos:
            calculada = distancia_haversine_m(MAPA.localizacoes[t.id_origem],
                                              MAPA.localizacoes[t.id_destino])
            self.assertAlmostEqual(calculada, t.distancia_m, delta=1, msg=f"trecho {t.id}")

    def _carregar(self, dados):
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False,
                                         encoding="utf-8") as arquivo:
            json.dump(dados, arquivo)
        try:
            return carregar_mapa(arquivo.name)
        finally:
            os.remove(arquivo.name)

    def test_mapa_com_referencia_quebrada_e_recusado(self):
        dados = {"categorias": [], "ocorrencias": [],
                 "localizacoes": [{"id": 1, "latitude": 0, "longitude": 0}],
                 "trechos": [{"id": 1, "idOrigem": 1, "idDestino": 2, "distanciaM": 10}]}
        with self.assertRaises(ValueError):
            self._carregar(dados)

    def test_peso_negativo_e_recusado(self):
        # o Dijkstra só é correto com custos não negativos
        dados = {"localizacoes": [], "trechos": [], "ocorrencias": [],
                 "categorias": [{"id": 1, "nome": "X", "tipo": "CLIMA", "pesoBase": -1,
                                 "pesoNoturno": 1}]}
        with self.assertRaises(ValueError):
            self._carregar(dados)


class TestHorario(unittest.TestCase):
    def test_noite_vai_das_19h_as_6h(self):
        self.assertEqual([h for h in range(24) if eh_noturno(h)],
                         [0, 1, 2, 3, 4, 5, 19, 20, 21, 22, 23])
        self.assertEqual(faixa_horaria(6), "DIA")
        self.assertEqual(faixa_horaria(19), "NOITE")

    def test_hora_invalida(self):
        for hora in (-1, 24):
            with self.assertRaises(ValueError):
                eh_noturno(hora)

    def test_horas_da_mesma_faixa_dao_os_mesmos_pesos(self):
        # é isso que permite usar a faixa (e não a hora) na chave do cache
        self.assertEqual(calcular_pesos(MAPA, 20), calcular_pesos(MAPA, 23))
        self.assertEqual(calcular_pesos(MAPA, 8), calcular_pesos(MAPA, 17))
        self.assertNotEqual(calcular_pesos(MAPA, 17), calcular_pesos(MAPA, 19))


class TestPesoDoTrecho(unittest.TestCase):
    """Mesma regra do TrechoBO: peso = distância × (1 + soma dos pesos)."""

    def test_trecho_sem_alerta_pesa_a_distancia(self):
        t = trecho(calcular_pesos(MAPA, 23), 23)  # Avenida Central, sem alertas
        self.assertEqual(t.peso, t.distancia_m)
        self.assertEqual(t.risco, 0)
        self.assertEqual(t.alertas, ())

    def test_rua_escura_pesa_so_a_noite(self):
        dia = trecho(calcular_pesos(MAPA, 14), 2)  # Rua das Acácias, poste apagado
        noite = trecho(calcular_pesos(MAPA, 23), 2)
        self.assertEqual(dia.alertas, (1,))
        self.assertEqual(dia.peso, 120 * (1 + 0))
        self.assertEqual(noite.peso, 120 * (1 + 8))

    def test_soma_varios_alertas(self):
        # trecho 32 (Mercado -> esquina sem rampa): calçada quebrada (2) + falta de rampa (8)
        t = trecho(calcular_pesos(MAPA, 10), 32)
        self.assertEqual(set(t.alertas), {4, 5})
        self.assertEqual(t.peso, 80 * (1 + 2 + 8))

    def test_bloqueio_so_para_mobilidade_reduzida(self):
        # trecho 33 (esquina sem rampa -> Rua dos Beija-flores)
        pedestre = trecho(calcular_pesos(MAPA, 10, Perfil.PEDESTRE), 33)
        reduzida = trecho(calcular_pesos(MAPA, 10, Perfil.MOBILIDADE_REDUZIDA), 33)
        self.assertFalse(pedestre.bloqueado)
        self.assertTrue(reduzida.bloqueado)
        self.assertEqual(pedestre.peso, reduzida.peso)

    def test_categoria_ignorada_nao_entra_na_soma(self):
        t = trecho(calcular_pesos(MAPA, 23, ignorar=[6]), 2)  # ignora "Rua escura"
        self.assertEqual(t.peso, t.distancia_m)
        self.assertEqual(t.alertas, ())

    def test_ignorar_a_barreira_desbloqueia(self):
        t = trecho(calcular_pesos(MAPA, 10, Perfil.MOBILIDADE_REDUZIDA, ignorar=[2]), 33)
        self.assertFalse(t.bloqueado)

    def test_expirada_e_resolvida_nao_contam(self):
        usados = {a for t in calcular_pesos(MAPA, 23) for a in t.alertas}
        self.assertNotIn(10, usados)  # EXPIRADA
        self.assertNotIn(11, usados)  # RESOLVIDA
        self.assertEqual(usados, {o.id for o in MAPA.ocorrencias_ativas()})

    def test_raio_de_30_metros(self):
        um_metro_em_graus = 1 / 111_195
        pontos = {1: Localizacao(1, 0.0, 0.0), 2: Localizacao(2, 0.0, 100 * um_metro_em_graus),
                  3: Localizacao(3, 29 * um_metro_em_graus, 0.0),
                  4: Localizacao(4, -31 * um_metro_em_graus, 0.0)}
        mapa = Mapa("teste", pontos, {1: Categoria(1, "Buraco", "ACESSIBILIDADE", 3, 5, False)},
                    [Trecho(1, 1, 2, 100)],
                    [Ocorrencia(1, 1, 3, "ABERTA"), Ocorrencia(2, 1, 4, "ABERTA")])
        (t,) = calcular_pesos(mapa, 12)
        self.assertEqual(t.alertas, (1,))  # 29 m conta, 31 m não
        self.assertEqual(t.peso, 100 * (1 + 3))


class TestFormatoDaApi(unittest.TestCase):
    def test_exporta_no_formato_de_trechos_pesos(self):
        registros = Grafo.do_mapa(MAPA, 23).para_trechos_pesos()
        self.assertEqual(len(registros), 40)
        self.assertEqual(set(registros[0]),
                         {"idTrecho", "origem", "destino", "distanciaM", "peso", "bloqueado"})
        self.assertEqual(set(registros[0]["origem"]), {"id", "lat", "lon"})

    def test_ida_e_volta_mantem_as_rotas(self):
        original = Grafo.do_mapa(MAPA, 23, Perfil.MOBILIDADE_REDUZIDA)
        texto = json.dumps(original.para_trechos_pesos())
        lido = Grafo.de_trechos_pesos(json.loads(texto))
        a = comparar_rotas(original, FACULDADE, METRO)
        b = comparar_rotas(lido, FACULDADE, METRO)
        self.assertEqual(a.comum.vertices, b.comum.vertices)
        self.assertEqual(a.caminho_livre.vertices, b.caminho_livre.vertices)
        self.assertEqual(a.caminho_livre.peso, b.caminho_livre.peso)


if __name__ == "__main__":
    unittest.main()
