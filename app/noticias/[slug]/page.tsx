import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { listarNoticias, buscarNoticia } from "@/lib/noticias";
import { NoticiaConteudo } from "@/components/noticias/NoticiaConteudo";
import {
  TwitterIcon,
  FacebookIcon,
} from "@/components/icons/BrandIcons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const noticia = buscarNoticia(slug);
  if (!noticia) return { title: "Notícia não encontrada" };
  return {
    title: noticia.titulo,
    description: noticia.resumo,
    alternates: { canonical: `/noticias/${slug}` },
  };
}

export async function generateStaticParams() {
  return listarNoticias().map((n) => ({ slug: n.slug }));
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params;
  const noticia = buscarNoticia(slug);
  if (!noticia) return notFound();

  const relacionadas = listarNoticias()
    .filter((n) => n.slug !== slug && n.categoria === noticia.categoria)
    .slice(0, 3);

  const outras =
    relacionadas.length > 0
      ? relacionadas
      : listarNoticias().filter((n) => n.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: noticia.titulo,
    description: noticia.resumo,
    datePublished: noticia.data,
    author: { "@type": "Person", name: noticia.autor },
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/noticias"
        className="inline-flex items-center gap-2 text-sm font-medium text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Voltar para notícias
      </Link>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        <article>
          <header className="mb-8">
            <span className="text-xs font-semibold text-verde uppercase tracking-wider">
              {noticia.categoria}
            </span>
            <h1 className="text-3xl lg:text-5xl font-bold text-azul dark:text-white mt-3 mb-6 leading-tight">
              {noticia.titulo}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-cinza-escuro dark:text-cinza-medio pb-6 border-b border-cinza-medio dark:border-azul-light">
              <span className="flex items-center gap-2">
                <User size={14} /> {noticia.autor}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} />{" "}
                {new Date(noticia.data).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>

          {noticia.imagemCapa && (
            <div className="rounded-2xl overflow-hidden mb-8">
              <img
                src={noticia.imagemCapa}
                alt={noticia.titulo}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <p className="text-xl text-azul dark:text-white font-medium leading-relaxed mb-8">
            {noticia.resumo}
          </p>

          <NoticiaConteudo conteudo={noticia.conteudo} />

          {noticia.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Tag size={16} className="text-cinza-escuro" />
              {noticia.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-semibold text-verde bg-verde/10 px-3 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-cinza-medio dark:border-azul-light">
            <p className="text-sm font-semibold text-azul dark:text-white mb-3">
              Compartilhe esta notícia
            </p>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(noticia.titulo)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-azul text-white flex items-center justify-center hover:bg-verde transition-colors"
                aria-label="Compartilhar no Twitter"
              >
                <TwitterIcon size={18} />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://pauta-brasil.vercel.app/noticias/" + noticia.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-azul text-white flex items-center justify-center hover:bg-verde transition-colors"
                aria-label="Compartilhar no Facebook"
              >
                <FacebookIcon size={18} />
              </a>
            </div>
          </div>
        </article>

        <aside>
          <h2 className="font-bold text-azul dark:text-white mb-4">
            Leia também
          </h2>
          <div className="space-y-4">
            {outras.map((n) => (
              <Link
                key={n.slug}
                href={`/noticias/${n.slug}`}
                className="group block bg-white dark:bg-azul-light/20 rounded-xl border border-cinza-medio dark:border-azul-light p-4 hover:border-verde transition-all"
              >
                <span className="text-xs font-semibold text-verde uppercase tracking-wider">
                  {n.categoria}
                </span>
                <h3 className="font-semibold text-azul dark:text-white text-sm mt-1 leading-snug group-hover:text-verde transition-colors line-clamp-3">
                  {n.titulo}
                </h3>
                <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-2">
                  {new Date(n.data).toLocaleDateString("pt-BR")}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}