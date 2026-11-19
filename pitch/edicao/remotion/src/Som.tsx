// Efeitos e música do som.json (gerado por som_gravar.py). Efeito: <Audio> na <Sequence> do seu frame, volume em dB.
// Música: loop repetido em Sequences, volume por frame absoluto seguindo a curva de abaixamento sob a voz.
import React from "react";
import { interpolate, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import som from "./som.json";

const lin = (db: number) => Math.pow(10, db / 20);

export const Efeitos: React.FC = () => (
  <>
    {som.efeitos.map((e) => (
      <Sequence key={e.id} name={e.id} from={e.from} durationInFrames={e.dur_f}>
        <Audio src={staticFile(e.arquivo)} volume={lin(e.db)} />
      </Sequence>
    ))}
  </>
);

// curva estritamente crescente para o interpolate
const pts = som.musica.chaves.filter((p, i, a) => i === 0 || p[0] > a[i - 1][0]);
const curva = (f: number) => interpolate(f, pts.map((p) => p[0]), pts.map((p) => p[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Musica: React.FC<{ total: number }> = ({ total }) => {
  const L = som.musica.loop_f;
  const n = Math.ceil(total / L);
  return (
    <>
      {Array.from({ length: n }).map((_, k) => (
        <Sequence key={k} name={`musica ${k + 1}`} from={k * L} durationInFrames={Math.min(L, total - k * L)}>
          <Audio src={staticFile(som.musica.arquivo)} volume={(f) => lin(som.musica.db + curva(f + k * L))} />
        </Sequence>
      ))}
    </>
  );
};
