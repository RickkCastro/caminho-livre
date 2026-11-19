---
name: ed-preparar
description: "Prepara o material gravado: inventário da narração, das gravações de tela e dos prints, transcrição da narração pelo ElevenLabs com tempo por palavra, mapa de silêncios e ligação de cada frase ao bloco do roteiro. Use em /ed-preparar, após a ed-iniciar e depois de gravar a narração."
---

# ed-preparar

Transforma o bruto em algo que o Claude consegue ler: o inventário da mídia, a transcrição com tempo por palavra, os silêncios e cada frase ligada ao bloco do roteiro. Não corta nada (isso é da `ed-cortes`) e não decide cenas.

- **Lê:** estado (`projeto`, `roteiro`), `edicao\termos.txt`, o roteiro aprovado em `roteiro\`, os arquivos de `brutos\` e `assets\`.
- **Escreve:** blocos `midia` e `transcricao` no estado; `edicao\preparar\` com `inventario.md`, `narracao.wav` (o áudio de trabalho), `palavras.json` (por palavra, só para scripts), `frases.md` (por frase, é o que as etapas leem) e `silencios.json`.
- **Próximo passo:** `/ed-cortes`

Se a `ed-iniciar` não estiver `concluido`, pare e sugira terminá-la.

## Ofício
### Inventário (ffprobe em cada arquivo)
- Narração (áudio, ou o áudio de um vídeo): duração, taxa de amostragem, canais, nível médio e de pico. **A narração é a referência de tempo do projeto**: todos os tempos ficam no tempo do arquivo de narração.
- Narração em vários arquivos (gravada por bloco): ordenar pelo nome ou pela data de gravação, mostrar a ordem e confirmar. Cada palavra guarda o arquivo de origem e o tempo dentro dele.
- Gravações de tela: duração, resolução, fps e **se a taxa é variável (VFR)**, comum em gravação de celular e de tela. VFR anda fora de compasso no Remotion: anotar e, na `ed-assets`, converter para 30 fps constantes (cópia nova, nunca o original).
- Prints e logo: resolução e formato. Avisar print pequeno demais para 1080p (largura < ~900 px para tela cheia de celular).
- Alertas: arquivo ilegível, narração clipando (pico em 0 dBFS), ruído alto de fundo, gravação de tela sem a tela do app.

### Transcrição (ElevenLabs Scribe)
- Áudio de trabalho: a narração extraída em WAV mono (44,1 kHz ou a taxa original; não reamostrar à toa), num arquivo só por arquivo de narração.
- Chamar o Speech-to-Text do ElevenLabs (`scribe_v3`, verificado em 2026-11-17; limite 5 GB / 10 h) pelo `transcrever_scribe.py`: português, **tempo por palavra**, eventos de áudio marcados, termos de `termos.txt` como keyterms. Não usar `no_verbatim` (ele apagaria as hesitações que a `ed-cortes` precisa ver).
- A chave vem de `.env.local` pelo SDK. Nunca pedir, digitar ou mostrar a chave. Chave falhando (401): rodar `onboard check` na raiz do repo e, se preciso, `onboard init`.
- Guardar a resposta crua (`edicao\preparar\scribe_raw_<arquivo>.json`) para não pagar de novo.
- **Conferir o que foi engolido:** procurar trechos com energia de áudio e sem palavra (> 0,7 s). Retranscrever só esses trechos e avisar a `ed-cortes`. Frase repetida (o take refeito) precisa aparecer duas vezes: se o roteiro tem uma frase e o áudio é bem mais longo que o texto, desconfiar.
- Hesitações ("ééé", "hum"), recomeços e eventos ficam marcados como tais. Não limpar: quem decide é a `ed-cortes`.
- O roteiro serve só para conferir a grafia. Nunca trocar o que foi falado pelo texto do roteiro.

### Silêncios e roteiro
- Silêncios: trechos sem fala acima de ~0,3 s, pelos tempos das palavras, com o `silencedetect` do FFmpeg de apoio. Só mapear.
- Ligar cada frase falada ao bloco e à frase do roteiro (por semelhança de texto). Frase do roteiro sem fala correspondente: avisar ("o bloco 4 não foi gravado?"). Fala fora do roteiro: marcar, sem julgar.

### Saída para ler
`frases.md`: uma linha por frase com id (`f001`), arquivo, início–fim, bloco do roteiro, texto; hesitações entre colchetes; pausas ≥ 0,5 s marcadas na linha seguinte. É isso que as etapas leem; `palavras.json` é só para scripts.

## Perfil
Nada desta etapa depende de gosto.

## Scripts
| Script | O que faz | Armadilhas |
|---|---|---|
| `fluxo\scripts\inventario.py` (**pronto**) | `py inventario.py <pasta>`: ffprobe em `brutos\` e `assets\`, níveis (pico, média, LUFS), VFR; grava `inventario.md` e o bloco `midia`. Para conferir estouro de verdade: `astats` com `Flat_factor` (0 = não achatou) | Detectar VFR comparando `r_frame_rate` com `avg_frame_rate` (e contando frames se preciso); ler a data de gravação do metadado, com o nome como reserva |
| `fluxo\scripts\transcrever_scribe.py` (**pronto**) | `py transcrever_scribe.py <audio> <pasta_saida> --termos edicao\termos.txt`: Scribe v3, português, tempo por palavra, eventos de áudio, keyterms (até 100). Grava `scribe_raw_<nome>.json` e `palavras_<nome>.json`. `--teste` roda a autochecagem sem API | Já trata: chave por `.env.local`, não reenvia se a resposta crua existe (sem custo), descarta `spacing`. Juntar os `palavras_*.json` de vários arquivos é da `frases.py` |
| `fluxo\scripts\frases.py` (**pronto**) | `py frases.py <pasta> <roteiro.md> [--texto-roteiro]`: alinha palavra a palavra com o roteiro (frases = frases do roteiro), mapeia silêncios e lacunas com voz sem palavra; grava `frases.md`, `frases.json`, `silencios.json` e o bloco `transcricao`. Com `--texto-roteiro` mostra o texto do roteiro (a pessoa lê à risca; o Scribe erra números e nomes) e guarda o falado em `falado`. `--teste` sem arquivos. `ver_frases.py <palavras.json>` mostra o transcrito cru | Quebrar frase na pontuação ou em pausa ≥ 0,6 s; achar trechos com energia e sem palavra (RMS do WAV) |

Na primeira vez que a etapa rodar num vídeo, escreva os scripts que faltam em `C:\Github\caminho-livre\pitch\fluxo\scripts\`, teste e anote aqui o uso. Nos próximos vídeos, reaproveite.

## Passo a passo
1. Status e pendências (`ver.py <pasta> status`). Etapa `em_andamento`.
2. Inventário. Mostrar alertas e a ordem da narração; esperar confirmação se houver mais de um arquivo.
3. Extrair o WAV de trabalho e transcrever. **Primeira vez de todas:** transcrever antes só 20–30 s, mostrar as frases com tempos e conferir com a pessoa (grafia dos termos, tempos batendo ao ouvir), anotar em `validacao.md`, e só então transcrever tudo.
4. Conferir trechos engolidos; retranscrever o que precisar.
5. Silêncios, ligação com o roteiro, `frases.md`.
6. Etapa `concluido` (esta etapa não tem revisão assistindo).

## Resumo no chat
Curto: duração da narração, quantas frases, quantas hesitações e repetições achadas, blocos do roteiro sem fala, alertas (VFR, nível, ruído) e o que a `ed-assets` vai precisar converter.

## Revisão
Se a pessoa corrigir uma palavra ou um nome, corrigir em `palavras.json` e `frases.md` e acrescentar o termo a `termos.txt`. Anotar no caderno os termos que valem para outros vídeos.

## Aprovação
Marcar `concluido`, dizer quantos aprendizados ficaram anotados e sugerir `/clear` e `/editar`.

## Regras comuns
Antes de começar, leia `C:\Github\caminho-livre\.claude\skills\editar\regras-comuns.md` (uma vez por sessão).

## Regras
- Nunca mover, renomear ou apagar arquivos do projeto. Conversões são cópias novas em `edicao\`.
- Nunca pedir, digitar ou mostrar a chave do ElevenLabs.
- Falar em português, de forma curta.
