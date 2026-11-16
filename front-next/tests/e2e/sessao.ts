import type { Page } from "@playwright/test";
import usuario from "../../src/mocks/usuario.json";

/** Deixa a página logada com o usuário dos mocks antes de carregar. */
export const logar = (page: Page) =>
  page.addInitScript((u) => {
    localStorage.setItem("cl.sessao", JSON.stringify({ usuario: u, idToken: "mock", expiraEm: Date.now() + 3600_000 }));
  }, usuario);
