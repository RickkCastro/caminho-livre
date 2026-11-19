# Montagem do fluxo de edição

Fase atual: 6 (teste num clipe curto) · Atualizado em 2026-11-17

## Ambiente
- Sistema: Windows 11 Pro · Python: 3.14 (usar `py`, o `python` é atalho da Store) · FFmpeg: build 2026-06 (C:\ffmpeg\bin) · Node.js: 24.15 · Git: ok · GPU: NVIDIA RTX 4060 8 GB
- Plugin Remotion já instalado no Claude Code
- Instalado nesta montagem: yt-dlp, opencv-python, scenedetect (pip --user, Python 3.14). Rodar scripts com `py` SEM `-I` (o -I esconde os pacotes --user)
- ElevenLabs (2026-11-17): conta conectada por `npx @elevenlabs/cli onboard`; chave (final 3b96) em `caminho-livre\.env.local`, ignorada pelo git; SDK Python `elevenlabs` 2.79 + `python-dotenv` (pip --user). Scripts prontos: `elevenlabs_cliente.py`, `transcrever_scribe.py` (scribe_v3), `gerar_som.py` (SFX v3 / music_v2_5). Sem MCP: o SDK substitui. `fluxo\requirements.txt` lista os pacotes
- Scripts: `scripts\ref_cenas.py` (cenas + folhas de contato), `scripts\ref_medir.py` (ritmo e curvas por fluxo óptico)

## Decisões
- Revisão: vídeo pronto (só assistindo, ajustes pelo chat)
- Tipo e formato: vídeo narrado (voz própria) sobre animações e boards em Remotion + gravações de tela e prints do app. 16:9 1080p 30 fps (a confirmar). Primeiro vídeo: pitch do Caminho Livre
- Pastas (mudado em 2026-11-17, pedido da pessoa: TUDO do vídeo em uma pasta `pitch`): `C:\Github\caminho-livre\pitch\` com `roteiro\`, `brutos\`, `assets\` (biblioteca fixa em `assets\biblioteca\`), `som\` (biblioteca de sons), `edicao\` (trabalho do Claude), `renders\` e `fluxo\` (scripts, perfil, remotion-base, montagem, validacao). `~/.edicao` foi esvaziado e removido. Só as skills ficam fora, em `.claude\skills\`. `pitch\.gitignore` ignora mídia (mp4/mov/wav/mp3…), node_modules, saídas do Remotion e respostas cruas do Scribe; texto, perfil e scripts são versionados
- Transcrição: ElevenLabs Scribe (nuvem, tempo por palavra, marca hesitações). Chave de API: a pessoa cria e coloca numa variável de ambiente ela mesma. Passar lista de termos (Caminho Livre, nomes do grupo, termos do app)
- Notas faladas: não usar
- Cortes: ritmo apertado (~0,15 s entre frases); corta todas as hesitações; na dúvida não corta e marca. Usa roteiro (escrito antes de gravar; a etapa iniciar pode ajudar a escrever) só para reconhecer takes e grafia
- Animação: sim, Remotion (render final também pelo Remotion); algo muda na tela a cada 3–5 s casado com a fala; mais denso no gancho (10–15 s iniciais) e no fechamento, mais calmo na demo. Composição: boards em tela cheia (problema, números, proposta), app em destaque (gravações/prints em moldura de celular/navegador sobre fundo da marca, com zoom no ponto explicado) e diagramas montados passo a passo
- Câmera: não se aplica (sem apresentador)
- Som: efeitos leves só para pontuar (whoosh nas trocas, pop/clique em textos e botões, riser antes do momento principal), sempre baixos sob a voz. Efeitos e música GERADOS pelo ElevenLabs via MCP (ainda não conectado nesta máquina em 2026-11-17: conectar na instalação; a pessoa coloca a chave). Sons gerados vão para a biblioteca na pasta de ferramentas, por categoria, para reaproveitar. Música: fluxo encaixa com abaixamento sob a voz e fim casado com o vídeo
- Revisões: pelo chat: roteiro (antes de gravar) e plano das animações. Assistindo: narração limpa (só áudio, após cortes), vídeo com animações e telas, versão final com som e música. Correções pelo chat citando tempo ("1:12") ou número da cena ("cena 4")
- Nomes: prefixo `ed-`; skill mestra `/editar`

## Perfil
- caminho-livre (pasta `fluxo\perfil\`): escrito em 2026-11-17 a partir das 5 refs + cores do app. Arquivos: identidade, estilo-motion, estilo-cortes, estilo-som, catalogo (sem estilo-camera: não se aplica). Falta: confirmar a fonte (padrão Inter) e calibrar níveis de som no primeiro vídeo

## Fluxo aprovado (2026-11-17)
1. ed-iniciar — cria a pasta do vídeo, briefing e ajuda a escrever o roteiro (estrutura de pitch, ref 01); aprovado pelo chat
2. ed-preparar — inventário (narração, gravações de tela, prints) e transcrição ElevenLabs com tempo por palavra e lista de termos
3. ed-cortes — limpa a narração (pausas, hesitações, repetições); a pessoa ouve o áudio limpo
4. ed-mapa — plano das cenas casadas com a fala (boards, app em moldura, diagramas), sem animar; aprovado pelo chat
5. ed-assets — logo, ícones, prints e recortes das gravações que o mapa pede
6. ed-animar — constrói as cenas no Remotion e renderiza com a narração, por trecho; a pessoa assiste
7. ed-som — efeitos e música (ElevenLabs), mixagem com abaixamento sob a voz, render final; a pessoa assiste
- Mestra: /editar · Regras comuns: `editar\regras-comuns.md` (lida por todas)
- Sem etapa de câmera (sem apresentador; zoom no app fica dentro do ed-animar)

## Onde ficam as skills
- SÓ neste projeto: `C:\Github\caminho-livre\.claude\skills\` (pedido da pessoa em 2026-11-17). Nada em `~/.claude/skills`.
- `fluxo-de-edicao` foi movida de `~/.claude/skills` para cá na mesma data; as `ed-*` e `editar` também serão gravadas aqui. Abrir o Claude Code nesta pasta do repositório para usar.

## Skills escritas
- [x] regras comuns (`editar\regras-comuns.md`)
- [x] skill mestra /editar
- [x] ed-iniciar (pasta + estado + briefing + roteiro de pitch)
- [x] ed-preparar (inventário, Scribe por palavra, silêncios, frases ligadas ao roteiro)
- [x] ed-cortes (takes, hesitações, ar 0,15 s, narração limpa WAV/MP3 + marcas)
- [x] ed-mapa (cenas c01… cobrindo a narração inteira, storyboard no gancho, lista de assets)
- [x] ed-assets (logo, ícones Iconify, fonte, prints localhost, gravações → 30 fps CFR)
- [x] ed-animar (Remotion: remotion-base reaproveitável + projeto por vídeo, rascunho 720p, eventos para o som)
- [x] ed-som (efeitos e música ElevenLabs, biblioteca `pitch\som\`, abaixamento sob a voz, master ~−16 LUFS, final 1080p)
- Script de estado `scripts\ver.py`: a escrever na primeira execução da ed-iniciar

## Próximo passo
Fase 6: teste num clipe curto (1–3 min) pelo /editar. ElevenLabs já está pronto (ver Ambiente). Os demais scripts nascem nesse teste.
