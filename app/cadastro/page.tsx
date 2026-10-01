import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessaoUsuario } from "@/lib/sessao-usuario";
import { FormularioCadastro } from "@/components/auth/FormularioCadastro";

export const metadata: Metadata = {
  title: "Criar conta",
  description:
    "Crie sua conta gratuita no Centro Político e salve os candidatos que voce quer acompanhar.",
};

export default async function CadastroPage() {
  const sessao = await getSessaoUsuario();
  if (sessao) redirect("/minha-conta");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* useSearchParams exige um limite de Suspense na borda */}
      <Suspense fallback={<div className="h-96" />}>
        <FormularioCadastro />
      </Suspense>
    </div>
  );
}
