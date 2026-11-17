"""Grafos: rota comum × rota Caminho Livre com o algoritmo de Dijkstra.

- Rota comum: custo = distância, passando por qualquer trecho
  (é o que um aplicativo de mapas comum sugere).
- Rota Caminho Livre: custo = peso (distância + risco dos alertas),
  sem passar por trechos bloqueados para o perfil.

Dijkstra também é programação dinâmica: custos[v] guarda a melhor resposta
do subproblema "menor custo da origem até v", e toda rota mínima é formada
por sub-rotas mínimas (princípio da otimalidade de Bellman). A fila de
prioridade só decide a ordem em que esses subproblemas ficam prontos.

Tempo O((V + E) log V) com heapq; memória O(V).
"""

from __future__ import annotations

import heapq
import math
from dataclasses import dataclass

from grafo import Grafo, Rota


def custo_distancia(trecho) -> float:
    return trecho.distancia_m


def custo_peso(trecho) -> float:
    return trecho.peso


def sem_bloqueio(trecho) -> bool:
    return not trecho.bloqueado


def dijkstra(grafo: Grafo, origem: int, custo=custo_distancia, pode_passar=None, destino=None):
    """Menor custo da origem até cada vértice.

    Devolve (custos, anterior), em que anterior[v] = (vértice de onde viemos,
    trecho usado).  Se `destino` for informado, para assim que ele sai da fila.
    """
    custos = {origem: 0}
    anterior = {origem: None}
    fila = [(0, origem)]
    finalizados = set()

    while fila:
        custo_atual, v = heapq.heappop(fila)
        if v in finalizados:
            continue  # entrada antiga da fila: v já saiu com um custo menor
        finalizados.add(v)
        if v == destino:
            break
        for vizinho, trecho in grafo.vizinhos(v):
            if pode_passar is not None and not pode_passar(trecho):
                continue
            novo = custo_atual + custo(trecho)
            if novo < custos.get(vizinho, math.inf):  # relaxamento
                custos[vizinho] = novo
                anterior[vizinho] = (v, trecho)
                heapq.heappush(fila, (novo, vizinho))
    return custos, anterior


def montar_rota(anterior: dict, origem: int, destino: int) -> Rota | None:
    """Volta do destino até a origem seguindo `anterior`."""
    if destino not in anterior:
        return None
    trechos = []
    v = destino
    while v != origem:
        v, trecho = anterior[v]
        trechos.append(trecho)
    trechos.reverse()
    return Rota.de_trechos(origem, trechos)


def menor_rota(grafo: Grafo, origem: int, destino: int, custo, pode_passar=None) -> Rota | None:
    _, anterior = dijkstra(grafo, origem, custo, pode_passar, destino)
    return montar_rota(anterior, origem, destino)


def rota_comum(grafo: Grafo, origem: int, destino: int) -> Rota | None:
    return menor_rota(grafo, origem, destino, custo_distancia)


def rota_caminho_livre(grafo: Grafo, origem: int, destino: int) -> Rota | None:
    return menor_rota(grafo, origem, destino, custo_peso, sem_bloqueio)


@dataclass(frozen=True)
class Comparacao:
    """Resposta de GET /rotas: rota comum, rota Caminho Livre e aviso."""

    comum: Rota | None
    caminho_livre: Rota | None
    aviso: str | None = None

    @property
    def alertas_evitados(self) -> set:
        if self.comum is None or self.caminho_livre is None:
            return set()
        return self.comum.alertas - self.caminho_livre.alertas

    @property
    def distancia_extra_m(self) -> float | None:
        if self.comum is None or self.caminho_livre is None:
            return None
        return self.caminho_livre.distancia_m - self.comum.distancia_m

    def para_json(self, grafo: Grafo) -> dict:
        """Mesmo formato da API:
        { comum:{ pontos:[{lat,lon}], distanciaM }, caminhoLivre:{...}|null, aviso? }"""
        def rota_json(rota):
            if rota is None:
                return None
            pontos = [{"lat": grafo.pontos[v].latitude, "lon": grafo.pontos[v].longitude}
                      for v in rota.vertices]
            return {"pontos": pontos, "distanciaM": rota.distancia_m}

        resposta = {"comum": rota_json(self.comum), "caminhoLivre": rota_json(self.caminho_livre)}
        if self.aviso:
            resposta["aviso"] = self.aviso
        return resposta


def comparar_rotas(grafo: Grafo, origem: int, destino: int) -> Comparacao:
    for ponto in (origem, destino):
        if ponto not in grafo:
            raise ValueError(f"O ponto {ponto} não existe no mapa")
    comum = rota_comum(grafo, origem, destino)
    livre = rota_caminho_livre(grafo, origem, destino)
    aviso = None
    if comum is None:
        aviso = "Origem e destino não estão ligados por nenhuma calçada do mapa."
    elif livre is None:
        aviso = ("Não encontramos um caminho sem barreiras para o seu perfil. "
                 "Mostramos só a rota comum.")
    return Comparacao(comum, livre, aviso)
