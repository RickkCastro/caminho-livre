"""Tabulação: programação dinâmica de baixo para cima (bottom-up).

A mesma pergunta e a mesma recorrência da memoização (memo.py), só que
preenchendo uma tabela em vez de chamar a função recursivamente:

    T[b][v] = melhor (risco, distância) para ir de v até o destino
              andando no máximo b metros

    T[b][destino] = (0, 0)
    T[b][v]       = min  (risco(t), d(t)) + T[b − metros(t)][u]
                    para cada trecho t = (v, u) não bloqueado com metros(t) <= b

Todo trecho tem pelo menos 1 m, então a linha b só usa linhas anteriores
(b − metros(t) < b): basta preencher b = 0, 1, 2, ..., L, nessa ordem.

O que a tabela ganha da versão recursiva:
- não usa a pilha de recursão, então aceita limites grandes;
- uma tabela preenchida até L responde a QUALQUER limite b <= L sem
  recalcular nada: é só ler a linha b.  Percorrendo a coluna da origem,
  T[0..L][origem], cada ponto em que o risco cai é uma opção "andar um pouco
  mais para correr menos risco" (rotas de Pareto: nenhuma outra é ao mesmo
  tempo mais curta e menos arriscada).

Tempo O(L × (V + E)) e memória O(L × V).  O tempo depende do VALOR do limite
em metros (algoritmo pseudo-polinomial): para trajetos a pé, de algumas
centenas de metros a poucos quilômetros, a tabela é pequena.
"""

from __future__ import annotations

import math
from dataclasses import dataclass

from grafo import INFINITO, Grafo, Rota


@dataclass(frozen=True)
class TabelaPD:
    """Tabela T[b][v] já preenchida para uma origem, um destino e um limite L."""

    origem: int
    destino: int
    limite: int
    tabela: list  # tabela[b][v] = (risco, distância)
    escolha: dict  # (v, b) -> (próximo ponto, trecho) da melhor resposta

    @property
    def celulas(self) -> int:
        return len(self.tabela) * len(self.tabela[0])

    def melhor_rota(self, limite: int | None = None) -> Rota | None:
        """Rota de menor risco com no máximo `limite` metros (padrão: L).
        Só lê a linha da tabela: O(tamanho da rota)."""
        b = self.limite if limite is None else int(limite)
        if not 0 <= b <= self.limite:
            raise ValueError(f"A tabela só responde limites de 0 a {self.limite} m")
        if self.tabela[b][self.origem][0] == math.inf:
            return None
        return Rota.de_escolhas(self.escolha, self.origem, self.destino, b)

    def opcoes(self) -> list:
        """Rotas de Pareto até L, da mais curta para a mais segura: percorre a
        coluna da origem e guarda cada ponto em que o risco cai."""
        rotas = []
        menor_risco = math.inf
        for b, linha in enumerate(self.tabela):
            risco, _ = linha[self.origem]
            if risco < menor_risco:
                rotas.append(Rota.de_escolhas(self.escolha, self.origem, self.destino, b))
                menor_risco = risco
        return rotas


def preencher_tabela(grafo: Grafo, origem: int, destino: int, limite_m: float) -> TabelaPD:
    for ponto in (origem, destino):
        if ponto not in grafo:
            raise ValueError(f"O ponto {ponto} não existe no mapa")
    limite = int(limite_m)
    if limite < 0:
        raise ValueError("O limite não pode ser negativo")
    vertices = list(grafo.adjacencia)

    tabela = []
    escolha = {}
    for b in range(limite + 1):
        linha = {}
        for v in vertices:
            if v == destino:
                linha[v] = (0, 0)
                continue
            melhor = INFINITO
            for u, trecho in grafo.vizinhos(v):
                if trecho.bloqueado or trecho.metros > b:
                    continue
                risco, distancia = tabela[b - trecho.metros][u]  # linha já preenchida
                candidato = (risco + trecho.risco, distancia + trecho.distancia_m)
                if candidato < melhor:
                    melhor = candidato
                    escolha[(v, b)] = (u, trecho)
            linha[v] = melhor
        tabela.append(linha)
    return TabelaPD(origem, destino, limite, tabela, escolha)


def rota_mais_segura_tabulada(grafo: Grafo, origem: int, destino: int,
                              limite_m: float) -> Rota | None:
    """Atalho: preenche a tabela e devolve a melhor rota até o limite."""
    return preencher_tabela(grafo, origem, destino, limite_m).melhor_rota()
