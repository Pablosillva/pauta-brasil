import type { MetadataRoute } from "next";
import { readFile, readdir } from "fs/promises";
import path from "path";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pauta-brasil.vercel.app";

async function carregarTodosCandidatos() {
  const dir = path.join(process.cwd(), "src/data/tse");
  const arquivos = await readdir(dir);
  const todos: { id: string }[] = [];

  for (const arquivo of arquivos) {
    if (arquivo === "_indice.json" || !arquivo.endsWith(".json")) continue;
    try {
      const conteudo = await readFile(path.join(dir, arquivo), "utf-8");
      const lista = JSON.parse(conteudo);
      todos.push(...lista);
    } catch {
      // ignora arquivo inválido
    }
  }

  return todos;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const candidatos = await carregarTodosCandidatos();

  const paginasEstaticas = [
    "",
    "/mapa",
    "/candidatos",
    "/planos",
    "/noticias",
    "/ferramentas",
    "/comparador",
    "/sobre",
    "/portal",
    "/login",
    "/premium",
    "/termos",
    "/privacidade",
    "/contato",
    "/analises",
    "/ferramentas/ranking",
    "/ferramentas/historico",
    "/ferramentas/patrimonio",
    "/ferramentas/transparencia",
  ].map((rota) => ({
    url: `${siteUrl}${rota}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: rota === "" ? 1 : 0.8,
  }));

  const candidatosSitemap = candidatos.map((c) => ({
    url: `${siteUrl}/candidatos/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...paginasEstaticas, ...candidatosSitemap];
}
