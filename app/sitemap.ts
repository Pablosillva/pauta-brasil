import type { MetadataRoute } from "next";
import { readFile, readdir } from "fs/promises";
import path from "path";
import { listarNoticias } from "@/lib/noticias";
import { listarVotacoes, listarProposicoes } from "@/lib/camara";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pauta-brasil.vercel.app";

/** O sitemap muda devagar: nao ha por que recalcular a cada requisicao. */
export const revalidate = 86400;

const DIR = path.join(process.cwd(), "src/data/tse");

/** Arquivos comecados com "_" sao indices internos, nao candidatos. */
function ehArquivoDeCandidatos(nome: string): boolean {
  return nome.endsWith(".json") && !nome.startsWith("_");
}

async function carregarIdsCandidatos(): Promise<string[]> {
  const arquivos = (await readdir(DIR)).filter(ehArquivoDeCandidatos);
  const ids: string[] = [];

  for (const arquivo of arquivos) {
    try {
      const lista = JSON.parse(
        await readFile(path.join(DIR, arquivo), "utf-8")
      ) as { id: string }[];

      for (const c of lista) ids.push(c.id);
    } catch {
      // arquivo invalido: segue sem ele
    }
  }

  return ids;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [idsCandidatos, noticias, votacoes, proposicoes] = await Promise.all([
    carregarIdsCandidatos(),
    listarNoticias().catch(() => []),
    listarVotacoes(200).catch(() => []),
    listarProposicoes({ itens: 100, siglaTipo: "PL" }).catch(() => []),
  ]);

  const agora = new Date();

  /** Paginas institucionais e ferramentas. */
  const paginas: { rota: string; prioridade: number }[] = [
    { rota: "", prioridade: 1 },
    { rota: "/portal", prioridade: 0.9 },
    { rota: "/mapa", prioridade: 0.9 },
    { rota: "/candidatos", prioridade: 0.9 },
    { rota: "/partidos", prioridade: 0.8 },
    { rota: "/planos", prioridade: 0.7 },
    { rota: "/projetos", prioridade: 0.9 },
    { rota: "/deputados", prioridade: 0.8 },
    { rota: "/noticias", prioridade: 0.9 },
    { rota: "/ferramentas", prioridade: 0.8 },
    { rota: "/comparador", prioridade: 0.8 },
    { rota: "/premium", prioridade: 0.6 },
    { rota: "/cadastro", prioridade: 0.5 },
    { rota: "/login", prioridade: 0.4 },
    { rota: "/recursos", prioridade: 0.7 },
    { rota: "/fontes", prioridade: 0.6 },
    { rota: "/metodologia", prioridade: 0.6 },
    { rota: "/analises", prioridade: 0.6 },
    { rota: "/sobre", prioridade: 0.5 },
    { rota: "/contato", prioridade: 0.4 },
    { rota: "/termos", prioridade: 0.3 },
    { rota: "/privacidade", prioridade: 0.3 },
    { rota: "/ferramentas/ranking", prioridade: 0.7 },
    { rota: "/ferramentas/historico-votacao", prioridade: 0.7 },
    { rota: "/ferramentas/colinha", prioridade: 0.6 },
    { rota: "/ferramentas/mapa-calor", prioridade: 0.6 },
    { rota: "/ferramentas/transparencia", prioridade: 0.5 },
    { rota: "/ferramentas/patrimonio", prioridade: 0.5 },
  ];

  const estaticas: MetadataRoute.Sitemap = paginas.map(({ rota, prioridade }) => ({
    url: `${siteUrl}${rota}`,
    lastModified: agora,
    changeFrequency: "daily",
    priority: prioridade,
  }));

  const candidatos: MetadataRoute.Sitemap = idsCandidatos.map((id) => ({
    url: `${siteUrl}/candidatos/${id}`,
    lastModified: agora,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const pautas: MetadataRoute.Sitemap = votacoes.map((v) => ({
    url: `${siteUrl}/projetos/${v.id}`,
    lastModified: agora,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const proposicoesSitemap: MetadataRoute.Sitemap = proposicoes.map((p) => ({
    url: `${siteUrl}/proposicoes/${p.id}`,
    lastModified: agora,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const noticiasSitemap: MetadataRoute.Sitemap = noticias.map((n) => ({
    url: `${siteUrl}/noticias/${n.slug}`,
    lastModified: n.updatedAt ?? n.createdAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...estaticas,
    ...pautas,
    ...candidatos,
    ...proposicoesSitemap,
    ...noticiasSitemap,
  ];
}
