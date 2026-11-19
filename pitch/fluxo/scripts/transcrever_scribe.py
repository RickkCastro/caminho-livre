"""Transcreve a narração com ElevenLabs Scribe v3 (tempo por palavra).

Uso: py transcrever_scribe.py <audio> <pasta_saida> [--termos termos.txt]
Gera: scribe_raw_<nome>.json (resposta crua; se já existe, NÃO chama a API de novo)
      palavras_<nome>.json (lista: texto, inicio, fim, tipo = word | audio_event)
Teste sem API: py transcrever_scribe.py --teste
"""
import json
import sys
from pathlib import Path


def termos_validos(linhas):
    """Keyterms do Scribe: até 100, cada um com até 50 caracteres e até 5 palavras."""
    out = []
    for t in (l.strip() for l in linhas):
        if t and len(t) <= 50 and len(t.split()) <= 5 and t not in out:
            out.append(t)
    return out[:100]


def para_palavras(raw, arquivo):
    """Resposta do Scribe -> palavras e eventos (descarta 'spacing')."""
    return [
        {"texto": w["text"], "inicio": w["start"], "fim": w["end"], "tipo": w["type"], "arquivo": arquivo}
        for w in raw.get("words", [])
        if w.get("type") in ("word", "audio_event")
    ]


def transcrever(audio, saida, termos_txt=None):
    audio, saida = Path(audio), Path(saida)
    saida.mkdir(parents=True, exist_ok=True)
    cru = saida / f"scribe_raw_{audio.stem}.json"
    if cru.exists():
        print(f"resposta crua já existe, sem custo: {cru.name}")
        raw = json.loads(cru.read_text(encoding="utf-8"))
    else:
        from elevenlabs_cliente import cliente

        termos = termos_validos(Path(termos_txt).read_text(encoding="utf-8").splitlines()) if termos_txt else []
        with open(audio, "rb") as f:
            r = cliente().speech_to_text.convert(
                file=f,
                model_id="scribe_v3",
                language_code="por",
                timestamps_granularity="word",
                tag_audio_events=True,
                keyterms=termos or None,
            )
        raw = r.model_dump() if hasattr(r, "model_dump") else r.dict()
        cru.write_text(json.dumps(raw, ensure_ascii=False, indent=1), encoding="utf-8")
    pal = para_palavras(raw, audio.name)
    (saida / f"palavras_{audio.stem}.json").write_text(json.dumps(pal, ensure_ascii=False, indent=1), encoding="utf-8")
    n = sum(p["tipo"] == "word" for p in pal)
    print(f"{audio.name}: {n} palavras, {len(pal) - n} eventos, idioma {raw.get('language_code')}")


def _teste():
    assert termos_validos(["Caminho Livre", "", "Caminho Livre", "x" * 51, "a b c d e f"]) == ["Caminho Livre"]
    raw = {"words": [
        {"text": "Olá", "start": 0.0, "end": 0.3, "type": "word"},
        {"text": " ", "start": 0.3, "end": 0.32, "type": "spacing"},
        {"text": "(risos)", "start": 0.4, "end": 0.9, "type": "audio_event"},
    ]}
    p = para_palavras(raw, "n.wav")
    assert [x["tipo"] for x in p] == ["word", "audio_event"] and p[0]["fim"] == 0.3
    print("ok")


if __name__ == "__main__":
    if sys.argv[1:] == ["--teste"]:
        _teste()
    else:
        a = sys.argv[1:]
        termos = a[a.index("--termos") + 1] if "--termos" in a else None
        transcrever(a[0], a[1], termos)
