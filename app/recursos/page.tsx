import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Gavel,
  Scale,
  MapPin,
  FileText,
  BarChart3,
  GitCompare,
  LayoutGrid,
  Ruler,
  Landmark,
  Search,
  Bell,
  Database,
  ClipboardList,
  Newspaper,
  type LucideIcon,
} from "lucide-react";
import { estatisticas } from "@/data/estatisticas";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Todos os recursos",
  description:
    "Indice completo do Centro Politico: candidatos do TSE, votacoes do Congresso, dossiers de projetos de lei, mapa eleitoral, comparador e ferramentas de transparencia.",
  alternates: { canonical: "/recursos" },
};

interface Recurso {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
  href: string;
  grupo: string;
  status: "producao" | "parcial";
}

const recursos: Recurso[] = [
  {
    grupo: "Candidatos e elections",
    icone: Users,
    titulo: "Todos os candidatos",
    descricao: `${estatisticas.total.toLocaleString("pt-BR")} candidatos registrados no TSE nas 27 unidades, com filtros por estado, cargo e partido.`,
    href: "/candidatos",
    status: "producao",
  },
  {
    grupo: "Candidatos e elections",
    icone: FileText,
    titulo: "Planos de governo",
    descricao: `${estatisticas.comPlano.toLocaleString("pt-BR")} candidatos entregaram plano de governo ao TSE. Os PDFs sao exibidos na integra, sem resumo.`,
    href: "/planos",
    status: "producao",
  },
  {
    grupo: "Candidatos e elections",
    icone: Landmark,
    titulo: "Partidos",
    descricao: `${estatisticas.partidos.length} partidos com inscricoes, ordenados por numero de candidatos.`,
    href: "/partidos",
    status: "producao",
  },
  {
    grupo: "Candidatos e elections",
    icone: GitCompare,
    titulo: "Comparador",
    descricao: "Coloca de 2 a 4 candidatos lado a lado com os dados oficiais do TSE.",
    href: "/comparador",
    status: "producao",
  },
  {
    grupo: "Candidatos e elections",
    icone: MapPin,
    titulo: "Mapa eleitoral",
    descricao: "Distribuicao espacial dos candidatos por unidade da federacao.",
    href: "/mapa",
    status: "producao",
  },
  {
    grupo: "Congresso",
    icone: Gavel,
    titulo: "Projetos e votacoes",
    descricao: "Votacoes nominais do Congresso com o placar e o voto de cada deputado.",
    href: "/projetos",
    status: "producao",
  },
  {
    grupo: "Congresso",
    icone: Users,
    titulo: "Deputados federais",
    descricao: "Perfil de cada deputado com o historico completo de como votou.",
    href: "/deputados",
    status: "producao",
  },
  {
    grupo: "Congresso",
    icone: Scale,
    titulo: "Dossie de projetos de lei",
    descricao: "Tramitacao completa de cada proposicao, com datas e orgaos por onde passou.",
    href: "/projetos",
    status: "producao",
  },
  {
    grupo: "Conteudo",
    icone: Newspaper,
    titulo: "Noticias",
    descricao: "Cobertura editorial publicada pela redacao, com capas e categorization.",
    href: "/noticias",
    status: "producao",
  },
  {
    grupo: "Conteudo",
    icone: BarChart3,
    titulo: "Analises",
    descricao: "Textos de analise politica sobre as eleicoes de 2026.",
    href: "/analises",
    status: "parcial",
  },
  {
    grupo: "Ferramentas",
    icone: LayoutGrid,
     titulo: "Ranking",
     descricao: "Maior patrimonio declarado e por que nao publicamos aprovacao.",
    href: "/ferramentas/ranking",
    status: "producao",
  },
  {
    grupo: "Ferramentas",
    icone: Gavel,
    titulo: "Historico de votacao",
    descricao: "Busca entre todas as pautas com placar e votos individuais.",
    href: "/ferramentas/historico-votacao",
    status: "producao",
  },
  {
    grupo: "Ferramentas",
    icone: MapPin,
     titulo: "Peso eleitoral",
     descricao: "Quantos deputados federais cada estado elege.",
    href: "/ferramentas/mapa-calor",
    status: "producao",
  },
  {
    grupo: "Ferramentas",
    icone: Ruler,
    titulo: "Transparencia",
     descricao: "Cota e verba de gabinete, com as categorias de despesa.",
    href: "/ferramentas/transparencia",
    status: "parcial",
  },
  {
    grupo: "Ferramentas",
    icone: FileText,
     titulo: "Patrimonio declarado",
     descricao: "Bens declarados ao TSE, com filtro por unidade e cargo.",
    href: "/ferramentas/patrimonio",
     status: "producao",
  },
  {
    grupo: "Ferramentas",
    icone: BarChart3,
    titulo: "Ranking e colinha",
    descricao: "Colinha de urna e ordenacoes por cargo e partido.",
    href: "/ferramentas/colinha",
    status: "producao",
  },
  {
    grupo: "Conta",
    icone: Bell,
    titulo: "Minha conta",
    descricao: "Salve candidatos, acompanhe as pautas e gerencie seus dados.",
    href: "/minha-conta",
    status: "producao",
  },
  {
    grupo: "Transparencia do projeto",
    icone: Database,
    titulo: "Fontes de dados",
    descricao: "De onde vem cada numero, com links para as APIs oficiais.",
    href: "/fontes",
    status: "producao",
  },
  {
    grupo: "Transparencia do projeto",
    icone: ClipboardList,
    titulo: "Metodologia",
    descricao: "Como os dados sao coletados, as limitacoes conhecidas e o que ainda nao cobrimos.",
    href: "/metodologia",
    status: "producao",
  },
  {
    grupo: "Transparencia do projeto",
    icone: Search,
    titulo: "Busca",
    descricao: "Busca unificada entre candidatos e noticias.",
    href: "/busca",
    status: "producao",
  },
];

const grupos = Array.from(new Set(recursos.map((r) => r.grupo)));

export default function RecursosPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Recursos", url: "/recursos" },
  ]);

  const producao = recursos.filter((r) => r.status === "producao").length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <LayoutGrid size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Indice
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-4">
          Todos os recursos
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio leading-relaxed max-w-3xl">
          {recursos.length} recursos, {producao} em producao com dados oficiais.
          Este e o indice completo do Centro Politico: cada item abaixo leva
          direto para a ferramenta.
        </p>
      </header>

      <div className="space-y-12">
        {grupos.map((grupo) => (
          <section key={grupo}>
            <h2 className="text-2xl font-bold text-azul dark:text-white mb-5 pb-3 border-b border-cinza-medio dark:border-azul-light">
              {grupo}
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recursos
                .filter((r) => r.grupo === grupo)
                .map((recurso) => {
                  const Icone = recurso.icone;

                  return (
                    <Link
                      key={recurso.href + recurso.titulo}
                      href={recurso.href}
                      className="group p-5 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-verde/10 flex items-center justify-center text-verde flex-shrink-0">
                          <Icone size={20} />
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            recurso.status === "producao"
                              ? "bg-verde/10 text-verde"
                              : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          {recurso.status === "producao"
                            ? "Producao"
                            : "Parcial"}
                        </span>
                      </div>

                      <h3 className="font-bold text-azul dark:text-white group-hover:text-verde transition-colors mb-1">
                        {recurso.titulo}
                      </h3>
                      <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
                        {recurso.descricao}
                      </p>
                    </Link>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
