"""Confere um render da animação e grava o bloco `animacao` no estado.

Uso: py animar_conferir.py <pasta do vídeo> <render.mp4> <frame_ini> <frame_fim>
- ffprobe: 1280x720 (rascunho) ou 1920x1080, 30 fps, frames == fim - ini + 1, faixa de áudio presente. Recusa se não bater.
- Eventos para o som: edicao/remotion/eventos.json ({cena: [[frame absoluto, tipo, o que]]}), anotados ao construir.
- Grava animacao.renders (acumula) e animacao.cenas (versão/status/eventos das cenas cobertas) via ver.py --set.
Teste: py animar_conferir.py --teste
"""
import json, subprocess, sys, tempfile
from datetime import date
from pathlib import Path

VER = Path(__file__).resolve().parent / "ver.py"


def sondar(mp4):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate,nb_frames",
                          "-of", "json", str(mp4)], capture_output=True, text=True, check=True).stdout
    return json.loads(out)["streams"]


def conferir(streams, ini, fim):
    v = [s for s in streams if s["codec_type"] == "video"]
    a = [s for s in streams if s["codec_type"] == "audio"]
    erros = []
    if not v:
        return ["sem vídeo"]
    v = v[0]
    if (v["width"], v["height"]) not in [(1280, 720), (1920, 1080)]:
        erros.append(f"resolução {v['width']}x{v['height']}")
    if v["r_frame_rate"] != "30/1":
        erros.append(f"fps {v['r_frame_rate']}")
    if int(v["nb_frames"]) != fim - ini + 1:
        erros.append(f"frames {v['nb_frames']} ≠ {fim - ini + 1}")
    if not a:
        erros.append("sem áudio da narração")
    return erros


def set_estado(pasta, caminho, valor):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as t:
        json.dump(valor, t, ensure_ascii=False)
    subprocess.run([sys.executable, str(VER), str(pasta), "--set", caminho, "@" + t.name], check=True)
    Path(t.name).unlink()


def main(pasta, mp4, ini, fim):
    pasta, mp4, ini, fim = Path(pasta), Path(mp4), int(ini), int(fim)
    streams = sondar(mp4)
    erros = conferir(streams, ini, fim)
    if erros:
        sys.exit("RECUSADO: " + "; ".join(erros))
    estado = json.loads((pasta / "edicao/projeto.json").read_text(encoding="utf-8"))
    anim = estado.get("animacao") or {"renders": [], "cenas": {}}
    eventos = json.loads((pasta / "edicao/remotion/eventos.json").read_text(encoding="utf-8"))
    v = streams[0]
    anim["renders"].append({"arquivo": str(mp4.resolve().relative_to(pasta.resolve())).replace("\\", "/"), "frames": [ini, fim],
                            "resolucao": f"{v['width']}x{v['height']}", "data": date.today().isoformat()})
    for c in estado["mapa"]["cenas"]:
        ci, cf = round(c["inicio"] * 30), round(c["fim"] * 30)
        if ci >= ini and cf <= fim + 1 and c["id"] in eventos:
            ant = anim["cenas"].get(c["id"], {})
            anim["cenas"][c["id"]] = {"versao": ant.get("versao", 0) + 1, "status": "revisar", "frames": [ci, cf],
                                      "eventos": [{"frame": e[0], "tipo": e[1], "o_que": e[2]} for e in eventos[c["id"]]]}
    set_estado(pasta, "animacao", anim)
    print(f"ok: {mp4.name} · {fim - ini + 1} frames · cenas {sorted(k for k in anim['cenas'])}")


def _teste():
    s = [{"codec_type": "video", "width": 1280, "height": 720, "r_frame_rate": "30/1", "nb_frames": "577"}, {"codec_type": "audio"}]
    assert conferir(s, 0, 576) == []
    assert conferir(s, 0, 600) == ["frames 577 ≠ 601"]
    assert conferir(s[:1], 0, 576) == ["sem áudio da narração"]
    print("ok")


if __name__ == "__main__":
    _teste() if sys.argv[1:] == ["--teste"] else main(*sys.argv[1:5])
