# Conclusão · Data Science & Statistical Computing

**Caminho Livre** · Global Solution 2026.2 (CitizenTech) · Grupo OctoFlow · 2ESPV

**Objetivo:** usar regressão linear e logística com dados públicos de São Paulo para calibrar duas regras do Caminho Livre que hoje são fixas: o **peso noturno** dos alertas de assalto (RF09) e a **validade de 15 dias** dos alertas sem confirmação (RF14). Análise completa em [`analise.ipynb`](analise.ipynb); fontes em [`dados/README.md`](dados/README.md).

## Perguntas, modelos e resultados

Os dois modelos foram treinados com **janeiro a setembro de 2025** e avaliados em **outubro a dezembro de 2025** (separação temporal, sem vazamento de dados).

| Pergunta | Modelo e variável-alvo | Resultado no teste |
|---|---|---|
| **P1.** Quantos roubos a pedestres esperar em cada hora do dia? | **Regressão linear**: `roubos` por hora na cidade (SSP-SP; 8.376 horas) | **MAE 2,84 · RMSE 3,75 · R² 0,48** (prever a média: MAE 4,20, R² −0,04). Sem sobreajuste (R² de treino 0,49) |
| **P2.** Um problema na rua ainda estará sem solução depois de 15 dias? | **Regressão logística**: `persiste_15d` (SP156; 173.783 pedidos) | **precisão 0,66 · recall 0,45 · F1 0,53** (limiar 0,45, escolhido na validação) · acurácia 0,79 · AUC 0,72 (marcar tudo como "persiste": F1 0,43) |

**O que os modelos mostram**

* O risco de roubo a pedestres **quase dobra entre 19h e 22h** (índice previsto de até 2,04 vezes a média, às 20h em dia útil) e tem um segundo pico às **5h**.
* **A escuridão pesa, não só o relógio:** na mesma hora e no mesmo tipo de dia, uma hora toda escura tem **+1,7 roubo** (+15% às 18h).
* Comparado com um buraco, um pedido de **obstáculo na calçada** tem **~49 vezes** mais chance de continuar sem solução depois de 15 dias. Probabilidades previstas: obstáculo **93%**, calçada quebrada **69%**, degrau **55%**, alagamento 34%, falta de rampa 34%, buraco 27%.

## Recomendações de ações

| # | Ação | Fundamento (previsão) | Impacto | Limitação |
|---|---|---|---|---|
| 1 | Multiplicar o peso dos alertas de assalto pelo **índice de risco previsto da hora** | Regressão linear: de 0,26 (2h) a 2,04 (20h) vezes a média | Rotas que evitam alertas de assalto nos horários de maior risco (persona Júlia) | Vale para a cidade toda; só roubos registrados |
| 2 | Definir a "noite" pelo **anoitecer real** de cada dia, e não pela janela fixa das 19h às 6h | Coeficiente `escuro` = +1,7 roubo/hora | No inverno, a proteção começa às ~17h50 | Efeito médio e observacional |
| 3 | **Validade de 90 dias**, com pedido de confirmação a cada 15, para obstáculo, calçada quebrada e degrau; 15 dias para os demais | Regressão logística: probabilidade de persistir ≥ 55% nessas categorias | O aviso da calçada quebrada não some do mapa com o problema ainda lá (persona Dona Marta) | "Finalizada" no SP156 não garante o conserto |
| 4 | **Lembrete de confirmação no 15º dia** para alertas com alta chance de persistir | Recall de 45%: a comunidade completa o que o modelo não encontra | Mapa confiável | Depende de usuários ativos |
| 5 | **Relatório por subprefeitura** dos alertas de acessibilidade com maior chance de persistir | Razões de chances por serviço e por subprefeitura | Barreiras para cadeirantes e idosos priorizadas na zeladoria | Reclamações refletem também quem reclama mais |

## Limitações

* **Linear:** trata a contagem como número contínuo (Poisson seria mais adequada); sem recorte por bairro; só roubos registrados e com hora exata (90%); a tendência de queda não deve ser estendida por muito tempo.
* **Logística:** só três variáveis (serviço, subprefeitura e dia da semana); erra mais nos buracos, cujo prazo muda com as chuvas (*drift*: previu 27% de persistência no fim do ano, quando o real foi 19%); o limiar de 0,45 pode ser ajustado conforme o custo de cada erro.
* **Gerais:** um ano e uma cidade; os dados dependem de a vítima registrar o BO ou de o cidadão acionar o 156 (subnotificação).

## Impactos esperados

* **Segurança:** rotas que reconhecem que o risco muda com a hora e com o escuro.
* **Acessibilidade:** alertas de calçada e obstáculo que ficam no mapa enquanto o problema provavelmente continua.
* **Cidade:** dados para priorizar consertos, iluminação e policiamento.
* **ODS:** meta **11.7** (espaços públicos seguros, inclusivos e acessíveis) e **ODS 10** (redução das desigualdades).
