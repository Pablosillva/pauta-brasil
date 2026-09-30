import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listarNoticias } from "@/lib/noticias";

export default async function BatataDashboard() {
  const session = await getSession();
  if (!session) redirect("/batata/login");

  const noticias = await listarNoticias();

  return (
    <div>
      <h1 className="text-3xl font-bold text-azul dark:text-white mb-6">
        Notícias ({noticias.length})
      </h1>
      <Link
        href="/batata/noticias/nova"
        className="inline-block mb-6 px-4 py-2 bg-verde text-white rounded-lg hover:bg-verde-dark transition-colors"
      >
        + Criar nova notícia
      </Link>
      <div className="space-y-2">
        {noticias.map((n) => (
          <div
            key={n.slug}
            className="flex justify-between items-center bg-white dark:bg-azul-light p-4 rounded-lg"
          >
            <span className="text-azul dark:text-white">{n.titulo}</span>
            <Link
              href={`/batata/noticias/${n.slug}`}
              className="text-verde hover:underline"
            >
              Editar
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
