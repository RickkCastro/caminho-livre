import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { logar } from "./sessao";

const ROTAS = ["/", "/login", "/rota", "/ocorrencias/nova", "/ocorrencias/1", "/perfil", "/minhas", "/ranking", "/onboarding"];

for (const rota of ROTAS) {
  test(`axe sem violações críticas ou sérias em ${rota}`, async ({ page }) => {
    if (rota !== "/login") await logar(page);
    await page.goto(rota);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("Carregando")).toHaveCount(0);

    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const graves = violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(graves.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
  });
}

for (const rota of ROTAS) {
  test(`fonte em 200% não corta nada em ${rota}`, async ({ page }) => {
    if (rota !== "/login") await logar(page);
    await page.goto(rota);
    await expect(page.locator("h1")).toBeAttached();
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(sobra).toBeLessThanOrEqual(0);
  });
}
