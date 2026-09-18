"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GitCompare, Download, Share2 } from "lucide-react";
import { SeletorCandidatos } from "@/components/comparador/SeletorCandidatos";
import { TabelaComparativa } from "@/components/comparador/TabelaComparativa";

export function ComparadorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";

  const [selecionados, setSelecionados] = useState<string[]>([]);

  useEffect(() => {
    if (idsParam) {
      setSelecionados(idsParam.split(",").filter(Boolean));
    }
  }, [idsParam]);

  function handleChange(novos: string[]) {
    setSelecionados(novos);
    const query = novos.length > 0 ? `?ids=${novos.join(",")}` : "";
    router.replace(`/comparador${query}`, { scroll: false });
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <GitCompare size={20} />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Ferramenta
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Comparador de propostas
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-2xl">
          Escolha de 2 a 4 candidatos e veja lado a lado o que cada um propõe
          para Saúde, Educação, Economia, Segurança e outros temas.
        </p>
      </header>

      <section className="mb-8">
        <SeletorCandidatos
          selecionados={selecionados}
          onChange={handleChange}
          max={4}
        />
      </section>

      <section className="mb-8">
        <TabelaComparativa ids={selecionados} />
      </section>

      {selecionados.length >= 2 && (
        <section className="flex flex-wrap gap-3 justify-end">
          <button className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-azul dark:border-white text-azul dark:text-white hover:bg-azul hover:text-white dark:hover:bg-white dark:hover:text-azul font-semibold transition-colors">
            <Share2 size={18} /> Compartilhar
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors">
            <Download size={18} /> Baixar em PDF
          </button>
        </section>
      )}
    </div>
  );
}