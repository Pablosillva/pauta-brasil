import Link from "next/link";
import { Shield, KeyRound, ExternalLink, AlertTriangle } from "lucide-react";
import {
  listarGastos,
  formatarValor,
  temChavePortalTransparencia,
} from "@/lib/gastos";
import { todosOsDeputados } from "@/lib/camara";
import { obterSenadores } from "@/lib/senado";

export const metadata = {
  title: "Transparência — gastos de parlamentares",
  description:
    "Gastos registrados no Portal da Transparência (CGU) e o que falta para exibir emendas parlamentares.",
};

export const revalidate = 3600;

/**
 * Transparencia: gastos de parlamentares vindos da CGU.
 *
 * Esta pagina ja exibia uma lista deucker comendas e valores fixos no codigo,
 * apresentada ao leitor como dado oficial ("Fonte: Dados da Camara e do Senado,
 * atualizados em 1 de setembro de 2026"). Nao havia nenhuma chamada a API por
 * tras: os numeros eram inventados, assim como o partido e o estado de cada
 * parlamentar. Esse tipo de recorte falso e pior do que pagina vazia, porque
 * parece verificavel.
 *
 * Agora a tela mostra somente dado real. Sem a chave da CGU, ela declara o
 * bloqueio em vez de preencher a tabela.
 */
export default async function TransparenciaPage() {
  const temChave = temChavePortalTransparencia();

  /*
   * A CGU indexa por nome, entao gastamos uma requisicao por parlamentar.
   * Limitar a uma amostra pequena mantem a pagina dentro do tempo de resposta
   * da Vercel: buscar os 513 deputados em paralelo daria timeout.
   */
  const amostra = temChave
    ? await (async () => {
        const [deputados, dadosSenado] = await Promise.all([
          todosOsDeputados(),
          obterSenadores().catch(() => null),
        ]);

        const nomes = [
          ...deputados.map((d) => d.nome),
          ...(dadosSenado?.Senado ?? []).map((s) => s.nome),
        ];

        return nomes.slice(0, 8);
      })()
    : [];

  const gastosPorNome = await Promise.all(
    amostra.map(async (nome) => ({
      nome,
      itens: await listarGastos(nome, 20).catch(() => null),
    }))
  );

  const comDados = gastosPorNome.filter((g) => (g.itens?.length ?? 0) > 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Shield size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Ferramentas
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Transparência
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio">
          Gastos de parlamentares registrados no Portal da Transparência da CGU.
        </p>
      </header>

      {!temChave && (
        <section className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 mb-8">
          <div className="flex items-start gap-3">
            <KeyRound
              size={20}
              className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
            />
            <div>
              <h2 className="font-bold text-azul dark:text-white mb-1">
                Dados de gastos indisponíveis
              </h2>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
                A API do Portal da Transparência exige uma chave, e sem ela todo
                endpoint responde 401. Não mostramos valores de exemplo: número
                inventado em página de transparência é pior do que página
                declarada como vazia.
              </p>
              <p className="text-sm text-cinza-escuro dark:text-cinza-medio mt-3">
                A chave é gratuita, com cadastro por e-mail em{" "}
                <a
                  href="https://www.portaldatransparencia.gov.br/api-de-dados/cadastrar-email"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-verde font-semibold hover:underline"
                >
                  portaldatransparencia.gov.br
                </a>
                . Depois basta definir{" "}
                <code className="px-1">PORTAL_TRANSPARENCIA_API_KEY</code>.
              </p>
            </div>
          </div>
        </section>
      )}

      {temChave && comDados.length === 0 && (
        <section className="p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light mb-8 flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="text-cinza-escuro dark:text-cinza-medio shrink-0 mt-0.5"
          />
          <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
            A chave está configurada, mas a CGU não devolveu nenhuma despesa
            para a amostra de parlamentares consultada. Pode ser indisponibilidade
            temporária do portal.
          </p>
        </section>
      )}

      {comDados.length > 0 && (
        <div className="space-y-4">
          {comDados.map(({ nome, itens }) => {
            const total = itens!.reduce((soma, g) => soma + g.valor, 0);

            return (
              <section
                key={nome}
                className="bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light rounded-2xl p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                  <h2 className="font-bold text-lg text-azul dark:text-white">
                    {nome}
                  </h2>
                  <span className="text-sm text-cinza-escuro dark:text-cinza-medio">
                    {itens!.length} despesas ·{" "}
                    <strong className="text-azul dark:text-white">
                      {formatarValor(total)}
                    </strong>
                  </span>
                </div>

                <ul className="divide-y divide-cinza-medio dark:divide-azul-light">
                  {itens!.slice(0, 5).map((g) => (
                    <li
                      key={g.codigo}
                      className="py-2 flex justify-between gap-4 text-sm"
                    >
                      <span className="text-cinza-escuro dark:text-cinza-medio min-w-0">
                        {g.descricao}
                        {g.orgao && (
                          <span className="block text-xs opacity-70">
                            {g.orgao}
                          </span>
                        )}
                      </span>
                      <span className="text-azul dark:text-white font-semibold whitespace-nowrap">
                        {formatarValor(g.valor)}
                      </span>
                    </li>
                  ))}
                </ul>

                {itens!.length > 5 && (
                  <p className="mt-3 text-xs text-cinza-escuro dark:text-cinza-medio">
                    Mostrando 5 de {itens!.length} despesas. A ficha completa
                    fica na página do parlamentar.
                  </p>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* Emendas: recurso separado da CGU, sem chave nao ha como consultar. */}
      <section className="mt-10 p-6 rounded-2xl border border-cinza-medio dark:border-azul-light">
        <h2 className="font-bold text-lg text-azul dark:text-white mb-2">
          Emendas parlamentares
        </h2>
        <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
          Emendas são outro recurso do Portal da Transparência, consultado à
          parte. Não misturamos o valor de uma emenda com o total de despesas de
          gabinete: são bases diferentes e a soma entre elas não significa
          nada. A página de cada parlamentar mostra a base de gastos; as emendas
          entram quando a chave da CGU estiver habilitada para esse recurso.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="https://www.portaldatransparencia.gov.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white font-semibold hover:border-verde transition-colors"
        >
          <ExternalLink size={18} />
          Portal da Transparência (CGU)
        </a>
        <Link
          href="/parlamentares"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-verde text-white font-semibold hover:bg-verde-dark transition-colors"
        >
          Ver parlamentares
        </Link>
      </div>

      <div className="mt-8 pt-8 border-t border-cinza-medio dark:border-azul-light">
        <Link
          href="/ferramentas"
          className="text-verde font-semibold hover:underline"
        >
          ← Voltar para Ferramentas
        </Link>
      </div>
    </div>
  );
}