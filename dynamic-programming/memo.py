"""Memoização: programação dinâmica de cima para baixo (top-down).

1) Rota mais segura com limite de distância
-------------------------------------------
Pergunta: "qual o caminho com MENOS RISCO até o destino andando no máximo
L metros?"  Por exemplo, L = distância da rota comum + 150 m.

Subproblema f(v, b): o melhor par (risco, distância) para ir do ponto v até o
destino com um orçamento de b metros.

    f(destino, b) = (0, 0)
    f(v, b)       = min  (risco(t), d(t)) + f(u, b − metros(t))
                    para cada trecho t = (v, u) não bloqueado com metros(t) <= b
                    (se nenhum trecho cabe no orçamento: infinito)

Os pares são comparados primeiro pelo risco e depois pela distância, então,
entre rotas de mesmo risco, fica a mais curta.  Todo trecho tem pelo menos
1 m, logo b sempre diminui e a recursão termina, mesmo com ciclos no grafo.

Sem memo, a recursão refaz os mesmos subproblemas e percorre todos os
passeios que cabem no orçamento (crescimento exponencial).  Com memo, cada par
(v, b) é calculado uma vez só: no máximo V × (L + 1) subproblemas, cada um
olhando os vizinhos de v, ou seja, O(L × (V + E)) no pior caso.  Na prática é
menos, porque só os orçamentos alcançáveis a partir da origem viram
subproblemas.

2) Cache de rotas
-----------------
Muitas pessoas pedem a mesma rota (casa -> metrô, casa -> posto).  A resposta
de comparar_rotas só depende de (origem, destino, perfil, faixa horária,
categorias ignoradas), então ela é guardada num dicionário.  A hora exata não
entra na chave porque o peso só muda entre dia e noite.  O grafo com pesos de
cada (faixa, perfil, ignoradas) também é guardado: calcular os pesos é a parte
mais cara, O(T × A).
"""

from __future__ import annotations

import math
import random
import sys
import time
from dataclasses import dataclass

from dijkstra import comparar_rotas
from grafo import INFINITO, Grafo, Mapa, Perfil, Rota, faixa_horaria


# ------------------------------------------- 1) recursão com memoização

class LimiteDeChamadas(Exception):
    """A recursão sem memo passou do número máximo de chamadas permitido."""


@dataclass(frozen=True)
class ResultadoRecursivo:
    rota: Rota | None
    chamadas: int  # quantas vezes f(v, b) foi chamada
    subproblemas: int  # quantos pares (v, b) ficaram guardados no memo
    interrompido: bool = False  # True se passou de max_chamadas


def rota_mais_segura_recursiva(grafo: Grafo, origem: int, destino: int, limite_m: float,
                               usar_memo: bool = True, max_chamadas: int | None = None
                               ) -> ResultadoRecursivo:
    """Resolve f(origem, L) recursivamente.  Com usar_memo=False é a recursão
    "ingênua", usada só para comparar o número de chamadas."""
    for ponto in (origem, destino):
        if ponto not in grafo:
            raise ValueError(f"O ponto {ponto} não existe no mapa")
    orcamento = int(limite_m)
    _conferir_pilha(grafo, orcamento)

    memo = {}  # (v, b) -> (risco, distância)
    escolha = {}  # (v, b) -> (próximo ponto, trecho) da melhor resposta
    chamadas = 0

    def f(v: int, b: int) -> tuple:
        nonlocal chamadas
        chamadas += 1
        if max_chamadas is not None and chamadas > max_chamadas:
            raise LimiteDeChamadas
        if v == destino:
            return (0, 0)
        if usar_memo and (v, b) in memo:
            return memo[(v, b)]  # subproblema já resolvido

        melhor = INFINITO
        for u, trecho in grafo.vizinhos(v):
            if trecho.bloqueado or trecho.metros > b:
                continue
            risco, distancia = f(u, b - trecho.metros)
            candidato = (risco + trecho.risco, distancia + trecho.distancia_m)
            if candidato < melhor:
                melhor = candidato
                escolha[(v, b)] = (u, trecho)

        if usar_memo:
            memo[(v, b)] = melhor
        return melhor

    try:
        risco, _ = f(origem, orcamento)
    except LimiteDeChamadas:
        return ResultadoRecursivo(None, chamadas, len(memo), interrompido=True)

    rota = None if risco == math.inf else Rota.de_escolhas(escolha, origem, destino, orcamento)
    return ResultadoRecursivo(rota, chamadas, len(memo))


