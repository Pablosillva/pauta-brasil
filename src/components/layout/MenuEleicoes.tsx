"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { eleicoes, navItems } from "@/components/layout/nav";

/**
 * Aba "Eleicoes" com submenu.
 *
 * Fecha ao clicar fora, ao pressionar Escape e ao ir para outra pagina,
 * para nao deixar o painel flutuando sobre o conteudo.
 */
export function MenuEleicoes() {
  const [aberto, setAberto] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    function aoClicarFora(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) {
        setAberto(false);
      }
    }

    function aoTeclar(event: KeyboardEvent) {
      if (event.key === "Escape") setAberto(false);
    }

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  return (
    <div ref={container} className="relative">
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
        aria-haspopup="true"
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md text-azul hover:bg-cinza-claro hover:text-verde dark:text-white dark:hover:bg-azul-light transition-colors"
      >
        Eleicoes
        <ChevronDown
          size={14}
          className={`transition-transform ${aberto ? "rotate-180" : ""}`}
        />
      </button>

      {aberto && (
        <div className="absolute left-0 top-full mt-1 w-72 rounded-xl bg-white dark:bg-azul-dark border border-cinza-medio dark:border-azul-light shadow-xl py-2 z-50">
          {eleicoes.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setAberto(false)}
              className="block px-4 py-2.5 hover:bg-cinza-claro dark:hover:bg-azul-light transition-colors"
            >
              <span className="block text-sm font-semibold text-azul dark:text-white">
                {item.label}
              </span>
              {item.descricao && (
                <span className="block text-xs text-cinza-escuro dark:text-cinza-medio">
                  {item.descricao}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/** Links simples, sem submenu. */
export function LinksNav() {
  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="px-3 py-2 text-sm font-medium rounded-md text-azul hover:bg-cinza-claro hover:text-verde dark:text-white dark:hover:bg-azul-light transition-colors whitespace-nowrap"
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
