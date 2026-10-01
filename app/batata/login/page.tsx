"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BatataLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/batata");
        router.refresh();
      } else {
        const data = await res.json();
        setErro(data.error || "Erro ao fazer login");
      }
    } catch {
      setErro("Erro ao fazer login");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cinza-claro dark:bg-azul-dark px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-verde flex items-center justify-center text-white font-bold text-lg">
              CP
            </div>
            <span className="font-bold text-2xl text-azul dark:text-white">
              Centro Político
            </span>
          </div>
          <h1 className="text-2xl font-bold text-azul dark:text-white mb-2">
            Acesso Restrito
          </h1>
          <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
            Faça login para gerenciar o conteúdo
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-azul-light p-8 rounded-2xl shadow-xl space-y-4"
        >
          {erro && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
              {erro}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-azul dark:text-white mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-dark bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-azul dark:text-white mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-cinza-medio dark:border-azul-dark bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full p-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors disabled:opacity-50"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-xs text-cinza-escuro dark:text-cinza-medio mt-6">
          Acesso restrito ao administrador do site
        </p>
      </div>
    </div>
  );
}
