import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, ExternalLink, Users } from "lucide-react";
import { buscarSenador } from "@/lib/senado";
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

  const breadcrumb = jsonLdBreadcrumb([
    { name: "Início", url: "/" },
    { name: "Parlamentares", url: "/parlamentares" },
    { name: senador.nome, url: `/parlamentares/senado/${codigo}` },
  ]);

  const ficha = [
    senador.bloco && { rotulo: "Bloco", valor: senador.bloco },
    senador.lideranca && { rotulo: "Lideranca", valor: "Sim" },
    senador.mesa && { rotulo: "Mesa diretora", valor: "Sim" },
    senador.telefone && { rotulo: "Gabinete", valor: senador.telefone },
    senador.email && { rotulo: "E-mail", valor: senador.email },
  ].filter(Boolean) as { rotulo: string; valor: string }[];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
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
            </div>
          </div>
        </div>
      </header>

      {ficha.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-azul dark:text-white mb-4">
            Ficha
          </h2>
          <dl className="grid sm:grid-cols-2 gap-4">
            {ficha.map((item) => (
              <div
                key={item.rotulo}
                className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light"
              >
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
                  {item.rotulo === "E-mail" ? (
                    <Mail size={14} className="text-verde" />
                  ) : item.rotulo === "Gabinete" ? (
                    <Phone size={14} className="text-verde" />
                  ) : (
                    <Users size={14} className="text-verde" />
                  )}
                  {item.rotulo}
                </dt>
                <dd className="text-azul dark:text-white break-words">
                  {item.valor}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {senador.suplentes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-azul dark:text-white mb-4">
            Suplentes
          </h2>
          <ul className="space-y-2">
            {senador.suplentes.map((s, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-cinza-claro dark:bg-azul-light/10 border border-cinza-medio dark:border-azul-light"
              >
                <span className="text-azul dark:text-white">{s.nome}</span>
                <span className="text-xs px-2.5 py-1 rounded bg-azul/10 dark:bg-azul-light/30 text-azul dark:text-white font-semibold flex-shrink-0">
                  {s.participacao}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="p-5 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-cinza-medio dark:border-azul-light">
        <h2 className="font-bold text-azul dark:text-white mb-2 text-sm">
          O que ainda falta nesta ficha
        </h2>
        <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
          Votacoes, projetos de autoria e gastos de senadores ainda nao estao
          publicados aqui. O arquivo que consultamos traz cadastro, mandato e
          suplentes; para o restante seria preciso integrar a API nova do
          Senado, que exige chave, e a base de gastos da CGU, tambem com chave.
          Preferimos dizer o que falta a preencher com estimativa.
        </p>
      </div>

      {senador.pagina && (
        <div className="mt-10 pt-8 border-t border-cinza-medio dark:border-azul-light">
          <a
            href={senador.pagina}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-verde font-semibold hover:underline"
          >
            Ver o perfil oficial no Senado Federal
            <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
