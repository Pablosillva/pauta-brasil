import fs from "fs";
import path from "path";
import matter from "gray-matter";

const NOTICIAS_DIR = path.join(process.cwd(), "content/noticias");

export interface Noticia {
  slug: string;
  titulo: string;
  resumo: string;
  data: string;
  autor: string;
  categoria: string;
  imagemCapa: string;
  tags: string[];
  destaque: boolean;
  conteudo: string;
}

export function listarNoticias(): Noticia[] {
  if (!fs.existsSync(NOTICIAS_DIR)) return [];

  const arquivos = fs
    .readdirSync(NOTICIAS_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const noticias = arquivos.map((arquivo) => {
    const slug = arquivo.replace(/\.mdx$/, "");
    const filePath = path.join(NOTICIAS_DIR, arquivo);
    const conteudo = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(conteudo);

    return {
      slug,
      titulo: data.titulo ?? "Sem título",
      resumo: data.resumo ?? "",
      data: data.data ?? new Date().toISOString(),
      autor: data.autor ?? "Pauta Brasil",
      categoria: data.categoria ?? "Geral",
      imagemCapa: data.imagemCapa ?? "",
      tags: data.tags ?? [],
      destaque: data.destaque ?? false,
      conteudo: content,
    };
  });

  // Ordena por data (mais recente primeiro)
  return noticias.sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );
}

export function buscarNoticia(slug: string): Noticia | null {
  const filePath = path.join(NOTICIAS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const conteudo = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(conteudo);

  return {
    slug,
    titulo: data.titulo ?? "Sem título",
    resumo: data.resumo ?? "",
    data: data.data ?? new Date().toISOString(),
    autor: data.autor ?? "Pauta Brasil",
    categoria: data.categoria ?? "Geral",
    imagemCapa: data.imagemCapa ?? "",
    tags: data.tags ?? [],
    destaque: data.destaque ?? false,
    conteudo: content,
  };
}