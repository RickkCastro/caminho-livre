import Link from "next/link";
import type { ComponentProps } from "react";

const BASE =
  "inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50";
const VARIANTES = {
  principal: "bg-marca-escuro text-white shadow-sm hover:bg-[#1f3a1b]",
  secundario: "border border-neutral-300 bg-white text-marca-escuro hover:bg-neutral-50",
  perigo: "border border-erro bg-white text-erro hover:bg-red-50",
};

type Props = { variante?: keyof typeof VARIANTES; href?: string } & ComponentProps<"button">;

export default function Botao({ variante = "principal", href, className = "", ...resto }: Props) {
  const classes = `${BASE} ${VARIANTES[variante]} ${className}`;
  if (href)
    return (
      <Link href={href} className={classes}>
        {resto.children}
      </Link>
    );
  return <button type="button" {...resto} className={classes} />;
}
