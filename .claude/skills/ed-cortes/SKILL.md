---
name: ed-cortes
description: "Limpa a narração: escolhe os takes, tira erros, recomeços, hesitações e pausas longas, e entrega a narração limpa em áudio para ouvir. Use em /ed-cortes, após a ed-preparar."
---

# ed-cortes

Entrega a narração limpa: takes escolhidos, erros e pausas fora, ritmo apertado. É a base de tempo de todo o vídeo: as cenas, os efeitos e a música se alinham a ela. Sem animação, sem efeito, sem tratamento de voz (nível final e música são da `ed-som`).

- **Lê:** `edicao\preparar\frases.md`, bloco `transcricao` (silêncios, trechos engolidos), o roteiro aprovado, `fluxo\perfil\estilo-cortes.md`.
- **Escreve:** bloco `cortes` (`versao`, `segmentos`, `marcas`); `edicao\cortes\lista_vNN.md`; entrega em `renders\<projeto>_narracao_vNN.wav` (e `.mp3` para ouvir no celular) com `renders\<projeto>_narracao_vNN_marcas.md`.
- **Próximo passo:** `/ed-mapa`

Se a `ed-preparar` não estiver `concluido`, pare e sugira terminá-la.

## Ofício
### Como decidir
- **Ler por frase, decidir por frase.** `frases.md` é o que se lê; `palavras.json` só por script, num trecho específico.
- **Identificar os takes:** frases repetidas ou parecidas, recomeços, frases abandonadas, "pera", "de novo". Com roteiro, cada frase do roteiro costuma ter um ou mais takes: a ligação feita na `ed-preparar` ajuda a agrupar.
- **Escolher o take, nesta ordem:** (1) o que a pessoa pediu; (2) o último take completo; (3) se o último tropeçou e um anterior está limpo, o anterior.
- Antes de descartar uma frase como incompleta, procurar outro take que a transcrição tenha perdido (trechos engolidos).
- O Claude escolhe pelo texto, não pela entonação. Com dois takes bons e escolha difícil, escolher um e **marcar** o outro.
- Cortar entre ideias e takes, nunca no meio da frase.
- **Ordem:** a do roteiro aprovado. Fala fora do roteiro: manter e marcar ("isso não está no roteiro: fica?").
- **Na dúvida, não corta e marca.**

### Pausas e hesitações (do perfil)
- Ar entre frases e hesitações: seguir `estilo-cortes.md` (hoje: ~0,15 s, cortar todas as hesitações).
- Hesitação isolada por silêncio: corta.
- Hesitação colada na fala: corta só se o script achar uma borda limpa pela energia do áudio dos dois lados; senão, mantém e marca. Quem julga é a pessoa ao ouvir.
- Respiração: as longas e altas saem; as curtas no começo de frase podem ficar (soam naturais). Na dúvida, reduzir o volume dela em vez de cortar.
- Entre blocos do roteiro, um pouco mais de ar que entre frases (~0,3–0,4 s): é onde as cenas trocam.

### Bordas (trabalho de script)
- O Claude dá o início e o fim aproximados nas palavras de borda. O script ajusta cada borda pela **energia do áudio** (não só pelo tempo da palavra), aplica uma folga de ~0,08–0,1 s para não comer sílaba e arredonda para frames de 30 fps.
- Em cada junção, crossfade curto (~10–20 ms) para não estalar.
- Muleta curta que a transcrição não escreveu aparece como energia colada na borda: mantém e marca. Não afirmar que é fala sem ouvir.

### Marcas (a pessoa revisa ouvindo)
Lista em `_marcas.md`, com o tempo **na narração limpa** (mm:ss) e o id do segmento: **dúvida de take** (onde está o outro), **hesitação** mantida, **fora do roteiro**, **sugestão** (ex.: reordenar), **alerta** técnico (trecho com transcrição ruim, ruído). Texto curto.

## Perfil
- `estilo-cortes.md`: ar entre frases, o que fazer com hesitação e respiração, como a pessoa grava.

## Scripts
| Script | O que faz | Armadilhas |
|---|---|---|
| `scripts\cortes_bordas.py` | Recebe a lista de segmentos (arquivo, início, fim aproximados), ajusta as bordas pela energia, aplica folga e arredonda para frames | Nunca reajustar bordas que a pessoa já acertou à mão (flag por segmento); trabalhar no tempo do arquivo de origem |
| `scripts\cortes_render.py` | Monta a narração limpa com FFmpeg a partir dos segmentos, com crossfade em cada junção e o ar pedido entre eles; gera WAV e MP3 e converte as marcas para o tempo da narração limpa | Nunca sobrescrever versão; a conversão tempo limpo ↔ tempo de origem é uma função só, usada também na revisão |

Na primeira vez que a etapa rodar num vídeo, escreva os scripts que faltam em `C:\Github\caminho-livre\pitch\fluxo\scripts\`, teste e anote aqui o uso. Nos próximos vídeos, reaproveite.

## Passo a passo
1. Status e pendências. Etapa `em_andamento`.
2. Ler `frases.md` inteiro e decidir os segmentos (ids `s001`…), com o motivo de cada descarte em uma palavra (take, erro, hesitação, pausa).
3. Ajustar bordas e gravar o bloco `cortes` com `versao` 1 e `lista_v01.md`.
4. Gerar a narração limpa. **Primeira vez de todas:** gerar antes só os primeiros ~30 s, a pessoa ouve e confere (junções sem estalo, sílabas inteiras, ar certo), anotar em `validacao.md`, e só então gerar tudo.
5. Etapa `aguardando_aprovacao`.

## Resumo no chat
Curto: duração bruta → limpa, quantos takes descartados, quantas marcas e de que tipo, o que é realmente importante, e o caminho do MP3 para ouvir.

## Revisão
- A pessoa cita o tempo da narração limpa ("em 0:42 cortou a palavra") ou o id ("s014 usa o outro take"). Converter o tempo para o segmento pela função de conversão, nunca de cabeça.
- Ajustar só o citado, gerar versão nova (`versao` +1, `_v02`). Se o ajuste da pessoa contradiz algo que o Claude afirmou, reconhecer.
- Anotar no caderno o que vale para outros vídeos (ex.: "ar maior entre blocos", "não corta respiração").

## Aprovação
- Depois de aprovado, **o corte trava**. Se mudar depois da `ed-mapa` ou da `ed-animar`, avisar que as cenas precisam ser recalculadas (o `ver.py status` mostra o alerta).
- Marcar `concluido`, dizer quantos aprendizados ficaram anotados e sugerir `/clear` e `/editar`.

## Regras comuns
Antes de começar, leia `C:\Github\caminho-livre\.claude\skills\editar\regras-comuns.md` (uma vez por sessão).

## Regras
- Nunca mover, renomear ou apagar arquivos do projeto. Nenhum corte é destrutivo: os segmentos apontam para o arquivo original.
- Nunca trocar o que foi falado pelo texto do roteiro.
- Falar em português, de forma curta.
