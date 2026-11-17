"""Funções de apoio dos testes: caminho de importação, grafos pequenos e um
oráculo de força bruta que enumera todos os caminhos simples."""

import sys
from pathlib import Path

PASTA_PROJETO = Path(__file__).resolve().parents[1]
if str(PASTA_PROJETO) not in sys.path:
    sys.path.insert(0, str(PASTA_PROJETO))

from grafo import Grafo, Localizacao, TrechoPonderado, carregar_mapa  # noqa: E402

MAPA = carregar_mapa()
FACULDADE, METRO, PADARIA = 2, 14, 13
CASA_MARTA, POSTO, CASA_ANTONIO = 18, 23, 25


def grafo_de(arestas, bloqueados=()):
    """Grafo pequeno feito à mão. arestas: (id, a, b, distância, risco)."""
    pontos, trechos = {}, []
    for id_trecho, a, b, distancia, risco in arestas:
        for v in (a, b):
            pontos.setdefault(v, Localizacao(v, 0.0, 0.0, nome=f"P{v}"))
        trechos.append(TrechoPonderado(id_trecho, a, b, distancia, distancia + risco,
                                       id_trecho in bloqueados))
    return Grafo(trechos, pontos)


def caminhos_simples(grafo, origem, destino, cabe):
    """Todos os caminhos sem repetir ponto; `cabe(trechos)` poda os parciais."""
    def busca(v, visitados, trechos):
        if v == destino:
            yield list(trechos)
            return
        for u, trecho in grafo.vizinhos(v):
            if u in visitados:
                continue
            trechos.append(trecho)
            if cabe(trechos):
                visitados.add(u)
                yield from busca(u, visitados, trechos)
                visitados.remove(u)
            trechos.pop()

    yield from busca(origem, {origem}, [])


def menor_soma(grafo, origem, destino, custo, teto, evitar_bloqueados=False):
    """Menor soma de `custo` entre todos os caminhos simples com soma <= teto."""
    def cabe(trechos):
        if evitar_bloqueados and trechos[-1].bloqueado:
            return False
        return sum(custo(t) for t in trechos) <= teto + 1e-9

    somas = [sum(custo(t) for t in c) for c in caminhos_simples(grafo, origem, destino, cabe)]
    return min(somas, default=None)


def mais_segura_forca_bruta(grafo, origem, destino, limite):
    """Menor (risco, distância) entre os caminhos simples sem bloqueio com
    metros <= limite."""
    def cabe(trechos):
        return not trechos[-1].bloqueado and sum(t.metros for t in trechos) <= limite

    pares = [(sum(t.risco for t in c), sum(t.distancia_m for t in c))
             for c in caminhos_simples(grafo, origem, destino, cabe)]
    return min(pares, default=None)
