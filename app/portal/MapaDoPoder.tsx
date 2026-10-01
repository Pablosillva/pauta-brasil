"use client";

import Link from "next/link";

import { useState } from "react";
import { Crown, Users, Flag } from "lucide-react";
import { MapaBrasil } from "@/components/mapa/MapaBrasil";
import { nomesEstados } from "@/data/candidatos";
import { formatarNome } from "@/lib/nomes";
import governadores from "@/data/governadores.json";

interface CandidatoGovernador {
  id: string;
  nome: string;
  partido: string;
  numero: string;
}

const porUf = governadores as Record<string, CandidatoGovernador[]>;

/** Aceita "br-sp", "sp" e "SP" e devolve "SP". */
function uf(curto: string): string {
  return curto.replace(/^br[-_]?/i, "").toUpperCase();
}

export function MapaDoPoder() {
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | null>(null);

  const sigla = estadoSelecionado ? uf(estadoSelecionado) : null;
  const nomeEstado = sigla
    ? nomesEstados[`br-${sigla.toLowerCase()}`] ?? sigla
    : null;
  const candidatos = sigla ? (porUf[sigla] ?? []) : [];

  const partidos = new Set(candidatos.map((c) => c.partido)).size;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* Texto e detalhe */}
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 text-verde text-sm font-semibold uppercase tracking-wider">
            <Crown size={16} />
            Mapa da disputa
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-azul dark:text-white">
            Quem disputa governar cada estado
          </h2>
          <p className="text-cinza-escuro dark:text-cinza-medio">
            Clique em um estado e veja os candidatos a governador registrados
            pelo TSE para 2026.
          </p>

          {nomeEstado && (
            <div className="mt-6 p-5 rounded-xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <p className="text-xl font-bold text-azul dark:text-white">
                  {nomeEstado}
                </p>
                <span className="text-xs text-cinza-escuro dark:text-cinza-medio">
                  {candidatos.length} candidatos · {partidos} partidos
                </span>
              </div>

              {candidatos.length === 0 ? (
                <p className="text-sm text-cinza-escuro italic">
                  O TSE ainda não registra candidatos a governador para esta
                  unidade.
                </p>
              ) : (
                <ul className="space-y-1.5 max-h-72 overflow-y-auto">
                  {candidatos.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="w-9 shrink-0 text-center font-bold text-verde">
                        {c.numero}
                      </span>
                      <a
                        href={`/candidatos/${c.id}`}
                        className="text-azul dark:text-white hover:text-verde hover:underline truncate"
                      >
                        {formatarNome(c.nome)}
                      </a>
                      <span className="ml-auto shrink-0 text-xs px-2 py-0.5 rounded bg-azul/10 dark:bg-azul-light/30 text-azul dark:text-white font-semibold">
                        {c.partido}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/*
           * Por que esta tela mostra a disputa e não o occupant do cargo: os
           * candidatos a governador no TSE estão todos como "pré-candidato",
           * porque a eleição de 2026 ainda não houve. A antiga versão desta
           * tela afirmava quem governava hoje com base numa lista escrita à
           * mão, que cobria 10 dos 27 estados e trazia partidos errados.
           */}
          <p className="flex items-start gap-2 text-xs text-cinza-escuro dark:text-cinza-medio mt-4">
            <Flag size={14} className="text-verde shrink-0 mt-0.5" />
            <span>
              Mostramos a disputa de 2026, e não quem ocupa o cargo: o TSE
              ainda não consolidou o resultado.{" "}
              <Link
                href="/candidatos?cargo=Governador"
                className="text-verde font-semibold hover:underline"
              >
                Ver todos os candidatos
              </Link>
              .
            </span>
          </p>

          <p className="flex items-center gap-2 text-xs text-cinza-escuro dark:text-cinza-medio">
            <Users size={14} className="text-verde" />
            Fonte: TSE, eleições de 2026.
          </p>
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
