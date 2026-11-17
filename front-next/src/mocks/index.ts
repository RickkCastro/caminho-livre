// Respostas falsas no formato do contrato da API. Estado em memória: some ao recarregar a página.
import categorias from "./categorias.json";
import ocorrencias from "./ocorrencias.json";
import ocorrencia1 from "./ocorrencia-1.json";
import rotas from "./rotas.json";
import usuarioInicial from "./usuario.json";
import rankingBairros from "./ranking-bairros.json";
import rankingUsuarios from "./ranking-usuarios.json";
import type { NovaOcorrencia, OcorrenciaDetalhe, Preferencia, Usuario } from "@/lib/tipos";

const detalhes = new Map<number, OcorrenciaDetalhe>(
  (ocorrencias as OcorrenciaDetalhe[]).map((o) => [
    o.id,
    { ...o, descricao: null, fotoUrl: null, bairro: "Sé", dtRegistro: "2026-11-11T08:00:00", totalConfirma: 0, totalNega: 0, minha: false },
  ]),
);
detalhes.set(1, ocorrencia1 as OcorrenciaDetalhe);
let usuario = usuarioInicial as Usuario;
let preferencias: Preferencia[] = [];
const avaliadas = new Set<number>();

const erro = (status: number, msg: string) => ({ status, erro: msg });

export function mock(metodo: string, caminho: string, corpo?: unknown): unknown {
  const url = new URL(caminho, "http://mock");
  const p = url.pathname;
  const id = Number(p.match(/\/(\d+)/)?.[1]);
  const rota = `${metodo} ${p.replace(/\d+/g, ":id")}`;

  switch (rota) {
    case "POST /auth/google":
      return usuario;
    case "GET /categorias":
      return categorias;
    case "GET /ocorrencias": {
      const tipo = url.searchParams.get("tipo");
      return [...detalhes.values()].filter((o) => !tipo || o.tipo === tipo);
    }
    case "POST /ocorrencias": {
      const n = corpo as NovaOcorrencia;
      const cat = categorias.find((c) => c.id === n.idCategoria);
      if (!cat) throw erro(400, "Categoria é obrigatória");
      const nova = {
        id: Math.max(...detalhes.keys()) + 1,
        categoria: cat.nome,
        tipo: cat.tipo,
        latitude: n.latitude,
        longitude: n.longitude,
        status: "ABERTA",
        descricao: n.descricao ?? null,
        fotoUrl: n.fotoUrl ?? null,
        bairro: n.bairro ?? null,
        dtRegistro: new Date().toISOString(),
        totalConfirma: 0,
        totalNega: 0,
        minha: true,
      } as OcorrenciaDetalhe;
      detalhes.set(nova.id, nova);
      usuario = { ...usuario, pontos: usuario.pontos + 10 };
      return nova;
    }
    case "GET /ocorrencias/:id": {
      const o = detalhes.get(id);
      if (!o) throw erro(404, `Ocorrência ${id} não encontrada`);
      return o;
    }
    case "POST /ocorrencias/:id/confirmacoes": {
      const o = detalhes.get(id);
      if (!o) throw erro(404, `Ocorrência ${id} não encontrada`);
      if (avaliadas.has(id)) throw erro(409, "Você já avaliou este alerta");
      avaliadas.add(id);
      if ((corpo as { confirma: boolean }).confirma) o.totalConfirma++;
      else o.totalNega++;
      usuario = { ...usuario, pontos: usuario.pontos + 2 };
      return { status: o.status, totalConfirma: o.totalConfirma, totalNega: o.totalNega };
    }
    case "GET /rotas":
      return rotas;
    case "GET /usuarios/:id":
      return usuario;
    case "PUT /usuarios/:id":
      return (usuario = { ...usuario, ...(corpo as Partial<Usuario>), primeiroAcesso: false });
    case "DELETE /usuarios/:id":
      return null;
    case "GET /usuarios/:id/ocorrencias":
      return [...detalhes.values()].filter((o) => o.minha);
    case "GET /usuarios/:id/preferencias":
      return preferencias;
    case "PUT /usuarios/:id/preferencias":
      return (preferencias = corpo as Preferencia[]);
    case "GET /ranking/bairros":
      return rankingBairros;
    case "GET /ranking/usuarios":
      return rankingUsuarios;
  }
  throw erro(404, `Sem mock para ${rota}`);
}
