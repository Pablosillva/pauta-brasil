"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Building2, Landmark } from "lucide-react";
import type { Deputado } from "@/lib/camara";
import type { Senador } from "@/lib/senado";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
];

type Casa = "camara" | "senado";

/**
 * Deputado (Camara) e Senador usam nomes de campo diferentes. Esta funcao
 * reduz os dois a um formato unico, evitando repetir a logica em cada filtro.
 */
function normalizarParlamentar(p: Deputado | Senador): {
  nome: string;
  sigla: string;
  estado: string;
  ehSenador: boolean;
} {
  if ("codigo" in p) {
    return { nome: p.nome, sigla: p.partido, estado: p.uf, ehSenador: true };
  }

  return {
    nome: p.nome,
    sigla: p.siglaPartido,
    estado: p.siglaUf,
    ehSenador: false,
  };
}

interface ListaParlamentaresProps {
  deputados: Deputado[];
  senadores: Senador[];
}

export function ListaParlamentares({
  deputados,
  senadores,
}: ListaParlamentaresProps) {
  const [casa, setCasa] = useState<Casa>("camara");
  const [busca, setBusca] = useState("");
  const [uf, setUf] = useState("");

  const lista = casa === "camara" ? deputados : senadores;

  const partidos = useMemo(() => {
    const siglas =
      casa === "camara"
        ? deputados.map((d) => d.siglaPartido)
        : senadores.map((s) => s.partido);
    return Array.from(new Set(siglas)).sort();
  }, [casa, deputados, senadores]);

  const [partido, setPartido] = useState("");

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return lista.filter((p) => {
      // `p` e Deputado ou Senador: os campos tem nomes diferentes, mas a
      // logica de filtro e a mesma.
      const { nome, sigla, estado } = normalizarParlamentar(p);

      if (uf && estado !== uf) return false;
      if (partido && sigla !== partido) return false;
      if (!termo) return true;

      return (
        nome.toLowerCase().includes(termo) ||
        sigla.toLowerCase().includes(termo)
      );
    });
  }, [lista, busca, uf, partido]);

  function trocarCasa(nova: Casa) {
    setCasa(nova);
    setBusca("");
    setUf("");
    setPartido("");
  }

  return (
    <div>
      {/* Abas por casa legislativa */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => trocarCasa("camara")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            casa === "camara"
              ? "bg-azul text-white"
              : "bg-cinza-claro dark:bg-azul-light/20 text-azul dark:text-white hover:bg-cinza-medio/40"
          }`}
        >
          <Building2 size={16} />
          Camara dos Deputados
          <span className={casa === "camara" ? "opacity-80" : "opacity-60"}>
            ({deputados.length})
          </span>
        </button>

        <button
          type="button"
          onClick={() => trocarCasa("senado")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            casa === "senado"
              ? "bg-azul text-white"
              : "bg-cinza-claro dark:bg-azul-light/20 text-azul dark:text-white hover:bg-cinza-medio/40"
          }`}
        >
          <Landmark size={16} />
          Senado Federal
          <span className={casa === "senado" ? "opacity-80" : "opacity-60"}>
            ({senadores.length})
          </span>
        </button>
      </div>

      {casa === "senado" && senadores.length === 0 ? (
        <div className="p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light text-center">
          <p className="font-semibold text-azul dark:text-white mb-2">
            Lista do Senado indisponivel
          </p>
          <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
            A API do Senado exige uma chave gratuita. Sem ela, nao publicamos
            uma lista de senadores incompleta ou estimada.
          </p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-medio"
              />
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar parlamentar..."
                aria-label="Buscar parlamentar"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde"
              />
            </div>

            <select
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              aria-label="Filtrar por estado"
              className="px-3 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
            >
              <option value="">Todos os estados</option>
              {UFS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            <select
              value={partido}
              onChange={(e) => setPartido(e.target.value)}
              aria-label="Filtrar por partido"
              className="px-3 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
            >
              <option value="">Todos os partidos</option>
              {partidos.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-4">
            {filtrados.length} de {lista.length} parlamentares
          </p>

          {filtrados.length === 0 ? (
            <div className="text-center py-14 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light">
              <p className="text-cinza-escuro dark:text-cinza-medio">
                Nenhum parlamentar encontrado com esses filtros.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtrados.map((p) => {
                const { nome, sigla, estado, ehSenador } = normalizarParlamentar(p);
                const href = ehSenador
                  ? `/parlamentares/senado/${(p as Senador).codigo}`
                  : `/deputados/${(p as Deputado).id}`;
                const foto = ehSenador ? (p as Senador).foto : (p as Deputado).urlFoto;
                const chave = ehSenador
                  ? `s-${(p as Senador).codigo}`
                  : `d-${(p as Deputado).id}`;

                return (
                  <Link
                    key={chave}
                    href={href}
                    className="group bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-5 hover:border-verde hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-cinza-medio dark:bg-azul-light overflow-hidden flex-shrink-0">
                        {foto ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={foto}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-verde text-xl">
                            {nome.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-azul dark:text-white truncate group-hover:text-verde transition-colors">
                          {nome}
                        </h3>
                        <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                          {sigla}/{estado}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-1 rounded bg-cinza-claro dark:bg-azul-light/20 text-cinza-escuro dark:text-cinza-medio font-semibold">
                        {ehSenador ? "Senador" : "Deputado federal"}
                      </span>
                      <span className="text-verde font-semibold">
                        Ver ficha
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
