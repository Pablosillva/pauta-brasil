"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Crown } from "lucide-react";

export default function RankingPage() {
  const [cargo, setCargo] = useState<"governadores" | "prefeitos" | "parlamentares">("governadores");

  const dados = {
    governadores: [
      { nome: "Romeu Zema", estado: "MG", partido: "Novo", aprovacao: 68, tendencia: "up" },
      { nome: "Ratinho Junior", estado: "PR", partido: "PSD", aprovacao: 65, tendencia: "up" },
      { nome: "Tarcísio de Freitas", estado: "SP", partido: "Republicanos", aprovacao: 62, tendencia: "down" },
      { nome: "Eduardo Leite", estado: "RS", partido: "PSDB", aprovacao: 58, tendencia: "up" },
      { nome: "Jerônimo Rodrigues", estado: "BA", partido: "PT", aprovacao: 55, tendencia: "stable" },
      { nome: "Cláudio Castro", estado: "RJ", partido: "PL", aprovacao: 45, tendencia: "down" },
    ],
    prefeitos: [
      { nome: "Ricardo Nunes", cidade: "SP", partido: "MDB", aprovacao: 61, tendencia: "up" },
      { nome: "Eduardo Paes", cidade: "RJ", partido: "PSD", aprovacao: 58, tendencia: "stable" },
      { nome: "Bruno Reis", cidade: "BH", partido: "PSDB", aprovacao: 55, tendencia: "up" },
      { nome: "Rafael Greca", cidade: "Curitiba", partido: "PSD", aprovacao: 52, tendencia: "down" },
      { nome: "João Doria", cidade: "São Paulo", partido: "PSDB", aprovacao: 48, tendencia: "stable" },
    ],
    parlamentares: [
      { nome: "Arthur Lira", cargo: "Deputado Federal", partido: "PP", aprovacao: 42, tendencia: "up" },
      { nome: "Pacheco", cargo: "Senador", partido: "PSD", aprovacao: 55, tendencia: "stable" },
      { nome: "Hugo Motta", cargo: "Deputado Federal", partido: "Republicanos", aprovacao: 38, tendencia: "up" },
      { nome: "Davi Alcolumbre", cargo: "Senador", partido: "UNIÃO", aprovacao: 35, tendencia: "down" },
    ],
  };

  const cargos = [
    { id: "governadores" as const, label: "Governadores" },
    { id: "prefeitos" as const, label: "Prefeitos" },
    { id: "parlamentares" as const, label: "Parlamentares" },
  ];

  function getTendenciaIcon(tendencia: string) {
    if (tendencia === "up") return <TrendingUp size={16} className="text-verde" />;
    if (tendencia === "down") return <TrendingDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-cinza-medio" />;
  }

  function getTendenciaLabel(tendencia: string) {
    if (tendencia === "up") return "Em alta";
    if (tendencia === "down") return "Em queda";
    return "Estável";
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <TrendingUp size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Ferramentas
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Ranking de Popularidade
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Aprovação de governadores, prefeitos e parlamentares. Atualizado
          mensalmente com base em pesquisas de opinião pública.
        </p>
      </header>

      {/* Filtro por cargo */}
      <div className="flex gap-2 mb-8">
        {cargos.map((c) => (
          <button
            key={c.id}
            onClick={() => setCargo(c.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              cargo === c.id
                ? "bg-verde text-white"
                : "bg-cinza-claro dark:bg-azul-light text-azul dark:text-white hover:bg-cinza-medio"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Lista de ranking */}
      <div className="space-y-4">
        {dados[cargo].map((item, index) => (
          <div
            key={item.nome}
            className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
          >
            {/* Posição */}
            <div className="w-10 h-10 rounded-full bg-azul dark:bg-azul-dark flex items-center justify-center text-white font-bold shrink-0">
              {index === 0 ? <Crown size={20} /> : index + 1}
            </div>

            {/* Nome e info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-azul dark:text-white truncate">
                {item.nome}
              </h3>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                {"estado" in item ? `${item.estado} · ` : ""}
                {"cidade" in item ? `${item.cidade} · ` : ""}
                {"cargo" in item ? `${item.cargo} · ` : ""}
                {item.partido}
              </p>
            </div>

            {/* Aprovação */}
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-azul dark:text-white">
                {item.aprovacao}%
              </div>
              <div className="flex items-center gap-1 text-xs text-cinza-escuro dark:text-cinza-medio">
                {getTendenciaIcon(item.tendencia)}
                {getTendenciaLabel(item.tendencia)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nota metodológica */}
      <div className="mt-8 p-4 rounded-xl bg-cinza-claro dark:bg-azul-light/20 text-sm text-cinza-escuro dark:text-cinza-medio">
        <strong>Metodologia:</strong> Os dados são baseados em pesquisas de
        opinião pública realizadas por institutos credenciados. A margem de
        erro é de ±3 pontos percentuais. Atualizado em 15 de setembro de 2026.
      </div>

      <div className="mt-8 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <a href="/ferramentas" className="text-verde font-semibold hover:underline">
          ← Voltar para Ferramentas
        </a>
      </div>
    </div>
  );
}
