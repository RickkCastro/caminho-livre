// Demo (c13–c22). App sempre na moldura; zoom no ponto do print que a fala explica (perfil §3).
// Pontos dos prints em "pontos" da tela de 390x844 (prints 1170x2532 a 3x), medidos na folha prints_demo.png.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Camera, Em } from "../base/Camera";
import { FormaVarre } from "../base/FormaVarre";
import { FundoFormas } from "../base/FundoFormas";
import { Icone } from "../base/Icone";
import { MolduraCelular } from "../base/MolduraCelular";
import { NumeroConta } from "../base/NumeroConta";
import type { Cena } from "../base/Placeholder";
import { cor, DUR, E, fontFamily, ip } from "../base/tema";
import { gat, inicio } from "./Gancho";
import { MAPA, Pino, ROTA, RUAS_H, RUAS_V } from "./Mapa";
import { caminho, DESVIO, RUA_DESVIO } from "./Solucao";

const ALT = 900; // altura do celular nas cenas de app

// ---- celular no mundo: converte um ponto do print para coordenadas do mundo (com a rotação do aparelho)
const tela = (alt: number) => {
  const b = Math.round(alt * 0.018);
  const h = alt - 2 * b;
  return { w: Math.round(h * (1170 / 2532)), h };
};
const noMundo = (sx: number, sy: number, rot: number, cx = 0, cy = 0, alt = ALT): [number, number] => {
  const { w, h } = tela(alt);
  const px = (sx / 390 - 0.5) * w;
  const py = (sy / 844 - 0.5) * h;
  const r = (rot * Math.PI) / 180;
  return [cx + px * Math.cos(r) - py * Math.sin(r), cy + px * Math.sin(r) + py * Math.cos(r)];
};
// filho posicionado num ponto do print (dentro da tela do celular)
const Sobre: React.FC<{ x: number; y: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, style, children }) => (
  <div style={{ position: "absolute", left: `${(x / 390) * 100}%`, top: `${(y / 844) * 100}%`, translate: "-50% -50%", ...style }}>{children}</div>
);

// toque na tela: bolinha que afunda e onda que abre
const Toque: React.FC<{ em: number; x: number; y: number }> = ({ em, x, y }) => {
  const f = useCurrentFrame();
  if (f < em - 2) return null;
  return (
    <Sobre x={x} y={y}>
      <div style={{ position: "absolute", left: -36, top: -36, width: 72, height: 72, borderRadius: "50%", border: `4px solid ${cor.agua}`, scale: String(ip(f, [em, em + 18], [0.6, 1.9], E.entrada)), opacity: ip(f, [em, em + 18], [0.9, 0], E.entrada) }} />
      <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: cor.agua, opacity: f < em + 8 ? ip(f, [em - 2, em + 2], [0, 0.7], E.expo) : ip(f, [em + 8, em + 16], [0.7, 0], E.saida), scale: String(f < em + 3 ? ip(f, [em - 2, em + 3], [1.2, 0.85], E.entrada) : ip(f, [em + 3, em + 9], [0.85, 1], E.pulo)) }} />
    </Sobre>
  );
};

