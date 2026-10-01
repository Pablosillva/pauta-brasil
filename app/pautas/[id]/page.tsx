import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gavel, ArrowLeft, ExternalLink, Users } from "lucide-react";
import { buscarVotacao, votosDaVotacao, extrairIdentificacao } from "@/lib/camara";
import { BadgeResultado } from "@/components/pautas/BadgeVotacao";
import { ListaVotos } from "@/components/pautas/ListaVotos";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const votacao = await buscarVotacao(decodeURIComponent(id));

  if (!votacao) return { title: "Pauta nao encontrada" };

  const titulo = extrairIdentificacao(votacao.descricao) ?? "Votacao nao nominal";

  return {
    title: `${titulo} — como votaram`,
    description: votacao.descricao.slice(0, 160),
    alternates: { canonical: `/pautas/${id}` },
  };
}

export default async function PautaPage({ params }: PageProps) {
  const { id } = await params;
  const votacaoId = decodeURIComponent(id);

  const votacao = await buscarVotacao(votacaoId);
  if (!votacao) notFound();

  const votos = await votosDaVotacao(votacaoId);

  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Pautas", url: "/pautas" },
    { name: extrairIdentificacao(votacao.descricao) ?? votacaoId, url: `/pautas/${id}` },
  ]);

  const identificacao = extrairIdentificacao(votacao.descricao);
  const dataFormatada = new Date(`${votacao.data}T12:00:00`).toLocaleDateString(
    "pt-BR",
    { day: "2-digit", month: "long", year: "numeric" }
  );

  // Contagem por tipo, usada no resumo.
  const contagem = votos.reduce<Record<string, number>>((mapa, v) => {
    mapa[v.tipoVoto] = (mapa[v.tipoVoto] ?? 0) + 1;
    return mapa;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <Link
        href="/pautas"
        className="inline-flex items-center gap-2 text-sm text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Todas as pautas
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="inline-flex items-center gap-2 text-verde">
            <Gavel size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {votacao.siglaOrgao}
            </span>
          </div>
          {identificacao && (
            <span className="px-2 py-0.5 rounded bg-azul/10 dark:bg-azul-light/30 text-azul dark:text-white text-xs font-bold">
              {identificacao}
            </span>
          )}
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-azul dark:text-white mb-4 leading-tight">
          {votacao.descricao}
        </h1>

        <div className="flex items-center gap-4 flex-wrap text-sm text-cinza-escuro dark:text-cinza-medio">
          <time dateTime={votacao.data}>{dataFormatada}</time>
          <BadgeResultado aprovacao={votacao.aprovacao} />
        </div>
      </header>

      {votacao.apresentacaoProposicao && (
        <section className="mb-8 p-5 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-cinza-medio dark:border-azul-light">
          <h2 className="text-sm font-bold text-azul dark:text-white mb-2">
            Apresentacao
          </h2>
          <p className="text-sm text-cinza-escuro dark:text-cinza-medio whitespace-pre-line leading-relaxed">
            {votacao.apresentacaoProposicao}
          </p>
        </section>
      )}

      {/* Placar */}
      {votos.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-xl font-bold text-azul dark:text-white mb-4">
            <Users size={20} className="text-verde" />
            Placar ({votos.length} votos registrados)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(contagem).map(([tipo, total]) => (
              <div
                key={tipo}
                className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light text-center"
              >
                <p className="text-3xl font-bold text-azul dark:text-white">
                  {total}
                </p>
                <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
                  {tipo}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Votos individuais */}
      {votos.length > 0 ? (
        <section>
          <h2 className="text-xl font-bold text-azul dark:text-white mb-5">
            Voto de cada deputado
          </h2>
          <ListaVotos votos={votos} />
        </section>
      ) : (
        <div className="p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light text-center text-cinza-escuro dark:text-cinza-medio">
          Esta votacao foi feita por bloco, sem registro nominal. Para ver o
          voto de cada deputado, consulte as pautas marcadas como nominais.
        </div>
      )}

      {/* Proposições afetadas */}
      {votacao.proposicoesAfectadas.length > 0 && (
        <section className="mt-12 pt-8 border-t border-cinza-medio dark:border-azul-light">
          <h2 className="text-xl font-bold text-azul dark:text-white mb-4">
            Proposicoes afetadas
          </h2>
          <ul className="space-y-3">
            {votacao.proposicoesAfectadas.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/proposicoes/${p.id}`}
                  className="block p-4 rounded-xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
                >
                  <span className="text-xs font-bold text-verde">
                    {p.identificacao}
                  </span>
                  <p className="text-sm text-azul dark:text-white mt-1">
                    {p.ementa ?? "Sem ementa disponivel."}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <a
          href={`https://www.camara.leg.br/votacoes/${votacaoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-verde font-semibold hover:underline"
        >
          Ver o registro oficial na Camara dos Deputados
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
