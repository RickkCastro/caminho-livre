// Cenas construídas deste vídeo. `ate`: a cena cobre também as seguintes até esse id (mesmo mundo, sem corte).
import React from "react";
import type { Cena } from "../base/Placeholder";
import { QuemPassa, Registrar } from "./Frases";
import { Avisar, Detalhe, Dia, Expira, Login, Noite, Rotas, Tipos, Validam } from "./Demo";
import { Acessivel, Antonio, Dados, Fim, Volta } from "./Final";
import { Gancho } from "./Gancho";
import { MapaGps } from "./Mapa";
import { Remarca } from "./Remarca";
import { Desvio, FraseCelular, Logo } from "./Solucao";

export const CENAS: Record<string, { comp: React.FC<{ cenas: Cena[] }>; ate?: string }> = {
  c01: { comp: Gancho, ate: "c04" },
  c05: { comp: Remarca },
  c06: { comp: MapaGps, ate: "c07" },
  c08: { comp: QuemPassa },
  c09: { comp: Registrar },
  c10: { comp: Logo },
  c11: { comp: Desvio },
  c12: { comp: FraseCelular },
  c13: { comp: Login },
  c14: { comp: Tipos },
  c15: { comp: Avisar },
  c16: { comp: Validam },
  c17: { comp: Detalhe, ate: "c18" },
  c19: { comp: Expira },
  c20: { comp: Rotas },
  c21: { comp: Noite },
  c22: { comp: Dia },
  c23: { comp: Acessivel },
  c24: { comp: Antonio },
  c25: { comp: Dados },
  c26: { comp: Volta },
  c27: { comp: Fim },
};