const Check: React.FC<{ tamanho: number; fundo?: string; traco?: string }> = ({ tamanho, fundo = cor.agua, traco = cor.escura }) => (
  <div style={{ width: tamanho, height: tamanho, borderRadius: "50%", backgroundColor: fundo, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width={tamanho * 0.55} height={tamanho * 0.55} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={traco} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);

// chegada por corte com assentamento: entra 5% maior e assenta em 6 f
const assenta = (f: number) => ip(f, [0, 6], [1.05, 1], E.entrada);

// =====================================================================================
// c13: login; zoom no "Entrar com Google"; chips "senha" e "cadastro" riscados ao lado
export const Login: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const google = gat(cenas, "c13", "Google");
  const ROT = -4;
  const [bx, by] = noMundo(195, 503, ROT);
  const t0 = google - 6;
  const cx = ip(f, [t0, t0 + DUR.camera], [0, bx + 230], E.move);
  const cy = ip(f, [t0, t0 + DUR.camera], [0, by], E.move);
  const lz = ip(f, [t0, t0 + DUR.camera], [0, Math.log(1.5)], E.move);
  const chips: [string, string][] = [["senha", "senha"], ["cadastro", "cadastro"]];
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas />
      <Camera x={cx} y={cy} zoom={Math.exp(lz)} deriva={0.03}>
        <Em x={0} y={0} style={{ rotate: `${ROT}deg`, translate: `-50% calc(-50% + ${ip(f, [0, DUR.grande], [380, 0], E.entrada)}px)` }}>
          <MolduraCelular print="prints/01-login.png" altura={ALT}>
            <Sobre x={195} y={503}>
              <div style={{ width: 330, height: 50, borderRadius: 14, border: `4px solid ${cor.agua}`, opacity: ip(f, [google + 10, google + 18], [0, 1], E.expo), scale: String(ip(f, [google + 10, google + 22], [1.15, 1], E.entrada3)) }} />
            </Sobre>
          </MolduraCelular>
        </Em>
        {chips.map(([palavra, texto], i) => {
          const em = gat(cenas, "c13", palavra);
          return (
            <div key={palavra} style={{ position: "absolute", left: bx + 300, top: by - 80 + i * 96, opacity: ip(f, [em, em + DUR.foco], [0, 1], E.expo), translate: `${ip(f, [em, em + DUR.entrada], [40, 0], E.entrada3)}px 0px` }}>
              <div style={{ position: "relative", fontSize: 44, fontWeight: 600, color: cor.escura, backgroundColor: cor.branco, padding: "10px 30px", borderRadius: 999, whiteSpace: "nowrap" }}>
                {texto}
                <div style={{ position: "absolute", left: 18, top: "50%", height: 6, borderRadius: 3, backgroundColor: cor.seguranca, width: `calc(${ip(f, [em + 6, em + 14], [0, 1], E.entrada) * 100}% - 36px)` }} />
              </div>
            </div>
          );
        })}
      </Camera>
    </AbsoluteFill>
  );
};

// =====================================================================================
// c14: fundo claro; buraco, degrau, rua escura entram na fala; o grupo se recentraliza a cada chegada
const TIPOS = [
  { palavra: "buraco", icone: "a06", fundo: cor.acessibilidade, texto: "buraco" },
  { palavra: "degrau", icone: "a07", fundo: cor.acessibilidade, texto: "degrau" },
  { palavra: "rua", icone: "a09", fundo: cor.seguranca, texto: "rua escura" },
];
export const Tipos: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const PASSO = 340;
  const ems = TIPOS.map((t) => gat(cenas, "c14", t.palavra));
  const desloca = ems.slice(1).reduce((s, em) => s + ip(f, [em, em + 15], [0, PASSO / 2], E.entrada3), 0);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas claro />
      <Camera x={0} y={0} zoom={1} deriva={0.04}>
        {TIPOS.map((t, i) => {
          const em = ems[i];
          return (
            <Em key={t.palavra} x={i * PASSO - desloca} y={0}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, opacity: ip(f, [em, em + DUR.foco], [0, 1], E.expo) }}>
                <div style={{ width: 200, height: 200, borderRadius: "50%", backgroundColor: t.fundo, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(42,75,37,0.18)", scale: String(ip(f, [em, em + DUR.entrada], [0.5, 1], E.pulo)) }}>
                  <Icone id={t.icone} tamanho={110} cor={cor.branco} />
                </div>
                <div style={{ fontSize: 52, fontWeight: 700, color: cor.escura, whiteSpace: "nowrap", translate: `0px ${ip(f, [em + 2, em + 2 + DUR.entrada], [20, 0], E.entrada3)}px` }}>{t.texto}</div>
              </div>
            </Em>
          );
        })}
      </Camera>
    </AbsoluteFill>
  );
};

