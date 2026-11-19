// c06: mapa genérico, pino do GPS cai e a rota reta se desenha; selo "cidade perfeita"; checklist ✓ entra item a item.
// c07 (corte com assentamento): mesmo mapa, mais perto; três alertas caem sobre a rota, cada um na cor do seu tipo.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Camera } from "../base/Camera";
import { FundoFormas } from "../base/FundoFormas";
import { Icone } from "../base/Icone";
import type { Cena } from "../base/Placeholder";
import { cor, DUR, E, fontFamily, ip } from "../base/tema";
import { gat, inicio } from "./Gancho";

export const MAPA = { l: 900, a: 620 };
export const RUAS_H = [120, 300, 480];
export const RUAS_V = [150, 420, 690];
export const ROTA = [[150, 540], [150, 300], [690, 300], [690, 90]] as const;
const LISTA_X = 490; // centro da coluna do checklist quando o grupo se divide
export const ALERTAS = [
  { palavra: "quebrada", icone: "a06", cor: cor.acessibilidade, x: 150, y: 410 },
  { palavra: "alaga", icone: "a08", cor: cor.clima, x: 420, y: 300 },
  { palavra: "apagado", icone: "a09", cor: cor.seguranca, x: 690, y: 190 },
];
const ITENS = [["calçada", "calçada livre"], ["rua", "rua segura"], ["hora", "qualquer hora"]];

export const Pino: React.FC<{ tamanho: number; fundo: string; children?: React.ReactNode }> = ({ tamanho, fundo, children }) => (
  <div style={{ width: tamanho, height: tamanho, borderRadius: "50% 50% 50% 0", rotate: "-45deg", backgroundColor: fundo, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px rgba(0,0,0,0.3)" }}>
    <div style={{ rotate: "45deg", display: "flex" }}>{children}</div>
  </div>
);

export const MapaGps: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const c07 = inicio(cenas, "c07");
  const gps = gat(cenas, "c06", "GPS");
  const perfeita = gat(cenas, "c06", "perfeita");
  const lista = gat(cenas, "c06", "calçada") - 10;

  // c06: mapa sozinho no centro; quando o checklist chega, o grupo desliza para ficar centrado
  const grupo = ip(f, [lista, lista + 15], [0, -250], E.entrada3);
  // c07: corte com assentamento — entra 5% maior e assenta em ~6 f, mais perto do mapa
  const depois = f >= c07;
  const zoom = depois ? 1.22 * ip(f, [c07, c07 + 6], [1.05, 1], E.entrada) : 1;

  // rota desenhada como polilinha (pathLength 1)
  const rota = ip(f, [gps + 6, gps + 30], [1, 0], E.move);
  const d = ROTA.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const pinoY = ip(f, [gps, gps + DUR.entrada], [-90, 0], E.entrada3);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas />
      <Camera x={0} y={0} zoom={zoom} deriva={0.03}>
        <div style={{
          position: "absolute", left: (depois ? 0 : grupo) - MAPA.l / 2, top: -MAPA.a / 2, width: MAPA.l, height: MAPA.a, borderRadius: 40,
          backgroundColor: "rgba(255,255,255,0.05)", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
          opacity: ip(f, [0, DUR.foco], [0, 1], E.expo), scale: String(ip(f, [0, DUR.entrada], [0.92, 1], E.entrada)),
        }}>
          {RUAS_H.map((y) => <div key={`h${y}`} style={{ position: "absolute", left: 0, top: y - 17, width: MAPA.l, height: 34, backgroundColor: "rgba(255,255,255,0.07)" }} />)}
          {RUAS_V.map((x) => <div key={`v${x}`} style={{ position: "absolute", left: x - 17, top: 0, width: 34, height: MAPA.a, backgroundColor: "rgba(255,255,255,0.07)" }} />)}
          <svg width={MAPA.l} height={MAPA.a} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={d} fill="none" stroke={cor.agua} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={rota} />
          </svg>
          <div style={{ position: "absolute", left: ROTA[0][0] - 16, top: ROTA[0][1] - 16, width: 32, height: 32, borderRadius: "50%", backgroundColor: cor.branco, border: `6px solid ${cor.agua}`, boxSizing: "border-box", opacity: ip(f, [gps, gps + DUR.foco], [0, 1], E.expo) }} />
          <div style={{ position: "absolute", left: ROTA[3][0] - 32, top: ROTA[3][1] - 82 + pinoY, opacity: ip(f, [gps, gps + 6], [0, 1], E.expo) }}>
            <Pino tamanho={64} fundo={cor.agua}><div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: cor.escura }} /></Pino>
          </div>
          {/* selo do GPS: carimba no canto */}
          {!depois && (
            <div style={{
              position: "absolute", left: 40, top: 36, rotate: "-6deg", fontSize: 34, fontWeight: 700, color: cor.escura, backgroundColor: cor.agua,
              padding: "10px 26px", borderRadius: 999, opacity: ip(f, [perfeita, perfeita + 4], [0, 1], E.expo),
              scale: String(ip(f, [perfeita, perfeita + 10], [1.5, 1], E.entrada3)),
            }}>cidade perfeita</div>
          )}
          {/* c07: alertas caem sobre a rota */}
          {ALERTAS.map((a) => {
            const em = gat(cenas, "c07", a.palavra);
            return (
              <React.Fragment key={a.palavra}>
                <div style={{
                  position: "absolute", left: a.x - 60, top: a.y - 60, width: 120, height: 120, borderRadius: "50%", border: `5px solid ${a.cor}`,
                  scale: String(ip(f, [em + 8, em + 30], [0.6, 1.6], E.entrada)), opacity: f < em + 8 ? 0 : ip(f, [em + 8, em + 30], [0.8, 0], E.entrada),
                }} />
                <div style={{
                  position: "absolute", left: a.x - 48, top: a.y - 48, width: 96, height: 96, borderRadius: "50%", backgroundColor: a.cor,
                  display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(0,0,0,0.35)",
                  translate: `0px ${ip(f, [em - 4, em + 8], [-160, 0], Easing.in(Easing.quad))}px`,
                  opacity: ip(f, [em - 4, em], [0, 1], E.expo),
                  scale: f < em + 8 ? "1" : `${ip(f, [em + 8, em + 11], [1.15, 1], E.entrada)} ${ip(f, [em + 8, em + 11], [0.85, 1], E.entrada)}`,
                }}>
                  <Icone id={a.icone} tamanho={56} cor={cor.branco} />
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* checklist do GPS: item a item na fala */}
        {!depois && (
          <div style={{ position: "absolute", left: LISTA_X - 210, top: -150, display: "flex", flexDirection: "column", gap: 34 }}>
            {ITENS.map(([palavra, texto]) => {
              const em = gat(cenas, "c06", palavra);
              return (
                <div key={palavra} style={{ display: "flex", alignItems: "center", gap: 24, opacity: ip(f, [em, em + DUR.foco], [0, 1], E.expo), translate: `${ip(f, [em, em + DUR.entrada], [40, 0], E.entrada3)}px 0px` }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: cor.agua, display: "flex", alignItems: "center", justifyContent: "center", scale: String(ip(f, [em + 2, em + 14], [0.4, 1], E.pulo)) }}>
                    <svg width={34} height={34} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={cor.escura} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div style={{ fontSize: 52, fontWeight: 600, color: cor.branco, whiteSpace: "nowrap" }}>{texto}</div>
                </div>
              );
            })}
          </div>
        )}
      </Camera>
    </AbsoluteFill>
  );
};
