"use client";

import { formatarNome } from "@/lib/nomes";

import { useEffect, useState } from "react";
import { AlertCircle, FileText } from "lucide-react";
import { nomesEstados, type Candidato } from "@/data/candidatos";

interface TabelaComparativaProps {
  ids: string[];
}

/** Campos do registro oficial do TSE usados na comparacao. */
const CAMPOS = [
  {
    rotulo: "Nome na urna",
    valor: (c: Candidato) => c.nomeUrna || c.nome,
  },
  {
    rotulo: "Numero na urna",
    valor: (c: Candidato) => (c.numero ? String(c.numero) : "—"),
    destaque: true,
  },
  { rotulo: "Partido", valor: (c: Candidato) => c.partido || "—" },
  { rotulo: "Cargo", valor: (c: Candidato) => c.cargo },
  {
    rotulo: "Estado",
    valor: (c: Candidato) => nomesEstados[c.estadoId] ?? c.estadoId,
  },
  {
    rotulo: "Idade",
    valor: (c: Candidato) => (c.idade ? `${c.idade} anos` : "—"),
  },
  { rotulo: "Genero", valor: (c: Candidato) => (c.genero === "F" ? "Feminino" : "Masculino") },
  { rotulo: "Ocupacao", valor: (c: Candidato) => c.ocupacao || "—", texto: true },
  {
    rotulo: "Grau de instrucao",
    valor: (c: Candidato) => c.grauInstrucao || "—",
    texto: true,
  },
  { rotulo: "Status", valor: (c: Candidato) => c.status },
] as const;

export function TabelaComparativa({ ids }: TabelaComparativaProps) {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (ids.length === 0) return;

    let cancelado = false;

    async function carregar() {
      try {
        const res = await fetch(`/api/candidatos?ids=${ids.join(",")}`);

        if (!res.ok) throw new Error("Falha na consulta");

        const dados: Candidato[] = await res.json();

        if (!cancelado) {
          // Preserva a ordem em que o usuario escolheu.
          const porId = new Map(dados.map((c) => [c.id, c]));
          setCandidatos(
            ids.map((id) => porId.get(id)).filter(Boolean) as Candidato[]
          );
          setErro("");
        }
      } catch {
        if (!cancelado) setErro("Nao foi possivel carregar os candidatos.");
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [ids]);

  // Nada selecionado: nao ha nada a buscar nem a comparar.
  if (ids.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-azul-light/20 rounded-2xl border border-dashed border-cinza-medio dark:border-azul-light">
        <AlertCircle size={40} className="mx-auto text-cinza-escuro mb-3" />
        <p className="text-cinza-escuro dark:text-cinza-medio">
          Selecione pelo menos <strong>2 candidatos</strong> para comparar.
        </p>
      </div>
    );
  }

  // Enquanto a resposta nao volta, mostramos o carregamento.
  const carregando = candidatos.length === 0 && !erro;

  if (carregando) {
    return (
      <div className="text-center py-16 bg-white dark:bg-azul-light/20 rounded-2xl border border-dashed border-cinza-medio dark:border-azul-light">
        <p className="text-cinza-escuro dark:text-cinza-medio">
          Carregando candidatos...
        </p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="text-center py-16 bg-white dark:bg-azul-light/20 rounded-2xl border border-dashed border-cinza-medio dark:border-azul-light">
        <p className="text-cinza-escuro dark:text-cinza-medio">{erro}</p>
      </div>
    );
  }

  if (candidatos.length < 2) {
    return (
      <div className="text-center py-16 bg-white dark:bg-azul-light/20 rounded-2xl border border-dashed border-cinza-medio dark:border-azul-light">
        <AlertCircle size={40} className="mx-auto text-cinza-escuro mb-3" />
        <p className="text-cinza-escuro dark:text-cinza-medio">
          Nao encontramos 2 candidatos validos nessa selecao. Volte ao seletor
          e escolha outros.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light/20">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="bg-azul text-white">
              <th className="p-4 text-left text-sm font-semibold w-48">
                Dado oficial
              </th>
              {candidatos.map((c) => (
                <th key={c.id} className="p-4 text-left align-top">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.foto}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border-2 border-verde"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-bold text-sm">{formatarNome(c.nome)}</p>
                      <p className="text-xs text-white/70">
                        {c.partido} · {c.numero ? `nº ${c.numero}` : "sem número"}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {CAMPOS.map((campo, i) => (
              <tr
                key={campo.rotulo}
                className={
                  i % 2 === 0
                    ? "bg-white dark:bg-transparent"
                    : "bg-cinza-claro dark:bg-azul-light/10"
                }
              >
                <td className="p-4 align-top border-t border-cinza-medio dark:border-azul-light font-semibold text-sm text-azul dark:text-white">
                  {campo.rotulo}
                </td>

                {candidatos.map((c) => {
                  const valor = campo.valor(c);
                  const vazio = valor === "—";

                  return (
                    <td
                      key={c.id}
                      className="p-4 align-top border-t border-cinza-medio dark:border-azul-light"
                    >
                      {vazio ? (
                        <span className="text-xs italic text-cinza-escuro/60">
                          nao informado
                        </span>
                      ) : (
                        <span
                          className={`text-sm ${
                            "destaque" in campo && campo.destaque
                              ? "text-2xl font-bold text-verde"
                              : "text-cinza-escuro dark:text-cinza-medio"
                          }`}
                        >
                          {valor}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Plano de governo: o unico material real de propostas */}
            <tr className="bg-cinza-claro dark:bg-azul-light/10">
              <td className="p-4 align-top border-t border-cinza-medio dark:border-azul-light font-semibold text-sm text-azul dark:text-white">
                Plano de governo
              </td>
              {candidatos.map((c) => (
                <td
                  key={c.id}
                  className="p-4 align-top border-t border-cinza-medio dark:border-azul-light"
                >
                  {c.planoGovernoUrl ? (
                    <a
                      href={c.planoGovernoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-verde hover:underline"
                    >
                      <FileText size={14} /> Abrir documento
                    </a>
                  ) : (
                    <span className="text-xs italic text-cinza-escuro/60">
                      nao registrado no TSE
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
        Todos os campos acima vem do registro oficial do TSE. As propostas de
        cada candidato sao publicadas pelo Tribunal em PDF: por isso, a
        comparacao aponta para o documento original em vez de resumir um texto
        que nao esta estruturado na base. Onde o TSE nao tem o dado, a celula
        fica vazia.
      </p>
    </div>
  );
}
