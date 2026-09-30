import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pauta-brasil.vercel.app";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pauta Brasil",
    short_name: "Pauta Brasil",
    description: "Informação, transparência e democracia. Acompanhe candidatos, propostas e o cenário político do Brasil em um só lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0A2540",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
