"use client";

import { Camera, LocateFixed, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import Aviso from "@/components/Aviso";
import Botao from "@/components/Botao";
import { FormaTipo } from "@/components/FiltroTipos";
import Mapa from "@/components/Mapa";
import { api, textoErro } from "@/lib/api";
import { enviarFoto } from "@/lib/foto";
import { CHAVE_RASCUNHO, useExigirLogin } from "@/lib/sessao";
import type { Categoria, NovaOcorrencia } from "@/lib/tipos";

type Rascunho = Partial<NovaOcorrencia>;

function Passo({ n, titulo, feito, children }: { n: number; titulo: string; feito?: boolean; children: ReactNode }) {
  return (
    <section aria-labelledby={`passo-${n}`} className="cartao space-y-3">
      <h2 id={`passo-${n}`} className="flex items-center gap-3 font-semibold">
        <span
          aria-hidden="true"
          className={`grid size-7 place-items-center rounded-full text-sm ${feito ? "bg-marca-escuro text-white" : "bg-marca-suave"}`}
        >
          {feito ? "✓" : n}
        </span>
        {titulo}
      </h2>
      {children}
    </section>
  );
}

export default function PaginaNovaOcorrencia() {
  const sessao = useExigirLogin();
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [r, setR] = useState<Rascunho | null>(null); // null até ler o rascunho guardado
  const [recado, setRecado] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setR(JSON.parse(sessionStorage.getItem(CHAVE_RASCUNHO) ?? "{}"));
    api<Categoria[]>("/categorias").then(setCategorias, (e) => setErro(textoErro(e)));
  }, []);
  useEffect(() => {
    if (r) sessionStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(r));
  }, [r]);

  if (!sessao || !r) return <p role="status" className="pagina">Carregando…</p>;

  const mudar = (parte: Rascunho) => setR((antes) => ({ ...antes, ...parte }));
  const temLocal = r.latitude != null && r.longitude != null;
  const falta = [!r.idCategoria && "o tipo de problema", !temLocal && "o local"].filter(Boolean).join(" e ");

  async function escolherFoto(file?: File) {
    if (!file) return;
    setRecado("Enviando a foto…");
    try {
      mudar({ fotoUrl: await enviarFoto(file) });
      setRecado("Foto adicionada.");
    } catch {
      setRecado("Não foi possível enviar a foto. Você pode avisar sem foto.");
    }
  }

  function usarLocalizacao() {
    setRecado("Buscando sua localização…");
    navigator.geolocation?.getCurrentPosition(
      (p) => {
        mudar({ latitude: p.coords.latitude, longitude: p.coords.longitude });
        setRecado("Local marcado na sua posição.");
      },
      () => setRecado("Não foi possível usar sua localização. Toque no mapa para marcar."),
    );
  }

  async function enviar() {
    setErro("");
    setEnviando(true);
    try {
      await api("/ocorrencias", { method: "POST", body: r });
      sessionStorage.removeItem(CHAVE_RASCUNHO);
      sessionStorage.setItem("cl.aviso", "Alerta enviado. Você ganhou +10 pontos. Obrigado!");
      router.push("/");
    } catch (e) {
      setErro(textoErro(e)); // os dados continuam na tela
      setEnviando(false);
    }
  }

  return (
    <div className="pagina">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Avisar problema</h1>
        <p className="text-neutral-600">Leva menos de um minuto.</p>
      </header>

      <Passo n={1} titulo="Qual é o problema?" feito={!!r.idCategoria}>
        <fieldset>
          <legend className="sr-only">Tipo de problema</legend>
          <div className="flex flex-wrap gap-2">
            {categorias.map((c) => (
              <label
                key={c.id}
                className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-neutral-300 px-4 text-sm font-semibold has-checked:border-marca-escuro has-checked:bg-marca-agua has-focus-visible:outline-3 has-focus-visible:outline-offset-2"
              >
                <input
                  type="radio"
                  name="categoria"
                  className="sr-only"
                  checked={r.idCategoria === c.id}
                  onChange={() => mudar({ idCategoria: c.id })}
                />
                <FormaTipo tipo={c.tipo} />
                {c.nome}
              </label>
            ))}
          </div>
        </fieldset>
      </Passo>

      <Passo n={2} titulo="Onde fica?" feito={temLocal}>
        <Botao variante="secundario" className="w-full" onClick={usarLocalizacao}>
          <LocateFixed aria-hidden="true" className="size-5" /> Usar minha localização
        </Botao>
        <p className="text-sm text-neutral-600">Ou toque no mapa para marcar o lugar.</p>
        <Mapa
          className="h-56 rounded-xl"
          aoTocar={(p) => mudar({ latitude: p.lat, longitude: p.lon })}
          pontos={[["Local", temLocal ? { lat: r.latitude!, lon: r.longitude! } : null]]}
        />
        <p role="status" className="text-sm font-medium">
          {temLocal ? "Local marcado." : "Local ainda não marcado."}
        </p>
      </Passo>

      <Passo n={3} titulo="Quer contar mais? (opcional)">
        <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-500 px-4 font-semibold has-focus-visible:outline-3">
          <Camera aria-hidden="true" className="size-5" />
          {r.fotoUrl ? "Trocar foto" : "Adicionar foto"}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => escolherFoto(e.target.files?.[0])}
          />
        </label>
        {r.fotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- prévia local ou Vercel Blob
          <img src={r.fotoUrl} alt="Prévia da foto escolhida" className="max-h-48 w-full rounded-xl object-cover" />
        )}
        <label className="block space-y-1">
          <span className="text-sm font-semibold">Descrição (até 500 letras)</span>
          <textarea
            maxLength={500}
            rows={3}
            value={r.descricao ?? ""}
            onChange={(e) => mudar({ descricao: e.target.value })}
            className="campo"
          />
        </label>
      </Passo>

      {recado && <Aviso>{recado}</Aviso>}
      {erro && <Aviso tipo="alert">{erro}</Aviso>}

      <div className="sticky bottom-0 -mx-4 space-y-2 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur">
        <p id="falta" className="text-center text-sm text-neutral-600">
          {falta ? `Para enviar, falta escolher ${falta}.` : "Tudo pronto para enviar."}
        </p>
        <Botao className="w-full" disabled={!!falta || enviando} aria-describedby="falta" onClick={enviar}>
          <Send aria-hidden="true" className="size-5" />
          {enviando ? "Enviando…" : "Enviar"}
        </Botao>
      </div>
    </div>
  );
}
