"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { candidatos, nomesEstados } from "@/data/candidatos";

const CARGOS = [
  "Presidente",
  "Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
] as const;

export function FiltrosCandidatos() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const estadoAtivo = searchParams.get("estado") ?? "todos";
  const cargoAtivo = searchParams.get("cargo") ?? "todos";
  const partidoAtivo = searchParams.get("partido") ?? "todos";

  // Estados disponíveis (só os que têm candidatos)
  const estadosDisponiveis = Array.from(
    new Set(candidatos.map((c) => c.estadoId))
  ).sort((a, b) =>
    (nomesEstados[a] ?? a).localeCompare(nomesEstados[b] ?? b)
  );

  // Partidos disponíveis (só os que têm candidatos)
  const partidosDisponiveis = Array.from(
    new Set(candidatos.map((c) => c.partido))
  ).sort();

  function atualizar(chave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor === "todos") {
      params.delete(chave);
    } else {
      params.set(chave, valor);
    }
    const query = params.toString();
    router.replace(query ? `/candidatos?${query}` : "/candidatos", {
      scroll: false,
    });
  }

  function limpar() {
    router.replace("/candidatos", { scroll: false });
  }

  const temFiltro =
    estadoAtivo !== "todos" ||
    cargoAtivo !== "todos" ||
    partidoAtivo !== "todos";

  return (
    <div className="flex flex-wrap gap-3 items-center bg-white dark:bg-azul-light/20 p-4 rounded-xl border border-cinza-medio dark:border-azul-light mb-8">
      <div className="flex items-center gap-2 text-cinza-escuro dark:text-cinza-medio">
        <Filter size={16} />
        <span className="text-sm font-semibold">Filtros</span>
      </div>

      {/* Estado */}
      <select
        value={estadoAtivo}
        onChange={(e) => atualizar("estado", e.target.value)}
        aria-label="Filtrar por estado"
        className="text-sm px-3 py-1.5 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
      >
        <option value="todos">Todos os estados</option>
        {estadosDisponiveis.map((e) => (
          <option key={e} value={e}>
            {nomesEstados[e] ?? e.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Cargo */}
      <select
        value={cargoAtivo}
        onChange={(e) => atualizar("cargo", e.target.value)}
        aria-label="Filtrar por cargo"
        className="text-sm px-3 py-1.5 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
      >
        <option value="todos">Todos os cargos</option>
        {CARGOS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Partido */}
      <select
        value={partidoAtivo}
        onChange={(e) => atualizar("partido", e.target.value)}
        aria-label="Filtrar por partido"
        className="text-sm px-3 py-1.5 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
      >
        <option value="todos">Todos os partidos</option>
        {partidosDisponiveis.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Limpar */}
      {temFiltro && (
        <button
          onClick={limpar}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors"
        >
          <X size={14} /> Limpar filtros
        </button>
      )}
    </div>
  );
}