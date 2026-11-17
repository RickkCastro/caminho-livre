"""
Monta o ZIP de entrega do Teams: notebook executado, TXT com nomes e RMs e as bases em CSV (com a fonte).

Uso (a partir da pasta data-science/):
    python gerar_zip_entrega.py

Gera entrega/GS2026-2_DataScience_OctoFlow_CaminhoLivre.zip (a pasta entrega/ é ignorada pelo git).
Dentro do ZIP, as bases vão como CSV comum (descompactado), que abre direto no Excel, e o notebook
roda a partir da pasta descompactada.
"""

import gzip
import zipfile
from pathlib import Path

PASTA = Path(__file__).resolve().parent
SAIDA = PASTA / "entrega" / "GS2026-2_DataScience_OctoFlow_CaminhoLivre.zip"

ARQUIVOS = [
    "analise.ipynb",            # notebook executado
    "integrantes.txt",          # nomes e RMs
    "dados/README.md",          # fontes das bases e o que foi feito em cada uma
    "dados/funil_extracao.csv",
    "conclusao.md",
    "requirements.txt",
]
BASES = ["dados/ssp_roubos_furtos_capital_2025.csv.gz", "dados/sp156_rua_e_bairro_2025.csv.gz"]

if __name__ == "__main__":
    SAIDA.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(SAIDA, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zip_entrega:
        for nome in ARQUIVOS:
            zip_entrega.write(PASTA / nome, nome)
        for nome in BASES:
            # descompacta o .csv.gz e grava como .csv dentro do ZIP
            with gzip.open(PASTA / nome, "rb") as base:
                zip_entrega.writestr(nome.removesuffix(".gz"), base.read())
        for grafico in sorted((PASTA / "graficos").glob("*.png")):
            zip_entrega.write(grafico, f"graficos/{grafico.name}")
        conteudo = zip_entrega.namelist()

    print(f"Gerado {SAIDA.relative_to(PASTA)} ({SAIDA.stat().st_size / 1e6:.1f} MB) com {len(conteudo)} arquivos:")
    for nome in conteudo:
        print("  -", nome)
