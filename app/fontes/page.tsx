import type { Metadata } from "next";
import Link from "next/link";
import { Database, ExternalLink, ArrowLeft, RefreshCw } from "lucide-react";
import { fontes } from "@/data/fontes";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Fontes de dados",
  description:
    "De onde vem cada dado do Centro Politico: TSE, Camara dos Deputados, Senado e Portal da Transparencia. Links para as APIs oficiais.",
  alternates: { canonical: "/fontes" },
};

export default function FontesPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Fontes de dados", url: "/fontes" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Database size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Transparencia
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-4">
          Fontes de dados
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio leading-relaxed">
          Todos os dados publicados aqui vem de fontes oficiais e publicas do
          governo brasileiro. Nao produzimos estimativas, simulacoes ou numeros
          inventados. Se um dado nao existe na fonte, ele aparece em branco.
        </p>
      </header>

      <div className="space-y-6">
        {fontes.map((fonte) => (
          <section
            key={fonte.nome}
            className="p-6 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
              <h2 className="text-xl font-bold text-azul dark:text-white">
                {fonte.nome}
              </h2>
              <span className="px-2.5 py-1 rounded-full bg-cinza-claro dark:bg-azul-light/20 text-cinza-escuro dark:text-cinza-medio text-xs font-semibold">
                {fonte.orgao}
              </span>
            </div>

            <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-4 flex items-center gap-2">
              <RefreshCw size={14} className="text-verde" />
              Frequencia: {fonte.frequencia}
            </p>

            <ul className="space-y-1.5 mb-5">
              {fonte.oQueFornece.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-cinza-escuro dark:text-cinza-medio"
                >
                  <span className="text-verde mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={fonte.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-verde font-semibold hover:underline text-sm"
            >
              Acessar a fonte oficial
              <ExternalLink size={14} />
            </a>

            {fonte.urlAlternativa && (
              <a
                href={fonte.urlAlternativa}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 inline-flex items-center gap-2 text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors text-sm"
              >
                <ExternalLink size={14} />
                {new URL(fonte.urlAlternativa).hostname}
              </a>
            )}
          </section>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-4">
          Encontrou uma divergencia entre o que exibimos e o registro oficial?
          <br />
          <Link href="/contato" className="text-verde font-semibold hover:underline">
            Avise a nossa equipe
          </Link>
          . Erros sao corrigidos e a correcao fica registrada na metodologia.
        </p>
        <Link
          href="/metodologia"
          className="inline-flex items-center gap-2 text-verde font-semibold hover:underline"
        >
          <ArrowLeft size={16} /> Ver a metodologia completa
        </Link>
      </div>
    </div>
  );
}
