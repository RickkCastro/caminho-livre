// Texto que se escreve letra a letra (~23 caracteres/s), cada letra com borda suave (ofício §6)
import React from "react";
import { useCurrentFrame } from "remotion";
import { E, ip } from "./tema";

export const TextoDigitado: React.FC<{ em: number; texto: string; style?: React.CSSProperties; porSegundo?: number }> = ({ em, texto, style, porSegundo = 23 }) => {
  const f = useCurrentFrame();
  const passo = 30 / porSegundo;
  return (
    <div style={{ whiteSpace: "pre", ...style }}>
      {texto.split("").map((c, i) => {
        const t = em + i * passo;
        return <span key={i} style={{ opacity: ip(f, [t, t + 5], [0, 1], E.expo), filter: `blur(${ip(f, [t, t + 5], [6, 0], E.expo)}px)` }}>{c}</span>;
      })}
    </div>
  );
};
