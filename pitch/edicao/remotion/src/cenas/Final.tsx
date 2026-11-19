// Diferencial e fechamento (c23–c27).
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Camera, Em } from "../base/Camera";
import { FormaVarre } from "../base/FormaVarre";
import { FundoFormas } from "../base/FundoFormas";
import { Icone } from "../base/Icone";
import { MolduraCelular } from "../base/MolduraCelular";
import type { Cena } from "../base/Placeholder";
import { TextoDigitado } from "../base/TextoDigitado";
import { cor, DUR, E, fontFamily, ip } from "../base/tema";
import { CARD, CASA, gat, GUIA, LINHA, POSTO } from "./Gancho";

const Check: React.FC<{ tamanho: number }> = ({ tamanho }) => (
  <div style={{ width: tamanho, height: tamanho, borderRadius: "50%", backgroundColor: cor.agua, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={tamanho * 0.55} height={tamanho * 0.55} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={cor.escura} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);
const entra = (f: number, em: number, dy = 36) => ({
  opacity: ip(f, [em, em + DUR.foco], [0, 1], E.expo),
  filter: `blur(${ip(f, [em, em + DUR.foco], [10, 0], E.expo)}px)`,
  translate: `0px ${ip(f, [em, em + DUR.entrada], [dy, 0], E.entrada3)}px`,
});

// =====================================================================================
// c23: frase + celular (01-login); checklist dos três cuidados de acessibilidade entra na fala
const SELOS = [["Letra", "letra grande"], ["contraste", "alto contraste"], ["poucos", "poucos passos"]];
export const Acessivel: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas />
      <Camera x={0} y={0} zoom={1} deriva={0.03}>
        <div style={{ position: "absolute", left: -760, top: -190 }}>
          <div style={{ fontSize: 84, fontWeight: 700, color: cor.branco, lineHeight: 1.12, letterSpacing: -1.5, whiteSpace: "nowrap", ...entra(f, 2) }}>
            <div>Pensado pra quem</div>
            <div><span style={{ color: cor.agua }}>mais precisa</span></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 56 }}>
            {SELOS.map(([palavra, texto]) => {
              const em = gat(cenas, "c23", palavra);
              return (
                <div key={palavra} style={{ display: "flex", alignItems: "center", gap: 22, opacity: ip(f, [em, em + DUR.foco], [0, 1], E.expo), translate: `${ip(f, [em, em + DUR.entrada], [40, 0], E.entrada3)}px 0px` }}>
                  <div style={{ scale: String(ip(f, [em + 2, em + 14], [0.4, 1], E.pulo)) }}><Check tamanho={60} /></div>
                  <div style={{ fontSize: 50, fontWeight: 600, color: cor.branco, whiteSpace: "nowrap" }}>{texto}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{
          position: "absolute", left: 300, top: -450,
          opacity: ip(f, [6, 6 + DUR.foco], [0, 1], E.expo),
          translate: `${ip(f, [6, 6 + DUR.grande], [320, 0], E.entrada)}px 0px`,
          rotate: `${ip(f, [6, 6 + DUR.grande], [14, 5], E.entrada)}deg`,
        }}>
          <MolduraCelular print="prints/01-login.png" altura={900} />
        </div>
      </Camera>
    </AbsoluteFill>
  );
};

// =====================================================================================
// c24: fundo claro; Seu Antônio; a tela de senha aparece e cai; no lugar, um botão "Entrar com Google"
export const Antonio: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const nome = gat(cenas, "c24", "Antônio");
  const desiste = gat(cenas, "c24", "desiste");
  const sozinhas = gat(cenas, "c24", "sozinhas");
  const cai = desiste + 26; // "...na primeira tela de senha"
  const desloca = ip(f, [desiste, desiste + 15], [0, -260], E.entrada3);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas claro />
      <Camera x={0} y={0} zoom={ip(f, [0, 6], [1.05, 1], E.entrada)} deriva={0.04}>
        <Em x={desloca} y={-40}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
            <div style={{ width: 220, height: 220, borderRadius: "50%", backgroundColor: cor.agua, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(42,75,37,0.18)", opacity: ip(f, [2, 2 + DUR.foco], [0, 1], E.expo), scale: String(ip(f, [2, 2 + DUR.entrada], [0.5, 1], E.pulo)) }}>
              <Icone id="a11" tamanho={120} cor={cor.escura} />
            </div>
            <TextoDigitado em={nome} texto="Seu Antônio" style={{ fontSize: 64, fontWeight: 700, color: cor.escura }} />
          </div>
        </Em>
        {/* tela de senha: aparece em "desiste" e cai */}
        <Em x={desloca + 520} y={-20}>
          <div style={{
            width: 440, padding: 40, boxSizing: "border-box", borderRadius: 32, backgroundColor: cor.branco, boxShadow: "0 24px 60px rgba(42,75,37,0.18)",
            opacity: ip(f, [desiste, desiste + DUR.foco], [0, 1], E.expo) * (f < cai ? 1 : ip(f, [cai + 10, cai + 18], [1, 0], E.saida)),
            scale: String(ip(f, [desiste, desiste + DUR.entrada], [0.7, 1], E.pulo)),
            translate: `0px ${ip(f, [cai, cai + 18], [0, 700], Easing.in(Easing.cubic))}px`,
            rotate: `${ip(f, [cai, cai + 18], [0, 22], Easing.in(Easing.cubic))}deg`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 700, color: cor.escura }}>
              <Icone id="a12" tamanho={44} cor={cor.escura} /> Senha
            </div>
            <div style={{ marginTop: 26, height: 76, borderRadius: 18, border: "3px solid rgba(42,75,37,0.25)", display: "flex", alignItems: "center", paddingLeft: 24, fontSize: 48, letterSpacing: 10, color: cor.escura }}>••••</div>
            <div style={{ marginTop: 18, fontSize: 26, color: cor.seguranca, fontWeight: 600 }}>senha incorreta</div>
          </div>
        </Em>
        {/* no lugar, um botão só */}
        <Em x={desloca + 520} y={-20}>
          <div style={{
            fontSize: 44, fontWeight: 700, color: cor.escura, backgroundColor: cor.branco, padding: "26px 48px", borderRadius: 24, whiteSpace: "nowrap",
            border: `4px solid ${cor.agua}`, boxShadow: "0 20px 44px rgba(42,75,37,0.18)",
            opacity: ip(f, [sozinhas, sozinhas + DUR.foco], [0, 1], E.expo), scale: String(ip(f, [sozinhas, sozinhas + DUR.entrada], [0.6, 1], E.pulo)),
          }}>Entrar com Google</div>
        </Em>
      </Camera>
    </AbsoluteFill>
  );
};

// =====================================================================================
// c25: cidadão → dados → zeladoria e iluminação; pulsos correm pelos trilhos por trás dos nós; destaque em "agir primeiro"
const NOS = {
  cidadao: { x: -560, y: 0 },
  dados: { x: 0, y: 0 },
  zeladoria: { x: 540, y: -190 },
  iluminacao: { x: 540, y: 190 },
};
const No: React.FC<{ em: number; icone?: string; texto: string; fundo: string; brilho?: number; children?: React.ReactNode }> = ({ em, icone, texto, fundo, brilho = 0, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: ip(f, [em, em + DUR.foco], [0, 1], E.expo) }}>
      <div style={{ width: 170, height: 170, borderRadius: "50%", backgroundColor: fundo, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${70 * brilho}px rgba(118,193,169,${0.7 * brilho}), 0 18px 36px rgba(0,0,0,0.3)`, scale: String(ip(f, [em, em + DUR.entrada], [0.5, 1], E.pulo)) }}>
        {icone ? <Icone id={icone} tamanho={92} cor={cor.escura} /> : children}
      </div>
      <div style={{ fontSize: 44, fontWeight: 700, color: cor.branco, whiteSpace: "nowrap" }}>{texto}</div>
    </div>
  );
};
export const Dados: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const fim = cenas[0].fim_f - cenas[0].inicio_f;
  const cid = gat(cenas, "c25", "cidadão");
  const dad = gat(cenas, "c25", "dados");
  const zel = gat(cenas, "c25", "zeladoria");
  const ilu = gat(cenas, "c25", "iluminação");
  const agir = gat(cenas, "c25", "agir");
  // câmera começa no cidadão e recua conforme o diagrama cresce (sem parar)
  const cx = ip(f, [cid, ilu + 10], [NOS.cidadao.x, 0], E.move);
  const lz = ip(f, [cid, ilu + 10], [Math.log(1.45), 0], E.move);
  const brilho = ip(f, [agir, agir + DUR.foco], [0, 1], E.expo);
  // speed ramp de saída: acelera para cima
  const sai = ip(f, [fim - 24, fim], [0, -700], Easing.in(Easing.poly(4)));
  const borrao = ip(f, [fim - 12, fim], [0, 16], Easing.in(Easing.poly(4)));
  const trilho = (a: { x: number; y: number }, b: { x: number; y: number }, em: number, k: number) => {
    const t = ip(f, [em, em + 16], [0, 1], E.move);
    if (t === 0) return null;
    const fase = ((f - em) % 40) / 40; // pulso correndo pelo trilho, contínuo
    const px = a.x + (b.x - a.x) * fase;
    const py = a.y + (b.y - a.y) * fase;
    return (
      <g key={k}>
        <line x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * t} y2={a.y + (b.y - a.y) * t} stroke="rgba(232,244,239,0.35)" strokeWidth={8} strokeLinecap="round" strokeDasharray="2 18" />
        {f > em + 16 && <circle cx={px} cy={py} r={12} fill={cor.agua} />}
      </g>
    );
  };
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas />
      <AbsoluteFill style={{ translate: `0px ${sai}px`, filter: `blur(${borrao}px)` }}>
        <Camera x={cx} y={0} zoom={Math.exp(lz)} deriva={0.03}>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
            {trilho(NOS.cidadao, NOS.dados, dad - 8, 1)}
            {trilho(NOS.dados, NOS.zeladoria, zel - 6, 2)}
            {trilho(NOS.dados, NOS.iluminacao, ilu - 6, 3)}
          </svg>
          <Em x={NOS.cidadao.x} y={NOS.cidadao.y + 30}><No em={cid} icone="a11" texto="cidadão" fundo={cor.agua} /></Em>
          <Em x={NOS.dados.x} y={NOS.dados.y + 30}>
            <No em={dad} texto="dados" fundo={cor.branco}>
              <svg width={80} height={80} viewBox="0 0 24 24"><path d="M5 20V12M10 20V6M15 20V10M20 20V4" stroke={cor.escura} strokeWidth={2.6} strokeLinecap="round" /></svg>
            </No>
          </Em>
          <Em x={NOS.zeladoria.x} y={NOS.zeladoria.y + 30}><No em={zel} icone="a06" texto="zeladoria" fundo={cor.agua} brilho={brilho} /></Em>
          <Em x={NOS.iluminacao.x} y={NOS.iluminacao.y + 30}><No em={ilu} icone="a09" texto="iluminação" fundo={cor.agua} brilho={brilho} /></Em>
          <Em x={NOS.zeladoria.x} y={0}>
            <div style={{ fontSize: 40, fontWeight: 700, color: cor.escura, backgroundColor: cor.agua, padding: "10px 28px", borderRadius: 999, whiteSpace: "nowrap", translate: "-30px 0", opacity: ip(f, [agir, agir + 6], [0, 1], E.expo), scale: String(ip(f, [agir, agir + DUR.entrada], [0.6, 1], E.pulo)) }}>onde agir primeiro</div>
          </Em>
        </Camera>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =====================================================================================
// c26: retorno do gancho — mesmo mundo da c04; a guia alta continua lá, a rota verde desvia e a Marta chega ao posto
const ROTA_VERDE: [number, number][] = [
  [LINHA.de, LINHA.y], [GUIA.x - 170, LINHA.y], [GUIA.x - 110, LINHA.y + 130], [GUIA.x + 110, LINHA.y + 130], [GUIA.x + 170, LINHA.y], [LINHA.ate, LINHA.y],
];
const pontoNaRota = (pts: [number, number][], t: number): [number, number] => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let d = t * seg.reduce((a, b) => a + b, 0);
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) { const k = d / seg[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; }
    d -= seg[i];
  }
  return pts[pts.length - 1];
};
const LugarFinal: React.FC<{ icone: string; luz?: number; children?: React.ReactNode }> = ({ icone, luz = 0, children }) => (
  <div style={{ position: "relative", width: CARD, height: CARD, borderRadius: 36, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: luz > 0.5 ? cor.agua : "rgba(255,255,255,0.10)", boxShadow: `0 0 ${60 * luz}px rgba(118,193,169,${0.6 * luz})` }}>
    <Icone id={icone} tamanho={80} cor={luz > 0.5 ? cor.escura : cor.suave} />
    {children}
  </div>
);
export const Volta: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const fim = cenas[0].fim_f - cenas[0].inicio_f;
  const marta = gat(cenas, "c26", "Marta");
  const posto = gat(cenas, "c26", "posto");
  const sozinha = gat(cenas, "c26", "sozinha");
  const seg = gat(cenas, "c26", "segurança");
  const chega = ip(f, [0, 30], [560, 0], E.expo);
  const borrao = ip(f, [0, 10], [14, 0], E.expo);
  const rota = ip(f, [marta - 20, marta + 4], [1, 0], E.move);
  const t = ip(f, [marta, posto], [0, 1], Easing.inOut(Easing.sin));
  const [px, py] = pontoNaRota(ROTA_VERDE, t);
  const luz = ip(f, [sozinha, sozinha + DUR.foco], [0, 1], E.expo);
  const d = ROTA_VERDE.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas />
      <AbsoluteFill style={{ translate: `0px ${chega}px`, filter: `blur(${borrao}px)` }}>
        <Camera x={0} y={LINHA.y + 20} zoom={1.05} deriva={0.04}>
          {/* a linha antiga continua tracejada; a rota verde desvia da guia */}
          <div style={{ position: "absolute", left: LINHA.de, top: LINHA.y - 5, width: LINHA.ate - LINHA.de, height: 10, borderRadius: 5, backgroundImage: "repeating-linear-gradient(90deg, rgba(232,244,239,0.22) 0 28px, transparent 28px 46px)" }} />
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
            <path d={d} fill="none" stroke={cor.agua} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={rota} />
          </svg>
          <div style={{ position: "absolute", left: GUIA.x - GUIA.larg / 2, top: LINHA.y - GUIA.alt + 5, width: GUIA.larg, height: GUIA.alt, backgroundColor: cor.acessibilidade, borderRadius: "10px 10px 4px 4px", boxShadow: "0 10px 24px rgba(0,0,0,0.3)" }} />
          <Em x={CASA.x} y={CASA.y}><LugarFinal icone="a05" /></Em>
          <Em x={POSTO.x} y={POSTO.y}>
            <LugarFinal icone="a04" luz={luz}>
              <div style={{ position: "absolute", right: -24, top: -24, scale: String(ip(f, [seg, seg + DUR.entrada], [0, 1], E.pulo)) }}><Check tamanho={68} /></div>
            </LugarFinal>
          </Em>
          {/* Marta com o andador, andando pela rota verde */}
          <div style={{ position: "absolute", left: px - 46, top: py - 46, width: 92, height: 92, borderRadius: "50%", backgroundColor: cor.agua, border: `6px solid ${cor.branco}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.35)", opacity: ip(f, [marta - 10, marta - 2], [0, 1], E.expo), scale: String(ip(f, [marta - 10, marta + 4], [0, 1], E.pulo)) }}>
            <Icone id="a03" tamanho={50} cor={cor.escura} />
          </div>
          <Em x={0} y={LINHA.y - 230}>
            <div style={{ fontSize: 88, fontWeight: 700, color: cor.branco, letterSpacing: -1.5, whiteSpace: "nowrap", ...entra(f, sozinha - 6) }}>
              Ela vai <span style={{ color: cor.agua }}>sozinha.</span>
            </div>
          </Em>
        </Camera>
      </AbsoluteFill>
      <FormaVarre de={fim - 18} cor={cor.escura} canto="esq" />
    </AbsoluteFill>
  );
};

