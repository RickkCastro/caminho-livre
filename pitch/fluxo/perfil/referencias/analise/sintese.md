# Síntese das referências (2026-11-17)

Medido com `scripts/ref_cenas.py` e `scripts/ref_medir.py` (fluxo óptico de toda a imagem, câmera e elementos juntos). Curvas com erro < 0,08 contam como "ajuste bom". "linear" quase sempre é deriva contínua lenta (elementos flutuando, câmera andando), não uma entrada.

| Ref | Vídeo | fps | Cena mediana | Movimento mediano | Curvas de entrada mais vistas | O que se vê |
|---|---|---|---|---|---|---|
| 01 | Sebrae RS, pitch | 29,97 | (slides longos, ~17 s) | 11 fr (~0,37 s) | quase tudo deriva linear | Ilustração plana, fundos de cor chapada por slide (verde-água, rosa, azul, lilás), checklist que entra item a item, transições com borrão de movimento (whip). Serve mais ao roteiro (estrutura do pitch). |
| 02 | Google Vids | 29,97 | 1,47 s | 15,5 fr (~0,52 s) | power2/3.out, power1.out, expo.out; power2.in nas saídas | Fundo branco com gradiente pastel, texto digitado com cursor, pílulas de UI, cursor de mouse clicando, cortes muito rápidos. |
| 03 | Apple Creator Studio | 23,976 | 1,75 s | 23 fr (~0,96 s) | power2/3.out, inOut | Fundo preto, uma frase curta por vez ("One subscription."), tipografia que se transforma, UI que monta em camadas. |
| 04 | Groundswell (Vidico) | 23,976 | 5,30 s | 12 fr (~0,50 s) | power2.out, power3.out; power2.in nas saídas | **Verde-escuro + fundo off-white (quase a paleta do Caminho Livre)**. Logo que monta, celular em moldura que entra girando, cards de notificação que empilham ao lado, formas orgânicas grandes que varrem a tela na troca de cena, frase curta + celular, número que conta ("$100 → $1000"). |
| 05 | ConversBank (Burnwe) | 25 | 3,24 s | 35 fr (~1,4 s) | power3.out, power1.out, inOut | Vidro/gradiente azul, muitos celulares inclinados em 3D, câmera lenta e contínua, modo claro ↔ escuro. Mais premium e mais pesado de fazer. |

## Tendências (para o perfil, a confirmar com a pessoa)
- Entradas desacelerando no fim (power2.out / power3.out), ~12–16 frames a 30 fps (~0,4–0,55 s). Saídas mais curtas, acelerando (power2.in).
- Algo sempre se movendo de leve (deriva linear) entre as entradas: a tela nunca congela.
- Cena média de 3–5 s na explicação (refs 04, 05); cortes de 1,5 s só em montagens rápidas (gancho, ref 02/03).
- Uma frase curta por vez, grande, ao lado do celular (refs 03, 04).
- App sempre dentro de moldura de celular, levemente girada, com cards de UI saindo dela (refs 04, 05).
- Troca de cena com forma grande da cor da marca varrendo a tela (ref 04) ou borrão de movimento (ref 01).
