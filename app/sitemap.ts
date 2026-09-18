import type { MetadataRoute } from "next";
import { candidatos } from "@/data/candidatos";
import { noticias } from "@/data/noticias";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  const rotasEstáticas: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: agora, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/portal`, lastModified: agora, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/mapa`, lastModified: agora, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/candidatos`, lastModified: agora, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/comparador`, lastModified: agora, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/noticias`, lastModified: agora, changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteUrl}/planos`, lastModified: agora, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/ferramentas`, lastModified: agora, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/sobre`, lastModified: agora, changeFrequency: "monthly", priority: 0.5 },
  ];

  const rotasCandidatos: MetadataRoute.Sitemap = candidatos.map((c) => ({
    url: `${siteUrl}/candidatos/${c.id}`,
    lastModified: agora,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const rotasNoticias: MetadataRoute.Sitemap = noticias.map((n) => ({
    url: `${siteUrl}/noticias/${n.id}`,
    lastModified: agora,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...rotasEstáticas, ...rotasCandidatos, ...rotasNoticias];
}