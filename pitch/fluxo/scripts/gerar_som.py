"""Gera efeitos sonoros e música com ElevenLabs para a biblioteca `pitch/som/`.

Gasta créditos: só rodar depois do "sim" da pessoa (ed-som).
Uso:
  py gerar_som.py efeito "<prompt em inglês>" <categoria> <nome> [--dur 0.6] [--loop]
  py gerar_som.py musica "<prompt em inglês>" <nome> --ms 120000
Grava em pitch/som/<categoria>/<nome>.mp3 (música em som/musica/), nunca sobrescreve,
e um <nome>.json ao lado com o prompt e os parâmetros (para o índice da biblioteca).
"""
import json
import sys
from pathlib import Path

from elevenlabs_cliente import cliente, versao_livre

SOM = Path(__file__).resolve().parents[2] / "som"


def gravar(audio_iter, destino: Path, meta: dict):
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino = versao_livre(destino)
    dados = b"".join(audio_iter)  # junta antes de abrir: erro da API não deixa arquivo vazio
    assert dados, "ElevenLabs devolveu áudio vazio"
    destino.write_bytes(dados)
    destino.with_suffix(".json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
    print(destino)


def efeito(prompt, categoria, nome, dur=None, loop=False):
    meta = {"tipo": "efeito", "prompt": prompt, "model_id": "eleven_text_to_sound_v3",
            "duration_seconds": dur, "loop": loop, "prompt_influence": 0.5}
    audio = cliente().text_to_sound_effects.convert(
        text=prompt, model_id=meta["model_id"], duration_seconds=dur,
        prompt_influence=meta["prompt_influence"], loop=loop,
    )
    gravar(audio, SOM / categoria / f"{nome}.mp3", meta)


def musica(prompt, nome, ms):
    meta = {"tipo": "musica", "prompt": prompt, "model_id": "music_v2_5", "music_length_ms": ms}
    audio = cliente().music.compose(prompt=prompt, music_length_ms=ms, model_id=meta["model_id"])
    gravar(audio, SOM / "musica" / f"{nome}.mp3", meta)


if __name__ == "__main__":
    a = sys.argv[1:]
    opc = lambda k, conv: conv(a[a.index(k) + 1]) if k in a else None
    if a and a[0] == "efeito":
        efeito(a[1], a[2], a[3], dur=opc("--dur", float), loop="--loop" in a)
    elif a and a[0] == "musica":
        musica(a[1], a[2], opc("--ms", int) or 60000)
    else:
        print(__doc__)