// =====================================================================================
// c27: logo monta; "Grupo Octoflow"; Global Solution FIAP 2026.2; cauda até o fim
export const Fim: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const cam = gat(cenas, "c27", "Caminho");
  const octo = gat(cenas, "c27", "Octoflow");
  const desloca = ip(f, [cam, cam + 15], [0, -400], E.entrada3);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas />
      <Camera x={0} y={0} zoom={1} deriva={0.04}>
        <div style={{ position: "absolute", left: desloca - 110, top: -200, width: 220, height: 220, borderRadius: 56, backgroundColor: cor.agua, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px rgba(0,0,0,0.3)", opacity: ip(f, [cam - 8, cam], [0, 1], E.expo), scale: String(ip(f, [cam - 8, cam + 6], [0.5, 1], E.pulo)) }}>
          <Icone id="a01" tamanho={140} cor={cor.escura} />
        </div>
        <div style={{ position: "absolute", left: desloca + 150, top: -162 }}>
          <TextoDigitado em={cam} texto="Caminho Livre" style={{ fontSize: 124, fontWeight: 700, color: cor.branco, letterSpacing: -2, lineHeight: "144px" }} />
        </div>
        <Em x={0} y={150}>
          <div style={{ textAlign: "center", ...entra(f, octo, 24) }}>
            <div style={{ fontSize: 60, fontWeight: 600, color: cor.agua, whiteSpace: "nowrap" }}>Grupo Octoflow</div>
          </div>
        </Em>
        <Em x={0} y={240}>
          <div style={{ fontSize: 36, fontWeight: 400, color: cor.suave, opacity: 0.8 * ip(f, [octo + 10, octo + 10 + DUR.foco], [0, 1], E.expo), whiteSpace: "nowrap" }}>Global Solution · FIAP 2026.2</div>
        </Em>
      </Camera>
    </AbsoluteFill>
  );
};
