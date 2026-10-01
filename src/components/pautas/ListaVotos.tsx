"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { VotoDeputado } from "@/lib/camara";
import { rotuloVoto, type CorVoto } from "@/lib/camara";
import { CartaoDeputado } from "@/components/pautas/BadgeVotacao";

type Voto = "Sim" | "Não" | "Abstenção" | "Não registrado" | "todos";

/** Ordena por grupo de voto: Sim, Não, Abstenção, resto. */
const ORDEM: Record<string, number> = {
  Sim: 0,
  Não: 1,
  Abstenção: 2,
  "Não registrado": 3,
};

export function ListaVotos({ votos }: { votos: VotoDeputado[] }) {
  const [filtro, setFiltro] = useState<Voto>("todos");
  const [busca, setBusca] = useState("");

  const contagem = useMemo(() => {
    const mapa: Record<string, number> = {};
    for (const v of votos) {
      const { texto } = rotuloVoto(v.tipoVoto);
      mapa[texto] = (mapa[texto] ?? 0) + 1;
    }
    return mapa;
  }, [votos]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return votos
      .filter((v) => {
        if (filtro !== "todos" && rotuloVoto(v.tipoVoto).texto !== filtro) {
          return false;
        }
        if (!termo) return true;
        return (
          v.deputado.nome.toLowerCase().includes(termo) ||
          v.deputado.siglaPartido.toLowerCase().includes(termo) ||
          v.deputado.siglaUf.toLowerCase().includes(termo)
        );
      })
      .sort((a, b) => {
        const dif =
          (ORDEM[rotuloVoto(a.tipoVoto).texto] ?? 9) -
          (ORDEM[rotuloVoto(b.tipoVoto).texto] ?? 9);
        if (dif !== 0) return dif;
        return a.deputado.nome.localeCompare(b.deputado.nome, "pt-BR");
      });
  }, [votos, filtro, busca]);

  const abas: { chave: Voto; rotulo: string; cor: CorVoto | "todos" }[] = [
    { chave: "todos", rotulo: "Todos", cor: "todos" },
    { chave: "Sim", rotulo: "Sim", cor: "verde" },
    { chave: "Não", rotulo: "Não", cor: "vermelho" },
    { chave: "Abstenção", rotulo: "Abstenção", cor: "neutro" },
  ];

  const estiloAba: Record<string, string> = {
    todos: "bg-azul text-white",
    verde: "bg-verde text-white",
    vermelho: "bg-red-600 text-white",
    neutro: "bg-cinza-medio text-white",
  };

  return (
    <div>
      {/* Abas por tipo de voto */}
      <div className="flex flex-wrap gap-2 mb-5">
        {abas.map((aba) => {
          const total =
            aba.chave === "todos"
              ? votos.length
              : (contagem[aba.rotulo] ?? 0);

          const ativo = filtro === aba.chave;

          return (
            <button
              key={aba.chave}
              type="button"
              onClick={() => setFiltro(aba.chave)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                ativo
                  ? estiloAba[aba.cor]
                  : "bg-cinza-claro dark:bg-azul-light/20 text-azul dark:text-white hover:bg-cinza-medio/40"
              }`}
            >
              {aba.rotulo}{" "}
              <span className={ativo ? "opacity-80" : "opacity-60"}>({total})</span>
            </button>
          );
        })}
      </div>

      <div className="relative mb-5">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-medio"
        />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Filtrar por nome, partido ou estado..."
          aria-label="Filtrar votos"
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde"
        />
      </div>

      {filtrados.length === 0 ? (
        <p className="text-center py-12 text-cinza-escuro dark:text-cinza-medio">
          Nenhum deputado encontrado.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtrados.map((v) => (
            <CartaoDeputado
              key={v.deputado.id}
              deputado={v.deputado}
              voto={v.tipoVoto}
            />
          ))}
        </div>
      )}
    </div>
  );
}
