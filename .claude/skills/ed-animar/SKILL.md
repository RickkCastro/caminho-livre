---
name: ed-animar
description: "Constrói as cenas aprovadas no Remotion (boards, app em moldura, diagramas, trocas de cena) sobre a narração limpa e renderiza o vídeo animado para assistir, inteiro ou por trecho. Use em /ed-animar, após a ed-assets."
---

# ed-animar

Constrói cada cena do plano no Remotion, sobre a narração limpa, e renderiza o vídeo animado para a pessoa assistir. É a etapa mais longa e a que mais depende do ofício. Sem efeitos sonoros nem música (isso é da `ed-som`).

- **Lê:** bloco `mapa` (cenas aprovadas, gatilhos, trocas), bloco `assets`, `edicao\assets\`, a narração final (`cortes.narracao_final` no estado: a limpa em `renders\<projeto>_narracao_vNN.wav`, ou `edicao\preparar\narracao.wav` quando a `ed-cortes` foi pulada), o perfil: `identidade.md`, `estilo-motion.md`, `catalogo.md`.
- **Escreve:** o projeto Remotion do vídeo em `edicao\remotion\`; bloco `animacao` (por cena: versão, status, frames, `eventos` para o som); entrega em `renders\<projeto>_animado_vNN.mp4`.
- **Próximo passo:** `/ed-som`

Se a `ed-assets` não estiver `concluido` (ou com faltas aceitas como pendência), pare e sugira terminá-la.

Leia antes: `C:\Github\caminho-livre\.claude\skills\fluxo-de-edicao\guias\oficio-motion.md` (onde o perfil disser outra coisa, vale o perfil) e carregue a skill `remotion:remotion-best-practices` (e as que ela indicar) antes de escrever código Remotion.

## Ofício
### Projeto Remotion
- **Base reaproveitável:** `C:\Github\caminho-livre\pitch\fluxo\remotion-base\`, com as peças-base do perfil (moldura de celular e de navegador, frase curta com palavra-chave, card de UI, número que conta, forma que varre, fundo com formas orgânicas em deriva, cursor que clica, busca digitada) e as curvas do perfil num arquivo só. Criada na primeira vez; cresce com o que der certo.
- **Por vídeo:** cópia da base em `edicao\remotion\`, com as versões de pacotes **fixas** (anotar no estado em `ferramentas.remotion`). Nunca atualizar o Remotion no meio de um vídeo.
- **Composição principal:** 1920×1080, 30 fps, duração = narração limpa + cauda do fechamento. A narração limpa entra como `<Audio>`; cada cena é uma `<Sequence>` no frame de início do plano.
- **Tempo:** frame da cena = `round(tempo_na_narração × 30)`; cada gatilho entra em `frame_da_palavra − frame_início_da_cena`. Os tempos vêm do bloco `mapa`, nunca digitados de cabeça.
- Cores, fonte e curvas vêm de um arquivo de tema gerado do perfil, nunca espalhadas pelo código.

### Construir cada cena
- **Storyboard,** quando houver, é a especificação aprovada. O que não der para fazer como descrito vai explicado no resumo.
- Cena completa: fundo da marca, câmera virtual (aproximação com ease-out e deriva linear **em contêineres separados**, para o zoom não engasgar), conteúdo principal centralizado desde o começo, chegada já em movimento e saída pela troca de cena do plano.
- **App em destaque:** a gravação (`<OffthreadVideo>`) ou o print dentro da moldura, girada levemente; o zoom vai até o ponto que a fala explica, no gatilho.
- **Uma coisa protagonista por vez**; cascata de 2–4 frames entre itens irmãos; grupos que chegam em sequência ficam sempre centralizados.
- **Tempo de leitura:** texto segura ~1–1,5 s depois da última palavra.
- Asset faltando: marcador visível ("FALTA a04: print da tela de rotas") no lugar, nunca um genérico.
- **Eventos para o som:** ao construir, anotar cada momento que pede som (entrada forte, troca de cena, clique, número chegando), com frame e tipo, no bloco `animacao`. É o que a `ed-som` lê.

### Conferir antes de renderizar
- Tipos e lint do projeto sem erro.
- `still` dos momentos-chave de cada cena nova (entrada, gatilho, herói, saída) e olhar: alinhamento, texto cortado, contraste, protagonista único.
- Cobertura: nenhum frame sem cena entre 0 e o fim.

### Renderizar
- **Rascunho para revisar:** 720p (escala ~0,667), em segundo plano. **Final** (depois do som): 1080p, na `ed-som`.
- Conferir o arquivo: resolução, 30 fps, número de frames igual à duração da composição, áudio da narração presente e alinhado (ouvir uma palavra marcante num gatilho).
- Versão no nome, nunca sobrescrever.

### Por trecho
A pessoa pode pedir um trecho ("o gancho", "até 1:00", "c01 a c08"). Construir só as cenas que **começam** nele; o render de revisão pode ser só daquele trecho (frames do trecho) ou do vídeo inteiro com o que já existe.

### Medir (quando a fluidez estiver em dúvida)
Mesmo método das referências (`scripts\ref_medir.py`): a curva medida no render tem de bater com a curva e a duração do perfil. Feedback de qualidade geral ("básico", "sem vida") pede **refazer** a cena, não retocar: reler a síntese das referências, dizer numa frase a nova direção e construir de novo.

## Perfil
- `identidade.md`: cores, fonte, material, moldura, o que nunca usar.
- `estilo-motion.md`: velocidades, curvas (com o equivalente Remotion), câmera virtual, trocas, entradas, texto, secundário, densidade.
- `catalogo.md`: padrões que já funcionaram.

## Scripts
| Script | O que faz | Armadilhas |
|---|---|---|
| `scripts\animar_dados.py` | Gera `edicao\remotion\src\dados.json` a partir dos blocos `mapa` e `assets` (frames de cada cena e gatilho, caminhos dos assets) e o tema a partir do perfil | Conversão tempo → frame numa função só; caminhos de assets copiados para `public\` do projeto, nunca ligados ao original |
| `scripts\animar_conferir.py` | Confere o render (ffprobe: resolução, fps, frames, áudio) e grava o bloco `animacao` com os eventos | Recusar se os frames não baterem com a composição |

**Uso (pronto, testado no pitch):**
- Projeto do vídeo: copiar `fluxo\remotion-base\` sem `node_modules` para `edicao\remotion\` e rodar `npm ci` (Remotion 4.0.545 fixo).
- `py pitch\fluxo\scripts\animar_dados.py <pasta do vídeo>` (teste: `--teste`) gera `src\dados.json` e `src\tema.json` e copia a narração e as pastas de prints para `public\`. Rodar de novo sempre que o plano ou os assets mudarem.
- Cenas em `src\cenas\*.tsx`, registradas em `src\cenas\registro.ts` (`ate: "cNN"` = várias cenas num mundo só, sem corte). Gatilhos sempre por `gat(cenas, "cNN", "palavra")`, nunca frame digitado. Cena não registrada vira marcador "AINDA NÃO CONSTRUÍDA".
- Eventos para o som: anotar em `edicao\remotion\eventos.json` (`{cena: [[frame absoluto, tipo, o que]]}`) ao construir.
- Rascunho 720p: `npx remotion render Rascunho <saída> --frames=<ini>-<fim>` (composição "Rascunho", que reduz o Video a 2/3; `--scale 0.6667` dá altura fracionária e falha, e `--width/--height` corta o quadro). Final 1080p: composição `Video`.
- `py pitch\fluxo\scripts\animar_conferir.py <pasta> <mp4> <frame_ini> <frame_fim>` confere o render (resolução, 30 fps, frames, áudio) e grava o bloco `animacao`.
- Stills: `npx remotion still Video <png> --frame=N --scale=0.5`; juntar vários numa folha com PIL para olhar de uma vez.
- Zoom em print de app: pontos em 390x844 (prints 1170x2532 a 3x); converter para o mundo com a rotação do celular (`noMundo` em `cenas\Demo.tsx` do pitch).

Render e stills pelos comandos do Remotion (`npx remotion render` / `npx remotion still`), em segundo plano. Na primeira vez que a etapa rodar num vídeo, crie a `remotion-base`, escreva os scripts que faltam em `C:\Github\caminho-livre\pitch\fluxo\scripts\`, teste e anote aqui o uso. Nos próximos vídeos, reaproveite.

## Passo a passo
1. Status e pendências. Etapa `em_andamento`. Perguntar o trecho, se não vier ("sugiro começar pelo gancho").
2. Preparar o projeto (cópia da base, dados, tema).
3. **Primeira vez de todas:** construir só uma cena curta do gancho, renderizar 5–10 s em 720p, a pessoa assiste e confere (cores, fonte, movimento, narração alinhada), anotar em `validacao.md`, e só então seguir.
4. Construir as cenas do trecho, conferir com stills, renderizar o rascunho.
5. Conferir o arquivo, gravar o bloco `animacao`. Etapa `aguardando_aprovacao` (ou trecho entregue).

## Resumo no chat
Curto: quais cenas foram construídas, o que mudou em relação ao storyboard e por quê, assets ainda faltando, e o caminho do MP4 para assistir.

## Revisão
- Por número ou tempo: "c04 mais lenta", "em 0:31 o texto sai cedo". Converter o tempo para a cena pelo bloco `mapa`. Ajustar só o citado, renderizar versão nova.
- Se uma revisão mudar a duração de uma cena, mudar no plano e na composição e gravar de novo.
- Se a pessoa mexeu direto no código de uma cena, preservar o que ela mudou.
- Anotar no caderno o que vale para outros vídeos.

## Aprovação
Olhar o que deu certo: padrão que se repetiu vira item do `catalogo.md`, peça que ficou boa vai para a `remotion-base` (propor, e gravar com o "sim"). Marcar `concluido`, dizer quantos aprendizados ficaram anotados e sugerir `/clear` e `/editar`.

## Regras comuns
Antes de começar, leia `C:\Github\caminho-livre\.claude\skills\editar\regras-comuns.md` (uma vez por sessão).

## Regras
- Nunca mover, renomear ou apagar arquivos do projeto.
- Nunca atualizar pacotes do Remotion no meio de um vídeo.
- Falar em português, de forma curta.
