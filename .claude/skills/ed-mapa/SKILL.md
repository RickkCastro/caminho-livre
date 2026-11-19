---
name: ed-mapa
description: "Planeja as cenas do vídeo narrado casadas com a fala: qual board, qual tela do app, qual diagrama, em que palavra entra cada coisa, a câmera virtual e as trocas de cena. Não anima nada: propõe, ajusta pelo chat e grava o plano. Use em /ed-mapa, após a ed-cortes."
---

# ed-mapa

A etapa que mais decide a qualidade do vídeo. Num vídeo narrado, a imagem é tudo: o plano cobre **a narração inteira, sem buraco**, com uma sequência de cenas (`c01`, `c02`…). Não anima nada: propõe no chat, ajusta com a pessoa e grava o plano. Aqui mudar é barato; depois do render, um conceito fraco custa uma rodada inteira.

- **Lê:** bloco `cortes` (aprovado), `transcricao`, o roteiro aprovado (linhas "imagem:"), `edicao\briefing.md`, o inventário de `brutos\` e `assets\`, e o perfil: `identidade.md`, `estilo-motion.md`, `catalogo.md`.
- **Escreve:** bloco `mapa` (`versao`, `cortes_versao` usada, `trechos`, `cenas`, `assets`); `edicao\mapa\fala_vNN.md` (a fala no tempo da narração limpa) e `edicao\mapa\plano_vNN.md` (o plano legível).
- **Próximo passo:** `/ed-assets`

Se a `ed-cortes` não estiver `concluido` (ou `nao_precisa`), pare e sugira terminá-la. Com `nao_precisa`, a base de tempo é `cortes.narracao_final` inteira (um segmento só, `s001`): o tempo na narração = o tempo da transcrição.

Leia antes: `C:\Github\caminho-livre\.claude\skills\fluxo-de-edicao\guias\oficio-motion.md` (o ofício; onde o perfil disser outra coisa, vale o perfil).

## Ofício
### Princípio
- **O conteúdo decide a imagem.** Para cada ideia, a forma visual que explica melhor *aquela* ideia. Nada de encaixar a fala num template.
- **O estilo é constante:** ofício, perfil e identidade visual.
- **O catálogo é repertório, nunca obrigação.** No gancho, um conceito próprio do assunto (acessibilidade, a rua, o caminho) vale mais que um padrão do catálogo.
- **Uma coisa protagonista por vez.**
- **Mostrar a coisa de verdade:** se a fala cita uma função do app, mostrar o app fazendo aquilo (gravação de tela) vale mais que um card com o nome.

### 1. A fala no tempo da narração limpa
Um script gera `fala_vNN.md`: uma frase por linha, com o tempo na narração limpa (mm:ss.ff), o id da frase e do segmento, o bloco do roteiro e, no fim de cada bloco, o **tempo exato da junção** (onde as cenas costumam trocar). O tempo de cada palavra sai sob demanda, só do trecho pedido.

### 2. Trechos
- Marcar o **fim do gancho**, os blocos do roteiro e o **começo do fechamento**. Confirmar numa mensagem curta, já com a proposta ("Gancho até 0:14, demo de 0:52 a 2:10, fechamento a partir de 2:30. Confere?").
- A densidade de cada trecho é do perfil (`estilo-motion.md`, "Densidade por trecho").
- Planejar **o gancho primeiro e quase frase a frase**.

### 3. Tipos de cena (do perfil, decisão 7)
- **Board:** tela cheia com frase curta, número, ícones (problema, dados, proposta).
- **App em destaque:** gravação de tela ou print dentro da moldura de celular/navegador, sobre o fundo da marca, com zoom no ponto que a fala explica. Indicar **qual arquivo e qual trecho** da gravação (início–fim no arquivo).
- **Diagrama:** fluxo de uso ou arquitetura montado passo a passo, no ritmo da fala.
Variar os tipos; não repetir a mesma fórmula de entrada em cenas seguidas.

### 4. Storyboard (obrigatório no gancho, opcional no resto)
| Campo | O que descreve |
|---|---|
| conceito | a ideia visual numa frase, amarrada ao que está sendo falado |
| camadas | fundo, meio e frente: o que há em cada uma e como se move |
| câmera | o que a câmera virtual faz (aproximação, deriva, zoom num ponto do app) |
| batidas | palavra-gatilho, tempo, o que acontece; viram pontos de som |
| herói | o ápice, se tiver |
| vida | o movimento secundário depois que tudo entrou |
| saída | como passa para a próxima cena (tipo de troca) |

Antes de mostrar, reler o gancho: o conceito nasce desta fala ou serviria para qualquer vídeo? A energia combina? Estou repetindo a mesma fórmula?

### 5. Duração e sincronia
- Cada cena dura o trecho de fala que ilustra: mínimo ~2 s, típico 3–6 s (perfil). Acima de ~10 s, dividir em cenas ou trocar o que está na tela dentro dela (a tela nunca congela).
- Cada entrada importante tem uma **palavra-gatilho** com o tempo exato.
- **Tempo de leitura:** texto fica ~1–1,5 s depois da última palavra, salvo troca de cena obrigatória.
- Trocas de cena caem nas junções entre blocos (tempo exato da junção, não da palavra).
- A sequência cobre do 0:00 ao fim da narração, mais a cauda do fechamento (logo + chamada, ~2–3 s depois da última palavra).

### 6. Trocas de cena
Escolher para cada passagem o tipo do perfil (`estilo-motion.md` §4): forma da marca varrendo, whip com borrão nas trocas rápidas do gancho, corte seco em mudança brusca de assunto. Variar ao longo do vídeo.

### 7. Assets
- Listar `assets\` e `brutos\` antes: o arquivo pode já estar lá com outro nome.
- Pedir o que faltar em vez de improvisar com algo genérico: logo, print de uma tela específica, gravação de um fluxo do app (só a pessoa grava).
- Cada asset: id (`a01`), tipo (logo, ícone, print, gravação, foto) e termo de busca (ícone: uma palavra em inglês). Prefira SVG para logo e ícone.
- Moldura de celular, formas, gráficos, diagramas e texto **não são asset**: o Remotion desenha no código.
- Esta etapa não busca nada; quem busca e prepara é a `ed-assets`.

## Perfil
- `identidade.md`: cores, fonte, material, moldura.
- `estilo-motion.md`: velocidades, curvas, trocas de cena, densidade por trecho, composição.
- `catalogo.md`: padrões que já funcionaram (repertório).

## Scripts
| Script | O que faz | Armadilhas |
|---|---|---|
| `scripts\mapa_fala.py` | Converte a transcrição para o tempo da narração limpa pelos segmentos do corte e gera `fala_vNN.md`; sob demanda, as palavras de um trecho | Usar a mesma função de conversão da `ed-cortes`; avisar quando um tempo cai dentro de um trecho cortado |
| `scripts\mapa_gravar.py` | Grava o bloco `mapa` e o `plano_vNN.md` a partir do plano aprovado | Preservar o status das cenas já aprovadas; anotar `cortes_versao` para o alerta de corte desatualizado; checar que as cenas cobrem a narração sem buraco nem sobreposição |

Na primeira vez que a etapa rodar num vídeo, escreva os scripts que faltam em `C:\Github\caminho-livre\pitch\fluxo\scripts\`, teste e anote aqui o uso. Nos próximos vídeos, reaproveite.

## Passo a passo
1. Status e pendências. Etapa `em_andamento`.
2. Gerar `fala_vNN.md` e propor os trechos (mensagem curta).
3. Gancho: storyboard cena a cena. Mostrar e ajustar antes de seguir.
4. Resto do vídeo: uma linha por cena.
5. Lista de assets (o que já existe, o que falta e quem consegue: a pessoa ou a `ed-assets`).
6. Gravar o plano. Etapa `aguardando_aprovacao`.

## Resumo no chat
O plano numerado, uma linha por cena: `c04 · 0:18–0:23 · app · busca de endereço digitada, zoom no campo · gatilho "destino" · troca: forma varrendo`. O gancho com o storyboard. No fim, os assets que faltam e o que só a pessoa pode gravar.

## Revisão
A pessoa aprova, ajusta ou risca por número ("c06 vira diagrama", "risca c09"). Num vídeo mais longo, aprovar por trecho, começando pelo gancho. Ao gravar de novo, versão nova e status preservado. Anotar no caderno o que vale para outros vídeos ("prefere app a board na demo").

## Aprovação
Depois de aprovado, o plano trava. Se a `ed-cortes` mudar depois, as cenas precisam ser recalculadas (o `ver.py status` avisa). Marcar `concluido`, dizer quantos aprendizados ficaram anotados e sugerir `/clear` e `/editar`.

## Regras comuns
Antes de começar, leia `C:\Github\caminho-livre\.claude\skills\editar\regras-comuns.md` (uma vez por sessão).

## Regras
- Não animar nada nesta etapa.
- Nunca mover, renomear ou apagar arquivos do projeto.
- Falar em português, de forma curta.
