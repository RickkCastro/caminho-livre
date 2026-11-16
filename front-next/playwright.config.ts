import { defineConfig } from "@playwright/test";

// Porta e pasta de build próprias: os testes sempre usam os mocks, mesmo com o `npm run dev`
// da porta 3000 ligado na API real.
export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:3100", viewport: { width: 375, height: 812 } },
  webServer: {
    command: "npm run dev -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 120_000,
    env: { NEXT_PUBLIC_USE_MOCKS: "true", NEXT_DIST_DIR: ".next-testes" },
  },
});
