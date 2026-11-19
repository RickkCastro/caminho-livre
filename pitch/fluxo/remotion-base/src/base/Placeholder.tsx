// Cena ainda não construída: marcador visível com o id e a descrição do plano, nunca um genérico
import React from "react";
import { AbsoluteFill } from "remotion";
import { cor, fontFamily } from "./tema";

export type Cena = { id: string; inicio_f: number; fim_f: number; tipo: string; descricao: string; gatilhos: { palavra: string; f: number; o_que: string }[] };

export const Placeholder: React.FC<{ cena: Cena }> = ({ cena }) => (
  <AbsoluteFill style={{ backgroundColor: "#333", color: cor.branco, fontFamily, justifyContent: "center", alignItems: "center", padding: 160, textAlign: "center" }}>
    <div style={{ fontSize: 40, fontWeight: 700, color: "#ff8a80" }}>AINDA NÃO CONSTRUÍDA · {cena.id}</div>
    <div style={{ fontSize: 30, marginTop: 24, lineHeight: 1.4 }}>{cena.descricao}</div>
  </AbsoluteFill>
);
