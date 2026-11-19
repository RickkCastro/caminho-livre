"""Mede movimentos de um video de referencia (por fluxo optico).

Uso: py ref_medir.py <video.mp4> <cenas.csv> <saida.csv>
Para cada movimento (de um quadro parado ate o proximo parado, dentro de uma cena):
inicio, duracao em frames e em s, a curva GSAP mais parecida e o erro do ajuste.
Tambem imprime o ritmo de cortes (duracao media/mediana das cenas).

shortcut: mede o movimento total da imagem (camera + elementos juntos), sem separar
a camera por transformacao afim. Upgrade quando houver referencias com camera real.
"""
import csv
import statistics
import sys

import cv2
import numpy as np

ESCALA = 320  # largura para o fluxo optico (rapido e suficiente)
PARADO = 0.15  # px/quadro (na escala acima) abaixo disso = parado
MIN_FRAMES = 4

t = np.linspace(0, 1, 101)
CURVAS = {
    "linear": t,
    "power1.out": 1 - (1 - t) ** 2,
    "power2.out": 1 - (1 - t) ** 3,
    "power3.out": 1 - (1 - t) ** 4,
    "power4.out": 1 - (1 - t) ** 5,
    "expo.out": np.where(t == 1, 1, 1 - 2 ** (-10 * t)),
    "power2.in": t ** 3,
    "power2.inOut": np.where(t < 0.5, 4 * t ** 3, 1 - (-2 * t + 2) ** 3 / 2),
    "power3.inOut": np.where(t < 0.5, 8 * t ** 4, 1 - (-2 * t + 2) ** 4 / 2),
    "expo.inOut": np.where(t < 0.5, 2 ** (20 * t - 10) / 2, (2 - 2 ** (-20 * t + 10)) / 2),
}
CURVAS["expo.inOut"][0], CURVAS["expo.inOut"][-1] = 0, 1


def melhor_curva(mag):
    acum = np.concatenate([[0], np.cumsum(mag)])
    acum = acum / acum[-1]
    x = np.linspace(0, 1, len(acum))
    y = np.interp(t, x, acum)
    erros = {n: float(np.sqrt(np.mean((y - c) ** 2))) for n, c in CURVAS.items()}
    n = min(erros, key=erros.get)
    return n, erros[n]


def magnitudes(video):
    cap = cv2.VideoCapture(video)
    fps = cap.get(cv2.CAP_PROP_FPS)
    ant, mags = None, [0.0]
    while True:
        ok, img = cap.read()
        if not ok:
            break
        h = int(img.shape[0] * ESCALA / img.shape[1])
        g = cv2.cvtColor(cv2.resize(img, (ESCALA, h)), cv2.COLOR_BGR2GRAY)
        if ant is not None:
            f = cv2.calcOpticalFlowFarneback(ant, g, None, 0.5, 3, 15, 3, 5, 1.2, 0)
            m = np.linalg.norm(f, axis=2)
            # media dos 10% que mais se movem: pega o elemento, nao o fundo parado
            mags.append(float(np.mean(np.sort(m, axis=None)[-m.size // 10:])))
        ant = g
    return np.array(mags), fps


def main(video, cenas_csv, saida):
    mag, fps = magnitudes(video)
    cenas = [(round(float(r["ini_s"]) * fps), round(float(r["fim_s"]) * fps)) for r in csv.DictReader(open(cenas_csv, encoding="utf-8"))]
    linhas = []
    for ci, (a, b) in enumerate(cenas, 1):
        m = mag[a + 1:b + 1].copy()  # ignora o quadro do corte
        andando = m > PARADO
        i = 0
        while i < len(m):
            if not andando[i]:
                i += 1
                continue
            j = i
            while j < len(m) and andando[j]:
                j += 1
            if j - i >= MIN_FRAMES:
                curva, erro = melhor_curva(m[i:j])
                linhas.append([ci, f"{(a + 1 + i) / fps:.2f}", j - i, f"{(j - i) / fps:.2f}", curva, f"{erro:.3f}", f"{m[i:j].max():.2f}"])
            i = j
    with open(saida, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["cena", "ini_s", "dur_frames", "dur_s", "curva", "erro", "pico_px"])
        w.writerows(linhas)

    dur = [(b - a + 1) / fps for a, b in cenas]
    boas = [l for l in linhas if float(l[5]) < 0.08]
    print(f"cenas {len(cenas)} | cena media {statistics.mean(dur):.2f}s mediana {statistics.median(dur):.2f}s")
    print(f"movimentos {len(linhas)} (ajuste bom {len(boas)}) | dur mediana {statistics.median([l[2] for l in boas] or [0])} frames")
    cont = {}
    for l in boas:
        cont[l[4]] = cont.get(l[4], 0) + 1
    print("curvas:", ", ".join(f"{k} {v}" for k, v in sorted(cont.items(), key=lambda kv: -kv[1])))


if __name__ == "__main__":
    # auto-checagem: uma curva sintetica power3.out tem que ser reconhecida
    vel = np.diff(1 - (1 - np.linspace(0, 1, 20)) ** 4)
    assert melhor_curva(vel)[0] == "power3.out", melhor_curva(vel)
    main(*sys.argv[1:4])
