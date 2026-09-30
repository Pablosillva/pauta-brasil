import { put } from "@vercel/blob";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { criarNoticia } from "@/lib/noticias";

async function salvar(formData: FormData) {
  "use server";

  const session = await getSession();
  if (!session) redirect("/batata/login");

  const titulo = (formData.get("titulo") as string)?.trim();
  const resumo = (formData.get("resumo") as string)?.trim();
  const categoria = formData.get("categoria") as string;
  const conteudo = (formData.get("conteudo") as string) ?? "";
  const tagsInput = (formData.get("tags") as string) ?? "";
  const destaque = formData.get("destaque") === "on";
  const imagemFile = formData.get("imagem") as File | null;

  if (!titulo || !resumo) redirect("/batata/noticias/nova?erro=campos");

  let imagemCapa: string | null = null;
  if (imagemFile && imagemFile.size > 0) {
    try {
      const blob = await put(
        `noticias/${Date.now()}-${imagemFile.name}`,
        imagemFile,
        { access: "public" }
      );
      imagemCapa = blob.url;
    } catch (err) {
      console.error("Erro ao fazer upload da imagem:", err);
    }
  }

  try {
    await criarNoticia({
      titulo,
      resumo,
      categoria,
      conteudo,
      imagemCapa,
      tags: tagsInput
        ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      destaque,
    });
  } catch (err) {
    console.error("Erro ao criar notícia:", err);
    redirect("/batata/noticias/nova?erro=db");
  }

  redirect("/batata");
}

const CATEGORIAS = [
  "Política",
  "Economia",
  "Justiça",
  "Eleições",
  "Sociedade",
  "Internacional",
];

const inputClass =
  "w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde";

export default async function NovaNoticiaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

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

      {erro && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {erro === "campos"
            ? "Preencha o título e o resumo."
            : "Não foi possível salvar a notícia no banco de dados. Verifique os logs."}
        </div>
      )}

      <form action={salvar} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
            Título
          </label>
          <input name="titulo" required placeholder="Ex: Congresso aprova nova lei..." className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
            Resumo (1-2 frases)
          </label>
          <input name="resumo" required placeholder="Resumo curto da notícia" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
            Categoria
          </label>
          <select name="categoria" required className={inputClass}>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
            Tags
          </label>
          <input name="tags" placeholder="Ex: Congresso, Licitações, Obras Públicas" className={inputClass} />
          <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
            Separe por vírgula.
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
            rows={20}
            placeholder={"## Introdução\n\nEscreva o conteúdo aqui...\n\n## Próximos passos\n\nContinue o texto..."}
            className={`${inputClass} font-mono text-sm`}
          />
          <div className="mt-2 p-3 rounded-lg bg-cinza-claro dark:bg-azul-light/20 text-xs text-cinza-escuro dark:text-cinza-medio">
            <p className="font-semibold mb-1">Formatação Markdown:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li><code>## Título</code> — seções</li>
              <li><code>**texto**</code> — negrito</li>
              <li><code>*texto*</code> — itálico</li>
              <li><code>- item</code> — listas</li>
              <li><code>&gt; citação</code> — citações</li>
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
