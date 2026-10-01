import type { Metadata } from "next";
import {
  FormularioReenviarVerificacao,
  FormularioRecuperarSenha,
} from "@/components/auth/FormulariosRecuperacao";

export const metadata: Metadata = {
  title: "Recuperar acesso",
  description:
    "Reenvie o link de confirmacao de e-mail ou redefina a senha da sua conta no Centro Político.",
  robots: { index: false, follow: true },
};

export default function RecuperarSenhaPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full grid lg:grid-cols-2 gap-8 max-w-4xl items-center">
        <div className="lg:col-span-2 text-center lg:mb-2">
          <h1 className="sr-only">Recuperar acesso</h1>
        </div>
        <FormularioReenviarVerificacao />
        <FormularioRecuperarSenha />
      </div>
    </div>
  );
}
