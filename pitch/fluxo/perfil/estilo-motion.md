# Estilo de motion — caminho-livre

Origem: refs 01–05 analisadas em 2026-11-17 (`referencias/analise/sintese.md`), confirmado pela pessoa. Tendência, não regra. Seções com a mesma numeração do ofício de motion; onde contraria o ofício, vale este perfil.

Ferramenta: Remotion, 30 fps. Equivalência das curvas GSAP no Remotion:
`power2.out` = `Easing.out(Easing.cubic)` · `power3.out` = `Easing.out(Easing.poly(4))` · `power2.in` = `Easing.in(Easing.cubic)` · `expo.out` = `Easing.out(Easing.exp)` · `power2.inOut` = `Easing.inOut(Easing.cubic)`.

## §1 Velocidade
- Entradas: 12–16 frames a 30 fps (~0,4–0,55 s). Medido: medianas de 12 fr (ref 04), 15,5 fr (ref 02).
- Saídas: mais curtas que a entrada, ~8–10 frames (refs 02, 04).
- Movimentos grandes de composição (celular atravessando, forma varrendo): até ~24 frames (ref 03: mediana 23 fr).

## §2 Curvas
- Entrada: `power2.out` ou `power3.out` (as mais vistas nas refs 02, 04, 05).
- Saída: `power2.in` (refs 02, 04).
- Movimento que vai de um lugar a outro na tela: `power2.inOut`.
- Overshoot: pouco ou nenhum. Nas refs os elementos assentam sem passar do ponto. Se usar, só em ícones e pílulas pequenas, ≤ 5%.

## §3 Câmera virtual
- Zoom suave no ponto do app que a fala explica (o botão, a rota no mapa): 1,0 → 1,3–1,6 em ~20 frames, `power2.inOut` (pedido na decisão 7).
- Deriva contínua lenta enquanto a cena dura (zoom de ~2–3% por cena), para a tela nunca congelar (deriva linear presente em todas as refs).

## §4 Troca de cena
- Preferida: forma orgânica grande da cor da marca varrendo a tela (ref 04).
- Alternativa para trocas rápidas no gancho: borrão de movimento lateral (whip) (ref 01).
- Corte seco quando a fala muda de assunto de forma brusca.

## §5 Entradas e saídas
- Celular entra deslizando e girando levemente até o ângulo final (ref 04).
- Cards de UI saem do celular e empilham ao lado, um por vez, com ~4–6 frames entre eles (ref 04).
- Checklist entra item a item, casado com a fala (ref 01).

## §6 Texto vivo
- Uma frase curta por vez, grande; a palavra-chave em `#76c1a9` (refs 03, 04).
- Texto digitado com cursor para "buscas" e "pedidos" dentro do app (ref 02).
- Número que conta subindo quando a fala cita um dado (ref 04).

## §8 Movimento secundário
- Sempre algo se movendo de leve: formas de fundo flutuando, deriva de câmera. Amplitude pequena, linear e contínua.

## Densidade por trecho (decisão 7)
- Algo muda na tela a cada 3–5 s, casado com a fala (cena mediana 5,3 s na ref 04, 3,2 s na ref 05).
- Gancho (10–15 s iniciais) e fechamento: mais denso, trocas de até ~1,5 s (refs 02, 03).
- Demonstração do app: mais calmo, cenas de 4–6 s, para dar tempo de ler.

## Composição (decisão 7)
- Boards em tela cheia (problema, números, proposta), app em destaque (moldura sobre fundo da marca, com zoom no ponto explicado) e diagramas montados passo a passo.
