import unittest

from apoio import CASA_MARTA, FACULDADE, MAPA, METRO, POSTO, grafo_de, mais_segura_forca_bruta

from dijkstra import comparar_rotas
from grafo import Grafo, Perfil
from memo import CacheDeRotas, gerar_consultas, medir_cache, rota_mais_segura_recursiva


class TestRecursaoComMemo(unittest.TestCase):
    #   1 --100-- 2 --100-- 4      risco 800 no trecho 2-4
    #   1 --120-- 3 --120-- 4      sem risco
    ARESTAS = [(1, 1, 2, 100, 0), (2, 2, 4, 100, 800), (3, 1, 3, 120, 0), (4, 3, 4, 120, 0)]

    def test_grafo_pequeno(self):
        grafo = grafo_de(self.ARESTAS)
        self.assertIsNone(rota_mais_segura_recursiva(grafo, 1, 4, 199).rota)  # nada cabe
        self.assertEqual(rota_mais_segura_recursiva(grafo, 1, 4, 200).rota.vertices, (1, 2, 4))
        self.assertEqual(rota_mais_segura_recursiva(grafo, 1, 4, 240).rota.vertices, (1, 3, 4))

    def test_igual_a_forca_bruta_no_mapa(self):
        casos = [(FACULDADE, METRO, 23, Perfil.PEDESTRE), (FACULDADE, METRO, 14, Perfil.PEDESTRE),
                 (CASA_MARTA, POSTO, 10, Perfil.MOBILIDADE_REDUZIDA)]
        for origem, destino, hora, perfil in casos:
            grafo = Grafo.do_mapa(MAPA, hora, perfil)
            for limite in range(500, 901, 50):
                with self.subTest(origem=origem, hora=hora, limite=limite):
                    rota = rota_mais_segura_recursiva(grafo, origem, destino, limite).rota
                    esperado = mais_segura_forca_bruta(grafo, origem, destino, limite)
                    if esperado is None:
                        self.assertIsNone(rota)
                    else:
                        self.assertEqual((rota.risco, rota.distancia_m), esperado)
                        self.assertLessEqual(rota.metros, limite)
                        self.assertEqual(rota.barreiras, 0)
                        self.assertEqual(len(set(rota.vertices)), len(rota.vertices))

    def test_sem_memo_da_a_mesma_rota_com_muito_mais_chamadas(self):
        grafo = Grafo.do_mapa(MAPA, 23)
        for limite in (770, 1010):
            com = rota_mais_segura_recursiva(grafo, FACULDADE, METRO, limite, usar_memo=True)
            sem = rota_mais_segura_recursiva(grafo, FACULDADE, METRO, limite, usar_memo=False)
            self.assertEqual(com.rota, sem.rota)
            self.assertLess(com.chamadas, sem.chamadas)
            self.assertEqual(sem.subproblemas, 0)
        self.assertGreater(sem.chamadas, 10 * com.chamadas)  # limite de 1.010 m

    def test_interrompe_a_recursao_sem_memo(self):
        grafo = Grafo.do_mapa(MAPA, 23)
        resultado = rota_mais_segura_recursiva(grafo, FACULDADE, METRO, 1410, usar_memo=False,
                                               max_chamadas=1000)
        self.assertTrue(resultado.interrompido)
        self.assertIsNone(resultado.rota)

    def test_limite_grande_demais_para_a_pilha(self):
        with self.assertRaises(ValueError):
            rota_mais_segura_recursiva(Grafo.do_mapa(MAPA, 23), FACULDADE, METRO, 10_000_000)


class TestCacheDeRotas(unittest.TestCase):
    def test_mesma_chave_vem_do_cache(self):
        cache = CacheDeRotas(MAPA)
        primeira = cache.rota(FACULDADE, METRO, 20)
        segunda = cache.rota(FACULDADE, METRO, 23)  # mesma faixa (noite)
        self.assertIs(primeira, segunda)
        self.assertEqual((cache.acertos, cache.faltas), (1, 1))

    def test_chaves_diferentes_sao_calculadas(self):
        cache = CacheDeRotas(MAPA)
        cache.rota(FACULDADE, METRO, 23)
        cache.rota(FACULDADE, METRO, 14)  # outra faixa
        cache.rota(FACULDADE, METRO, 23, Perfil.MOBILIDADE_REDUZIDA)  # outro perfil
        cache.rota(FACULDADE, METRO, 23, ignorar=[6])  # outras categorias
        self.assertEqual((cache.acertos, cache.faltas), (0, 4))
        self.assertEqual(len(cache), 4)

    def test_resposta_do_cache_igual_ao_calculo_direto(self):
        cache = CacheDeRotas(MAPA)
        for hora in (8, 23):
            direto = comparar_rotas(Grafo.do_mapa(MAPA, hora), FACULDADE, METRO)
            self.assertEqual(cache.rota(FACULDADE, METRO, hora), direto)

    def test_medicao_reproduzivel(self):
        self.assertEqual(gerar_consultas(MAPA, 50), gerar_consultas(MAPA, 50))
        medicao = medir_cache(MAPA, gerar_consultas(MAPA, 300))
        self.assertTrue(medicao.respostas_iguais)
        self.assertEqual(medicao.acertos + medicao.faltas, 300)
        self.assertLessEqual(medicao.faltas, 8 * 7 * 2 * 2)


if __name__ == "__main__":
    unittest.main()
