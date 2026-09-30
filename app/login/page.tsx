"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Implementar autenticação com NextAuth
    alert("Autenticação em desenvolvimento. Use o painel /admin para acessar.");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-verde flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            PB
          </div>
          <h1 className="text-3xl font-bold text-azul dark:text-white mb-2">
            Entrar
          </h1>
          <p className="text-cinza-escuro dark:text-cinza-medio">
            Acesse sua conta para salvar candidatos e receber notificações.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-8 space-y-6"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-azul dark:text-white mb-2"
            >
              E-mail
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-medio"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-azul dark:text-white mb-2"
            >
              Senha
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-medio"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cinza-medio hover:text-azul dark:hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-cinza-escuro dark:text-cinza-medio">
              <input
                type="checkbox"
                className="rounded border-cinza-medio text-verde focus:ring-verde"
              />
              Lembrar de mim
            </label>
            <a
              href="#"
              className="text-verde hover:underline font-medium"
            >
              Esqueci a senha
            </a>
          </div>

          <Button type="submit" className="w-full">
            <LogIn size={18} />
            Entrar
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cinza-medio dark:border-azul-light" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-azul-dark text-cinza-medio">
                ou
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Continuar com Google
          </Button>
        </form>

        <p className="text-center text-sm text-cinza-escuro dark:text-cinza-medio mt-6">
          Não tem uma conta?{" "}
          <Link href="/premium" className="text-verde font-semibold hover:underline">
            Assine Premium
          </Link>
        </p>
      </div>
    </div>
  );
}
