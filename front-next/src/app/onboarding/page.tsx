"use client";

import { Accessibility } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Aviso from "@/components/Aviso";
import Botao from "@/components/Botao";
import { api, textoErro } from "@/lib/api";
import { atualizarUsuario, useExigirLogin } from "@/lib/sessao";
import type { SN, Usuario } from "@/lib/tipos";

export default function PaginaOnboarding() {
  const sessao = useExigirLogin();
  const router = useRouter();
  const [erro, setErro] = useState("");

  if (!sessao) return <p role="status" className="pagina">Carregando…</p>;

  async function responder(mobilidadeReduzida: SN) {
    try {
      const u = await api<Usuario>(`/usuarios/${sessao!.usuario.id}`, { method: "PUT", body: { mobilidadeReduzida } });
      atualizarUsuario({ ...u, primeiroAcesso: false });
      router.replace("/");
    } catch (e) {
      setErro(textoErro(e));
    }
  }

  return (
    <div className="pagina min-h-full justify-center text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-marca-suave">
        <Accessibility aria-hidden="true" className="size-9" />
      </span>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Você tem mobilidade reduzida?</h1>
        <p className="text-neutral-600">
          Por exemplo: usa cadeira de rodas, andador, muleta ou carrinho de bebê. Usamos isso para evitar degraus na sua
          rota.
        </p>
      </div>
      {erro && <Aviso tipo="alert">{erro}</Aviso>}
      <div className="grid grid-cols-2 gap-2">
        <Botao onClick={() => responder("S")}>Sim</Botao>
        <Botao variante="secundario" onClick={() => responder("N")}>
          Não
        </Botao>
      </div>
    </div>
  );
}
