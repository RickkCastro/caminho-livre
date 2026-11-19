// Fundo da marca com formas orgânicas grandes em deriva lenta e linear, só nas bordas (ofício §7, perfil §8)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cor } from "./tema";

const FORMAS = [
  { x: -180, y: -220, r: 520, vx: 0.25, vy: 0.12 },
  { x: 1650, y: 760, r: 640, vx: -0.2, vy: -0.1 },
  { x: 1540, y: -260, r: 380, vx: -0.15, vy: 0.18 },
  { x: 120, y: 900, r: 300, vx: 0.18, vy: -0.14 },
];

export const FundoFormas: React.FC<{ claro?: boolean }> = ({ claro }) => {
  const f = useCurrentFrame();
  const fundo = claro ? cor.suave : cor.escura;
  const forma = claro ? "rgba(42,75,37,0.06)" : "rgba(118,193,169,0.08)";
  return (
    <AbsoluteFill style={{ backgroundColor: fundo, overflow: "hidden" }}>
      {FORMAS.map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: s.r * 2, height: s.r * 2, borderRadius: "50%", backgroundColor: forma,
          left: s.x - s.r + s.vx * f, top: s.y - s.r + s.vy * f,
        }} />
      ))}
    </AbsoluteFill>
  );
};
