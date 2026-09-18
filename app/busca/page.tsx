import Link from "next/link";
import { Search, User, Newspaper } from "lucide-react";
import { candidatos, nomesEstados } from "@/data/candidatos";
import { noticias } from "@/data/noticias";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Busca: "${q}"` : "Busca",
  };
}

export default async function BuscaPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const termo = (q ?? "").trim().toLowerCase();

  const candidatosEncontrados = termo
    ? candidatos.filter(
        (c) =>
          c.nome.toLowerCase().includes(termo) ||
          c.partido.toLowerCase().includes(termo) ||
          c.cargo.toLowerCase().includes(termo) ||
          c.numero.includes(termo) ||
          (nomesEstados[c.estadoId] ?? "")
            .toLowerCase()
            .includes(termo)
      )
    : [];

  const noticiasEncontradas = termo
    ? noticias.filter(
        (n) =>
          n.titulo.toLowerCase().includes(termo) ||
          n.categoria.toLowerCase().includes(termo) ||
          n.resumo.toLowerCase().includes(termo) ||
          n.tags.some((t) => t.toLowerCase().includes(termo))
      )
    : [];

  const total = candidatosEncontrados.length + noticiasEncontradas.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Cabeçalho */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Search size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Busca
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          {termo ? (
            <>
              Resultados para <span className="text-verde">"{q}"</span>
            </>
          ) : (
            "O que você procura?"
          )}
        </h1>
        {termo ? (
          <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
            {total} resultado{total === 1 ? "" : "s"} encontrado
            {total === 1 ? "" : "s"}
          </p>
        ) : (
          <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
            Digite algo no campo de busca do topo para começar.
          </p>
        )}
      </header>

      {/* Nada encontrado */}
      {termo && total === 0 && (
        <div className="text-center py-16 bg-cinza-claro dark:bg-azul-light/10 rounded-2xl animate-in fade-in">
          <Search
            size={40}
            className="mx-auto text-cinza-escuro mb-3"
          />
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
              href="/noticias"
              className="px-4 py-2 rounded-lg border border-azul dark:border-white text-azul dark:text-white hover:bg-azul hover:text-white dark:hover:bg-white dark:hover:text-azul font-semibold transition-colors"
            >
              Ver todas as notícias
            </Link>
          </div>
        </div>
      )}

      {/* Candidatos */}
      {candidatosEncontrados.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <User size={20} className="text-verde" />
            <h2 className="text-2xl font-bold text-azul dark:text-white">
              Candidatos ({candidatosEncontrados.length})
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidatosEncontrados.map((c, i) => (
              <Link
                key={c.id}
                href={`/candidatos/${c.id}`}
                className="group bg-white dark:bg-azul-light/20 rounded-xl border border-cinza-medio dark:border-azul-light p-4 hover:border-verde hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.foto}
                    alt={`Foto de ${c.nome}`}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-azul dark:text-white truncate group-hover:text-verde transition-colors">
                      {c.nome}
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
        </section>
      )}

      {/* Notícias */}
      {noticiasEncontradas.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Newspaper size={20} className="text-verde" />
            <h2 className="text-2xl font-bold text-azul dark:text-white">
              Notícias ({noticiasEncontradas.length})
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {noticiasEncontradas.map((n, i) => (
              <Link
                key={n.id}
                href={`/noticias/${n.id}`}
                className="group bg-white dark:bg-azul-light/20 rounded-xl border border-cinza-medio dark:border-azul-light p-4 hover:border-verde hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}
              >
                <span className="text-xs font-semibold text-verde uppercase tracking-wider">
                  {n.categoria}
                </span>
                <h3 className="font-bold text-azul dark:text-white mt-2 line-clamp-2 group-hover:text-verde transition-colors">
                  {n.titulo}
                </h3>
                <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-2">
                  {n.autor} · {n.data}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}