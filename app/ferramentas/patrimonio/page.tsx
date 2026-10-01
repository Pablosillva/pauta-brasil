import Link from "next/link";
import { Landmark, TrendingUp, TrendingDown, Search } from "lucide-react";
import registrosIndice from "@/data/patrimonio.json";
import { nomesEstados } from "@/data/candidatos";
import { formatarNome } from "@/lib/nomes";
import { formatarValor } from "@/lib/gastos";

export const metadata = {
  title: "Patrimônio declarado ao TSE",
  description:
    "Bens declarados por candidatos nas eleições de 2026, com o total declarado por candidato e a lista completa na ficha individual.",
};

export const revalidate = 86400;

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

const registros = registrosIndice as Registro[];

const CARGOS = [
  "Presidente",
  "Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
] as const;

/** "br" e a eleicao nacional; nao e uma unidade da federacao. */
function nomeDaUnidade(estadoId: string): string {
  if (estadoId === "br") return "Brasil";
  return nomesEstados[estadoId] ?? estadoId.toUpperCase();
}

interface PageProps {
  searchParams: Promise<{
    uf?: string;
    cargo?: string;
    busca?: string;
    ordem?: string;
    pagina?: string;
  }>;
}

const POR_PAGINA = 100;

export default async function PatrimonioPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const uf = params.uf ?? "";
  const cargo = params.cargo ?? "";
  const busca = (params.busca ?? "").trim();
  const ordem = params.ordem === "bens" ? "bens" : "total";
  const pagina = Math.max(1, Number(params.pagina ?? 1) || 1);

  const termo = busca
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const filtrados = registros.filter((r) => {
    if (uf && r.estadoId !== uf) return false;
    if (cargo && r.cargo !== cargo) return false;
    if (termo) {
      const alvo =
        `${r.nome} ${r.nomeUrna} ${r.partido}`
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      if (!alvo.includes(termo)) return false;
    }
    return true;
  });

  filtrados.sort((a, b) =>
    ordem === "bens" ? b.bens - a.bens : b.total - a.total
  );

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice(
    (paginaAtual - 1) * POR_PAGINA,
    paginaAtual * POR_PAGINA
  );

  /** Monta a querystring preservando os filtros ao trocar de pagina. */
  const linkPagina = (n: number) => {
    const q = new URLSearchParams();
    if (uf) q.set("uf", uf);
    if (cargo) q.set("cargo", cargo);
    if (busca) q.set("busca", busca);
    if (ordem !== "total") q.set("ordem", ordem);
    if (n > 1) q.set("pagina", String(n));
    const s = q.toString();
    return s ? `/ferramentas/patrimonio?${s}` : "/ferramentas/patrimonio";
  };

  const unidades = [...new Set(registros.map((r) => r.estadoId))].sort((a, b) =>
    nomeDaUnidade(a).localeCompare(nomeDaUnidade(b), "pt-BR")
  );

  const maior = registros.reduce((soma, r) => soma + r.total, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 text-verde mb-3">
          <Landmark size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Ferramentas
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-azul dark:text-white mb-3">
          Patrimônio declarado
        </h1>
        <p className="text-lg text-cinza-escuro dark:text-cinza-medio max-w-3xl">
          Bens que cada candidato declarou ao TSE nas eleições de 2026. São{" "}
          {registros.length.toLocaleString("pt-BR")} candidatos com valor
          informado, somando {formatarValor(maior)}.
        </p>
      </header>

      {/* Filtros */}
      <form
        action="/ferramentas/patrimonio"
        method="get"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6"
      >
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza-medio"
          />
          <input
            type="search"
            name="busca"
            defaultValue={busca}
            placeholder="Nome ou partido"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white placeholder:text-cinza-medio focus:outline-none focus:ring-2 focus:ring-verde"
          />
        </div>

        <select
          name="uf"
          defaultValue={uf}
          className="px-3 py-2.5 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
        >
          <option value="">Todas as unidades</option>
          {unidades.map((u) => (
            <option key={u} value={u}>
              {nomeDaUnidade(u)}
            </option>
          ))}
        </select>

        <select
          name="cargo"
          defaultValue={cargo}
          className="px-3 py-2.5 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
        >
          <option value="">Todos os cargos</option>
          {CARGOS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          name="ordem"
          defaultValue={ordem}
          className="px-3 py-2.5 rounded-lg border border-cinza-medio dark:border-azul-light bg-white dark:bg-azul-dark text-azul dark:text-white focus:outline-none focus:ring-2 focus:ring-verde"
        >
          <option value="total">Maior valor declarado</option>
          <option value="bens">Mais bens declarados</option>
        </select>

        <button
          type="submit"
          className="sm:col-span-2 lg:col-span-4 justify-self-start px-4 py-2.5 rounded-lg bg-verde text-white font-semibold hover:bg-verde-dark transition-colors"
        >
          Filtrar
        </button>
      </form>

      <p className="text-sm text-cinza-escuro dark:text-cinza-medio mb-4">
        {filtrados.length.toLocaleString("pt-BR")} candidato
        {filtrados.length === 1 ? "" : "s"}
        {filtrados.length > POR_PAGINA && (
          <> · página {paginaAtual} de {totalPaginas}</>
        )}
      </p>

      {visiveis.length === 0 ? (
        <p className="py-12 text-center text-cinza-escuro dark:text-cinza-medio">
          Nenhum candidato bate com esses filtros.
        </p>
      ) : (
        <div className="space-y-3">
          {visiveis.map((r, i) => (
            <Link
              key={r.id}
              href={`/candidatos/${r.id}`}
              className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light hover:border-verde transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="w-8 shrink-0 text-right text-sm font-bold text-cinza-medio">
                  {(paginaAtual - 1) * POR_PAGINA + i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-azul dark:text-white truncate">
                    {formatarNome(r.nomeUrna || r.nome)}
                  </p>
                  <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                    {r.partido} · {r.cargo} · {nomeDaUnidade(r.estadoId)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 text-right shrink-0">
                <div>
                  <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                    bens
                  </p>
                  <p className="font-semibold text-azul dark:text-white">
                    {r.bens}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
                    declarado
                  </p>
                  <p className="font-semibold text-verde">
                    {formatarValor(r.total)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Paginacao */}
      {totalPaginas > 1 && (
        <nav className="mt-8 flex items-center justify-between gap-4">
          {paginaAtual > 1 ? (
            <Link
              href={linkPagina(paginaAtual - 1)}
              className="px-4 py-2 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white font-semibold hover:border-verde"
            >
              Anterior
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-cinza-escuro dark:text-cinza-medio">
            {paginaAtual} / {totalPaginas}
          </span>

          {paginaAtual < totalPaginas && (
            <Link
              href={linkPagina(paginaAtual + 1)}
              className="px-4 py-2 rounded-lg border border-cinza-medio dark:border-azul-light text-azul dark:text-white font-semibold hover:border-verde"
            >
              Próxima
            </Link>
          )}
        </nav>
      )}

      {/* Como ler estes numeros */}
      <section className="mt-10 p-5 rounded-2xl border border-cinza-medio dark:border-azul-light">
        <h2 className="font-bold text-azul dark:text-white mb-2">
          O que estes números significam
        </h2>
        <ul className="space-y-2 text-sm text-cinza-escuro dark:text-cinza-medio">
          <li>
            É o que o candidato <strong>declara</strong> na ficha de
            inscrição. O TSE registra o que foi declarado, sem conferir a
            existência do bem.
          </li>
          <li>
            Candidatos que não informaram valor legível ficam fora desta
            lista, porque somar zero junto dos demais falsearia o total. Eles
            continuam nas páginas individuais, com tudo que declararam.
          </li>
          <li>
            A soma de todos os valores é{" "}
            <strong>{formatarValor(maior)}</strong> e serve para comparar
            magnitudes, não para afirmar riqueza: o maior valor da lista não
            significa o candidato mais rico do país, e sim o que declarou o
            maior patrimônio.
          </li>
        </ul>
      </section>

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
