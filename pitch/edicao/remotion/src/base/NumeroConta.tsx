// Número que conta do zero até o valor quando a fala cita o dado (perfil §6)
import React from "react";
import { useCurrentFrame } from "remotion";
import { E, ip } from "./tema";

export const NumeroConta: React.FC<{ em: number; ate: number; dur?: number; sufixo?: React.ReactNode; style?: React.CSSProperties }> = ({ em, ate, dur = 20, sufixo, style }) => {
  const f = useCurrentFrame();
  const v = Math.round(ip(f, [em, em + dur], [0, ate], E.entrada3));
  return (
    <div style={{ ...style, opacity: ip(f, [em, em + 6], [0, 1], E.expo), fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
      {v.toLocaleString("pt-BR")}{sufixo}
    </div>
  );
};
