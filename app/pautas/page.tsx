import type { Metadata } from "next";
import Link from "next/link";
import { Gavel, Scale, ArrowRight } from "lucide-react";
import { listarVotacoes, listarProposicoes } from "@/lib/camara";
import { FiltrosPautas } from "@/components/pautas/FiltrosPautas";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pautas do Congresso",
  description:
    "Votações nominais do Congresso Nacional com o voto registrado de cada deputado. Dados oficiais da Câmara dos Deputados.",
  alternates: { canonical: "/pautas" },
};

// A API da Câmara é cacheada; a página pode ser gerada estaticamente.
export const revalidate = 3600;

export default async function PautasPage() {
  const [votacoes, proposicoes] = await Promise.all([
    listarVotacoes(60),
    listarProposicoes({ itens: 12, siglaTipo: "PL" }),
  ]);

  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Pautas", url: "/pautas" },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Gavel size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Congresso Nacional
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Pautas e votações
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-3xl">
          Cada votação nominal da Câmara, com o voto registrado de todos os
          deputados. Clique em uma pauta para ver o placar e quem votou como.
        </p>
      </header>

      <div className="mb-8 p-4 rounded-xl bg-cinza-claro dark:bg-azul-light/10 border border-cinza-medio dark:border-azul-light text-sm text-cinza-escuro dark:text-cinza-medio">
        Fonte:{" "}
        <a
          href="https://dadosabertos.camara.leg.br"
          target="_blank"
          rel="noopener noreferrer"
          className="text-verde font-semibold hover:underline"
        >
          API de Dados Abertos da Câmara dos Deputados
        </a>
        . Atualizado diariamente.
      </div>

      {votacoes.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light">
          <p className="text-lg font-semibold text-azul dark:text-white mb-2">
            Não foi possível carregar as pautas agora
          </p>
          <p className="text-cinza-escuro dark:text-cinza-medio">
            A API da Câmara pode estar temporariamente indisponível. Tente de
            novo em alguns minutos.
          </p>
        </div>
      ) : (
        <FiltrosPautas votacoes={votacoes} />
      )}

      {/* Projetos de lei em tramitação */}
      {proposicoes.length > 0 && (
        <section className="mt-16 pt-10 border-t border-cinza-medio dark:border-azul-light">
          <div className="flex items-center gap-2 text-verde mb-3">
            <Scale size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Projetos de lei
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-azul dark:text-white mb-3">
            Mais recentes em tramitação
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio mb-6 max-w-3xl">
            Projetos de lei recém-apresentados. Abra a página de um projeto para
            acompanhar todas as etapas pelas quais ele passou.
          </p>

          <ul className="space-y-3">
            {proposicoes.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/proposicoes/${p.id}`}
                  className="block p-5 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded bg-verde/10 text-verde text-xs font-bold mb-2">
                        {p.identificacao}
                      </span>
                      <p className="text-azul dark:text-white leading-snug">
                        {p.ementa ?? "Sem ementa disponível."}
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-cinza-medio group-hover:text-verde transition-colors flex-shrink-0 mt-1"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
