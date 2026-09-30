"use client";

import { useState } from "react";
import { Search, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function PatrimonioPage() {
  const [busca, setBusca] = useState("");

  const candidatos = [
    {
      nome: "Eros Barroso",
      cargo: "Deputado Estadual",
      estado: "AC",
      partido: "PODE",
      patrimonio2022: 150000,
      patrimonio2026: 320000,
    },
    {
      nome: "Cristiane de Souza",
      cargo: "Deputado Estadual",
      estado: "AC",
      partido: "CIDADANIA",
      patrimonio2022: 80000,
      patrimonio2026: 120000,
    },
    {
      nome: "Jean Gonçalves",
      cargo: "Deputado Federal",
      estado: "AC",
      partido: "SOLIDARIEDADE",
      patrimonio2022: 250000,
      patrimonio2026: 180000,
    },
    {
      nome: "Pricila Paulino",
      cargo: "Deputado Federal",
      estado: "AC",
      partido: "PRD",
      patrimonio2022: 500000,
      patrimonio2026: 750000,
    },
    {
      nome: "Marcio Bittar",
      cargo: "Senador",
      estado: "AC",
      partido: "PL",
      patrimonio2022: 1200000,
      patrimonio2026: 950000,
    },
  ];

  const candidatosFiltrados = candidatos.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.partido.toLowerCase().includes(busca.toLowerCase())
  );

  function formatCurrency(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(valor);
  }

  function getVariacao(atual: number, anterior: number) {
    const variacao = ((atual - anterior) / anterior) * 100;
    return variacao;
  }

  function getVariacaoColor(variacao: number) {
    if (variacao > 0) return "text-verde";
    if (variacao < 0) return "text-red-500";
    return "text-cinza-medio";
  }

  function getVariacaoIcon(variacao: number) {
    if (variacao > 0) return <TrendingUp size={16} className="text-verde" />;
    if (variacao < 0) return <TrendingDown size={16} className="text-red-500" />;
    return <DollarSign size={16} className="text-cinza-medio" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <DollarSign size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Ferramentas
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Análise de Patrimônio
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Veja a evolução patrimonial dos candidatos entre as eleições de 2022
          e 2026.
        </p>
      </header>

      {/* Busca */}
      <div className="relative mb-8">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-medio"
        />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar candidato ou partido..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde"
        />
      </div>

      {/* Lista de candidatos */}
      <div className="space-y-4">
        {candidatosFiltrados.map((candidato) => {
          const variacao = getVariacao(
            candidato.patrimonio2026,
            candidato.patrimonio2022
          );
          return (
            <div
              key={candidato.nome}
              className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-azul dark:text-white">
                    {candidato.nome}
                  </h3>
                  <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                    {candidato.cargo} · {candidato.estado} · {candidato.partido}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Patrimônio 2022 */}
                  <div className="text-right">
                    <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                      2022
                    </p>
                    <p className="font-semibold text-azul dark:text-white">
                      {formatCurrency(candidato.patrimonio2022)}
                    </p>
                  </div>

                  {/* Seta */}
                  <div className="text-cinza-medio">→</div>

                  {/* Patrimônio 2026 */}
                  <div className="text-right">
                    <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                      2026
                    </p>
                    <p className="font-semibold text-azul dark:text-white">
                      {formatCurrency(candidato.patrimonio2026)}
                    </p>
                  </div>

                  {/* Variação */}
                  <div className="text-right min-w-[80px]">
                    <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                      Variação
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                      {getVariacaoIcon(variacao)}
                      <span
                        className={`font-semibold ${getVariacaoColor(variacao)}`}
                      >
                        {variacao > 0 ? "+" : ""}
                        {variacao.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {candidatosFiltrados.length === 0 && (
        <div className="text-center py-12 text-cinza-escuro dark:text-cinza-medio">
          Nenhum candidato encontrado.
        </div>
      )}

      {/* Nota */}
      <div className="mt-8 p-4 rounded-xl bg-cinza-claro dark:bg-azul-light/20 text-sm text-cinza-escuro dark:text-cinza-medio">
        <strong>Fonte:</strong> Dados declarados ao TSE. O patrimônio inclui
        bens móveis e imóveis, aplicações financeiras, veículos e outros ativos.
        Valores atualizados em 1 de setembro de 2026.
      </div>

      <div className="mt-8 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <a href="/ferramentas" className="text-verde font-semibold hover:underline">
          ← Voltar para Ferramentas
        </a>
      </div>
    </div>
  );
}
