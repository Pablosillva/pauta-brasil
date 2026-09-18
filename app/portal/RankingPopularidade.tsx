import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const ranking = [
  { nome: "Romeu Zema", estado: "MG", partido: "Novo", aprovacao: 68, tendencia: "up" },
  { nome: "Ratinho Junior", estado: "PR", partido: "PSD", aprovacao: 65, tendencia: "up" },
  { nome: "Tarcísio de Freitas", estado: "SP", partido: "Republicanos", aprovacao: 62, tendencia: "stable" },
  { nome: "Eduardo Leite", estado: "RS", partido: "PSDB", aprovacao: 58, tendencia: "down" },
  { nome: "Cláudio Castro", estado: "RJ", partido: "PL", aprovacao: 45, tendencia: "down" },
  { nome: "Jerônimo Rodrigues", estado: "BA", partido: "PT", aprovacao: 55, tendencia: "up" },
];

export function RankingPopularidade() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-azul dark:text-white">
          Ranking de popularidade
        </h2>
        <Link
          href="/ferramentas/ranking"
          className="text-sm font-semibold text-verde hover:text-verde-dark transition-colors"
        >
          Ver ranking completo →
        </Link>
      </div>

      <div className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light overflow-hidden">
        {ranking.map((g, i) => (
          <div
            key={g.nome}
            className={cn(
              "flex items-center gap-4 px-5 py-4",
              i % 2 === 0
                ? "bg-white dark:bg-transparent"
                : "bg-cinza-claro dark:bg-azul-light/10"
            )}
          >
            <span className="w-8 text-center font-bold text-cinza-escuro dark:text-cinza-medio">
              {i + 1}º
            </span>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-azul dark:text-white truncate">
                {g.nome}
              </p>
              <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                {g.estado} · {g.partido}
              </p>
            </div>

            {/* Barra de aprovação */}
            <div className="hidden sm:block w-40 h-2 rounded-full bg-cinza-medio dark:bg-azul-light overflow-hidden">
              <div
                className="h-full bg-verde transition-all"
                style={{ width: `${g.aprovacao}%` }}
              />
            </div>

            <span className="font-bold text-verde w-12 text-right">
              {g.aprovacao}%
            </span>

            {/* Tendência */}
            <span className="w-5">
              {g.tendencia === "up" && (
                <TrendingUp size={16} className="text-verde" />
              )}
              {g.tendencia === "down" && (
                <TrendingDown size={16} className="text-red-500" />
              )}
              {g.tendencia === "stable" && (
                <Minus size={16} className="text-cinza-escuro" />
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}