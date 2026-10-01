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
} from "lucide-react";
import {
  buscarDeputado,
  votosDoDeputado,
  dataDaCamara,
  rotuloVoto,
  type CorVoto,
} from "@/lib/camara";
import { BadgeVoto } from "@/components/pautas/BadgeVotacao";
import { jsonLdBreadcrumb } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const deputado = await buscarDeputado(Number(id));

  if (!deputado) return { title: "Deputado nao encontrado" };

  return {
    title: `${deputado.nome} — ${deputado.partido}/${deputado.uf}`,
    description: `Como ${deputado.nome} (${deputado.partido}/${deputado.uf}) votou nas pautas do Congresso. Ficha, gabineto e historico de votacoes.`,
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

  const votos = await votosDoDeputado(deputadoId, 40);

  // Resumo de posicoes: o leitor quer saber "como esta pessoa vota?", nao 40 linhas.
  const resumo = votos.reduce<Record<string, number>>((mapa, v) => {
    const { texto } = rotuloVoto(v.voto);
    mapa[texto] = (mapa[texto] ?? 0) + 1;
    return mapa;
  }, {});

  const nascimento = dataDaCamara(deputado.dataNascimento);
  const idade = nascimento
    ? Math.floor(
        (Date.now() - nascimento.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Deputados", url: "/deputados" },
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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <Link
        href="/deputados"
        className="inline-flex items-center gap-2 text-sm text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Todos os deputados
      </Link>

      <header className="flex flex-col sm:flex-row gap-6 items-start mb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={deputado.urlFoto}
          alt={`Foto de ${deputado.nome}`}
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover bg-cinza-medio dark:bg-azul-light flex-shrink-0"
        />

        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-bold text-azul dark:text-white mb-2">
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

          {deputado.redesSociais.length > 0 && (
            <div className="flex items-center gap-3 mt-4">
              {deputado.redesSociais.slice(0, 4).map((url) => {
                const rede = url.includes("twitter") || url.includes("x.com")
                  ? "X"
                  : url.includes("facebook")
                    ? "Facebook"
                    : url.includes("instagram")
                      ? "Instagram"
                      : url.includes("youtube")
                        ? "YouTube"
                        : "Perfil";

                return (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors font-medium"
                  >
                    {rede}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Ficha */}
      {ficha.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-azul dark:text-white mb-4">
            Ficha
          </h2>
          <dl className="grid sm:grid-cols-2 gap-4">
            {ficha.map((item) => {
              const Icone = item.icone;
              return (
                <div
                  key={item.rotulo}
                  className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light"
                >
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
                    <Icone size={14} className="text-verde" /> {item.rotulo}
                  </dt>
                  <dd className="text-azul dark:text-white break-words">
                    {item.valor}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      )}

      {/* Histórico de votação */}
      <section>
        <h2 className="flex items-center gap-2 text-xl font-bold text-azul dark:text-white mb-4">
          <Gavel size={20} className="text-verde" />
          Historico de votacao ({votos.length})
        </h2>

        {votos.length === 0 ? (
          <div className="p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-dashed border-cinza-medio dark:border-azul-light text-center text-cinza-escuro dark:text-cinza-medio">
            Nenhuma votacao nominal registrada para este deputado no periodo
            consultado.
          </div>
        ) : (
          <>
            {/* Resumo de posições */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {Object.entries(resumo).map(([tipo, total]) => {
                const { cor } = rotuloVoto(tipo);
                return (
                  <div
                    key={tipo}
                    className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light text-center"
                  >
                    <p
                      className={`text-3xl font-bold ${COR_CLASSE[cor]}`}
                    >
                      {total}
                    </p>
                    <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
                      {tipo}
                    </p>
                  </div>
                );
              })}
            </div>

            <ul className="space-y-3">
              {votos.map(({ votacao, voto }, i) => {
                const data = dataDaCamara(votacao.dataHoraRegistro);

                return (
                  <li key={`${votacao.id}-${i}`}>
                    <Link
                      href={`/pautas/${votacao.id}`}
                      className="block p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-azul dark:text-white leading-snug text-sm">
                            {votacao.descricao}
                          </p>
                          {data && (
                            <time
                              dateTime={data.toISOString()}
                              className="block mt-2 text-xs text-cinza-escuro dark:text-cinza-medio"
                            >
                              {data.toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </time>
                          )}
                        </div>
                        <BadgeVoto voto={voto} />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

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
