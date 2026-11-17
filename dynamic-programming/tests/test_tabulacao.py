import unittest

from apoio import (CASA_ANTONIO, CASA_MARTA, FACULDADE, MAPA, METRO, PADARIA, POSTO, grafo_de,
                   mais_segura_forca_bruta)

from dijkstra import custo_distancia, menor_rota, sem_bloqueio
from grafo import Grafo, Perfil
from memo import rota_mais_segura_recursiva
from tabulacao import preencher_tabela, rota_mais_segura_tabulada


class TestTabulacao(unittest.TestCase):
    #   1 --100-- 2 --100-- 4      risco 800 no trecho 2-4
    #   1 --120-- 3 --120-- 4      sem risco
    ARESTAS = [(1, 1, 2, 100, 0), (2, 2, 4, 100, 800), (3, 1, 3, 120, 0), (4, 3, 4, 120, 0)]

    def test_grafo_pequeno(self):
        tabela = preencher_tabela(grafo_de(self.ARESTAS), 1, 4, 300)
        self.assertEqual(tabela.celulas, 301 * 4)
        self.assertIsNone(tabela.melhor_rota(199))
        self.assertEqual(tabela.melhor_rota(200).vertices, (1, 2, 4))
        self.assertEqual(tabela.melhor_rota(239).vertices, (1, 2, 4))
        self.assertEqual(tabela.melhor_rota(240).vertices, (1, 3, 4))
        self.assertEqual([r.vertices for r in tabela.opcoes()], [(1, 2, 4), (1, 3, 4)])

    def test_limite_fora_da_tabela(self):
        tabela = preencher_tabela(grafo_de(self.ARESTAS), 1, 4, 300)
        with self.assertRaises(ValueError):
            tabela.melhor_rota(301)

    def test_opcoes_da_julia(self):
        tabela = preencher_tabela(Grafo.do_mapa(MAPA, 23), FACULDADE, METRO, 900)
        opcoes = [(r.distancia_m, r.risco, len(r.alertas)) for r in tabela.opcoes()]
        self.assertEqual(opcoes, [(610, 3980, 3), (616, 1920, 1), (770, 0, 0)])
        self.assertEqual(tabela.melhor_rota(710).distancia_m, 616)  # aceita +100 m

    def test_dona_marta_sem_rota_com_100_m_a_mais(self):
        grafo = Grafo.do_mapa(MAPA, 10, Perfil.MOBILIDADE_REDUZIDA)
        self.assertIsNone(rota_mais_segura_tabulada(grafo, CASA_MARTA, POSTO, 560 + 100))
        self.assertEqual(rota_mais_segura_tabulada(grafo, CASA_MARTA, POSTO, 800).distancia_m, 800)

    def test_opcoes_sao_de_pareto(self):
        """Cada opção é mais longa e menos arriscada que a anterior; a primeira é
        a menor rota sem barreiras e a última tem o menor risco possível."""
        for origem, destino, hora, perfil in ((FACULDADE, METRO, 23, Perfil.PEDESTRE),
                                              (CASA_ANTONIO, PADARIA, 8, Perfil.PEDESTRE),
                                              (CASA_MARTA, POSTO, 10, Perfil.MOBILIDADE_REDUZIDA)):
            grafo = Grafo.do_mapa(MAPA, hora, perfil)
            opcoes = preencher_tabela(grafo, origem, destino, 1000).opcoes()
            with self.subTest(origem=origem):
                for anterior, seguinte in zip(opcoes, opcoes[1:]):
                    self.assertLess(anterior.distancia_m, seguinte.distancia_m)
                    self.assertGreater(anterior.risco, seguinte.risco)
                sem_barreira = menor_rota(grafo, origem, destino, custo_distancia, sem_bloqueio)
                self.assertEqual(opcoes[0].distancia_m, sem_barreira.distancia_m)
                self.assertEqual((opcoes[-1].risco, opcoes[-1].distancia_m),
                                 mais_segura_forca_bruta(grafo, origem, destino, 1000))

    def test_uma_tabela_responde_qualquer_limite_menor(self):
        grafo = Grafo.do_mapa(MAPA, 23)
        grande = preencher_tabela(grafo, FACULDADE, METRO, 900)
        for limite in range(600, 901, 25):
            with self.subTest(limite=limite):
                self.assertEqual(grande.melhor_rota(limite),
                                 rota_mais_segura_tabulada(grafo, FACULDADE, METRO, limite))

    def test_tabulacao_igual_a_memoizacao(self):
        """A mesma recorrência resolvida de baixo para cima e de cima para baixo."""
        lugares = [p.id for p in MAPA.lugares()]
        pares = [(a, b) for a in lugares for b in lugares if a < b]
        for hora, perfil in ((10, Perfil.MOBILIDADE_REDUZIDA), (23, Perfil.PEDESTRE)):
            grafo = Grafo.do_mapa(MAPA, hora, perfil)
            for origem, destino in pares:
                tabela = preencher_tabela(grafo, origem, destino, 900)
                for limite in (300, 500, 700, 900):
                    with self.subTest(origem=origem, destino=destino, hora=hora, limite=limite):
                        memo = rota_mais_segura_recursiva(grafo, origem, destino, limite)
                        self.assertEqual(tabela.melhor_rota(limite), memo.rota)


if __name__ == "__main__":
    unittest.main()
