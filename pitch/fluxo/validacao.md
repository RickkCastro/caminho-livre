# Validações do fluxo

- 2026-11-18 · transcrição Scribe v3 (teste 25 s): tempos e pausas ok; números vêm em algarismos; errou '600' como '80'. Pessoa lê o roteiro à risca: usar o texto do roteiro com os tempos do Scribe.
- 2026-11-18 · primeiro render Remotion (c01–c02, 7,7 s, 720p): cores, Inter, câmera e sincronia aprovados pela pessoa. Rascunho 720p pela composição "Rascunho" (o --scale 0.6667 do CLI dá altura fracionária e falha; --width/--height corta o quadro).
- 2026-11-18 · ElevenLabs, conta gratuita: efeitos (eleven_text_to_sound_v3) funcionam; a Music API (music_v2_5) devolve 402 "paid_plan_required". Música do pitch feita com o modelo de efeitos em loop de 30 s (`--loop`), repetido até o fim. Licença de uso em vídeo público no plano gratuito: conferir nos termos da conta (ainda não confirmado).
- 2026-11-18 · níveis do primeiro som (ainda não ouvidos pela pessoa): pico dos efeitos por categoria em som_gravar.py (whoosh −22, pop/clique/ding/riser −24, impacto −20, interface −26 dBFS); música RMS −25 dBFS sem voz, −9 dB sob a voz, rampas 0,3 s.
