import Link from "next/link";
import { ArrowRight } from "lucide-react";

const noticias = [
  {
    titulo: "Congresso aprova nova lei de licitações para obras públicas",
    categoria: "Política",
    data: "14 de abril de 2026",
    autor: "Redação Pauta Brasil",
    destaque: true,
    cor: "bg-verde",
  },
  {
    titulo: "Governadores se reúnem em Brasília para discutir reforma tributária",
    categoria: "Economia",
    data: "13 de abril de 2026",
    autor: "Marina Silva",
    cor: "bg-azul",
  },
  {
    titulo: "STF decide sobre marco temporal de terras indígenas",
    categoria: "Justiça",
    data: "12 de abril de 2026",
    autor: "Ricardo Antunes",
    cor: "bg-verde-dark",
  },
  {
    titulo: "Pesquisa aponta aprovação recorde do Congresso Nacional",
    categoria: "Sociedade",
    data: "11 de abril de 2026",
    autor: "Redação Pauta Brasil",
    cor: "bg-azul-light",
  },
  {
    titulo: "Nova regra para candidaturas independentes entra em vigor",
    categoria: "Eleições",
    data: "10 de abril de 2026",
    autor: "Paula Mendes",
    cor: "bg-verde",
  },
];

export function NoticiasDestaque() {
  const principal = noticias.find((n) => n.destaque);
  const outras = noticias.filter((n) => !n.destaque);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-azul dark:text-white">
          Notícias em destaque
        </h2>
        <Link
          href="/noticias"
          className="flex items-center gap-1 text-sm font-semibold text-verde hover:text-verde-dark transition-colors"
        >
          Ver todas <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Notícia principal */}
        {principal && (
          <Link
            href="/noticias"
            className="group lg:row-span-2 bg-white dark:bg-azul-light/20 rounded-2xl overflow-hidden border border-cinza-medio dark:border-azul-light hover:shadow-xl transition-all flex flex-col"
          >
            <div className={`h-72 ${principal.cor} opacity-90 group-hover:opacity-100 transition-opacity`} />
            <div className="p-6 space-y-3 flex-1 flex flex-col">
              <span className="text-xs font-semibold text-verde uppercase tracking-wider">
                {principal.categoria}
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold text-azul dark:text-white group-hover:text-verde transition-colors leading-tight">
                {principal.titulo}
              </h3>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                {principal.autor} · {principal.data}
              </p>
            </div>
          </Link>
        )}

        {/* Outras notícias */}
        <div className="grid sm:grid-cols-2 gap-4">
          {outras.slice(0, 4).map((n, i) => (
            <Link
              key={i}
              href="/noticias"
              className="group bg-white dark:bg-azul-light/20 rounded-xl overflow-hidden border border-cinza-medio dark:border-azul-light hover:shadow-lg transition-all"
            >
              <div className={`h-32 ${n.cor} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="p-4 space-y-2">
                <span className="text-xs font-semibold text-verde uppercase tracking-wider">
                  {n.categoria}
                </span>
                <h3 className="font-semibold text-azul dark:text-white line-clamp-2 group-hover:text-verde transition-colors text-sm">
                  {n.titulo}
                </h3>
                <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                  {n.data}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}