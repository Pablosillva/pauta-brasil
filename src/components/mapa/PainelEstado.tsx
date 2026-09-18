"use client";

// import {
//   candidatos,
//   governadoresAtuais,
//   nomesEstados,
//   getNomeEstado,
//   getGovernador,
//   getCandidatosDoEstado,
// } from "@/data/candidatos";
import { useEffect, useState } from "react";
import { X, GitCompare, Filter } from "lucide-react";
import {
    getNomeEstado,
    getGovernador,
    getCandidatosDoEstado,
} from "@/data/candidatos";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CARGOS = [
    "Presidente",
    "Governador",
    "Senador",
    "Deputado Federal",
    "Deputado Estadual",
] as const;

type Cargo = (typeof CARGOS)[number];

interface PainelEstadoProps {
    estadoId: string | null;
    onClose: () => void;
}

export function PainelEstado({ estadoId, onClose }: PainelEstadoProps) {
    const [cargoAtivo, setCargoAtivo] = useState<Cargo>("Governador");
    const [filtroPartido, setFiltroPartido] = useState<string>("todos");
    const [filtroGenero, setFiltroGenero] = useState<string>("todos");

    // Fechar com ESC
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    // Bloquear scroll do body quando aberto
    useEffect(() => {
        if (estadoId) document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [estadoId]);

    if (!estadoId) return null;

    const nomeEstado = getNomeEstado(estadoId);
    const governador = getGovernador(estadoId);

    const candidatosFiltrados = getCandidatosDoEstado(estadoId)
        .filter((c) => c.cargo === cargoAtivo)
        .filter((c) => filtroPartido === "todos" || c.partido === filtroPartido)
        .filter((c) => filtroGenero === "todos" || c.genero === filtroGenero);

    const partidosDisponiveis = Array.from(
        new Set(
            getCandidatosDoEstado(estadoId)
                .filter((c) => c.cargo === cargoAtivo)
                .map((c) => c.partido)
        )
    );

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-in fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Painel */}
            <aside
                className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white dark:bg-azul-dark z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
                role="dialog"
                aria-labelledby="painel-titulo"
            >
                {/* Cabeçalho */}
                <header className="px-6 py-5 border-b border-cinza-medio dark:border-azul-light bg-azul text-white">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-white/60 mb-1">
                                Estado selecionado
                            </p>
                            <h2 id="painel-titulo" className="text-2xl font-bold">
                                {nomeEstado}
                            </h2>
                            {governador && (
                                <p className="text-sm text-white/80 mt-1">
                                    Governador atual: <span className="font-semibold">{governador}</span>
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            aria-label="Fechar painel"
                        >
                            <X size={22} />
                        </button>
                    </div>
                </header>

                {/* Abas de cargo */}
                <nav className="flex overflow-x-auto border-b border-cinza-medio dark:border-azul-light bg-cinza-claro dark:bg-azul-light/30">
                    {CARGOS.map((cargo) => (
                        <button
                            key={cargo}
                            onClick={() => setCargoAtivo(cargo)}
                            className={cn(
                                "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                                cargoAtivo === cargo
                                    ? "border-verde text-verde bg-white dark:bg-azul-dark"
                                    : "border-transparent text-cinza-escuro dark:text-cinza-medio hover:text-azul dark:hover:text-white"
                            )}
                        >
                            {cargo}
                        </button>
                    ))}
                </nav>

                {/* Filtros */}
                <div className="px-6 py-4 border-b border-cinza-medio dark:border-azul-light flex flex-wrap gap-3 items-center">
                    <Filter size={16} className="text-cinza-escuro" />
                    <select
                        value={filtroPartido}
                        onChange={(e) => setFiltroPartido(e.target.value)}
                        className="text-sm px-3 py-1.5 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
                    >
                        <option value="todos">Todos os partidos</option>
                        {partidosDisponiveis.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>

                    <select
                        value={filtroGenero}
                        onChange={(e) => setFiltroGenero(e.target.value)}
                        className="text-sm px-3 py-1.5 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
                    >
                        <option value="todos">Todos os gêneros</option>
                        <option value="F">Feminino</option>
                        <option value="M">Masculino</option>
                    </select>
                </div>

                {/* Lista de candidatos */}
<div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
  {candidatosFiltrados.length === 0 ? (
    <div className="text-center py-12 text-cinza-escuro dark:text-cinza-medio">
      <p className="text-sm">
        Nenhum candidato encontrado para{" "}
        <strong>{cargoAtivo}</strong> com os filtros atuais.
      </p>
    </div>
  ) : (
    candidatosFiltrados.map((c) => (
      <article
        key={c.id}
        className="flex gap-4 p-4 rounded-xl border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light/20 hover:border-verde transition-colors"
      >
        <img
          src={c.foto}
          alt={`Foto de ${c.nome}`}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-azul dark:text-white truncate">
                {c.nome}
              </h3>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                {c.partido} · Nº {c.numero}
              </p>
            </div>
            <span className="text-xs font-semibold text-verde bg-verde/10 px-2 py-1 rounded whitespace-nowrap">
              {c.status}
            </span>
          </div>
          <Link
            href={`/candidatos/${c.id}`}
            className="mt-2 inline-block text-sm font-semibold text-verde hover:text-verde-dark transition-colors"
          >
            Ver propostas →
          </Link>
        </div>
      </article>
    ))
  )}
</div>

{/* Rodapé do painel */}
<footer className="px-6 py-4 border-t border-cinza-medio dark:border-azul-light bg-cinza-claro dark:bg-azul-light/30">
  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors">
    <GitCompare size={18} />
    Comparar candidatos deste estado
  </button>
</footer>
        </aside >
        </>
    );
}