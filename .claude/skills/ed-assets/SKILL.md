---
name: ed-assets
description: "Junta e prepara os arquivos que as cenas precisam: logo, ícones, fonte, prints e os recortes das gravações de tela do app em 30 fps constantes. Use em /ed-assets, após a ed-mapa, ou avulsa (\"busca um ícone de cadeira de rodas\")."
---

# ed-assets

Junta os arquivos reais que as cenas precisam e que não dá para desenhar em código, e deixa as gravações de tela prontas para o Remotion. Pula sozinha se nada faltar. Não desenha nada (moldura de celular, formas, diagramas e texto são da `ed-animar`).

- **Lê:** bloco `mapa` (cenas e `assets`), bloco `midia` (alertas de VFR, resoluções), `assets\`, `brutos\`, a biblioteca fixa em `C:\Github\caminho-livre\pitch\assets\biblioteca\`.
- **Escreve:** `edicao\assets\` (arquivos prontos, um por id: `a01_logo-caminho-livre.svg`, `a05_busca-endereco.mp4`…), `edicao\assets\creditos.md`, bloco `assets` no estado (id, arquivo, fonte, licença, status).
- **Próximo passo:** `/ed-animar`

Se a `ed-mapa` não estiver `concluido`, pare e sugira terminá-la.

## Ofício
### O que é de quem
| Precisa de… | Quem resolve |
|---|---|
| Logo do Caminho Livre | procurar primeiro no repositório (`C:\Github\caminho-livre\front-next\public\` e afins) e em `assets\`; senão, a pessoa manda |
| Logo de outra marca ou ferramenta, ícone, fonte | esta etapa |
| Recorte e conversão das gravações de tela | esta etapa (cópia nova, nunca o original) |
| Print de tela pública do app | esta etapa, com o front rodando localmente (`localhost`) num navegador sem interface, na resolução da moldura |
| Tela logada, fluxo gravado no celular, foto de pessoa | a pessoa: só lembrar, com o nome de arquivo esperado |
| Moldura, forma, gráfico, diagrama, texto | a `ed-animar`, desenhando no código |

### Fontes
- **Ícones:** Iconify, com opções de coleções abertas (Lucide, Phosphor, Tabler…). SVG de uma cor; o render recolore com a paleta.
- **Logos de terceiros:** biblioteca fixa primeiro, depois SVG oficial (Iconify `logos`, `devicon`, kit de imprensa da marca).
- **Fonte:** a do perfil (`identidade.md`; hoje Inter, licença OFL). No Remotion, preferir carregar pelo pacote de Google Fonts dele em vez de baixar arquivo.
- Pesquisar as fontes atuais e as licenças na primeira vez, antes de escrever o script de busca.
- **Antes de baixar:** mostrar a lista (asset, fonte, tamanho aproximado) e esperar o "sim".

### Gravações de tela
- Recortar só o trecho que o plano usa (com ~0,5 s de folga dos dois lados), converter para **30 fps constantes** (sempre que o inventário marcou VFR ou fps diferente), H.264, sem áudio (a voz é a narração), resolução original.
- Cortar a barra de status do celular ou notificações que vazaram, se o plano pedir. Conferir que não aparece dado pessoal (e-mail, nome de terceiros, localização real) e avisar se aparecer.

### Prints
- PNG na maior resolução disponível; avisar se for pequeno para a moldura (largura < ~900 px para celular em tela cheia).
- Print com banner de cookies, tela carregando ou dado pessoal: descartar e refazer ou pedir.

### Como mostrar
- **Uma folha de contato numerada por rodada** (uma imagem só, opções lado a lado sobre o fundo `#e8f4ef`), nunca as opções soltas.
- Antes de mostrar, descartar o que está claramente errado (marca errada, logo antigo, ícone que não diz a coisa).
- A recomendação é a opção 1 de cada asset. A pessoa responde por número ("a1 1, a3 2, a4 eu mando").
- Perguntar quais vão para a biblioteca fixa (o logo do Caminho Livre, ícones que vão voltar).