// =====================================================================================
// c15: 04 → 05 → 06 com o contador de 4 toques ao lado (sem tela de foto: só o toque)
const TOQUES = [
  { palavra: "foto", x: 120, y: 92 },
  { palavra: "tipo", x: 99, y: 304 },
  { palavra: "local", x: 209, y: 614 },
  { palavra: "envia", x: 195, y: 742 },
];
export const Avisar: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const quatro = gat(cenas, "c15", "quatro");
  const ems = TOQUES.map((t) => gat(cenas, "c15", t.palavra));
  const print = f < ems[1] + 2 ? "prints/04-avisar-vazio.png" : f < ems[3] + 8 ? "prints/05-avisar-preenchido.png" : "prints/06-avisar-enviado.png";
  // celular nasce no centro; quando o contador chega, o grupo se divide e fica centrado
  const desloca = ip(f, [quatro, quatro + 15], [0, -260], E.entrada3);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas />
      <Camera x={0} y={0} zoom={assenta(f)} deriva={0.03}>
        <Em x={desloca} y={0} style={{ rotate: "-4deg" }}>
          <MolduraCelular print={print} altura={ALT}>
            {TOQUES.map((t, i) => <Toque key={t.palavra} em={ems[i]} x={t.x} y={t.y} />)}
          </MolduraCelular>
        </Em>
        <div style={{ position: "absolute", left: desloca + 330, top: -110, opacity: ip(f, [quatro, quatro + DUR.foco], [0, 1], E.expo), translate: `${ip(f, [quatro, quatro + DUR.entrada], [40, 0], E.entrada3)}px 0px` }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: cor.branco, whiteSpace: "nowrap" }}>4 toques</div>
          <div style={{ display: "flex", gap: 22, marginTop: 28 }}>
            {ems.map((em, i) => {
              const cheio = ip(f, [em, em + 4], [0, 1], E.expo);
              return (
                <div key={i} style={{
                  width: 72, height: 72, borderRadius: "50%", border: `5px solid ${cor.agua}`, boxSizing: "border-box",
                  backgroundColor: cheio > 0.5 ? cor.agua : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 34, fontWeight: 700, color: cheio > 0.5 ? cor.escura : cor.agua,
                  scale: String(f < em ? 1 : ip(f, [em, em + 10], [1.25, 1], E.entrada3)),
                }}>{i + 1}</div>
              );
            })}
          </div>
        </div>
      </Camera>
    </AbsoluteFill>
  );
};

// =====================================================================================
// c16: fundo claro; pino do alerta no centro; moradores chegam em volta; check no pino
export const Validam: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const mor = gat(cenas, "c16", "moradores");
  const val = gat(cenas, "c16", "validam");
  const N = 5;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas claro />
      <Camera x={0} y={0} zoom={assenta(f)} deriva={0.04}>
        {Array.from({ length: N }).map((_, i) => {
          const a = -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / N;
          const em = mor + i * 3;
          const r = ip(f, [em, em + 18], [950, 330], E.entrada3);
          return (
            <Em key={i} x={Math.cos(a) * r} y={Math.sin(a) * r * 0.8 + 30}>
              <div style={{ width: 120, height: 120, borderRadius: "50%", backgroundColor: cor.branco, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(42,75,37,0.16)", opacity: ip(f, [em, em + DUR.foco], [0, 1], E.expo) }}>
                <Icone id="a11" tamanho={66} cor={cor.escura} />
              </div>
            </Em>
          );
        })}
        <Em x={0} y={-30}>
          <div style={{ position: "relative", opacity: ip(f, [2, 2 + DUR.foco], [0, 1], E.expo), translate: `0px ${ip(f, [2, 2 + DUR.entrada], [-60, 0], E.entrada3)}px` }}>
            <Pino tamanho={180} fundo={cor.acessibilidade}><Icone id="a07" tamanho={96} cor={cor.branco} /></Pino>
            <div style={{ position: "absolute", right: -26, top: -26, scale: String(ip(f, [val, val + DUR.entrada], [0, 1], E.pulo)) }}>
              <Check tamanho={84} />
            </div>
          </div>
        </Em>
      </Camera>
    </AbsoluteFill>
  );
};