def _conferir_pilha(grafo: Grafo, orcamento: int) -> None:
    """Cada chamada gasta pelo menos o menor trecho do orçamento, então a
    profundidade máxima é orçamento / menor trecho.  Acima do limite de
    recursão do Python a versão recursiva quebraria: aí a saída é a tabulação."""
    menor = min((t.metros for t in grafo.trechos), default=1)
    if orcamento // menor + 50 > sys.getrecursionlimit():
        raise ValueError("Limite grande demais para a versão recursiva "
                         "(estouraria a pilha do Python). Use a tabulação.")


# ------------------------------------------------------ 2) cache de rotas

class CacheDeRotas:
    """Memoização das consultas de rota (comum × Caminho Livre)."""

    def __init__(self, mapa: Mapa):
        self.mapa = mapa
        self._grafos = {}  # (faixa, perfil, ignoradas) -> Grafo com pesos
        self._rotas = {}  # (origem, destino, perfil, faixa, ignoradas) -> Comparacao
        self.acertos = 0
        self.faltas = 0

    def grafo(self, hora: int, perfil: Perfil = Perfil.PEDESTRE, ignorar=()) -> Grafo:
        chave = (faixa_horaria(hora), perfil, frozenset(ignorar))
        if chave not in self._grafos:
            self._grafos[chave] = Grafo.do_mapa(self.mapa, hora, perfil, ignorar)
        return self._grafos[chave]

    def rota(self, origem: int, destino: int, hora: int,
             perfil: Perfil = Perfil.PEDESTRE, ignorar=()):
        chave = (origem, destino, perfil, faixa_horaria(hora), frozenset(ignorar))
        if chave in self._rotas:
            self.acertos += 1
            return self._rotas[chave]
        self.faltas += 1
        resposta = comparar_rotas(self.grafo(hora, perfil, ignorar), origem, destino)
        self._rotas[chave] = resposta
        return resposta

    def __len__(self) -> int:
        return len(self._rotas)


# ------------------------------------------------------------- medições

@dataclass(frozen=True)
class Consulta:
    origem: int
    destino: int
    hora: int
    perfil: Perfil


def gerar_consultas(mapa: Mapa, quantidade: int, semente: int = 2026) -> list:
    """Simula pedidos de rota entre os lugares do mapa (casa, posto, metrô...).
    A semente fixa deixa a medição reproduzível."""
    sorteio = random.Random(semente)
    lugares = [p.id for p in mapa.lugares()]
    consultas = []
    for _ in range(quantidade):
        origem, destino = sorteio.sample(lugares, 2)
        perfil = Perfil.MOBILIDADE_REDUZIDA if sorteio.random() < 0.3 else Perfil.PEDESTRE
        consultas.append(Consulta(origem, destino, sorteio.randrange(24), perfil))
    return consultas


@dataclass(frozen=True)
class MedicaoCache:
    consultas: int
    segundos_sem_cache: float
    segundos_com_cache: float
    acertos: int
    faltas: int
    respostas_iguais: bool

    @property
    def vezes_mais_rapido(self) -> float:
        return self.segundos_sem_cache / max(self.segundos_com_cache, 1e-9)


def medir_cache(mapa: Mapa, consultas: list) -> MedicaoCache:
    """Responde as mesmas consultas sem e com memoização e compara."""
    inicio = time.perf_counter()
    sem_cache = [comparar_rotas(Grafo.do_mapa(mapa, c.hora, c.perfil), c.origem, c.destino)
                 for c in consultas]
    segundos_sem = time.perf_counter() - inicio

    cache = CacheDeRotas(mapa)
    inicio = time.perf_counter()
    com_cache = [cache.rota(c.origem, c.destino, c.hora, c.perfil) for c in consultas]
    segundos_com = time.perf_counter() - inicio

    return MedicaoCache(len(consultas), segundos_sem, segundos_com,
                        cache.acertos, cache.faltas, sem_cache == com_cache)


@dataclass(frozen=True)
class MedicaoRecursao:
    sem_memo: ResultadoRecursivo
    com_memo: ResultadoRecursivo
    segundos_sem_memo: float
    segundos_com_memo: float


def medir_recursao(grafo: Grafo, origem: int, destino: int, limite_m: float,
                   max_chamadas: int = 3_000_000) -> MedicaoRecursao:
    """Mesma recorrência com e sem memo: conta chamadas e mede o tempo."""
    inicio = time.perf_counter()
    sem = rota_mais_segura_recursiva(grafo, origem, destino, limite_m, False, max_chamadas)
    segundos_sem = time.perf_counter() - inicio

    inicio = time.perf_counter()
    com = rota_mais_segura_recursiva(grafo, origem, destino, limite_m, True)
    segundos_com = time.perf_counter() - inicio
    return MedicaoRecursao(sem, com, segundos_sem, segundos_com)
