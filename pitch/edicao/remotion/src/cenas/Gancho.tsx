// Gancho, mesmo mundo sem corte: c01 (Dona Marta nasce) → c02 (recuo revela casa, posto, 600 m)
// → c03 ("Parece perto.", recua mais e reaproxima) → c04 (herói: ponto anda, guia alta sobe, volta) → whip lateral.
// Tempos dos gatilhos vêm de dados.json; aqui só durações de animação.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Camera, Em } from "../base/Camera";
import { FundoFormas } from "../base/FundoFormas";
import { Icone } from "../base/Icone";
import { NumeroConta } from "../base/NumeroConta";
import { Pilula } from "../base/Pilula";
import { TextoDigitado } from "../base/TextoDigitado";
import type { Cena } from "../base/Placeholder";
import { cor, DUR, E, fontFamily, ip } from "../base/tema";

// frame do gatilho dentro do grupo (relativo ao início da primeira cena)
export const gat = (cenas: Cena[], id: string, palavra: string) => {
  const c = cenas.find((x) => x.id === id)!;
  const g = c.gatilhos.find((x) => x.palavra === palavra);
  if (!g) throw new Error(`gatilho ${id}/${palavra} não está no plano`);
  return c.inicio_f - cenas[0].inicio_f + g.f;
};
export const inicio = (cenas: Cena[], id: string) => cenas.find((x) => x.id === id)!.inicio_f - cenas[0].inicio_f;

const MARTA = { x: -560, y: -110 };
export const CASA = { x: -560, y: 200 };
export const POSTO = { x: 560, y: 200 };
const NOME_X = MARTA.x + 140; // nome começa à direita do círculo
export const CARD = 150;
export const LINHA = { de: CASA.x + CARD / 2 + 20, ate: POSTO.x - CARD / 2 - 20, y: CASA.y };
export const GUIA = { x: 200, larg: 64, alt: 96 }; // degrau azul sobre a linha
const RAMPA = 150; // largura da rampa que deveria existir antes da guia

// in-out assimétrico com pico em ~30% (ofício §2, punch)
const punch = (f: number, em: number, dur: number, pico: number) =>
  f < em + dur * 0.3 ? ip(f, [em, em + dur * 0.3], [1, pico], Easing.in(Easing.exp)) : ip(f, [em + dur * 0.3, em + dur], [pico, 1], E.expo);

const Lugar: React.FC<{ icone: string; em: number; aceso?: number }> = ({ icone, em, aceso }) => {
  const f = useCurrentFrame();
  const luz = aceso === undefined ? 0 : ip(f, [aceso, aceso + DUR.foco], [0, 1], E.expo);
  const pulso = aceso === undefined ? 1 : f < aceso + 6 ? ip(f, [aceso, aceso + 6], [1, 1.1], E.entrada) : ip(f, [aceso + 6, aceso + 20], [1.1, 1], E.move);
  return (
    <div style={{
      width: CARD, height: CARD, borderRadius: 36, display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: luz > 0.5 ? cor.agua : "rgba(255,255,255,0.10)",
      boxShadow: `0 0 ${60 * luz}px rgba(118,193,169,${0.6 * luz})`,
      opacity: ip(f, [em, em + DUR.foco], [0, 1], E.expo),
      scale: String(ip(f, [em, em + DUR.entrada], [0.6, 1], E.pulo) * pulso),
    }}>
      <Icone id={icone} tamanho={80} cor={luz > 0.5 ? cor.escura : cor.suave} />
    </div>
  );
};

// trecho tracejado da linha entre x0 e x1, mostrado até `mostra` (px) a partir de x0
const Tracejado: React.FC<{ x0: number; x1: number; mostra: number; cor: string }> = ({ x0, x1, mostra, cor: c }) => (
  <div style={{ position: "absolute", left: x0, top: LINHA.y - 5, width: Math.max(0, Math.min(mostra, x1 - x0)), height: 10, overflow: "hidden" }}>
    <div style={{ width: x1 - x0, height: 10, borderRadius: 5, backgroundImage: `repeating-linear-gradient(90deg, ${c} 0 28px, transparent 28px 46px)` }} />
  </div>
);

