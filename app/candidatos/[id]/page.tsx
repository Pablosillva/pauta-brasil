import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Share2, GitCompare, FileText, Mail } from "lucide-react";
import { nomesEstados, type Candidato } from "@/data/candidatos";
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
} from "@/components/icons/BrandIcons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { jsonLdCandidato, jsonLdBreadcrumb } from "@/lib/seo";

const ABAS = [
  { id: "propostas", label: "Propostas" },
  { id: "plano", label: "Documentos" },
  { id: "historico", label: "Histórico" },
  { id: "patrimonio", label: "Patrimônio" },
  { id: "noticias", label: "Notícias" },
] as const;

type AbaId = (typeof ABAS)[number]["id"];

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ aba?: string }>;
}

export const dynamicParams = true;

async function buscarCandidato(id: string): Promise<Candidato | null> {
  // Busca diretamente nos arquivos JSON do TSE
  const uf = id.split("-")[0].toLowerCase();
  try {
    const filePath = `src/data/tse/${uf}.json`;
    const mod = await import(`@/data/tse/${uf}.json`);
    const lista = ((mod as any).default ?? mod) as Candidato[];
    return lista.find((c) => c.id === id) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const candidato = await buscarCandidato(id);
  if (!candidato) return { title: "Candidato não encontrado" };
  return {
    title: candidato.nome,
    description: `${candidato.nome} — ${candidato.cargo} pelo ${candidato.partido}`,
    alternates: {
      canonical: `/candidatos/${id}`,
    },
  };
}

export default async function CandidatoPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { aba } = await searchParams;
  const abaAtiva = (aba as AbaId) || "propostas";

  const candidato = await buscarCandidato(id);
  if (!candidato) return notFound();

  const estado =
    nomesEstados[candidato.estadoId] ??
    candidato.estadoId.replace("br-", "").toUpperCase();

  const jsonLd = [
    jsonLdCandidato(candidato),
    jsonLdBreadcrumb([
      { name: "Início", url: "/" },
      { name: "Candidatos", url: "/candidatos" },
      { name: candidato.nome, url: `/candidatos/${candidato.id}` },
    ]),
  ];

  return (
    <div className="bg-cinza-claro dark:bg-azul-dark min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            jsonLdCandidato(candidato),
            jsonLdBreadcrumb([
              { name: "Início", url: "/" },
              { name: "Candidatos", url: "/candidatos" },
              { name: candidato.nome, url: `/candidatos/${candidato.id}` },
            ]),
          ]),
        }}
      />
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          href="/mapa"
          className="inline-flex items-center gap-2 text-sm font-medium text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors"
        >
          <ArrowLeft size={16} /> Voltar ao mapa
        </Link>
      </div>

      <header className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-azul dark:bg-azul-dark text-white rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Image
              src={candidato.foto}
              alt={`Foto de ${candidato.nome}`}
              width={160}
              height={160}
              unoptimized
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-verde shadow-lg bg-cinza-claro"
            />
            <div className="flex-1">
              <span className="inline-block text-xs font-semibold text-verde-light bg-verde/20 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                {candidato.status}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {candidato.nome}
              </h1>
              <p className="text-lg text-white/80">
                <span className="font-semibold">{candidato.cargo}</span> ·{" "}
                {estado}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="flex items-center gap-2 text-white/90">
                  <span className="text-sm text-white/60">Número</span>
                  <span className="font-bold text-2xl">{candidato.numero}</span>
                </span>
                <span className="h-6 w-px bg-white/20" />
                <span className="flex items-center gap-2 text-white/90">
                  <span className="text-sm text-white/60">Partido</span>
                  <span className="font-semibold">{candidato.partido}</span>
                </span>
                {candidato.idade > 0 && (
                  <>
                    <span className="h-6 w-px bg-white/20" />
                    <span className="flex items-center gap-2 text-white/90">
                      <span className="text-sm text-white/60">Idade</span>
                      <span className="font-semibold">
                        {candidato.idade} anos
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-row md:flex-col gap-3">
              <Link
                href={`/comparador?ids=${candidato.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-verde hover:bg-verde-dark font-semibold transition-colors"
              >
                <GitCompare size={16} /> Comparar
              </Link>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 hover:bg-white hover:text-azul font-semibold transition-colors">
                <Share2 size={16} /> Compartilhar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div>
          <nav className="flex overflow-x-auto border-b border-cinza-medio dark:border-azul-light mb-6">
            {ABAS.map((a) => (
              <Link
                key={a.id}
                href={`/candidatos/${id}?aba=${a.id}`}
                className={cn(
                  "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  abaAtiva === a.id
                    ? "border-verde text-verde"
                    : "border-transparent text-cinza-escuro dark:text-cinza-medio hover:text-azul dark:hover:text-white",
                )}
              >
                {a.label}
              </Link>
            ))}
          </nav>

          <div className="bg-white dark:bg-azul-light/20 rounded-2xl p-6 border border-cinza-medio dark:border-azul-light">
            {abaAtiva === "propostas" && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-azul dark:text-white">
                  Propostas
                </h2>

                {candidato.planoGovernoUrl ? (
                  <>
                    <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
                      Este candidato entregou um plano de governo ao Tribunal
                      Superior Eleitoral. O documento original esta disponivel
                      abaixo, sem resumo ou interpretacao nossa.
                    </p>
                    <a
                      href={candidato.planoGovernoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
                    >
                      <FileText size={18} />
                      Abrir plano de governo (PDF)
                    </a>
                    <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                      Documento enviado pela campanha e registrado no sistema
                      de divulgacao do TSE.
                    </p>
                  </>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-cinza-medio dark:border-azul-light bg-cinza-claro dark:bg-azul-light/10">
                    <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
                      Este candidato nao entregou plano de governo ao TSE, ou o
                      documento ainda nao foi disponbilizado na base oficial.
                      Nao publicamos estimativas nem resumo por conta propria:
                      esta secao fica vazia de proposito.
                    </p>
                    <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-3">
                      Acompanhe a{" "}
                      <Link
                        href="/metodologia"
                        className="text-verde font-semibold hover:underline"
                      >
                        metodologia
                      </Link>{" "}
                      para entender por que optamos por deixar em branco.
                    </p>
                  </div>
                )}
              </div>
            )}

            {abaAtiva === "plano" && (
              <div>
                <h2 className="text-2xl font-bold text-azul dark:text-white mb-4">
                  Plano de Governo
                </h2>
                {candidato.planoGovernoUrl ? (
                  <a
                    href={candidato.planoGovernoUrl}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
                  >
                    <FileText size={18} /> Baixar plano de governo (PDF)
                  </a>
                ) : (
                  <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
                    Nenhum documento de plano de governo foi localizado para
                    este candidato na base do TSE.
                  </p>
                )}
              </div>
            )}

            {abaAtiva === "historico" && (
              <div>
                <h2 className="text-2xl font-bold text-azul dark:text-white mb-4">
                  Histórico político
                </h2>
                {candidato.historico && candidato.historico.length > 0 ? (
                  <ol className="space-y-3 border-l-2 border-verde pl-6">
                    {candidato.historico.map((h, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-verde" />
                        <p className="font-semibold text-azul dark:text-white">
                          {h.cargo}
                        </p>
                        <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                          {h.periodo}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
                    A base do TSE nao informa o historico de cargos exercidos.
                    Preferimos deixar esta secao vazia a estimar uma trajetoria
                    que nao consta do registro oficial.
                  </p>
                )}
              </div>
            )}

            {abaAtiva === "patrimonio" && (
              <div>
                <h2 className="text-2xl font-bold text-azul dark:text-white mb-4">
                  Patrimônio declarado
                </h2>
                {candidato.patrimonio && candidato.patrimonio.length > 0 ? (
                  <ul className="space-y-2">
                    {candidato.patrimonio.map((p, i) => (
                      <li
                        key={i}
                        className="flex justify-between gap-4 p-3 rounded-lg bg-cinza-claro dark:bg-azul-light/30"
                      >
                        <span className="text-azul dark:text-white">
                          {p.bem}
                        </span>
                        <span className="font-semibold text-verde whitespace-nowrap">
                          {p.valor}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-cinza-escuro dark:text-cinza-medio leading-relaxed">
                    A base de divulgacao do TSE nao disponibiliza a declaracao
                    de patrimonio por candidato nesta API. Nada e estimado aqui:
                    a secao permanece vazia ate que o registro oficial esteja
                    disponivel.
                  </p>
                )}
              </div>
            )}

            {abaAtiva === "noticias" && (
              <div>
                <h2 className="text-2xl font-bold text-azul dark:text-white mb-4">
                  Notícias relacionadas
                </h2>
                <p className="text-cinza-escuro dark:text-cinza-medio">
                  Nenhuma notícia publicada ainda.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white dark:bg-azul-light/20 rounded-2xl p-6 border border-cinza-medio dark:border-azul-light">
            <h3 className="font-bold text-azul dark:text-white mb-3">
              Informações
            </h3>
            <ul className="space-y-2 text-sm text-cinza-escuro dark:text-cinza-medio">
              {candidato.ocupacao && (
                <li>
                  <span className="font-semibold text-azul dark:text-white">
                    Ocupação:
                  </span>{" "}
                  {candidato.ocupacao}
                </li>
              )}
              {candidato.grauInstrucao && (
                <li>
                  <span className="font-semibold text-azul dark:text-white">
                    Instrução:
                  </span>{" "}
                  {candidato.grauInstrucao}
                </li>
              )}
              {candidato.situacaoDetalhada && (
                <li>
                  <span className="font-semibold text-azul dark:text-white">
                    Situação:
                  </span>{" "}
                  {candidato.situacaoDetalhada}
                </li>
              )}
            </ul>
          </div>

          {candidato.bio && (
            <div className="bg-white dark:bg-azul-light/20 rounded-2xl p-6 border border-cinza-medio dark:border-azul-light">
              <h3 className="font-bold text-azul dark:text-white mb-3">
                Biografia
              </h3>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                {candidato.bio}
              </p>
            </div>
          )}

          <div className="bg-white dark:bg-azul-light/20 rounded-2xl p-6 border border-cinza-medio dark:border-azul-light">
            <h3 className="font-bold text-azul dark:text-white mb-3">
              Redes sociais
            </h3>
            {candidato.redesSociais && candidato.redesSociais.length > 0 ? (
              <div className="flex gap-3">
                {candidato.redesSociais.map((r) => (
                  <a
                    key={r.rede}
                    href={r.url}
                    aria-label={r.rede}
                    className="w-10 h-10 rounded-lg bg-verde/10 text-verde flex items-center justify-center hover:bg-verde hover:text-white transition-colors"
                  >
                    {r.rede === "Instagram" && <InstagramIcon size={18} />}
                    {r.rede === "Twitter" && <TwitterIcon size={18} />}
                    {r.rede === "Facebook" && <FacebookIcon size={18} />}
                    {!["Instagram", "Twitter", "Facebook"].includes(r.rede) && (
                      <Mail size={18} />
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
                Sem redes sociais cadastradas.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
