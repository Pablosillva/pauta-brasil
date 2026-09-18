import Link from "next/link";
import { GitCompare, TrendingUp, FileText } from "lucide-react";

const ferramentas = [
  {
    titulo: "Comparador de propostas",
    descricao: "Compare lado a lado as propostas dos candidatos e veja as diferenças.",
    href: "/comparador",
    icon: GitCompare,
  },
  {
    titulo: "Ranking de popularidade",
    descricao: "Veja o desempenho e a aprovação de governadores, prefeitos e parlamentares.",
    href: "/ferramentas/ranking",
    icon: TrendingUp,
  },
  {
    titulo: "Histórico de votação",
    descricao: "Consulte o histórico eleitoral de candidatos e partidos.",
    href: "/ferramentas/historico",
    icon: FileText,
  },
];

export function Ferramentas() {
  return (
    <section className="bg-cinza-claro dark:bg-azul-light/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-azul dark:text-white">
            Ferramentas em destaque
          </h2>
          <Link
            href="/ferramentas"
            className="text-sm font-semibold text-verde hover:text-verde-dark transition-colors"
          >
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ferramentas.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.titulo}
                href={f.href}
                className="group bg-white dark:bg-azul dark:bg-azul-light rounded-xl p-6 border border-cinza-medio dark:border-azul-light hover:border-verde hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
              >
                <div className="w-12 h-12 rounded-lg bg-verde/10 flex items-center justify-center mb-4 group-hover:bg-verde group-hover:text-white transition-colors">
                  <Icon
                    size={22}
                    className="text-verde group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="font-bold text-lg text-azul dark:text-white mb-2">
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
    </section>
  );
}