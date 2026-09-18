"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { MapaBrasil } from "../mapa/MapaBrasil";
import { PainelEstado } from "../mapa/PainelEstado";

export function Hero() {
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | null>(null);

  function handleEstadoClick(id: string, nome: string) {
    setEstadoSelecionado(id);
    console.log(`Clicou em ${nome} (${id})`);
  }

  return (
    <section className="relative bg-azul dark:bg-azul-dark text-white overflow-hidden">
      {/* Fundo decorativo */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,#009B3A_0%,transparent_50%),radial-gradient(circle_at_70%_80%,#00C44A_0%,transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Texto */}
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-verde/20 text-verde-light text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-verde-light animate-pulse" />
            Eleições 2026
          </span>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            Clique em um estado e descubra{" "}
            <span className="text-verde-light">quem disputa o poder</span> por
            lá
          </h1>

          <p className="text-lg text-white/80 max-w-xl">
            Conheça os candidatos, compare propostas, acompanhe as eleições e
            fique por dentro de tudo sobre o cenário político do Brasil.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark font-semibold transition-colors"
            >
              <MapPin size={18} />
              Explorar o mapa
            </Link>
            <Link
              href="/candidatos"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 hover:bg-white hover:text-azul font-semibold transition-colors"
            >
              Ver candidatos
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-verde" />
              Presidente
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-verde-light" />
              Governadores
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-azul-light" />
              Senadores
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cinza-medio" />
              Deputados
            </span>
          </div>
        </div>

        {/* Mapa interativo */}
        <div className="relative max-w-xl mx-auto w-full">
          <MapaBrasil
            onEstadoClick={handleEstadoClick}
            estadoSelecionado={estadoSelecionado}
          />
        </div>
      </div>

      {/* ⭐ Painel lateral — a peça que estava faltando! */}
      <PainelEstado
        estadoId={estadoSelecionado}
        onClose={() => setEstadoSelecionado(null)}
      />
    </section>
  );
}