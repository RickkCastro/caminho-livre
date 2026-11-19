"""Frases com tempo, ligadas ao roteiro, e mapa de silêncios (ed-preparar).

Uso: py frases.py <pasta_do_video> <roteiro.md> [--texto-roteiro]
Lê edicao/preparar/palavras_narracao.json e narracao.wav. Grava em edicao/preparar/:
frases.md, frases.json, silencios.json, e o bloco `transcricao` no estado.
--texto-roteiro: o texto mostrado é o do roteiro (a pessoa lê à risca); os tempos são os da fala.
Teste sem arquivos: py frases.py --teste
"""
import difflib
import json
import re
import subprocess
import sys
import unicodedata
import wave
from pathlib import Path

PAUSA_SILENCIO = 0.3   # s: lacuna entre palavras que conta como silêncio
PAUSA_MARCAR = 0.5     # s: pausa que aparece no frases.md
ENGOLIDO = 0.7         # s: lacuna com voz e sem palavra = possível trecho engolido


def norm(t):
    t = unicodedata.normalize("NFD", t.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in t if unicodedata.category(c) != "Mn"))


def ler_roteiro(md):
    """Lista de (bloco, frase) do texto falado: ignora títulos, '>' (imagem) e tudo a partir de '## Notas'/'## Dicas'."""
    out, bloco = [], None
    for l in Path(md).read_text(encoding="utf-8").splitlines():
        if l.startswith("## "):
            if re.match(r"## (Notas|Dicas)", l):
                break
            m = re.match(r"## (\d+) · (.+?) \(", l)
            bloco = f"{m.group(1)} · {m.group(2)}" if m else None
            continue
        if bloco and l.strip() and not l.startswith((">", "#", "---")):
            out += [(bloco, s.strip()) for s in re.split(r"(?<=[.?!])\s+", l.strip()) if s.strip()]
    return out


def alinhar(roteiro, palavras):
    """Para cada frase do roteiro, a faixa [i, j] de palavras faladas, por alinhamento de palavras (difflib)."""
    rw, dono = [], []
    for k, (_, s) in enumerate(roteiro):
        for w in s.split():
            if norm(w):
                rw.append(norm(w)); dono.append(k)
    fw = [norm(p["texto"]) for p in palavras]
    mapa = {}
    for a, b, n in difflib.SequenceMatcher(None, rw, fw, autojunk=False).get_matching_blocks():
        for d in range(n):
            mapa.setdefault(dono[a + d], []).append(b + d)
    faixas = []
    for k in range(len(roteiro)):
        idx = mapa.get(k)
        faixas.append((min(idx), max(idx)) if idx else None)
    # estende cada faixa até a próxima, para palavras não casadas (números, nomes errados) não ficarem de fora
    ok = [k for k, f in enumerate(faixas) if f]
    for n, k in enumerate(ok):
        prox = faixas[ok[n + 1]][0] if n + 1 < len(ok) else len(palavras)
        faixas[k] = (0 if n == 0 else faixas[k][0], prox - 1)  # a 1ª frase também pega o que veio antes dela
    usados = {i for f in faixas if f for i in range(f[0], f[1] + 1)}
    sobra = [i for i in range(len(palavras)) if i not in usados]
    return faixas, sobra


def energia_voz(wav, ini, fim):
    """RMS (dBFS) do trecho; usado para achar lacuna com voz e sem palavra."""
    with wave.open(str(wav)) as w:
        sr = w.getframerate(); w.setpos(int(ini * sr))
        b = w.readframes(max(1, int((fim - ini) * sr)))
    import array, math
    a = array.array("h", b)
    if not a:
        return -120.0
    rms = math.sqrt(sum(x * x for x in a) / len(a)) / 32768
    return 20 * math.log10(rms) if rms > 0 else -120.0


