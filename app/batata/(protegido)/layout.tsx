import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/actions/auth";

export default async function ProtegidoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/batata/login");
  }

  return (
    <div className="min-h-screen bg-cinza-claro dark:bg-azul-dark">
      <nav className="bg-azul text-white p-4 flex justify-between items-center">
        <Link href="/batata" className="font-bold">
          Centro Político — Painel
        </Link>
        <div className="flex gap-4 items-center text-sm">
          <Link href="/" className="hover:underline">
            Ver site
          </Link>
          <Link href="/batata/noticias/nova" className="hover:underline">
            + Nova notícia
          </Link>
          <form action={logout}>
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
