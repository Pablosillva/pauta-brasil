import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Area administrativa, APIs e paginas de conta nao devem ser indexadas.
      disallow: [
        "/api/",
        "/batata",
        "/admin",
        "/minha-conta",
        "/login",
        "/cadastro",
        "/recuperar-senha",
        "/redefinir-senha",
        "/verificar-email",
        "/busca",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}