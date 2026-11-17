"""Carga do mapa, peso dos trechos e grafo em lista de adjacência.

O mapa usa os mesmos nomes das tabelas do banco (database/README.md):
LOCALIZACAO (pontos), TRECHO (calçadas entre dois pontos),
CATEGORIA_OCORRENCIA e OCORRENCIA (os alertas).

O peso de cada trecho segue a mesma regra do TrechoBO da API Java
(specs/001-api-rest-java/data-model.md):

    noturno   = hora >= 19 ou hora < 6
    ativas    = ocorrências ABERTA ou CONFIRMADA a até 30 m da origem ou do
                destino do trecho, de categorias fora de `ignorar`
    bloqueado = perfil com mobilidade reduzida e alguma ativa bloqueia a mobilidade
    peso      = distância × (1 + soma dos pesos das ativas no horário)

Chamamos de RISCO a parte do peso que vem dos alertas:
    peso = distância + risco   =>   risco = distância × soma dos pesos
"""

from __future__ import annotations

import json
import math
from dataclasses import dataclass
from enum import Enum
from pathlib import Path
from typing import Iterable

RAIO_ALERTA_M = 30  # alerta conta para o trecho se estiver a até 30 m de uma das pontas
STATUS_ATIVOS = {"ABERTA", "CONFIRMADA"}  # EXPIRADA e RESOLVIDA não entram na rota
RAIO_TERRA_M = 6_371_000
MAPA_PADRAO = Path(__file__).resolve().parent / "dados" / "grafo_mock.json"
INFINITO = (math.inf, math.inf)  # (risco, distância) quando não existe caminho


class Perfil(Enum):
    """Perfil de quem caminha (mobilidadeReduzida = N ou S na API)."""

    PEDESTRE = "pedestre"
    MOBILIDADE_REDUZIDA = "mobilidade-reduzida"

    @property
    def rotulo(self) -> str:
        return "pedestre" if self is Perfil.PEDESTRE else "mobilidade reduzida"


# ---------------------------------------------------------------- tabelas

@dataclass(frozen=True)
class Localizacao:
    id: int
    latitude: float
    longitude: float
    logradouro: str = ""
    bairro: str = ""
    nome: str = ""  # só no mock: nome curto de um lugar conhecido (ex.: "Posto de Saúde")

    @property
    def rotulo(self) -> str:
        return self.nome or self.logradouro or f"Ponto {self.id}"


@dataclass(frozen=True)
class Categoria:
    id: int
    nome: str
    tipo: str  # ACESSIBILIDADE, SEGURANCA ou CLIMA
    peso_base: float
    peso_noturno: float
    bloqueia_mobilidade: bool


@dataclass(frozen=True)
class Ocorrencia:
    id: int
    id_categoria: int
    id_localizacao: int
    status: str
    descricao: str = ""

    @property
    def ativa(self) -> bool:
        return self.status in STATUS_ATIVOS


@dataclass(frozen=True)
class Trecho:
    id: int
    id_origem: int
    id_destino: int
    distancia_m: float
    logradouro: str = ""  # só no mock: nome da rua, para mostrar a rota


@dataclass(frozen=True)
class Mapa:
    """Os dados como estão nas tabelas, antes de calcular qualquer peso."""

    nome: str
    localizacoes: dict
    categorias: dict
    trechos: list
    ocorrencias: list

    def vertices(self) -> dict:
        """Pontos que são ponta de algum trecho (os vértices do grafo)."""
        ids = {t.id_origem for t in self.trechos} | {t.id_destino for t in self.trechos}
        return {i: self.localizacoes[i] for i in sorted(ids)}

    def lugares(self) -> list:
        """Vértices com nome (lugares que as pessoas procuram)."""
        return [p for p in self.vertices().values() if p.nome]

    def ocorrencias_ativas(self) -> list:
        return [o for o in self.ocorrencias if o.ativa]


# ------------------------------------------------------------------ carga

def _sim_nao(valor) -> bool:
    return valor is True or str(valor).upper() == "S"


