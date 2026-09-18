import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Share2, GitCompare, FileText } from "lucide-react";
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
} from "@/components/icons/BrandIcons";
import { candidatos, nomesEstados } from "@/data/candidatos";
import { cn } from "@/lib/utils";

const ABAS = [
  { id: "propostas", label: "Propostas" },
  { id: "plano", label: "Plano de Governo" },
  { id: "historico", label: "Histórico" },
  { id: "patrimonio", label: "Patrimônio" },
  { id: "noticias", label: "Notícias" },
] as const;

type AbaId = (typeof ABAS)[number]["id"];

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ aba?: string }>;
}

export default async function CandidatoPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { aba } = await searchParams;
  const abaAtiva = (aba as AbaId) || "propostas";

  const candidato = candidatos.find((c) => c.id === id);
  if (!candidato) return notFound();

  const estado = nomesEstados[candidato.estadoId] ?? candidato.estadoId.toUpperCase();

  return (
    <div className="bg-cinza-claro dark:bg-azul-dark min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors"
        >
          <ArrowLeft size={16} /> Voltar ao mapa
        </Link>
      </div>

      {/* Cabeçalho do candidato */}
      <header className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-azul dark:bg-azul-dark text-white rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <img
              src={candidato.foto}
              alt={`Foto de ${candidato.nome}`}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-verde shadow-lg"
            />
            <div className="flex-1">
              <span className="inline-block text-xs font-semibold text-verde-light bg-verde/20 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                {candidato.status}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {candidato.nome}
              </h1>
              <p className="text-lg text-white/80">
                <span className="font-semibold">{candidato.cargo}</span> · {estado}
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
                <span className="h-6 w-px bg-white/20" />
                <span className="flex items-center gap-2 text-white/90">
                  <span className="text-sm text-white/60">Idade</span>
                  <span className="font-semibold">{candidato.idade} anos</span>
                </span>
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

      {/* Layout principal: conteúdo + sidebar */}
      <div className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Coluna de conteúdo */}
        <div>
          {/* Abas */}
          <nav className="flex overflow-x-auto border-b border-cinza-medio dark:border-azul-light mb-6">
            {ABAS.map((a) => (
              <Link
                key={a.id}
                href={`/candidatos/${id}?aba=${a.id}`}
                className={cn(
                  "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  abaAtiva === a.id
                    ? "border-verde text-verde"
                    : "border-transparent text-cinza-escuro dark:text-cinza-medio hover:text-azul dark:hover:text-white"
                )}
              >
                {a.label}
              </Link>
            ))}
          </nav>

          {/* Conteúdo da aba */}
          <div className="bg-white dark:bg-azul-light/20 rounded-2xl p-6 border border-cinza-medio dark:border-azul-light">
            {abaAtiva === "propostas" && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-azul dark:text-white">
                  Principais propostas
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {candidato.propostas?.map((p) => (
                    <div
                      key={p.area}
                      className="p-4 rounded-xl border border-cinza-medio dark:border-azul-light bg-cinza-claro dark:bg-azul-light/30"
                    >
                      <h3 className="font-semibold text-verde mb-2">{p.area}</h3>
                      <p className="text-sm text-azul dark:text-white/90">{p.resumo}</p>
                    </div>
                  ))}
                </div>
                {candidato.planoGovernoUrl && (
                  <a
                    href={candidato.planoGovernoUrl}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-3 rounded-lg bg-verde hover:bg-verde-dark text-white font-semibold transition-colors"
                  >
                    <FileText size={18} /> Baixar plano de governo (PDF)
                  </a>
                )}
              </div>
            )}

            {abaAtiva === "plano" && (
              <div>
                <h2 className="text-2xl font-bold text-azul dark:text-white mb-4">
                  Plano de Governo
                </h2>
                <p className="text-cinza-escuro dark:text-cinza-medio">
                  Documento oficial completo disponível em breve.
                </p>
              </div>
            )}

            {abaAtiva === "historico" && (
              <div>
                <h2 className="text-2xl font-bold text-azul dark:text-white mb-4">
                  Histórico político
                </h2>
                <ol className="space-y-3 border-l-2 border-verde pl-6">
                  {candidato.historico?.map((h, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-verde" />
                      <p className="font-semibold text-azul dark:text-white">{h.cargo}</p>
                      <p className="text-sm text-cinza-escuro dark:text-cinza-medio">{h.periodo}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {abaAtiva === "patrimonio" && (
              <div>
                <h2 className="text-2xl font-bold text-azul dark:text-white mb-4">
                  Patrimônio declarado
                </h2>
                <ul className="space-y-2">
                  {candidato.patrimonio?.map((p, i) => (
                    <li
                      key={i}
                      className="flex justify-between gap-4 p-3 rounded-lg bg-cinza-claro dark:bg-azul-light/30"
                    >
                      <span className="text-azul dark:text-white">{p.bem}</span>
                      <span className="font-semibold text-verde whitespace-nowrap">{p.valor}</span>
                    </li>
                  ))}
                </ul>
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

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Biografia */}
          <div className="bg-white dark:bg-azul-light/20 rounded-2xl p-6 border border-cinza-medio dark:border-azul-light">
            <h3 className="font-bold text-azul dark:text-white mb-3">Biografia</h3>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio">{candidato.bio}</p>
          </div>

          {/* Redes sociais */}
          <div className="bg-white dark:bg-azul-light/20 rounded-2xl p-6 border border-cinza-medio dark:border-azul-light">
            <h3 className="font-bold text-azul dark:text-white mb-3">Redes sociais</h3>
            <div className="flex gap-3">
              {candidato.redesSociais?.map((r) => (
                <a key={r.rede} href={r.url} aria-label={r.rede} >
                  {r.rede === "Instagram" && <InstagramIcon size={18} />}
                  {r.rede === "Twitter" && <TwitterIcon size={18} />}
                  {r.rede === "Facebook" && <FacebookIcon size={18} />}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div >
    </div >
  );
}