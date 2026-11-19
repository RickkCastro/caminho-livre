"""Mede cada som da biblioteca pitch/som/ e atualiza som/indice.json.

Uso: py som_indexar.py            (teste: py som_indexar.py --teste)
Por som: duração, início útil (primeira amostra a -40 dB do pico), tempo até o pico do envelope (RMS 10 ms),
pico em dBFS, RMS em dBFS, forma ("seco" se o pico vem nos primeiros 80 ms do início útil, senão "crescendo"),
e o prompt do .json ao lado. Não remede o que não mudou (tamanho + data).
"""
import json, subprocess, sys
from pathlib import Path
import numpy as np

SOM = Path(__file__).resolve().parents[2] / "som"
SR = 22050


def decodificar(arq):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(arq), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def medir(x):
    pico = float(np.max(np.abs(x))) or 1e-9
    acima = np.nonzero(np.abs(x) >= pico * 0.01)[0]  # -40 dB do pico
    inicio = acima[0] / SR if len(acima) else 0.0
    janela = int(SR * 0.01)
    n = len(x) // janela
    env = np.sqrt(np.mean(x[: n * janela].reshape(n, janela) ** 2, axis=1))
    t_pico = (int(np.argmax(env)) + 0.5) * 0.01
    rms = float(np.sqrt(np.mean(x ** 2))) or 1e-9
    return {"duracao": round(len(x) / SR, 3), "inicio_util": round(inicio, 3), "pico_s": round(t_pico, 3),
            "pico_db": round(20 * np.log10(pico), 1), "rms_db": round(20 * np.log10(rms), 1),
            "forma": "seco" if t_pico - inicio < 0.08 else "crescendo"}


def main():
    idx_arq = SOM / "indice.json"
    idx = json.loads(idx_arq.read_text(encoding="utf-8")) if idx_arq.exists() else {}
    for arq in sorted(SOM.rglob("*.mp3")):
        chave = arq.relative_to(SOM).as_posix()
        st = arq.stat()
        assinatura = f"{st.st_size}-{int(st.st_mtime)}"
        if idx.get(chave, {}).get("assinatura") == assinatura:
            continue
        meta = arq.with_suffix(".json")
        prompt = json.loads(meta.read_text(encoding="utf-8")).get("prompt") if meta.exists() else None
        idx[chave] = {"categoria": arq.parent.name, **medir(decodificar(arq)), "prompt": prompt,
                      "favorito": idx.get(chave, {}).get("favorito", False), "assinatura": assinatura}
        print(chave, idx[chave]["pico_s"], idx[chave]["pico_db"])
    idx_arq.write_text(json.dumps(idx, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(idx)} sons no índice")


def _teste():
    t = np.arange(SR) / SR
    x = np.zeros(SR, dtype=np.float32)
    x[int(0.2 * SR):int(0.3 * SR)] = 0.5 * np.sin(2 * np.pi * 440 * t[: int(0.1 * SR)])
    m = medir(x)
    assert abs(m["inicio_util"] - 0.2) < 0.01 and 0.2 <= m["pico_s"] <= 0.31 and abs(m["pico_db"] + 6.0) < 0.2, m
    print("ok")


if __name__ == "__main__":
    _teste() if sys.argv[1:] == ["--teste"] else main()
