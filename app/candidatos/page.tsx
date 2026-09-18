import Link from "next/link";
import { Suspense } from "react";
import { Users } from "lucide-react";
import { candidatos, nomesEstados } from "@/data/candidatos";
import { FiltrosCandidatos } from "@/components/candidatos/FiltrosCandidatos";

export async function generateMetadata({ searchParams }: PageProps) {
  const { estado, cargo, partido } = await searchParams;

  const partes = [];
  if (cargo) partes.push(cargo);
  if (estado) partes.push(nomesEstados[estado] ?? estado.toUpperCase());
  if (partido) partes.push(partido);

  const titulo = partes.length > 0
    ? `Candidatos: ${partes.join(" · ")}`
    : "Candidatos";

  return {
    title: titulo,
    description:
      "Conheça todos os candidatos cadastrados no Pauta Brasil. Use os filtros para refinar por estado, cargo ou partido.",
  };
}

interface PageProps {
  searchParams: Promise<{
    estado?: string;
    cargo?: string;
    partido?: string;
  }>;
}

export default async function CandidatosPage({ searchParams }: PageProps) {
  const { estado, cargo, partido } = await searchParams;

  const norm = (id: string) => id.toLowerCase().replace(/^br[-_]?/, "");

  const filtrados = candidatos
    .filter((c) => !estado || norm(c.estadoId) === norm(estado))
    .filter((c) => !cargo || c.cargo === cargo)
    .filter((c) => !partido || c.partido === partido);

  const temFiltro = !!estado || !!cargo || !!partido;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Cabeçalho */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Users size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Candidatos
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Todos os candidatos
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-2xl">
          {temFiltro
            ? `${filtrados.length} candidato${filtrados.length === 1 ? "" : "s"} encontrado${filtrados.length === 1 ? "" : "s"} com os filtros atuais.`
            : "Use os filtros abaixo para refinar por estado, cargo ou partido."}
        </p>
      </header>

      {/* Filtros */}
      <Suspense fallback={<div className="h-20" />}>
        <FiltrosCandidatos />
      </Suspense>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="text-center py-16 bg-cinza-claro dark:bg-azul-light/10 rounded-2xl animate-in fade-in">
          <p className="text-lg font-semibold text-azul dark:text-white mb-2">
            Nenhum candidato encontrado
          </p>
          <p className="text-cinza-escuro dark:text-cinza-medio mb-6">
            Tente remover ou ajustar os filtros.
          </p>
          <Link
            href="/candidatos"
            className="inline-block px-5 py-2.5 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
          >
            Ver todos os candidatos
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtrados.map((c, i) => (
            <Link
              key={c.id}
              href={`/candidatos/${c.id}`}
              className="group bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-5 hover:border-verde hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{
                animationDelay: `${i * 40}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={c.foto}
                  alt={`Foto de ${c.nome}`}
                  className="w-16 h-16 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-azul dark:text-white truncate group-hover:text-verde transition-colors">
                    {c.nome}
                  </h3>
                  <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                    {c.partido} · Nº {c.numero}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-cinza-escuro dark:text-cinza-medio">
                  {c.cargo} ·{" "}
                  {nomesEstados[c.estadoId] ?? c.estadoId.toUpperCase()}
                </span>
                <span className="font-semibold text-verde bg-verde/10 px-2 py-1 rounded">
                  {c.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}