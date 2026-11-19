// Composição principal: narração + uma <Sequence> por cena no frame do plano (dados.json, gerado por animar_dados.py)
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import dados from "./dados.json";
import { Placeholder, type Cena } from "./base/Placeholder";
import { CENAS } from "./cenas/registro";
import { Efeitos, Musica } from "./Som";

const cenas = dados.cenas as Cena[];

// faixas ligáveis: o mesmo vídeo sai só com narração, só com efeitos, só com música ou mixado
export type Faixas = { narracao?: boolean; efeitos?: boolean; musica?: boolean };

export const Video: React.FC<Faixas> = ({ narracao = true, efeitos = false, musica = false }) => {
  const blocos: React.ReactNode[] = [];
  for (let i = 0; i < cenas.length; i++) {
    const c = cenas[i];
    const reg = CENAS[c.id];
    let j = i;
    if (reg?.ate) while (cenas[j].id !== reg.ate) j++;
    const grupo = cenas.slice(i, j + 1);
    blocos.push(
      <Sequence key={c.id} name={grupo.map((g) => g.id).join("+")} from={c.inicio_f} durationInFrames={cenas[j].fim_f - c.inicio_f}>
        {reg ? <reg.comp cenas={grupo} /> : <Placeholder cena={c} />}
      </Sequence>,
    );
    i = j;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {blocos}
      {narracao && dados.narracao ? <Audio src={staticFile(dados.narracao)} /> : null}
      {efeitos ? <Efeitos /> : null}
      {musica ? <Musica total={dados.duracao_f} /> : null}
    </AbsoluteFill>
  );
};
