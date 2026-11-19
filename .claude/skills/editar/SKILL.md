---
name: editar
description: "Ponto de entrada das skills de edição de vídeo narrado (ed-*): mostra onde o vídeo está (etapas, pendências, alertas, aprendizados anotados) e abre a skill da etapa certa. Também aplica os aprendizados (/editar aprendizados). Use em /editar, ao abrir ou retomar um vídeo, depois de um /clear, ou quando a pessoa perguntar em que pé está o vídeo."
---

# editar

Fluxo: ed-iniciar → ed-preparar → ed-cortes → ed-mapa → ed-assets → ed-animar → ed-som

Antes de tudo, leia `regras-comuns.md` (nesta pasta), uma vez por sessão.

## /editar
1. **Qual vídeo:** o vídeo é o pitch, e tudo dele fica em `C:\Github\caminho-livre\pitch\` (o Claude Code é aberto no repositório `caminho-livre`, onde as skills estão). Sem `pitch\edicao\projeto.json`: diga que o vídeo ainda não foi iniciado e ofereça a `ed-iniciar`.
2. **Status:** rode `py C:\Github\caminho-livre\pitch\fluxo\scripts\ver.py <pasta do vídeo> status` e mostre de forma curta: etapas, o que já foi feito por trecho, pendências, alertas e quantos aprendizados estão anotados. Se o `ver.py` ainda não existir, é porque a `ed-iniciar` nunca rodou: ofereça ela.
3. **Próximo passo:** diga qual é e pergunte se segue. Com o "sim", abra a skill da etapa e siga as instruções dela.
   - Etapa aguardando revisão: o próximo passo é continuar essa mesma etapa, nunca pular.
   - Alerta de algo desatualizado (ex.: o corte mudou depois do plano das cenas): mostre primeiro e espere a decisão.
   - A pessoa pediu outra etapa ou um trecho ("sim, até 1:00"): abra essa etapa e passe o trecho.
4. **Uma etapa por vez.** Não encadear etapas sozinho e não dar `/clear` (isso é sempre da pessoa).
5. **Modelo:** lembre, numa linha, o modelo sugerido para a etapa. Trocar logo depois do `/clear` não custa nada.

| Etapa | Modelo | Esforço |
|---|---|---|
| editar, ed-iniciar, ed-assets | o mais leve que funcione bem | baixo |
| ed-preparar | intermediário | médio |
| ed-cortes, ed-mapa, ed-animar | o mais capaz | alto |
| ed-som, aplicar aprendizados | o mais capaz | médio |

(A ed-iniciar sobe para o mais capaz quando for escrever o roteiro.)

## /editar aprendizados
Siga a seção 6 das regras comuns.

## Regras
- Não editar vídeo nem rodar scripts de etapa: isso é das skills de cada etapa.
- Nunca mover, renomear ou apagar arquivos do projeto.
