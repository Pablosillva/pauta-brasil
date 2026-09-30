import Link from "next/link";
import { Search, User, Newspaper, Filter } from "lucide-react";
import { readFile, readdir } from "fs/promises";
import path from "path";
import { nomesEstados, type Candidato } from "@/data/candidatos";
import { listarNoticias } from "@/lib/noticias";
import { FotoCandidato } from "@/components/ui/FotoCandidato";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; estado?: string; cargo?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Busca: "${q}"` : "Busca",
    description: "Busque candidatos por nome, partido, cargo ou estado.",
  };
}

async function carregarTodosCandidatos(): Promise<Candidato[]> {
  const dir = path.join(process.cwd(), "src/data/tse");
  const arquivos = await readdir(dir);
  const todos: Candidato[] = [];

  for (const arquivo of arquivos) {
    if (arquivo === "_indice.json" || !arquivo.endsWith(".json")) continue;
    try {
      const conteudo = await readFile(path.join(dir, arquivo), "utf-8");
      todos.push(...JSON.parse(conteudo));
    } catch {
      // ignora arquivo inválido
    }
  }

  return todos;
}

export default async function BuscaPage({ searchParams }: PageProps) {
  const { q, estado, cargo } = await searchParams;
  const termo = (q ?? "").trim().toLowerCase();

  const candidatos = await carregarTodosCandidatos();
  const noticias = await listarNoticias();

  const candidatosFiltrados = candidatos
    .filter((c) => {
      if (!termo) return true;
      return (
        c.nome.toLowerCase().includes(termo) ||
        (c.nomeUrna && c.nomeUrna.toLowerCase().includes(termo)) ||
        c.partido.toLowerCase().includes(termo) ||
        c.cargo.toLowerCase().includes(termo) ||
        c.numero.includes(termo) ||
        (nomesEstados[c.estadoId] ?? "").toLowerCase().includes(termo)
      );
    })
    .filter((c) => !estado || c.estadoId === estado)
    .filter((c) => !cargo || c.cargo === cargo);

  const candidatosEncontrados = candidatosFiltrados.slice(0, 100);

  const noticiasEncontradas = termo
    ? noticias.filter(
        (n) =>
          n.titulo.toLowerCase().includes(termo) ||
          n.categoria.toLowerCase().includes(termo) ||
          n.resumo.toLowerCase().includes(termo) ||
          (n.tags ?? []).some((t) => t.toLowerCase().includes(termo))
      )
    : [];

  const total = candidatosEncontrados.length + noticiasEncontradas.length;

  const estados = Object.entries(nomesEstados).map(([id, nome]) => ({ id, nome }));
  const cargos = ["Presidente", "Governador", "Senador", "Deputado Federal", "Deputado Estadual"];

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
            {total} resultado{total === 1 ? "" : "s"} encontrado{total === 1 ? "" : "s"}
          </p>
        ) : (
          <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
            Busque candidatos por nome, partido, cargo ou estado.
          </p>
        )}
      </header>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center bg-white dark:bg-azul-light/20 p-4 rounded-xl border border-cinza-medio dark:border-azul-light mb-8">
        <div className="flex items-center gap-2 text-cinza-escuro dark:text-cinza-medio">
          <Filter size={16} />
          <span className="text-sm font-semibold">Filtros</span>
        </div>

        <select
          value={estado ?? ""}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            if (e.target.value) {
              params.set("estado", e.target.value);
            } else {
              params.delete("estado");
            }
            window.location.href = `/busca?${params.toString()}`;
          }}
          className="text-sm px-3 py-1.5 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
        >
          <option value="">Todos os estados</option>
          {estados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>

        <select
          value={cargo ?? ""}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            if (e.target.value) {
              params.set("cargo", e.target.value);
            } else {
              params.delete("cargo");
            }
            window.location.href = `/busca?${params.toString()}`;
          }}
          className="text-sm px-3 py-1.5 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
        >
          <option value="">Todos os cargos</option>
          {cargos.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {(estado || cargo) && (
          <button
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.delete("estado");
              params.delete("cargo");
              window.location.href = `/busca?${params.toString()}`;
            }}
            className="ml-auto text-xs font-semibold text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {termo && total === 0 && (
        <div className="text-center py-16 bg-cinza-claro dark:bg-azul-light/10 rounded-2xl animate-in fade-in">
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
              href="/noticias"
              className="px-4 py-2 rounded-lg border border-azul dark:border-white text-azul dark:text-white hover:bg-azul hover:text-white dark:hover:bg-white dark:hover:text-azul font-semibold transition-colors"
            >
              Ver todas as notícias
            </Link>
          </div>
        </div>
      )}

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
                style={{
                  animationDelay: `${i * 40}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-cinza-medio dark:bg-azul-light flex-shrink-0">
                    <FotoCandidato
                      src={c.foto}
                      alt={`Foto de ${c.nome}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-azul dark:text-white truncate group-hover:text-verde transition-colors">
                      {c.nomeUrna || c.nome}
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
                key={n.slug}
                href={`/noticias/${n.slug}`}
                className="group bg-white dark:bg-azul-light/20 rounded-xl border border-cinza-medio dark:border-azul-light p-4 hover:border-verde hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{
                  animationDelay: `${i * 40}ms`,
                  animationFillMode: "backwards",
                }}
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