def carregar_mapa(caminho: str | Path = MAPA_PADRAO) -> Mapa:
    """Lê o JSON do mapa e confere as referências entre as tabelas."""
    with open(caminho, encoding="utf-8") as arquivo:
        dados = json.load(arquivo)

    localizacoes = {
        p["id"]: Localizacao(p["id"], p["latitude"], p["longitude"],
                             p.get("logradouro", ""), p.get("bairro", ""), p.get("nome", ""))
        for p in dados["localizacoes"]
    }
    categorias = {
        c["id"]: Categoria(c["id"], c["nome"], c["tipo"], c["pesoBase"], c["pesoNoturno"],
                           _sim_nao(c.get("bloqueiaMobilidade", "N")))
        for c in dados["categorias"]
    }
    trechos = [
        Trecho(t["id"], t["idOrigem"], t["idDestino"], t["distanciaM"], t.get("logradouro", ""))
        for t in dados["trechos"]
    ]
    ocorrencias = [
        Ocorrencia(o["id"], o["idCategoria"], o["idLocalizacao"], o["status"],
                   o.get("descricao", ""))
        for o in dados["ocorrencias"]
    ]

    for t in trechos:
        if t.id_origem not in localizacoes or t.id_destino not in localizacoes:
            raise ValueError(f"Trecho {t.id} liga um ponto que não existe")
        if t.id_origem == t.id_destino or t.distancia_m <= 0:
            raise ValueError(f"Trecho {t.id} precisa ligar dois pontos diferentes "
                             "com distância > 0")
    for o in ocorrencias:
        if o.id_categoria not in categorias or o.id_localizacao not in localizacoes:
            raise ValueError(f"Ocorrência {o.id} aponta para categoria ou local "
                             "inexistente")
    for c in categorias.values():
        if c.peso_base < 0 or c.peso_noturno < 0:  # Dijkstra exige custos não negativos
            raise ValueError(f"Categoria {c.nome} tem peso negativo")

    nome = dados.get("nome", Path(caminho).stem)
    return Mapa(nome, localizacoes, categorias, trechos, ocorrencias)


# ---------------------------------------------------------- peso do trecho

def distancia_haversine_m(a: Localizacao, b: Localizacao) -> float:
    """Distância em metros entre dois pontos na superfície da Terra."""
    lat1, lat2 = math.radians(a.latitude), math.radians(b.latitude)
    dlat = lat2 - lat1
    dlon = math.radians(b.longitude - a.longitude)
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 2 * RAIO_TERRA_M * math.asin(math.sqrt(h))


def eh_noturno(hora: int) -> bool:
    if not 0 <= hora <= 23:
        raise ValueError("A hora deve estar entre 0 e 23")
    return hora >= 19 or hora < 6


def faixa_horaria(hora: int) -> str:
    """O peso só muda entre dia e noite, então 20h e 23h dão a mesma rota."""
    return "NOITE" if eh_noturno(hora) else "DIA"


@dataclass(frozen=True)
class TrechoPonderado:
    """Um trecho com o peso já calculado: é um item de GET /trechos/pesos."""

    id: int
    origem: int
    destino: int
    distancia_m: float
    peso: float
    bloqueado: bool
    alertas: tuple = ()  # ids das ocorrências que entraram na soma
    logradouro: str = ""

    @property
    def risco(self) -> float:
        return self.peso - self.distancia_m

    @property
    def metros(self) -> int:
        """Distância em metros inteiros (arredondada para cima), usada como
        índice da tabela de programação dinâmica."""
        return math.ceil(self.distancia_m)


def calcular_pesos(mapa: Mapa, hora: int, perfil: Perfil = Perfil.PEDESTRE,
                   ignorar: Iterable[int] = ()) -> list:
    """Aplica a regra do TrechoBO a todos os trechos.  Tempo O(T × A),
    com T trechos e A alertas ativos."""
    noturno = eh_noturno(hora)
    ignorar = set(ignorar)
    ativas = [o for o in mapa.ocorrencias if o.ativa and o.id_categoria not in ignorar]

    ponderados = []
    for trecho in mapa.trechos:
        pontas = (mapa.localizacoes[trecho.id_origem], mapa.localizacoes[trecho.id_destino])
        proximas = [
            o for o in ativas
            if min(distancia_haversine_m(mapa.localizacoes[o.id_localizacao], p) for p in pontas)
            <= RAIO_ALERTA_M
        ]
        categorias = [mapa.categorias[o.id_categoria] for o in proximas]
        soma = sum(c.peso_noturno if noturno else c.peso_base for c in categorias)
        bloqueado = (perfil is Perfil.MOBILIDADE_REDUZIDA
                     and any(c.bloqueia_mobilidade for c in categorias))
        ponderados.append(TrechoPonderado(
            id=trecho.id,
            origem=trecho.id_origem,
            destino=trecho.id_destino,
            distancia_m=trecho.distancia_m,
            peso=trecho.distancia_m * (1 + soma),
            bloqueado=bloqueado,
            alertas=tuple(o.id for o in proximas),
            logradouro=trecho.logradouro,
        ))
    return ponderados


