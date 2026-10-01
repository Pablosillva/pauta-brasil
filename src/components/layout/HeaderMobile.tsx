"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Crown, LogIn } from "lucide-react";
import { navMobile } from "@/components/layout/nav";
import { SearchBar } from "@/components/ui/SearchBar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/** Botao hamburguer + painel do menu em telas pequenas. */
export function HeaderMobile() {
  const [open, setOpen] = useState(false);

  // Fecha o menu ao voltar para desktop, evitando estado preso.
  useEffect(() => {
    const aoRedimensionar = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };
    window.addEventListener("resize", aoRedimensionar);
    return () => window.removeEventListener("resize", aoRedimensionar);
  }, []);

  // Bloqueia a rolagem do fundo enquanto o menu esta aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /*
   * Escape fecha o menu. Sem isso quem navega por teclado so sai do painel
   * clicando num link ou no botao, o que prende o foco numa camada que cobre
   * a tela inteira. Mesmo padrao ja usado nos submenus.
   */
  useEffect(() => {
    if (!open) return;

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [open]);

  return (
    <>
      <button
        className="xl:hidden text-azul dark:text-white p-2 -m-2"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="menu-mobile"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div
          id="menu-mobile"
          className="fixed inset-0 top-[64px] lg:top-[104px] xl:hidden z-40 overflow-y-auto border-t border-cinza-medio dark:border-azul-light px-4 py-4 space-y-5 bg-white dark:bg-azul-dark"
        >
          <SearchBar onSearch={() => setOpen(false)} />

          {navMobile.map((grupo) => (
            <nav key={grupo.titulo} className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio px-3 pb-1">
                {grupo.titulo}
              </span>
              {grupo.itens.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm font-medium rounded-md text-azul hover:bg-cinza-claro dark:text-white dark:hover:bg-azul-light transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ))}

          <div className="flex flex-col gap-2 pt-3 border-t border-cinza-medio dark:border-azul-light">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white font-semibold text-sm"
            >
              <LogIn size={16} /> Entrar
            </Link>
            <Link
              href="/premium"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold text-sm"
            >
              <Crown size={16} /> Assine Premium
            </Link>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-cinza-escuro dark:text-cinza-medio">
                Tema
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
