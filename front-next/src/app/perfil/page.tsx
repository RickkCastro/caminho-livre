"use client";

import { Camera, ChevronRight, ListChecks, LogOut, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Aviso from "@/components/Aviso";
import Botao from "@/components/Botao";
import { api, textoErro } from "@/lib/api";
import { enviarFoto } from "@/lib/foto";
import { atualizarUsuario, sair, useExigirLogin } from "@/lib/sessao";
import type { Categoria, Preferencia, Usuario } from "@/lib/tipos";

export default function PaginaPerfil() {
  const sessao = useExigirLogin();
  const router = useRouter();
  const id = sessao?.usuario.id;
  const [nome, setNome] = useState("");
  const [mobilidade, setMobilidade] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [ignoradas, setIgnoradas] = useState<number[]>([]);
  const [recado, setRecado] = useState("");
  const [erro, setErro] = useState("");
  const dialogo = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!id) return;
    // Busca o perfil atual (pontos mudam ao enviar e avaliar).
    api<Usuario>(`/usuarios/${id}`).then(
      (u) => {
        atualizarUsuario(u);
        setNome(u.nome);
        setMobilidade(u.mobilidadeReduzida === "S");
      },
      (e) => setErro(textoErro(e)),
    );
    api<Categoria[]>("/categorias").then(setCategorias, () => {});
    api<Preferencia[]>(`/usuarios/${id}/preferencias`).then(
      (ps) => setIgnoradas(ps.filter((p) => p.considerar === "N").map((p) => p.idCategoria)),
      () => {},
    );
  }, [id]);

  if (!sessao) return <p role="status" className="pagina">Carregando…</p>;
  const u = sessao.usuario;

  async function tentar(acao: () => Promise<string>) {
    setErro("");
    setRecado("");
    try {
      setRecado(await acao());
    } catch (e) {
      setErro(textoErro(e));
    }
  }

  const salvar = (dados: Partial<Usuario>) =>
    tentar(async () => {
      atualizarUsuario(await api<Usuario>(`/usuarios/${id}`, { method: "PUT", body: dados }));
      return "Perfil salvo.";
    });

  const trocarFoto = (file?: File) =>
    file &&
    tentar(async () => {
      let fotoUrl: string;
      try {
        fotoUrl = await enviarFoto(file);
      } catch {
        throw { erro: "Não foi possível enviar a foto. Tente de novo." };
      }
      atualizarUsuario(await api<Usuario>(`/usuarios/${id}`, { method: "PUT", body: { fotoUrl } }));
      return "Foto atualizada.";
    });

  const alternar = (idCategoria: number) =>
    tentar(async () => {
      const novas = ignoradas.includes(idCategoria)
        ? ignoradas.filter((i) => i !== idCategoria)
        : [...ignoradas, idCategoria];
      const corpo: Preferencia[] = categorias.map((c) => ({
        idCategoria: c.id,
        considerar: novas.includes(c.id) ? "N" : "S",
      }));
      await api(`/usuarios/${id}/preferencias`, { method: "PUT", body: corpo });
      setIgnoradas(novas);
      return "Ajuste de rota salvo.";
    });

  const excluir = () =>
    tentar(async () => {
      dialogo.current?.close();
      await api(`/usuarios/${id}`, { method: "DELETE" });
      sair();
      router.replace("/login");
      return "";
    });

  const titulo = "text-lg font-semibold";

  return (
    <div className="pagina">
      <h1 className="sr-only">Meu perfil</h1>
      <div className="flex items-center gap-4">
        <label className="relative cursor-pointer rounded-full has-focus-visible:outline-3 has-focus-visible:outline-offset-2">
          {u.fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- URL externa (Google ou Vercel Blob)
            <img src={u.fotoUrl} alt="Sua foto" className="size-20 rounded-full object-cover" />
          ) : (
            <span aria-hidden="true" className="grid size-20 place-items-center rounded-full bg-marca-suave text-3xl font-bold">
              {u.nome[0]}
            </span>
          )}
          <span className="absolute -right-1 -bottom-1 grid size-9 place-items-center rounded-full border-2 border-white bg-marca-escuro text-white">
            <Camera aria-hidden="true" className="size-4" />
          </span>
          <span className="sr-only">Trocar foto</span>
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => trocarFoto(e.target.files?.[0])} />
        </label>
        <div className="min-w-0">
          <p className="truncate text-2xl font-bold tracking-tight">{u.nome}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-marca-agua px-3 py-1 text-sm font-semibold">
            <Star aria-hidden="true" className="size-4" /> {u.pontos} pontos
          </p>
        </div>
      </div>

      {recado && <Aviso>{recado}</Aviso>}
      {erro && <Aviso tipo="alert">{erro}</Aviso>}

      <nav aria-label="Atalhos do perfil" className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200">
        {[
          { href: "/minhas", Icone: ListChecks, texto: "Meus alertas" },
          { href: "/ranking", Icone: Trophy, texto: "Ranking" },
        ].map(({ href, Icone, texto }) => (
          <Link key={href} href={href} className="flex min-h-14 items-center gap-3 px-4 font-medium hover:bg-neutral-50">
            <Icone aria-hidden="true" className="size-5" />
            <span className="flex-1">{texto}</span>
            <ChevronRight aria-hidden="true" className="size-5 text-neutral-500" />
          </Link>
        ))}
      </nav>

      <form
        className="cartao space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          salvar({ nome: nome.trim(), mobilidadeReduzida: mobilidade ? "S" : "N" });
        }}
      >
        <h2 className={titulo}>Seus dados</h2>
        <label className="block space-y-1">
          <span className="text-sm font-semibold">Nome</span>
          <input
            required
            maxLength={100}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            className="campo"
          />
        </label>
        <label className="flex min-h-12 items-center gap-3">
          <input
            type="checkbox"
            className="size-5 accent-marca-escuro"
            checked={mobilidade}
            onChange={(e) => setMobilidade(e.target.checked)}
          />
          Tenho mobilidade reduzida
        </label>
        <Botao type="submit" className="w-full">
          Salvar
        </Botao>
      </form>

      <div role="group" aria-labelledby="t-rota" className="cartao">
        <h2 id="t-rota" className={titulo}>
          Ajustar rota
        </h2>
        <p className="mb-2 text-sm text-neutral-600">O que a rota Caminho Livre deve evitar.</p>
        {categorias.map((c) => (
          <label key={c.id} className="flex min-h-12 items-center gap-3">
            <input
              type="checkbox"
              className="size-5 accent-marca-escuro"
              checked={!ignoradas.includes(c.id)}
              onChange={() => alternar(c.id)}
            />
            Evitar: {c.nome}
          </label>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Botao
          variante="secundario"
          onClick={() => {
            sair();
            router.push("/");
          }}
        >
          <LogOut aria-hidden="true" className="size-5" /> Sair
        </Botao>
        <Botao variante="perigo" onClick={() => dialogo.current?.showModal()}>
          Excluir minha conta
        </Botao>
      </div>

      <dialog
        ref={dialogo}
        aria-labelledby="t-excluir"
        className="m-auto max-w-sm rounded-2xl p-6 text-marca-escuro shadow-xl backdrop:bg-black/50"
      >
        <h2 id="t-excluir" className="text-xl font-bold">
          Excluir minha conta?
        </h2>
        <p className="my-3 text-neutral-700">
          Vamos apagar seu nome, e-mail, foto, pontos e ajustes. Os alertas que você enviou continuam no mapa, sem
          ligação com você. Não dá para desfazer.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Botao variante="secundario" onClick={() => dialogo.current?.close()}>
            Cancelar
          </Botao>
          <button type="button" className="min-h-12 rounded-xl bg-erro px-4 font-semibold text-white" onClick={excluir}>
            Sim, excluir
          </button>
        </div>
      </dialog>
    </div>
  );
}
