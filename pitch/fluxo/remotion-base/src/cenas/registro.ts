// Cenas construídas deste vídeo. `ate`: a cena cobre também as seguintes até esse id (mesmo mundo, sem corte).
import React from "react";
import type { Cena } from "../base/Placeholder";

export const CENAS: Record<string, { comp: React.FC<{ cenas: Cena[] }>; ate?: string }> = {};
