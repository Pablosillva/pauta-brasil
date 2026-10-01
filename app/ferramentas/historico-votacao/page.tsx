import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, AlertTriangle } from "lucide-react";
import { listarVotacoes } from "@/lib/camara";
import { FiltrosPautas } from "@/components/pautas/FiltrosPautas";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Historico de votacao",
  description:
    "Como cada deputado votou nas principais pautas do Congresso Nacional. Votacoes nominais oficiais da Camara dos Deputados.",
  alternates: { canonical: "/ferramentas/historico-votacao" },
};

export const revalidate = 3600;

export default async function HistoricoVotacaoPage() {
  const votacoes = await listarVotacoes(60);

  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Ferramentas", url: "/ferramentas" },
    { name: "Histórico de votação", url: "/ferramentas/historico-votacao" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <FileText size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Ferramentas
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Historico de votacao
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-3xl">
          Vote em uma pauta para ver o placar e como cada deputado federal
          votou. Todos os dados vem do registro nominal oficial da Camara.
        </p>
      </header>

      {votacoes.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light">
          <p className="text-lg font-semibold text-azul dark:text-white mb-2">
            Nao foi possivel carregar as votacoes
          </p>
          <p className="text-cinza-escuro dark:text-cinza-medio">
            A API da Camara pode estar temporariamente indisponivel.
          </p>
        </div>
      ) : (
        <FiltrosPautas votacoes={votacoes} />
      )}

      <div className="mt-10 pt-8 border-t border-cinza-medio dark:border-azul-light space-y-4">
        <p className="flex items-start gap-2 text-sm text-cinza-escuro dark:text-cinza-medio">
          <AlertTriangle size={16} className="shrink-0 mt-0.5 text-verde" />
          <span>
            As votacoes em bloco, feitas porleaders de partido, nao registram o
            voto de cada deputado. Nestes casos mostramos apenas o resultado.
          </span>
        </p>

        <Link
          href="/ferramentas"
          className="inline-flex items-center gap-2 text-verde font-semibold hover:underline"
        >
          <ArrowLeft size={16} /> Voltar para as ferramentas
        </Link>
      </div>
    </div>
  );
}
