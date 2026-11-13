"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Aviso from "@/components/Aviso";
import Botao from "@/components/Botao";
import { FormaTipo } from "@/components/FiltroTipos";
import { api, textoErro } from "@/lib/api";
import { useExigirLogin } from "@/lib/sessao";
import { STATUS_TEXTO, type OcorrenciaDetalhe } from "@/lib/tipos";

export default function PaginaMinhas() {
  const sessao = useExigirLogin();
  const id = sessao?.usuario.id;
  const [lista, setLista] = useState<OcorrenciaDetalhe[] | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (id) api<OcorrenciaDetalhe[]>(`/usuarios/${id}/ocorrencias`).then(setLista, (e) => setErro(textoErro(e)));
  }, [id]);

  return (
    <div className="pagina">
      <h1 className="text-2xl font-bold tracking-tight">Meus alertas</h1>
      {erro && <Aviso tipo="alert">{erro}</Aviso>}
      {!lista && !erro && <p role="status">Carregando…</p>}
      {lista?.length === 0 && (
        <div className="cartao space-y-3 text-center">
          <p>Você ainda não avisou nenhum problema.</p>
          <Botao href="/ocorrencias/nova">Avisar problema</Botao>
        </div>
      )}
      <ul className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 empty:hidden">
        {lista?.map((o) => (
          <li key={o.id}>
            <Link href={`/ocorrencias/${o.id}`} className="flex items-center gap-3 p-4 hover:bg-neutral-50">
              <FormaTipo tipo={o.tipo} tamanho={28} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{o.categoria}</span>
                <span className="block text-sm text-neutral-600">
                  {new Date(o.dtRegistro).toLocaleDateString("pt-BR")} · {STATUS_TEXTO[o.status]}
                </span>
                <span className="block text-sm text-neutral-600">
                  Ainda está lá: {o.totalConfirma} · Já foi resolvido: {o.totalNega}
                </span>
              </span>
              <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-neutral-500" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
