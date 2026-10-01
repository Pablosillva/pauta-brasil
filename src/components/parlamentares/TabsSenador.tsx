"use client";

import { useState } from "react";
import { FileText, Gavel, Wallet, User, KeyRound } from "lucide-react";
import type { Senador } from "@/lib/senado";
import { AbaGastos } from "@/components/parlamentares/AbaGastos";
import type { Gasto } from "@/lib/gastos";

type Aba = "projetos" | "votacoes" | "gastos" | "ficha";

interface TabsSenadorProps {
  senador: Senador;
  gastos: Gasto[] | null;
  temChaveGastos: boolean;
  temChaveSenado: boolean;
}

/**
 * Abas da ficha do senador, com a mesma estrutura da ficha do deputado.
 *
 * Projetos e votações ficam vazios ate existir chave da API do Senado: a
 * pagina explica isso em vez de mostrar zero, que pareceria "não fez nada".
 */
export function TabsSenador({
  senador,
  gastos,
  temChaveGastos,
  temChaveSenado,
}: TabsSenadorProps) {
  const [aba, setAba] = useState<Aba>("projetos");

  const abas: { id: Aba; label: string; icone: typeof FileText }[] = [
    { id: "projetos", label: "Projetos", icone: FileText },
    { id: "votacoes", label: "Votacoes", icone: Gavel },
    { id: "gastos", label: "Gastos", icone: Wallet },
    { id: "ficha", label: "Ficha", icone: User },
  ];

  const ficha = [
    senador.bloco && { rotulo: "Bloco", valor: senador.bloco },
    senador.lideranca && { rotulo: "Lideranca", valor: "Sim" },
    senador.mesa && { rotulo: "Mesa diretora", valor: "Sim" },
    senador.telefone && { rotulo: "Gabinete", valor: senador.telefone },
    senador.email && { rotulo: "E-mail", valor: senador.email },
  ].filter(Boolean) as { rotulo: string; valor: string }[];

  /** Aviso padrao das abas que dependem de chave da API do Senado. */
  const chaveSenado = (assunto: string) => (
    <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
      <div className="flex items-start gap-3">
        <KeyRound
          size={20}
          className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
        />
        <div>
          <h3 className="font-bold text-azul dark:text-white mb-1">
            {assunto} ainda nao disponiveis
          </h3>
          <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
            A API nova do Senado responde 401 sem autenticacao. O arquivo
            publico que usamos traz cadastro, mandato e suplentes, mas nao as
            materias nem as votacoes.
          </p>
          <p className="text-sm text-cinza-escuro dark:text-cinza-medio mt-2">
            A chave gratuita sai de{" "}
            <a
              href="https://dadosabertos.senado.leg.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-verde font-semibold hover:underline"
            >
              dadosabertos.senado.leg.br
            </a>
            . Depois e so definir <code>SENADO_API_KEY</code>.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-cinza-medio dark:border-azul-light mb-6">
        {abas.map((item) => {
          const Icone = item.icone;
          const ativo = aba === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setAba(item.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                ativo
                  ? "border-verde text-verde"
                  : "border-transparent text-cinza-escuro dark:text-cinza-medio hover:text-azul dark:hover:text-white"
              }`}
            >
              <Icone size={16} />
              {item.label}
            </button>
          );
        })}
      </div>

      {aba === "projetos" &&
        (temChaveSenado ? (
          <p className="text-cinza-escuro dark:text-cinza-medio">
            Nenhuma materia de autoria em tramitacao.
          </p>
        ) : (
          chaveSenado("Materias de autoria")
        ))}

      {aba === "votacoes" &&
        (temChaveSenado ? (
          <p className="text-cinza-escuro dark:text-cinza-medio">
            Nenhuma votacao registrada no periodo.
          </p>
        ) : (
          chaveSenado("Votacoes")
        ))}

      {aba === "gastos" && (
        <AbaGastos gastos={gastos} temChave={temChaveGastos} nome={senador.nome} />
      )}

      {aba === "ficha" && (
        <dl className="grid sm:grid-cols-2 gap-4">
          {ficha.length === 0 ? (
            <p className="text-cinza-escuro dark:text-cinza-medio">
              O arquivo do Senado nao trouxe outros campos para este senador.
            </p>
          ) : (
            ficha.map((item) => {
              return (
                <div
                  key={item.rotulo}
                  className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light"
                >
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
                    <User size={14} className="text-verde" /> {item.rotulo}
                  </dt>
                  <dd className="text-azul dark:text-white break-words">
                    {item.valor}
                  </dd>
                </div>
              );
            })
          )}

          {senador.suplentes.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-2">
                Suplentes
              </dt>
              <dd>
                <ul className="space-y-2">
                  {senador.suplentes.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-4 p-3 rounded-xl bg-cinza-claro dark:bg-azul-light/10 border border-cinza-medio dark:border-azul-light"
                    >
                      <span className="text-sm text-azul dark:text-white">
                        {s.nome}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded bg-azul/10 dark:bg-azul-light/30 text-azul dark:text-white font-semibold flex-shrink-0">
                        {s.participacao}
                      </span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}
