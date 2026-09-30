"use client";

import { useState } from "react";
import { FileText, ThumbsUp, ThumbsDown, Minus, Search } from "lucide-react";

interface Votacao {
  parlamentar: string;
  cargo: string;
  partido: string;
  votacoes: { pauta: string; voto: string; data: string }[];
}

const votacoes: Votacao[] = [
  {
    parlamentar: "Arthur Lira",
    cargo: "Deputado Federal",
    partido: "PP",
    votacoes: [
      { pauta: "Reforma Administrativa", voto: "Sim", data: "2026-08-15" },
      { pauta: "Marco Temporal", voto: "Não", data: "2026-07-20" },
      { pauta: "Reforma Tributária", voto: "Sim", data: "2026-06-10" },
      { pauta: "Lei de Licitações", voto: "Sim", data: "2026-05-05" },
    ],
  },
  {
    parlamentar: "Pacheco",
    cargo: "Senador",
    partido: "PSD",
    votacoes: [
      { pauta: "Reforma Administrativa", voto: "Sim", data: "2026-08-15" },
      { pauta: "Marco Temporal", voto: "Abstenção", data: "2026-07-20" },
      { pauta: "Reforma Tributária", voto: "Sim", data: "2026-06-10" },
      { pauta: "Lei de Licitações", voto: "Sim", data: "2026-05-05" },
    ],
  },
  {
    parlamentar: "Hugo Motta",
    cargo: "Deputado Federal",
    partido: "Republicanos",
    votacoes: [
      { pauta: "Reforma Administrativa", voto: "Sim", data: "2026-08-15" },
      { pauta: "Marco Temporal", voto: "Sim", data: "2026-07-20" },
      { pauta: "Reforma Tributária", voto: "Não", data: "2026-06-10" },
      { pauta: "Lei de Licitações", voto: "Sim", data: "2026-05-05" },
    ],
  },
  {
    parlamentar: "Davi Alcolumbre",
    cargo: "Senador",
    partido: "UNIÃO",
    votacoes: [
      { pauta: "Reforma Administrativa", voto: "Não", data: "2026-08-15" },
      { pauta: "Marco Temporal", voto: "Sim", data: "2026-07-20" },
      { pauta: "Reforma Tributária", voto: "Não", data: "2026-06-10" },
      { pauta: "Lei de Licitações", voto: "Não", data: "2026-05-05" },
    ],
  },
];

export default function HistoricoVotacaoPage() {
  const [busca, setBusca] = useState("");

  const votacoesFiltradas = votacoes.filter(
    (v) =>
      v.parlamentar.toLowerCase().includes(busca.toLowerCase()) ||
      v.partido.toLowerCase().includes(busca.toLowerCase())
  );

  function getVotoIcon(voto: string) {
    if (voto === "Sim") return <ThumbsUp size={16} className="text-verde" />;
    if (voto === "Não") return <ThumbsDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-cinza-medio" />;
  }

  function getVotoColor(voto: string) {
    if (voto === "Sim") return "text-verde";
    if (voto === "Não") return "text-red-500";
    return "text-cinza-medio";
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <FileText size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Ferramentas
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Histórico de Votação
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Como cada parlamentar votou nas principais pautas do Congresso Nacional.
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
          placeholder="Buscar parlamentar ou partido..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde"
        />
      </div>

      {/* Lista de parlamentares */}
      <div className="space-y-6">
        {votacoesFiltradas.map((parlamentar) => (
          <div
            key={parlamentar.parlamentar}
            className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl overflow-hidden"
          >
            {/* Cabeçalho do parlamentar */}
            <div className="p-4 bg-cinza-claro dark:bg-azul-light/30 border-b border-cinza-medio dark:border-azul-light">
              <h3 className="font-bold text-azul dark:text-white">
                {parlamentar.parlamentar}
              </h3>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                {parlamentar.cargo} · {parlamentar.partido}
              </p>
            </div>

            {/* Votações */}
            <div className="divide-y divide-cinza-medio dark:divide-azul-light">
              {parlamentar.votacoes.map((votacao) => (
                <div
                  key={votacao.pauta}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium text-azul dark:text-white">
                      {votacao.pauta}
                    </p>
                    <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                      {new Date(votacao.data).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getVotoIcon(votacao.voto)}
                    <span
                      className={`font-semibold ${getVotoColor(votacao.voto)}`}
                    >
                      {votacao.voto}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {votacoesFiltradas.length === 0 && (
        <div className="text-center py-12 text-cinza-escuro dark:text-cinza-medio">
          Nenhum parlamentar encontrado.
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <a href="/ferramentas" className="text-verde font-semibold hover:underline">
          ← Voltar para Ferramentas
        </a>
      </div>
    </div>
  );
}
