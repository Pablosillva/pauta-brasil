import Link from "next/link";
import { getSessaoUsuario } from "@/lib/sessao-usuario";

/**
 * Botao "Entrar" / "Minha conta" da faixa superior.
 * E um Server Component: le o cookie e decide o que renderizar.
 */
export async function BotaoConta() {
  const sessao = await getSessaoUsuario();

  if (sessao) {
    return (
      <Link
        href="/minha-conta"
        className="flex items-center gap-1 text-azul dark:text-white hover:text-verde transition-colors font-medium"
      >
        {sessao.nome.split(" ")[0]}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-1 text-azul dark:text-white hover:text-verde transition-colors"
    >
      Entrar
    </Link>
  );
}