// =====================================================================================
// c17 + c18: 07-detalhe; zoom em "Ainda está lá" (1→3, selo Confirmada); câmera desliza para "Já foi resolvido" (0→3); alerta sai
const Digito: React.FC<{ valor: number; em: number }> = ({ valor, em }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ minWidth: 30, height: 34, backgroundColor: cor.branco, display: "flex", alignItems: "center", fontSize: 24, fontWeight: 700, color: "#1c1c1c", scale: String(f < em ? 1 : ip(f, [em, em + 8], [1.35, 1], E.entrada3)), transformOrigin: "left center" }}>{valor}</div>
  );
};
export const Detalhe: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const ROT = -3;
  const c18 = inicio(cenas, "c18");
  const tres1 = gat(cenas, "c17", "três");
  const conf = gat(cenas, "c17", "confirmado");
  const tres2 = gat(cenas, "c18", "três");
  const sai = gat(cenas, "c18", "sai");
  const [ax, ay] = noMundo(97, 386, ROT);
  const [rx, ry] = noMundo(284, 386, ROT);
  let cx: number, cy: number, lz: number;
  if (f < c18) {
    cx = ip(f, [0, DUR.camera], [0, ax], E.move); cy = ip(f, [0, DUR.camera], [0, ay], E.move); lz = ip(f, [0, DUR.camera], [0, Math.log(2)], E.move);
  } else if (f < sai - 4) {
    cx = ip(f, [c18, c18 + DUR.camera], [ax, rx], E.move); cy = ip(f, [c18, c18 + DUR.camera], [ay, ry], E.move); lz = Math.log(2);
  } else {
    cx = ip(f, [sai - 4, sai + 16], [rx, 0], E.move); cy = ip(f, [sai - 4, sai + 16], [ry, 0], E.move); lz = ip(f, [sai - 4, sai + 16], [Math.log(2), Math.log(1.1)], E.move);
  }
  // contam em degraus de 8 f
  const ainda = f < tres1 ? 1 : Math.min(3, 1 + Math.floor((f - tres1) / 8) + 1);
  const resolvido = f < tres2 ? 0 : Math.min(3, Math.floor((f - tres2) / 8) + 1);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas />
      <Camera x={cx} y={cy} zoom={Math.exp(lz) * assenta(f)} deriva={0.02}>
        <Em x={0} y={0} style={{ rotate: `${ROT}deg` }}>
          <MolduraCelular print="prints/07-detalhe.png" altura={ALT}>
            <Sobre x={30} y={402} style={{ translate: "0 -50%" }}><Digito valor={ainda} em={tres1 + Math.max(0, ainda - 2) * 8} /></Sobre>
            <Sobre x={216} y={402} style={{ translate: "0 -50%" }}><Digito valor={resolvido} em={tres2 + Math.max(0, resolvido - 1) * 8} /></Sobre>
            <Sobre x={268} y={185}>
              <div style={{ fontSize: 20, fontWeight: 700, color: cor.escura, backgroundColor: cor.agua, padding: "5px 14px", borderRadius: 999, whiteSpace: "nowrap", rotate: "-6deg", display: "flex", alignItems: "center", gap: 6, opacity: ip(f, [conf, conf + 4], [0, 1], E.expo), scale: String(ip(f, [conf, conf + 10], [1.6, 1], E.entrada3)) }}>
                <Check tamanho={22} fundo={cor.escura} traco={cor.agua} /> Confirmada
              </div>
            </Sobre>
            {/* alerta sai do mapa */}
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.82)", opacity: ip(f, [sai, sai + 10], [0, 1], E.move) }} />
            <Sobre x={195} y={420}>
              <div style={{ fontSize: 30, fontWeight: 700, color: cor.branco, backgroundColor: cor.escura, padding: "12px 26px", borderRadius: 999, whiteSpace: "nowrap", opacity: ip(f, [sai + 4, sai + 10], [0, 1], E.expo), scale: String(ip(f, [sai + 4, sai + 16], [0.7, 1], E.pulo)) }}>saiu do mapa</div>
            </Sobre>
          </MolduraCelular>
        </Em>
      </Camera>
    </AbsoluteFill>
  );
};

