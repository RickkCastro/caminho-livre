// Espelha specs/001-api-rest-java/contracts/api.md (Princípio V).
export type Tipo = "ACESSIBILIDADE" | "SEGURANCA" | "CLIMA";
export type Status = "ABERTA" | "CONFIRMADA" | "EXPIRADA" | "RESOLVIDA";
export type SN = "S" | "N";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  fotoUrl: string | null;
  mobilidadeReduzida: SN;
  pontos: number;
  primeiroAcesso: boolean;
};

export type Categoria = { id: number; nome: string; tipo: Tipo; bloqueiaMobilidade: SN };

export type OcorrenciaResumo = {
  id: number;
  categoria: string;
  tipo: Tipo;
  latitude: number;
  longitude: number;
  status: Status;
};

export type OcorrenciaDetalhe = OcorrenciaResumo & {
  descricao: string | null;
  fotoUrl: string | null;
  bairro: string | null;
  dtRegistro: string;
  totalConfirma: number;
  totalNega: number;
  minha: boolean;
};

/** descricao ≤ 500 caracteres. */
export type NovaOcorrencia = {
  idCategoria: number;
  latitude: number;
  longitude: number;
  descricao?: string;
  fotoUrl?: string;
};

export type Preferencia = { idCategoria: number; considerar: SN };

export type Ponto = { lat: number; lon: number };
export type Trajeto = { pontos: Ponto[]; distanciaM: number };
export type Rota = { comum: Trajeto; caminhoLivre: Trajeto | null; aviso?: string };

export type RankingBairros = Record<
  "melhores" | "piores",
  { bairro: string; pontuacao: number; totalAtivas: number }[]
>;

export type ErroApi = { status: number; erro: string };

export const TIPOS: Record<Tipo, { rotulo: string; cor: string; forma: string }> = {
  ACESSIBILIDADE: { rotulo: "Acessibilidade", cor: "#1F5FAD", forma: "M16 3a13 13 0 1 0 0 26a13 13 0 1 0 0-26z" }, // círculo
  SEGURANCA: { rotulo: "Segurança", cor: "#B3261E", forma: "M16 3L30 28H2z" }, // triângulo
  CLIMA: { rotulo: "Clima", cor: "#6A3FA0", forma: "M16 2C16 2 6 14 6 20a10 10 0 0 0 20 0C26 14 16 2 16 2z" }, // gota
};

export const STATUS_TEXTO: Record<Status, string> = {
  ABERTA: "Aguardando confirmação",
  CONFIRMADA: "Confirmado pela comunidade",
  RESOLVIDA: "Resolvido",
  EXPIRADA: "Expirado",
};
