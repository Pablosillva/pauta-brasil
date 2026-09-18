import Link from "next/link";
import { Search } from "lucide-react";
import { candidatos, nomesEstados } from "@/data/candidatos";
import { noticias } from "@/data/noticias";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = {
  title: "Busca",
};

export default async function BuscaPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const termo = (q ?? "").trim().toLowerCase();

  const candidatosEncontrados = termo
    ? candidatos.filter(
        (c) =>
          c.nome.toLowerCase().includes(termo) ||
          c.partido.toLowerCase().includes(termo) ||
          c.cargo.toLowerCase().includes(termo)
      )
    : [];

  const noticiasEncontradas = termo
    ? noticias.filter(
        (n) =>
          n.titulo.toLowerCase().includes(termo) ||
          n.categoria.toLowerCase().includes(termo) ||
          n.resumo.toLowerCase().includes(termo)
      )
    : [];

  const total = candidatosEncontrados.length + noticiasEncontradas.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Search size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Busca
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          {termo ? `Resultados para "${q}"` : "O que você procura?"}
        </h1>
        {termo && (
          <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
            {total} resultado{total === 1 ? "" : "s"} encontrado
            {total === 1 ? "" : "s"}
          </p>
        )}
      </header>

      {termo && total === 0 && (
        <div className="text-center py-16 bg-cinza-claro dark:bg-azul-light/10 rounded-2xl">
          <p className="text-cinza-escuro dark:text-cinza-medio">
            Nenhum resultado encontrado. Tente outro termo.
          </p>
        </div>
      )}

      {candidatosEncontrados.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-5">
            Candidatos ({candidatosEncontrados.length})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidatosEncontrados.map((c) => (
              <Link
                key={c.id}
                href={`/candidatos/${c.id}`}
                className="group bg-white dark:bg-azul-light/20 rounded-xl border border-cinza-medio dark:border-azul-light p-4 hover:border-verde transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.foto}
                    alt={c.nome}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-azul dark:text-white truncate group-hover:text-verde transition-colors">
                      {c.nome}
                    </p>
                    <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                      {c.cargo} · {c.partido} ·{" "}
                      {nomesEstados[c.estadoId] ?? c.estadoId}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {noticiasEncontradas.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-azul dark:text-white mb-5">
            Notícias ({noticiasEncontradas.length})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {noticiasEncontradas.map((n) => (
              <Link
                key={n.id}
                href={`/noticias/${n.id}`}
                className="group bg-white dark:bg-azul-light/20 rounded-xl border border-cinza-medio dark:border-azul-light p-4 hover:border-verde transition-all"
              >
                <span className="text-xs font-semibold text-verde uppercase tracking-wider">
                  {n.categoria}
                </span>
                <h3 className="font-bold text-azul dark:text-white mt-1 line-clamp-2 group-hover:text-verde transition-colors">
                  {n.titulo}
                </h3>
                <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-2">
                  {n.data}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}