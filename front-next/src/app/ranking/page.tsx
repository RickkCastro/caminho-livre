"use client";

import { useEffect, useState } from "react";
import Aviso from "@/components/Aviso";
import { api, textoErro } from "@/lib/api";
import type { RankingBairros } from "@/lib/tipos";

type Pessoa = { nome: string; pontos: number };

function Lista({ titulo, itens }: { titulo: string; itens: { nome: string; valor: string }[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{titulo}</h2>
      <ol className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200">
        {itens.map((i, n) => (
          <li key={i.nome + n} className="flex min-h-14 flex-wrap items-center gap-x-3 px-4 py-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-marca-suave text-sm font-bold">
              {n + 1}
            </span>
            <span className="flex-1 font-medium">{i.nome}</span>
            <span className="text-sm text-neutral-600">{i.valor}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function PaginaRanking() {
  const [aba, setAba] = useState<"bairros" | "pessoas">("bairros");
  const [bairros, setBairros] = useState<RankingBairros | null>(null);
  const [pessoas, setPessoas] = useState<Pessoa[] | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setErro("");
    if (aba === "bairros") api<RankingBairros>("/ranking/bairros").then(setBairros, (e) => setErro(textoErro(e)));
    else api<Pessoa[]>("/ranking/usuarios").then(setPessoas, (e) => setErro(textoErro(e)));
  }, [aba]);

  const alertas = (n: number) => `${n} ${n === 1 ? "alerta ativo" : "alertas ativos"}`;

  return (
    <div className="pagina">
      <h1 className="text-2xl font-bold tracking-tight">Ranking</h1>
      <div role="group" aria-label="Escolher ranking" className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1">
        {(["bairros", "pessoas"] as const).map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={aba === a}
            onClick={() => setAba(a)}
            className={`min-h-12 rounded-lg font-semibold ${aba === a ? "bg-white shadow-sm" : "text-neutral-600"}`}
          >
            {a === "bairros" ? "Bairros" : "Pessoas"}
          </button>
        ))}
      </div>
      {erro && <Aviso tipo="alert">{erro}</Aviso>}
      {aba === "bairros" && bairros && (
        <>
          <Lista
            titulo="Menos problemas"
            itens={bairros.melhores.map((b) => ({ nome: b.bairro, valor: alertas(b.totalAtivas) }))}
          />
          <Lista
            titulo="Mais problemas"
            itens={bairros.piores.map((b) => ({ nome: b.bairro, valor: alertas(b.totalAtivas) }))}
          />
        </>
      )}
      {aba === "pessoas" && pessoas && (
        <Lista titulo="Quem mais ajudou" itens={pessoas.map((p) => ({ nome: p.nome, valor: `${p.pontos} pontos` }))} />
      )}
    </div>
  );
}
