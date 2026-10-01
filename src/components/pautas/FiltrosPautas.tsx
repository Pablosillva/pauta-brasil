"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Votacao } from "@/lib/camara";
import { BadgeResultado } from "@/components/pautas/BadgeVotacao";
import { extrairIdentificacao } from "@/lib/camara";

/** Filtros da lista de pautas. Roda no cliente: a lista é curta e já vem filtrada. */
export function FiltrosPautas({ votacoes }: { votacoes: Votacao[] }) {
  const [busca, setBusca] = useState("");
  const [resultado, setResultado] = useState<"todas" | "aprovadas" | "rejeitadas">(
    "todas"
  );

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return votacoes.filter((v) => {
      if (resultado === "aprovadas" && v.aprovacao !== 1) return false;
      if (resultado === "rejeitadas" && v.aprovacao !== 2) return false;

      if (!termo) return true;

      const identificacao = extrairIdentificacao(v.descricao) ?? "";
      return (
        v.descricao.toLowerCase().includes(termo) ||
        identificacao.toLowerCase().includes(termo) ||
        v.siglaOrgao.toLowerCase().includes(termo)
      );
    });
  }, [votacoes, busca, resultado]);

  return (
    <div>
      <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-medio"
          />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por tema ou número do projeto (ex.: PL 2630)... "
            aria-label="Buscar pautas"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-cinza-medio" />
          <select
            value={resultado}
            onChange={(e) =>
              setResultado(e.target.value as "todas" | "aprovadas" | "rejeitadas")
            }
            aria-label="Filtrar por resultado"
            className="px-3 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
          >
            <option value="todas">Todas</option>
            <option value="aprovadas">Aprovadas</option>
            <option value="rejeitadas">Rejeitadas</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-4">
        {filtradas.length} de {votacoes.length} pautas
      </p>

      {filtradas.length === 0 ? (
        <div className="text-center py-14 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light">
          <p className="text-cinza-escuro dark:text-cinza-medio">
            Nenhuma pauta encontrada com esses filtros.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtradas.map((v) => {
            const identificacao = extrairIdentificacao(v.descricao);

            return (
              <li key={v.id}>
                <a
                  href={`/pautas/${v.id}`}
                  className="block p-5 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {identificacao && (
                          <span className="px-2 py-0.5 rounded bg-azul/10 dark:bg-azul-light/30 text-azul dark:text-white text-xs font-bold">
                            {identificacao}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-cinza-claro dark:bg-azul-light/20 text-cinza-escuro dark:text-cinza-medio text-xs font-semibold">
                          {v.siglaOrgao}
                        </span>
                      </div>

                      <p className="text-azul dark:text-white leading-snug">
                        {v.descricao}
                      </p>

                      <time
                        dateTime={v.data}
                        className="block mt-2 text-xs text-cinza-escuro dark:text-cinza-medio"
                      >
                        {new Date(`${v.data}T12:00:00`).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    </div>

                    <BadgeResultado aprovacao={v.aprovacao} />
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
