"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({
  placeholder = "Buscar candidatos, números, partidos, cargos...",
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-escuro pointer-events-none"
      />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-cinza-claro text-sm text-azul placeholder:text-cinza-escuro focus:outline-none focus:ring-2 focus:ring-verde dark:bg-azul-light dark:text-white dark:placeholder:text-cinza-medio transition-shadow"
      />
    </div>
  );
}