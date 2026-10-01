"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Gavel,
  Wallet,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
} from "lucide-react";
import type { Proposicao, Votacao } from "@/lib/camara";
import { rotuloVoto, type CorVoto } from "@/lib/camara";
import { BadgeVoto } from "@/components/pautas/BadgeVotacao";
import { AbaGastos } from "@/components/parlamentares/AbaGastos";
import type { GastosDeputado } from "@/lib/gastos";

type Aba = "projetos" | "votacoes" | "gastos" | "ficha";

interface TabsDeputadoProps {
  nome: string;
  projetos: Proposicao[];
  votos: { votacao: Votacao; voto: string }[];
  resumo: Record<string, number>;
  votacoesIndice: Votacao[];
  ficha: { rotulo: string; valor: string }[];
  gastos: GastosDeputado | null;

}

const COR_CLASSE: Record<CorVoto, string> = {
  verde: "text-verde",
  vermelho: "text-red-500",
  neutro: "text-cinza-medio",
};

const ICONE_FICHA: Record<string, typeof Mail> = {
  Situacao: Calendar,
  Nascimento: Calendar,
  Naturalidade: MapPin,
  Escolaridade: GraduationCap,
  Gabinete: Phone,
  "E-mail": Mail,
};

export function TabsDeputado({
  nome,
  projetos,
  votos,
  resumo,
  votacoesIndice,
  ficha,
  gastos,

}: TabsDeputadoProps) {
  const [aba, setAba] = useState<Aba>("projetos");

  const abas: { id: Aba; label: string; icone: typeof FileText; contagem?: number }[] = [
    { id: "projetos", label: "Projetos", icone: FileText, contagem: projetos.length },
    { id: "votacoes", label: "Votacoes", icone: Gavel, contagem: votos.length },
    { id: "gastos", label: "Gastos", icone: Wallet },
    { id: "ficha", label: "Ficha", icone: User },
  ];

  return (
    <div>
      {/* Abas */}
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
              {item.contagem !== undefined && (
                <span className="text-xs opacity-70">({item.contagem})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Projetos */}
      {aba === "projetos" && (
        <div>
          {projetos.length === 0 ? (
            <div className="p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light text-center text-cinza-escuro dark:text-cinza-medio">
              <p>Nenhum projeto de autoria encontrado na base da Camara.</p>
              <p className="text-xs mt-2">
                A busca e feita pelo nome do parlamentar. Divergencias de
                grafia podem impedir o resultado.
              </p>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {projetos.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/proposicoes/${p.id}`}
                      className="block p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <span className="inline-block px-2 py-0.5 rounded bg-verde/10 text-verde text-xs font-bold mb-1.5">
                            {p.identificacao}
                          </span>
                          <p className="text-sm text-azul dark:text-white leading-relaxed">
                            {p.ementa ?? "Sem ementa disponivel."}
                          </p>
                          {p.dataApresentacao && (
                            <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1.5">
                              Apresentado em{" "}
                              {new Date(
                                p.dataApresentacao
                              ).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-4 leading-relaxed">
                A Camara nao oferece consulta de projetos por id de deputado;
                a busca e feita pelo nome. Isso pode devolver uma lista
                incompleta ou, em caso de homonimos, incluir projetos de outra
                pessoa. Compare sempre o nome na ficha.
              </p>
            </>
          )}
        </div>
      )}

      {/* Votações */}
      {aba === "votacoes" && (
        <div>
          {votos.length === 0 ? (
            <div className="p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light text-center text-cinza-escuro dark:text-cinza-medio">
              Nenhuma votacao nominal registrada no periodo consultado.
            </div>
          ) : (
            <>
              {votacoesIndice.length > 0 && (
                <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-5">
                  Baseado nas {votacoesIndice.length} votacoes nominais mais
                  recentes, de{" "}
                  {new Date(
                    `${votacoesIndice[votacoesIndice.length - 1].data}T12:00:00`
                  ).toLocaleDateString("pt-BR")}{" "}
                  a{" "}
                  {new Date(
                    `${votacoesIndice[0].data}T12:00:00`
                  ).toLocaleDateString("pt-BR")}
                  .
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {Object.entries(resumo).map(([tipo, total]) => {
                  const { cor } = rotuloVoto(tipo);
                  return (
                    <div
                      key={tipo}
                      className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light text-center"
                    >
                      <p className={`text-3xl font-bold ${COR_CLASSE[cor]}`}>
                        {total}
                      </p>
                      <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
                        {tipo}
                      </p>
                    </div>
                  );
                })}
              </div>

              <ul className="space-y-3">
                {votos.map(({ votacao, voto }, i) => {
                  const data = new Date(`${votacao.data}T12:00:00`);

                  return (
                    <li key={`${votacao.id}-${i}`}>
                      <Link
                        href={`/pautas/${votacao.id}`}
                        className="block p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm text-azul dark:text-white leading-relaxed">
                              {votacao.descricao}
                            </p>
                            <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1.5">
                              {data.toLocaleDateString("pt-BR")} · {votacao.siglaOrgao}
                            </p>
                          </div>
                          <BadgeVoto voto={voto} />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Gastos */}
      {aba === "gastos" && (
      <AbaGastos gastos={gastos} nome={nome} />
      )}

      {/* Ficha */}
      {aba === "ficha" && (
        <dl className="grid sm:grid-cols-2 gap-4">
          {ficha.length === 0 ? (
            <p className="text-cinza-escuro dark:text-cinza-medio">
              A Camara nao disponibiliza esses campos para este deputado.
            </p>
          ) : (
            ficha.map((item) => {
              const Icone = ICONE_FICHA[item.rotulo] ?? User;
              return (
                <div
                  key={item.rotulo}
                  className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light"
                >
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
                    <Icone size={14} className="text-verde" /> {item.rotulo}
                  </dt>
                  <dd className="text-azul dark:text-white break-words">
                    {item.valor}
                  </dd>
                </div>
              );
            })
          )}
        </dl>
      )}
    </div>
  );
}
