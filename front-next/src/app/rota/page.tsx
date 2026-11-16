"use client";

import { ArrowDownUp, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import Aviso from "@/components/Aviso";
import Botao from "@/components/Botao";
import BuscaEndereco, { MINHA_LOCALIZACAO } from "@/components/BuscaEndereco";
import Mapa from "@/components/Mapa";
import ResultadoRota from "@/components/ResultadoRota";
import { api, textoErro } from "@/lib/api";
import { enderecoDe } from "@/lib/endereco";
import { useSessao } from "@/lib/sessao";
import type { OcorrenciaResumo, Ponto, Preferencia, Rota } from "@/lib/tipos";

type Lugar = { p: Ponto; nome: string } | null;
const PONTO_NO_MAPA = "Ponto marcado no mapa";

export default function PaginaRota() {
  const sessao = useSessao();
  const idUsuario = sessao?.usuario.id;
  const [origem, setOrigem] = useState<Lugar>(null);
  const [destino, setDestino] = useState<Lugar>(null);
  const [mobilidadeVisitante, setMobilidadeVisitante] = useState(false);
  const [ignorar, setIgnorar] = useState<number[]>([]);
  const [rota, setRota] = useState<Rota | null>(null);
  const [alertas, setAlertas] = useState<OcorrenciaResumo[]>([]);
  const [marcando, setMarcando] = useState<"origem" | "destino" | null>(null);
  const [erro, setErro] = useState("");
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    // Origem padrão: onde a pessoa está (se ela ainda não escolheu outra).
    navigator.geolocation?.getCurrentPosition(
      (p) =>
        setOrigem((atual) => atual ?? { p: { lat: p.coords.latitude, lon: p.coords.longitude }, nome: MINHA_LOCALIZACAO }),
      () => {},
    );
  }, []);

  useEffect(() => {
    // Alertas no mapa da rota: mostram do que a linha Caminho Livre está desviando.
    api<OcorrenciaResumo[]>("/ocorrencias").then(setAlertas, () => {});
  }, []);

  useEffect(() => {
    // Preferências (US11) são opcionais: sem elas, a rota considera tudo.
    if (idUsuario)
      api<Preferencia[]>(`/usuarios/${idUsuario}/preferencias`).then(
        (ps) => setIgnorar(ps.filter((p) => p.considerar === "N").map((p) => p.idCategoria)),
        () => {},
      );
  }, [idUsuario]);

  const mobilidade = sessao ? sessao.usuario.mobilidadeReduzida === "S" : mobilidadeVisitante;
  const escolher = (definir: (l: Lugar) => void) => (p: Ponto | null, nome: string) => {
    setRota(null);
    definir(p && { p, nome });
  };

  // Toque no mapa marca o ponto escolhido no seletor; sem escolha, o que estiver faltando.
  const alvo = marcando ?? (origem && !destino ? "destino" : "origem");
  async function tocar(p: Ponto) {
    const definir = alvo === "origem" ? setOrigem : setDestino;
    escolher(definir)(p, PONTO_NO_MAPA);
    if (alvo === "origem") setMarcando("destino");
    const { logradouro, bairro } = await enderecoDe(p.lat, p.lon);
    const nome = [logradouro, bairro].filter(Boolean).join(", ");
    // Só troca o nome se a pessoa não marcou outro ponto enquanto o endereço chegava.
    if (nome) definir((atual) => (atual?.p === p ? { p, nome } : atual));
  }

  async function verRota() {
    if (!origem || !destino) return;
    setErro("");
    setBuscando(true);
    const q = new URLSearchParams({
      origemLat: String(origem.p.lat),
      origemLon: String(origem.p.lon),
      destinoLat: String(destino.p.lat),
      destinoLon: String(destino.p.lon),
      hora: String(new Date().getHours()),
      mobilidadeReduzida: mobilidade ? "S" : "N",
      ...(ignorar.length && { ignorar: ignorar.join(",") }),
    });
    try {
      setRota(await api<Rota>(`/rotas?${q}`));
    } catch (e) {
      setRota(null);
      setErro(textoErro(e));
    } finally {
      setBuscando(false);
    }
  }

  const falta = [!origem && "de onde você sai", !destino && "para onde vai"].filter(Boolean).join(" e ");

  return (
    <div className="md:grid md:h-full md:grid-cols-[minmax(22rem,26rem)_1fr]">
      <div className="pagina md:mx-0 md:max-w-none md:overflow-y-auto md:border-r md:border-neutral-200">
        <h1 className="text-2xl font-bold tracking-tight">Rota</h1>

        <div className="cartao relative space-y-2">
          <BuscaEndereco rotulo="De onde você sai?" valor={origem?.nome ?? ""} aoEscolher={escolher(setOrigem)} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setOrigem(destino);
                setDestino(origem);
                setRota(null);
              }}
              disabled={!origem && !destino}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 text-sm font-semibold hover:bg-neutral-100 disabled:opacity-50"
            >
              <ArrowDownUp aria-hidden="true" className="size-4" /> Inverter
            </button>
          </div>
          <BuscaEndereco rotulo="Para onde você vai?" valor={destino?.nome ?? ""} aoEscolher={escolher(setDestino)} />
        </div>

        {sessao ? (
          <p className="text-sm text-neutral-600">Mobilidade reduzida: {mobilidade ? "sim" : "não"} (do seu perfil).</p>
        ) : (
          <label className="flex min-h-12 items-center gap-3">
            <input
              type="checkbox"
              className="size-5 accent-marca-escuro"
              checked={mobilidadeVisitante}
              onChange={(e) => setMobilidadeVisitante(e.target.checked)}
            />
            Tenho mobilidade reduzida
          </label>
        )}

        <div className="space-y-2">
          {falta && (
            <p id="falta-rota" className="text-sm text-neutral-600">
              Falta escolher {falta}.
            </p>
          )}
          <Botao
            className="w-full"
            disabled={!!falta || buscando}
            aria-describedby={falta ? "falta-rota" : undefined}
            onClick={verRota}
          >
            <Navigation aria-hidden="true" className="size-5" /> {buscando ? "Calculando…" : "Ver rota"}
          </Botao>
        </div>

        {erro && <Aviso tipo="alert">{erro}</Aviso>}
        {rota && <ResultadoRota rota={rota} />}
      </div>

      <div className="relative px-4 pb-6 md:p-0">
        <fieldset className="absolute top-3 left-7 z-[1000] rounded-2xl bg-white p-2 shadow-md md:left-4">
          <legend className="sr-only">Tocar no mapa marca</legend>
          <p aria-hidden="true" className="px-1 pb-1 text-xs font-semibold text-neutral-600">
            Tocar no mapa marca
          </p>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1">
            {(["origem", "destino"] as const).map((m) => (
              <label
                key={m}
                className="flex min-h-12 cursor-pointer items-center justify-center rounded-lg px-3 text-sm font-semibold has-checked:bg-marca-agua has-focus-visible:outline-3"
              >
                <input type="radio" name="marcando" className="sr-only" checked={alvo === m} onChange={() => setMarcando(m)} />
                {m === "origem" ? "Origem" : "Destino"}
              </label>
            ))}
          </div>
        </fieldset>
        <Mapa
          alertas={alertas}
          aoTocar={tocar}
          className="h-96 rounded-2xl md:h-full md:rounded-none"
          rota={rota}
          pontos={[
            ["Origem", origem?.p ?? null],
            ["Destino", destino?.p ?? null],
          ]}
        />
      </div>
    </div>
  );
}
