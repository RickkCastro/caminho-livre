"use client";

import L from "leaflet";
import Link from "next/link";
import { Marker, Popup } from "react-leaflet";
import { STATUS_TEXTO, TIPOS, type OcorrenciaResumo } from "@/lib/tipos";

const escapar = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

export default function MarcadorAlerta({ alerta }: { alerta: OcorrenciaResumo }) {
  const { rotulo, cor, forma } = TIPOS[alerta.tipo];
  const nome = `${rotulo}: ${alerta.categoria}`;
  const icone = L.divIcon({
    className: "",
    iconSize: [112, 52],
    iconAnchor: [56, 16],
    html: `<div class="marcador"><svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path d="${forma}" fill="${cor}" stroke="#fff" stroke-width="2"/></svg><span>${escapar(alerta.categoria)}</span></div>`,
  });
  return (
    <Marker
      position={[alerta.latitude, alerta.longitude]}
      icon={icone}
      title={nome}
      eventHandlers={{ add: (e) => e.target.getElement()?.setAttribute("aria-label", nome) }}
    >
      <Popup>
        <strong>{nome}</strong>
        <br />
        {STATUS_TEXTO[alerta.status]}
        <br />
        <Link href={`/ocorrencias/${alerta.id}`} className="inline-flex min-h-12 items-center font-semibold underline">
          Ver detalhes
        </Link>
      </Popup>
    </Marker>
  );
}
