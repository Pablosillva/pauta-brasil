import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  ExternalLink,
  Gavel,
  FileText,
  Wallet,
  Users,
  Search,
} from "lucide-react";
import {
  buscarDeputado,
  votosDoDeputado,
  votacoesDoIndice,
  projetosDoDeputado,
  VOTACOES_NO_INDICE,
  dataDaCamara,
  rotuloVoto,
  type CorVoto,
} from "@/lib/camara";
import { gastosDoDeputado } from "@/lib/gastos";

import { BadgeVoto } from "@/components/pautas/BadgeVotacao";
import { TabsDeputado } from "@/components/parlamentares/TabsDeputado";

import { jsonLdBreadcrumb } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const deputado = await buscarDeputado(Number(id));

  if (!deputado) return { title: "Parlamentar nao encontrado" };

  return {
    title: `${deputado.nome} — ${deputado.partido}/${deputado.uf}`,
    description: `Projetos propostos e votacoes de ${deputado.nome} (${deputado.partido}/${deputado.uf}). Dados oficiais da Camara dos Deputados.`,
    alternates: { canonical: `/deputados/${id}` },
  };
}

const COR_CLASSE: Record<CorVoto, string> = {
  verde: "text-verde",
  vermelho: "text-red-500",
  neutro: "text-cinza-medio",
};

export default async function DeputadoPage({ params }: PageProps) {
  const { id } = await params;
  const deputadoId = Number(id);

  if (!Number.isFinite(deputadoId)) notFound();

  const deputado = await buscarDeputado(deputadoId);
  if (!deputado) notFound();

  const [votos, votacoesIndice, projetos, gastos] = await Promise.all([
    votosDoDeputado(deputadoId, 40),
    votacoesDoIndice(),
    projetosDoDeputado(deputado.nome, 30),
    gastosDoDeputado(deputadoId),
  ]);

  const resumo = votos.reduce<Record<string, number>>((mapa, v) => {
    const { texto } = rotuloVoto(v.voto);
    mapa[texto] = (mapa[texto] ?? 0) + 1;
    return mapa;
  }, {});

  const nascimento = dataDaCamara(deputado.dataNascimento);

  /* Componente de servidor: a idade e calculada uma vez por requisicao e o
     resultado ja vai no HTML. Nao existe re-render no cliente que veja a
     mudanca, o que torna seguro usar Date.now() aqui. */
  /* eslint-disable react-hooks/purity */
  const idade = nascimento
    ? Math.floor(
        (Date.now() - nascimento.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;
  /* eslint-enable react-hooks/purity */

  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Parlamentares", url: "/parlamentares" },
    { name: deputado.nome, url: `/deputados/${id}` },
  ]);

  const ficha = [
    deputado.situacao && { icone: Calendar, rotulo: "Situacao", valor: deputado.situacao },
    nascimento && {
      icone: Calendar,
      rotulo: "Nascimento",
      valor: `${nascimento.toLocaleDateString("pt-BR")}${idade ? ` (${idade} anos)` : ""}`,
    },
    deputado.municipioNascimento && {
      icone: MapPin,
      rotulo: "Naturalidade",
      valor: `${deputado.municipioNascimento}${deputado.ufNascimento ? `/${deputado.ufNascimento}` : ""}`,
    },
    deputado.escolaridade && {
      icone: GraduationCap,
      rotulo: "Escolaridade",
      valor: deputado.escolaridade,
    },
    deputado.telefone && { icone: Phone, rotulo: "Gabinete", valor: deputado.telefone },
    deputado.email && { icone: Mail, rotulo: "E-mail", valor: deputado.email },
  ].filter(Boolean) as { icone: typeof Mail; rotulo: string; valor: string }[];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <Link
        href="/parlamentares"
        className="inline-flex items-center gap-2 text-sm text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Todos os parlamentares
      </Link>

      {/* Cabeçalho, no mesmo formato da página de candidatos */}
      <header className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={deputado.urlFoto}
            alt={`Foto de ${deputado.nome}`}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover bg-cinza-medio dark:bg-azul-light flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-azul dark:text-white mb-2">
              {deputado.nome}
            </h1>

            {deputado.nomeCivil && deputado.nomeCivil !== deputado.nome && (
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-3">
                Nome civil: {deputado.nomeCivil}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-lg bg-azul/10 dark:bg-azul-light/30 text-azul dark:text-white text-sm font-bold">
                {deputado.partido}/{deputado.uf}
              </span>
              <span className="px-3 py-1 rounded-lg bg-verde/10 text-verde text-sm font-semibold">
                Deputado federal
              </span>
              {deputado.situacao && (
                <span className="px-3 py-1 rounded-lg bg-cinza-claro dark:bg-azul-light/20 text-cinza-escuro dark:text-cinza-medio text-sm">
                  {deputado.situacao}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-cinza-medio dark:border-azul-light">
              <div>
                <p className="text-2xl font-bold text-azul dark:text-white">
                  {projetos.length}
                </p>
                <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                  projetos autoria
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-azul dark:text-white">
                  {votos.length}
                </p>
                <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                  votacoes nominais
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-azul dark:text-white">
                  {Object.keys(resumo).length}
                </p>
                <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                  posicoes distintas
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <TabsDeputado
        nome={deputado.nome}
        projetos={projetos}
        votos={votos}
        resumo={resumo}
        votacoesIndice={votacoesIndice}
        ficha={ficha.map((f) => ({ rotulo: f.rotulo, valor: f.valor }))}
        gastos={gastos}

      />

      <div className="mt-12 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <a
          href={`https://www.camara.leg.br/deputados/${deputado.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-verde font-semibold hover:underline"
        >
          Ver o perfil oficial na Camara dos Deputados
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
