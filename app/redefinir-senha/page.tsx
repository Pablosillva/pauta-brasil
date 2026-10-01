import type { Metadata } from "next";
import Link from "next/link";
import { FormularioRedefinirSenha } from "@/components/auth/FormularioRedefinirSenha";

export const metadata: Metadata = {
  title: "Criar nova senha",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function RedefinirSenhaPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-8 space-y-5">
          <h1 className="text-2xl font-bold text-azul dark:text-white">
            Link incompleto
          </h1>
          <p className="text-cinza-escuro dark:text-cinza-medio text-sm">
            Abra o link que enviamos por e-mail para redefinir sua senha.
          </p>
          <Link
            href="/recuperar-senha"
            className="block px-6 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <FormularioRedefinirSenha token={token} />
    </div>
  );
}
