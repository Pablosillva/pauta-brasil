"use client";

import { useState } from "react";
import { FileText, Download, Plus, X, Printer } from "lucide-react";
import { candidatos, nomesEstados, type Candidato } from "@/data/candidatos";

const ORDEM_VOTACAO = [
  { cargo: "Deputado Federal", digitos: 4 },
  { cargo: "Deputado Estadual", digitos: 5 },
  { cargo: "Senador (1ª vaga)", digitos: 3 },
  { cargo: "Senador (2ª vaga)", digitos: 3 },
  { cargo: "Governador", digitos: 2 },
  { cargo: "Presidente", digitos: 2 },
];

export default function ColinhaPage() {
  const [selecionados, setSelecionados] = useState<Record<string, Candidato | null>>({
    "Deputado Federal": null,
    "Deputado Estadual": null,
    "Senador (1ª vaga)": null,
    "Senador (2ª vaga)": null,
    "Governador": null,
    "Presidente": null,
  });

  const [busca, setBusca] = useState("");
  const [cargoAtual, setCargoAtual] = useState<string | null>(null);

  const candidatosFiltrados = candidatos
    .filter((c) => {
      if (!busca.trim()) return true;
      return (
        c.nome.toLowerCase().includes(busca.toLowerCase()) ||
        c.partido.toLowerCase().includes(busca.toLowerCase()) ||
        c.numero.includes(busca)
      );
    })
    .slice(0, 10);

  function selecionarCandidato(cargo: string, candidato: Candidato) {
    setSelecionados((prev) => ({ ...prev, [cargo]: candidato }));
    setCargoAtual(null);
    setBusca("");
  }

  function removerCandidato(cargo: string) {
    setSelecionados((prev) => ({ ...prev, [cargo]: null }));
  }

  function limparTudo() {
    setSelecionados({
      "Deputado Federal": null,
      "Deputado Estadual": null,
      "Senador (1ª vaga)": null,
      "Senador (2ª vaga)": null,
      "Governador": null,
      "Presidente": null,
    });
  }

  function imprimir() {
    window.print();
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
          Colinha Eleitoral Digital
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Monte sua colinha com os números dos seus candidatos para as eleições de 2026.
        </p>
      </header>

      {/* Ordem de votação */}
      <div className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-6 mb-8">
        <h2 className="text-xl font-bold text-azul dark:text-white mb-4">
          Ordem de votação na urna
        </h2>
        <div className="space-y-3">
          {ORDEM_VOTACAO.map((item, index) => {
            const selecionado = selecionados[item.cargo];
            return (
              <div
                key={item.cargo}
                className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-cinza-claro dark:bg-azul-light/30"
              >
                <div className="w-8 h-8 rounded-full bg-verde flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-azul dark:text-white">
                    {item.cargo}
                  </p>
                  <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                    {item.digitos} dígitos
                  </p>
                </div>
                {selecionado ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-azul dark:text-white">
                        {selecionado.nome}
                      </p>
                      <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                        {selecionado.partido} · Nº {selecionado.numero}
                      </p>
                    </div>
                    <button
                      onClick={() => removerCandidato(item.cargo)}
                      className="p-1 rounded-md hover:bg-cinza-medio dark:hover:bg-azul-light transition-colors"
                    >
                      <X size={16} className="text-cinza-escuro" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setCargoAtual(item.cargo)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cinza-medio dark:border-azul-light text-sm text-cinza-escuro dark:text-cinza-medio hover:border-verde hover:text-verde transition-colors"
                  >
                    <Plus size={14} />
                    Adicionar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Busca de candidatos */}
      {cargoAtual && (
        <div className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-6 mb-8">
          <h3 className="text-lg font-bold text-azul dark:text-white mb-4">
            Selecionar candidato para: {cargoAtual}
          </h3>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, partido ou número..."
            className="w-full px-4 py-2.5 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-verde mb-4"
          />
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {candidatosFiltrados.map((c) => (
              <button
                key={c.id}
                onClick={() => selecionarCandidato(cargoAtual, c)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-cinza-claro dark:hover:bg-azul-light transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-cinza-medio dark:bg-azul-light overflow-hidden flex-shrink-0">
                  <img
                    src={c.foto}
                    alt={c.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-azul dark:text-white truncate">
                    {c.nome}
                  </p>
                  <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                    {c.cargo} · {c.partido} · Nº {c.numero}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-wrap gap-3 justify-end">
        <button
          onClick={limparTudo}
          className="px-5 py-2.5 rounded-lg border border-cinza-medio dark:border-azul-light text-cinza-escuro dark:text-cinza-medio hover:border-red-500 hover:text-red-500 font-semibold transition-colors"
        >
          Limpar tudo
        </button>
        <button
          onClick={imprimir}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
        >
          <Printer size={18} />
          Imprimir colinha
        </button>
      </div>

      {/* Nota */}
      <div className="mt-8 p-4 rounded-xl bg-cinza-claro dark:bg-azul-light/20 text-sm text-cinza-escuro dark:text-cinza-medio">
        <strong>Importante:</strong> A colinha eleitoral é permitida em papel. Você pode
        imprimir esta página e levar para a cabine de votação. Não é permitido o uso de
        celulares ou outros aparelhos eletrônicos na cabine.
      </div>
    </div>
  );
}
