// Câmera virtual: o contêiner de fora aproxima/recua (x, y, zoom com ease), o de dentro faz a deriva linear a cena toda
// (ofício §3: camadas separadas para o zoom não engasgar). Filhos usam coordenadas do mundo com (0,0) no centro.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Camera: React.FC<{ x: number; y: number; zoom: number; deriva?: number; children: React.ReactNode }> = ({
  x, y, zoom, deriva = 0.03, children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const d = interpolate(frame, [0, durationInFrames], [1, 1 + deriva]);
  return (
    <AbsoluteFill style={{ scale: String(zoom), translate: `${-x * zoom}px ${-y * zoom}px` }}>
      <AbsoluteFill style={{ scale: String(d) }}>
        <div style={{ position: "absolute", left: "50%", top: "50%" }}>{children}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Põe o centro do filho no ponto (x, y) do mundo
export const Em: React.FC<{ x: number; y: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ x, y, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", ...style }}>{children}</div>
);
