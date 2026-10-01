import { db } from "@/db";
import { noticias } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export type { Noticia } from "@/db/schema";

export async function listarNoticias() {
  return await db.select().from(noticias).orderBy(desc(noticias.createdAt));
}

export async function buscarNoticia(slug: string) {
  const resultado = await db
    .select()
    .from(noticias)
    .where(eq(noticias.slug, slug))
    .limit(1);
  return resultado[0] || null;
}

export interface DadosNoticia {
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  autor?: string;
  imagemCapa?: string | null;
  tags?: string[];
  destaque?: boolean;
  publicado?: boolean;
}

export function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 60);
}

/** Garante um slug único, acrescentando -2, -3... se necessário. */
export async function gerarSlugUnico(titulo: string): Promise<string> {
  const base = slugify(titulo) || "noticia";
  let slug = base;
  let n = 2;

  while (await buscarNoticia(slug)) {
    slug = `${base}-${n}`;
    n++;
  }

  return slug;
}

export async function criarNoticia(dados: DadosNoticia) {
  const slug = await gerarSlugUnico(dados.titulo);

  const [criada] = await db
    .insert(noticias)
    .values({
      id: slug,
      slug,
      titulo: dados.titulo,
      resumo: dados.resumo,
      conteudo: dados.conteudo,
      autor: dados.autor || "Redação Centro Político",
      categoria: dados.categoria,
      imagemCapa: dados.imagemCapa || null,
      tags: dados.tags ?? [],
      destaque: dados.destaque ?? false,
      publicado: dados.publicado ?? true,
    })
    .returning();

  return criada;
}

export async function atualizarNoticia(slug: string, dados: DadosNoticia) {
  const [atualizada] = await db
    .update(noticias)
    .set({
      titulo: dados.titulo,
      resumo: dados.resumo,
      conteudo: dados.conteudo,
      categoria: dados.categoria,
      imagemCapa: dados.imagemCapa ?? null,
      tags: dados.tags ?? [],
      destaque: dados.destaque ?? false,
      publicado: dados.publicado ?? true,
      updatedAt: new Date(),
    })
    .where(eq(noticias.slug, slug))
    .returning();

  return atualizada ?? null;
}

export async function deletarNoticia(slug: string) {
  const removidas = await db
    .delete(noticias)
    .where(eq(noticias.slug, slug))
    .returning();

  return removidas.length > 0;
}
