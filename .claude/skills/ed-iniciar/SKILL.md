---
name: ed-iniciar
description: "Abre um vídeo novo: cria a pasta do vídeo, o estado, organiza o briefing e ajuda a escrever o roteiro da narração (ex.: o pitch do Caminho Livre). Use em /ed-iniciar, no começo de cada vídeo, ou quando a /editar indicar."
---

# ed-iniciar

Abre o projeto do vídeo, organiza o briefing e entrega o roteiro da narração aprovado pelo chat. Não analisa mídia (isso é da `ed-preparar`) e não planeja cenas (isso é da `ed-mapa`).

- **Lê:** o que a pessoa contar; `fluxo\perfil\identidade.md` (só o nome e o tom); para pitch do Caminho Livre, o README e os docs do repositório `C:\Github\caminho-livre` (para entender o produto, nunca para inventar números); a estrutura de pitch em `fluxo\perfil\referencias\analise\sintese.md` (ref 01).
- **Escreve:** a pasta do vídeo, `edicao\projeto.json` (blocos `projeto`, `perfil`, `etapas`, `briefing`, `roteiro`), `edicao\briefing.md`, `edicao\termos.txt`, `edicao\aprendizados.md` (vazio) e o roteiro em `roteiro\roteiro_vNN.md`.
- **Próximo passo:** gravar a narração; depois `/ed-preparar`.

## Ofício
### Pasta e estado
- Pasta: `C:\Github\caminho-livre\pitch\` (já existe, com `roteiro\`, `brutos\`, `assets\`, `som\`, `edicao\`, `renders\`, `fluxo\`). Criar só a subpasta que faltar, com o "sim".
- Já existe `edicao\projeto.json`: não sobrescrever nada; mostrar o status e perguntar se é só para atualizar o briefing ou o roteiro.
- Perfil: `fluxo\perfil\` (`caminho-livre`); anotar no estado.

### Briefing
- Pedir numa mensagem curta, sem formulário: "Me conta, do jeito que vier, sobre o que é esse vídeo, para quem é, quanto tempo pode ter e qualquer direcionamento que você já tenha."
- Organizar sem inventar: preservar as palavras e a intenção da pessoa; nada de acrescentar tom, público ou ideia que ela não disse.
- Seções (omitir as vazias): sobre o vídeo, público e onde vai passar, duração máxima, direcionamentos gerais, observações por etapa (roteiro, cortes, cenas, som).
- `termos.txt`: nomes próprios e termos que a transcrição precisa acertar (Caminho Livre, nomes do grupo, nomes das telas e funções do app). Um por linha.

### Roteiro (o mais importante desta etapa)
- Se a pessoa já tem roteiro em `roteiro\`, ler, sugerir melhorias pontuais e salvar a versão revisada como arquivo novo. Nunca editar o arquivo dela.
- Sem roteiro: propor primeiro a **estrutura** (blocos e tempo de cada um), só depois o texto.
- Estrutura de pitch sugerida (ref 01): **gancho** com dado de impacto ou situação real (10–15 s) → **problema** → **solução** (o que o Caminho Livre é, em uma frase) → **como funciona** (demonstração do app, o bloco mais longo) → **diferencial / impacto** → **fechamento** com chamada. Tendência, não regra: seguir o que o briefing pedir (banca, edital, tempo).
- Tamanho: ~140 palavras por minuto de narração em português. Avisar se o texto passar da duração do briefing.
- Escrito para ser **falado**: frases curtas, uma ideia por frase, palavras que a pessoa usaria. Ler em voz alta mentalmente; trocar o que trava a língua.
- Cada bloco com uma linha **"imagem:"** curta sugerindo o que aparece (board, tela do app, diagrama). É só ideia para a `ed-mapa`, não plano.
- Dados e números: só os que a pessoa deu ou que estão no repositório/documentos dela. Número sem fonte vira `[dado: confirmar]`.
- Dicas de gravação no fim do roteiro: gravar num lugar silencioso, celular ou microfone a um palmo da boca, uma frase errada se repete inteira (a última versão vale), pausa de 1 s entre blocos.

## Perfil
- `identidade.md`: só para o tom (o resto é das etapas de cenas).

## Scripts
| Script | O que faz | Armadilhas |
|---|---|---|
| `C:\Github\caminho-livre\pitch\fluxo\scripts\ver.py` | Script de estado (ver `regras-comuns.md` §2): `status`, `<bloco>`, `--json`, `--item`, `--set`, `--etapa`, `--pendencia`, `--resolver`. `status` também conta as linhas `- [ ]` de `aprendizados.md` e mostra alertas (ex.: `cortes.versao` mais nova que a usada no `mapa`) | Gravar o JSON de forma atômica (arquivo temporário + troca) para não corromper; UTF-8; nunca reformatar blocos que não mudou |

Na primeira vez que esta etapa rodar, escreva o `ver.py` (Python puro, sem dependências), teste com um `projeto.json` de exemplo e anote aqui o uso. Nos próximos vídeos, reaproveite.

## Passo a passo
1. Ler `regras-comuns.md`. Perguntar o nome do vídeo (ou sugerir) e criar a pasta com o "sim".
2. Criar o `projeto.json` pelo `ver.py`: `etapas` com `iniciar` = `em_andamento` e as demais `pendente`.
3. Briefing: pedir, organizar, salvar em `edicao\briefing.md`, mostrar.
4. Roteiro: estrutura → aprovação → texto → salvar `roteiro\roteiro_v01.md` → mostrar. Etapa `aguardando_aprovacao`.
5. Revisão pelo chat (por bloco ou por frase), sempre versão nova (`_v02`…).
6. Aprovado: anotar no estado (`roteiro.arquivo`, `roteiro.versao`, `roteiro.palavras`, `roteiro.duracao_estimada`), escrever `termos.txt`.

## Resumo no chat
Curto: a pasta do vídeo, o briefing em 3–5 linhas, o roteiro (o texto inteiro, porque a pessoa vai lê-lo) e a duração estimada.

## Revisão
A pessoa cita o bloco ou a frase ("muda o gancho", "o bloco 3 está longo"). Ajustar só o citado, salvar versão nova, anotar aprendizados que valem para outros roteiros (ex.: "prefere gancho com pergunta").

## Aprovação
Marcar `iniciar` = `concluido` e dizer o que falta para a próxima etapa: gravar a narração seguindo o roteiro e colocar em `brutos\`, junto com as gravações de tela do app; prints e logo em `assets\`. Dizer quantos aprendizados ficaram anotados e sugerir `/clear` e `/editar`.

## Regras comuns
Antes de começar, leia `C:\Github\caminho-livre\.claude\skills\editar\regras-comuns.md` (uma vez por sessão).

## Regras
- Nunca mover, renomear ou apagar arquivos do projeto. Nunca editar um roteiro que a pessoa escreveu: versão nova ao lado.
- Nunca inventar dado, número ou depoimento no roteiro.
- Falar em português, de forma curta.
