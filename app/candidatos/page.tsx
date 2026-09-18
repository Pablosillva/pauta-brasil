import Link from "next/link";
import { candidatos, nomesEstados } from "@/data/candidatos";

export const metadata = {
  title: "Candidatos — Pauta Brasil",
  description: "Conheça todos os candidatos cadastrados.",
};

export default function CandidatosPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Candidatos
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-2xl">
          Conheça os candidatos de todo o Brasil. Clique em um nome para ver o
          perfil completo, propostas, histórico e patrimônio.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {candidatos.map((c) => (
          <Link
            key={c.id}
            href={`/candidatos/${c.id}`}
            className="group bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-5 hover:border-verde hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={c.foto}
                alt={`Foto de ${c.nome}`}
                className="w-16 h-16 rounded-full object-cover"
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
    </div>
  );
}