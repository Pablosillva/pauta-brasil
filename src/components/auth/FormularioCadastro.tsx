"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, Lock, User, MapPin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Campo } from "@/components/ui/Campo";
import { acaoCadastrar, type EstadoForm } from "@/actions/usuario";
import { ufs } from "@/data/ufs";

const ESTADO_VAZIO: EstadoForm = {};

export function FormularioCadastro() {
  const [estado, enviar] = useActionState(acaoCadastrar, ESTADO_VAZIO);
  const [copiado, setCopiado] = useState(false);
  const [senha, setSenha] = useState("");

  const forcaSenha = (() => {
    if (!senha) return null;
    let pontos = 0;
    if (senha.length >= 8) pontos++;
    if (/[a-zA-Z]/.test(senha)) pontos++;
    if (/[0-9]/.test(senha)) pontos++;
    if (senha.length >= 12) pontos++;
    if (/[^a-zA-Z0-9]/.test(senha)) pontos++;
    return pontos;
  })();

  async function copiarLink() {
    if (!estado.linkDebug) return;
    await navigator.clipboard.writeText(estado.linkDebug);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-verde flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
          CP
        </div>
        <h1 className="text-3xl font-bold text-azul dark:text-white mb-2">
          Criar conta
        </h1>
        <p className="text-cinza-escuro dark:text-cinza-medio">
          Salve candidatos e acompanhe as pautas do seu interesse.
        </p>
      </div>

      {estado.sucesso ? (
        <div className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-8 space-y-5">
          <div className="p-4 rounded-lg bg-verde/10 border border-verde/30 text-verde-dark dark:text-verde-light text-sm flex items-start gap-3">
            <Check size={18} className="shrink-0 mt-0.5" />
            <span>{estado.sucesso}</span>
          </div>

          {estado.linkDebug && (
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 text-sm">
              <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Servidor de e-mail nao configurado
              </p>
              <p className="text-amber-700 dark:text-amber-300 text-xs mb-3">
                Configure <code>RESEND_API_KEY</code> no Vercel para o envio
                automatico. Enquanto isso, use o link abaixo:
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={estado.linkDebug}
                  className="flex-1 px-3 py-2 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-azul-dark text-xs text-azul dark:text-white"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  type="button"
                  onClick={copiarLink}
                  className="px-3 py-2 rounded bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1 hover:bg-amber-800"
                >
                  {copiado ? <Check size={12} /> : <Copy size={12} />}
                  {copiado ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>
          )}

          <Link
            href="/login"
            className="block w-full text-center px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
          >
            Ir para o login
          </Link>
        </div>
      ) : (
        <form
          action={enviar}
          className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-8 space-y-5"
        >
          {estado.erro && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
              {estado.erro}
            </div>
          )}

          <Campo
            label="Nome completo"
            name="nome"
            type="text"
            required
            autoComplete="name"
            placeholder="Como voce quer ser chamado"
            icone={<User size={18} />}
          />

          <Campo
            label="E-mail"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="seu@email.com"
            icone={<Mail size={18} />}
          />

          <div>
            <Campo
              label="Senha"
              name="senha"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Mínimo de 8 caracteres"
              icone={<Lock size={18} />}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              dica="Use pelo menos 8 caracteres, com letras e números."
            />
            {forcaSenha !== null && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-cinza-medio dark:bg-azul-light overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      forcaSenha <= 2
                        ? "bg-red-500 w-1/3"
                        : forcaSenha <= 3
                          ? "bg-amber-500 w-2/3"
                          : "bg-verde w-full"
                    }`}
                  />
                </div>
                <span className="text-xs text-cinza-escuro dark:text-cinza-medio">
                  {forcaSenha <= 2 ? "Fraca" : forcaSenha <= 3 ? "Media" : "Forte"}
                </span>
              </div>
            )}
          </div>

          <Campo
            label="Confirmar senha"
            name="confirmarSenha"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Repita a senha"
            icone={<Lock size={18} />}
          />

          <div>
            <label
              htmlFor="uf"
              className="block text-sm font-medium text-azul dark:text-white mb-2"
            >
              Seu estado <span className="font-normal text-cinza-medio">(opcional)</span>
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-medio pointer-events-none"
              />
              <select
                id="uf"
                name="uf"
                defaultValue=""
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
              >
                <option value="">Todos os estados</option>
                {ufs.map((u) => (
                  <option key={u.sigla} value={u.sigla}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
            Ao criar a conta voce concorda com os{" "}
            <Link href="/termos" className="text-verde hover:underline">
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link href="/privacidade" className="text-verde hover:underline">
              Politica de Privacidade
            </Link>
            .
          </p>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
          >
            Criar conta
          </button>
        </form>
      )}

      <p className="text-center text-sm text-cinza-escuro dark:text-cinza-medio mt-6">
        Ja tem uma conta?{" "}
        <Link href="/login" className="text-verde font-semibold hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
