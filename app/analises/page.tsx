import Link from "next/link";
import { BarChart3, Clock, User } from "lucide-react";

export const metadata = {
  title: "Análises",
  description: "Análises e colunas sobre o cenário político brasileiro.",
};

const analises = [
  {
    titulo: "O que esperar da reforma administrativa em 2026",
    autor: "Cláudio Abramo",
    cargo: "Analista político",
    data: "2026-09-15",
    resumo:
      "A reforma promete mudar carreiras, salários e a estrutura do Estado. Analisamos os principais pontos de atrito no Congresso.",
    tempoLeitura: "8 min",
  },
  {
    titulo: "A nova geografia do voto nas capitais brasileiras",
    autor: "Fernanda Torres",
    cargo: "Pesquisadora do IESP",
    data: "2026-09-10",
    resumo:
      "Os padrões de votação nas grandes cidades mudaram nas últimas três eleições. Entenda o que isso significa para 2026.",
    tempoLeitura: "12 min",
  },
  {
    titulo: "Por que o presidencialismo de coalizão está em xeque",
    autor: "Roberto Mangabeira",
    cargo: "Professor de Ciência Política",
    data: "2026-09-05",
    resumo:
      "O modelo que governou o Brasil desde 1988 enfrenta sua maior crise. Uma análise histórica e prospectiva.",
    tempoLeitura: "15 min",
  },
  {
    titulo: "O impacto da proibição das bets no futebol brasileiro",
    autor: "Carlos Alberto",
    cargo: "Economista esportivo",
    data: "2026-09-01",
    resumo:
      "Com a proibição das casas de apostas, os clubes brasileiros enfrentam um desafio financeiro sem precedentes.",
    tempoLeitura: "10 min",
  },
  {
    titulo: "A juventude e o engajamento político em 2026",
    autor: "Ana Paula Santos",
    cargo: "Pesquisadora de opinião pública",
    data: "2026-08-28",
    resumo:
      "Os jovens estão mais engajados politicamente do que nunca. O que isso significa para as eleições?",
    tempoLeitura: "7 min",
  },
  {
    titulo: "Reforma tributária: o que muda para os estados",
    autor: "Roberto Mangabeira",
    cargo: "Professor de Ciência Política",
    data: "2026-08-20",
    resumo:
      "A reforma tributária aprovada no Congresso redistribui recursos entre estados e municípios. Entenda os impactos.",
    tempoLeitura: "11 min",
  },
];

export default function AnalisesPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <BarChart3 size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Análises
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Análises e Colunas
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Análises aprofundadas sobre o cenário político brasileiro, escritas
          por especialistas e pesquisadores.
        </p>
      </header>

      {/* Lista de análises */}
      <div className="space-y-6">
        {analises.map((analise) => (
          <article
            key={analise.titulo}
            className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-6 hover:border-verde transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Avatar do autor */}
              <div className="w-12 h-12 rounded-full bg-verde flex items-center justify-center text-white font-bold shrink-0">
                {analise.autor
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-azul dark:text-white mb-2">
                  {analise.titulo}
                </h2>
                <p className="text-cinza-escuro dark:text-cinza-medio mb-4">
                  {analise.resumo}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-cinza-escuro dark:text-cinza-medio">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span className="font-medium">{analise.autor}</span>
                    <span>· {analise.cargo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>
                      {new Date(analise.data).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <span>· {analise.tempoLeitura} de leitura</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mt-12 p-8 rounded-2xl bg-verde/10 border border-verde/30 text-center">
        <h2 className="text-2xl font-bold text-azul dark:text-white mb-2">
          Receba análises exclusivas
        </h2>
        <p className="text-cinza-escuro dark:text-cinza-medio mb-6">
          Assine nossa newsletter e receba análises aprofundadas toda semana.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Seu e-mail"
            className="flex-1 px-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-verde text-white font-semibold hover:bg-verde-dark transition-colors"
          >
            Assinar
          </button>
        </form>
      </div>

      <div className="mt-8 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <Link href="/" className="text-verde font-semibold hover:underline">
          ← Voltar para a home
        </Link>
      </div>
    </div>
  );
}
