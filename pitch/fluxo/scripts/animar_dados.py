"""Gera src/dados.json e src/tema.json do projeto Remotion do vídeo a partir do estado e do perfil.

Uso: py animar_dados.py <pasta do vídeo>
- Cenas e gatilhos do bloco `mapa`, convertidos em frames por `frame()` (único ponto de conversão).
- Ícones do bloco `assets` embutidos como SVG (cor = currentColor, tamanho 100%).
- Narração final (`cortes.narracao_final`) copiada para public/ (cópia, nunca link).
- Cores do perfil (`identidade.md`) em tema.json.
Teste: py animar_dados.py --teste
"""
import json, re, shutil, sys
from pathlib import Path

FPS = 30
PERFIL = Path(__file__).resolve().parent.parent / "perfil"
PAPEIS = {"Marca escura": "escura", "Marca água": "agua", "Fundo suave": "suave", "Branco": "branco",
          "Alerta acessibilidade": "acessibilidade", "Alerta segurança": "seguranca", "Alerta clima": "clima"}


def frame(segundos):
    return round(segundos * FPS)


def svg_limpo(texto):
    texto = re.sub(r'\s(width|height)="[^"]*"', "", texto, count=2)
    return texto.replace("<svg", '<svg width="100%" height="100%"', 1)


def cores(identidade):
    achadas = dict(re.findall(r"^\|\s*([^|]+?)\s*\|\s*`(#[0-9a-fA-F]{6})`", identidade, re.M))
    faltam = [p for p in PAPEIS if p not in achadas]
    assert not faltam, f"identidade.md sem as cores: {faltam}"
    return {PAPEIS[p]: achadas[p].lower() for p in PAPEIS}


def dados(estado, pasta):
    m = estado["mapa"]
    cenas = []
    for c in m["cenas"]:
        ini = frame(c["inicio"])
        cenas.append({"id": c["id"], "inicio_f": ini, "fim_f": frame(c["fim"]), "tipo": c["tipo"], "descricao": c["descricao"],
                      "gatilhos": [{"palavra": p, "f": frame(t) - ini, "o_que": o} for p, t, o in c.get("gatilhos", [])]})
    # cobertura: cenas contíguas de 0 ao fim, sem buraco nem sobreposição
    assert cenas[0]["inicio_f"] == 0, "primeira cena não começa no 0"
    for a, b in zip(cenas, cenas[1:]):
        assert a["fim_f"] == b["inicio_f"], f"buraco ou sobreposição entre {a['id']} e {b['id']}"
    icones = {}
    for it in estado.get("assets", {}).get("itens", []):
        arq = it.get("arquivo") or ""
        if arq.endswith(".svg") and it.get("status") == "pronto":
            icones[it["id"]] = svg_limpo((pasta / arq).read_text(encoding="utf-8"))
    return {"fps": FPS, "duracao_f": cenas[-1]["fim_f"], "narracao": "narracao.wav", "cenas": cenas, "icones": icones}


def main(pasta):
    pasta = Path(pasta)
    proj = pasta / "edicao/remotion"
    assert (proj / "src").is_dir(), f"projeto Remotion não existe em {proj}"
    estado = json.loads((pasta / "edicao/projeto.json").read_text(encoding="utf-8"))
    d = dados(estado, pasta)
    origem = pasta / estado["cortes"]["narracao_final"]
    destino = proj / "public" / d["narracao"]
    destino.parent.mkdir(exist_ok=True)
    if not destino.exists() or destino.stat().st_size != origem.stat().st_size:
        shutil.copy2(origem, destino)
    # pastas de assets prontas (ex.: assets/prints) copiadas para public/<nome da pasta>
    for it in estado.get("assets", {}).get("itens", []):
        src = pasta / (it.get("arquivo") or "_")
        if it.get("status") == "pronto" and src.is_dir():
            for arq in src.iterdir():
                alvo = proj / "public" / src.name / arq.name
                if arq.is_file() and not alvo.exists():
                    alvo.parent.mkdir(exist_ok=True)
                    shutil.copy2(arq, alvo)
    (proj / "src/dados.json").write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    tema = {"cores": cores((PERFIL / "identidade.md").read_text(encoding="utf-8")), "fonte": "Inter"}
    (proj / "src/tema.json").write_text(json.dumps(tema, ensure_ascii=False), encoding="utf-8")
    print(f"{len(d['cenas'])} cenas, {d['duracao_f']} frames, {len(d['icones'])} ícones")


def _teste():
    assert frame(1.6) == 48 and frame(0.96) == 29 and frame(132.6) == 3978
    est = {"mapa": {"cenas": [{"id": "c01", "inicio": 0, "fim": 2.64, "tipo": "board", "descricao": "x", "gatilhos": [["Dona", 1.6, "nome"]]},
                              {"id": "c02", "inicio": 2.64, "fim": 7.7, "tipo": "board", "descricao": "y"}]}}
    d = dados(est, Path("."))
    assert d["cenas"][0]["gatilhos"][0]["f"] == 48 and d["cenas"][1]["inicio_f"] == 79 and d["duracao_f"] == 231
    assert svg_limpo('<svg xmlns="a" width="24" height="24" viewBox="0 0 24 24">') == '<svg width="100%" height="100%" xmlns="a" viewBox="0 0 24 24">'
    print("ok")


if __name__ == "__main__":
    _teste() if sys.argv[1:] == ["--teste"] else main(sys.argv[1])
