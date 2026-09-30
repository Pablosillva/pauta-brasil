import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { buscarNoticia } from "@/lib/noticias";
import { EditarNoticiaForm } from "./EditarNoticiaForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditarNoticiaPage({ params }: PageProps) {
  const { slug } = await params;
  const noticia = await buscarNoticia(slug);
  if (!noticia) return notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors"
        >
          <ArrowLeft size={16} /> Voltar ao dashboard
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/noticias/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-verde hover:text-verde-dark transition-colors"
          >
            <ExternalLink size={14} /> Ver notícia
          </Link>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-azul dark:text-white mb-2">
        Editar Notícia
      </h1>
      <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-8">
        Slug: <code className="bg-cinza-claro dark:bg-azul-light px-2 py-0.5 rounded">{slug}</code>
      </p>

      <EditarNoticiaForm noticia={noticia} />
    </div>
  );
}