import { CircleAlert, Info } from "lucide-react";
import type { ReactNode } from "react";

/** Mensagem lida por leitor de tela: "status" (informação) ou "alert" (erro). */
export default function Aviso({
  tipo = "status",
  className = "",
  children,
}: {
  tipo?: "status" | "alert";
  className?: string;
  children: ReactNode;
}) {
  const erro = tipo === "alert";
  const Icone = erro ? CircleAlert : Info;
  return (
    <p
      role={tipo}
      className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-medium ${erro ? "bg-red-50 text-erro" : "bg-marca-suave text-marca-escuro"} ${className}`}
    >
      <Icone aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
