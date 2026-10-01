import Link from "next/link";
import { Trophy } from "lucide-react";
import { formatarNome } from "@/lib/nomes";
import { formatarValor } from "@/lib/gastos";
import { nomesEstados } from "@/data/candidatos";
import registrosIndice from "@/data/patrimonio.json";

interface Registro {
  id: string;
  nome: string;
  nomeUrna: string;
  partido: string;
  cargo: string;
  estadoId: string;
  total: number;
  bens: number;
}

/*
 * Esta seção mostrava "ranking de popularidade" com notas de aprovação de
 * governadores e uma "tendência" de alta ou queda. Não havia pesquisa por
 * trás: eram valores escritos no código, e o mesmo bloco aparecia também em
 * /ferramentas/ranking e /ferramentas/mapa-calor.
 *
 * Aprovação não é publicável sem fonte licenciada, então o espaço passou a
 * mostrar um ranking que dá para conferir: o maior patrimônio declarado ao TSE
 * pelas eleições de 2026.
 */
export function RankingPopularidade() {
  const registros = (registrosIndice as Registro[]).slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="flex items-center gap-2 text-3xl font-bold text-azul dark:text-white">
            <Trophy size={24} className="text-verde" />
            Maior patrimônio declarado
          </h2>
          <p className="text-sm text-cinza-escuro dark:text-cinza-medio mt-1">
            Valor declarado ao TSE para as eleições de 2026.
          </p>
        </div>

        <Link
          href="/ferramentas/patrimonio"
          className="text-sm font-semibold text-verde hover:text-verde-dark transition-colors shrink-0"
        >
          Ver a lista completa →
        </Link>
      </div>

      <div className="bg-white dark:bg-azul-light/20 rounded-2xl border border-cinza-medio dark:border-azul-light overflow-hidden">
        {registros.map((r, i) => (
          <Link
            key={r.id}
            href={`/candidatos/${r.id}`}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-cinza-claro dark:hover:bg-azul-light/10 transition-colors ${
              i % 2 === 0 ? "bg-white dark:bg-transparent" : "bg-cinza-claro dark:bg-azul-light/10"
            }`}
          >
            <span className="w-8 text-center font-bold text-cinza-escuro dark:text-cinza-medio shrink-0">
              {i + 1}º
            </span>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-azul dark:text-white truncate">
                {formatarNome(r.nomeUrna || r.nome)}
              </p>
              <p className="text-xs text-cinza-escuro dark:text-cinza-medio truncate">
                {r.partido} · {r.cargo} ·{" "}
                {r.estadoId === "br"
                  ? "Brasil"
                  : nomesEstados[r.estadoId] ?? r.estadoId.toUpperCase()}{" "}
                · {r.bens} {r.bens === 1 ? "bem" : "bens"}
              </p>
            </div>

            <span className="font-bold text-verde whitespace-nowrap">
              {formatarValor(r.total)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}