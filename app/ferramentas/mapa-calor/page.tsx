"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";

interface DadoEstado {
  estado: string;
  uf: string;
  aprovacao: number;
  tendencia: "up" | "down" | "stable";
}

const dados: DadoEstado[] = [
  { estado: "São Paulo", uf: "SP", aprovacao: 62, tendencia: "up" },
  { estado: "Rio de Janeiro", uf: "RJ", aprovacao: 45, tendencia: "down" },
  { estado: "Minas Gerais", uf: "MG", aprovacao: 68, tendencia: "up" },
  { estado: "Bahia", uf: "BA", aprovacao: 55, tendencia: "stable" },
  { estado: "Rio Grande do Sul", uf: "RS", aprovacao: 58, tendencia: "up" },
  { estado: "Paraná", uf: "PR", aprovacao: 65, tendencia: "up" },
  { estado: "Pernambuco", uf: "PE", aprovacao: 52, tendencia: "down" },
  { estado: "Ceará", uf: "CE", aprovacao: 60, tendencia: "up" },
  { estado: "Pará", uf: "PA", aprovacao: 48, tendencia: "stable" },
  { estado: "Santa Catarina", uf: "SC", aprovacao: 57, tendencia: "up" },
  { estado: "Goiás", uf: "GO", aprovacao: 54, tendencia: "down" },
  { estado: "Maranhão", uf: "MA", aprovacao: 42, tendencia: "down" },
];

export default function MapaCalorPage() {
  const [filtro, setFiltro] = useState<"todos" | "up" | "down" | "stable">("todos");

  const dadosFiltrados = dados.filter((d) => {
    if (filtro === "todos") return true;
    return d.tendencia === filtro;
  });

  function getCorAprovacao(valor: number) {
    if (valor >= 60) return "bg-verde";
    if (valor >= 50) return "bg-yellow-500";
    if (valor >= 40) return "bg-orange-500";
    return "bg-red-500";
  }

  function getTendenciaIcon(tendencia: string) {
    if (tendencia === "up") return <TrendingUp size={16} className="text-verde" />;
    if (tendencia === "down") return <TrendingDown size={16} className="text-red-500" />;
    return <span className="text-cinza-medio">—</span>;
  }

  function getTendenciaLabel(tendencia: string) {
    if (tendencia === "up") return "Em alta";
    if (tendencia === "down") return "Em queda";
    return "Estável";
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <BarChart3 size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Ferramentas
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Mapa de Calor Eleitoral
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Visualize a aprovação dos governadores por estado e identifique tendências.
        </p>
      </header>

      {/* Filtros */}
      <div className="flex gap-2 mb-8">
        {[
          { id: "todos", label: "Todos" },
          { id: "up", label: "Em alta" },
          { id: "down", label: "Em queda" },
          { id: "stable", label: "Estável" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id as typeof filtro)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === f.id
                ? "bg-verde text-white"
                : "bg-cinza-claro dark:bg-azul-light text-azul dark:text-white hover:bg-cinza-medio"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid de estados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {dadosFiltrados.map((dado) => (
          <div
            key={dado.uf}
            className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-5 hover:border-verde transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-azul dark:text-white">
                {dado.uf}
              </span>
              {getTendenciaIcon(dado.tendencia)}
            </div>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-3">
              {dado.estado}
            </p>
            <div className="relative h-3 bg-cinza-claro dark:bg-azul-light rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full ${getCorAprovacao(dado.aprovacao)}`}
                style={{ width: `${dado.aprovacao}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-azul dark:text-white">
                {dado.aprovacao}%
              </span>
              <span className="text-xs text-cinza-escuro dark:text-cinza-medio">
                {getTendenciaLabel(dado.tendencia)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="mt-8 p-4 rounded-xl bg-cinza-claro dark:bg-azul-light/20">
        <h3 className="font-semibold text-azul dark:text-white mb-3">Legenda</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-verde" />
            <span className="text-cinza-escuro dark:text-cinza-medio">60% ou mais</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span className="text-cinza-escuro dark:text-cinza-medio">50% a 59%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span className="text-cinza-escuro dark:text-cinza-medio">40% a 49%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-cinza-escuro dark:text-cinza-medio">Menos de 40%</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <a href="/ferramentas" className="text-verde font-semibold hover:underline">
          ← Voltar para Ferramentas
        </a>
      </div>
    </div>
  );
}
