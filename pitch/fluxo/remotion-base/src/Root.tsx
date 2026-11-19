import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import dados from "./dados.json";
import { Video } from "./Video";

// Rascunho 720p: o mesmo Video reduzido a 2/3 (o --scale do CLI dá altura fracionária e falha)
const Rascunho: React.FC = () => (
  <AbsoluteFill style={{ width: 1920, height: 1080, scale: String(2 / 3), transformOrigin: "0 0" }}>
    <Video />
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Video" component={Video} durationInFrames={dados.duracao_f} fps={dados.fps} width={1920} height={1080} />
    <Composition id="Rascunho" component={Rascunho} durationInFrames={dados.duracao_f} fps={dados.fps} width={1280} height={720} />
  </>
);
