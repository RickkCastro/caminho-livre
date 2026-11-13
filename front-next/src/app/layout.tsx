import type { Metadata, Viewport } from "next";
import Casca from "@/components/Casca";
// Global (não no componente do mapa): se chegar depois do mapa montar, os tiles ficam fora do lugar.
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caminho Livre",
  description: "Mapa colaborativo de problemas na rua e rotas mais acessíveis e seguras.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#76C1A9" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Casca>{children}</Casca>
      </body>
    </html>
  );
}
