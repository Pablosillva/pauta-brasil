"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Mail, Copy, Check, ArrowLeft } from "lucide-react";
import { Campo } from "@/components/ui/Campo";
import {
  acaoReenviarVerificacao,
  acaoSolicitarReset,
  type EstadoForm,
} from "@/actions/usuario";

const VAZIO: EstadoForm = {};

function BlocoLinkDebug({ link }: { link: string }) {
  const [copiado, setCopiado] = useState(false);

  return (
    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 text-sm">
      <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
        Servidor de e-mail nao configurado
      </p>
      <p className="text-amber-700 dark:text-amber-300 text-xs mb-3">
        Configure <code>RESEND_API_KEY</code> no Vercel. Enquanto isso, use o
        link abaixo:
      </p>
      <div className="flex gap-2">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 px-3 py-2 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-azul-dark text-xs text-azul dark:text-white"
        />
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(link);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2500);
          }}
          className="px-3 py-2 rounded bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1 hover:bg-amber-800"
        >
          {copiado ? <Check size={12} /> : <Copy size={12} />}
          {copiado ? "Copiado" : "Copiar"}
        </button>
      </div>
    </div>
  );
}

export function FormularioReenviarVerificacao() {
  const [estado, enviar] = useActionState(acaoReenviarVerificacao, VAZIO);

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-verde/15 flex items-center justify-center text-verde mx-auto mb-4">
          <Mail size={28} />
        </div>
        <h1 className="text-3xl font-bold text-azul dark:text-white mb-2">
          Confirmar e-mail
        </h1>
        <p className="text-cinza-escuro dark:text-cinza-medio">
          Nao recebeu o link? Informe o e-mail do cadastro e reenviamos.
        </p>
      </div>

      <form
        action={enviar}
        className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-8 space-y-5"
      >
        {estado.erro && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {estado.erro}
          </div>
        )}

        {estado.sucesso && (
          <div className="p-3 rounded-lg bg-verde/10 border border-verde/30 text-verde-dark dark:text-verde-light text-sm">
            {estado.sucesso}
          </div>
        )}

        <Campo
          label="E-mail cadastrado"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          icone={<Mail size={18} />}
        />

        <button
          type="submit"
          className="w-full px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
        >
          Reenviar link
        </button>
      </form>

      {estado.linkDebug && (
        <div className="mt-4">
          <BlocoLinkDebug link={estado.linkDebug} />
        </div>
      )}

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

export function FormularioRecuperarSenha() {
  const [estado, enviar] = useActionState(acaoSolicitarReset, VAZIO);

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-verde/15 flex items-center justify-center text-verde mx-auto mb-4">
          <Mail size={28} />
        </div>
        <h1 className="text-3xl font-bold text-azul dark:text-white mb-2">
          Recuperar senha
        </h1>
        <p className="text-cinza-escuro dark:text-cinza-medio">
          Enviamos um link seguro para voce criar uma nova senha.
        </p>
      </div>

      <form
        action={enviar}
        className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-8 space-y-5"
      >
        {estado.erro && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {estado.erro}
          </div>
        )}

        {estado.sucesso && (
          <div className="p-3 rounded-lg bg-verde/10 border border-verde/30 text-verde-dark dark:text-verde-light text-sm">
            {estado.sucesso}
          </div>
        )}

        <Campo
          label="E-mail cadastrado"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          icone={<Mail size={18} />}
        />

        <button
          type="submit"
          className="w-full px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
        >
          Enviar link de redefinicao
        </button>
      </form>

      {estado.linkDebug && (
        <div className="mt-4">
          <BlocoLinkDebug link={estado.linkDebug} />
        </div>
      )}

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
