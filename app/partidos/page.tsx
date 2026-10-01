import type { Metadata } from "next";
import Link from "next/link";
import { Flag, ArrowRight, Users } from "lucide-react";
import { partidosComSlugs, estatisticas } from "@/data/estatisticas";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Partidos politicos",
  description:
    "Todos os partidos com candidatos registrados no TSE nas eleicoes de 2026, com a quantidade de candidatos por partido em cada estado.",
  alternates: { canonical: "/partidos" },
};

export default function PartidosPage() {
  const partidos = partidosComSlugs();
  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Partidos", url: "/partidos" },
  ]);

  const maior = partidos[0]?.quantidade ?? 1;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Flag size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Eleicoes 2026
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-4">
          Partidos politicos
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio leading-relaxed">
          {partidos.length} partidos com candidatos registrados no TSE em{" "}
          {estatisticas.ufs.length} unidades da federacao, somando{" "}
          {estatisticas.total.toLocaleString("pt-BR")} inscricoes. Clique em um
          partido para ver os candidatos e as pautas que lhe interessam.
        </p>
      </header>

      <ul className="space-y-3">
        {partidos.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/candidatos?partido=${encodeURIComponent(p.nome)}`}
              className="block p-5 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors group"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="text-2xl font-bold text-azul dark:text-white">
                    {p.nome}
                  </span>
                  <span className="text-sm text-cinza-escuro dark:text-cinza-medio">
                    {p.quantidade.toLocaleString("pt-BR")} candidato
                    {p.quantidade === 1 ? "" : "s"}
                  </span>
                </div>
                <ArrowRight
                  size={18}
                  className="text-cinza-medio group-hover:text-verde transition-colors flex-shrink-0"
                />
              </div>

              {/* Barra proporcional ao maior partido */}
              <div className="h-2 rounded-full bg-cinza-claro dark:bg-azul-light/20 overflow-hidden">
                <div
                  className="h-full bg-verde rounded-full transition-all"
                  style={{ width: `${Math.max(2, (p.quantidade / maior) * 100)}%` }}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-12 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <h2 className="flex items-center gap-2 text-lg font-bold text-azul dark:text-white mb-3">
          <Users size={18} className="text-verde" />
          Bancada na Camara
        </h2>
        <p className="text-cinza-escuro dark:text-cinza-medio mb-4">
          Para ver como cada partido se posiciona nas votacoes do Congresso,
          consulte a area de deputados ou o{" "}
          <Link href="/projetos" className="text-verde font-semibold hover:underline">
            historico de votacao
          </Link>
          .
        </p>
        <Link
          href="/candidatos"
          className="inline-flex items-center gap-2 text-verde font-semibold hover:underline"
        >
          Ver todos os candidatos
        </Link>
      </div>
    </div>
  );
}
