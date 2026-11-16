"""Caminho Livre · Dynamic Programming (Python, só biblioteca padrão).

    python main.py                              menu no terminal
    python main.py demo                         demonstração com as personas
    python main.py mapa                         lugares, categorias e alertas
    python main.py rota faculdade metro --hora 23
    python main.py limite faculdade metro --hora 23 --extra 100
    python main.py desempenho                   recursão × memo × tabulação e cache
    python main.py pesos --hora 23              grafo no formato GET /trechos/pesos

Origem e destino aceitam o número do ponto ou parte do nome do lugar.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import unicodedata
from datetime import datetime

from dijkstra import comparar_rotas, custo_distancia, menor_rota, rota_comum, sem_bloqueio
from grafo import MAPA_PADRAO, Grafo, Perfil, carregar_mapa, faixa_horaria
from memo import gerar_consultas, medir_cache, medir_recursao
from tabulacao import preencher_tabela

LINHA = "=" * 78


# ------------------------------------------------------------- formatação

def num(valor) -> str:
    """Número inteiro com ponto de milhar: 1.425.520."""
    return f"{valor:,.0f}".replace(",", ".")


def dec(valor, casas: int = 1) -> str:
    """Número decimal com vírgula: 0,594."""
    return f"{valor:.{casas}f}".replace(".", ",")


def m(valor) -> str:
    return f"{num(valor)} m"


def alertas_txt(quantidade: int) -> str:
    return f"{quantidade} alerta" if quantidade == 1 else f"{quantidade} alertas"


def descrever_horario(hora: int) -> str:
    return f"{hora}h ({'noite' if faixa_horaria(hora) == 'NOITE' else 'dia'})"


def nome_ponto(grafo: Grafo, v: int) -> str:
    return grafo.pontos[v].rotulo


def trajeto(rota, grafo: Grafo) -> str:
    """Junta os trechos seguidos da mesma rua: "Rua A 400 m -> Rua B 130 m"."""
    if not rota.trechos:
        return "(origem e destino são o mesmo ponto)"
    if not all(t.logradouro for t in rota.trechos):
        return "pontos " + " > ".join(str(v) for v in rota.vertices)
    partes = []
    for t in rota.trechos:
        if partes and partes[-1][0] == t.logradouro:
            partes[-1][1] += t.distancia_m
        else:
            partes.append([t.logradouro, t.distancia_m])
    return " -> ".join(f"{rua} {m(dist)}" for rua, dist in partes)


def descrever_alerta(mapa, id_ocorrencia: int, perfil: Perfil) -> str:
    ocorrencia = next(o for o in mapa.ocorrencias if o.id == id_ocorrencia)
    categoria = mapa.categorias[ocorrencia.id_categoria]
    local = mapa.localizacoes[ocorrencia.id_localizacao].logradouro
    barreira = (" [BARREIRA]" if perfil is Perfil.MOBILIDADE_REDUZIDA
                and categoria.bloqueia_mobilidade else "")
    return f"{categoria.nome} ({local}){barreira}"


def imprimir_rota(titulo: str, rota, grafo: Grafo, mapa, perfil: Perfil, base=None) -> None:
    """Sem `mapa` (grafo lido de GET /trechos/pesos) não sabemos quais são os
    alertas, só o risco de cada trecho."""
    print(f"  {titulo}")
    extra = "" if base is None else f" (+{m(rota.distancia_m - base)})"
    resumo = f"    {m(rota.distancia_m)}{extra} · risco {num(rota.risco)}"
    if mapa is not None:
        resumo += f" · {alertas_txt(len(rota.alertas))}"
    print(resumo)
    print(f"    {trajeto(rota, grafo)}")
    if mapa is not None and rota.alertas:
        alertas = " · ".join(descrever_alerta(mapa, a, perfil) for a in sorted(rota.alertas))
        print(f"    Alertas: {alertas}")


def imprimir_comparacao(comparacao, grafo: Grafo, mapa, perfil: Perfil) -> None:
    comum, livre = comparacao.comum, comparacao.caminho_livre
    if comum is not None:
        imprimir_rota("ROTA COMUM (menor distância, como um GPS comum)", comum, grafo, mapa, perfil)
    if livre is not None:
        imprimir_rota("ROTA CAMINHO LIVRE (menor peso, sem barreiras)", livre, grafo, mapa, perfil,
                      base=comum.distancia_m)
    if comparacao.aviso:
        print(f"  Aviso: {comparacao.aviso}")
    elif mapa is None and comum.risco > 0:
        print(f"  => O risco cai de {num(comum.risco)} para {num(livre.risco)} andando "
              f"{m(comparacao.distancia_extra_m)} a mais.")
    elif comum.alertas:
        evitados = len(comparacao.alertas_evitados)
        print(f"  => Evita {evitados} de {alertas_txt(len(comum.alertas))} "
              f"({100 * evitados / len(comum.alertas):.0f}%) andando "
              f"{m(comparacao.distancia_extra_m)} a mais.")
    else:
        print("  => A rota comum já não passa por nenhum alerta.")


# ------------------------------------------------------- pontos e grafo

def _sem_acento(texto: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", texto.lower())
                   if unicodedata.category(c) != "Mn")


def resolver_ponto(texto: str, grafo: Grafo) -> int:
    """Aceita o número do ponto ou parte do nome de um lugar ("metro")."""
    texto = str(texto).strip()
    if texto.isdigit():
        if int(texto) not in grafo:
            raise ValueError(f"O ponto {texto} não existe no mapa")
        return int(texto)
    lugares = {v: p.nome for v, p in grafo.pontos.items() if p.nome}
    if not lugares:
        raise ValueError("Os pontos deste grafo não têm nome: use o número (ex.: 2)")
    procurado = _sem_acento(texto)
    achados = [v for v, nome in lugares.items() if procurado in _sem_acento(nome)]
    if len(achados) == 1:
        return achados[0]
    opcoes = ", ".join(f"{v} {nome}" for v, nome in lugares.items())
    raise ValueError(f'"{texto}" não identifica um lugar. Lugares: {opcoes}')


def ler_ignorar(texto: str) -> list:
    return [int(parte) for parte in str(texto).replace(" ", "").split(",") if parte]


def montar_grafo(args, mapa):
    """Grafo do mapa (com hora, perfil e categorias ignoradas) ou de um JSON
    no formato GET /trechos/pesos.  Devolve (grafo, perfil, descrição)."""
    if getattr(args, "trechos_pesos", None):
        with open(args.trechos_pesos, encoding="utf-8") as arquivo:
            grafo = Grafo.de_trechos_pesos(json.load(arquivo))
        return grafo, Perfil.PEDESTRE, f"pesos lidos de {args.trechos_pesos}"
    perfil = Perfil(args.perfil)
    ignorar = ler_ignorar(args.ignorar)
    grafo = Grafo.do_mapa(mapa, args.hora, perfil, ignorar)
    descricao = f"{descrever_horario(args.hora)} · {perfil.rotulo}"
    if ignorar:
        nomes = [mapa.categorias[i].nome for i in ignorar if i in mapa.categorias]
        descricao += " · ignorando " + ", ".join(nomes)
    return grafo, perfil, descricao


# ------------------------------------------------- partes da demonstração

def mostrar_limite(grafo: Grafo, origem: int, destino: int, extra: int, mapa, perfil: Perfil,
                   outros_extras=()) -> None:
    """Tabulação: preenche T[b][v] até (rota comum + extra) e lê as respostas."""
    comum = rota_comum(grafo, origem, destino)
    if comum is None:
        print("  Origem e destino não estão ligados no mapa.")
        return
    limite = comum.metros + extra
    tabela = preencher_tabela(grafo, origem, destino, limite)
    print(f"  Rota comum: {m(comum.distancia_m)}. Limite: {m(comum.distancia_m)} + {m(extra)} "
          f"= {m(limite)}")
    print(f"  Tabela T[b][v]: {num(limite + 1)} linhas (b = 0 a {num(limite)} m) × "
          f"{len(grafo)} pontos = {num(tabela.celulas)} células\n")

    melhor = tabela.melhor_rota()
    if melhor is None:
        print("  Nenhuma rota sem barreiras cabe nesse limite.")
        sem_barreira = menor_rota(grafo, origem, destino, custo_distancia, sem_bloqueio)
        if sem_barreira is not None:
            print(f"  A menor rota sem barreiras tem {m(sem_barreira.distancia_m)} "
                  f"(+{m(sem_barreira.distancia_m - comum.distancia_m)}): aumente o limite.")
        return
    imprimir_rota(f"MELHOR ROTA COM ATÉ {m(limite)} (menor risco)", melhor, grafo, mapa, perfil,
                  base=comum.distancia_m)

    opcoes = tabela.opcoes()
    print("\n  Opções lidas na coluna da origem (cada uma troca distância por menos risco):")
    print("     distância      a mais      risco   alertas")
    for rota in opcoes:
        marca = "   <- rota comum" if rota == comum else ""
        alertas = len(rota.alertas) if mapa is not None else "-"
        print(f"     {m(rota.distancia_m):>9}   {'+' + m(rota.distancia_m - comum.distancia_m):>9}"
              f"   {num(rota.risco):>8}   {alertas:>7}{marca}")

    for outro in outros_extras:
        rota = tabela.melhor_rota(comum.metros + outro)
        print("\n  A mesma tabela responde a um limite menor sem recalcular nada:")
        print(f"  com até +{m(outro)} (linha b = {num(comum.metros + outro)}) -> "
              f"{m(rota.distancia_m)} · risco {num(rota.risco)} · {alertas_txt(len(rota.alertas))}")
        print(f"    {trajeto(rota, grafo)}")


def mostrar_recursao(mapa, extras=(160, 400, 610, 800)) -> None:
    """Júlia (Faculdade -> Metrô, 23h) com limites cada vez maiores."""
    grafo = Grafo.do_mapa(mapa, 23, Perfil.PEDESTRE)
    origem, destino = resolver_ponto("faculdade", grafo), resolver_ponto("metro", grafo)
    base = rota_comum(grafo, origem, destino).metros
    print(f"  {nome_ponto(grafo, origem)} -> {nome_ponto(grafo, destino)}, 23h, limites cada vez "
          f"maiores (rota comum: {m(base)})")
    print(f"   {'':>8}  {'sem memo':^19}  {'com memo':^28}  {'tabulação':^16}".rstrip())
    print(f"   {'limite':>8}  {'chamadas':>10}  {'tempo':>7}  {'chamadas':>8}  {'subprobl.':>9}  "
          f"{'tempo':>7}  {'células':>8}  {'tempo':>6}")
    for extra in extras:
        limite = base + extra
        medicao = medir_recursao(grafo, origem, destino, limite)
        inicio = time.perf_counter()
        tabela = preencher_tabela(grafo, origem, destino, limite)
        segundos_tab = time.perf_counter() - inicio
        sem, com = medicao.sem_memo, medicao.com_memo
        iguais = sem.rota == com.rota == tabela.melhor_rota()
        print(f"   {m(limite):>8}  {num(sem.chamadas):>10}  "
              f"{dec(medicao.segundos_sem_memo, 3) + ' s':>7}  {num(com.chamadas):>8}  "
              f"{num(com.subproblemas):>9}  {dec(medicao.segundos_com_memo * 1000) + ' ms':>7}  "
              f"{num(tabela.celulas):>8}  {dec(segundos_tab * 1000, 0) + ' ms':>6}"
              f"{'' if iguais else '  DIFERENTE!'}")
    print("  As três formas encontram a mesma rota em todas as linhas (conferido no código).")


def mostrar_cache(mapa, quantidade: int) -> None:
    medicao = medir_cache(mapa, gerar_consultas(mapa, quantidade))
    lugares = len(mapa.lugares())
    print(f"  {num(quantidade)} pedidos de rota simulados entre os {lugares} lugares do mapa "
          f"(hora e perfil sorteados)")
    print(f"    sem cache: {dec(medicao.segundos_sem_cache, 3)} s · com cache: "
          f"{dec(medicao.segundos_com_cache, 3)} s ({num(medicao.vezes_mais_rapido)}x mais rápido)")
    print(f"    {num(medicao.acertos)} respostas vieram do cache e {num(medicao.faltas)} foram "
          f"calculadas (máximo de chaves: {lugares} × {lugares - 1} pares × 2 perfis × 2 faixas "
          f"= {num(lugares * (lugares - 1) * 4)})")
    print(f"    respostas idênticas às calculadas sem cache: "
          f"{'sim' if medicao.respostas_iguais else 'NÃO'}")


# --------------------------------------------------------------- comandos

def cmd_mapa(mapa) -> None:
    vertices = mapa.vertices()
    print(mapa.nome)
    print(f"{len(vertices)} pontos · {len(mapa.trechos)} trechos · "
          f"{len(mapa.ocorrencias_ativas())} alertas ativos\n")
    print("LUGARES (use o número ou o nome em rota e limite)")
    for p in mapa.lugares():
        print(f"  {p.id:>3}  {p.nome:<22} {p.logradouro}")
    print("\nESQUINAS E OUTROS PONTOS")
    for p in vertices.values():
        if not p.nome:
            print(f"  {p.id:>3}  {p.logradouro}")
    print("\nCATEGORIAS (peso de dia / à noite)")
    for c in mapa.categorias.values():
        bloqueia = "  bloqueia mobilidade reduzida" if c.bloqueia_mobilidade else ""
        linha = (f"  {c.id:>3}  {c.nome:<18} {c.tipo:<15} {num(c.peso_base):>2} / "
                 f"{num(c.peso_noturno):<2}{bloqueia}")
        print(linha.rstrip())
    print("\nALERTAS (ocorrências)")
    for o in mapa.ocorrencias:
        local = mapa.localizacoes[o.id_localizacao].logradouro
        situacao = "" if o.ativa else "  (ignorado na rota)"
        linha = (f"  {o.id:>3}  {mapa.categorias[o.id_categoria].nome:<18} {o.status:<11} "
                 f"{local:<38}{situacao}")
        print(linha.rstrip())


def cmd_rota(args, mapa) -> None:
    grafo, perfil, descricao = montar_grafo(args, mapa)
    origem, destino = resolver_ponto(args.origem, grafo), resolver_ponto(args.destino, grafo)
    comparacao = comparar_rotas(grafo, origem, destino)
    if args.json:
        print(json.dumps(comparacao.para_json(grafo), ensure_ascii=False, indent=2))
        return
    print(f"{nome_ponto(grafo, origem)} -> {nome_ponto(grafo, destino)} · {descricao}\n")
    imprimir_comparacao(comparacao, grafo, None if args.trechos_pesos else mapa, perfil)


def cmd_limite(args, mapa) -> None:
    grafo, perfil, descricao = montar_grafo(args, mapa)
    origem, destino = resolver_ponto(args.origem, grafo), resolver_ponto(args.destino, grafo)
    print(f"{nome_ponto(grafo, origem)} -> {nome_ponto(grafo, destino)} · {descricao} · "
          f"até {m(args.extra)} a mais\n")
    mostrar_limite(grafo, origem, destino, args.extra,
                   None if args.trechos_pesos else mapa, perfil)


def cmd_desempenho(args, mapa) -> None:
    print("RECURSÃO SEM MEMO × MEMOIZAÇÃO × TABULAÇÃO (rota mais segura com limite)")
    mostrar_recursao(mapa)
    print("\nCACHE DE ROTAS (memoização por origem, destino, perfil e faixa horária)")
    mostrar_cache(mapa, args.consultas)


def cmd_pesos(args, mapa) -> None:
    grafo, _, descricao = montar_grafo(args, mapa)
    texto = json.dumps(grafo.para_trechos_pesos(), ensure_ascii=False, indent=2)
    if args.saida:
        with open(args.saida, "w", encoding="utf-8") as arquivo:
            arquivo.write(texto + "\n")
        print(f"{len(grafo.trechos)} trechos ({descricao}) salvos em {args.saida}")
    else:
        print(texto)


def cmd_demo(mapa) -> None:
    ativos = len(mapa.ocorrencias_ativas())
    print(LINHA)
    print(" CAMINHO LIVRE · Dynamic Programming · demonstração")
    print(f" {mapa.nome}")
    print(f" {len(mapa.vertices())} pontos · {len(mapa.trechos)} trechos · {ativos} alertas ativos "
          f"({len(mapa.ocorrencias) - ativos} expirados ou resolvidos ficam de fora)")
    print(LINHA)

    cenarios = [
        ("Dona Marta, 68 anos, usa andador", "dona marta", "posto", 10, Perfil.MOBILIDADE_REDUZIDA),
        ("Júlia, 21 anos, sai da faculdade às 23h", "faculdade", "metro", 23, Perfil.PEDESTRE),
        ("Seu Antônio, 74 anos, mora numa rua que alaga", "seu antonio", "padaria", 8,
         Perfil.PEDESTRE),
    ]
    for numero, (persona, origem, destino, hora, perfil) in enumerate(cenarios, start=1):
        grafo = Grafo.do_mapa(mapa, hora, perfil)
        o, d = resolver_ponto(origem, grafo), resolver_ponto(destino, grafo)
        print(f"\n[{numero}] GRAFOS (Dijkstra) · {persona}")
        print(f"    {nome_ponto(grafo, o)} -> {nome_ponto(grafo, d)} · {descrever_horario(hora)} · "
              f"{perfil.rotulo}\n")
        imprimir_comparacao(comparar_rotas(grafo, o, d), grafo, mapa, perfil)

    grafo = Grafo.do_mapa(mapa, 14, Perfil.PEDESTRE)
    faculdade, metro = resolver_ponto("faculdade", grafo), resolver_ponto("metro", grafo)
    print("\n    Mesma consulta da Júlia às 14h (de dia, poste apagado não pesa):\n")
    imprimir_comparacao(comparar_rotas(grafo, faculdade, metro), grafo, mapa, Perfil.PEDESTRE)

    print("\n[4] TABULAÇÃO · Júlia, 23h: quanto a mais andar para correr menos risco?")
    grafo = Grafo.do_mapa(mapa, 23, Perfil.PEDESTRE)
    mostrar_limite(grafo, faculdade, metro, 160, mapa, Perfil.PEDESTRE, outros_extras=(100,))

    print("\n    Dona Marta, 10h, mobilidade reduzida, aceitando até 100 m a mais:")
    grafo = Grafo.do_mapa(mapa, 10, Perfil.MOBILIDADE_REDUZIDA)
    mostrar_limite(grafo, resolver_ponto("dona marta", grafo), resolver_ponto("posto", grafo), 100,
                   mapa, Perfil.MOBILIDADE_REDUZIDA)

    print("\n[5] MEMOIZAÇÃO · a mesma recorrência f(v, b) de cima para baixo")
    mostrar_recursao(mapa)

    print("\n[6] MEMOIZAÇÃO · cache de rotas por (origem, destino, perfil, faixa horária)")
    mostrar_cache(mapa, 1000)

    print("\n[7] MESMO FORMATO DA API · GET /trechos/pesos?hora=23&mobilidadeReduzida=N")
    registros = Grafo.do_mapa(mapa, 23, Perfil.PEDESTRE).para_trechos_pesos()
    print("  " + json.dumps(registros[1], ensure_ascii=False))
    print(f"  ... {len(registros)} trechos ao todo (comando: python main.py pesos --hora 23)")


# ------------------------------------------------------------------ menu

def perguntar(texto: str, padrao=None, converter=str):
    while True:
        sufixo = f" [{padrao}]" if padrao is not None else ""
        resposta = input(f"  {texto}{sufixo}: ").strip()
        if not resposta and padrao is not None:
            resposta = str(padrao)
        try:
            return converter(resposta)
        except ValueError as erro:
            print(f"  Valor inválido: {erro}")


def hora_valida(texto: str) -> int:
    hora = int(texto)
    faixa_horaria(hora)  # levanta ValueError fora de 0 a 23
    return hora


def sim(texto: str) -> bool:
    return texto.strip().lower().startswith("s")


def perguntar_consulta(mapa):
    pontos = Grafo.do_mapa(mapa, 12)
    origem = perguntar("Origem (número ou nome)", "faculdade", lambda t: resolver_ponto(t, pontos))
    destino = perguntar("Destino (número ou nome)", "metro", lambda t: resolver_ponto(t, pontos))
    hora = perguntar("Hora (0 a 23)", 23, hora_valida)
    reduzida = perguntar("Mobilidade reduzida? (s/n)", "n", sim)
    ignorar = perguntar("Categorias a ignorar (ex.: 6,7; Enter = nenhuma)", "", ler_ignorar)
    perfil = Perfil.MOBILIDADE_REDUZIDA if reduzida else Perfil.PEDESTRE
    return origem, destino, hora, perfil, ignorar


def menu(mapa) -> None:
    opcoes = {
        "1": "Ver lugares, categorias e alertas do mapa",
        "2": "Rota comum × rota Caminho Livre                (Grafos: Dijkstra)",
        "3": "Rota mais segura com limite de distância       (Tabulação)",
        "4": "Desempenho: recursão × memoização × tabulação  (Memoização)",
        "5": "Exportar o grafo com pesos (formato GET /trechos/pesos)",
        "6": "Demonstração com as personas",
        "0": "Sair",
    }
    while True:
        print(f"\n{LINHA}\n CAMINHO LIVRE · Dynamic Programming\n {mapa.nome}\n{LINHA}")
        for chave, texto in opcoes.items():
            print(f"  {chave}  {texto}")
        escolha = input("\nEscolha uma opção: ").strip()
        print()
        try:
            if escolha == "0":
                return
            if escolha == "1":
                cmd_mapa(mapa)
            elif escolha in ("2", "3"):
                origem, destino, hora, perfil, ignorar = perguntar_consulta(mapa)
                extra = perguntar("Quantos metros a mais você aceita andar?", 100, int) \
                    if escolha == "3" else 0
                grafo = Grafo.do_mapa(mapa, hora, perfil, ignorar)
                print(f"\n{nome_ponto(grafo, origem)} -> {nome_ponto(grafo, destino)} · "
                      f"{descrever_horario(hora)} · {perfil.rotulo}\n")
                if escolha == "2":
                    imprimir_comparacao(comparar_rotas(grafo, origem, destino), grafo, mapa, perfil)
                else:
                    mostrar_limite(grafo, origem, destino, extra, mapa, perfil)
            elif escolha == "4":
                cmd_desempenho(argparse.Namespace(consultas=1000), mapa)
            elif escolha == "5":
                hora = perguntar("Hora (0 a 23)", 23, hora_valida)
                reduzida = perguntar("Mobilidade reduzida? (s/n)", "n", sim)
                saida = perguntar("Salvar em", "trechos_pesos.json")
                perfil = Perfil.MOBILIDADE_REDUZIDA if reduzida else Perfil.PEDESTRE
                cmd_pesos(argparse.Namespace(hora=hora, perfil=perfil.value, ignorar="",
                                             saida=saida), mapa)
            elif escolha == "6":
                cmd_demo(mapa)
            else:
                print("Opção inválida.")
        except ValueError as erro:
            print(f"Erro: {erro}")
        input("\n(Enter para voltar ao menu)")


# ------------------------------------------------------------------ main

def criar_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="main.py", description="Caminho Livre · rota acessível com programação dinâmica")
    parser.add_argument("--mapa", default=str(MAPA_PADRAO),
                        help="JSON do mapa (padrão: dados/grafo_mock.json)")
    sub = parser.add_subparsers(dest="comando")

    filtros = argparse.ArgumentParser(add_help=False)
    filtros.add_argument("--hora", type=int, default=datetime.now().hour,
                         help="0 a 23 (padrão: hora atual)")
    filtros.add_argument("--perfil", choices=[p.value for p in Perfil], default="pedestre")
    filtros.add_argument("--ignorar", default="", help="ids das categorias ignoradas, ex.: 6,7")

    pontos = argparse.ArgumentParser(add_help=False)
    pontos.add_argument("origem", help="número do ponto ou parte do nome (ex.: faculdade)")
    pontos.add_argument("destino", help="número do ponto ou parte do nome (ex.: metro)")
    pontos.add_argument("--trechos-pesos", metavar="ARQUIVO",
                        help="usar um JSON no formato GET /trechos/pesos em vez do mapa")

    sub.add_parser("mapa", help="lugares, categorias e alertas do mapa")
    rota = sub.add_parser("rota", parents=[pontos, filtros],
                          help="rota comum × Caminho Livre (Dijkstra)")
    rota.add_argument("--json", action="store_true", help="resposta no formato de GET /rotas")
    limite = sub.add_parser("limite", parents=[pontos, filtros],
                            help="rota mais segura com limite de distância (tabulação)")
    limite.add_argument("--extra", type=int, default=100,
                        help="metros a mais que a rota comum (padrão: 100)")
    desempenho = sub.add_parser("desempenho", help="recursão × memoização × tabulação e cache")
    desempenho.add_argument("--consultas", type=int, default=1000,
                            help="pedidos simulados para medir o cache (padrão: 1000)")
    pesos = sub.add_parser("pesos", parents=[filtros], help="grafo no formato GET /trechos/pesos")
    pesos.add_argument("--saida", help="arquivo de saída (padrão: mostra na tela)")
    sub.add_parser("demo", help="demonstração com as personas")
    return parser


def main(argv=None) -> int:
    for fluxo in (sys.stdout, sys.stderr):
        if hasattr(fluxo, "reconfigure"):
            fluxo.reconfigure(encoding="utf-8")  # acentos também no terminal do Windows
    args = criar_parser().parse_args(argv)
    try:
        mapa = carregar_mapa(args.mapa)
        comandos = {
            "mapa": lambda: cmd_mapa(mapa),
            "rota": lambda: cmd_rota(args, mapa),
            "limite": lambda: cmd_limite(args, mapa),
            "desempenho": lambda: cmd_desempenho(args, mapa),
            "pesos": lambda: cmd_pesos(args, mapa),
            "demo": lambda: cmd_demo(mapa),
        }
        if args.comando is None:
            menu(mapa)
        else:
            comandos[args.comando]()
    except (ValueError, OSError) as erro:
        print(f"Erro: {erro}", file=sys.stderr)
        return 1
    except (KeyboardInterrupt, EOFError):
        print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
