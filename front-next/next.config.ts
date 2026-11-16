import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false, // o selo do Next cobria a navegação inferior
  distDir: process.env.NEXT_DIST_DIR ?? ".next", // os testes usam outra pasta para rodar junto do dev
};

export default nextConfig;
