"""Cliente ElevenLabs do fluxo do pitch.

A chave fica em `caminho-livre/.env.local` (gravada pelo `npx @elevenlabs/cli onboard`).
O SDK lê ELEVENLABS_API_KEY do ambiente; aqui só carregamos o arquivo. Nunca imprimir a chave.
"""
import os
from pathlib import Path

from dotenv import load_dotenv
from elevenlabs import ElevenLabs

RAIZ_REPO = Path(__file__).resolve().parents[3]  # pitch/fluxo/scripts -> caminho-livre


def cliente() -> ElevenLabs:
    load_dotenv(RAIZ_REPO / ".env.local")
    # O padrão de api_key do SDK é lido no import (antes do load_dotenv): passar do ambiente agora.
    return ElevenLabs(api_key=os.environ["ELEVENLABS_API_KEY"])


def versao_livre(caminho: Path) -> Path:
    """Nunca sobrescrever: arquivo.mp3 existe -> arquivo_v02.mp3, _v03..."""
    if not caminho.exists():
        return caminho
    n = 2
    while (novo := caminho.with_name(f"{caminho.stem}_v{n:02d}{caminho.suffix}")).exists():
        n += 1
    return novo
