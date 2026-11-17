"""
Baixa os arquivos ORIGINAIS (brutos) usados na análise, direto das fontes oficiais.

Uso (a partir da pasta data-science/):
    python dados/baixar_dados.py

Os arquivos vão para dados/brutos/ (pasta ignorada pelo git, porque são grandes:
~680 MB no total). Depois, rode  python dados/gerar_extratos.py  para gerar os
extratos tratados que o notebook usa.

Fontes:
- SSP-SP, "Consultas - Base de Dados > SP Dados - Dados criminais 2025"
  https://www.ssp.sp.gov.br/estatistica/consultas
- Prefeitura de São Paulo, Portal de Dados Abertos, "Dados do SP156 - Solicitações"
  https://dados.prefeitura.sp.gov.br/dataset/dados-do-sp156
"""

import time
import urllib.request
from pathlib import Path

PASTA_BRUTOS = Path(__file__).resolve().parent / "brutos"

SP156 = "https://dados.prefeitura.sp.gov.br/dataset/0aecfa2b-aa3a-40d4-8183-0d4351b7fd0a/resource"

# nome do arquivo local -> endereço oficial
ARQUIVOS = {
    "SPDadosCriminais_2025.xlsx":
        "https://www.ssp.sp.gov.br/assets/estatistica/transparencia/spDados/SPDadosCriminais_2025.xlsx",
    "sp156_2025_1tri.csv": f"{SP156}/7c5aeb58-2cad-40ba-9e9e-af1c17cc5070/download/arquivo-final-1-trim-25.csv",
    "sp156_2025_2tri.csv": f"{SP156}/f5df7f4a-d614-4f85-b4a0-263ec9370cd9/download/arquivo-final-2-trim-25.csv",
    "sp156_2025_3tri.csv": f"{SP156}/3b1d2648-d586-40c8-819c-24fbb8005343/download/arquivo-final-3-trim-25.csv",
    "sp156_2025_4tri.csv": f"{SP156}/d3a98097-8128-45d4-b8fe-21874b81c971/download/arquivo-final-4-trim-25.csv",
    "sp156_dicionario.txt": f"{SP156}/e5c102e2-f27a-4e0a-ae99-5948abecff0e/download/dicionario-dados-abertos-sp156-2020-em-diante.txt",
}


def baixar(url: str, destino: Path, tentativas: int = 5) -> None:
    """Baixa um arquivo, tentando de novo se a conexão cair (o site da SSP às vezes derruba)."""
    for tentativa in range(1, tentativas + 1):
        try:
            print(f"Baixando {destino.name} (tentativa {tentativa})...")
            requisicao = urllib.request.Request(url, headers={"User-Agent": "caminho-livre-data-science"})
            with urllib.request.urlopen(requisicao, timeout=120) as resposta, open(destino, "wb") as saida:
                while bloco := resposta.read(1024 * 1024):
                    saida.write(bloco)
            print(f"  ok: {destino.stat().st_size / 1e6:.1f} MB")
            return
        except OSError as erro:
            print(f"  falhou ({erro}); tentando de novo em 15 s")
            time.sleep(15)
    raise RuntimeError(f"Não foi possível baixar {url}")


if __name__ == "__main__":
    PASTA_BRUTOS.mkdir(exist_ok=True)
    for nome, url in ARQUIVOS.items():
        destino = PASTA_BRUTOS / nome
        if destino.exists():
            print(f"{nome} já existe, pulando.")
            continue
        baixar(url, destino)
    print("Pronto. Agora rode: python dados/gerar_extratos.py")
