import type { Metadata } from "next";
import { Users } from "lucide-react";
import { todosOsDeputados } from "@/lib/camara";
import { ListaDeputados } from "@/components/deputados/ListaDeputados";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Deputados federais",
  description:
    "Todos os deputados federais em exercicio, com partido, estado e link para o historico completo de votacoes. Dados da Camara dos Deputados.",
  alternates: { canonical: "/deputados" },
};

export const revalidate = 3600;

export default async function DeputadosPage() {
  const deputados = await todosOsDeputados();

  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Deputados", url: "/deputados" },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Users size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Congresso Nacional
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Deputados federais
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-3xl">
          {deputados.length > 0
            ? `${deputados.length} deputados em exercício. Abra a ficha de qualquer um para ver como ele votou nas pautas do Congresso.`
            : "Perfis dos deputados federais com histórico público de votações."}
        </p>
      </header>

      {deputados.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light">
          <p className="text-lg font-semibold text-azul dark:text-white mb-2">
            Nao foi possivel carregar a lista de deputados
          </p>
          <p className="text-cinza-escuro dark:text-cinza-medio">
            A API da Camara pode estar temporariamente indisponivel. Tente de
            novo em alguns minutos.
          </p>
        </div>
      ) : (
        <ListaDeputados deputados={deputados} />
      )}
    </div>
  );
}
