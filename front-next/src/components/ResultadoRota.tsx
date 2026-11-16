import type { Rota } from "@/lib/tipos";
import Aviso from "./Aviso";

const metros = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(1).replace(".", ",")} km` : `${Math.round(m)} m`);

/** Legenda em texto das duas linhas que o <Mapa rota> desenha. */
export default function ResultadoRota({ rota }: { rota: Rota }) {
  return (
    <section aria-label="Resultado da rota" className="space-y-2">
      {rota.aviso && <Aviso>{rota.aviso}</Aviso>}
      <ul className="grid gap-2">
        {rota.caminhoLivre && (
          <li className="flex items-center gap-3 rounded-xl bg-marca-agua p-3 text-marca-escuro">
            <svg width="32" height="8" aria-hidden="true" className="shrink-0">
              <line x1="0" y1="4" x2="32" y2="4" stroke="#2A4B25" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <span>
              <strong>Caminho Livre</strong> (linha contínua): {metros(rota.caminhoLivre.distanciaM)}
            </span>
          </li>
        )}
        <li className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
          <svg width="32" height="8" aria-hidden="true" className="shrink-0">
            <line x1="0" y1="4" x2="32" y2="4" stroke="#525252" strokeWidth="4" strokeDasharray="6 5" />
          </svg>
          <span>
            <strong>Rota comum</strong> (linha tracejada): {metros(rota.comum.distanciaM)}
          </span>
        </li>
      </ul>
    </section>
  );
}
