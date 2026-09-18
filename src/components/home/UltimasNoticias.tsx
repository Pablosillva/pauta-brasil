import Link from "next/link";
import { ArrowRight } from "lucide-react";

const noticias = [
  {
    titulo: "Congresso discute novas regras para financiamento de campanhas",
    categoria: "Política",
    data: "12 de abril de 2026",
    cor: "bg-verde",
  },
  {
    titulo: "Pesquisa aponta empate técnico entre principais candidatos",
    categoria: "Eleições",
    data: "11 de abril de 2026",
    cor: "bg-azul",
  },
  {
    titulo: "TSE lança sistema de fiscalização de fake news nas eleições",
    categoria: "Justiça",
    data: "10 de abril de 2026",
    cor: "bg-verde-dark",
  },
  {
    titulo: "Cresce interesse dos jovens na política, aponta pesquisa",
    categoria: "Sociedade",
    data: "09 de abril de 2026",
    cor: "bg-azul-light",
  },
];

export function UltimasNoticias() {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {noticias.map((n, i) => (
          <Link
            key={i}
            href={`/noticias/${i}`}
            className="group bg-white dark:bg-azul-light rounded-xl overflow-hidden border border-cinza-medio dark:border-azul hover:shadow-lg transition-all"
          >
            {/* Imagem placeholder */}
            <div
              className={`h-40 ${n.cor} opacity-80 group-hover:opacity-100 transition-opacity`}
            />
            <div className="p-4 space-y-2">
              <span className="text-xs font-semibold text-verde uppercase tracking-wider">
                {n.categoria}
              </span>
              <h3 className="font-semibold text-azul dark:text-white line-clamp-3 group-hover:text-verde transition-colors">
                {n.titulo}
              </h3>
              <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                {n.data}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}