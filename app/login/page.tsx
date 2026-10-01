import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessaoUsuario } from "@/lib/sessao-usuario";
import { FormularioLogin } from "@/components/auth/FormularioLogin";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta do Centro Político.",
};

interface PageProps {
  searchParams: Promise<{ proximo?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { proximo } = await searchParams;
  const sessao = await getSessaoUsuario();

  if (sessao) {
    redirect(
      proximo && proximo.startsWith("/") && !proximo.startsWith("//")
        ? proximo
        : "/minha-conta"
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <FormularioLogin proximo={proximo} />
    </div>
  );
}
