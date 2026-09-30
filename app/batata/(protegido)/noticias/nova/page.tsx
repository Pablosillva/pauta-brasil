import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { redirect } from "next/navigation";
import matter from "gray-matter";
import Link from "next/link";
import { ArrowLeft, Eye, Edit3 } from "lucide-react";
import { getSession } from "@/lib/auth";

const NOTICIAS_DIR = path.join(process.cwd(), "content/noticias");

function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 60);
}

async function criarNoticia(formData: FormData) {
  "use server";

  const session = await getSession();
  if (!session) redirect("/batata/login");

  const titulo = formData.get("titulo") as string;
  const resumo = formData.get("resumo") as string;
  const categoria = formData.get("categoria") as string;
  const conteudo = formData.get("conteudo") as string;
  const imagemFile = formData.get("imagem") as File | null;
  const tagsInput = formData.get("tags") as string;
  const slug = slugify(titulo);
  const destaque = formData.get("destaque") === "on";

  let imagemCapa = "";
  if (imagemFile && imagemFile.size > 0) {
    try {
      const blob = await put(
        `noticias/${slug}-${imagemFile.name}`,
        imagemFile,
        {
          access: "public",
        },
      );
      imagemCapa = blob.url;
    } catch (err) {
      console.error("Erro ao fazer upload:", err);
    }
  }

  const frontmatter = matter.stringify(conteudo, {
    titulo,
    resumo,
    data: new Date().toISOString().split("T")[0],
    autor: "Redação Pauta Brasil",
    categoria,
    imagemCapa,
    tags: tagsInput
      ? tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    destaque,
  });

  if (!existsSync(NOTICIAS_DIR)) {
    await mkdir(NOTICIAS_DIR, { recursive: true });
  }

  await writeFile(path.join(NOTICIAS_DIR, `${slug}.mdx`), frontmatter, "utf-8");

  redirect("/batata");
}

export default function NovaNoticiaPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/batata"
        className="inline-flex items-center gap-2 text-sm text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Voltar ao dashboard
      </Link>

      <h1 className="text-3xl font-bold text-azul dark:text-white mb-6">
        Criar Nova Notícia
      </h1>

      <form action={criarNoticia} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
            Título
          </label>
          <input
            name="titulo"
            required
            placeholder="Ex: Congresso aprova nova lei..."
            className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
            Resumo (1-2 frases)
          </label>
          <input
            name="resumo"
            required
            placeholder="Resumo curto da notícia"
            className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
            Categoria
          </label>
          <select
            name="categoria"
            required
            className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
          >
            <option value="Política">Política</option>
            <option value="Economia">Economia</option>
            <option value="Justiça">Justiça</option>
            <option value="Eleições">Eleições</option>
            <option value="Sociedade">Sociedade</option>
            <option value="Internacional">Internacional</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
            Tags
          </label>
          <input
            name="tags"
            placeholder="Ex: Congresso, Licitações, Obras Públicas"
            className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
          />
          <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
            Separe por vírgula. Ex: Eleições, Congresso, Economia
          </p>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="destaque"
              className="w-4 h-4 rounded border-cinza-medio dark:border-azul-light text-verde focus:ring-verde"
            />
            <span className="text-sm font-semibold text-azul dark:text-white">
              Marcar como destaque
            </span>
          </label>
          <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1 ml-7">
            Notícias em destaque aparecem em seções especiais do site
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
            Imagem de capa
          </label>
          <input
            type="file"
            name="imagem"
            accept="image/*"
            className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white"
          />
          <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
            Recomendado: 800x400px, JPG ou PNG
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
            Conteúdo (Markdown)
          </label>
          <textarea
            name="conteudo"
            required
            rows={20}
            placeholder="## Introdução&#10;&#10;Escreva o conteúdo aqui...&#10;&#10;## Próximos passos&#10;&#10;Continue o texto..."
            className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-verde"
          />
          <div className="mt-2 p-3 rounded-lg bg-cinza-claro dark:bg-azul-light/20 text-xs text-cinza-escuro dark:text-cinza-medio">
            <p className="font-semibold mb-1">Formatação Markdown:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li><code>## Título</code> para seções</li>
              <li><code>**texto**</code> para negrito</li>
              <li><code>*texto*</code> para itálico</li>
              <li><code>- item</code> para listas</li>
              <li><code>1. item</code> para listas numeradas</li>
              <li><code>&gt; citação</code> para citações</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
          >
            Publicar notícia
          </button>
          <Link
            href="/batata"
            className="px-6 py-3 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white hover:bg-cinza-claro dark:hover:bg-azul-light transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
