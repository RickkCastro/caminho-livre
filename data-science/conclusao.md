# Conclusão · Data Science & Statistical Computing

**Caminho Livre** · Global Solution 2026.2 (CitizenTech) · Grupo OctoFlow

**Pergunta:** o que os dados públicos de São Paulo dizem sobre os riscos de quem anda a pé, e como isso poderia calibrar o Caminho Livre?

**Dados:** 249.680 roubos e furtos a pedestres em via pública na cidade de São Paulo em 2025 (SSP-SP, Dados Criminais) e 336.555 pedidos de "Rua e bairro" ao SP156 em 2025 (Prefeitura de SP, Dados Abertos). Detalhes em [`dados/README.md`](dados/README.md); análise completa em [`analise.ipynb`](analise.ipynb).

**Métodos:** qui-quadrado de aderência e de independência, teste binomial exato com intervalo de confiança de Wilson, razão de chances, correlação de Spearman, bootstrap e um experimento natural com o horário do pôr do sol (calculado para cada dia de 2025).

## Resultados

1. **H1 confirmada para roubo, não para furto.** Entre 19h e 23h acontecem **35,0%** dos roubos a pedestres (IC 95%: 34,7% a 35,4%), contra 20,8% se não houvesse concentração: **1,68 vez** o esperado (p < 0,001). Para furto, a fatia é 22,4% (1,07 vez), uma diferença sem relevância prática: o furto acompanha o movimento do dia. Há também um **segundo pico de roubo entre 4h e 6h**, de quem sai cedo para trabalhar. O resultado se mantém só com a conduta "Transeunte" (33,0%), em dias úteis (36,0%) e no fim de semana (32,4%).
2. **A escuridão pesa, não só o relógio.** Às 18h há mais roubos nos dias em que já está escuro (razão de chances **1,22**; IC 95%: 1,14 a 1,32; p < 0,001). Às 20h, que é sempre noite, não há diferença (1,02; p = 0,46). Quanto mais cedo anoitece no mês, mais roubos às 18h (Spearman ρ = −0,88).
3. **Peso noturno de ~1,4.** Por hora, houve 10,3 roubos a pedestres no escuro e 7,2 no claro: **1,43 vez** (IC 95% por bootstrap: 1,40 a 1,45). É um limite inferior do risco por pessoa, porque à noite há menos gente na rua.
4. **H3 confirmada, com ressalvas.** A fatia de pedidos de calçada e acessibilidade entre os pedidos de rua vai de 28 por mil (São Mateus) a 100 por mil (Sé): **3,6 vezes** (p < 0,001), mais alta nas subprefeituras centrais. Em número absoluto, a concentração entre distritos é moderada (Gini 0,26).
5. **Calçada demora a ser consertada.** Só **6%** dos pedidos de obstáculo na calçada e de calçada particular danificada são finalizados em até 15 dias, e mais da metade ainda não tinha sido finalizada mais de um ano depois. No tapa-buraco, são 66%.

A hipótese 2 do README (iluminação × crime) não pôde ser testada: os dados abertos do SP156 de 2025 não têm categoria de iluminação pública. O resultado 2 responde à mesma pergunta por outro caminho.

## Limitações

* Boletim de ocorrência mede o crime **registrado**; há subnotificação, principalmente de furto.
* A hora é estimada pela vítima e 48% dos furtos não têm hora exata; o resultado do roubo (90% com hora) é o mais confiável.
* Sem dados de fluxo de pedestres por hora, as taxas são por hora do relógio, não por pessoa exposta.
* "Pedestre" foi inferido (via pública + conduta "Transeunte" ou "Outros").
* O experimento do pôr do sol é observacional: a rotina das pessoas também muda entre verão e inverno.
* Reclamação no SP156 mede o problema e também o hábito de reclamar; "Finalizada" é o fim do protocolo, não a garantia de conserto.
* Um ano (2025) e uma cidade.

## Possível uso no Caminho Livre (futuro)

A análise é isolada e não altera o app, mas indica como calibrá-lo:

1. **`peso_noturno` do alerta "Assalto"** de pelo menos **1,4 vez** o `peso_base` (por exemplo, base 5 e noturno 7), ou um **índice por hora** (seção A.6 do notebook), que capta o pico das 19h–22h (até 1,84) e o das 4h–6h.
2. **Noite definida pelo pôr do sol, não pelo relógio:** trocar a janela fixa 19h–6h pelo intervalo entre o anoitecer e o amanhecer de cada dia, calculável só com a data. No inverno, o peso noturno valeria a partir de ~17h50.
3. **Validade dos alertas por categoria (RF14):** 15 dias combina com buraco, mas é curto para calçada quebrada e obstáculo. Sugestão: validade maior (por exemplo, 90 dias) para os alertas de acessibilidade, ou expiração só por negações (👎).
4. **Ranking de bairros (US14) e lançamento:** começar a divulgação pelas regiões centrais e comparar bairros pelo número de usuários ativos, para o mapa não refletir só quem reclama mais.
5. **Se um dia houver categoria "furto",** ela não deveria ter peso noturno.

**ODS:** meta **11.7** (espaços públicos seguros, inclusivos e acessíveis, em especial para mulheres, idosos e pessoas com deficiência) e **ODS 10** (o viés das reclamações para o centro mostra que o app precisa buscar ativamente os usuários da periferia).