// =====================================================================================
// c19: fundo claro; pino + "15 dias" conta; pino desbota; frase "O mapa nunca fica velho."
export const Expira: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const quinze = gat(cenas, "c19", "15");
  const exp = gat(cenas, "c19", "expira");
  const nunca = gat(cenas, "c19", "nunca");
  const frase = nunca - 16; // "Assim, o mapa..." começa ~0,5 s antes de "nunca"
  const desloca = ip(f, [quinze, quinze + 15], [0, -230], E.entrada3);
  const desbota = ip(f, [exp, exp + 14], [0, 1], Easing.inOut(Easing.quad));
  const sai = ip(f, [frase - 9, frase], [0, 1], E.saida);
  const marca = ip(f, [nunca, nunca + 10], [0, 1], E.entrada3);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas claro />
      <Camera x={0} y={0} zoom={assenta(f)} deriva={0.04}>
        <div style={{ opacity: 1 - sai, translate: `0px ${-40 * sai}px` }}>
          <Em x={desloca} y={0}>
            <div style={{ opacity: 1 - 0.7 * desbota, filter: `grayscale(${desbota})`, scale: String(1 - 0.08 * desbota) }}>
              <Pino tamanho={170} fundo={cor.acessibilidade}><Icone id="a07" tamanho={92} cor={cor.branco} /></Pino>
            </div>
          </Em>
          <div style={{ position: "absolute", left: desloca + 170, top: -80 }}>
            <NumeroConta em={quinze} ate={15} dur={18} style={{ fontSize: 140, fontWeight: 700, color: cor.escura, letterSpacing: -3, opacity: 1 - 0.6 * desbota }} sufixo={<span style={{ fontSize: 80, marginLeft: 18 }}>dias</span>} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, translate: "-50% -50%" }}>
          <div style={{ fontSize: 110, fontWeight: 700, color: cor.escura, letterSpacing: -2, whiteSpace: "nowrap", opacity: ip(f, [frase, frase + DUR.foco], [0, 1], E.expo), filter: `blur(${ip(f, [frase, frase + DUR.foco], [10, 0], E.expo)}px)`, translate: `0px ${ip(f, [frase, frase + DUR.entrada], [36, 0], E.entrada3)}px` }}>
            O mapa{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ position: "absolute", left: -12, right: -12, top: "16%", bottom: "2%", borderRadius: 14, backgroundColor: cor.agua, transformOrigin: "0 50%", scale: `${marca} 1` }} />
              <span style={{ position: "relative" }}>nunca</span>
            </span>{" "}fica velho.
          </div>
        </div>
      </Camera>
    </AbsoluteFill>
  );
};

// =====================================================================================
// c20: 09-rota-resultado; zoom na comparação 610 m × 480 m; sai com a forma varrendo
export const Rotas: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const fim = cenas[0].fim_f - cenas[0].inicio_f;
  const comp = gat(cenas, "c20", "compara");
  const ROT = -4;
  const [kx, ky] = noMundo(195, 620, ROT);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas />
      <Camera x={ip(f, [comp, comp + 24], [0, kx], E.move)} y={ip(f, [comp, comp + 24], [0, ky], E.move)} zoom={Math.exp(ip(f, [comp, comp + 24], [0, Math.log(1.9)], E.move)) * assenta(f)} deriva={0.03}>
        <Em x={0} y={0} style={{ rotate: `${ROT}deg` }}>
          <MolduraCelular print="prints/09-rota-resultado.png" altura={ALT} />
        </Em>
      </Camera>
      <FormaVarre de={fim - 18} cor={cor.escura} />
    </AbsoluteFill>
  );
};

