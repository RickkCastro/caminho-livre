// Pílula de texto curta: entra com escala e foco (perfil §1–2), overshoot pequeno
import React from "react";
import { useCurrentFrame } from "remotion";
import { DUR, E, fontFamily, ip } from "./tema";

export const Pilula: React.FC<{ em: number; texto: string; fundo: string; cor: string; tamanho?: number }> = ({ em, texto, fundo, cor, tamanho = 34 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      fontFamily, fontWeight: 600, fontSize: tamanho, color: cor, backgroundColor: fundo, whiteSpace: "nowrap",
      padding: `${tamanho * 0.32}px ${tamanho * 0.7}px`, borderRadius: 999,
      opacity: ip(f, [em, em + DUR.foco], [0, 1], E.expo),
      filter: `blur(${ip(f, [em, em + DUR.foco], [8, 0], E.expo)}px)`,
      scale: String(ip(f, [em, em + DUR.entrada], [0.6, 1], E.pulo)),
      transformOrigin: "left center",
    }}>{texto}</div>
  );
};
