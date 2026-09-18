import Link from "next/link";
import { Newspaper } from "lucide-react";
import { noticias } from "@/data/noticias";

export const metadata = {
  title: "Notícias — Pauta Brasil",
  description: "Últimas notícias sobre política, eleições e o cenário brasileiro.",
};

export default function NoticiasPage() {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {noticias.map((n, i) => (
          <Link
            key={n.id}
            href={`/noticias/${n.id}`}
            className="group bg-white dark:bg-azul-light/20 rounded-2xl overflow-hidden border border-cinza-medio dark:border-azul-light hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
          >
            <div className={`h-44 ${n.cor} opacity-85 group-hover:opacity-100 transition-opacity`} />
            <div className="p-5 space-y-3">
              <span className="text-xs font-semibold text-verde uppercase tracking-wider">
                {n.categoria}
              </span>
              <h3 className="font-bold text-azul dark:text-white leading-snug line-clamp-3 group-hover:text-verde transition-colors">
                {n.titulo}
              </h3>
              <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                {n.autor} · {n.data}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}