# ------------------------------------------------------------------ grafo

class Grafo:
    """Grafo não direcionado em lista de adjacência:
    vértice -> [(vizinho, trecho), ...].  Memória O(V + E)."""

    def __init__(self, trechos: Iterable[TrechoPonderado], pontos: dict):
        self.pontos = pontos
        self.trechos = list(trechos)
        self.adjacencia = {v: [] for v in pontos}
        for t in self.trechos:
            self.adjacencia[t.origem].append((t.destino, t))
            self.adjacencia[t.destino].append((t.origem, t))

    @classmethod
    def do_mapa(cls, mapa: Mapa, hora: int, perfil: Perfil = Perfil.PEDESTRE,
                ignorar: Iterable[int] = ()) -> "Grafo":
        return cls(calcular_pesos(mapa, hora, perfil, ignorar), mapa.vertices())

    @classmethod
    def de_trechos_pesos(cls, registros: list) -> "Grafo":
        """Monta o grafo a partir do JSON de GET /trechos/pesos."""
        pontos, trechos = {}, []
        for r in registros:
            for lado in ("origem", "destino"):
                p = r[lado]
                pontos.setdefault(p["id"], Localizacao(p["id"], p["lat"], p["lon"]))
            trechos.append(TrechoPonderado(r["idTrecho"], r["origem"]["id"], r["destino"]["id"],
                                           r["distanciaM"], r["peso"], bool(r["bloqueado"])))
        return cls(trechos, pontos)

    def para_trechos_pesos(self) -> list:
        """Exporta no formato de GET /trechos/pesos:
        [{ idTrecho, origem:{id,lat,lon}, destino:{id,lat,lon}, distanciaM, peso, bloqueado }]"""
        def ponto(i):
            p = self.pontos[i]
            return {"id": p.id, "lat": p.latitude, "lon": p.longitude}

        return [{"idTrecho": t.id, "origem": ponto(t.origem), "destino": ponto(t.destino),
                 "distanciaM": t.distancia_m, "peso": t.peso, "bloqueado": t.bloqueado}
                for t in self.trechos]

    def vizinhos(self, v: int) -> list:
        return self.adjacencia[v]

    def __contains__(self, v: int) -> bool:
        return v in self.adjacencia

    def __len__(self) -> int:
        return len(self.adjacencia)


@dataclass(frozen=True)
class Rota:
    """Um caminho no grafo: os vértices na ordem e os trechos percorridos."""

    vertices: tuple
    trechos: tuple

    @classmethod
    def de_trechos(cls, origem: int, trechos: list) -> "Rota":
        vertices = [origem]
        for t in trechos:
            vertices.append(t.destino if t.origem == vertices[-1] else t.origem)
        return cls(tuple(vertices), tuple(trechos))

    @classmethod
    def de_escolhas(cls, escolha: dict, origem: int, destino: int, orcamento: int) -> "Rota":
        """Monta a rota guardada pela programação dinâmica, em que
        escolha[(v, b)] = (próximo ponto, trecho) saindo de v com b metros."""
        trechos = []
        v, b = origem, orcamento
        while v != destino:
            v, trecho = escolha[(v, b)]
            trechos.append(trecho)
            b -= trecho.metros
        return cls.de_trechos(origem, trechos)

    @property
    def distancia_m(self) -> float:
        return sum(t.distancia_m for t in self.trechos)

    @property
    def metros(self) -> int:
        """Distância em metros inteiros, na mesma unidade da tabela de PD."""
        return sum(t.metros for t in self.trechos)

    @property
    def peso(self) -> float:
        return sum(t.peso for t in self.trechos)

    @property
    def risco(self) -> float:
        return sum(t.risco for t in self.trechos)

    @property
    def alertas(self) -> set:
        return {a for t in self.trechos for a in t.alertas}

    @property
    def barreiras(self) -> int:
        """Quantos trechos da rota estão bloqueados para o perfil."""
        return sum(t.bloqueado for t in self.trechos)
