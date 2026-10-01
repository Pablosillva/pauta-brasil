import type { Metadata } from "next";
import Link from "next/link";
import { Users, ArrowRight, Info } from "lucide-react";
import { todosOsDeputados } from "@/lib/camara";
import { obterSenadores } from "@/lib/senado";
import { ListaParlamentares } from "@/components/parlamentares/ListaParlamentares";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Parlamentares",
  description:
    "Deputados federais e senadores em exercico, com partido, estado, projetos propostos e como votaram no Congresso.",
  alternates: { canonical: "/parlamentares" },
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ casa?: string }>;
}

export default async function ParlamentaresPage({ searchParams }: PageProps) {
  const { casa } = await searchParams;

  // O submenu "Parlamentares" aponta para ?casa=camara / ?casa=senado, para
  // abrir a listagem ja na aba desejada.
  const casaInicial = casa === "senado" ? ("senado" as const) : ("camara" as const);

  const [deputados, dadosSenado] = await Promise.all([
    todosOsDeputados(),
    obterSenadores().catch(() => ({ versao: null, Senado: [] })),
  ]);

  const senadores = dadosSenado.Senado;

  // O arquivo XML do Senado e publico, sem chave. A lista so fica vazia se o
  // endpoint externo estiver fora do ar no momento da consulta.
  const temSenado = senadores.length > 0;

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

      {deputados.length === 0 && !temSenado ? (
        <div className="text-center py-16 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light">
          <p className="text-lg font-semibold text-azul dark:text-white mb-2">
            Nao foi possivel carregar os parlamentares
          </p>
          <p className="text-cinza-escuro dark:text-cinza-medio">
            As APIs da Camara e do Senado podem estar temporariamente fora do
            ar.
          </p>
        </div>
      ) : (
        <ListaParlamentares
          deputados={deputados}
          senadores={senadores}
          casaInicial={casaInicial}
        />
      )}

      <div className="mt-12 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <p className="flex items-start gap-2 text-sm text-cinza-escuro dark:text-cinza-medio mb-4">
          <Info size={16} className="text-verde shrink-0 mt-0.5" />
          <span>
            Deputados estaduais ainda nao entram aqui: cada assembleia publica
            seus dados em um sistema proprio e nao existe fonte federal
            unificada. Preferimos declarar o recorte a mostrar uma lista
            incompleta sem avisar.
          </span>
        </p>
        <Link
          href="/metodologia"
          className="inline-flex items-center gap-1 text-verde font-semibold hover:underline"
        >
          Ver a metodologia completa
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
