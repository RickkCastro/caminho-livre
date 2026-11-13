import { Check } from "lucide-react";
import { TIPOS, type Tipo } from "@/lib/tipos";

export function FormaTipo({ tipo, tamanho = 20 }: { tipo: Tipo; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <path d={TIPOS[tipo].forma} fill={TIPOS[tipo].cor} stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

export default function FiltroTipos({ ativos, aoMudar }: { ativos: Tipo[]; aoMudar: (t: Tipo[]) => void }) {
  return (
    <div role="group" aria-label="Filtrar por tipo de problema" className="flex flex-wrap gap-2">
      {(Object.keys(TIPOS) as Tipo[]).map((tipo) => {
        const ativo = ativos.includes(tipo);
        return (
          <button
            key={tipo}
            type="button"
            aria-pressed={ativo}
            onClick={() => aoMudar(ativo ? ativos.filter((t) => t !== tipo) : [...ativos, tipo])}
            className={`inline-flex min-h-12 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-marca-escuro shadow-md transition ${ativo ? "bg-marca-agua" : "bg-white"}`}
          >
            <FormaTipo tipo={tipo} />
            {TIPOS[tipo].rotulo}
            {ativo && <Check aria-hidden="true" className="size-4" />}
          </button>
        );
      })}
    </div>
  );
}
