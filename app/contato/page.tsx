"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Integrar com backend de envio de e-mail
    setSubmitted(true);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <MessageSquare size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Contato
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-4">
          Fale Conosco
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Encontrou um erro? Tem uma sugestão? Quer parcerias? Entre em contato.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Informações de contato */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
            <Mail size={24} className="text-verde mb-3" />
            <h3 className="font-bold text-azul dark:text-white mb-2">E-mail</h3>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
              Para dúvidas gerais e sugestões:
            </p>
            <a
              href="mailto:contato@pautabrasil.com.br"
              className="text-verde font-semibold hover:underline text-sm"
            >
              contato@pautabrasil.com.br
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
            <MessageSquare size={24} className="text-verde mb-3" />
            <h3 className="font-bold text-azul dark:text-white mb-2">
              Imprensa e Parcerias
            </h3>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
              Para parcerias comerciais e imprensa:
            </p>
            <a
              href="mailto:parcerias@pautabrasil.com.br"
              className="text-verde font-semibold hover:underline text-sm"
            >
              parcerias@pautabrasil.com.br
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-verde/10 border border-verde/30">
            <h3 className="font-bold text-azul dark:text-white mb-2">
              Resposta rápida
            </h3>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
              Respondemos em até 48 horas úteis. Para correções de dados, inclua
              o link da página e a informação correta.
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="md:col-span-2">
          {submitted ? (
            <div className="p-8 rounded-2xl bg-verde/10 border border-verde/30 text-center">
              <CheckCircle size={48} className="text-verde mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-azul dark:text-white mb-2">
                Mensagem enviada!
              </h2>
              <p className="text-cinza-escuro dark:text-cinza-medio">
                Obrigado pelo contato. Responderemos em breve.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ nome: "", email: "", assunto: "", mensagem: "" });
                }}
              >
                Enviar outra mensagem
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-8 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-azul dark:text-white mb-2"
                  >
                    Nome
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Seu nome"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-azul dark:text-white mb-2"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seu@email.com"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="assunto"
                  className="block text-sm font-medium text-azul dark:text-white mb-2"
                >
                  Assunto
                </label>
                <select
                  id="assunto"
                  value={form.assunto}
                  onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="erro">Encontrei um erro nos dados</option>
                  <option value="sugestao">Sugestão de melhoria</option>
                  <option value="parceria">Parceria comercial</option>
                  <option value="imprensa">Imprensa</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="mensagem"
                  className="block text-sm font-medium text-azul dark:text-white mb-2"
                >
                  Mensagem
                </label>
                <textarea
                  id="mensagem"
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  placeholder="Descreva sua mensagem..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde resize-none"
                />
              </div>

              <Button type="submit" className="w-full">
                <Send size={18} />
                Enviar mensagem
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <a href="/" className="text-verde font-semibold hover:underline">
          ← Voltar para a home
        </a>
      </div>
    </div>
  );
}
