import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { listarNoticias } from "@/lib/noticias";

function formatarData(data: Date) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function UltimasNoticias() {
  const noticias = await listarNoticias();
  const recentes = noticias.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-azul dark:text-white">
          Últimas Notícias
        </h2>
        <Link
          href="/noticias"
          className="flex items-center gap-1 text-sm font-semibold text-verde hover:text-verde-dark transition-colors"
        >
          Ver todas <ArrowRight size={16} />
        </Link>
      </div>

      {recentes.length === 0 ? (
        <div className="text-center py-16 bg-cinza-claro dark:bg-azul-light/10 rounded-2xl">
          <Newspaper size={40} className="mx-auto text-cinza-escuro mb-3" />
          <p className="text-cinza-escuro dark:text-cinza-medio">
            Nenhuma notícia publicada ainda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentes.map((n, i) => (
            <Link
              key={n.slug}
              href={`/noticias/${n.slug}`}
              className="group bg-white dark:bg-azul-light rounded-xl overflow-hidden border border-cinza-medio dark:border-azul hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{
                animationDelay: `${i * 80}ms`,
                animationFillMode: "backwards",
              }}
            >
              {n.imagemCapa ? (
                <img
                  src={n.imagemCapa}
                  alt={n.titulo}
                  className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="h-40 bg-gradient-to-br from-verde/20 to-azul/20" />
              )}
              <div className="p-4 space-y-2">
                <span className="text-xs font-semibold text-verde uppercase tracking-wider">
                  {n.categoria}
                </span>
                <h3 className="font-semibold text-azul dark:text-white line-clamp-3 group-hover:text-verde transition-colors">
                  {n.titulo}
                </h3>
                <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                  {n.autor} · {formatarData(n.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
