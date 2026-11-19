"""Grava o som do vídeo: do rascunho de efeitos + música calcula frames, níveis e abaixamento e escreve
src/som.json do projeto Remotion, copia os sons usados para public/sons/ e grava o bloco `som` no estado.

Uso: py som_gravar.py <pasta do vídeo> <rascunho.json>
rascunho: {"efeitos": [{"evento": frame, "som": "whoosh/x.mp3", "camada": "principal|grave|apoio", "alinha": "pico|inicio|fim",
                        "cena": "c04", "o_que": "..."}],
           "musica": {"som": "musica/x.mp3", "loop": true}}
Níveis: pico de cada efeito levado ao alvo da categoria (PICO_ALVO, dBFS); música por RMS, abaixando sob a voz
(atividade tirada de edicao/preparar/palavras_narracao.json), rampas de 0,3 s, fade de entrada 0,5 s e de saída 2 s.
Avisos: mesmo arquivo em < 20 s, dois principais a < 4 frames.
Teste: py som_gravar.py --teste
"""
import json, shutil, subprocess, sys, tempfile
from pathlib import Path

FPS = 30
SOM = Path(__file__).resolve().parents[2] / "som"
VER = Path(__file__).resolve().parent / "ver.py"
PICO_ALVO = {"whoosh": -22, "pop": -24, "clique": -24, "ding": -24, "impacto": -20, "riser": -24, "interface": -26}
MUSICA_RMS = -25.0     # sem voz (respiros e cauda)
ABAIXA_DB = -9.0       # sob a voz
RAMPA_S, JUNTA_S = 0.3, 0.35


def frame(s):
    return round(s * FPS)


def inicio_do_som(evento, info, alinha):
    if alinha == "pico":
        return evento - frame(info["pico_s"])
    if alinha == "fim":
        return evento - frame(info["duracao"])
    return evento - frame(info["inicio_util"])


def falas(palavras):
    """Intervalos com voz (s), juntando palavras com buraco menor que JUNTA_S."""
    ints = []
    for p in sorted(palavras, key=lambda w: w["inicio"]):
        if ints and p["inicio"] - ints[-1][1] < JUNTA_S:
            ints[-1][1] = max(ints[-1][1], p["fim"])
        else:
            ints.append([p["inicio"], p["fim"]])
    return ints


def chaves_musica(ints, total_f):
    """Pontos [frame, dB relativo] da curva da música: 0 sem voz, ABAIXA_DB com voz, rampas de RAMPA_S."""
    r = frame(RAMPA_S)
    pts = [[0, -60.0], [frame(0.5), 0.0]]
    for a, b in ints:
        fa, fb = frame(a), frame(b)
        pts += [[max(fa - r, pts[-1][0] + 1), 0.0], [max(fa, pts[-1][0] + 2), ABAIXA_DB], [fb, ABAIXA_DB], [fb + r, 0.0]]
    pts += [[max(total_f - frame(2.0), pts[-1][0] + 1), 0.0], [total_f, -60.0]]
    return pts


def avisos(efs):
    out = []
    for i, e in enumerate(efs):
        for o in efs[i + 1:]:
            if o["arquivo"] == e["arquivo"] and abs(o["from"] - e["from"]) < 20 * FPS:
                out.append(f"{e['id']} e {o['id']} repetem {e['arquivo']} em menos de 20 s")
            if o["camada"] == e["camada"] == "principal" and abs(o["from"] - e["from"]) < 4:
                out.append(f"{e['id']} e {o['id']}: dois principais colados")
    return out


def main(pasta, rascunho):
    pasta = Path(pasta)
    proj = pasta / "edicao/remotion"
    idx = json.loads((SOM / "indice.json").read_text(encoding="utf-8"))
    r = json.loads(Path(rascunho).read_text(encoding="utf-8"))
    dados = json.loads((proj / "src/dados.json").read_text(encoding="utf-8"))
    total = dados["duracao_f"]
    efs = []
    for n, e in enumerate(sorted(r["efeitos"], key=lambda e: e["evento"]), 1):
        info = idx[e["som"]]
        ini = max(0, inicio_do_som(e["evento"], info, e.get("alinha", "inicio")))
        ganho = PICO_ALVO[info["categoria"]] - info["pico_db"]
        efs.append({"id": f"sfx{n:02d}", "arquivo": "sons/" + e["som"], "from": ini, "dur_f": frame(info["duracao"]) + 1,
                    "db": round(ganho, 1), "camada": e.get("camada", "principal"), "evento": e["evento"],
                    "cena": e.get("cena"), "o_que": e.get("o_que")})
    m = r["musica"]
    mi = idx[m["som"]]
    palavras = json.loads((pasta / "edicao/preparar/palavras_narracao.json").read_text(encoding="utf-8"))
    musica = {"arquivo": "sons/" + m["som"], "loop_f": frame(mi["duracao"]), "db": round(MUSICA_RMS - mi["rms_db"], 1),
              "chaves": chaves_musica(falas(palavras), total)}
    for s in {e["som"] for e in r["efeitos"]} | {m["som"]}:
        alvo = proj / "public/sons" / s
        alvo.parent.mkdir(parents=True, exist_ok=True)
        if not alvo.exists():
            shutil.copy2(SOM / s, alvo)
    (proj / "src/som.json").write_text(json.dumps({"efeitos": efs, "musica": musica}, ensure_ascii=False, indent=1), encoding="utf-8")
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as t:
        json.dump({"efeitos": efs, "musica": {**musica, "som": m["som"], "prompt": mi.get("prompt")}, "pico_alvo": PICO_ALVO,
                   "musica_rms": MUSICA_RMS, "abaixa_db": ABAIXA_DB}, t, ensure_ascii=False)
    subprocess.run([sys.executable, str(VER), str(pasta), "--set", "som", "@" + t.name], check=True)
    Path(t.name).unlink()
    for a in avisos(efs):
        print("AVISO:", a)
    print(f"{len(efs)} efeitos, música {m['som']} (loop {musica['loop_f']} f, {musica['db']} dB), {len(musica['chaves'])} pontos de abaixamento")


def _teste():
    info = {"pico_s": 0.2, "duracao": 0.8, "inicio_util": 0.05}
    assert inicio_do_som(100, info, "pico") == 94 and inicio_do_som(100, info, "fim") == 76 and inicio_do_som(100, info, "inicio") == 98
    assert falas([{"inicio": 1, "fim": 1.5}, {"inicio": 1.7, "fim": 2}, {"inicio": 3, "fim": 3.2}]) == [[1, 2], [3, 3.2]]
    pts = chaves_musica([[1, 2]], 300)
    assert pts[0] == [0, -60.0] and [60, ABAIXA_DB] in pts and pts[-1] == [300, -60.0]
    assert all(b[0] > a[0] for a, b in zip(pts, pts[1:])), "frames da curva precisam crescer"
    efs = [{"id": "a", "arquivo": "x", "from": 0, "camada": "principal"}, {"id": "b", "arquivo": "x", "from": 2, "camada": "principal"}]
    assert len(avisos(efs)) == 2
    print("ok")


if __name__ == "__main__":
    _teste() if sys.argv[1:] == ["--teste"] else main(sys.argv[1], sys.argv[2])
