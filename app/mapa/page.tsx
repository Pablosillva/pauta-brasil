"use client";

import { useState } from "react";
import { MapaBrasil } from "@/components/mapa/MapaBrasil";
import { PainelEstado } from "@/components/mapa/PainelEstado";
import { MapPin } from "lucide-react";

export default function MapaPage() {
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-cinza-claro dark:bg-azul-dark">
      {/* Cabeçalho da página */}
      <header className="bg-azul dark:bg-azul-dark text-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 text-verde-light mb-3">
            <MapPin size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Mapa Eleitoral
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">
            Explore o Brasil estado por estado
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Clique em qualquer estado para ver quem são os candidatos,
            governadores, senadores e deputados daquele território.
          </p>
        </div>
      </header>

      {/* Mapa + instruções */}
      <main className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Mapa */}
        <div className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-6 lg:p-10">
          <MapaBrasil
            onEstadoClick={(id) => setEstadoSelecionado(id)}
            estadoSelecionado={estadoSelecionado}
          />
        </div>

        {/* Legenda / instruções */}
        <aside className="space-y-5">
          <div className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-6">
            <h2 className="font-bold text-azul dark:text-white mb-3">
              Como usar
            </h2>
            <ol className="space-y-3 text-sm text-cinza-escuro dark:text-cinza-medio list-decimal list-inside">
              <li>Passe o mouse sobre um estado para destacá-lo</li>
              <li>Clique para abrir o painel de candidatos</li>
              <li>Navegue pelas abas: Presidente, Governador, Senador, Deputado Federal, Deputado Estadual</li>
              <li>Use os filtros para refinar por partido e gênero</li>
              <li>Clique em "Ver propostas" para abrir o perfil completo</li>
            </ol>
          </div>

          <div className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-6">
            <h2 className="font-bold text-azul dark:text-white mb-3">
              Legenda
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-azul-light" />
                <span className="text-cinza-escuro dark:text-cinza-medio">
                  Estado normal
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-verde-light" />
                <span className="text-cinza-escuro dark:text-cinza-medio">
                  Estado em foco
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-verde" />
                <span className="text-cinza-escuro dark:text-cinza-medio">
                  Estado selecionado
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Painel lateral */}
      <PainelEstado
        estadoId={estadoSelecionado}
        onClose={() => setEstadoSelecionado(null)}
      />
    </div>
  );
}