// =====================================================================================
// mapa das rotas (c21 noite, c22 dia): mesma grade das c06/c07 + rua de desvio
const MapaRuas: React.FC<{ dia?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ dia, children, style }) => {
  const rua = dia ? "rgba(42,75,37,0.08)" : "rgba(255,255,255,0.05)";
  return (
    <div style={{ position: "absolute", left: -MAPA.l / 2, top: -MAPA.a / 2, width: MAPA.l, height: MAPA.a, borderRadius: 40, backgroundColor: dia ? cor.branco : "rgba(0,0,0,0.22)", overflow: "hidden", boxShadow: dia ? "0 30px 60px rgba(42,75,37,0.16)" : "0 30px 60px rgba(0,0,0,0.35)", ...style }}>
      {RUAS_H.map((y) => <div key={`h${y}`} style={{ position: "absolute", left: 0, top: y - 17, width: MAPA.l, height: 34, backgroundColor: rua }} />)}
      {[...RUAS_V, RUA_DESVIO].map((x) => <div key={`v${x}`} style={{ position: "absolute", left: x - 17, top: 0, width: 34, height: MAPA.a, backgroundColor: rua }} />)}
      {children}
    </div>
  );
};
const Destino: React.FC = () => (
  <div style={{ position: "absolute", left: ROTA[3][0] - 32, top: ROTA[3][1] - 82 }}>
    <Pino tamanho={64} fundo={cor.agua}><div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: cor.escura }} /></Pino>
  </div>
);

// c21: noite; Júlia; rota comum (tracejada) passa na rua escura, Caminho Livre contorna; +130 m
export const Noite: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const julia = gat(cenas, "c21", "Júlia");
  const h23 = gat(cenas, "c21", "23h");
  const m130 = gat(cenas, "c21", "130");
  const rua = gat(cenas, "c21", "rua");
  const comum = ip(f, [julia + 12, julia + 36], [1, 0], E.move);
  const livre = ip(f, [julia + 24, julia + 54], [1, 0], E.move);
  const acende = ip(f, [rua, rua + DUR.foco], [0, 1], E.expo);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas />
      <AbsoluteFill style={{ backgroundColor: "rgba(10,20,10,0.35)" }} />
      <Camera x={0} y={-30} zoom={assenta(f)} deriva={0.03}>
        <MapaRuas style={{ top: -MAPA.a / 2 + 70 }}>
          <svg width={MAPA.l} height={MAPA.a} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={caminho(ROTA)} fill="none" stroke={cor.suave} strokeOpacity={0.55} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={comum} />
            <path d={caminho(ROTA)} fill="none" stroke={cor.escura} strokeWidth={12} strokeDasharray="1 30" opacity={comum < 0.01 ? 1 : 0} />
            <path d={caminho(DESVIO)} fill="none" stroke={cor.agua} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={livre} />
            <line x1={420} y1={300} x2={690} y2={300} stroke={cor.seguranca} strokeWidth={14} strokeLinecap="round" opacity={acende} style={{ filter: `drop-shadow(0 0 ${14 * acende}px ${cor.seguranca})` }} />
          </svg>
          <div style={{ position: "absolute", left: 555 - 40, top: 300 - 40, width: 80, height: 80, borderRadius: "50%", backgroundColor: cor.seguranca, display: "flex", alignItems: "center", justifyContent: "center", scale: String(ip(f, [rua + 2, rua + 2 + DUR.entrada], [0, 1], E.pulo)) }}>
            <Icone id="a09" tamanho={48} cor={cor.branco} />
          </div>
          <Destino />
          {/* Júlia */}
          <div style={{ position: "absolute", left: ROTA[0][0] - 20, top: ROTA[0][1] - 20, width: 40, height: 40, borderRadius: "50%", backgroundColor: cor.branco, border: `7px solid ${cor.agua}`, boxSizing: "border-box", scale: String(ip(f, [julia, julia + DUR.entrada], [0, 1], E.pulo)) }} />
          <div style={{ position: "absolute", left: ROTA[0][0] + 36, top: ROTA[0][1] - 28, display: "flex", gap: 12 }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: cor.escura, backgroundColor: cor.branco, padding: "6px 20px", borderRadius: 999, opacity: ip(f, [julia, julia + DUR.foco], [0, 1], E.expo) }}>Júlia</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: cor.branco, backgroundColor: "rgba(255,255,255,0.16)", padding: "6px 20px", borderRadius: 999, opacity: ip(f, [h23, h23 + DUR.foco], [0, 1], E.expo), scale: String(ip(f, [h23, h23 + DUR.entrada], [0.6, 1], E.pulo)) }}>23h</div>
          </div>
        </MapaRuas>
        <Em x={0} y={-MAPA.a / 2 - 20}>
          <NumeroConta em={m130} ate={130} dur={18} style={{ fontSize: 96, fontWeight: 700, color: cor.agua, letterSpacing: -2 }} sufixo={<span style={{ fontSize: 52, marginLeft: 10 }}>m a mais</span>} />
        </Em>
      </Camera>
    </AbsoluteFill>
  );
};

