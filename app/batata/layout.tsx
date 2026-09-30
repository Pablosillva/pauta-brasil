import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";

export default async function BatataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Não verificar sessão na página de login
  const isLoginPage = pathname.includes("/batata/login");

  if (!isLoginPage) {
    const session = await getSession();
    if (!session) {
      redirect("/batata/login");
    }
  }

  // Se estiver na página de login, não mostrar o layout protegido
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cinza-claro dark:bg-azul-dark">
      <nav className="bg-azul text-white p-4 flex justify-between items-center">
        <Link href="/batata" className="font-bold">
          Pauta Brasil - Batata
        </Link>
        <div className="flex gap-4 items-center text-sm">
          <Link href="/" className="hover:underline">
            Ver site
          </Link>
          <Link href="/batata/noticias/nova" className="hover:underline">
            + Nova notícia
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="hover:underline">
              Sair
            </button>
          </form>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
