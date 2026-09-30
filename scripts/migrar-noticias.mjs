import "dotenv/config";
import { readFile, readdir } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { noticias } from "../src/db/schema.ts";

const db = drizzle(sql);
const DIR = path.join(process.cwd(), "content/noticias");

async function main() {
  const arquivos = (await readdir(DIR)).filter((f) => f.endsWith(".mdx"));
  console.log(`Encontrados ${arquivos.length} arquivos\n`);

  for (const arquivo of arquivos) {
    const slug = arquivo.replace(/\.mdx$/, "");
    const conteudo = await readFile(path.join(DIR, arquivo), "utf-8");
    const { data, content } = matter(conteudo);

    try {
      await db.insert(noticias).values({
        id: slug,
        slug,
        titulo: data.titulo,
        resumo: data.resumo,
        conteudo: content,
        autor: data.autor || "Redação Pauta Brasil",
        categoria: data.categoria || "Política",
        imagemCapa: data.imagemCapa || null,
        tags: data.tags || [],
        destaque: data.destaque || false,
        publicado: true,
        createdAt: new Date(data.data || Date.now()),
        updatedAt: new Date(),
      }).onConflictDoNothing();

      console.log(`✅ ${slug}`);
    } catch (err) {
      console.error(`❌ ${slug}:`, err.message);
    }
  }

  console.log("\n🎉 Migração concluída!");
  process.exit(0);
}

main();