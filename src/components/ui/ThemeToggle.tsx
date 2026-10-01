"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./Button";

/**
 * Alterna entre tema claro e escuro.
 *
 * O estado inicial e `null` de proposito: a preferencia so e conhecida no
 * navegador, e renderizar o icone errado antes da hidratacao causaria
 * divergencia entre o servidor e o cliente.
 */
export function ThemeToggle() {
  const [tema, setTema] = useState<"claro" | "escuro" | null>(null);

  useEffect(() => {
    const salvo = localStorage.getItem("theme");
    const prefereEscuro = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const escuro = salvo === "dark" || (!salvo && prefereEscuro);

    document.documentElement.classList.toggle("dark", escuro);

    // Le a preferencia gravada no navegador: o servidor nao tem acesso a ela,
    // entao o tema so pode ser resolvido depois da hidratacao.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTema(escuro ? "escuro" : "claro");
  }, []);

  function alternar() {
    const proximo = tema === "escuro" ? "claro" : "escuro";

    document.documentElement.classList.toggle("dark", proximo === "escuro");
    localStorage.setItem("theme", proximo);
    setTema(proximo);
  }

  const escuro = tema === "escuro";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={alternar}
      aria-label="Alternar tema"
      title={escuro ? "Modo claro" : "Modo escuro"}
    >
      {escuro ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
