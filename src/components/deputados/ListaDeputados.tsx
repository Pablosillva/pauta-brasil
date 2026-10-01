"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Deputado } from "@/lib/camara";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
];

export function ListaDeputados({ deputados }: { deputados: Deputado[] }) {
  const [busca, setBusca] = useState("");
  const [uf, setUf] = useState("");

  const partidos = useMemo(
    () => Array.from(new Set(deputados.map((d) => d.siglaPartido))).sort(),
    [deputados]
  );

  const [partido, setPartido] = useState("");

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return deputados.filter((d) => {
      if (uf && d.siglaUf !== uf) return false;
      if (partido && d.siglaPartido !== partido) return false;
      if (!termo) return true;
      return (
        d.nome.toLowerCase().includes(termo) ||
        d.siglaPartido.toLowerCase().includes(termo)
      );
    });
  }, [deputados, busca, uf, partido]);

  return (
    <div>
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
            placeholder="Buscar deputado..."
            aria-label="Buscar deputado"
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
        {filtrados.length} de {deputados.length} deputados
      </p>

      {filtrados.length === 0 ? (
        <div className="text-center py-14 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light">
          <p className="text-cinza-escuro dark:text-cinza-medio">
            Nenhum deputado encontrado com esses filtros.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((d) => (
            <a
              key={d.id}
              href={`/deputados/${d.id}`}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.urlFoto}
                alt=""
                loading="lazy"
                className="w-14 h-14 rounded-full object-cover bg-cinza-medio dark:bg-azul-light flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-azul dark:text-white truncate">
                  {d.nome}
                </p>
                <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                  {d.siglaPartido}/{d.siglaUf}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