export const Gancho: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const c02 = inicio(cenas, "c02");
  const c03 = inicio(cenas, "c03");
  const c04 = inicio(cenas, "c04");
  const fim = cenas[cenas.length - 1].fim_f - cenas[0].inicio_f;
  const nasce = gat(cenas, "c01", "Imagina");
  const nome = gat(cenas, "c01", "Dona");
  const tentou = gat(cenas, "c04", "tentou");
  const guia = gat(cenas, "c04", "guia");
  const sem = gat(cenas, "c04", "sem");
  const voltar = gat(cenas, "c04", "voltar");

  // ---- câmera: um segmento emenda no outro; a deriva linear corre por baixo o tempo todo
  const grupoX = MARTA.x + 230;
  const recuoFim = c02 + 105; // recuo lento de 3,5 s
  let x: number, y: number, lz: number; // lz = log do zoom (zoom muda em escala perceptual)
  if (f < c02) {
    x = ip(f, [nome, nome + 15], [MARTA.x, grupoX], E.entrada3); y = MARTA.y; lz = Math.log(1.9);
  } else if (f < c03 - 6) {
    x = ip(f, [c02, recuoFim], [grupoX, 0], E.entrada); y = ip(f, [c02, recuoFim], [MARTA.y, 40], E.entrada);
    lz = ip(f, [c02, recuoFim], [Math.log(1.9), 0], E.entrada);
  } else if (f < guia) {
    // c03: recua mais (o caminho parece curto) e reaproxima para a c04
    const meio = c04 - 6;
    x = 0; y = f < meio ? ip(f, [c03 - 6, meio], [40, -50], E.move) : ip(f, [meio, meio + 30], [-50, 40], E.move);
    lz = f < meio ? ip(f, [c03 - 6, meio], [0, Math.log(0.8)], E.move) : ip(f, [meio, meio + 30], [Math.log(0.8), 0], E.move);
  } else {
    // c04: aproxima no degrau 1.0 → 1.4, power2.inOut ~20 f
    x = ip(f, [guia, guia + DUR.camera], [0, GUIA.x - 80], E.move);
    y = ip(f, [guia, guia + DUR.camera], [40, LINHA.y], E.move);
    lz = ip(f, [guia, guia + DUR.camera], [0, Math.log(1.4)], E.move);
  }

  // ---- linha casa → posto: desenhada na c02; à frente da guia fica cinza quando ela volta
  const linhaIni = gat(cenas, "c02", "mora");
  const total = LINHA.ate - LINHA.de;
  const mostra = ip(f, [linhaIni, linhaIni + 20], [0, total], E.move);
  const corte = GUIA.x - LINHA.de;
  const cinza = ip(f, [voltar + 6, voltar + 20], [0, 1], E.move);
  const corFrente = cinza > 0.5 ? "rgba(232,244,239,0.22)" : cor.suave;

  // ---- ponto (Marta andando): sai da casa, anda devagar, bate na guia, treme, volta
  const parada = GUIA.x - GUIA.larg / 2 - 26;
  let px = ip(f, [tentou, guia], [LINHA.de, parada], Easing.inOut(Easing.sin));
  if (f >= guia) px = ip(f, [guia, guia + 8], [parada, parada - 18], E.expo);
  if (f >= voltar) px = ip(f, [voltar, voltar + 36], [parada - 18, LINHA.de], E.move);
  const treme = f >= guia && f < guia + 16 ? Math.sin((f - guia) * 2.6) * ip(f, [guia, guia + 16], [5, 0], E.linear) : 0;

  // c03/c04: o que já foi dito sai de foco, uma coisa protagonista por vez
  const apaga = ip(f, [c04, c04 + 14], [1, 0.12], Easing.inOut(Easing.quad));
  const someNumero = ip(f, [c04, c04 + DUR.saida], [1, 0], E.saida);

  // c03: frase no alto, em tela (fora da câmera)
  const parece = gat(cenas, "c03", "Parece");
  const perto = gat(cenas, "c03", "perto");
  const fraseSai = c04 - 8;

  // ---- whip lateral no fim (power4.in, ~10 f, sai pela esquerda); a c05 chega pela direita
  const whip = ip(f, [fim - 10, fim], [0, -700], Easing.in(Easing.poly(4)));
  const borrao = ip(f, [fim - 10, fim], [0, 14], Easing.in(Easing.poly(4)));

  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      <FundoFormas />
      <AbsoluteFill style={{ translate: `${whip}px 0px`, filter: `blur(${borrao}px)` }}>
        <Camera x={x} y={y} zoom={Math.exp(lz)} deriva={0.04}>
          <Tracejado x0={LINHA.de} x1={GUIA.x} mostra={mostra} cor={cor.suave} />
          <Tracejado x0={GUIA.x} x1={LINHA.ate} mostra={mostra - corte} cor={corFrente} />

          <Em x={CASA.x} y={CASA.y}><Lugar icone="a05" em={c02 + 6} /></Em>
          <Em x={POSTO.x} y={POSTO.y}><Lugar icone="a04" em={c02 + 10} aceso={gat(cenas, "c02", "posto")} /></Em>

          {/* guia alta: degrau azul sobe da linha (herói da c04) */}
          <div style={{
            position: "absolute", left: GUIA.x - GUIA.larg / 2, top: LINHA.y - GUIA.alt + 5, width: GUIA.larg, height: GUIA.alt,
            backgroundColor: cor.acessibilidade, borderRadius: "10px 10px 4px 4px", transformOrigin: "50% 100%",
            boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
            scale: `1 ${ip(f, [guia, guia + DUR.entrada], [0, 1], E.entrada3)}`,
          }} />

          {/* rampa que deveria existir: tracejada, aparece e é riscada */}
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
            <path
              d={`M ${GUIA.x - GUIA.larg / 2 - RAMPA} ${LINHA.y} L ${GUIA.x - GUIA.larg / 2} ${LINHA.y - GUIA.alt + 5} L ${GUIA.x - GUIA.larg / 2} ${LINHA.y} Z`}
              fill="rgba(232,244,239,0.06)" stroke={cor.suave} strokeWidth={5} strokeDasharray="14 10" strokeLinejoin="round"
              opacity={ip(f, [sem, sem + DUR.foco], [0, 1], E.expo)}
            />
            <line
              x1={GUIA.x - GUIA.larg / 2 - RAMPA - 10} y1={LINHA.y - GUIA.alt - 10} x2={GUIA.x - GUIA.larg / 2 + 10} y2={LINHA.y + 15}
              stroke={cor.seguranca} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1}
              strokeDashoffset={ip(f, [sem + 8, sem + 16], [1, 0], E.entrada)}
            />
          </svg>

          {/* ponto = Marta andando */}
          <div style={{
            position: "absolute", left: px + treme - 22, top: LINHA.y - 22, width: 44, height: 44, borderRadius: "50%",
            backgroundColor: cor.agua, border: `6px solid ${cor.branco}`, boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
            opacity: ip(f, [tentou - 12, tentou - 4], [0, 1], E.expo), scale: String(ip(f, [tentou - 12, tentou + 2], [0, 1], E.pulo)),
          }} />

          <Em x={0} y={CASA.y - 90} style={{ opacity: someNumero }}>
            <NumeroConta em={gat(cenas, "c02", "seiscentos")} ate={600} dur={18}
              style={{ fontSize: 120, fontWeight: 700, color: cor.agua, letterSpacing: -2 }}
              sufixo={<span style={{ fontSize: 64, marginLeft: 12 }}>m</span>} />
          </Em>

          {/* Dona Marta: círculo com andador e onda ao nascer */}
          <Em x={MARTA.x} y={MARTA.y} style={{ opacity: apaga }}>
            <div style={{
              position: "absolute", left: -100, top: -100, width: 200, height: 200, borderRadius: "50%", border: `4px solid ${cor.agua}`,
              scale: String(ip(f, [nasce, nasce + 24], [1, 1.7], E.entrada)), opacity: ip(f, [nasce, nasce + 24], [0.7, 0], E.entrada),
            }} />
            <div style={{
              width: 200, height: 200, borderRadius: "50%", backgroundColor: cor.agua, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
              opacity: ip(f, [nasce, nasce + DUR.foco], [0, 1], E.expo),
              scale: String(ip(f, [nasce, nasce + DUR.entrada], [0, 1], E.pulo)),
            }}>
              <Icone id="a03" tamanho={120} cor={cor.escura} />
            </div>
          </Em>
          <div style={{ position: "absolute", left: NOME_X, top: MARTA.y - 70, opacity: apaga }}>
            <TextoDigitado em={nome} texto="Dona Marta" style={{ fontSize: 80, fontWeight: 700, color: cor.branco, lineHeight: "92px" }} />
            <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
              <Pilula em={gat(cenas, "c02", "68")} texto="68 anos" fundo="rgba(255,255,255,0.12)" cor={cor.suave} />
              <Pilula em={gat(cenas, "c02", "andador")} texto="andador" fundo="rgba(255,255,255,0.12)" cor={cor.suave} />
            </div>
          </div>
        </Camera>
      </AbsoluteFill>

      {/* c03: "Parece perto." no alto; "perto" ganha o punch na palavra */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150, pointerEvents: "none" }}>
        <div style={{
          fontSize: 96, fontWeight: 700, color: cor.branco, letterSpacing: -1,
          opacity: f < fraseSai ? ip(f, [parece, parece + DUR.foco], [0, 1], E.expo) : ip(f, [fraseSai, fraseSai + DUR.saida], [1, 0], E.saida),
          filter: `blur(${ip(f, [parece, parece + DUR.foco], [10, 0], E.expo)}px)`,
          translate: f < fraseSai ? `0px ${ip(f, [parece, parece + DUR.entrada], [30, 0], E.entrada3)}px` : `0px ${ip(f, [fraseSai, fraseSai + DUR.saida], [0, -24], E.saida)}px`,
        }}>
          Parece{" "}
          <span style={{ display: "inline-block", color: cor.agua, scale: String(punch(f, perto, 24, 1.14)) }}>perto.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
