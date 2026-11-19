// c10: chega do speed ramp (de baixo); logo monta, nome escreve; pinos azuis e vermelhos surgem em volta; sai empurrando a câmera.
// c11: volta o mapa da c07 (chega com o zoom ainda vindo); a rota reta apaga e a rota verde desvia dos alertas.
// c12: corte com assentamento; frase + celular girado com 03-mapa; "não vê." em marca-texto; sai com a forma varrendo.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Camera } from "../base/Camera";
import { FormaVarre } from "../base/FormaVarre";
import { FundoFormas } from "../base/FundoFormas";
import { Icone } from "../base/Icone";
import { MolduraCelular } from "../base/MolduraCelular";
import type { Cena } from "../base/Placeholder";
import { TextoDigitado } from "../base/TextoDigitado";
import { cor, DUR, E, fontFamily, ip } from "../base/tema";
import { gat } from "./Gancho";
import { ALERTAS, MAPA, Pino, ROTA, RUAS_H, RUAS_V } from "./Mapa";

const PINOS = [
  { palavra: "obstáculos", cor: cor.acessibilidade, x: -700, y: -270 },
  { palavra: "obstáculos", cor: cor.acessibilidade, x: -60, y: 260 },
  { palavra: "obstáculos", cor: cor.acessibilidade, x: 560, y: -250 },
  { palavra: "inseguros", cor: cor.seguranca, x: -230, y: -300 },
  { palavra: "inseguros", cor: cor.seguranca, x: 380, y: 270 },
  { palavra: "inseguros", cor: cor.seguranca, x: -740, y: 250 },
];

export const Logo: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const fim = cenas[0].fim_f - cenas[0].inicio_f;
  const nome = gat(cenas, "c10", "Caminho");
  // chegada do speed ramp: mesma direção da saída da c09 (para cima), freia em expo.out
  const chega = ip(f, [0, 30], [560, 0], E.expo);
  const borrao = ip(f, [0, 10], [14, 0], E.expo);
  // grupo símbolo + nome sempre centrado: o símbolo nasce no centro e desliza quando o nome escreve
  const desloca = ip(f, [nome, nome + 15], [0, -400], E.entrada3);
  // saída contínua: a câmera empurra para dentro (power4.in) e a c11 chega com o zoom ainda vindo
  const empurra = Math.exp(ip(f, [fim - 15, fim], [0, Math.log(1.35)], Easing.in(Easing.poly(4))));
  const borraoSai = ip(f, [fim - 8, fim], [0, 10], Easing.in(Easing.poly(4)));
  const contagem: Record<string, number> = {};
  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      <FundoFormas />
      <AbsoluteFill style={{ translate: `0px ${chega}px`, filter: `blur(${borrao + borraoSai}px)` }}>
        <Camera x={0} y={0} zoom={empurra} deriva={0.04}>
          <div style={{
            position: "absolute", left: desloca - 110, top: -110, width: 220, height: 220, borderRadius: 56, backgroundColor: cor.agua,
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px rgba(0,0,0,0.3)",
            scale: String(ip(f, [2, 2 + DUR.entrada], [0.6, 1], E.pulo)),
          }}>
            <Icone id="a01" tamanho={140} cor={cor.escura} />
          </div>
          <div style={{ position: "absolute", left: desloca + 150, top: -72 }}>
            <TextoDigitado em={nome} texto="Caminho Livre" style={{ fontSize: 124, fontWeight: 700, color: cor.branco, letterSpacing: -2, lineHeight: "144px" }} />
          </div>
          {PINOS.map((p, i) => {
            const n = (contagem[p.palavra] = (contagem[p.palavra] ?? -1) + 1);
            const em = gat(cenas, "c10", p.palavra) + n * 3; // cascata de 3 f entre irmãos
            return (
              <div key={i} style={{
                position: "absolute", left: p.x - 40, top: p.y - 100,
                opacity: ip(f, [em, em + 6], [0, 1], E.expo),
                translate: `0px ${ip(f, [em, em + DUR.entrada], [-70, 0], E.entrada3)}px`,
                scale: String(ip(f, [em, em + DUR.entrada], [0.6, 1], E.pulo)),
              }}>
                <Pino tamanho={80} fundo={p.cor}><div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: cor.branco }} /></Pino>
              </div>
            );
          })}
        </Camera>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// rua extra à direita para a rota poder contornar os três alertas
export const RUA_DESVIO = 820;
export const DESVIO = [[150, 540], [150, 480], [RUA_DESVIO, 480], [RUA_DESVIO, 120], [690, 120], [690, 90]] as const;
export const caminho = (pts: readonly (readonly [number, number])[]) => pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");

