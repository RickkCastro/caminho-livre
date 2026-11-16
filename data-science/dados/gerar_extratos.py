"""
Gera os EXTRATOS usados no notebook a partir dos arquivos brutos oficiais.

Uso (a partir da pasta data-science/):
    python dados/baixar_dados.py      # 1) baixa os brutos para dados/brutos/
    python dados/gerar_extratos.py    # 2) gera os extratos em dados/

Este script faz apenas o RECORTE e a ANONIMIZAÇÃO. A limpeza (nulos, duplicatas,
datas, horários etc.) é feita passo a passo no notebook analise.ipynb, para ficar visível.

Recorte:
- SSP-SP: ocorrências na cidade de São Paulo (município da circunscrição = S.PAULO)
  com natureza apurada "ROUBO - OUTROS" ou "FURTO - OUTROS" (roubo/furto que não é de
  veículo, carga ou banco: é aqui que estão os crimes contra pedestres).
- SP156: solicitações do tema "Rua e bairro" (buraco, calçada, guia, drenagem etc.).

Anonimização:
- O número do boletim de ocorrência vira um código pseudônimo (hash), que só serve
  para achar registros duplicados.
- Logradouro, número e CEP são descartados.
- Latitude e longitude são arredondadas para 3 casas decimais (~100 metros).
"""

import argparse
import hashlib
from pathlib import Path

import pandas as pd

PASTA_DADOS = Path(__file__).resolve().parent

COLUNAS_SSP = [
    "ID_BO_PSEUDONIMO", "DATA_REGISTRO", "DATA_OCORRENCIA_BO", "HORA_OCORRENCIA_BO", "DESC_PERIODO",
    "DESCR_TIPOLOCAL", "DESCR_SUBTIPOLOCAL", "BAIRRO", "LATITUDE", "LONGITUDE",
    "NOME_DELEGACIA_CIRCUNCRIÇÃO", "RUBRICA", "DESCR_CONDUTA", "NATUREZA_APURADA",
]
COLUNAS_SP156 = [
    "Data de Abertura", "Data de Finalização", "Tema", "Assunto", "Serviço", "Status",
    "Latitude", "Longitude", "Prefeitura Operacional", "Distrito",
]


def pseudonimo(delegacia: str, numero: str, ano: str) -> str:
    """Código curto e irreversível na prática que identifica o BO sem mostrar o número."""
    return hashlib.sha256(f"{delegacia}|{numero}|{ano}".encode()).hexdigest()[:12]


def arredondar_coordenada(serie: pd.Series) -> pd.Series:
    """Arredonda para 3 casas (~100 m). Valores vazios ou inválidos ficam vazios."""
    numeros = pd.to_numeric(serie.str.replace(",", ".", regex=False), errors="coerce")
    return numeros.round(3).map(lambda v: "" if pd.isna(v) else f"{v:.3f}")


def extrair_ssp(arquivo: Path, funil: list) -> None:
    abas = ["JAN-JUN_2025", "JUL-DEZ_2025"]
    # keep_default_na=False mantém o texto "NULL" do arquivo original (tratado no notebook)
    df = pd.concat(
        [pd.read_excel(arquivo, sheet_name=aba, engine="calamine", dtype=str, keep_default_na=False) for aba in abas],
        ignore_index=True,
    )
    funil.append(("SSP", "1. linhas no arquivo original (estado de SP, 2025)", len(df)))

    df = df[df["NOME_MUNICIPIO_CIRCUNCRIÇÃO"] == "S.PAULO"]
    funil.append(("SSP", "2. ocorridas na cidade de São Paulo", len(df)))

    df = df[df["NATUREZA_APURADA"].isin(["ROUBO - OUTROS", "FURTO - OUTROS"])].copy()
    funil.append(("SSP", "3. natureza ROUBO - OUTROS ou FURTO - OUTROS (extrato)", len(df)))

    df["ID_BO_PSEUDONIMO"] = [
        pseudonimo(d, n, a) for d, n, a in zip(df["NOME_DELEGACIA"], df["NUM_BO"], df["ANO_BO"])
    ]
    df["LATITUDE"] = arredondar_coordenada(df["LATITUDE"])
    df["LONGITUDE"] = arredondar_coordenada(df["LONGITUDE"])

    saida = PASTA_DADOS / "ssp_roubos_furtos_capital_2025.csv.gz"
    df[COLUNAS_SSP].to_csv(saida, index=False, compression="gzip")
    print(f"Gerado {saida.name}: {len(df):,} linhas")


def extrair_sp156(arquivos: list, funil: list) -> None:
    partes = []
    for arquivo in arquivos:
        df = pd.read_csv(arquivo, sep=";", encoding="latin1", dtype=str, keep_default_na=False)
        vazias = (df == "").all(axis=1)
        funil.append(("SP156", f"{arquivo.name}: linhas no arquivo", len(df)))
        funil.append(("SP156", f"{arquivo.name}: linhas totalmente vazias (removidas)", int(vazias.sum())))
        partes.append(df[~vazias])
    df = pd.concat(partes, ignore_index=True)
    funil.append(("SP156", "1. solicitações de 2025 (sem linhas vazias)", len(df)))

    df = df[df["Tema"] == "Rua e bairro"].copy()
    funil.append(("SP156", "2. tema 'Rua e bairro' (extrato)", len(df)))

    df["Latitude"] = arredondar_coordenada(df["Latitude"])
    df["Longitude"] = arredondar_coordenada(df["Longitude"])

    saida = PASTA_DADOS / "sp156_rua_e_bairro_2025.csv.gz"
    df[COLUNAS_SP156].to_csv(saida, index=False, compression="gzip")
    print(f"Gerado {saida.name}: {len(df):,} linhas")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--brutos", type=Path, default=PASTA_DADOS / "brutos", help="pasta com os arquivos brutos")
    args = parser.parse_args()

    funil = []
    extrair_ssp(args.brutos / "SPDadosCriminais_2025.xlsx", funil)
    extrair_sp156([args.brutos / f"sp156_2025_{t}tri.csv" for t in (1, 2, 3, 4)], funil)

    pd.DataFrame(funil, columns=["base", "etapa", "linhas"]).to_csv(PASTA_DADOS / "funil_extracao.csv", index=False)
    print("Gerado funil_extracao.csv")
