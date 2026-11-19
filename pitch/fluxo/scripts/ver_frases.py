"""Mostra um palavras_*.json como frases com tempo (conferência rápida).
Uso: py ver_frases.py <palavras.json>
"""
import json
import sys

w = json.load(open(sys.argv[1], encoding="utf-8"))
linha, ini = [], None
for p in w:
    ini = p["inicio"] if ini is None else ini
    linha.append(p["texto"] if p["tipo"] == "word" else f"[{p['texto']}]")
    if p["texto"].endswith((".", "?", "!")):
        print(f"{ini:6.2f}-{p['fim']:6.2f}  {' '.join(linha)}")
        linha, ini = [], None
if linha:
    print(f"{ini:6.2f}-{w[-1]['fim']:6.2f}  {' '.join(linha)}")
