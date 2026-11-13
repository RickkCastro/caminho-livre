import type { ErroApi } from "./tipos";
import { lerSessao, renovar, salvarSessao } from "./sessao";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
// Sem URL da API (ex.: sem .env.local) não há o que chamar: usa os mocks.
export const USA_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true" || !BASE;

/** Texto do erro para mostrar no <Aviso>. */
export const textoErro = (e: unknown) =>
  (e as ErroApi)?.erro ?? "Não foi possível conectar. Tente de novo.";

// O layout escuta este evento para mostrar "Acordando o servidor…" (Render free dorme).
const avisarAcordando = (ligado: boolean) =>
  window.dispatchEvent(new CustomEvent("cl:acordando", { detail: ligado }));

export async function api<T>(
  caminho: string,
  opcoes: { method?: string; body?: unknown } = {},
  repetir = true,
): Promise<T> {
  const method = opcoes.method ?? "GET";
  if (USA_MOCKS) {
    const { mock } = await import("@/mocks");
    return mock(method, caminho, opcoes.body) as T;
  }

  let sessao = lerSessao();
  if (sessao && sessao.expiraEm < Date.now() && (await renovar())) sessao = lerSessao();

  const lento = setTimeout(() => avisarAcordando(true), 5000);
  let resposta: Response;
  try {
    resposta = await fetch(BASE + caminho, {
      method,
      headers: {
        ...(opcoes.body !== undefined && { "Content-Type": "application/json" }),
        // Vai também nos GETs públicos: a API usa para preencher `minha`.
        ...(sessao && { Authorization: `Bearer ${sessao.idToken}` }),
      },
      body: opcoes.body !== undefined ? JSON.stringify(opcoes.body) : undefined,
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    throw { status: 0, erro: "Não foi possível conectar ao servidor. Tente de novo." } satisfies ErroApi;
  } finally {
    clearTimeout(lento);
    avisarAcordando(false);
  }

  if (resposta.status === 401 && sessao) {
    if (repetir && (await renovar())) return api<T>(caminho, opcoes, false);
    // Vira visitante, mas mantém o rascunho (cl.rascunho) para voltar à tela.
    salvarSessao(null);
    window.location.assign(`/login?voltar=${encodeURIComponent(window.location.pathname)}`);
  }
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    throw { status: resposta.status, erro: corpo?.erro ?? "Algo deu errado. Tente de novo." } satisfies ErroApi;
  }
  return resposta.status === 204 ? (null as T) : resposta.json();
}
