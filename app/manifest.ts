import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Centro Político",
    short_name: "Centro Político",
    description:
      "Informação, transparência e democracia. Acompanhe candidatos, propostas e o cenário político do Brasil em um só lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0A2540",
    lang: "pt-BR",
    icons: [
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
