"use client";

import { AlertCircle } from "lucide-react";
import { candidatos, nomesEstados, type Candidato } from "@/data/candidatos";

interface TabelaComparativaProps {
  ids: string[];
}

export function TabelaComparativa({ ids }: TabelaComparativaProps) {
  const selecionados = ids
    .map((id) => candidatos.find((c) => c.id === id))
    .filter(Boolean) as Candidato[];

  if (selecionados.length < 2) {
    return (
      <div className="text-center py-16 bg-white dark:bg-azul-light/20 rounded-2xl border border-dashed border-cinza-medio dark:border-azul-light">
        <AlertCircle
          size={40}
          className="mx-auto text-cinza-escuro mb-3"
        />
        <p className="text-cinza-escuro dark:text-cinza-medio">
          Selecione pelo menos <strong>2 candidatos</strong> para comparar.
        </p>
      </div>
    );
  }

  // Coletar todas as áreas temáticas únicas entre os selecionados
  const areas = Array.from(
    new Set(
      selecionados.flatMap((c) => (c.propostas ?? []).map((p) => p.area))
    )
  );

  if (areas.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-azul-light/20 rounded-2xl border border-dashed border-cinza-medio dark:border-azul-light">
        <p className="text-cinza-escuro dark:text-cinza-medio">
          Os candidatos selecionados ainda não têm propostas cadastradas.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light/20">
      <table className="w-full min-w-[720px] border-collapse">
        {/* Cabeçalho com candidatos */}
        <thead>
          <tr className="bg-azul text-white">
            <th className="p-4 text-left text-sm font-semibold w-40">
              Tema
            </th>
            {selecionados.map((c) => (
              <th key={c.id} className="p-4 text-left align-top">
                <div className="flex items-center gap-3">
                  <img
                    src={c.foto}
                    alt={c.nome}
                    className="w-12 h-12 rounded-full object-cover border-2 border-verde"
                  />
                  <div>
                    <p className="font-bold">{c.nome}</p>
                    <p className="text-xs text-white/70">
                      {c.partido} · {nomesEstados[c.estadoId] ?? c.estadoId}
                    </p>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Linhas por tema */}
        <tbody>
          {areas.map((area, i) => {
            const propostasDaLinha = selecionados.map(
              (c) => c.propostas?.find((p) => p.area === area)?.resumo ?? null
            );

            // Detecta se há diferenças (ignora nulls)
            const valoresUnicos = new Set(
              propostasDaLinha.filter((p) => p !== null)
            );
            const temDiferenca = valoresUnicos.size > 1;

            return (
              <tr
                key={area}
                className={
                  i % 2 === 0
                    ? "bg-white dark:bg-transparent"
                    : "bg-cinza-claro dark:bg-azul-light/10"
                }
              >
                <td className="p-4 align-top border-t border-cinza-medio dark:border-azul-light">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-azul dark:text-white">
                      {area}
                    </span>
                    {temDiferenca && (
                      <span
                        title="Os candidatos divergem neste tema"
                        className="text-verde"
                      >
                        <AlertCircle size={14} />
                      </span>
                    )}
                  </div>
                </td>
                {propostasDaLinha.map((resumo, j) => (
                  <td
                    key={j}
                    className="p-4 align-top border-t border-cinza-medio dark:border-azul-light"
                  >
                    {resumo ? (
                      <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
                        {resumo}
                      </p>
                    ) : (
                      <span className="text-xs italic text-cinza-escuro/60">
                        Sem proposta cadastrada
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}