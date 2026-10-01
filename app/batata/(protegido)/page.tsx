import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listarTodasNoticias } from "@/lib/noticias";

export default async function BatataDashboard() {
  const session = await getSession();
  if (!session) redirect("/batata/login");

  // Area administrativa: inclui rascunho e noticia ainda nao agendada.
  const noticias = await listarTodasNoticias();

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
            className="flex flex-wrap justify-between items-center gap-3 bg-white dark:bg-azul-light p-4 rounded-lg"
          >
            <div className="min-w-0">
              <div className="text-azul dark:text-white">{n.titulo}</div>
              {/* Mostra a data de publicação, que agora é editável no formulário.
                  Uma notícia agendada para o futuro aparece mesmo sem estar no ar. */}
              <div className="flex items-center gap-2 mt-1 text-xs text-cinza-escuro dark:text-cinza-medio">
                <time dateTime={new Date(n.createdAt).toISOString()}>
                  {new Date(n.createdAt).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
                {!n.publicado && (
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold">
                    Rascunho
                  </span>
                )}
              </div>
            </div>
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
