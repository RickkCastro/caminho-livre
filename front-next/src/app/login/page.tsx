"use client";

import { Route, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Aviso from "@/components/Aviso";
import { USA_MOCKS } from "@/lib/api";
import { botaoGoogle, entrar } from "@/lib/sessao";
import type { Usuario } from "@/lib/tipos";

const LogoGoogle = () => (
  <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z" />
    <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.8-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.6 42.6 14.6 48 24 48z" />
  </svg>
);

export default function PaginaLogin() {
  const router = useRouter();
  const alvo = useRef<HTMLDivElement>(null);
  const [falhou, setFalhou] = useState(false);

  const aoEntrar = useCallback(
    (u: Usuario) => {
      const voltar = new URLSearchParams(window.location.search).get("voltar") ?? "/";
      // Só caminhos internos: evita redirecionar para outro site.
      const destino = /^\/(?![/\\])/.test(voltar) ? voltar : "/";
      router.replace(u.primeiroAcesso ? "/onboarding" : destino);
    },
    [router],
  );
  const aoFalhar = useCallback(() => setFalhou(true), []);

  useEffect(() => {
    if (!USA_MOCKS && alvo.current) botaoGoogle(alvo.current, aoEntrar, aoFalhar).catch(aoFalhar);
  }, [aoEntrar, aoFalhar]);

  return (
    <div className="pagina min-h-full justify-center text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-marca-agua">
        <Route aria-hidden="true" className="size-9 text-marca-escuro" />
      </span>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao Caminho Livre</h1>
        <p className="text-neutral-600">Entre para avisar problemas na rua e avaliar os alertas da comunidade.</p>
      </div>

      {falhou && <Aviso tipo="alert">Não foi possível entrar. Tente de novo.</Aviso>}
      {USA_MOCKS ? (
        <button
          type="button"
          onClick={() => entrar().then(aoEntrar, aoFalhar)}
          className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white px-5 font-semibold shadow-sm hover:bg-neutral-50"
        >
          <LogoGoogle />
          Entrar com Google
        </button>
      ) : (
        <div ref={alvo} className="flex min-h-12 justify-center" />
      )}

      <p className="flex items-center justify-center gap-2 text-sm text-neutral-600">
        <ShieldCheck aria-hidden="true" className="size-4" />
        Não pedimos senha e ninguém vê quem enviou um alerta.
      </p>
    </div>
  );
}
