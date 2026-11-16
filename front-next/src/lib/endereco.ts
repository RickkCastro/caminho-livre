import type { NovaOcorrencia } from "./tipos";

/** Bairro e rua do ponto (Nominatim reverse). Falha → {} (quem chama segue sem). */
export async function enderecoDe(lat: number, lon: number): Promise<Pick<NovaOcorrencia, "bairro" | "logradouro">> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&zoom=18&addressdetails=1&lat=${lat}&lon=${lon}`,
      { signal: AbortSignal.timeout(4000) },
    );
    const a = (await r.json()).address ?? {};
    const rua = [a.road, a.house_number].filter(Boolean).join(", ");
    return {
      bairro: (a.suburb ?? a.neighbourhood ?? a.city_district)?.slice(0, 80),
      logradouro: rua.slice(0, 150) || undefined,
    };
  } catch {
    return {};
  }
}
