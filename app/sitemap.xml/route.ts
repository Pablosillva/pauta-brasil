import { candidatos } from "@/data/candidatos";
import { listarNoticias } from "@/lib/noticias";

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pauta-brasil.vercel.app";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const noticias = await listarNoticias();

  const urls = [
    { loc: "/", changefreq: "daily", priority: "1.0" },
    { loc: "/portal", changefreq: "daily", priority: "0.9" },
    { loc: "/mapa", changefreq: "weekly", priority: "0.9" },
    { loc: "/candidatos", changefreq: "daily", priority: "0.9" },
    { loc: "/comparador", changefreq: "weekly", priority: "0.8" },
    { loc: "/noticias", changefreq: "hourly", priority: "0.9" },
    { loc: "/planos", changefreq: "weekly", priority: "0.7" },
    { loc: "/ferramentas", changefreq: "weekly", priority: "0.8" },
    { loc: "/sobre", changefreq: "monthly", priority: "0.5" },
    ...candidatos.map((c) => ({
      loc: `/candidatos/${c.id}`,
      changefreq: "weekly",
      priority: "0.7",
    })),
    ...noticias.map((n) => ({
      loc: `/noticias/${n.slug}`,
      changefreq: "monthly",
      priority: "0.6",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(SITE_URL + u.loc)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}