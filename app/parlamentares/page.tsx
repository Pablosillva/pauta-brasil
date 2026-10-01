import type { Metadata } from "next";
import Link from "next/link";
import { Users, ArrowRight, KeyRound } from "lucide-react";
import { todosOsDeputados } from "@/lib/camara";
import { listarSenadores, temChaveSenado } from "@/lib/senado";
import { ListaParlamentares } from "@/components/parlamentares/ListaParlamentares";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Parlamentares",
  description:
    "Deputados federais e senadores em exercicio, com partido, estado, projetos propostos e como votaram no Congresso.",
  alternates: { canonical: "/parlamentares" },
};

export const revalidate = 3600;

export default async function ParlamentaresPage() {
  const [deputados, senadores] = await Promise.all([
    todosOsDeputados(),
    listarSenadores().catch(() => []),
  ]);

  // Sem a chave do Senado, a lista vem vazia: mostramos um recorte declarado.
  const temSenado = temChaveSenado() && senadores.length > 0;

  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Parlamentares", url: "/parlamentares" },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Users size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Congresso Nacional
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-4">
          Parlamentares
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio leading-relaxed max-w-3xl">
          Quem esta em mandato agora, com o registro oficial de cada casa
          legislativa. Abra a ficha para ver os projetos do parlamentar e como
          ele votou.
        </p>
      </header>

      {!temSenado && (
        <div className="mb-8 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <KeyRound
              size={20}
              className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
            />
            <div>
              <h2 className="font-bold text-azul dark:text-white mb-1">
                Lista restrita a Camara dos Deputados
              </h2>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
                A API do Senado exige uma chave gratuita para responder, e nao
                existe fonte federal unificada para deputados estaduais: cada
                assembleia publica os dados em um sistema proprio. Preferimos
                declarar o recorte a mostrar uma lista incompleta sem avisar.
              </p>
              <Link
                href="/metodologia"
                className="inline-flex items-center gap-1 text-sm text-verde font-semibold hover:underline mt-2"
              >
                Ver as limitacoes completas
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
      <ListaParlamentares deputados={deputados} senadores={senadores} />
    </div>
  );
}
