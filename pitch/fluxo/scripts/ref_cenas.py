"""Separa as cenas de um video de referencia e gera folhas de contato.

Uso: py ref_cenas.py <video.mp4> <pasta_saida>
Gera: cenas.csv (inicio, fim, duracao em s e frames) e folha_NN.png
(cada linha = uma cena: inicio, 1/4, meio, 3/4, fim), 8 cenas por folha.
"""
import csv
import sys
from pathlib import Path

import cv2
import numpy as np
from scenedetect import ContentDetector, detect

LARG = 256  # largura de cada miniatura
POR_FOLHA = 8


def quadro(cap, n):
    cap.set(cv2.CAP_PROP_POS_FRAMES, n)
    ok, img = cap.read()
    if not ok:
        return None
    h = int(img.shape[0] * LARG / img.shape[1])
    return cv2.resize(img, (LARG, h))


def rotular(img, texto):
    cv2.rectangle(img, (0, 0), (LARG, 18), (0, 0, 0), -1)
    cv2.putText(img, texto, (4, 13), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (255, 255, 255), 1, cv2.LINE_AA)
    return img


def main(video, saida):
    saida = Path(saida)
    saida.mkdir(parents=True, exist_ok=True)
    cenas = detect(str(video), ContentDetector(threshold=27))
    cap = cv2.VideoCapture(str(video))
    fps = cap.get(cv2.CAP_PROP_FPS)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if not cenas:  # video sem corte: uma cena so
        cenas = [(None, None)]
    lim = []
    for a, b in cenas:
        ini = a.get_frames() if a else 0
        fim = (b.get_frames() if b else total) - 1
        lim.append((ini, fim))

    with open(saida / "cenas.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["cena", "ini_s", "fim_s", "dur_s", "dur_frames"])
        for i, (ini, fim) in enumerate(lim, 1):
            w.writerow([i, f"{ini / fps:.2f}", f"{fim / fps:.2f}", f"{(fim - ini + 1) / fps:.2f}", fim - ini + 1])

    linhas = []
    for i, (ini, fim) in enumerate(lim, 1):
        # um pouco para dentro das bordas: o quadro exato do corte costuma ser borrado
        pontos = np.linspace(min(ini + 1, fim), max(fim - 1, ini), 5).astype(int)
        mini = []
        for p in pontos:
            img = quadro(cap, int(p))
            if img is None:
                img = np.zeros((144, LARG, 3), np.uint8)
            mini.append(rotular(img, f"c{i} {p / fps:.2f}s f{p}"))
        linhas.append(np.hstack(mini))
    cap.release()

    for k in range(0, len(linhas), POR_FOLHA):
        cv2.imwrite(str(saida / f"folha_{k // POR_FOLHA + 1:02d}.png"), np.vstack(linhas[k:k + POR_FOLHA]))
    print(f"{Path(video).name}: {len(lim)} cenas, fps {fps:.3f}, folhas {(len(linhas) - 1) // POR_FOLHA + 1}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
