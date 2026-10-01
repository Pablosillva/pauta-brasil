"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter } from "lucide-react";
import { nomesEstados } from "@/data/candidatos";

const CARGOS = [
  "Presidente",
  "Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
];

interface FiltrosBuscaProps {
  /** Filtro de cargo herda esta lista de opcoes. */
  cargos?: string[];
}

/**
 * Filtros da busca. Atualiza a URL sem recarregar a pagina inteira,
 * preservando o termo digitado.
 */
export function FiltrosBusca({ cargos = CARGOS }: FiltrosBuscaProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const estado = searchParams.get("estado") ?? "";
  const cargo = searchParams.get("cargo") ?? "";

  function aplicar(chave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (valor) params.set(chave, valor);
    else params.delete(chave);

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const temFiltro = Boolean(estado || cargo);

  return (
    <div className="flex flex-wrap gap-3 items-center bg-white dark:bg-azul-light/20 p-4 rounded-xl border border-cinza-medio dark:border-azul-light mb-8">
      <div className="flex items-center gap-2 text-cinza-escuro dark:text-cinza-medio">
        <Filter size={16} />
        <span className="text-sm font-semibold">Filtros</span>
      </div>

      <select
        value={estado}
        onChange={(e) => aplicar("estado", e.target.value)}
        aria-label="Filtrar por estado"
        className="text-sm px-3 py-1.5 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
      >
        <option value="">Todos os estados</option>
        {Object.entries(nomesEstados).map(([id, nome]) => (
          <option key={id} value={id}>
            {nome}
          </option>
        ))}
      </select>

      <select
        value={cargo}
        onChange={(e) => aplicar("cargo", e.target.value)}
        aria-label="Filtrar por cargo"
        className="text-sm px-3 py-1.5 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
      >
        <option value="">Todos os cargos</option>
        {cargos.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {temFiltro && (
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("estado");
            params.delete("cargo");
            const query = params.toString();
            router.push(query ? `${pathname}?${query}` : pathname, {
              scroll: false,
            });
          }}
          className="ml-auto text-xs font-semibold text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
