// Cores e fonte vêm de tema.json (gerado do perfil por animar_dados.py); curvas do estilo-motion num lugar só.
import { Easing, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import tema from "../tema.json";

export const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
export const cor = tema.cores;

// estilo-motion §2: entrada power2/power3.out, saída power2.in, deslocamento power2.inOut, overshoot ≤ 5%
export const E = {
  entrada: Easing.out(Easing.cubic),
  entrada3: Easing.out(Easing.poly(4)),
  saida: Easing.in(Easing.cubic),
  move: Easing.inOut(Easing.cubic),
  expo: Easing.out(Easing.exp),
  pulo: Easing.out(Easing.back(0.8)), // ~4% de overshoot, só ícones e pílulas
  linear: Easing.linear,
};

// estilo-motion §1, em frames a 30 fps
export const DUR = { entrada: 14, saida: 9, foco: 8, grande: 24, camera: 20 };

export const ip = (f: number, [a, b]: [number, number], [x, y]: [number, number], easing = E.entrada) =>
  interpolate(f, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
