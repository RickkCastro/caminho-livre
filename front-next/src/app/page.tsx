"use client";

import { Megaphone, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Aviso from "@/components/Aviso";
import FiltroTipos from "@/components/FiltroTipos";
import Mapa from "@/components/Mapa";
import { api, textoErro } from "@/lib/api";
import { TIPOS, type OcorrenciaResumo, type Tipo } from "@/lib/tipos";

export default function PaginaMapa() {
  const [ativos, setAtivos] = useState(Object.keys(TIPOS) as Tipo[]);
  const [alertas, setAlertas] = useState<OcorrenciaResumo[] | null>(null);
  const [erro, setErro] = useState("");
  const [recado, setRecado] = useState("");
  const [semGps, setSemGps] = useState(false);

  useEffect(() => {
    // Recado deixado pela tela de envio ("Alerta enviado").
    const guardado = sessionStorage.getItem("cl.aviso");
    if (guardado) setRecado(guardado); // sem "else": o StrictMode roda o efeito duas vezes
    sessionStorage.removeItem("cl.aviso");
  }, []);

  const tipoUnico = ativos.length === 1 ? ativos[0] : "";
  useEffect(() => {
    api<OcorrenciaResumo[]>(`/ocorrencias${tipoUnico && `?tipo=${tipoUnico}`}`).then(
      (a) => (setAlertas(a), setErro("")),
      (e) => setErro(textoErro(e)),
    );
  }, [tipoUnico]);

  const visiveis = alertas?.filter((a) => ativos.includes(a.tipo)) ?? [];

  return (
    <div className="absolute inset-0">
      <h1 className="sr-only">Mapa de problemas</h1>
      <Mapa localizar alertas={visiveis} className="size-full" aoNegarLocalizacao={() => setSemGps(true)} />

      {/* Camada sobre o mapa: só os elementos recebem clique. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] space-y-2 p-3 md:p-4 [&>*]:pointer-events-auto">
        <FiltroTipos ativos={ativos} aoMudar={setAtivos} />
        {recado && <Aviso className="shadow-md md:max-w-sm">{recado}</Aviso>}
        {semGps && (
          <Aviso className="shadow-md md:max-w-sm">Sem acesso à sua localização. Mostrando a região da Av. Paulista.</Aviso>
        )}
        {erro && <Aviso tipo="alert" className="shadow-md md:max-w-sm">{erro}</Aviso>}
        {alertas && !erro && visiveis.length === 0 && (
          <Aviso className="shadow-md md:max-w-sm">Nenhum problema avisado por aqui</Aviso>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1000] flex items-end gap-2 p-3 md:p-4 [&>*]:pointer-events-auto">
        <Link
          href="/ocorrencias/nova"
          className="inline-flex min-h-14 items-center gap-2 rounded-full bg-marca-escuro px-6 font-semibold text-white shadow-lg"
        >
          <Megaphone aria-hidden="true" className="size-5" />
          Avisar problema
        </Link>
        <Link
          href="/ranking"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold shadow-lg"
        >
          <Trophy aria-hidden="true" className="size-4" />
          Ranking
        </Link>
      </div>
    </div>
  );
}
