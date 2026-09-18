import Link from "next/link";
import { User } from "lucide-react";

const colunas = [
  {
    titulo: "O que esperar da reforma administrativa em 2026",
    autor: "Cláudio Abramo",
    cargo: "Analista político",
    iniciais: "CA",
    resumo:
      "A reforma promete mudar carreiras, salários e a estrutura do Estado. Analisamos os principais pontos de atrito no Congresso.",
  },
  {
    titulo: "A nova geografia do voto nas capitais brasileiras",
    autor: "Fernanda Torres",
    cargo: "Pesquisadora do IESP",
    iniciais: "FT",
    resumo:
      "Os padrões de votação nas grandes cidades mudaram nas últimas três eleições. Entenda o que isso significa para 2026.",
  },
  {
    titulo: "Por que o presidencialismo de coalizão está em xeque",
    autor: "Roberto Mangabeira",
    cargo: "Professor de Ciência Política",
    iniciais: "RM",
    resumo:
      "O modelo que governou o Brasil desde 1988 enfrenta sua maior crise. Uma análise histórica e prospectiva.",
  },
];

export function AnalisesColunas() {
  return (
    <section className="bg-cinza-claro dark:bg-azul-light/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-azul dark:text-white">
            Análises e colunas
          </h2>
          <Link
            href="/analises"
            className="text-sm font-semibold text-verde hover:text-verde-dark transition-colors"
          >
            Ver todas →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {colunas.map((c, i) => (
            <Link
              key={i}
              href="/analises"
              className="group bg-white dark:bg-azul-light/20 rounded-2xl p-6 border border-cinza-medio dark:border-azul-light hover:border-verde transition-all"
            >
              {/* Avatar do autor */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-verde flex items-center justify-center text-white font-bold">
                  {c.iniciais}
                </div>
                <div>
                  <p className="font-semibold text-azul dark:text-white text-sm">
                    {c.autor}
                  </p>
                  <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                    {c.cargo}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-azul dark:text-white mb-2 group-hover:text-verde transition-colors">
                {c.titulo}
              </h3>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio line-clamp-3">
                {c.resumo}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}