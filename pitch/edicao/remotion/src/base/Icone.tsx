// Ícone SVG de uma cor embutido em dados.json (nada para carregar no render); recolore por `color`
import React from "react";
import dados from "../dados.json";

export const Icone: React.FC<{ id: string; tamanho: number; cor: string; style?: React.CSSProperties }> = ({ id, tamanho, cor, style }) => {
  const svg = (dados.icones as Record<string, string>)[id];
  if (!svg) return <div style={{ width: tamanho, height: tamanho, border: "3px dashed red", color: "red", fontSize: 14 }}>FALTA {id}</div>;
  return <div style={{ width: tamanho, height: tamanho, color: cor, display: "flex", ...style }} dangerouslySetInnerHTML={{ __html: svg }} />;
};
