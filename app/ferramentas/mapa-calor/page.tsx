import Link from "next/link";
import { BarChart3, Users, Flag, Landmark } from "lucide-react";
import { todosOsDeputados } from "@/lib/camara";
import { nomesEstados } from "@/data/candidatos";
import governadoresJson from "@/data/governadores.json";

export const metadata = {
  title: "Peso eleitoral por estado",
  description:
    "Quantos deputados federais cada estado elege e quantos candidatos disputam o governo em 2026.",
};

export const revalidate = 86400;

interface CandidatoGovernador {
  partido: string;
}

const governadoresPorUf = governadoresJson as Record<
  string,
  CandidatoGovernador[]
>;

export default async function MapaCalorPage() {
  const deputados = await todosOsDeputados();

  const porUf = new Map<string, number>();
  for (const d of deputados) {
    porUf.set(d.siglaUf, (porUf.get(d.siglaUf) ?? 0) + 1);
  }

  const total = deputados.length;
  const linhas = [...porUf.entries()].sort((a, b) => b[1] - a[1]);

  const maior = linhas[0]?.[1] ?? 1;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <BarChart3 size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Ferramentas
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Peso eleitoral por estado
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-3xl">
          Cada estado tem um tamanho fixo na Câmara: é assim que os 513
          deputados se distribuem. Maine é o maior bloco, com{" "}
          {linhas[0]?.[1] ?? 0} deputados; a maior parte dos estados elege 8.
        </p>
      </header>

      {/* Resumo */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
          <p className="text-xs uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
            Deputados federais
          </p>
          <p className="text-3xl font-bold text-azul dark:text-white">{total}</p>
          <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
            em {linhas.length} unidades
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
          <p className="text-xs uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
            Maior delegação
          </p>
          <p className="text-3xl font-bold text-verde">{linhas[0]?.[1] ?? 0}</p>
          <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
            {linhas[0]?.[0] ?? "-"}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
          <p className="text-xs uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
            Candidatos a governador
          </p>
          <p className="text-3xl font-bold text-azul dark:text-white">
            {Object.values(governadoresPorUf).reduce(
              (soma, lista) => soma + lista.length,
              0
            )}
          </p>
          <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
            registrados para 2026
          </p>
        </div>
      </div>

      {/* Grafico por estado */}
      <section className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-azul dark:text-white mb-5">
          <Users size={18} className="text-verde" />
          Deputados por unidade
        </h2>

        <ul className="space-y-2.5">
          {linhas.map(([uf,qtt]) => {
            const percentual = Math.round((qtt / maior) * 100);
            const candidatos = governadoresPorUf[uf]?.length ?? 0;
            const partidos = new Set(
              (governadoresPorUf[uf] ?? []).map((c) => c.partido)
            ).size;

            return (
              <li key={uf}>
                <Link
                  href={`/candidatos?uf=br-${uf.toLowerCase()}`}
                  className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 group"
                >
                  <span className="font-bold text-azul dark:text-white group-hover:text-verde">
                    {uf}
                  </span>

                  <span className="flex items-center gap-3 min-w-0">
                    <span className="flex-1 h-6 bg-cinza-claro dark:bg-azul-dark/60 rounded overflow-hidden">
                      <span
                        className="block h-full bg-verde/80 group-hover:bg-verde transition-colors"
                        style={{ width: `${percentual}%` }}
                      />
                    </span>
                    <span className="text-sm text-cinza-escuro dark:text-cinza-medio w-24 truncate">
                      {nomesEstados[`br-${uf.toLowerCase()}`] ?? uf}
                    </span>
                  </span>

                  <span className="flex items-center gap-3 text-sm w-32 justify-end">
                    <span className="font-bold text-azul dark:text-white">
                      {qtt}
                    </span>
                    {candidatos > 0 && (
                      <span
                        className="text-xs text-cinza-escuro dark:text-cinza-medio"
                        title={`${candidatos} candidatos a governador, em ${partidos} partidos`}
                      >
                        <Flag size={12} className="inline mr-0.5" />
                        {candidatos}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Como ler */}
      <section className="mt-8 p-6 rounded-2xl border border-cinza-medio dark:border-azul-light">
        <h2 className="flex items-center gap-2 font-bold text-azul dark:text-white mb-3">
          <Landmark size={18} className="text-verde" />
          Como ler estes números
        </h2>
        <ul className="space-y-2 text-sm text-cinza-escuro dark:text-cinza-medio">
          <li>
            A distribuição de deputados é definida em lei e não muda entre
            eleições. Por isso a soma dá exatamente 513, e a barra mostra o
            tamanho relativo de cada estado.
          </li>
          <li>
            A bandeira com o número ao lado é a quantidade de candidatos a
            governador registrados pelo TSE para 2026, também real.
          </li>
          <li>
              Esta página mostrava antes uma &ldquo;aprovação dos governadores por
              estado&rdquo; com tendência de alta e queda. Não havia pesquisa por trás:
            eram valores escritos no código. Não existe fonte gratuita de
            pesquisa de opinião, então o dado de aprovação não é publicado.
          </li>
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/parlamentares"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-verde text-white font-semibold hover:bg-verde-dark transition-colors"
        >
          Ver parlamentares
        </Link>
        <Link
          href="/ferramentas"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white font-semibold hover:border-verde transition-colors"
        >
          ← Voltar para Ferramentas
        </Link>
      </div>
    </div>
  );
}
