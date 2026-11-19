import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import dados from "./dados.json";
import { Video, type Faixas } from "./Video";

// versão reduzida do mesmo Video (o --scale do CLI dá altura fracionária e falha)
const Reduzido: React.FC<Faixas & { escala: number }> = ({ escala, ...faixas }) => (
  <AbsoluteFill style={{ width: 1920, height: 1080, scale: String(escala), transformOrigin: "0 0" }}>
    <Video {...faixas} />
  </AbsoluteFill>
);

const base = { durationInFrames: dados.duracao_f, fps: dados.fps };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Video" component={Video} {...base} width={1920} height={1080} defaultProps={{ narracao: true, efeitos: false, musica: false }} />
    <Composition id="Final" component={Video} {...base} width={1920} height={1080} defaultProps={{ narracao: true, efeitos: true, musica: true }} />
    <Composition id="Rascunho" component={Reduzido} {...base} width={1280} height={720} defaultProps={{ escala: 2 / 3, narracao: true }} />
    <Composition id="SoEfeitos" component={Reduzido} {...base} width={640} height={360} defaultProps={{ escala: 1 / 3, narracao: false, efeitos: true }} />
    <Composition id="SoMusica" component={Reduzido} {...base} width={640} height={360} defaultProps={{ escala: 1 / 3, narracao: false, musica: true }} />
  </>
);
