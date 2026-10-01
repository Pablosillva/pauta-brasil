"use client";

import { formatarNome } from "@/lib/nomes";

import { useEffect, useState } from "react";
import { X, GitCompare, Filter, Search } from "lucide-react";
import governadoresJson from "@/data/governadores.json";
import { getNomeEstado } from "@/data/candidatos";
import type { Candidato } from "@/data/candidatos";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FotoCandidato } from "@/components/ui/FotoCandidato";

interface CandidatoGovernador {
  partido: string;
}

const governadoresPorUf = governadoresJson as Record<
  string,
  CandidatoGovernador[]
>;

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

const ITENS_POR_PAGINA = 20;

export function PainelEstado({ estadoId, onClose }: PainelEstadoProps) {
  const [cargoAtivo, setCargoAtivo] = useState<Cargo>("Governador");
  const [filtroPartido, setFiltroPartido] = useState<string>("todos");
  const [filtroGenero, setFiltroGenero] = useState<string>("todos");
  const [ordenacao, setOrdenacao] = useState<"numero" | "nome" | "partido">(
    "numero"
  );
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const [candidatosTse, setCandidatosTse] = useState<Candidato[]>([]);
  /** UF cujos candidatos ja chegaram. Vazio enquanto nada foi carregado. */
  const [ufCarregada, setUfCarregada] = useState("");

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

  // Buscar candidatos do estado (ou BR para Presidente)
  useEffect(() => {
    if (!estadoId) return;

    const uf =
      cargoAtivo === "Presidente"
        ? "BR"
        : estadoId.replace(/^br-/, "").toUpperCase();

    let cancelado = false;

    (async () => {
      try {
        const resposta = await fetch(`/api/candidatos/${uf}`);
        const data: unknown = await resposta.json();

        if (cancelado) return;

        setCandidatosTse(Array.isArray(data) ? data : []);
        setUfCarregada(uf);
      } catch (erro) {
        console.error("Erro ao carregar candidatos:", erro);
        if (!cancelado) {
          setCandidatosTse([]);
          setUfCarregada(uf);
        }
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [estadoId, cargoAtivo]);

  if (!estadoId) return null;

  const nomeEstado = getNomeEstado(estadoId);
  /*
   * Quem disputa a vaga em 2026, lido do TSE. Nao mostramos quem governa hoje:
   * os candidatos a governador estao todos marcados como "Pre-candidato",
   * porque a eleicao ainda nao houve, e a antiga lista de governadores em
   * exercico cobria so 10 dos 27 estados, com partidos errados.
   */
  const disputaGovernador = (() => {
    const sigla = estadoId.replace(/^br[-_]?/i, "").toUpperCase();
    const lista = governadoresPorUf[sigla] ?? [];
    return {
      candidatos: lista.length,
      partidos: new Set(lista.map((c) => c.partido)).size,
    };
  })();

  const lista = Array.isArray(candidatosTse) ? candidatosTse : [];

  // Enquanto os dados da UF atual nao chegam, mostramos o carregamento.
  const ufAtual =
    cargoAtivo === "Presidente"
      ? "BR"
      : estadoId.replace(/^br-/, "").toUpperCase();

  const carregando = ufCarregada !== ufAtual;

  const candidatosFiltrados = lista
    .filter((c) => c.cargo === cargoAtivo)
    .filter((c) => filtroPartido === "todos" || c.partido === filtroPartido)
    .filter((c) => filtroGenero === "todos" || c.genero?.toUpperCase() === filtroGenero.toUpperCase())
    .filter(
      (c) =>
        busca.trim() === "" ||
        c.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (c.nomeUrna &&
          c.nomeUrna.toLowerCase().includes(busca.toLowerCase()))
    )
    .sort((a, b) => {
      if (ordenacao === "numero") {
        return a.numero.localeCompare(b.numero, "pt-BR", { numeric: true });
      }
      if (ordenacao === "nome") {
        return a.nome.localeCompare(b.nome, "pt-BR");
      }
      return a.partido.localeCompare(b.partido, "pt-BR");
    });

  const totalPaginas = Math.ceil(candidatosFiltrados.length / ITENS_POR_PAGINA);

  // Um filtro mais restritivo pode deixar a pagina atual fora do intervalo.
  const paginaAtual = Math.min(Math.max(1, pagina), Math.max(1, totalPaginas));
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const candidatosPaginados = candidatosFiltrados.slice(
    inicio,
    inicio + ITENS_POR_PAGINA
  );

  const partidosDisponiveis = Array.from(
    new Set(
      lista.filter((c) => c.cargo === cargoAtivo).map((c) => c.partido)
    )
  ).sort();

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
              {disputaGovernador.candidatos > 0 && (
                <p className="text-sm text-white/80 mt-1">
                  Disputa a governo em 2026:{" "}
                  <span className="font-semibold">
                    {disputaGovernador.candidatos} candidatos
                  </span>{" "}
                  em {disputaGovernador.partidos} partidos
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
        <div className="px-6 py-4 border-b border-cinza-medio dark:border-azul-light space-y-3">
          {/* Busca dentro do painel */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-escuro"
            />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full pl-9 pr-4 py-2 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-verde"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 items-center">
            <Filter size={16} className="text-cinza-escuro" />

            <select
              value={filtroPartido}
              onChange={(e) => setFiltroPartido(e.target.value)}
              className="text-sm px-3 py-1.5 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
            >
              <option value="todos">Todos os partidos</option>
              {partidosDisponiveis.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={filtroGenero}
              onChange={(e) => setFiltroGenero(e.target.value)}
              className="text-sm px-3 py-1.5 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
            >
              <option value="todos">Todos os gêneros</option>
              <option value="f">Feminino</option>
              <option value="m">Masculino</option>
            </select>

            <select
              value={ordenacao}
              onChange={(e) =>
                setOrdenacao(e.target.value as "numero" | "nome" | "partido")
              }
              className="text-sm px-3 py-1.5 rounded-md border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
            >
              <option value="numero">Ordenar por número</option>
              <option value="nome">Ordenar por nome</option>
              <option value="partido">Ordenar por partido</option>
            </select>
          </div>

          {/* Contador */}
          <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
            Mostrando {candidatosPaginados.length} de{" "}
            {candidatosFiltrados.length} candidatos
          </p>
        </div>

        {/* Lista de candidatos */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {carregando ? (
            <div className="text-center py-12 text-cinza-escuro dark:text-cinza-medio">
              <p className="text-sm">Carregando candidatos...</p>
            </div>
          ) : candidatosPaginados.length === 0 ? (
            <div className="text-center py-12 text-cinza-escuro dark:text-cinza-medio">
              <p className="text-sm">
                Nenhum candidato encontrado para{" "}
                <strong>{cargoAtivo}</strong> com os filtros atuais.
              </p>
            </div>
          ) : (
            candidatosPaginados.map((c) => (
              <article
                key={c.id}
                className="flex gap-4 p-4 rounded-xl border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-light/20 hover:border-verde transition-colors"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-cinza-medio dark:bg-azul-light flex-shrink-0">
                  <FotoCandidato
                    src={c.foto}
                    alt={`Foto de ${formatarNome(c.nome)}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-azul dark:text-white truncate">
                        {formatarNome(c.nome)}
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

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-2 px-6 py-3 border-t border-cinza-medio dark:border-azul-light">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              className="px-3 py-1.5 text-sm rounded-md border border-cinza-medio dark:border-azul-light disabled:opacity-40 hover:border-verde transition-colors"
            >
              ← Anterior
            </button>
            <span className="text-sm text-cinza-escuro dark:text-cinza-medio">
              Página {paginaAtual} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
              className="px-3 py-1.5 text-sm rounded-md border border-cinza-medio dark:border-azul-light disabled:opacity-40 hover:border-verde transition-colors"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* Rodapé do painel */}
        <footer className="px-6 py-4 border-t border-cinza-medio dark:border-azul-light bg-cinza-claro dark:bg-azul-light/30">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors">
            <GitCompare size={18} />
            Comparar candidatos deste estado
          </button>
        </footer>
      </aside>
    </>
  );
}
