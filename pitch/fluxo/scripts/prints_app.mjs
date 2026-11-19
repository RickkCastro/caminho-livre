// Prints mobile do app (modo mock) para o vídeo: 390x844 a 3x = 1170x2532 px.
// Uso: suba o front em modo mock (launch.json "front-mock", porta 3001) e rode
//   node pitch/fluxo/scripts/prints_app.mjs [url_base] [pasta_saida] [filtro]
// filtro (opcional): só grava os prints cujo nome contém esse texto (ex.: "09"); os passos rodam todos.
// Nunca sobrescreve: se o arquivo existe, grava _v02, _v03...
import { createRequire } from "node:module";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const require = createRequire("C:/Github/caminho-livre/front-next/package.json");
const { chromium } = require("@playwright/test");

const BASE = process.argv[2] ?? "http://localhost:3001";
const SAIDA = process.argv[3] ?? "C:/Github/caminho-livre/pitch/assets/prints";
const SE = { latitude: -23.5505, longitude: -46.6333 };

function livre(nome) {
  let p = path.join(SAIDA, `${nome}.png`);
  for (let n = 2; existsSync(p); n++) p = path.join(SAIDA, `${nome}_v${String(n).padStart(2, "0")}.png`);
  return p;
}

const FILTRO = process.argv[4];

async function foto(page, nome, opcoes = {}) {
  if (FILTRO && !nome.includes(FILTRO)) return;
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1200); // tiles do mapa e animações assentarem
  const p = livre(nome);
  await page.screenshot({ path: p, ...opcoes });
  console.log(p);
}

mkdirSync(SAIDA, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
  geolocation: SE, permissions: ["geolocation"], locale: "pt-BR",
});
const page = await ctx.newPage();
// Endereços sem depender do Nominatim de verdade (mesmo truque dos testes e2e).
await page.route("**/nominatim.openstreetmap.org/reverse**", (r) =>
  r.fulfill({ json: { address: { road: "Avenida Paulista", house_number: "1000", suburb: "Bela Vista" } } }));
await page.route("**/nominatim.openstreetmap.org/search**", (r) =>
  r.fulfill({ json: [{ display_name: "Praça da Sé, Sé, São Paulo, Brasil", lat: "-23.5503", lon: "-46.6340" }] }));

await page.goto(`${BASE}/login`);
await foto(page, "01-login");
await page.getByRole("button", { name: "Entrar com Google" }).click();
await page.waitForURL((u) => !u.pathname.startsWith("/login"));

await page.goto(`${BASE}/onboarding`);
await foto(page, "02-onboarding");

await page.goto(`${BASE}/`);
await page.locator(".marcador").first().waitFor();
await foto(page, "03-mapa");

await page.goto(`${BASE}/ocorrencias/nova`);
await foto(page, "04-avisar-vazio");
await page.getByText("Buraco", { exact: true }).click();
await page.getByRole("button", { name: "Usar minha localização" }).click();
await foto(page, "05-avisar-preenchido");
await page.getByRole("button", { name: "Enviar" }).click();
await page.getByText("Alerta enviado").waitFor();
await foto(page, "06-avisar-enviado");

await page.goto(`${BASE}/ocorrencias/1`);
await foto(page, "07-detalhe");

await page.goto(`${BASE}/rota`);
await foto(page, "08-rota-vazia");
await page.getByLabel("Para onde você vai?").fill("Praça da Sé");
await page.getByRole("button", { name: /Praça da Sé, Sé, São Paulo, Brasil/ }).click();
await page.getByRole("button", { name: "Ver rota" }).click();
await page.getByLabel("Resultado da rota").waitFor();
await foto(page, "09-rota-resultado");
await page.locator(".leaflet-container").scrollIntoViewIfNeeded();
await foto(page, "09b-rota-mapa");
// shortcut: fullPage não serve aqui (o app rola num contêiner interno, sai igual à 09b); para a tela inteira, rolar e juntar prints.

for (const [rota, nome] of [["/ranking", "10-ranking"], ["/minhas", "11-meus-alertas"], ["/perfil", "12-perfil"]]) {
  await page.goto(`${BASE}${rota}`);
  await foto(page, nome);
}
await browser.close();
