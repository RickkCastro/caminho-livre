"use client";

import dynamic from "next/dynamic";

// Leaflet precisa de `window`: só no navegador.
export default dynamic(() => import("./MapaLeaflet"), {
  ssr: false,
  loading: () => <p role="status">Carregando o mapa…</p>,
});
