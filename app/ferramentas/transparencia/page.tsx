"use client";

import { useState } from "react";
import { Shield, Search, Download, ExternalLink } from "lucide-react";

export default function TransparenciaPage() {
  const [busca, setBusca] = useState("");

  const gastos = [
    {
      parlamentar: "Arthur Lira",
      partido: "PP",
      estado: "AL",
      emendas2026: 45000000,
      emendas2025: 38000000,
      area: "Infraestrutura",
    },
    {
      parlamentar: "Pacheco",
      partido: "PSD",
      estado: "MG",
      emendas2026: 32000000,
      emendas2025: 28000000,
      area: "Saúde",
    },
    {
      parlamentar: "Hugo Motta",
      partido: "Republicanos",
      estado: "PB",
      emendas2026: 28000000,
      emendas2025: 22000000,
      area: "Educação",
    },
    {
      parlamentar: "Davi Alcolumbre",
      partido: "UNIÃO",
      estado: "AP",
      emendas2026: 25000000,
      emendas2025: 20000000,
      area: "Infraestrutura",
    },
    {
      parlamentar: "Marcio Bittar",
      partido: "PL",
      estado: "AC",
      emendas2026: 18000000,
      emendas2025: 15000000,
      area: "Saúde",
    },
  ];

  const gastosFiltrados = gastos.filter(
    (g) =>
      g.parlamentar.toLowerCase().includes(busca.toLowerCase()) ||
      g.partido.toLowerCase().includes(busca.toLowerCase()) ||
      g.estado.toLowerCase().includes(busca.toLowerCase())
  );

  function formatCurrency(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(valor);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Shield size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Ferramentas
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Transparência
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Dados abertos de gastos públicos e emendas parlamentares. Acompanhe
          como cada parlamentar destina os recursos públicos.
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
          placeholder="Buscar parlamentar, partido ou estado..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde"
        />
      </div>

      {/* Lista de gastos */}
      <div className="space-y-4">
        {gastosFiltrados.map((gasto) => (
          <div
            key={gasto.parlamentar}
            className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-azul dark:text-white">
                  {gasto.parlamentar}
                </h3>
                <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                  {gasto.partido} · {gasto.estado} · {gasto.area}
                </p>
              </div>

              <div className="flex items-center gap-6">
                {/* Emendas 2025 */}
                <div className="text-right">
                  <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                    2025
                  </p>
                  <p className="font-semibold text-azul dark:text-white">
                    {formatCurrency(gasto.emendas2025)}
                  </p>
                </div>

                {/* Seta */}
                <div className="text-cinza-medio">→</div>

                {/* Emendas 2026 */}
                <div className="text-right">
                  <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                    2026
                  </p>
                  <p className="font-semibold text-verde">
                    {formatCurrency(gasto.emendas2026)}
                  </p>
                </div>

                {/* Variação */}
                <div className="text-right min-w-[80px]">
                  <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                    Variação
                  </p>
                  <span className="font-semibold text-verde">
                    +
                    {(
                      ((gasto.emendas2026 - gasto.emendas2025) /
                        gasto.emendas2025) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {gastosFiltrados.length === 0 && (
        <div className="text-center py-12 text-cinza-escuro dark:text-cinza-medio">
          Nenhum resultado encontrado.
        </div>
      )}

      {/* Ações */}
      <div className="mt-8 flex flex-wrap gap-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-verde text-white font-semibold hover:bg-verde-dark transition-colors">
          <Download size={18} />
          Exportar CSV
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white font-semibold hover:border-verde transition-colors">
          <ExternalLink size={18} />
          Dados abertos do TSE
        </button>
      </div>

      {/* Nota */}
      <div className="mt-8 p-4 rounded-xl bg-cinza-claro dark:bg-azul-light/20 text-sm text-cinza-escuro dark:text-cinza-medio">
        <strong>Fonte:</strong> Dados da Câmara dos Deputados e do Senado
        Federal. Emendas parlamentares individuais. Valores atualizados em 1 de
        setembro de 2026.
      </div>

      <div className="mt-8 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <a href="/ferramentas" className="text-verde font-semibold hover:underline">
          ← Voltar para Ferramentas
        </a>
      </div>
    </div>
  );
}
