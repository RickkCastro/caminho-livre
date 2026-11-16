"use client";

import { CircleUserRound, Map, Megaphone, Navigation, Route } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useSessao } from "@/lib/sessao";
import Aviso from "./Aviso";

const NAV = [
  { href: "/", Icone: Map, texto: "Mapa" },
  { href: "/rota", Icone: Navigation, texto: "Rota" },
  { href: "/ocorrencias/nova", Icone: Megaphone, texto: "Avisar" },
  { href: "/perfil", Icone: CircleUserRound, texto: "Perfil" },
];

function assinarRede(aoMudar: () => void) {
  window.addEventListener("online", aoMudar);
  window.addEventListener("offline", aoMudar);
  return () => {
    window.removeEventListener("online", aoMudar);
    window.removeEventListener("offline", aoMudar);
  };
}

/** Cabeçalho, avisos globais e navegação (embaixo no celular, no topo no desktop). */
export default function Casca({ children }: { children: ReactNode }) {
  const sessao = useSessao();
  const caminho = usePathname();
  const online = useSyncExternalStore(
    assinarRede,
    () => navigator.onLine,
    () => true,
  );
  const [acordando, setAcordando] = useState(false);

  useEffect(() => {
    const ouvir = (e: Event) => setAcordando((e as CustomEvent<boolean>).detail);
    window.addEventListener("cl:acordando", ouvir);
    return () => window.removeEventListener("cl:acordando", ouvir);
  }, []);

  const links = (classe: (ativo: boolean) => string) =>
    NAV.map(({ href, Icone, texto }) => {
      const ativo = caminho === href;
      return (
        <li key={href} className="flex-1 md:flex-none">
          <Link href={href} aria-current={ativo ? "page" : undefined} className={classe(ativo)}>
            <Icone aria-hidden="true" className="size-5" />
            {texto}
          </Link>
        </li>
      );
    });

  return (
    <div className="flex h-dvh flex-col">
      <header className="z-[1001] flex min-h-16 shrink-0 flex-wrap items-center gap-x-4 border-b border-neutral-200 bg-white px-4 md:px-6">
        <Link href="/" className="flex min-h-12 items-center gap-2 text-lg font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-marca-agua">
            <Route aria-hidden="true" className="size-5 text-marca-escuro" />
          </span>
          Caminho Livre
        </Link>

        <nav aria-label="Principal" className="ml-4 hidden md:block">
          <ul className="flex gap-1">
            {links(
              (ativo) =>
                `flex min-h-12 items-center gap-2 rounded-xl px-4 font-semibold ${ativo ? "bg-marca-suave" : "hover:bg-neutral-100"}`,
            )}
          </ul>
        </nav>

        <div className="ml-auto">
          {sessao ? (
            <Link href="/perfil" className="flex min-h-12 items-center gap-2 rounded-full pr-1 font-semibold">
              <span className="hidden max-w-32 truncate sm:inline">{sessao.usuario.nome.split(" ")[0]}</span>
              {sessao.usuario.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- URL externa
                <img src={sessao.usuario.fotoUrl} referrerPolicy="no-referrer" alt="" className="size-9 rounded-full object-cover" />
              ) : (
                <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-marca-suave font-bold">
                  {sessao.usuario.nome[0]}
                </span>
              )}
              <span className="sr-only sm:hidden">Meu perfil</span>
            </Link>
          ) : (
            caminho !== "/login" && (
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center rounded-xl bg-marca-escuro px-5 font-semibold text-white"
            >
              Entrar
            </Link>
            )
          )}
        </div>
      </header>

      {(!online || acordando) && (
        <div className="space-y-2 px-4 pt-2">
          {!online && <Aviso tipo="alert">Sem internet. O que você preencheu fica guardado.</Aviso>}
          {acordando && <Aviso>Acordando o servidor… pode levar até 1 minuto.</Aviso>}
        </div>
      )}

      <main className="relative flex-1 overflow-y-auto">{children}</main>

      <nav aria-label="Principal" className="z-[1001] shrink-0 border-t border-neutral-200 bg-white md:hidden">
        <ul className="flex pb-[env(safe-area-inset-bottom)]">
          {links(
            (ativo) =>
              `flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-semibold [&>svg]:h-[32px] [&>svg]:w-[56px] [&>svg]:rounded-full [&>svg]:px-[16px] [&>svg]:py-[6px] ${ativo ? "text-marca-escuro [&>svg]:bg-marca-agua" : "text-neutral-600"}`,
          )}
        </ul>
      </nav>
    </div>
  );
}
