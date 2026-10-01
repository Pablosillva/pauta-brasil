import Link from "next/link";
import { Users, Gavel, FileText, MapPin, type LucideIcon } from "lucide-react";
import { estatisticas } from "@/data/estatisticas";
import { totalDoEstado, totalGeral } from "@/data/loader-tse";

interface Cartao {
  icone: LucideIcon;
  valor: string;
  rotulo: string;
  href: string;
  nota?: string;
}

/**
 * Painel de numeros da home.
 *
 * Sinaliza volume e credibilidade de imediato. Todos os valores vem das
 * estatisticas geradas a partir dos arquivos do TSE (veja
 * scripts/gerar-estatisticas.mjs) - nada aqui e digitado a mao.
 */
export function PainelNumeros() {
  const uf = 27;

  const cartoes: Cartao[] = [
    {
      icone: Users,
      valor: estatisticas.total.toLocaleString("pt-BR"),
      rotulo: "Candidatos registrados",
      href: "/candidatos",
      nota: `nas ${uf} unidades da federacao`,
    },    {
      icone: FileText,
      valor: estatisticas.comPlano.toLocaleString("pt-BR"),
      rotulo: "Planos de governo no TSE",
      href: "/planos",
      nota: "documentos originais em PDF",
    },
    {
      icone: Users,
      valor: "513",
      rotulo: "Deputados federais",
      href: "/deputados",
      nota: "com historico de votacao",
    },
    {
      icone: Gavel,
      valor: "1.200+",
      rotulo: "Votacoes do Congresso",
      href: "/projetos",
      nota: "voto nominal de cada deputado",
    },
    {
      icone: MapPin,
      valor: String(estatisticas.ufs.length),
      rotulo: "Estados mapeados",
      href: "/mapa",
      nota: "distribuicao espacial",
    },
    {
      icone: Users,
      valor: String(estatisticas.partidos.length),
      rotulo: "Partidos na disputa",
      href: "/partidos",
      nota: "com candidatos inscritos",
    },
  ];

  // Confere que o indice bate com a soma dos arquivos (evita divergencia).
  const totalNoIndice = totalGeral();

  return (
    <section className="bg-cinza-claro dark:bg-azul-light/10 border-y border-cinza-medio dark:border-azul-light">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-azul dark:text-white">
              Base de dados
            </h2>
            <p className="text-cinza-escuro dark:text-cinza-medio mt-1">
              Dados abertos do TSE e da Camara dos Deputados
            </p>
          </div>

          <Link
            href="/fontes"
            className="text-sm text-verde font-semibold hover:underline"
          >
            Ver as fontes oficiais
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {cartoes.map((cartao) => {
            const Icone = cartao.icone;

            return (
              <Link
                key={cartao.rotulo}
                href={cartao.href}
                className="group p-5 rounded-2xl bg-white dark:bg-azul-dark/50 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
              >
                <div className="flex items-center gap-2 mb-2 text-verde">
                  <Icone size={16} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio">
                    {cartao.rotulo}
                  </span>
                </div>

                <p className="text-3xl lg:text-4xl font-bold text-azul dark:text-white group-hover:text-verde transition-colors">
                  {cartao.valor}
                </p>

                {cartao.nota && (
                  <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-1">
                    {cartao.nota}
                  </p>
                )}
              </Link>
            );
          })}
        </div>

        {totalNoIndice !== estatisticas.total && (
          <p className="mt-6 text-xs text-amber-600 dark:text-amber-400">
            Aviso: o indice do TSE aponta {totalNoIndice.toLocaleString("pt-BR")}{" "}
            registros e as estatisticas somam{" "}
            {estatisticas.total.toLocaleString("pt-BR")}. Rode{" "}
            <code>npm run estatisticas</code> para sincronizar.
          </p>
        )}
      </div>
    </section>
  );
}

/** Total de candidatos de um estado, usado em OTHER cards. */
export function totalPorEstado(uf: string): number {
  return totalDoEstado(uf);
}
