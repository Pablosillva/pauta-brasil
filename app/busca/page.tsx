import Link from "next/link";
import type { Metadata } from "next";
import { formatarNome } from "@/lib/nomes";
import { Search, User, Newspaper, Gavel } from "lucide-react";
import { nomesEstados } from "@/data/candidatos";
import { buscarTudo } from "@/lib/busca";
import { FotoCandidato } from "@/components/ui/FotoCandidato";
import { BadgeResultado } from "@/components/pautas/BadgeVotacao";
import { extrairIdentificacao } from "@/lib/camara";
import { FiltrosBusca } from "@/components/busca/FiltrosBusca";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; estado?: string; cargo?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: q ? `Busca: "${q}"` : "Busca",
    description: q
      ? `Resultados para "${q}" em candidatos, noticias e pautas do Congresso.`
      : "Busque unificadamente candidatos do TSE, noticias e votacoes do Congresso.",
    robots: q ? { index: false, follow: true } : undefined,
  };
}

export default async function BuscaPage({ searchParams }: PageProps) {
  const { q, estado, cargo } = await searchParams;

  const { candidatos, noticias, pautas } = await buscarTudo({
    termo: q,
    estado,
    cargo,
  });

  const total = candidatos.length + noticias.length + pautas.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Search size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Busca unificada
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          {q ? (
            <>
              Resultados para <span className="text-verde">&ldquo;{q}&rdquo;</span>
            </>
          ) : (
            "O que você procura?"
          )}
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          {q
            ? `${total} resultado${total === 1 ? "" : "s"} em candidatos, notícias e pautas.`
            : "Busque por nome de candidato, partido, cargo, tema ou número de projeto."}
        </p>
      </header>

      {/* Filtros */}
      <FiltrosBusca />

      {q && total === 0 && (
        <div className="text-center py-16 bg-cinza-claro dark:bg-azul-light/10 rounded-2xl">
          <Search size={40} className="mx-auto text-cinza-escuro mb-3" />
          <p className="text-lg font-semibold text-azul dark:text-white mb-2">
            Nenhum resultado encontrado
          </p>
          <p className="text-cinza-escuro dark:text-cinza-medio mb-6">
            Tente buscar por outro nome, partido, cargo ou tema.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/candidatos"
              className="px-4 py-2 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
            >
              Ver todos os candidatos
            </Link>
            <Link
              href="/projetos"
              className="px-4 py-2 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white font-semibold transition-colors"
            >
              Ver as pautas do Congresso
            </Link>
          </div>
        </div>
      )}

      {/* Candidatos */}
      {candidatos.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <User size={20} className="text-verde" />
            <h2 className="text-2xl font-bold text-azul dark:text-white">
              Candidatos ({candidatos.length})
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidatos.map((c) => (
              <Link
                key={c.id}
                href={`/candidatos/${c.id}`}
                className="group bg-white dark:bg-azul-light/20 rounded-xl border border-cinza-medio dark:border-azul-light p-4 hover:border-verde transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-cinza-medio dark:bg-azul-light flex-shrink-0">
                    <FotoCandidato
                      src={c.foto}
                      alt={`Foto de ${formatarNome(c.nome)}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-azul dark:text-white truncate group-hover:text-verde transition-colors">
                      {formatarNome(c.nomeUrna || c.nome)}
                    </p>
                    <p className="text-xs text-cinza-escuro dark:text-cinza-medio truncate">
                      {c.cargo} · {c.partido} · Nº {c.numero}
                    </p>
                    <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                      {nomesEstados[c.estadoId] ?? c.estadoId.toUpperCase()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {candidatos.length >= 60 && (
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio mt-4">
              Mostrando os 60 primeiros resultados. Refine a busca ou use os
              filtros para encontrar mais.
            </p>
          )}
        </section>
      )}

      {/* Pautas */}
      {pautas.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Gavel size={20} className="text-verde" />
            <h2 className="text-2xl font-bold text-azul dark:text-white">
              Pautas do Congresso ({pautas.length})
            </h2>
          </div>

          <ul className="space-y-3">
            {pautas.map((v) => {
              const identificacao = extrairIdentificacao(v.descricao);

              return (
                <li key={v.id}>
                  <Link
                    href={`/pautas/${v.id}`}
                    className="block p-4 rounded-xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        {identificacao && (
                          <span className="inline-block px-2 py-0.5 rounded bg-azul/10 dark:bg-azul-light/30 text-azul dark:text-white text-xs font-bold mb-1.5">
                            {identificacao}
                          </span>
                        )}
                        <p className="text-sm text-azul dark:text-white">
                          {v.descricao}
                        </p>
                      </div>
                      <BadgeResultado aprovacao={v.aprovacao} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Notícias */}
      {noticias.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Newspaper size={20} className="text-verde" />
            <h2 className="text-2xl font-bold text-azul dark:text-white">
              Notícias ({noticias.length})
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {noticias.map((n) => (
              <Link
                key={n.slug}
                href={`/noticias/${n.slug}`}
                className="group bg-white dark:bg-azul-light/20 rounded-xl border border-cinza-medio dark:border-azul-light p-4 hover:border-verde transition-colors"
              >
                <span className="text-xs font-semibold text-verde uppercase tracking-wider">
                  {n.categoria}
                </span>
                <h3 className="font-bold text-azul dark:text-white mt-2 line-clamp-2 group-hover:text-verde transition-colors">
                  {n.titulo}
                </h3>
                <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-2">
                  {n.autor} · {new Date(n.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
