"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import { MapaBrasil } from "@/components/mapa/MapaBrasil";
import { governadoresAtuais, nomesEstados } from "@/data/candidatos";

export function MapaDoPoder() {
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | null>(null);

  const norm = (id: string) => id.toLowerCase().replace(/^br[-_]?/, "");
  const estadoNormalizado = estadoSelecionado ? norm(estadoSelecionado) : null;

  const governador = estadoSelecionado
    ? Object.entries(governadoresAtuais).find(
        ([k]) => norm(k) === estadoNormalizado
      )?.[1]
    : undefined;

  const nomeEstado = estadoSelecionado
    ? Object.entries(nomesEstados).find(
        ([k]) => norm(k) === estadoNormalizado
      )?.[1] ?? estadoSelecionado.toUpperCase()
    : null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* Texto + info */}
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 text-verde text-sm font-semibold uppercase tracking-wider">
            <Crown size={16} />
            Mapa do poder
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-azul dark:text-white">
            Quem governa cada estado hoje?
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio">
            Clique em um estado e veja quem está no comando agora.
          </p>

          {/* Card do governador selecionado */}
          {nomeEstado && (
            <div className="mt-6 p-5 rounded-xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
              <p className="text-xs uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
                Governador(a) atual
              </p>
              <p className="text-xl font-bold text-azul dark:text-white">
                {nomeEstado}
              </p>
              {governador ? (
                <p className="text-sm text-verde font-semibold mt-1">
                  {governador}
                </p>
              ) : (
                <p className="text-sm text-cinza-escuro italic mt-1">
                  Informação em atualização
                </p>
              )}
            </div>
          )}
        </div>

        {/* Mapa */}
        <div className="max-w-xl mx-auto w-full">
          <MapaBrasil
            onEstadoClick={(id) => setEstadoSelecionado(id)}
            estadoSelecionado={estadoSelecionado}
          />
        </div>
      </div>
    </section>
  );
}