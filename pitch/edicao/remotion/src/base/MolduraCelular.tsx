// Celular plano com sombra suave (identidade: material plano, moldura sempre em volta do app). Tela = print 9:19,5 (1170x2532).
import React from "react";
import { Img, staticFile } from "remotion";

export const MolduraCelular: React.FC<{ print: string; altura?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ print, altura = 840, style, children }) => {
  const borda = Math.round(altura * 0.018);
  const tela = altura - borda * 2;
  const largura = Math.round(tela * (1170 / 2532)) + borda * 2;
  return (
    <div style={{
      width: largura, height: altura, borderRadius: altura * 0.075, backgroundColor: "#11140f", padding: borda, boxSizing: "border-box",
      boxShadow: "0 40px 80px rgba(20,40,20,0.30), 0 8px 20px rgba(20,40,20,0.20)", position: "relative", ...style,
    }}>
      <div style={{ width: "100%", height: "100%", borderRadius: altura * 0.06, overflow: "hidden", position: "relative" }}>
        <Img src={staticFile(print)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {children}
      </div>
    </div>
  );
};
