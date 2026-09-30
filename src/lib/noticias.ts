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