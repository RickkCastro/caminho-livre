"""Inventário da mídia do vídeo (ffprobe/ffmpeg) para a ed-preparar.

Uso: py inventario.py <pasta_do_video>
Lê brutos/ e assets/ (sem subpastas de biblioteca), grava edicao/preparar/inventario.md
e o bloco `midia` no estado (via ver.py). Só lê; nunca mexe nos arquivos.
"""
import json
import re
import subprocess
import sys
from fractions import Fraction
from pathlib import Path

AUDIO = {".wav", ".mp3", ".m4a", ".aac", ".flac", ".ogg", ".opus"}
VIDEO = {".mp4", ".mov", ".mkv", ".webm"}
IMAGEM = {".png", ".jpg", ".jpeg", ".webp", ".svg"}


def probe(f):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(f)],
                       capture_output=True, text=True, encoding="utf-8")
    return json.loads(r.stdout) if r.returncode == 0 else None


def niveis(f):
    """Pico e média (dBFS) e loudness integrada (LUFS) da faixa de áudio."""
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(f), "-map", "0:a:0",
                        "-af", "volumedetect,ebur128", "-f", "null", "-"],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    pega = lambda pad: (m := re.findall(pad, r.stderr)) and float(m[-1])
    return {"pico_db": pega(r"max_volume: (-?[\d.]+) dB"), "media_db": pega(r"mean_volume: (-?[\d.]+) dB"),
            "lufs": pega(r"I:\s+(-?[\d.]+) LUFS")}


def item(f, pasta):
    d = probe(f)
    rel = f.relative_to(pasta).as_posix()
    if d is None:
        return {"arquivo": rel, "alerta": "ilegível"}
    v = next((s for s in d["streams"] if s["codec_type"] == "video"), None)
    a = next((s for s in d["streams"] if s["codec_type"] == "audio"), None)
    out = {"arquivo": rel, "duracao_s": round(float(d["format"].get("duration", 0)), 3),
           "data": d["format"].get("tags", {}).get("creation_time")}
    alertas = []
    if f.suffix.lower() in IMAGEM:
        out.update(tipo="imagem", largura=v and v.get("width"), altura=v and v.get("height"))
        if v and v.get("width", 9999) < 900:
            alertas.append("pequena para celular em tela cheia (< 900 px)")
    elif v and f.suffix.lower() in VIDEO:
        r, m = Fraction(v["r_frame_rate"]), Fraction(v["avg_frame_rate"] or "0/1")
        vfr = m and abs(float(r) - float(m)) > 0.01
        out.update(tipo="gravacao_tela", largura=v["width"], altura=v["height"], fps=round(float(m or r), 3),
                   vfr=bool(vfr), tem_audio=a is not None)
        if vfr:
            alertas.append("taxa variável (VFR): converter para 30 fps constantes na ed-assets")
    if a is not None and f.suffix.lower() in AUDIO:
        out.update(tipo="narracao", taxa_hz=int(a["sample_rate"]), canais=a["channels"], codec=a["codec_name"],
                   bits=a.get("bits_per_raw_sample") or a.get("bits_per_sample"), **niveis(f))
        if out["pico_db"] is not None and out["pico_db"] >= -0.1:
            alertas.append("narração estourando (pico em 0 dBFS)")
        elif out["pico_db"] is not None and out["pico_db"] < -20:
            alertas.append("narração muito baixa (pico abaixo de -20 dBFS)")
    if alertas:
        out["alertas"] = alertas
    return out


def main(pasta):
    pasta = Path(pasta)
    arquivos = sorted(p for d in ("brutos", "assets") for p in (pasta / d).rglob("*")
                      if p.is_file() and "biblioteca" not in p.parts and not p.name.startswith("_"))
    itens = [item(f, pasta) for f in arquivos]
    narr = [i for i in itens if i.get("tipo") == "narracao"]
    linhas = ["# Inventário da mídia", ""]
    for i in itens:
        extra = {k: v for k, v in i.items() if k not in ("arquivo", "alertas")}
        linhas.append(f"- `{i['arquivo']}` · " + " · ".join(f"{k} {v}" for k, v in extra.items() if v not in (None, "")))
        linhas += [f"  - ALERTA: {a}" for a in i.get("alertas", [])]
    saida = pasta / "edicao" / "preparar"
    saida.mkdir(parents=True, exist_ok=True)
    (saida / "inventario.md").write_text("\n".join(linhas) + "\n", encoding="utf-8")
    midia = {"narracao": [i["arquivo"] for i in narr], "itens": itens}
    subprocess.run([sys.executable, str(Path(__file__).with_name("ver.py")), str(pasta), "--set", "midia",
                    json.dumps(midia, ensure_ascii=False)], check=True)
    print("\n".join(linhas))


if __name__ == "__main__":
    main(sys.argv[1])
