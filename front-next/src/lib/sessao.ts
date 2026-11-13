"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, USA_MOCKS } from "./api";
import type { Usuario } from "./tipos";

export type Sessao = { usuario: Usuario; idToken: string; expiraEm: number };

const CHAVE = "cl.sessao";
export const CHAVE_RASCUNHO = "cl.rascunho";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

/* ---------- armazenamento ---------- */

const lerTexto = () => (typeof window === "undefined" ? null : localStorage.getItem(CHAVE));

export function lerSessao(): Sessao | null {
  try {
    return JSON.parse(lerTexto() ?? "null");
  } catch {
    return null;
  }
}

export function salvarSessao(sessao: Sessao | null) {
  if (sessao) localStorage.setItem(CHAVE, JSON.stringify(sessao));
  else localStorage.removeItem(CHAVE);
  window.dispatchEvent(new Event("cl:sessao"));
}

export function atualizarUsuario(usuario: Usuario) {
  const sessao = lerSessao();
  if (sessao) salvarSessao({ ...sessao, usuario });
}

function assinar(aoMudar: () => void) {
  window.addEventListener("cl:sessao", aoMudar);
  window.addEventListener("storage", aoMudar); // outra aba
  return () => {
    window.removeEventListener("cl:sessao", aoMudar);
    window.removeEventListener("storage", aoMudar);
  };
}

export function useSessao(): Sessao | null {
  const texto = useSyncExternalStore(assinar, lerTexto, () => null);
  return useMemo(() => (texto ? (JSON.parse(texto) as Sessao) : null), [texto]);
}

/** Guarda das telas 🔒: sem sessão, vai a /login e volta depois. */
export function useExigirLogin(): Sessao | null {
  const sessao = useSessao();
  const router = useRouter();
  const caminho = usePathname();
  useEffect(() => {
    if (!lerSessao()) router.replace(`/login?voltar=${encodeURIComponent(caminho)}`);
  }, [sessao, caminho, router]);
  return sessao;
}

/* ---------- Google Identity Services ---------- */

type Gis = {
  initialize(o: { client_id: string; auto_select?: boolean; callback: (r: { credential: string }) => void }): void;
  renderButton(el: HTMLElement, o: Record<string, unknown>): void;
  prompt(aoNotificar?: (n: { isNotDisplayed(): boolean; isSkippedMoment(): boolean }) => void): void;
  disableAutoSelect(): void;
};

let carregando: Promise<Gis> | null = null;
function carregarGoogle(): Promise<Gis> {
  return (carregando ??= new Promise((ok, falha) => {
    if (!CLIENT_ID) return falha(new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID não configurado"));
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.onload = () => ok((window as unknown as { google: { accounts: { id: Gis } } }).google.accounts.id);
    s.onerror = () => falha(new Error("Não foi possível carregar o Google"));
    document.head.append(s);
  }));
}

function expiracao(idToken: string): number {
  try {
    const payload = idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).exp * 1000;
  } catch {
    return Date.now() + 3600_000; // token de mock
  }
}

/** Troca o ID token do Google pelo usuário da API e guarda a sessão. */
export async function entrar(idToken = "mock"): Promise<Usuario> {
  const usuario = await api<Usuario>("/auth/google", { method: "POST", body: { idToken } });
  salvarSessao({ usuario, idToken, expiraEm: expiracao(idToken) });
  return usuario;
}

/** Desenha o botão oficial "Entrar com Google" e avisa quando o login terminar. */
export async function botaoGoogle(
  el: HTMLElement,
  aoEntrar: (u: Usuario) => void,
  aoFalhar: () => void,
) {
  const gis = await carregarGoogle();
  gis.initialize({
    client_id: CLIENT_ID,
    auto_select: true,
    callback: (r) => entrar(r.credential).then(aoEntrar, aoFalhar),
  });
  gis.renderButton(el, { theme: "outline", size: "large", text: "signin_with", locale: "pt-BR" });
}

/** Renova o ID token sem interação (One Tap com auto_select). */
export async function renovar(): Promise<boolean> {
  const sessao = lerSessao();
  if (!sessao) return false;
  if (USA_MOCKS) return true;
  try {
    const gis = await carregarGoogle();
    return await new Promise<boolean>((ok) => {
      const desistir = setTimeout(() => ok(false), 10_000);
      const fim = (v: boolean) => (clearTimeout(desistir), ok(v));
      gis.initialize({
        client_id: CLIENT_ID,
        auto_select: true,
        callback: (r) => {
          salvarSessao({ ...sessao, idToken: r.credential, expiraEm: expiracao(r.credential) });
          fim(true);
        },
      });
      gis.prompt((n) => (n.isNotDisplayed() || n.isSkippedMoment()) && fim(false));
    });
  } catch {
    return false;
  }
}

/** Sair ou excluir conta: apaga tudo o que é do usuário neste aparelho. */
export function sair() {
  sessionStorage.removeItem(CHAVE_RASCUNHO);
  salvarSessao(null);
  if (!USA_MOCKS) carregando?.then((g) => g.disableAutoSelect()).catch(() => {});
}
