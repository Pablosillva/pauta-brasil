import Link from "next/link";
import { Suspense } from "react";
import { candidatos, nomesEstados } from "@/data/candidatos";
import { FiltrosCandidatos } from "@/components/candidatos/FiltrosCandidatos";

export const metadata = {
  title: "Candidatos",
  description: "Conheça todos os candidatos cadastrados.",
};

interface PageProps {
  searchParams: Promise<{ estado?: string; cargo?: string; partido?: string }>;
}

export default async function CandidatosPage({ searchParams }: PageProps) {
  const { estado, cargo, partido } = await searchParams;

  const norm = (id: string) => id.toLowerCase().replace(/^br[-_]?/, "");

  const filtrados = candidatos
    .filter((c) => !estado || norm(c.estadoId) === norm(estado))
    .filter((c) => !cargo || c.cargo === cargo)
    .filter((c) => !partido || c.partido === partido);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Candidatos
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-2xl">
          Conheça os candidatos de todo o Brasil. Use os filtros para refinar.
        </p>
      </header>

      <Suspense fallback={null}>
        <FiltrosCandidatos />
      </Suspense>

      {filtrados.length === 0 ? (
        <div className="text-center py-16 bg-cinza-claro dark:bg-azul-light/10 rounded-2xl">
          <p className="text-cinza-escuro dark:text-cinza-medio">
            Nenhum candidato encontrado com os filtros atuais.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtrados.map((c) => (
            <Link
              key={c.id}
              href={`/candidatos/${c.id}`}
              className="group bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-5 hover:border-verde hover:shadow-lg transition-all animate-in fade-in duration-300"
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
                  {c.cargo} · {nomesEstados[c.estadoId] ?? c.estadoId.toUpperCase()}
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