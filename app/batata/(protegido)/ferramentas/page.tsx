import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Map, BarChart3 } from "lucide-react";

export default async function FerramentasAdminPage() {
  const session = await getSession();
  if (!session) redirect("/batata/login");

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/batata"
        className="inline-flex items-center gap-2 text-sm text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Voltar ao dashboard
      </Link>

      <h1 className="text-3xl font-bold text-azul dark:text-white mb-6">
        Gerenciar Ferramentas
      </h1>
      <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-8">
        Edite os dados das ferramentas do site: ranking, mapa de calor e outras.
      </p>

      <div className="space-y-4">
        {/* Ranking */}
        <div className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-azul flex items-center justify-center text-white">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-azul dark:text-white">
                Ranking de Popularidade
              </h2>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                Aprovação de governadores, prefeitos e parlamentares
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
                Dados do Ranking (JSON)
              </label>
              <textarea
                rows={10}
                defaultValue={JSON.stringify(
                  [
                    { nome: "Romeu Zema", estado: "MG", partido: "Novo", aprovacao: 68, tendencia: "up" },
                    { nome: "Ratinho Junior", estado: "PR", partido: "PSD", aprovacao: 65, tendencia: "up" },
                    { nome: "Tarcísio de Freitas", estado: "SP", partido: "Republicanos", aprovacao: 62, tendencia: "down" },
                  ],
                  null,
                  2
                )}
                className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-verde"
              />
            </div>
            <button className="px-4 py-2 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors">
              Salvar Ranking
            </button>
          </div>
        </div>

        {/* Mapa de Calor */}
        <div className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-verde flex items-center justify-center text-white">
              <Map size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-azul dark:text-white">
                Mapa de Calor Eleitoral
              </h2>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                Aprovação dos governadores por estado
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
                Dados do Mapa de Calor (JSON)
              </label>
              <textarea
                rows={10}
                defaultValue={JSON.stringify(
                  [
                    { estado: "São Paulo", uf: "SP", aprovacao: 62, tendencia: "up" },
                    { estado: "Rio de Janeiro", uf: "RJ", aprovacao: 45, tendencia: "down" },
                    { estado: "Minas Gerais", uf: "MG", aprovacao: 68, tendencia: "up" },
                  ],
                  null,
                  2
                )}
                className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-verde"
              />
            </div>
            <button className="px-4 py-2 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors">
              Salvar Mapa de Calor
            </button>
          </div>
        </div>

        {/* Histórico de Votação */}
        <div className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-verde-dark flex items-center justify-center text-white">
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-azul dark:text-white">
                Histórico de Votação
              </h2>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                Como cada parlamentar votou nas principais pautas
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-azul dark:text-white mb-2">
                Dados do Histórico (JSON)
              </label>
              <textarea
                rows={10}
                defaultValue={JSON.stringify(
                  [
                    {
                      parlamentar: "Arthur Lira",
                      cargo: "Deputado Federal",
                      partido: "PP",
                      votacoes: [
                        { pauta: "Reforma Administrativa", voto: "Sim", data: "2026-08-15" },
                        { pauta: "Marco Temporal", voto: "Não", data: "2026-07-20" },
                      ],
                    },
                  ],
                  null,
                  2
                )}
                className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-verde"
              />
            </div>
            <button className="px-4 py-2 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors">
              Salvar Histórico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
