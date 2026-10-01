"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { Campo } from "@/components/ui/Campo";
import { acaoLogin, type EstadoForm } from "@/actions/usuario";

const ESTADO_VAZIO: EstadoForm = {};

interface FormularioLoginProps {
  proximo?: string;
  cadastroBloqueado?: boolean;
}

export function FormularioLogin({
  proximo = "/minha-conta",
  cadastroBloqueado = false,
}: FormularioLoginProps) {
  const [estado, enviar] = useActionState(acaoLogin, ESTADO_VAZIO);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-verde flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
          CP
        </div>
        <h1 className="text-3xl font-bold text-azul dark:text-white mb-2">
          Entrar
        </h1>
        <p className="text-cinza-escuro dark:text-cinza-medio">
          Acesse sua conta para ver seus candidatos salvos.
        </p>
      </div>

      <form
        action={enviar}
        className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-8 space-y-5"
      >
        {estado.erro && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {estado.erro}
            {estado.erro.includes("Confirme seu e-mail") && (
              <Link
                href="/recuperar-senha"
                className="block mt-2 font-semibold underline"
              >
                Reenviar link de confirmacao
              </Link>
            )}
          </div>
        )}

        <input type="hidden" name="proximo" value={proximo} />

        <Campo
          label="E-mail"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          icone={<Mail size={18} />}
        />

        <Campo
          label="Senha"
          name="senha"
          type={mostrarSenha ? "text" : "password"}
          required
          autoComplete="current-password"
          placeholder="Sua senha"
          icone={<Lock size={18} />}
          acessorio={
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="text-cinza-medio hover:text-azul dark:hover:text-white"
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-sm">
          <Link
            href="/recuperar-senha"
            className="text-verde hover:underline font-medium"
          >
            Esqueci a senha
          </Link>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors inline-flex items-center justify-center gap-2"
        >
          <LogIn size={18} />
          Entrar
        </button>
      </form>

      {cadastroBloqueado ? (
        <p className="text-center text-sm text-cinza-escuro dark:text-cinza-medio mt-6">
          Ainda nao tem conta?{" "}
          <Link href="/cadastro" className="text-verde font-semibold hover:underline">
            Criar agora
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-cinza-escuro dark:text-cinza-medio mt-6">
          Quer conhecer o Premium?{" "}
          <Link href="/premium" className="text-verde font-semibold hover:underline">
            Ver planos
          </Link>
        </p>
      )}
    </div>
  );
}
