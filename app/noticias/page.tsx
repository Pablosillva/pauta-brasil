import Link from "next/link";
import { Newspaper } from "lucide-react";
import { listarNoticias } from "@/lib/noticias";

export const metadata = {
  title: "Notícias",
  description:
    "Últimas notícias sobre política, eleições e o cenário brasileiro.",
};

export default function NoticiasPage() {
  const noticias = listarNoticias();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Newspaper size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Notícias
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Últimas notícias
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-2xl">
          Acompanhe o que acontece na política brasileira em tempo real.
        </p>
      </header>

      {noticias.length === 0 ? (
        <div className="text-center py-16 bg-cinza-claro dark:bg-azul-light/10 rounded-2xl">
          <p className="text-cinza-escuro dark:text-cinza-medio">
            Nenhuma notícia publicada ainda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((n, i) => (
            <Link
              key={n.slug}
              href={`/noticias/${n.slug}`}
              className="group bg-white dark:bg-azul-light/20 rounded-2xl overflow-hidden border border-cinza-medio dark:border-azul-light hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{
                animationDelay: `${i * 60}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div className="h-44 bg-gradient-to-br from-verde/20 to-azul/20 overflow-hidden">
                {n.imagemCapa && (
                  <img
                    src={n.imagemCapa}
                    alt={n.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-5 space-y-3">
                <span className="text-xs font-semibold text-verde uppercase tracking-wider">
                  {n.categoria}
                </span>
                <h3 className="font-bold text-azul dark:text-white leading-snug line-clamp-3 group-hover:text-verde transition-colors">
                  {n.titulo}
                </h3>
                <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                  {n.autor} ·{" "}
                  {new Date(n.data).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}