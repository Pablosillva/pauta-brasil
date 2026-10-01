"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { useEffect, useState } from "react";

const CARGOS = [
  "Presidente",
  "Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
] as const;

interface FiltrosCandidatosProps {
  estados: Record<string, string>;
  partidos: string[];
}

export function FiltrosCandidatos({ estados, partidos }: FiltrosCandidatosProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const estadoAtivo = searchParams.get("estado") ?? "todos";
  const cargoAtivo = searchParams.get("cargo") ?? "todos";
  const partidoAtivo = searchParams.get("partido") ?? "todos";

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
        {Object.entries(estados).map(([id, nome]) => (
          <option key={id} value={id}>
            {nome}
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
        {partidos.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Limpar */}
      {temFiltro && (
        <button
          onClick={limpar}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold inline-block py-1 -my-1 text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors"
        >
          <X size={14} /> Limpar filtros
        </button>
      )}
    </div>
  );
}
