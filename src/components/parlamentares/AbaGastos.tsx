"use client";

import Link from "next/link";
import { Wallet, KeyRound, AlertTriangle } from "lucide-react";
import type { Gasto } from "@/lib/gastos";
import { formatarValor } from "@/lib/gastos";

interface AbaGastosProps {
  gastos: Gasto[] | null;
  temChave: boolean;
  nome: string;
}

/**
 * Aba de gastos parliamentary.
 *
 * Mostra o estado real da fonte: se a chave do Portal da Transparencia nao
 * esta configurada, explica o que falta em vez de exibir zeros, que
 * pareceriam "este parlamentar nao gasta".
 */
export function AbaGastos({ gastos, temChave, nome }: AbaGastosProps) {
  if (!temChave) {
    return (
      <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:amber-800">
        <div className="flex items-start gap-3">
          <KeyRound
            size={20}
            className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
          />
          <div>
            <h3 className="font-bold text-azul dark:text-white mb-1">
              Gastos Parliamentary ainda nao disponiveis
            </h3>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
              O Portal da Transparencia da CGU exige uma chave de API gratuita
              para responder. Sem ela, esta aba ficaria vazia — e uma aba
              vazia parece dizer que o parlamentar nao gasta, o que seria falso.
            </p>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio mt-2">
              A chave sai de{" "}
              <a
                href="https://www.portaldatransparencia.gov.br/api-de-dados/cadastrar-email"
                target="_blank"
                rel="noopener noreferrer"
                className="text-verde font-semibold hover:underline"
              >
                portal transparencia.gov.br
              </a>
              , com cadastro por e-mail. Depois basta definir{" "}
              <code>PORTAL_TRANSPARENCIA_API_KEY</code>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (gastos === null) {
    return (
      <div className="p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light text-center">
        <AlertTriangle
          size={32}
          className="mx-auto text-cinza-medio mb-3"
        />
        <p className="text-cinza-escuro dark:text-cinza-medio">
          A consulta ao Portal da Transparencia nao retornou dados agora.
        </p>
      </div>
    );
  }

  if (gastos.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light text-center">
        <p className="text-cinza-escuro dark:text-cinza-medio">
          Nenhum registro encontrado para{" "}
          <strong>{nome}</strong> na base da CGU.
        </p>
        <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-2">
          A base indexa por nome: divergencias de grafia podem impedir o
          resultado.
        </p>
      </div>
    );
  }

  const total = gastos.reduce((soma, g) => soma + g.valor, 0);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-verde/10 border border-verde/30">
        <p className="text-xs uppercase tracking-wider text-verde-dark dark:text-verde-light font-semibold mb-1">
          Total em {gastos.length} registro(s)
        </p>
        <p className="text-2xl font-bold text-azul dark:text-white">
          {formatarValor(total)}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light/20">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-azul text-white">
              <th className="p-3 text-left text-sm font-semibold">Data</th>
              <th className="p-3 text-left text-sm font-semibold">Descricao</th>
              <th className="p-3 text-right text-sm font-semibold">Valor</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((g) => (
              <tr key={g.codigo} className="border-t border-cinza-medio dark:border-azul-light">
                <td className="p-3 text-sm text-cinza-escuro dark:text-cinza-medio whitespace-nowrap">
                  {g.data
                    ? new Date(`${g.data}T12:00:00`).toLocaleDateString("pt-BR")
                    : "—"}
                </td>
                <td className="p-3 text-sm text-azul dark:text-white">
                  {g.descricao}
                  {g.orgao && (
                    <span className="block text-xs text-cinza-escuro dark:text-cinza-medio">
                      {g.orgao}
                    </span>
                  )}
                </td>
                <td className="p-3 text-sm font-semibold text-azul dark:text-white text-right whitespace-nowrap">
                  {formatarValor(g.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-cinza-escuro dark:text-cinza-medio leading-relaxed">
        Fonte: Portal da Transparencia (CGU). A base e consultada por nome, o
        que pode agrupar homonimos e devolver registros de outra pessoa com o
        mesmo nome. Conferimos o nome exato consultado acima:{" "}
        <strong>{nome}</strong>.
      </p>

      <a
        href="https://www.portaldatransparencia.gov.br"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-verde font-semibold hover:underline text-sm"
      >
        Abrir o Portal da Transparencia
      </a>
    </div>
  );
}
