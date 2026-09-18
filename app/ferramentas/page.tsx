import Link from "next/link";
import { GitCompare, TrendingUp, FileText, BarChart3, Search, Shield } from "lucide-react";

export const metadata = {
  title: "Ferramentas — Pauta Brasil",
  description: "Ferramentas de análise política: comparador, ranking, histórico de votação e mais.",
};

const ferramentas = [
  {
    titulo: "Comparador de propostas",
    descricao: "Compare lado a lado até 4 candidatos por tema.",
    href: "/comparador",
    icon: GitCompare,
    cor: "bg-verde",
  },
  {
    titulo: "Ranking de popularidade",
    descricao: "Aprovação de governadores, prefeitos e parlamentares.",
    href: "/ferramentas/ranking",
    icon: TrendingUp,
    cor: "bg-azul",
  },
  {
    titulo: "Histórico de votação",
    descricao: "Como cada parlamentar votou nas principais pautas.",
    href: "/ferramentas/historico",
    icon: FileText,
    cor: "bg-verde-dark",
  },
  {
    titulo: "Mapa Eleitoral",
    descricao: "Explore candidatos por estado e cargo.",
    href: "/mapa",
    icon: BarChart3,
    cor: "bg-azul-light",
  },
  {
    titulo: "Análise de patrimônio",
    descricao: "Veja a evolução patrimonial dos candidatos.",
    href: "/ferramentas/patrimonio",
    icon: Search,
    cor: "bg-verde",
  },
  {
    titulo: "Transparência",
    descricao: "Dados abertos de gastos públicos e emendas.",
    href: "/ferramentas/transparencia",
    icon: Shield,
    cor: "bg-azul",
  },
];

export default function FerramentasPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Ferramentas
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-2xl">
          Ferramentas permanentes de análise política. Gratuitas e disponíveis
          durante todo o ano, com ou sem eleição.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ferramentas.map((f) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.titulo}
              href={f.href}
              className="group bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-6 hover:border-verde hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${f.cor} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-lg text-azul dark:text-white mb-2 group-hover:text-verde transition-colors">
                {f.titulo}
              </h3>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                {f.descricao}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}