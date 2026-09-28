import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // O layout é compartilhado com /admin/login, então precisamos
  // deixar a página de login funcionar mesmo sem sessão.
  // O `redirect` acontece nas páginas internas, não aqui.

  return (
    <div className="min-h-screen bg-cinza-claro dark:bg-azul-dark">
      {session && (
        <nav className="bg-azul text-white p-4 flex justify-between items-center">
          <Link href="/admin" className="font-bold">
            Pauta Brasil Admin
          </Link>
          <div className="flex gap-4 items-center text-sm">
            <Link href="/" className="hover:underline">
              Ver site
            </Link>
            <Link href="/admin/noticias/nova" className="hover:underline">
              + Nova notícia
            </Link>
          </div>
        </nav>
      )}
      <main className={session ? "p-6" : ""}>{children}</main>
    </div>
  );
}