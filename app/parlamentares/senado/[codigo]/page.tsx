import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";
import { buscarSenador, temChaveSenado } from "@/lib/senado";
import { listarGastos, temChavePortalTransparencia } from "@/lib/gastos";
import { TabsSenador } from "@/components/parlamentares/TabsSenador";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ codigo: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { codigo } = await params;
  const senador = await buscarSenador(codigo);

  if (!senador) return { title: "Senador nao encontrado" };

  return {
    title: `${senador.nome} — senador ${senador.partido}/${senador.uf}`,
    description: `Ficha do senador ${senador.nome} (${senador.partido}/${senador.uf}), em exercicio no Senado Federal.`,
    alternates: { canonical: `/parlamentares/senado/${codigo}` },
  };
}

export default async function SenadorPage({ params }: PageProps) {
  const { codigo } = await params;
  const senador = await buscarSenador(codigo);

  if (!senador) notFound();

  // Os gastos vem da mesma base da Camara (CGU), que tambem exige chave.
  const gastos = temChavePortalTransparencia()
    ? await listarGastos(senador.nome).catch(() => null)
    : null;

  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Parlamentares", url: "/parlamentares" },
    { name: senador.nome, url: `/parlamentares/senado/${codigo}` },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <Link
        href="/parlamentares?casa=senado"
        className="inline-flex items-center gap-2 text-sm text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Todos os senadores
      </Link>

      {/* Cabecalho no mesmo formato da ficha do deputado */}
      <header className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-cinza-medio dark:bg-azul-light flex-shrink-0">
            {senador.foto ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={senador.foto}
                alt={`Foto de ${senador.nome}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-verde text-3xl">
                {senador.nome.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-azul dark:text-white mb-2">
              {senador.nome}
            </h1>

            {senador.nomeCompleto && senador.nomeCompleto !== senador.nome && (
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-3">
                Nome completo: {senador.nomeCompleto}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-lg bg-azul/10 dark:bg-azul-light/30 text-azul dark:text-white text-sm font-bold">
                {senador.partido}/{senador.uf}
              </span>
              <span className="px-3 py-1 rounded-lg bg-verde/10 text-verde text-sm font-semibold">
                Senador
              </span>
              {senador.bloco && (
                <span className="px-3 py-1 rounded-lg bg-cinza-claro dark:bg-azul-light/20 text-cinza-escuro dark:text-cinza-medio text-sm">
                  {senador.bloco}
                </span>
              )}
              {senador.lideranca && (
                <span className="px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-sm font-semibold">
                  Lideranca
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <TabsSenador
        senador={senador}
        gastos={gastos}
        temChaveGastos={temChavePortalTransparencia()}
        temChaveSenado={temChaveSenado()}
      />

      <div className="mt-10 space-y-4">
        <p className="flex items-start gap-2 text-sm text-cinza-escuro dark:text-cinza-medio">
          <Info size={16} className="text-verde shrink-0 mt-0.5" />
          <span>
            A ficha vem do arquivo publico do Senado com os parlamentares em
            exercicio. Materias de autoria, votacoes e gastos dependem de APIs
            que exigem chave gratuita; cada aba explica o que falta.
          </span>
        </p>

        {senador.pagina && (
          <a
            href={senador.pagina}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-verde font-semibold hover:underline"
          >
            Ver o perfil oficial no Senado Federal
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
