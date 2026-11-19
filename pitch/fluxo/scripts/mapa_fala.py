"""Fala no tempo da narração limpa (ed-mapa).

Uso:
  py mapa_fala.py <pasta do vídeo>                  -> grava edicao/mapa/fala_vNN.md (NN novo)
  py mapa_fala.py <pasta do vídeo> --palavras 0:00 0:19   -> palavras do trecho (tempo da narração limpa)
"""
import json, re, sys
from pathlib import Path


def mmss(t):
    m, s = divmod(t, 60)
    return f"{int(m)}:{s:05.2f}"


def para_seg(txt):
    if ":" in txt:
        m, s = txt.split(":")
        return int(m) * 60 + float(s)
    return float(txt)


def montar_conversor(cortes):
    """Tempo da transcrição (arquivo de origem) -> tempo na narração limpa, pelos segmentos do corte.
    shortcut: supõe um arquivo de origem só; com vários takes, casar também pelo arquivo."""
    segs = []
    acum = 0.0
    for s in cortes["segmentos"]:
        segs.append((s["id"], s["inicio"], s["fim"], acum))
        acum += s["fim"] - s["inicio"]

    def conv(t):
        for sid, ini, fim, base in segs:
            if ini - 1e-6 <= t <= fim + 1e-6:
                return base + (t - ini), sid
        return None, None  # cai num trecho cortado

    return conv, acum


def main():
    pasta = Path(sys.argv[1])
    proj = json.loads((pasta / "edicao/projeto.json").read_text(encoding="utf-8"))
    conv, dur = montar_conversor(proj["cortes"])
    frases = json.loads((pasta / "edicao/preparar/frases.json").read_text(encoding="utf-8"))
    palavras = json.loads((pasta / "edicao/preparar/palavras_narracao.json").read_text(encoding="utf-8"))

    if "--palavras" in sys.argv:
        i = sys.argv.index("--palavras")
        a, b = para_seg(sys.argv[i + 1]), para_seg(sys.argv[i + 2])
        for p in palavras:
            if p.get("tipo") != "word":
                continue
            t, sid = conv(p["inicio"])
            if t is None:
                print(f"  (cortada) {p['texto']} @ origem {p['inicio']:.2f}")
            elif a <= t <= b:
                print(f"{mmss(t)}  {p['texto']}")
        return

    linhas = [f"# Fala no tempo da narração limpa\n",
              f"Corte v{proj['cortes'].get('versao', 1)} · duração {mmss(dur)} · tempos mm:ss.ff\n"]
    bloco = None
    for k, f in enumerate(frases):
        ini, sid = conv(f["inicio"])
        fim, _ = conv(f["fim"])
        if f["bloco"] != bloco:
            bloco = f["bloco"]
            linhas.append(f"\n## {bloco}")
        aviso = "  ⚠ cai em trecho cortado" if ini is None or fim is None else ""
        linhas.append(f"- {f['id']} · {sid} · {mmss(ini or 0)}–{mmss(fim or 0)} · {f['texto']}{aviso}")
        prox = frases[k + 1] if k + 1 < len(frases) else None
        if prox and prox["bloco"] != bloco:
            j, _ = conv((f["fim"] + prox["inicio"]) / 2)
            linhas.append(f"  - **junção → {prox['bloco']}: {mmss(j)}**")
    linhas.append(f"\nFim da fala: {mmss(conv(frases[-1]['fim'])[0])} · fim do áudio: {mmss(dur)}")

    saida = pasta / "edicao/mapa"
    saida.mkdir(parents=True, exist_ok=True)
    n = 1 + max([int(m.group(1)) for x in saida.glob("fala_v*.md") if (m := re.search(r"_v(\d+)", x.name))] or [0])
    arq = saida / f"fala_v{n:02d}.md"
    arq.write_text("\n".join(linhas) + "\n", encoding="utf-8")
    print(arq)


if __name__ == "__main__":
    main()
