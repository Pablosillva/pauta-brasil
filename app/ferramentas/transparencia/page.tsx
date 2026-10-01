import Link from "next/link";
import { Wallet, TrendingUp, Info, ExternalLink } from "lucide-react";
import { formatarValor, anoDoDado, geradoEm, type GastosDeputado } from "@/lib/gastos";
import { todosOsDeputados, type Deputado } from "@/lib/camara";
import { nomesEstados } from "@/data/candidatos";
import { formatarNome } from "@/lib/nomes";
import indice from "@/data/gastos-camara.json";

export const metadata = {
  title: "Gastos de gabinete",
  description:
    "Cota e verba de gabinete dos deputados federais, por categoria, com a fonte da Câmara dos Deputados.",
};

export const revalidate = 86400;

/** O que esta tela usa do indice: sem as categorias, que ficam na ficha. */
interface ResumoGasto {
  partido: string;
  uf: string;
  total: number;
  qtd: number;
}

const gastos = indice.deputados as Record<string, ResumoGasto>;

export default async function TransparenciaPage() {
  /*
   * Ordena por valor gasto, cruzando com a lista de deputados em exercício
   * para trazer nome e partido atuais. O índice é chaveado por ID justamente
   * para isso: homônimos nunca se misturam.
   */
  const linhas = (await todosOsDeputados())
    .map((d) => ({ d, g: gastos[String(d.id)] }))
    .filter((x): x is { d: Deputado; g: ResumoGasto } => x.g !== undefined)
    .sort((a, b) => b.g.total - a.g.total)
    .slice(0, 20);

  const totalGeral = Object.values(gastos).reduce((s, g) => s + g.total, 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Wallet size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Transparência
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Gastos de gabinete
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-3xl">
          Cota e verba de gabinete de {Object.keys(gastos).length} deputados
          federais, {formatarValor(totalGeral)} no exercício de{" "}
          {anoDoDado()}.
        </p>
      </header>

      {/* Resumo */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
          <p className="text-xs uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
            Total registrado
          </p>
          <p className="text-2xl font-bold text-verde">
            {formatarValor(totalGeral)}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
          <p className="text-xs uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
            Despesas
          </p>
          <p className="text-2xl font-bold text-azul dark:text-white">
            {indice.totalRegistros.toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
          <p className="text-xs uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
           Maior gasto
          </p>
          <p className="text-sm font-semibold text-azul dark:text-white truncate">
            {linhas[0] ? formatarNome(linhas[0].d.nome) : "—"}
          </p>
          {linhas[0] && (
            <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
              {formatarValor(linhas[0].g.total)}
            </p>
          )}
        </div>
      </div>

      {/* Ranking */}
      <section className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-6 mb-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-azul dark:text-white mb-5">
          <TrendingUp size={18} className="text-verde" />
          Maiores gastos registrados
        </h2>

        <ul className="space-y-2.5">
          {linhas.map(({ d, g }, i) => (
            <li key={d.id}>
              <Link
                href={`/deputados/${d.id}`}
                className="grid sm:grid-cols-[1fr_auto] items-center gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 shrink-0 text-sm font-bold text-cinza-medio">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-azul dark:text-white group-hover:text-verde truncate">
                      {formatarNome(d.nome)}
                    </span>
                    <span className="block text-xs text-cinza-escuro dark:text-cinza-medio truncate">
                      {d.siglaPartido} ·{" "}
                      {nomesEstados[`br-${d.siglaUf.toLowerCase()}`] ??
                        d.siglaUf}{" "}
                      · {g.qtd} despesas
                    </span>
                  </span>
                </div>

                <span className="font-bold text-verde whitespace-nowrap">
                  {formatarValor(g.total)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* O que este dado e o que nao e */}
      <section className="p-5 rounded-2xl border border-cinza-medio dark:border-azul-light mb-8">
        <h2 className="flex items-center gap-2 font-bold text-azul dark:text-white mb-3">
          <Info size={18} className="text-verde" />
          O que estes números são
        </h2>
        <ul className="space-y-2 text-sm text-cinza-escuro dark:text-cinza-medio">
          <li>
            É o que o deputado registrou como gasto de{" "}
            <strong>cota parliamentary</strong> e{" "}
            <strong>verba de gabinete</strong>, publicado pela Câmara. Cada
            valor vem com número do documento e código do fornecedor.
          </li>
          <li>
            Vale comparar o contexto: mandato de gabinete maior costuma vir
            com cota maior. O valor mais alto da lista n
ã
o significa que o
            deputado gastou mais que todos os outros, e sim que a cota e a verba
            dele foram maiores no per
í
odo.
          </li>
          <li>
            Dados de Exercise anterior não entram aqui. O arquivo é do exercício
            de {anoDoDado()}, gerado em {geradoEm()}, e é atualizado por script
            e não em tempo real.
          </li>
          <li>
            Gastos de senador não estão aqui porque o Senado não publica dado
            equivalente em formato aberto. A ficha do senador diz isso na aba
            em vez de mostrar zero.
          </li>
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="https://www.camara.leg.br/transparencia/gastos-parlamentares/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-verde text-white font-semibold hover:bg-verde-dark transition-colors"
        >
          <ExternalLink size={16} />
          Portal de transparência da Câmara
        </a>
        <Link
          href="/parlamentares"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white font-semibold hover:border-verde transition-colors"
        >
          Ver parlamentares
        </Link>
      </div>
    </div>
  );
}
