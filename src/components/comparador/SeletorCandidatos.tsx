"use client";

import { useState } from "react";
import { Plus, X, Search } from "lucide-react";
import { candidatos, nomesEstados, type Candidato } from "@/data/candidatos";
import { cn } from "@/lib/utils";

interface SeletorCandidatosProps {
  selecionados: string[];
  onChange: (ids: string[]) => void;
  max?: number;
}

export function SeletorCandidatos({
  selecionados,
  onChange,
  max = 4,
}: SeletorCandidatosProps) {
  const [busca, setBusca] = useState("");

  const candidatosSelecionados = selecionados
    .map((id) => candidatos.find((c) => c.id === id))
    .filter(Boolean) as Candidato[];

  const candidatosDisponiveis = candidatos
    .filter((c) => !selecionados.includes(c.id))
    .filter((c) =>
      busca.trim() === ""
        ? true
        : c.nome.toLowerCase().includes(busca.toLowerCase())
    );

  function adicionar(id: string) {
    if (selecionados.length >= max) return;
    onChange([...selecionados, id]);
    setBusca("");
  }

  function remover(id: string) {
    onChange(selecionados.filter((s) => s !== id));
  }

  return (
    <div className="space-y-4">
      {/* Selecionados */}
      <div className="flex flex-wrap gap-3">
        {candidatosSelecionados.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white dark:bg-azul-light/20 border-2 border-verde"
          >
            <img
              src={c.foto}
              alt={c.nome}
              className="w-10 h-10 rounded-full object-cover"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-azul dark:text-white truncate">
                {c.nome}
              </p>
              <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                {c.partido} · {nomesEstados[c.estadoId] ?? c.estadoId}
              </p>
            </div>
            <button
              onClick={() => remover(c.id)}
              className="p-1 rounded-md hover:bg-cinza-claro dark:hover:bg-azul-light transition-colors"
              aria-label={`Remover ${c.nome}`}
            >
              <X size={16} className="text-cinza-escuro" />
            </button>
          </div>
        ))}

        {selecionados.length < max && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-cinza-medio dark:border-azul-light text-cinza-escuro dark:text-cinza-medio text-sm">
            <Plus size={16} />
            Adicione até {max} candidatos
          </div>
        )}
      </div>

      {/* Busca */}
      {selecionados.length < max && (
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-escuro"
          />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar candidato por nome..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light/20 text-azul dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-verde"
          />

          {/* Dropdown de resultados */}
          {busca.trim() !== "" && candidatosDisponiveis.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-azul-dark border border-cinza-medio dark:border-azul-light rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
              {candidatosDisponiveis.slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  onClick={() => adicionar(c.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-cinza-claro dark:hover:bg-azul-light transition-colors"
                  )}
                >
                  <img
                    src={c.foto}
                    alt={c.nome}
                    className="w-9 h-9 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-azul dark:text-white truncate">
                      {c.nome}
                    </p>
                    <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                      {c.cargo} · {c.partido} ·{" "}
                      {nomesEstados[c.estadoId] ?? c.estadoId}
                    </p>
                  </div>
                </button>
              ))}
              {candidatosDisponiveis.length > 8 && (
                <p className="px-3 py-2 text-xs text-cinza-escuro border-t border-cinza-medio">
                  Mostrando 8 de {candidatosDisponiveis.length}. Refine a busca.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}