### Licenças
- Logos são marcas: usar a oficial, sem redesenhar nem distorcer. Sem a oficial, fica faltando; nunca um "parecido".
- Ícones de coleções abertas (MIT, ISC, Apache, CC BY). CC BY pede crédito em `creditos.md`.
- Imagem da web sem licença clara não entra: vira "a pessoa manda".

## Perfil
- `identidade.md`: paleta (para a folha de contato e para conferir se o ícone combina), fonte, logotipo.

## Scripts
| Script | O que faz | Armadilhas |
|---|---|---|
| `scripts\assets_buscar.py` (**pronto**) | Busca opções de ícone/logo no Iconify, salva SVG, monta a folha de contato numerada. Uso: `py pitch\fluxo\scripts\assets_buscar.py <pasta do vídeo> <lista.json>`, com `{"a03": {"nome": "andador", "opcoes": ["material-symbols:assist-walker", …]}}`. Saída: `edicao\assets\_opcoes\` (SVGs + `opcoes.json` com licença) e `_folha_icones.png` (Playwright do Python). Escolhidos: copiar para `edicao\assets\<id>_<nome>.svg` | Respeitar a licença de cada coleção e anotar; não baixar nada antes do "sim". Ache os nomes antes pela busca `api.iconify.design/search?query=…&prefixes=lucide,ph,tabler,mdi,material-symbols`. O app usa Lucide (`lucide-react`): Lucide como opção 1; o logo do app é `lucide:route` |
| `scripts\assets_gravacoes.py` | Recorta e converte as gravações de tela para 30 fps constantes, a partir dos trechos do plano | Nunca tocar no original; o recorte usa o tempo do arquivo de gravação; conferir duração e fps da saída com ffprobe |

Prints do app (**pronto**): subir o front em modo mock (`.claude\launch.json` → `front-mock`, porta 3001) e rodar `node pitch/fluxo/scripts/prints_app.mjs [url] [pasta] [filtro]`. Gera 13 telas em 1170×2532 (390×844 a 3x) em `pitch\assets\prints\`, com Nominatim simulado e sem tela logada real. O app rola num contêiner interno: `fullPage` não funciona, rolar até o elemento (como na `09b-rota-mapa`). Na primeira vez que a etapa rodar num vídeo, escreva os scripts que faltam em `C:\Github\caminho-livre\pitch\fluxo\scripts\`, teste e anote aqui o uso. Nos próximos vídeos, reaproveite.

## Passo a passo
1. Status e pendências. Etapa `em_andamento`.
2. Listar o que o plano pede e o que já existe (`assets\`, `brutos\`, biblioteca, repositório).
3. Mostrar a lista do que vai buscar/baixar e esperar o "sim". Buscar e montar a folha de contato.
4. Preparar as gravações de tela (recorte + 30 fps).
5. Gravar o bloco `assets` e `creditos.md`. Etapa `aguardando_aprovacao`.

## Resumo no chat
O que entrou (arquivo, fonte, licença), a folha de contato, o que ficou faltando e o que **a pessoa** precisa gravar ou mandar, com o nome de arquivo esperado. A `ed-animar` constrói com um marcador visível no lugar do que ainda faltar.

## Revisão
A pessoa escolhe por número ou manda o arquivo. Atualizar o bloco `assets` e o plano. Anotar no caderno o que vale para outros vídeos ("prefere ícones Phosphor").

## Aprovação
Marcar `concluido` (com faltas anotadas como pendência, se a pessoa quiser seguir assim), dizer quantos aprendizados ficaram anotados e sugerir `/clear` e `/editar`.

## Regras comuns
Antes de começar, leia `C:\Github\caminho-livre\.claude\skills\editar\regras-comuns.md` (uma vez por sessão).

## Regras
- Nunca mover, renomear ou apagar arquivos do projeto. Tudo o que é preparado é cópia em `edicao\assets\`.
- Nunca usar tela logada ou conta de terceiros; nunca entrar senha.
- Falar em português, de forma curta.
