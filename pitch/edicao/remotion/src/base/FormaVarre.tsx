// Troca de cena preferida do perfil (§4): círculo da cor da marca cresce de um canto e cobre a tela
import React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { ip } from "./tema";

export const FormaVarre: React.FC<{ de: number; dur?: number; cor: string; canto?: "dir" | "esq" }> = ({ de, dur = 18, cor, canto = "dir" }) => {
  const f = useCurrentFrame();
  const t = ip(f, [de, de + dur], [0, 1], Easing.inOut(Easing.cubic));
  const d = 2600 * t;
  const cx = canto === "dir" ? 1920 + 200 : -200;
  return <div style={{ position: "absolute", left: cx - d / 2, top: 1080 + 200 - d / 2, width: d, height: d, borderRadius: "50%", backgroundColor: cor }} />;
};
