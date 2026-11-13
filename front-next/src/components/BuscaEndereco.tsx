"use client";

import { LocateFixed, Search } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type { Ponto } from "@/lib/tipos";

type Lugar = { display_name: string; lat: string; lon: string };
const cache = new Map<string, Lugar[]>();
// Área mapeada (cidade de São Paulo): oeste, norte, leste, sul.
const VIEWBOX = "-46.83,-23.36,-46.36,-23.80";
export const MINHA_LOCALIZACAO = "Minha localização";

const nomeCurto = (l: Lugar) => l.display_name.split(",").slice(0, 3).join(",");

type Props = {
  rotulo: string;
  /** Nome do lugar escolhido ("" = nada escolhido). */
  valor: string;
  aoEscolher: (p: Ponto | null, nome: string) => void;
};

/** Campo de endereço (Nominatim) com atalho "Usar minha localização". */
export default function BuscaEndereco({ rotulo, valor, aoEscolher }: Props) {
  const id = useId();
  const [texto, setTexto] = useState(valor);
  const [lugares, setLugares] = useState<Lugar[] | null>(null);
  const [recado, setRecado] = useState("");

  useEffect(() => {
    if (valor) setTexto(valor); // escolha vinda de fora (ex.: GPS ao abrir, inverter)
  }, [valor]);

  useEffect(() => {
    const q = texto.trim().toLowerCase();
    if (q.length < 3 || texto === valor) return setLugares(null);
    if (cache.has(q)) return setLugares(cache.get(q)!);
    // Nominatim: no máximo 1 pedido por segundo.
    const espera = setTimeout(async () => {
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=5&bounded=1&viewbox=${VIEWBOX}&q=${encodeURIComponent(q)}`,
        );
        const achados: Lugar[] = r.ok ? await r.json() : [];
        if (r.ok) cache.set(q, achados);
        setLugares(achados);
      } catch {
        setLugares([]);
      }
    }, 1000);
    return () => clearTimeout(espera);
  }, [texto, valor]);

  function usarLocalizacao() {
    setRecado("Buscando sua localização…");
    setLugares(null);
    navigator.geolocation?.getCurrentPosition(
      (p) => {
        setRecado("");
        aoEscolher({ lat: p.coords.latitude, lon: p.coords.longitude }, MINHA_LOCALIZACAO);
      },
      () => setRecado("Não foi possível usar sua localização. Digite o endereço."),
    );
  }

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
      </label>
      <div className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-neutral-600" />
        <input
          id={id}
          type="search"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setRecado("");
            if (valor) aoEscolher(null, ""); // mexeu no texto: a escolha anterior deixa de valer
          }}
          placeholder="Rua, número ou lugar"
          autoComplete="off"
          className="campo pl-10 placeholder:text-neutral-600"
        />
      </div>
      {valor !== MINHA_LOCALIZACAO && (
        <button
          type="button"
          onClick={usarLocalizacao}
          className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
        >
          <LocateFixed aria-hidden="true" className="size-4" /> Usar minha localização
        </button>
      )}
      <div role="status" className="text-sm">
        {recado || (lugares?.length === 0 && "Endereço não encontrado. Tente com o número ou o bairro.")}
      </div>
      {!!lugares?.length && (
        <ul className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
          {lugares.map((l) => (
            <li key={l.lat + l.lon}>
              <button
                type="button"
                className="min-h-12 w-full px-4 py-2 text-left text-sm hover:bg-neutral-50"
                onClick={() => {
                  setLugares(null);
                  aoEscolher({ lat: +l.lat, lon: +l.lon }, nomeCurto(l));
                }}
              >
                {l.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