def main(pasta, roteiro_md, texto_roteiro):
    pasta = Path(pasta); prep = pasta / "edicao" / "preparar"
    pal = [p for p in json.loads((prep / "palavras_narracao.json").read_text(encoding="utf-8")) if p["tipo"] == "word"]
    rot = ler_roteiro(roteiro_md)
    faixas, sobra = alinhar(rot, pal)

    silencios, engolidos = [], []
    for a, b in zip(pal, pal[1:]):
        gap = b["inicio"] - a["fim"]
        if gap >= PAUSA_SILENCIO:
            silencios.append({"inicio": a["fim"], "fim": b["inicio"], "dur": round(gap, 3)})
            if gap >= ENGOLIDO and energia_voz(prep / "narracao.wav", a["fim"] + 0.1, b["inicio"] - 0.1) > -35:
                engolidos.append({"inicio": a["fim"], "fim": b["inicio"]})

    frases, faltando = [], []
    linhas = ["# Frases da narração", "",
              f"Texto: {'roteiro (tempos da fala)' if texto_roteiro else 'transcrito'}. Tempos em s no `narracao.wav`."]
    bloco_atual = None
    for k, ((bloco, txt), f) in enumerate(zip(rot, faixas), 1):
        if f is None:
            faltando.append(f"{bloco}: {txt}"); continue
        ini, fim = pal[f[0]]["inicio"], pal[f[1]]["fim"]
        falado = " ".join(p["texto"] for p in pal[f[0]:f[1] + 1])
        fr = {"id": f"f{k:03d}", "bloco": bloco, "inicio": ini, "fim": fim, "texto": txt if texto_roteiro else falado,
              "falado": falado, "palavras": [f[0], f[1]]}
        frases.append(fr)
        if bloco != bloco_atual:
            linhas += ["", f"## {bloco}"]; bloco_atual = bloco
        linhas.append(f"- {fr['id']} · {ini:6.2f}–{fim:6.2f} · {fr['texto']}")
        prox = pal[f[1] + 1]["inicio"] if f[1] + 1 < len(pal) else None
        if prox is not None and prox - fim >= PAUSA_MARCAR:
            linhas.append(f"  - pausa {prox - fim:.2f} s")
    if sobra:
        linhas += ["", f"Fala fora do roteiro (palavras {sobra[0]}…{sobra[-1]}, {len(sobra)} no total): conferir"]
    if faltando:
        linhas += ["", "Frases do roteiro sem fala:"] + [f"- {x}" for x in faltando]
    if engolidos:
        linhas += ["", "Lacunas com voz e sem palavra (possível trecho engolido):"] + [f"- {e['inicio']:.2f}–{e['fim']:.2f}" for e in engolidos]

    (prep / "frases.md").write_text("\n".join(linhas) + "\n", encoding="utf-8")
    (prep / "frases.json").write_text(json.dumps(frases, ensure_ascii=False, indent=1), encoding="utf-8")
    (prep / "silencios.json").write_text(json.dumps(silencios, indent=1), encoding="utf-8")
    bloco = {"audio_trabalho": "edicao/preparar/narracao.wav", "palavras": "edicao/preparar/palavras_narracao.json",
             "frases": "edicao/preparar/frases.md", "n_frases": len(frases), "n_silencios": len(silencios),
             "texto_do_roteiro": texto_roteiro, "roteiro": Path(roteiro_md).name,
             "faltando": faltando, "fora_do_roteiro": len(sobra), "engolidos": engolidos}
    subprocess.run([sys.executable, str(Path(__file__).with_name("ver.py")), str(pasta), "--set", "transcricao",
                    json.dumps(bloco, ensure_ascii=False)], check=True)
    print(f"{len(frases)} frases · {len(silencios)} silêncios · faltando {len(faltando)} · fora do roteiro {len(sobra)} · engolidos {len(engolidos)}")


def _teste():
    rot = [("1 · A", "Imagina ela."), ("1 · A", "Ela tem 68 anos."), ("1 · A", "Mora a seiscentos metros.")]
    pal = [{"texto": t, "inicio": i, "fim": i + 0.5} for i, t in enumerate("Imagine ela. Ela tem 68 anos. Mora a 80 metros.".split())]
    faixas, sobra = alinhar(rot, pal)
    assert faixas == [(0, 1), (2, 5), (6, 9)] and sobra == [], (faixas, sobra)
    print("ok")


if __name__ == "__main__":
    if sys.argv[1:] == ["--teste"]:
        _teste()
    else:
        main(sys.argv[1], sys.argv[2], "--texto-roteiro" in sys.argv)
