import { expect, test } from "@playwright/test";

const SE = { latitude: -23.5505, longitude: -46.6333 };
test.use({ geolocation: SE, permissions: ["geolocation"] });

test("mapa mostra alertas e o filtro esconde só um tipo", async ({ page }) => {
  await page.goto("/");
  const marcadores = page.locator(".marcador");
  await expect(marcadores).toHaveCount(4);
  await expect(marcadores.filter({ hasText: "Rua escura" })).toHaveCount(1);

  await page.getByRole("button", { name: "Segurança", exact: true }).click();
  await expect(marcadores).toHaveCount(3);
  await expect(marcadores.filter({ hasText: "Rua escura" })).toHaveCount(0);
});

test("visitante entra, volta ao formulário e envia alerta em até 4 toques", async ({ page }) => {
  // Bairro do alerta (geocodificação reversa) sem depender do Nominatim de verdade.
  await page.route("**/nominatim.openstreetmap.org/reverse**", (r) =>
    r.fulfill({ json: { address: { road: "Avenida Paulista", house_number: "1000", suburb: "Bela Vista" } } }),
  );
  await page.goto("/ocorrencias/nova");
  await expect(page).toHaveURL(/\/login\?voltar=%2Focorrencias%2Fnova/);
  await page.getByRole("button", { name: "Entrar com Google" }).click();
  await expect(page).toHaveURL(/\/ocorrencias\/nova$/);

  const enviar = page.getByRole("button", { name: "Enviar" });
  await expect(enviar).toBeDisabled();
  await expect(page.getByText("falta escolher o tipo de problema e o local")).toBeVisible();

  await page.getByText("Buraco", { exact: true }).click(); // toque 1
  await page.getByRole("button", { name: "Usar minha localização" }).click(); // toque 2
  await enviar.click(); // toque 3

  await expect(page.getByText("Alerta enviado")).toBeVisible();
  await expect(page.locator(".marcador")).toHaveCount(5);
});

test("sair apaga a sessão", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Entrar com Google" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/perfil");
  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page.getByRole("link", { name: "Entrar" })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("cl.sessao"))).toBeNull();
});

test("rota mostra duas linhas com legenda e distâncias", async ({ page }) => {
  // Busca de endereço sem depender do Nominatim de verdade.
  await page.route("**/nominatim.openstreetmap.org/**", (r) =>
    r.fulfill({ json: [{ display_name: "Praça da Sé, Sé, São Paulo, Brasil", lat: "-23.5503", lon: "-46.6340" }] }),
  );
  await page.goto("/rota");
  await expect(page.getByLabel("De onde você sai?")).toHaveValue("Minha localização");
  await expect(page.getByRole("button", { name: "Ver rota" })).toBeDisabled();

  await page.getByLabel("Para onde você vai?").fill("Praça da Sé");
  await page.getByRole("button", { name: /Praça da Sé, Sé, São Paulo, Brasil/ }).click();
  await expect(page.getByLabel("Para onde você vai?")).toHaveValue("Praça da Sé, Sé, São Paulo");
  await page.getByRole("button", { name: "Ver rota" }).click();

  const resultado = page.getByLabel("Resultado da rota");
  await expect(resultado).toContainText("Rota comum (linha tracejada): 480 m");
  await expect(resultado).toContainText("Caminho Livre (linha contínua): 610 m");
  await expect(page.locator("path.leaflet-interactive")).toHaveCount(2);
});

test("rota com destino marcado tocando no mapa", async ({ page }) => {
  await page.route("**/nominatim.openstreetmap.org/reverse**", (r) =>
    r.fulfill({ json: { address: { road: "Rua Pamplona", house_number: "52", suburb: "Bela Vista" } } }),
  );
  await page.goto("/rota");
  await expect(page.getByLabel("De onde você sai?")).toHaveValue("Minha localização");
  await expect(page.getByRole("radio", { name: "Destino" })).toBeChecked(); // falta o destino

  await page.locator(".leaflet-container").click({ position: { x: 60, y: 340 } }); // canto sem marcador de alerta
  await expect(page.getByLabel("Para onde você vai?")).toHaveValue("Rua Pamplona, 52, Bela Vista");
  await page.getByRole("button", { name: "Ver rota" }).click();
  await expect(page.getByLabel("Resultado da rota")).toContainText("Caminho Livre");
});
