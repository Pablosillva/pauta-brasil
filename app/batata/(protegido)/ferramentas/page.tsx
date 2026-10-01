import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Database, Info } from "lucide-react";

export default async function FerramentasAdminPage() {
  const session = await getSession();
  if (!session) redirect("/batata/login");

  /*
   * Esta página tinha três formulários com "Salvar Ranking", "Salvar Mapa de
   * Calor" e "Salvar Histórico". Nenhum botão tinha ação, formulário ou server
   * action: nada era gravado. Pior, os campos já vinham preenchidos com dados
   * inventados, o que dava a impressão de que aquilo era o conteúdo do site.
   *
   * Os dados das ferramentas vêm das fontes oficiais e dos scripts de
   * geração, não de edição manual. Por isso a tela virou um índice: mostra de
   * onde vem cada número e como regenerar.
   */

  const fontes = [
    {
      rota: "/ferramentas/patrimonio",
      titulo: "Patrimônio declarado",
      origem: "TSE",
      comando: "npm run patrimonio",
      nota: "Gera src/data/patrimonio.json a partir dos 27 arquivos do TSE.",
    },
    {
      rota: "/ferramentas/mapa-calor",
      titulo: "Peso eleitoral por estado",
      origem: "Câmara dos Deputados",
      comando: "—",
      nota: "Conta os deputados em exercício por UF, direto da API.",
    },
    {
      rota: "/ferramentas/transparencia",
      titulo: "Transparência",
      origem: "Portal da Transparência (CGU)",
      comando: "—",
      nota: "Precisa de PORTAL_TRANSPARENCIA_API_KEY. Sem a chave, a tela declara o bloqueio.",
    },
    {
      rota: "/ferramentas/historico-votacao",
      titulo: "Histórico de votação",
      origem: "Câmara dos Deputados",
      comando: "—",
      nota: "Votos nominais das últimas 12 votações abertas em votação nominal.",
    },
    {
      rota: "/ferramentas/ranking",
      titulo: "Ranking",
      origem: "TSE",
      comando: "npm run patrimonio",
      nota: "Mostra o ranking de patrimônio e declara por que não publicamos aprovação.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/batata"
        className="inline-flex items-center gap-2 text-sm text-cinza-escuro dark:text-cinza-medio hover:text-verde transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Voltar ao dashboard
      </Link>

      <h1 className="text-3xl font-bold text-azul dark:text-white mb-3">
        Fontes das ferramentas
      </h1>
      <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-8 max-w-2xl">
        Os dados das ferramentas vêm das fontes oficiais e dos scripts de
        geração. Não há edição manual: alterar um número aqui exigiria
        adulterar a fonte, e a página deixaria de ser verificável.
      </p>

      <div className="space-y-3">
        {fontes.map((f) => (
          <div
            key={f.rota}
            className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light p-5"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="font-bold text-azul dark:text-white">{f.titulo}</h2>
              <Link
                href={f.rota}
                className="inline-flex items-center gap-1 text-sm text-verde font-semibold hover:underline shrink-0"
              >
                Abrir <ExternalLink size={14} />
              </Link>
            </div>

            <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
              {f.nota}
            </p>

            <p className="flex items-center gap-2 mt-2 text-xs text-cinza-escuro dark:text-cinza-medio">
              <Database size={13} className="text-verde shrink-0" />
              Fonte: {f.origem}
              {f.comando !== "—" && (
                <>
                  {" · "}
                  <code className="px-1.5 py-0.5 rounded bg-cinza-claro dark:bg-azul-dark text-azul dark:text-white">
                    {f.comando}
                  </code>
                </>
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-cinza-claro dark:bg-azul-light/20 text-sm text-cinza-escuro dark:text-cinza-medio flex items-start gap-2">
        <Info size={16} className="text-verde shrink-0 mt-0.5" />
        <span>
          Nenhuma ferramenta usa número escrito à mão. Isso vale para
          aprovações, gastos e emendas: quando a fonte não está disponível, a
          tela explica o que falta em vez de preencher a tabela. Digitar um
          valor aqui seria publicar um dado sem origem.
        </span>
      </div>
    </div>
  );
}