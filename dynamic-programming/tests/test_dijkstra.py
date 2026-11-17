import unittest

from apoio import (CASA_ANTONIO, CASA_MARTA, FACULDADE, MAPA, METRO, PADARIA, POSTO, grafo_de,
                   menor_soma)

from dijkstra import comparar_rotas, custo_distancia, custo_peso, menor_rota
from grafo import Grafo, Perfil


class TestDijkstraEmGrafoPequeno(unittest.TestCase):
    #   1 --100-- 2 --100-- 4      o trecho 2-4 tem risco 800
    #   1 --120-- 3 --120-- 4      o caminho de baixo não tem risco
    ARESTAS = [(1, 1, 2, 100, 0), (2, 2, 4, 100, 800), (3, 1, 3, 120, 0), (4, 3, 4, 120, 0)]

    def test_comum_e_caminho_livre(self):
        c = comparar_rotas(grafo_de(self.ARESTAS), 1, 4)
        self.assertEqual(c.comum.vertices, (1, 2, 4))
        self.assertEqual(c.comum.distancia_m, 200)
        self.assertEqual(c.caminho_livre.vertices, (1, 3, 4))
        self.assertEqual(c.caminho_livre.peso, 240)
        self.assertEqual(c.distancia_extra_m, 40)
        self.assertIsNone(c.aviso)

    def test_sem_caminho_sem_barreira(self):
        c = comparar_rotas(grafo_de(self.ARESTAS, bloqueados={2, 4}), 1, 4)
        self.assertEqual(c.comum.vertices, (1, 2, 4))  # a rota comum ignora bloqueios
        self.assertIsNone(c.caminho_livre)
        self.assertIn("sem barreiras", c.aviso)

    def test_pontos_desligados(self):
        c = comparar_rotas(grafo_de(self.ARESTAS + [(5, 8, 9, 50, 0)]), 1, 9)
        self.assertIsNone(c.comum)
        self.assertIsNotNone(c.aviso)

    def test_origem_igual_ao_destino(self):
        c = comparar_rotas(grafo_de(self.ARESTAS), 3, 3)
        self.assertEqual(c.comum.vertices, (3,))
        self.assertEqual(c.comum.distancia_m, 0)

    def test_ponto_inexistente(self):
        with self.assertRaises(ValueError):
            comparar_rotas(grafo_de(self.ARESTAS), 1, 99)


class TestPersonas(unittest.TestCase):
    def test_dona_marta_desvia_das_barreiras(self):
        grafo = Grafo.do_mapa(MAPA, 10, Perfil.MOBILIDADE_REDUZIDA)
        c = comparar_rotas(grafo, CASA_MARTA, POSTO)
        self.assertEqual(c.comum.distancia_m, 560)
        self.assertEqual(c.comum.alertas, {4, 5})
        self.assertEqual(c.comum.barreiras, 2)
        self.assertEqual(c.caminho_livre.distancia_m, 800)
        self.assertEqual(c.caminho_livre.barreiras, 0)
        self.assertEqual(c.caminho_livre.alertas, set())

    def test_julia_a_noite_vai_pela_avenida(self):
        c = comparar_rotas(Grafo.do_mapa(MAPA, 23), FACULDADE, METRO)
        self.assertEqual(c.comum.distancia_m, 610)
        self.assertEqual(c.comum.alertas, {1, 2, 3})
        self.assertEqual(c.caminho_livre.distancia_m, 770)
        self.assertEqual(c.alertas_evitados, {1, 2, 3})

    def test_julia_de_dia_quase_nao_desvia(self):
        c = comparar_rotas(Grafo.do_mapa(MAPA, 14), FACULDADE, METRO)
        self.assertEqual(c.caminho_livre.distancia_m, 616)
        self.assertEqual(c.caminho_livre.risco, 0)  # poste apagado não pesa de dia

    def test_seu_antonio_desvia_do_alagamento(self):
        c = comparar_rotas(Grafo.do_mapa(MAPA, 8), CASA_ANTONIO, PADARIA)
        self.assertEqual(c.comum.alertas, {7, 8})
        self.assertEqual(c.caminho_livre.alertas, set())
        self.assertEqual(c.caminho_livre.distancia_m, 460)

    def test_json_no_formato_de_get_rotas(self):
        grafo = Grafo.do_mapa(MAPA, 23)
        resposta = comparar_rotas(grafo, FACULDADE, METRO).para_json(grafo)
        self.assertEqual(set(resposta), {"comum", "caminhoLivre"})
        self.assertEqual(resposta["comum"]["distanciaM"], 610)
        self.assertEqual(set(resposta["comum"]["pontos"][0]), {"lat", "lon"})


class TestOtimalidade(unittest.TestCase):
    """Dijkstra contra a força bruta (todos os caminhos simples) no mapa todo."""

    def test_entre_todos_os_lugares(self):
        lugares = [p.id for p in MAPA.lugares()]
        for hora, perfil in ((10, Perfil.MOBILIDADE_REDUZIDA), (23, Perfil.PEDESTRE)):
            grafo = Grafo.do_mapa(MAPA, hora, perfil)
            for origem in lugares:
                for destino in lugares:
                    if origem == destino:
                        continue
                    with self.subTest(origem=origem, destino=destino, hora=hora):
                        comum = menor_rota(grafo, origem, destino, custo_distancia)
                        self.assertEqual(comum.distancia_m,
                                         menor_soma(grafo, origem, destino, custo_distancia,
                                                    comum.distancia_m))
                        livre = comparar_rotas(grafo, origem, destino).caminho_livre
                        if livre is not None:
                            self.assertEqual(livre.peso,
                                             menor_soma(grafo, origem, destino, custo_peso,
                                                        livre.peso, evitar_bloqueados=True))


if __name__ == "__main__":
    unittest.main()
