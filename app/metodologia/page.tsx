import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, ArrowLeft, AlertTriangle } from "lucide-react";
import { fontes, limitacoes } from "@/data/fontes";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Metodologia",
  description:
    "Como o Centro Politico coleta, trata e publica os dados eleitorais e parlamentares. Origem, atualizacao, criterios e limitacoes conhecidas.",
  alternates: { canonical: "/metodologia" },
};

const etapas = [
  {
    titulo: "1. Coleta",
    texto:
      "Baixamos os dados diretamente dos portais oficiais do TSE e da Camara dos Deputados por meio de APIs e arquivos abertos. Nao usamos planilhas de terceiros, agremiacoes ou estimativas.",
  },
  {
    titulo: "2. Normalizacao",
    texto:
      "Os nomes de estados, partidos e cargos sao padronizados para que a busca e os filtros funcionem corretamente. Estados aparecem sempre como sigla de duas letras (SP, RJ, MG), partidos pela sigla registrada no TSE.",
  },
  {
    titulo: "3. Enriquecimento",
    texto:
      "As fotos de campanha vem do sistema de divulgacao do TSE. Os planos de governo sao os PDFs enviados pelos proprios candidatos ao TSE e sao exibidos na integra, sem resumo ou interpretacao.",
  },
  {
    titulo: "4. Publicacao",
    texto:
      "Publicamos apenas o que a fonte entrega. Quando um campo nao existe no registro oficial, a pagina mostra a secao vazia em vez de preencher com estimativa.",
  },
  {
    titulo: "5. Atualizacao",
    texto:
      "Candidatos e planos seguem o calendario do TSE. Votacoes e projetos de lei sao consultados na API da Camara com cache de uma hora. As noticias sao publicadas pela nossa redacao.",
  },
];

export default function MetodologiaPage() {
  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Metodologia", url: "/metodologia" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <ClipboardList size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Como trabalhamos
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-4">
          Metodologia
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio leading-relaxed">
          Este texto descreve exatamente como o Centro Politico obtem e publica
          cada numero do site. Se algo nao esta descrito aqui, provavelmente
          ainda nao foi implementado.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-azul dark:text-white mb-5">
          Do dado oficial a pagina
        </h2>
        <ol className="space-y-4">
          {etapas.map((etapa) => (
            <li
              key={etapa.titulo}
              className="p-5 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light"
            >
              <h3 className="font-bold text-azul dark:text-white mb-2">
                {etapa.titulo}
              </h3>
              <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
                {etapa.texto}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
          Compromisso com a isencao
        </h2>
        <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed mb-4">
          O Centro Politico nao e filiado a partido, nao recebe recursos de
          campanhas e nao ordena candidatos por preferencia. O ranking reflete
          apenas a base de dados de candidatos registrados, sem corte ou
          ponderacao de ideologia.
        </p>
        <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
          Fotos e planos de governo sao exibidos como enviados ao TSE. Nao
          editamos conteudo de terceiros para favorecer nem para prejudicar
          nenhum candidato.
        </p>
      </section>

      {/* Limitações */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-azul dark:text-white mb-3">
          Limitacoes conhecidas
        </h2>
        <p className="text-cinza-escuro dark:text-cinza-medio mb-5">
          Preferimos declarar o que ainda nao funciona a esconder. Estas sao as
          limitacoes atuais:
        </p>

        <ul className="space-y-3">
          {limitacoes.map((item) => (
            <li
              key={item.titulo}
              className="flex items-start gap-3 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800"
            >
              <AlertTriangle
                size={18}
                className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
              />
              <div>
                <h3 className="font-bold text-azul dark:text-white mb-1">
                  {item.titulo}
                </h3>
                <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
                  {item.texto}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-azul dark:text-white mb-5">
          Fontes consultadas
        </h2>
        <ul className="space-y-2">
          {fontes.map((f) => (
            <li key={f.nome} className="text-cinza-escuro dark:text-cinza-medio">
              <span className="font-semibold text-azul dark:text-white">
                {f.nome}
              </span>{" "}
              — {f.orgao} · {f.frequencia}
            </li>
          ))}
        </ul>

        <Link
          href="/fontes"
          className="inline-flex items-center gap-2 text-verde font-semibold hover:underline mt-4"
        >
          Ver as fontes com links diretos
        </Link>
      </section>

      <div className="pt-8 border-t border-cinza-medio dark:border-azul-light">
        <Link
          href="/sobre"
          className="inline-flex items-center gap-2 text-verde font-semibold hover:underline"
        >
          <ArrowLeft size={16} /> Voltar para o sobre
        </Link>
      </div>
    </div>
  );
}
