import Link from "next/link";
import { Crown } from "lucide-react";
import { BotaoConta } from "@/components/layout/BotaoConta";
import { HeaderMobile } from "@/components/layout/HeaderMobile";
import { navItems } from "@/components/layout/nav";
import { SearchBar } from "@/components/ui/SearchBar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-cinza-medio dark:bg-azul-dark/95 dark:border-azul-light">
      {/* Faixa superior (apenas desktop) */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 text-xs border-b border-cinza-medio dark:border-azul-light">
        <span className="text-cinza-escuro dark:text-cinza-medio">
          Dados oficiais do TSE e da Câmara dos Deputados
        </span>
        <div className="flex items-center gap-4">
          <BotaoConta />
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
            CP
          </div>
          <span className="font-bold text-lg text-azul dark:text-white">
            Centro Político
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

        <HeaderMobile />
      </div>
    </header>
  );
}
