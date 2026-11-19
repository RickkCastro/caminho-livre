---
name: ed-som
description: "Coloca o som no vídeo animado: efeitos sonoros leves alinhados ao que se vê e música de fundo, gerados pelo ElevenLabs, com a música abaixando sob a voz, e renderiza a versão final em 1080p. Use em /ed-som, após a ed-animar."
---

# ed-som

O som entra por último, sobre a narração, as cenas e as trocas já travadas. Decide **onde** entra efeito, **qual** e **como se empilha**, encaixa a música e gera a **versão final** em 1080p. Efeitos e música são gerados pelo ElevenLabs e guardados na biblioteca para os próximos vídeos.

- **Lê:** bloco `animacao` (eventos anotados no render), bloco `mapa` (cenas, trocas, batidas, gancho e fechamento), a narração limpa, `fluxo\perfil\estilo-som.md`, a biblioteca em `C:\Github\caminho-livre\pitch\som\` (com `indice.json`).
- **Escreve:** bloco `som` (`efeitos` com ids `sfx01`…, `musica`, níveis); sons usados copiados para `edicao\remotion\public\sons\`; entrega em `renders\<projeto>_final_vNN.mp4` (1080p).
- **Próximo passo:** fim do fluxo. Sugerir `/editar aprendizados`.

Se a `ed-animar` não estiver `concluido`, pare e sugira terminá-la.

## Ofício
Tudo aqui é tendência; sincronia, nível e não repetir podem ser firmes. Densidade, peso e sons preferidos são do perfil.

### 1. Eventos
Um script junta, no tempo do vídeo, tudo o que acontece: trocas de cena (com o tipo: forma varrendo, whip, corte seco), entradas e gatilhos, batidas do storyboard e os **eventos anotados no render** (os mais precisos). Cada evento ganha um id estável e a palavra dita naquele instante. O script também mede a **loudness da narração** (LUFS), base dos níveis. O Claude lê essa lista, sem abrir quadros nem código.

### 2. Princípios
1. **O som segue o que se vê.** Evento visível pede som; o resto, não. Deriva lenta e movimento secundário não pedem som.
2. **Um protagonista por momento,** no máximo 3 camadas (principal, grave só nos momentos fortes, apoio/doce), cada uma numa faixa diferente.
3. **Antecipação e resolução:** riser termina no evento e corta seco; respiro de ~0,5 s sem outros sons antes de um impacto. Às vezes o melhor som é nenhum.
4. **Escalada:** o maior momento sonoro é o ápice do gancho ou a revelação da solução. No resto, nada maior.
5. **Densidade do perfil:** efeitos leves, só para pontuar (whoosh nas trocas, pop/clique em textos e botões, riser antes do momento principal). Variar a intensidade; não pôr whoosh em toda troca.
6. **Sincronia:** whoosh com o **pico** no frame da troca ou da chegada (quando o elemento freia); pop, clique e ding começam no evento; impacto com o transiente no frame. Um som pode vir 1 frame adiantado.
7. **O som combina com o movimento e o material:** forma grande e lenta = whoosh grave e longo; card pequeno = pop curto e agudo; cursor = clique; check = ding; mapa/rota = som suave de interface.
8. **Variação:** não repetir o mesmo arquivo em ~20 s; gerar variações.
9. **Nível:** efeito bem abaixo da voz. O script nivela cada som pela loudness da narração com alvo por categoria e teto de pico (números em `estilo-som.md`, calibrados no primeiro vídeo).

### 3. Biblioteca e geração (ElevenLabs)
- Biblioteca em `pitch\som\<categoria>\` (whoosh, pop, clique, riser, impacto, interface, ding, musica) com `indice.json`: duração útil, **tempo até o pico**, forma (ataque seco, crescendo), brilho, prompt usado, favorito.
- **Primeiro a biblioteca;** gerar só o que falta. Ao gerar: prompt em inglês, curto e concreto ("soft airy whoosh, 0.6s, modern UI"), duração pedida, 2–3 variações. Analisar (pico, duração), indexar, mostrar.
- **Antes de gerar:** listar o que vai gerar (quantos efeitos, a música e a duração) e esperar o "sim": gerar gasta créditos da conta.
- Pelo SDK, com `fluxo\scripts\gerar_som.py` (**pronto**): `efeito "<prompt>" <categoria> <nome> [--dur s] [--loop]` usa `eleven_text_to_sound_v3` (0,5–30 s); `musica "<prompt>" <nome> --ms <duração>` usa `music_v2_5` (3 s a 10 min; prompt sem citar artista ou letra protegida). Grava em `pitch\som\<categoria>\`, nunca sobrescreve, e um `.json` com o prompt ao lado. A chave vem de `.env.local`, nunca pedida nem mostrada.
- Licença: conferir, na primeira vez, se o plano da conta permite usar efeitos e música gerados em vídeo público; anotar em `validacao.md`.

### 4. Música
- Um prompt a partir do briefing e do perfil (ex.: "uplifting minimal corporate, light piano and soft synth pads, 100 bpm, no vocals"), com a duração do vídeo (ou um loop que feche no fim). Mostrar 2 opções curtas antes de gerar a longa, se o MCP permitir.
- **Abaixamento sob a voz:** a música fica baixa enquanto a narração fala e sobe um pouco nos respiros e na cauda; transições de ~0,3 s, nunca degraus. Calculado pela atividade da narração (dos tempos das palavras), não à mão.
- Começo: entra junto do gancho (ou meio segundo antes). Fim: a música termina **com** o vídeo (fade de 1–2 s na cauda do logo), sem cortar no meio de uma frase musical.
- Nunca mais alta que a voz.

### 5. Mixagem e render final
- No Remotion: cada efeito como `<Audio>` na `<Sequence>` do seu frame, com volume em dB convertido; a música com volume por frame (o abaixamento).
- Alvo do master: ~−16 LUFS integrado, pico real ≤ −1 dBTP (bom para apresentação e YouTube). Medir o render com o `ebur128` do FFmpeg; se fugir mais de 1 LU, ajustar o ganho geral e renderizar de novo.
- **Primeira vez de todas:** render de teste de ~15 s (um trecho com troca de cena e voz), a pessoa ouve e confere nível de efeito e música, anotar os números em `estilo-som.md` e `validacao.md`, e só então o vídeo inteiro.
- Final em 1080p, 30 fps, H.264 + AAC. Conferir com ffprobe e ouvir o início, uma troca e o fim.

## Perfil
- `estilo-som.md`: densidade, peso, sons preferidos, níveis por categoria, estilo de música.

## Scripts
| Script | O que faz | Armadilhas |
|---|---|---|
| `scripts\som_eventos.py` | Junta os eventos dos blocos `animacao` e `mapa` no tempo do vídeo, com ids estáveis e a palavra do instante; mede a loudness da narração | Id estável entre rodadas se o evento não mudou; marcar evento que mudou desde a última gravação |
| `scripts\som_indexar.py` | Mede cada som da biblioteca (início útil, pico, duração, forma, brilho) e atualiza `indice.json` | Pular o silêncio do começo; não reindexar o que não mudou |
| `scripts\som_gravar.py` | Do rascunho do Claude (evento, camada, som, alinhamento) calcula frame de início, nível em dB e grava o bloco `som` e os dados do Remotion; gera a curva de abaixamento da música | Avisar som não achado, repetido em < 20 s, evento sem principal, dois principais colados; alinhamento pelo **pico** no whoosh |

**Uso (pronto, testado no pitch):**
- `py pitch\fluxo\scripts\som_indexar.py` mede a biblioteca e atualiza `som\indice.json` (teste: `--teste`).
- Rascunho do Claude em `edicao\som_rascunho.json` (`efeitos`: evento, som, camada, alinha `pico|inicio|fim`; `musica`: som). No pitch saiu dos eventos de `edicao\remotion\eventos.json` com regras por tipo e enxugado (entre dois principais a < 12 f fica o mais importante); `som_eventos.py` não foi preciso.
- `py pitch\fluxo\scripts\som_gravar.py <pasta> edicao\som_rascunho.json` (teste: `--teste`) grava `src\som.json`, copia os sons para `public\sons\` e grava o bloco `som`.
- Composições: `Final` (tudo, 1080p), `Video` (só narração), `SoEfeitos` e `SoMusica` (640x360, sem narração; render com `--crf=40` para a qualidade mais baixa).
- **Conta gratuita do ElevenLabs não tem a Music API** (402 paid_plan_required): música = `gerar_som.py efeito "...music loop..." musica <nome> --dur 30 --loop`, repetida em loop.

Na primeira vez que a etapa rodar num vídeo, escreva os scripts que faltam em `C:\Github\caminho-livre\pitch\fluxo\scripts\`, teste e anote aqui o uso. Nos próximos vídeos, reaproveite.

## Passo a passo
1. Status e pendências. Etapa `em_andamento`.
2. Gerar a lista de eventos e a loudness da narração.
3. Rascunho dos efeitos (evento, camada, papel do som) e da música (prompt, duração).
4. Ver o que a biblioteca já tem; listar o que falta gerar e esperar o "sim". Gerar, indexar.
5. Gravar (`som_gravar.py`), resolver os avisos.
6. Teste de 15 s na primeira vez; depois o render final 1080p em segundo plano; medir loudness.
7. Etapa `aguardando_aprovacao`.

## Resumo no chat
Curto: quantos efeitos e de que tipo, a música (prompt e duração), o que foi gerado agora e quanto foi para a biblioteca, a loudness medida, e o caminho do MP4 final.

## Revisão
- Por número: "sfx12 mais baixo" (−3 dB), "sfx05 tira", "troca o sfx07" (outro som do mesmo papel), "sfx03 um frame antes". Por tempo: converter para o evento.
- Música: "mais baixa", "mais animada" (novo prompt, versão nova), "entra depois".
- Ajustar só o citado e renderizar versão nova (agrupando pedidos). Diferença de nível pedida mais de uma vez vira aprendizado para o perfil.

## Aprovação
Marcar `concluido`. Propor os sons que ficaram bons como favoritos na biblioteca. Dizer quantos aprendizados ficaram anotados e sugerir `/editar aprendizados` para aplicá-los antes do próximo vídeo.

## Regras comuns
Antes de começar, leia `C:\Github\caminho-livre\.claude\skills\editar\regras-comuns.md` (uma vez por sessão).

## Regras
- Nunca gerar som ou música sem mostrar a lista e receber o "sim" (gasta créditos).
- Nunca pedir, digitar ou mostrar a chave do ElevenLabs.
- Nunca mover, renomear ou apagar arquivos do projeto.
- Falar em português, de forma curta.
