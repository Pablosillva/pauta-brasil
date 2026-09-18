"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, Crown } from "lucide-react";
import { Button } from "../ui/Button";
import { SearchBar } from "../ui/SearchBar";
import { ThemeToggle } from "../ui/ThemeToggle";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Portal", href: "/portal" },
  { label: "Mapa Eleitoral", href: "/mapa" },
  { label: "Candidatos", href: "/candidatos" },
  { label: "Planos de Governo", href: "/planos" },
  { label: "Notícias", href: "/noticias" },
  { label: "Ferramentas", href: "/ferramentas" },
  { label: "Comparador", href: "/comparador" },
  { label: "Sobre", href: "/sobre" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-cinza-medio dark:bg-azul-dark/95 dark:border-azul-light">
      {/* Faixa superior (apenas desktop) */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 text-xs border-b border-cinza-medio dark:border-azul-light">
        <span className="text-cinza-escuro">
          Informação, transparência e democracia
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-1 text-azul dark:text-white hover:text-verde transition-colors"
          >
            <User size={14} /> Entrar
          </Link>
          <Link
            href="/premium"
            className="flex items-center gap-1 font-semibold text-verde hover:text-verde-dark transition-colors"
          >
            <Crown size={14} /> Assine Premium
          </Link>
        </div>
      </div>

      {/* Faixa principal */}
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-verde flex items-center justify-center text-white font-bold text-sm">
            PB
          </div>
          <span className="font-bold text-lg text-azul dark:text-white">
            Pauta Brasil
          </span>
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium rounded-md text-azul hover:bg-cinza-claro hover:text-verde dark:text-white dark:hover:bg-azul-light transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Ações desktop */}
        <div className="hidden lg:flex items-center gap-3 flex-1 justify-end max-w-md">
          <SearchBar />
          <ThemeToggle />
        </div>

        {/* Botão hamburguer (mobile/tablet) */}
        <button
          className="xl:hidden text-azul dark:text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="xl:hidden border-t border-cinza-medio dark:border-azul-light px-4 py-4 space-y-4 bg-white dark:bg-azul-dark">
          <SearchBar />
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
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
          <div className="flex items-center justify-between pt-3 border-t border-cinza-medio dark:border-azul-light">
            <ThemeToggle />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
              <Button size="sm">Assine Premium</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}