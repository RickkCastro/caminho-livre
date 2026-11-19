// c08: fundo claro, "Quem passa ali sabe." — "sabe" ganha o marca-texto verde-água na palavra; sai com a forma varrendo.
// c09: fundo escuro, "Faltava um lugar / pra registrar" — "registrar" acende e o pino com "+" cai ao lado; sai em speed ramp.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Camera } from "../base/Camera";
import { FormaVarre } from "../base/FormaVarre";
import { FundoFormas } from "../base/FundoFormas";
import type { Cena } from "../base/Placeholder";
import { cor, DUR, E, fontFamily, ip } from "../base/tema";
import { gat } from "./Gancho";
import { Pino } from "./Mapa";

// título curto entra inteiro (opacidade, foco e subida curta)
const entra = (f: number, em: number) => ({
  opacity: ip(f, [em, em + DUR.foco], [0, 1], E.expo),
  filter: `blur(${ip(f, [em, em + DUR.foco], [10, 0], E.expo)}px)`,
  translate: `0px ${ip(f, [em, em + DUR.entrada], [36, 0], E.entrada3)}px`,
});

export const QuemPassa: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const fim = cenas[0].fim_f - cenas[0].inicio_f;
  const sabe = gat(cenas, "c08", "sabe");
  const marca = ip(f, [sabe, sabe + 10], [0, 1], E.entrada3);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas claro />
      <Camera x={0} y={0} zoom={1} deriva={0.04}>
        <div style={{ position: "absolute", left: 0, top: 0, translate: "-50% -50%" }}><div style={{ whiteSpace: "nowrap", fontSize: 120, fontWeight: 700, color: cor.escura, letterSpacing: -2, ...entra(f, 2) }}>
          Quem passa ali{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{ position: "absolute", left: -14, right: -14, top: "18%", bottom: "4%", borderRadius: 16, backgroundColor: cor.agua, transformOrigin: "0 50%", scale: `${marca} 1` }} />
            <span style={{ position: "relative" }}>sabe.</span>
          </span>
        </div></div>
      </Camera>
      <FormaVarre de={fim - 18} cor={cor.escura} />
    </AbsoluteFill>
  );
};

export const Registrar: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const fim = cenas[0].fim_f - cenas[0].inicio_f;
  const reg = gat(cenas, "c09", "registrar");
  // grupo texto + pino centralizado: quando o pino chega, o texto desliza para a esquerda
  const desloca = ip(f, [reg, reg + 15], [0, -130], E.entrada3);
  const luz = ip(f, [reg, reg + DUR.foco], [0, 1], E.expo);
  // speed ramp de saída (ofício §4): acelera para cima ~1 s, power4.in, com borrão
  const sai = ip(f, [fim - 24, fim], [0, -700], Easing.in(Easing.poly(4)));
  const borrao = ip(f, [fim - 12, fim], [0, 16], Easing.in(Easing.poly(4)));
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas />
      <AbsoluteFill style={{ translate: `0px ${sai}px`, filter: `blur(${borrao}px)` }}>
        <Camera x={0} y={0} zoom={1} deriva={0.04}>
          <div style={{ position: "absolute", left: desloca, top: 0, translate: "-50% -50%" }}><div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1.12, color: cor.branco, letterSpacing: -1.5, whiteSpace: "nowrap", ...entra(f, 2) }}>
            <div>Faltava um lugar</div>
            <div>pra <span style={{ color: luz > 0.5 ? cor.agua : cor.branco }}>registrar</span></div>
          </div></div>
          <div style={{
            position: "absolute", left: desloca + 470, top: -40,
            opacity: ip(f, [reg, reg + 6], [0, 1], E.expo),
            translate: `0px ${ip(f, [reg, reg + DUR.entrada], [-120, 0], E.entrada3)}px`,
            scale: String(ip(f, [reg, reg + DUR.entrada], [0.7, 1], E.pulo)),
          }}>
            <Pino tamanho={150} fundo={cor.agua}>
              <svg width={70} height={70} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke={cor.escura} strokeWidth={3.4} strokeLinecap="round" /></svg>
            </Pino>
          </div>
        </Camera>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
