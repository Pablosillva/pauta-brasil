"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { Campo } from "@/components/ui/Campo";
import { acaoRedefinirSenha, type EstadoForm } from "@/actions/usuario";

const VAZIO: EstadoForm = {};

export function FormularioRedefinirSenha({ token }: { token: string }) {
  const [estado, enviar] = useActionState(acaoRedefinirSenha, VAZIO);

  if (estado.sucesso) {
    return (
      <div className="w-full max-w-md text-center bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-8 space-y-5">
        <CheckCircle2 size={40} className="text-verde mx-auto" />
        <h1 className="text-2xl font-bold text-azul dark:text-white">
          Senha alterada!
        </h1>
        <p className="text-cinza-escuro dark:text-cinza-medio text-sm">
          {estado.sucesso}
        </p>
        <Link
          href="/login"
          className="block px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
        >
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-verde/15 flex items-center justify-center text-verde mx-auto mb-4">
          <Lock size={28} />
        </div>
        <h1 className="text-3xl font-bold text-azul dark:text-white mb-2">
          Nova senha
        </h1>
        <p className="text-cinza-escuro dark:text-cinza-medio">
          Escolha uma senha com pelo menos 8 caracteres, letras e numeros.
        </p>
      </div>

      <form
        action={enviar}
        className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-8 space-y-5"
      >
        <input type="hidden" name="token" value={token} />

        {estado.erro && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {estado.erro}
          </div>
        )}

        <Campo
          label="Nova senha"
          name="senha"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Mínimo de 8 caracteres"
          icone={<Lock size={18} />}
        />

        <Campo
          label="Confirmar nova senha"
          name="confirmarSenha"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Repita a nova senha"
          icone={<Lock size={18} />}
        />

        <button
          type="submit"
          className="w-full px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
        >
          Salvar nova senha
        </button>
      </form>

      <p className="text-center mt-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors"
        >
          <ArrowLeft size={14} /> Voltar para o login
        </Link>
      </p>
    </div>
  );
}