// c22: dia; degrau bloqueia o trecho; novo caminho se desenha; sai com a forma varrendo (curta, a cena é apertada)
export const Dia: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  const f = useCurrentFrame();
  const fim = cenas[0].fim_f - cenas[0].inicio_f;
  const degrau = gat(cenas, "c22", "degrau");
  const bloq = gat(cenas, "c22", "bloqueia");
  const outro = gat(cenas, "c22", "outro");
  const rota = ip(f, [6, 30], [1, 0], E.move);
  const nova = ip(f, [outro, outro + 18], [1, 0], E.move);
  const verm = ip(f, [bloq, bloq + DUR.foco], [0, 1], E.expo);
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FundoFormas claro />
      <Camera x={0} y={0} zoom={assenta(f) * 1.1} deriva={0.03}>
        <MapaRuas dia>
          <svg width={MAPA.l} height={MAPA.a} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={caminho(ROTA)} fill="none" stroke={cor.escura} strokeOpacity={ip(f, [outro, outro + 10], [1, 0.25], E.move)} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={rota} />
            <line x1={150} y1={480} x2={150} y2={300} stroke={cor.seguranca} strokeWidth={14} strokeLinecap="round" opacity={verm} />
            <path d={caminho(DESVIO)} fill="none" stroke={cor.escura} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={nova} />
            <path d={caminho(DESVIO)} fill="none" stroke={cor.agua} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={nova} />
          </svg>
          {/* degrau no trecho e o X do bloqueio */}
          <div style={{ position: "absolute", left: 150 - 44, top: 410 - 44, width: 88, height: 88, borderRadius: "50%", backgroundColor: cor.acessibilidade, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 22px rgba(42,75,37,0.25)", translate: `0px ${ip(f, [degrau - 4, degrau + 8], [-140, 0], Easing.in(Easing.quad))}px`, opacity: ip(f, [degrau - 4, degrau], [0, 1], E.expo) }}>
            <Icone id="a07" tamanho={52} cor={cor.branco} />
          </div>
          <div style={{ position: "absolute", left: 150 + 40, top: 340 - 30, width: 60, height: 60, borderRadius: "50%", backgroundColor: cor.seguranca, display: "flex", alignItems: "center", justifyContent: "center", scale: String(ip(f, [bloq, bloq + DUR.entrada], [0, 1], E.pulo)) }}>
            <svg width={30} height={30} viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke={cor.branco} strokeWidth={3.4} strokeLinecap="round" /></svg>
          </div>
          <Destino />
          <div style={{ position: "absolute", left: ROTA[0][0] - 36, top: ROTA[0][1] - 36, width: 72, height: 72, borderRadius: "50%", backgroundColor: cor.agua, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px rgba(42,75,37,0.25)" }}>
            <Icone id="a03" tamanho={44} cor={cor.escura} />
          </div>
        </MapaRuas>
      </Camera>
      <FormaVarre de={fim - 14} dur={14} cor={cor.escura} />
    </AbsoluteFill>
  );
};
