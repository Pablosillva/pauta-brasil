import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Scale,
  ArrowLeft,
  ExternalLink,
  User,
  CircleDot,
  Clock,
} from "lucide-react";
import {
  buscarProposicao,
  tramitacaoDaProposicao,
  dataDaCamara,
} from "@/lib/camara";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const proposicao = await buscarProposicao(Number(id));

  if (!proposicao) return { title: "Projeto nao encontrado" };

  return {
    title: `${proposicao.identificacao} — tramitacao`,
    description:
      (proposicao.ementa ?? "Projeto de lei").slice(0, 160) +
      " Acompanhe todas as etapas de tramitacao no Congresso.",
    alternates: { canonical: `/proposicoes/${id}` },
  };
}

export default async function ProposicaoPage({ params }: PageProps) {
  const { id } = await params;
  const proposicaoId = Number(id);

  if (!Number.isFinite(proposicaoId)) notFound();

  const proposicao = await buscarProposicao(proposicaoId);
  if (!proposicao) notFound();

  const tramitacoes = await tramitacaoDaProposicao(proposicaoId);

  // Mais recente primeiro: e o que o leitor procura ao abrir a pagina.
  const ordenadas = [...tramitacoes].sort((a, b) => {
    const da = dataDaCamara(a.dataHora)?.getTime() ?? 0;
    const db = dataDaCamara(b.dataHora)?.getTime() ?? 0;
    return db - da;
  });

  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Pautas", url: "/pautas" },
    { name: proposicao.identificacao, url: `/proposicoes/${id}` },
  ]);

  const apresentacao = dataDaCamara(proposicao.dataApresentacao);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <Link
        href="/pautas"
        className="inline-flex items-center gap-2 text-sm text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Pautas e projetos
      </Link>

      <header className="mb-8">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Scale size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Projeto de lei
          </span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-azul dark:text-white mb-4">
          <span className="text-verde">{proposicao.identificacao}</span>
        </h1>

        <p className="text-lg text-cinza-escuro dark:text-cinza-medio leading-relaxed">
          {proposicao.ementa ?? "Sem ementa disponivel."}
        </p>
      </header>

      {/* Ficha do projeto */}
      <dl className="grid sm:grid-cols-2 gap-4 mb-10">
        {proposicao.autores.length > 0 && (
          <div className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
              <User size={14} /> Autoria
            </dt>
            <dd className="text-azul dark:text-white">
              {proposicao.autores.join(", ")}
            </dd>
          </div>
        )}

        {apresentacao && (
          <div className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
              <Clock size={14} /> Apresentado em
            </dt>
            <dd className="text-azul dark:text-white">
              {apresentacao.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </dd>
          </div>
        )}

        {proposicao.situacao && (
          <div className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light sm:col-span-2">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
              <CircleDot size={14} /> Situacao atual
            </dt>
            <dd className="text-azul dark:text-white">{proposicao.situacao}</dd>
          </div>
        )}

        {proposicao.tema && (
          <div className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
              Tema (classificacao oficial da Camara)
            </dt>
            <dd className="text-azul dark:text-white">{proposicao.tema}</dd>
          </div>
        )}
      </dl>

      {/* Linha do tempo da tramitação */}
      <section>
        <h2 className="text-2xl font-bold text-azul dark:text-white mb-6">
          Tramitacao ({ordenadas.length} etapas)
        </h2>

        {ordenadas.length === 0 ? (
          <div className="p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light text-center text-cinza-escuro dark:text-cinza-medio">
            A Camara ainda nao publicou a tramitacao deste projeto.
          </div>
        ) : (
          <ol className="relative border-l-2 border-cinza-medio dark:border-azul-light ml-3 space-y-8">
            {ordenadas.map((etapa, i) => {
              const data = dataDaCamara(etapa.dataHora);
              const ehPrimeira = i === 0;

              return (
                <li key={`${etapa.dataHora}-${i}`} className="ml-8">
                  <span
                    className={`absolute -left-[9px] w-4 h-4 rounded-full border-2 ${
                      ehPrimeira
                        ? "bg-verde border-verde"
                        : "bg-white dark:bg-azul-dark border-cinza-medio dark:border-azul-light"
                    }`}
                  />

                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {data && (
                      <time
                        dateTime={data.toISOString()}
                        className="text-xs font-semibold text-verde"
                      >
                        {data.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </time>
                    )}
                    {etapa.nomeOrgao && (
                      <span className="text-xs px-2 py-0.5 rounded bg-cinza-claro dark:bg-azul-light/20 text-cinza-escuro dark:text-cinza-medio">
                        {etapa.nomeOrgao}
                      </span>
                    )}
                    {etapa.descricaoSituacao && (
                      <span className="text-xs px-2 py-0.5 rounded bg-verde/10 text-verde font-semibold">
                        {etapa.descricaoSituacao}
                      </span>
                    )}
                  </div>

                  <p className="text-azul dark:text-white leading-relaxed">
                    {etapa.texto ?? etapa.descricaoSituacao ?? "Etapa registrada."}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <div className="mt-12 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <a
          href={proposicao.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-verde font-semibold hover:underline"
        >
          Abrir no site da Camara dos Deputados
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
