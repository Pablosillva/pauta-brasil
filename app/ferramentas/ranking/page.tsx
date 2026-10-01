import Link from "next/link";
import { Trophy, TrendingUp, Info, ExternalLink } from "lucide-react";
import registrosIndice from "@/data/patrimonio.json";
import { nomesEstados } from "@/data/candidatos";
import { formatarNome } from "@/lib/nomes";
import { formatarValor } from "@/lib/gastos";

export const metadata = {
  title: "Ranking — o que dá para medir com dado oficial",
  description:
    "Por que não publicamos ranking de aprovação e quais rankings com base em dado oficial estão disponíveis.",
};

export const revalidate = 86400;

interface Registro {
  id: string;
  nome: string;
  nomeUrna: string;
  partido: string;
  cargo: string;
  estadoId: string;
  total: number;
  bens: number;
}

const registros = registrosIndice as Registro[];

function nomeDaUnidade(estadoId: string): string {
  if (estadoId === "br") return "Brasil";
  return nomesEstados[estadoId] ?? estadoId.toUpperCase();
}

export default function RankingPage() {
  const topo = registros.slice(0, 15);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <TrendingUp size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Ferramentas
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Ranking
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-3xl">
         -ranking de aprovação exige dado de pesquisa de opinião. Esse dado não
          tem fonte gratuita e licenciada, então não publicamos um ranking de
          aprovação. Abaixo está o ranking que conseguimos construir com dado
          oficial verificável.
        </p>
      </header>

      {/* Por que nao publicamos o ranking de aprovacao */}
      <section className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 mb-8">
        <div className="flex items-start gap-3">
          <Info
            size={20}
            className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
          />
          <div>
            <h2 className="font-bold text-azul dark:text-white mb-2">
              Por que não há ranking de aprovação aqui
            </h2>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
              Esta página mostrava antes notas de aprovação de governadores,
              prefeitos e parlamentares, com a observação de que vinham de
              &ldquo;pesquisas de opinião pública realizadas por institutos
              credenciados, margem de erro de ±3 pontos&rdquo;. Não havia pesquisa {/* verificar-dados:-exempt */}
              nenhuma por trás: eram números escritos no código.
            </p>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed mt-2">
              Não há como consertar: as notas não eram
              aproximação. E uma projeção de pesquisa seria
              outro número inventado, com aparência de dado. Para publicar
              aprovação é preciso de contrato com o instituto que
              fez a pesquisa: só o número vem com margem de erro, amostra e data. {/* verificar-dados:-exempt */}
            </p>
          </div>
        </div>
      </section>

      {/* Ranking real */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={20} className="text-verde" />
          <h2 className="text-2xl font-bold text-azul dark:text-white">
            Maior patrimônio declarado
          </h2>
        </div>
        <p className="text-cinza-escuro dark:text-cinza-medio mb-6">
          Valor total que o candidato declarou ao TSE nas eleições de 2026.
          Sai dos{" "}
          {registros.length.toLocaleString("pt-BR")} candidatos com patrimônio
          informado. A lista completa, com filtro por unidade e cargo, está em{" "}
          <Link
            href="/ferramentas/patrimonio"
            className="text-verde font-semibold hover:underline"
          >
            Patrimônio declarado
          </Link>
          .
        </p>

        <div className="space-y-2">
          {topo.map((r, i) => (
            <Link
              key={r.id}
              href={`/candidatos/${r.id}`}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
            >
              <span
                className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-bold ${
                  i === 0
                    ? "bg-verde text-white"
                    : "bg-azul dark:bg-azul-dark text-white"
                }`}
              >
                {i + 1}
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-azul dark:text-white truncate">
                  {formatarNome(r.nomeUrna || r.nome)}
                </p>
                <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                  {r.partido} · {r.cargo} · {nomeDaUnidade(r.estadoId)} ·{" "}
                  {r.bens} {r.bens === 1 ? "bem" : "bens"}
                </p>
              </div>

              <span className="font-bold text-verde whitespace-nowrap">
                {formatarValor(r.total)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* outros rankings possíveis */}
      <section className="mt-10 p-6 rounded-2xl border border-cinza-medio dark:border-azul-light">
        <h2 className="font-bold text-azul dark:text-white mb-3">
          Rankings que ainda não possível publicar
        </h2>
        <ul className="space-y-3 text-sm text-cinza-escuro dark:text-cinza-medio">
          <li>
            <strong>Disciplina partidária</strong> — dá para medir o quanto um
            deputado acompanha a maioria do partido, usando os votos nominais
            da Câmara. A base é fina: das 100 votações mais recentes, só 3
            publicam votos individuais, e em uma delas o campo de voto vem nulo.
            Com 2 votações utilizáveis, qualquer número seria ruído.
          </li>
          <li>
            <strong>Produtividade legislativa</strong> — a Câmara permite
            listar proposições por autor. Ainda não medimos isso, e é medível.
          </li>
          <li>
            <strong>Gastos e emendas</strong> — depende da chave gratuita do
            Portal da Transparência. Assim que houver chave, os valores entram
            na ficha de cada parlamentar.
          </li>
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="https://www.tse.jus.br/eleicoes/eleicoes-2026/dados-abertos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white font-semibold hover:border-verde transition-colors"
        >
          <ExternalLink size={16} />
          Dados abertos do TSE
        </a>
        <Link
          href="/ferramentas"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-verde text-white font-semibold hover:bg-verde-dark transition-colors"
        >
          Voltar para Ferramentas
        </Link>
      </div>
    </div>
  );
}
