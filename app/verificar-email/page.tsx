import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, MailCheck } from "lucide-react";
import { verificarEmail } from "@/lib/usuarios";

export const metadata: Metadata = {
  title: "Confirmar e-mail",
  description: "Confirme seu e-mail para ativar sua conta no Centro Político.",
};

// A verificacao muda o estado no banco: nunca cachear.
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerificarEmailPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  let estado: "sucesso" | "invalido" | "sem-token" = "invalido";

  if (token) {
    const usuario = await verificarEmail(token);
    estado = usuario ? "sucesso" : "invalido";
  } else {
    estado = "sem-token";
  }

  const conteudo = {
    sucesso: {
      icone: <CheckCircle2 size={40} className="text-verde" />,
      titulo: "E-mail confirmado!",
      texto:
        "Sua conta foi ativada. Agora voce pode salvar candidatos e acompanhar as pautas do seu interesse.",
      cor: "text-verde",
    },
    invalido: {
      icone: <XCircle size={40} className="text-red-500" />,
      titulo: "Link invalido ou expirado",
      texto:
        "O link de confirmacao pode ter sido usado antes ou ter vencido (validade de 24 horas). Solicite um novo.",
      cor: "text-red-500",
    },
    "sem-token": {
      icone: <XCircle size={40} className="text-amber-500" />,
      titulo: "Link incompleto",
      texto: "Abra o e-mail que enviamos e clique no link de confirmacao.",
      cor: "text-amber-500",
    },
  }[estado];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-8 space-y-5">
        <div className="flex justify-center">{conteudo.icone}</div>

        <h1 className="text-2xl font-bold text-azul dark:text-white">
          {conteudo.titulo}
        </h1>

        <p className="text-cinza-escuro dark:text-cinza-medio text-sm leading-relaxed">
          {conteudo.texto}
        </p>

        <div className="flex flex-col gap-3 pt-2">
          {estado === "sucesso" ? (
            <Link
              href="/minha-conta"
              className="px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
            >
              Ir para minha conta
            </Link>
          ) : (
            <Link
              href="/recuperar-senha"
              className="px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors inline-flex items-center justify-center gap-2"
            >
              <MailCheck size={18} />
              Reenviar link de confirmacao
            </Link>
          )}

          <Link
            href="/"
            className="px-6 py-3 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white hover:bg-cinza-claro dark:hover:bg-azul-light transition-colors"
          >
            Voltar para a home
          </Link>
        </div>
      </div>
    </div>
  );
}