export const Desvio: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const desv = gat(cenas, "c11", "desviando");
  // chega com o zoom da c10 ainda vindo (expo.out), mesma direção
  const zoom = Math.exp(ip(f, [0, 20], [Math.log(1.22 * 1.3), Math.log(1.22)], E.expo));
  const borrao = ip(f, [0, 8], [10, 0], E.expo);
  const velha = ip(f, [desv - 6, desv + 6], [1, 0.25], E.move);
  const nova = ip(f, [desv - 4, desv + 26], [1, 0], E.move);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas />
      <AbsoluteFill style={{ filter: `blur(${borrao}px)` }}>
        <Camera x={0} y={0} zoom={zoom} deriva={0.03}>
          <div style={{ position: "absolute", left: -MAPA.l / 2, top: -MAPA.a / 2, width: MAPA.l, height: MAPA.a, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.05)", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.25)" }}>
            {RUAS_H.map((y) => <div key={`h${y}`} style={{ position: "absolute", left: 0, top: y - 17, width: MAPA.l, height: 34, backgroundColor: "rgba(255,255,255,0.07)" }} />)}
            {[...RUAS_V, RUA_DESVIO].map((x) => <div key={`v${x}`} style={{ position: "absolute", left: x - 17, top: 0, width: 34, height: MAPA.a, backgroundColor: "rgba(255,255,255,0.07)" }} />)}
            <svg width={MAPA.l} height={MAPA.a} style={{ position: "absolute", left: 0, top: 0 }}>
              <path d={caminho(ROTA)} fill="none" stroke={velha > 0.6 ? cor.agua : cor.suave} strokeOpacity={velha} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={velha > 0.6 ? undefined : "18 16"} />
              <path d={caminho(DESVIO)} fill="none" stroke={cor.agua} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={nova} />
            </svg>
            <div style={{ position: "absolute", left: ROTA[0][0] - 16, top: ROTA[0][1] - 16, width: 32, height: 32, borderRadius: "50%", backgroundColor: cor.branco, border: `6px solid ${cor.agua}`, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: ROTA[3][0] - 32, top: ROTA[3][1] - 82 }}>
              <Pino tamanho={64} fundo={cor.agua}><div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: cor.escura }} /></Pino>
            </div>
            {ALERTAS.map((a) => (
              <div key={a.palavra} style={{ position: "absolute", left: a.x - 48, top: a.y - 48, width: 96, height: 96, borderRadius: "50%", backgroundColor: a.cor, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(0,0,0,0.35)" }}>
                <Icone id={a.icone} tamanho={56} cor={cor.branco} />
              </div>
            ))}
          </div>
        </Camera>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const FraseCelular: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const fim = cenas[0].fim_f - cenas[0].inicio_f;
  const cel = gat(cenas, "c12", "mapa");
  const nao = gat(cenas, "c12", "não");
  // corte com assentamento: entra 5% maior e assenta em 6 f
  const assenta = ip(f, [0, 6], [1.05, 1], E.entrada);
  // frase nasce no centro e desliza para a esquerda quando o celular chega
  const desloca = ip(f, [cel, cel + 15], [0, -280], E.entrada3);
  const marca = ip(f, [nao, nao + 10], [0, 1], E.entrada3);
  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      <FundoFormas claro />
      <Camera x={0} y={0} zoom={assenta} deriva={0.03}>
        <div style={{ position: "absolute", left: desloca, top: 0, translate: "-50% -50%" }}>
          <div style={{ fontSize: 92, fontWeight: 700, color: cor.escura, letterSpacing: -1.5, lineHeight: 1.15, whiteSpace: "nowrap", opacity: ip(f, [0, DUR.foco], [0, 1], E.expo) }}>
            <div>O mapa que mostra</div>
            <div>o que o GPS{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                <span style={{ position: "absolute", left: -12, right: -12, top: "16%", bottom: "2%", borderRadius: 14, backgroundColor: cor.agua, transformOrigin: "0 50%", scale: `${marca} 1` }} />
                <span style={{ position: "relative" }}>não vê.</span>
              </span>
            </div>
          </div>
        </div>
        <div style={{
          position: "absolute", left: 560 - 200, top: -430,
          opacity: ip(f, [cel, cel + DUR.foco], [0, 1], E.expo),
          translate: `${ip(f, [cel, cel + DUR.grande], [320, 0], E.entrada)}px 0px`,
          rotate: `${ip(f, [cel, cel + DUR.grande], [16, 6], E.entrada)}deg`,
        }}>
          <MolduraCelular print="prints/03-mapa.png" altura={860} />
        </div>
      </Camera>
      <FormaVarre de={fim - 18} cor={cor.escura} />
    </AbsoluteFill>
  );
};
