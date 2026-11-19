# Regras comuns das skills ed-*

Lidas uma vez por sessão por todas as skills de edição (`/editar` e `/ed-*`). Mudou uma regra geral? Mude aqui, não em cada skill.

**Tudo do vídeo fica em `C:\Github\caminho-livre\pitch\`** (pedido da pessoa): nada fora dessa pasta, exceto as próprias skills em `.claude\skills\`.
- `roteiro\` roteiro e versões · `brutos\` narração e gravações de tela · `assets\` prints, logo, ícones (biblioteca fixa em `assets\biblioteca\`) · `som\` biblioteca de efeitos e músicas (com `indice.json`) · `edicao\` trabalho do Claude (estado, transcrição, cortes, mapa, projeto Remotion, caderno de aprendizados) · `renders\` os vídeos e áudios entregues.
- `fluxo\` o que serve ao fluxo: `scripts\`, `perfil\` (gosto + referências), `remotion-base\`, `montagem.md`, `validacao.md`.
- "Pasta do vídeo" nas skills = `C:\Github\caminho-livre\pitch\`. Perfil = `fluxo\perfil\`.
Python: `py` (3.14). Rodar scripts com `py <script>`, **sem `-I`** (o `-I` esconde os pacotes instalados com `--user`). FFmpeg em `C:\ffmpeg\bin`.
Animação e render: Remotion, 16:9, 1080p, 30 fps (confirmar a taxa real das gravações de tela na preparação).

## 1. Conversa e segurança
- Falar em português, de forma curta, com a sugestão já dita ("sugiro X, porque Y").
- Nunca mover, renomear ou apagar arquivos do projeto (brutos, assets, roteiro). Tudo o que o Claude gera fica em `edicao\` ou em `renders\`.
- Nunca sobrescrever um arquivo já entregue: versão nova (`<projeto>_narracao_v01`, `_v02`…; `<projeto>_animado_v01`…; `<projeto>_final_v01`…). Cada etapa continua a sua numeração.
- Apagar, quando precisar, é mover para `edicao\_lixeira\` e deixar a pessoa apagar depois.
- Chaves de API (ElevenLabs): nunca digitar, pedir, abrir ou mostrar. A chave fica em `caminho-livre\.env.local` (gravada pelo `npx -y @elevenlabs/cli@latest onboard`, ignorada pelo git) e é carregada por `fluxo\scripts\elevenlabs_cliente.py`. Para conferir se funciona: `npx -y @elevenlabs/cli@latest onboard check --env-path .env.local` na raiz do repo. Chave quebrada: rodar `onboard init` de novo.
- Chamadas ao ElevenLabs gastam créditos: transcrição, efeitos e música só depois do "sim" da pessoa (com o que vai ser feito e a duração).
- Mudança no próprio fluxo (skills, scripts, perfil): só com o "sim" da pessoa.

## 2. Estado do vídeo sem ler inteiro
O `edicao\projeto.json` cresce muito. Ler e mudar sempre pelo script de estado `py C:\Github\caminho-livre\pitch\fluxo\scripts\ver.py <pasta do vídeo> …` (escrito na primeira vez que a `ed-iniciar` rodar):
- `status` mostra as etapas, o que foi feito por trecho, as pendências, os alertas e quantos aprendizados estão anotados;
- `<bloco>` mostra o resumo de um bloco (`--json` para o bloco completo); `--item <id>` mostra um item;
- `--set <caminho> <valor>` muda um campo solto. **Objeto ou lista pelo PowerShell: gravar o JSON num arquivo e passar `@arquivo.json`** (o PowerShell 5.1 tira as aspas do JSON na linha de comando e o valor vira texto);
- `--etapa <etapa>=<status>` muda o status de uma etapa (`pendente`, `em_andamento`, `aguardando_aprovacao`, `concluido`, `nao_precisa`);
- `--pendencia <etapa> "<texto>"` anota uma pendência, e `--resolver <id>` a resolve.

Os blocos inteiros são gravados pelos scripts de cada etapa. Ids estáveis (`s001` trecho da narração, `c04` cena, `sfx12` som) são o jeito de a pessoa pedir ajustes. Tempos da narração ficam no **tempo do arquivo de origem**, para sobreviverem a novas versões do corte.

## 3. Revisão assistindo (sem programa de edição)
- A pessoa revisa assistindo e pede pelo chat, citando o tempo ("em 1:12 a rota entra cedo") ou o id ("c04 mais lenta"). Converter o tempo do vídeo para cena/trecho pela lista de cortes e pelo plano das cenas, nunca de cabeça.
- Pontos de revisão: roteiro e plano das cenas pelo chat; narração limpa (só áudio), vídeo animado e versão final assistindo.
- Rascunho para revisar: render em resolução menor (720p) quando a cena ainda vai mudar; final em 1080p.
- Cada ajuste é um render novo: juntar vários pedidos antes de renderizar.
- Formato novo de entrega (primeira vez de um tipo de render ou mixagem): gerar antes um teste curto (5–10 s), a pessoa confere, e só então seguir. Anotar o que foi confirmado em `C:\Github\caminho-livre\pitch\fluxo\validacao.md`.
- Tempo em frames inteiros, convertido num lugar só (uma função usada por todos os scripts): `frame = round(segundos × fps)`. Gravações de tela em 29,97 ou 60 fps entram no Remotion a 30 fps: conferir a taxa real antes.
- Fades curtos de áudio (1 frame) nas junções da narração e no começo e fim de cada som, para tirar estalos.

## 4. Caderno de aprendizados (`edicao\aprendizados.md`)
Anotar na hora, durante a revisão de qualquer etapa, toda correção, elogio ou preferência que vale para outros vídeos:
- "transição mais rápida", "esse whoosh ficou ótimo": **anota**;
- "tira essa frase": **não anota** (é só deste vídeo);
- na dúvida, anota com "(talvez só deste vídeo)".

Formato: `- [ ] <etapa> · <o que foi pedido, com contexto> · <dd/mm>`. Depois de aplicado: `- [x] … → <onde entrou>`; só daquele vídeo: `- [-] …`. Nunca apagar linhas. Anotar não é mudar: as skills só mudam quando a pessoa pedir (seção 6).

## 5. Trechos, ponto salvo e fechar uma etapa
- Cortes e plano das cenas olham o vídeo inteiro. Animar e som podem ir por trecho, escolhido na hora ("até 1:00", "o gancho"). Um item pertence ao trecho em que começa. Cada trecho lê o que os anteriores fizeram, para não repetir a mesma fórmula.
- Cada etapa parte da anterior **aprovada**. Se algo aprovado mudar depois (o corte muda depois do plano das cenas), avisar o que precisa ser refeito antes de seguir.
- **Ponto salvo:** trecho ou etapa terminado, revisões aplicadas, entrega gerada. Só aí sugerir `/clear` e `/editar`.
- **Pendência:** pedido ainda não aplicado é anotado na hora pelo script de estado e aparece no status. Nunca sugerir `/clear` com revisão não aplicada nem anotada.
- **Fechar a etapa** (aprovada inteira): marcar `concluido`, dizer quantos aprendizados ficaram anotados, sugerir `/clear` e `/editar`.
- Nada de encadear etapas sozinho: a pessoa aprova uma e diz "sim" para a próxima.

## 6. Aplicar os aprendizados (quando a pessoa pedir)
1. Ler as linhas `- [ ]` do caderno.
2. Propor onde cada uma entra: gosto vai para o perfil (`estilo-*.md`, `identidade.md`, `catalogo.md`); ofício (vale para qualquer vídeo) vai para a skill da etapa; o que vale para todas as etapas vai para este arquivo.
3. A pessoa filtra. Gravar só o aprovado, mostrando antes o texto das mudanças maiores. Marcar cada linha.

## 7. Economia de limite
- Ler resumos e recortes: a transcrição por frase, o estado pelo script, um frame só quando há dúvida real.
- Render e tarefas longas em segundo plano.
- Scripts reaproveitáveis ficam em `C:\Github\caminho-livre\pitch\fluxo\scripts\` (nunca na pasta do vídeo). Depois de mexer num script que já funciona, comparar o resultado com o de antes num vídeo de teste.
