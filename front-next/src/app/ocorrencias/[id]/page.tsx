"use client";

import { ArrowLeft, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Aviso from "@/components/Aviso";
import Botao from "@/components/Botao";
import { FormaTipo } from "@/components/FiltroTipos";
import { api, textoErro } from "@/lib/api";
import { useSessao } from "@/lib/sessao";
import { STATUS_TEXTO, TIPOS, type ErroApi, type OcorrenciaDetalhe } from "@/lib/tipos";

type Totais = Pick<OcorrenciaDetalhe, "status" | "totalConfirma" | "totalNega">;

export default function PaginaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const sessao = useSessao();
  const [o, setO] = useState<OcorrenciaDetalhe | null>(null);
  const [erro, setErro] = useState("");
  const [avaliou, setAvaliou] = useState("");

  useEffect(() => {
    api<OcorrenciaDetalhe>(`/ocorrencias/${id}`).then(setO, (e) => setErro(textoErro(e)));
  }, [id, sessao?.usuario.id]);

  async function avaliar(confirma: boolean) {
    setErro("");
    try {
      const totais = await api<Totais>(`/ocorrencias/${id}/confirmacoes`, { method: "POST", body: { confirma } });
      setO((antes) => antes && { ...antes, ...totais });
      setAvaliou("Obrigado por avaliar! Você ganhou +2 pontos.");
    } catch (e) {
      if ((e as ErroApi).status === 409) setAvaliou("Você já avaliou este alerta.");
      else setErro(textoErro(e));
    }
  }

  const voltar = (
    <Link href="/" className="inline-flex min-h-12 items-center gap-2 self-start font-semibold">
      <ArrowLeft aria-hidden="true" className="size-5" /> Voltar ao mapa
    </Link>
  );

  if (!o)
    return (
      <div className="pagina">
        {voltar}
        {erro ? <Aviso tipo="alert">{erro}</Aviso> : <p role="status">Carregando…</p>}
      </div>
    );

  return (
    <div className="pagina">
      {voltar}
      {o.fotoUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- URL externa do Vercel Blob
        <img src={o.fotoUrl} alt={`Foto do problema: ${o.categoria}`} className="max-h-80 w-full rounded-2xl object-cover" />
      )}
      <header className="space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold">
          <FormaTipo tipo={o.tipo} tamanho={16} />
          {TIPOS[o.tipo].rotulo}
        </span>
        <h1 className="text-3xl font-bold tracking-tight break-words">{o.categoria}</h1>
        <p className="text-neutral-600">
          {STATUS_TEXTO[o.status]} · avisado em {new Date(o.dtRegistro).toLocaleDateString("pt-BR")}
          {o.bairro && ` · ${o.bairro}`}
        </p>
      </header>
      {o.descricao && <p className="break-words">{o.descricao}</p>}

      <dl className="grid grid-cols-2 gap-3">
        <div className="cartao">
          <dt className="text-sm text-neutral-600">Ainda está lá</dt>
          <dd className="text-2xl font-bold">{o.totalConfirma}</dd>
        </div>
        <div className="cartao">
          <dt className="text-sm text-neutral-600">Já foi resolvido</dt>
          <dd className="text-2xl font-bold">{o.totalNega}</dd>
        </div>
      </dl>

      {erro && <Aviso tipo="alert">{erro}</Aviso>}
      {o.minha ? (
        <Aviso>Este alerta é seu. Outras pessoas vão avaliar.</Aviso>
      ) : !sessao ? (
        <Botao variante="secundario" className="w-full" href={`/login?voltar=/ocorrencias/${id}`}>
          Entre para avaliar
        </Botao>
      ) : (
        <div className="space-y-3">
          <p className="font-semibold">O problema continua?</p>
          <div className="grid grid-cols-2 gap-2">
            <Botao disabled={!!avaliou} onClick={() => avaliar(true)}>
              <ThumbsUp aria-hidden="true" className="size-5" /> Ainda está lá
            </Botao>
            <Botao variante="secundario" disabled={!!avaliou} onClick={() => avaliar(false)}>
              <ThumbsDown aria-hidden="true" className="size-5" /> Já foi resolvido
            </Botao>
          </div>
          {avaliou && <Aviso>{avaliou}</Aviso>}
        </div>
      )}
    </div>
  );
}
