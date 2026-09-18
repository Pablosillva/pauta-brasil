"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({
  placeholder = "Buscar candidatos, números, partidos, cargos...",
}: SearchBarProps) {
  const [termo, setTermo] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = termo.trim();
    if (q.length === 0) return;
    router.push(`/busca?q=${encodeURIComponent(q)}`);
    setTermo("");
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-escuro pointer-events-none"
      />
      <input
        type="text"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-cinza-claro text-sm text-azul placeholder:text-cinza-escuro focus:outline-none focus:ring-2 focus:ring-verde dark:bg-azul-light dark:text-white dark:placeholder:text-cinza-medio transition-shadow"
      />
    </form>
  );
}