import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";
import { getSession } from "@/lib/auth";
import { criarNoticia } from "@/lib/noticias";
import { EditorConteudo } from "@/components/ui/EditorConteudo";
import { CampoImagem } from "@/components/ui/CampoImagem";

/** Converte "2026-10-05T14:30" (input datetime-local) em Date. */
function lerData(valor: string): Date | null {
  if (!valor) return null;
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

async function salvar(formData: FormData) {
  "use server";

  const session = await getSession();
  if (!session) redirect("/batata/login");

  const titulo = (formData.get("titulo") as string)?.trim();
  const resumo = (formData.get("resumo") as string)?.trim();
  const categoria = formData.get("categoria") as string;
  const conteudo = (formData.get("conteudo") as string) ?? "";
  const tagsInput = (formData.get("tags") as string) ?? "";
  const imagemCapa = (formData.get("imagemCapa") as string) || null;
  const destaque = formData.get("destaque") === "on";
  const dataPublicacao = lerData(
    (formData.get("dataPublicacao") as string) ?? ""
  );

  if (!titulo || !resumo) redirect("/batata/noticias/nova?erro=campos");

  try {
    await criarNoticia({
      titulo,
      resumo,
      categoria,
      conteudo,
      imagemCapa,
      dataPublicacao,
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

        <CampoImagem name="imagemCapa" />

        <div>
          <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock size={15} />
              Data de publicação
            </span>
          </label>
          <input
            type="datetime-local"
            name="dataPublicacao"
            defaultValue={new Date().toISOString().slice(0, 16)}
            className={inputClass}
          />
          <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
            Ajuste para retroagir a noticia ou para agendar a publicação.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
            Conteúdo
          </label>
          <EditorConteudo
            name="conteudo"
            rows={20}
            placeholder={"## Introdução\n\nEscreva o conteúdo aqui...\n\n## Próximos passos\n\nContinue o texto..."}
          />
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
