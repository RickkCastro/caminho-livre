// c05: fundo claro; card da consulta chega com o whip (pela direita, expo.out), filha acende e apaga,
// data riscada e card vira para "remarcada". Sai com a forma verde-escura varrendo a tela (troca para c06).
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Camera } from "../base/Camera";
import { FundoFormas } from "../base/FundoFormas";
import { Icone } from "../base/Icone";
import type { Cena } from "../base/Placeholder";
import { cor, DUR, E, fontFamily, ip } from "../base/tema";
import { gat } from "./Gancho";

const CARD_L = 760;
const FILHA = 150;
const GAP = 48;

export const Remarca: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const fim = cenas[0].fim_f - cenas[0].inicio_f;
  const filha = gat(cenas, "c05", "filha");
  const remarca = gat(cenas, "c05", "remarca");

  // chegada do whip: mesma direção e velocidade da saída da c04 (~560 px, expo.out 15 f)
  const chega = ip(f, [0, 15], [560, 0], E.expo);
  const borrao = ip(f, [0, 10], [12, 0], E.expo);

  // grupo card + filha sempre centralizado: quando a filha chega, o card desliza
  const desloca = ip(f, [filha, filha + 15], [0, -(FILHA + GAP) / 2], E.entrada3);
  const filhaLuz = f < filha + 22 ? ip(f, [filha, filha + DUR.foco], [0, 1], E.expo) : ip(f, [filha + 22, filha + 34], [1, 0], Easing.inOut(Easing.quad));

  // data riscada, depois o card vira (rotateY) e mostra o verso
  const risco = ip(f, [remarca, remarca + 8], [0, 1], E.entrada);
  const vira1 = remarca + 10;
  const vira2 = vira1 + 7;
  const giro = f < vira2 ? ip(f, [vira1, vira2], [0, 90], E.saida) : ip(f, [vira2, vira2 + 12], [-90, 0], E.entrada);
  const verso = f >= vira2;

  // forma verde varrendo no fim (perfil §4): círculo cresce do canto e cobre a tela
  const varre = ip(f, [fim - 18, fim], [0, 1], Easing.inOut(Easing.cubic));

  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      <FundoFormas claro />
      <AbsoluteFill style={{ translate: `${chega}px 0px`, filter: `blur(${borrao}px)` }}>
        <Camera x={0} y={0} zoom={1.22} deriva={0.03}>
          <div style={{ position: "absolute", left: -CARD_L / 2 + desloca, top: -150, perspective: 1600 }}>
            <div style={{
              width: CARD_L, height: 300, borderRadius: 36, backgroundColor: cor.branco, boxShadow: "0 24px 60px rgba(42,75,37,0.16)",
              display: "flex", alignItems: "center", gap: 40, padding: "0 56px", boxSizing: "border-box", rotate: `y ${giro}deg`,
            }}>
              <div style={{ width: 132, height: 132, borderRadius: 32, backgroundColor: verso ? cor.agua : cor.suave, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icone id="a10" tamanho={72} cor={cor.escura} />
              </div>
              <div style={{ color: cor.escura }}>
                <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>Consulta</div>
                <div style={{ fontSize: 34, opacity: 0.7, marginTop: 6 }}>Posto de saúde</div>
                {verso ? (
                  <div style={{ display: "inline-block", marginTop: 16, fontSize: 36, fontWeight: 700, backgroundColor: cor.agua, color: cor.escura, padding: "6px 22px", borderRadius: 999 }}>remarcada</div>
                ) : (
                  <div style={{ position: "relative", display: "inline-block", marginTop: 16, fontSize: 40, fontWeight: 700 }}>
                    qui · 14h
                    <div style={{ position: "absolute", left: -6, top: "52%", height: 6, borderRadius: 3, backgroundColor: cor.seguranca, width: `calc(${risco * 100}% + ${12 * risco}px)` }} />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* filha: acende quando citada e apaga ("não pode ir junto") */}
          <div style={{
            position: "absolute", left: CARD_L / 2 + desloca + GAP, top: -FILHA / 2, width: FILHA, height: FILHA, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: filhaLuz > 0.5 ? cor.agua : "rgba(42,75,37,0.10)",
            opacity: ip(f, [filha, filha + DUR.foco], [0, 1], E.expo), scale: String(ip(f, [filha, filha + DUR.entrada], [0.6, 1], E.pulo)),
          }}>
            <Icone id="a11" tamanho={80} cor={filhaLuz > 0.5 ? cor.escura : "rgba(42,75,37,0.45)"} />
          </div>
        </Camera>
      </AbsoluteFill>
      <div style={{
        position: "absolute", left: 1920 - 2400 * varre / 2 + 200, top: 1080 - 2400 * varre / 2 + 200,
        width: 2400 * varre, height: 2400 * varre, borderRadius: "50%", backgroundColor: cor.escura,
      }} />
    </AbsoluteFill>
  );
};
