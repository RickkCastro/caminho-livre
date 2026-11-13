"use client";

import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, ZoomControl, useMap, useMapEvents } from "react-leaflet";
import type { OcorrenciaResumo, Ponto, Rota } from "@/lib/tipos";
import Aviso from "./Aviso";
import MarcadorAlerta from "./MarcadorAlerta";

const CENTRO_SP: [number, number] = [-23.5505, -46.6333];

const pino = (nome: string) =>
  L.divIcon({
    className: "",
    iconSize: [112, 52],
    iconAnchor: [56, 16],
    html: `<div class="marcador"><svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="#2A4B25" stroke="#fff" stroke-width="3"/><circle cx="16" cy="16" r="4" fill="#fff"/></svg><span>${nome}</span></div>`,
  });

type Props = {
  alertas?: OcorrenciaResumo[];
  /** Centraliza na posição do usuário ao abrir. */
  localizar?: boolean;
  aoTocar?: (p: Ponto) => void;
  /** Pontos marcados pelo usuário: [rótulo fixo, ponto]. */
  pontos?: [string, Ponto | null][];
  rota?: Rota | null;
  /** Tamanho e forma do contêiner (posição relativa já incluída). */
  className?: string;
  /** Se informado, a tela mostra o aviso de GPS negado onde quiser. */
  aoNegarLocalizacao?: () => void;
};

function Controle({ localizar, aoTocar, pontos, rota, aoNegar }: Props & { aoNegar: () => void }) {
  const mapa = useMap();
  useMapEvents({ click: (e) => aoTocar?.({ lat: e.latlng.lat, lon: e.latlng.lng }) });

  // O Leaflet mede o contêiner só ao abrir; se o layout muda depois, sobra área branca.
  useEffect(() => {
    const observador = new ResizeObserver(() => mapa.invalidateSize());
    observador.observe(mapa.getContainer());
    return () => observador.disconnect();
  }, [mapa]);

  useEffect(() => {
    if (!localizar) return;
    if (!navigator.geolocation) return aoNegar();
    navigator.geolocation.getCurrentPosition(
      (p) => mapa.setView([p.coords.latitude, p.coords.longitude], 16),
      aoNegar,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só ao abrir
  }, [localizar, mapa]);

  // Enquadra tudo o que foi marcado: pontos (origem, destino, local) e as linhas da rota.
  const visiveis = [
    ...(pontos ?? []).flatMap(([, p]) => (p ? [p] : [])),
    ...(rota ? [...rota.comum.pontos, ...(rota.caminhoLivre?.pontos ?? [])] : []),
  ];
  const chave = visiveis.map((p) => `${p.lat},${p.lon}`).join(";");
  useEffect(() => {
    if (visiveis.length === 1) mapa.setView([visiveis[0].lat, visiveis[0].lon], Math.max(mapa.getZoom(), 16));
    else if (visiveis.length > 1)
      mapa.fitBounds(
        visiveis.map((p) => [p.lat, p.lon]),
        { padding: [40, 40], maxZoom: 17 },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só quando os pontos mudam
  }, [chave, mapa]);
  return null;
}

export default function MapaLeaflet(props: Props) {
  const { alertas = [], pontos = [], rota, className = "h-64 rounded-2xl" } = props;
  const [negado, setNegado] = useState(false);
  const linha = (ps: Ponto[]) => ps.map((p) => [p.lat, p.lon] as [number, number]);

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      <MapContainer center={CENTRO_SP} zoom={15} zoomControl={false} className="size-full">
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <ZoomControl position="bottomright" />
        <Controle {...props} aoNegar={props.aoNegarLocalizacao ?? (() => setNegado(true))} />
        {alertas.map((a) => (
          <MarcadorAlerta key={a.id} alerta={a} />
        ))}
        {pontos.map(
          ([nome, p]) => p && <Marker key={nome} position={[p.lat, p.lon]} icon={pino(nome)} title={nome} />,
        )}
        {rota && (
          <>
            <Polyline positions={linha(rota.comum.pontos)} pathOptions={{ color: "#525252", weight: 5, dashArray: "8 10" }} />
            {rota.caminhoLivre && (
              <Polyline positions={linha(rota.caminhoLivre.pontos)} pathOptions={{ color: "#2A4B25", weight: 7 }} />
            )}
          </>
        )}
      </MapContainer>
      {negado && (
        <Aviso className="absolute top-3 right-3 left-3 z-[1000] shadow-md md:right-auto md:max-w-sm">
          Sem acesso à sua localização. Mostrando o centro de São Paulo.
        </Aviso>
      )}
    </div>
  );
}
