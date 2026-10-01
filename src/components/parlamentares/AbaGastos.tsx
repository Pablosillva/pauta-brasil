"use client";

import { Wallet, Info, TrendingDown } from "lucide-react";
import {
  categoriasOrdenadas,
  formatarValor,
  anoDoDado,
  geradoEm,
  type GastosDeputado,
} from "@/lib/gastos";

interface AbaGastosProps {
  gastos: GastosDeputado | null;
  nome: string;
  /** Senadores nao tem fonte equivalente; a tela declara a ausencia. */
  semFonte?: boolean;
}

/**
 * Gastos de gabinete com cota e verba.
 *
 * Antes esta aba consultava o Portal da Transparencia e, sem a chave, mostrava
 * um aviso. A fonte agora e o CSV aberto da propria Camara, entao o aviso so
 * aparece para quem realmente nao tem dado: os senadores, para os quais nao
 * existe fonte publica equivalente.
 *
 * Os numeros vem de src/data/gastos-camara.json, gerado por
 * scripts/gerar-indice-gastos.mjs. O rodape da aba diz o ano e a data do
 * arquivo, porque o dado nao e do dia.
 */
export function AbaGastos({ gastos, nome, semFonte }: AbaGastosProps) {
  if (semFonte) {
    return (
      <div className="p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-cinza-medio dark:border-azul-light">
        <div className="flex items-start gap-3">
          <Info
            size={20}
            className="text-cinza-escuro dark:text-cinza-medio shrink-0 mt-0.5"
          />
          <div>
            <h3 className="font-bold text-azul dark:text-white mb-1">
              Gastos de senador sem fonte pública
            </h3>
            <p className="text-sm text-cinza-escuro dark:text-cinza-medio leading-relaxed">
              A Câmara publica os gastos dos deputados em CSV aberto, mas não
              fez o equivalente para o Senado. NãoEstimamos nem preenchemos com
              zero, porque zero aqui seria mentira.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!gastos) {
    return (
      <div className="p-6 rounded-2xl bg-cinza-claro dark:bg-azul-light/10 border border-cinza-medio dark:border-azul-light">
        <p className="text-sm text-cinza-escuro dark:text-cinza-medio">
          O arquivo de gastos de {anoDoDado()} não tem registros para{" "}
          {nome}. Isso quer dizer que não houve despesa registrada no período
          coberto, não que o dado esteja faltando.
        </p>
      </div>
    );
  }

  const categorias = categoriasOrdenadas(gastos);
  const maior = categorias[0]?.valor ?? 0;

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
          <p className="text-xs uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
            Total registrado
          </p>
          <p className="text-2xl font-bold text-azul dark:text-white">
            {formatarValor(gastos.total)}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
          <p className="text-xs uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
            Despesas
          </p>
          <p className="text-2xl font-bold text-azul dark:text-white">
            {gastos.qtd}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-azul-light/20 border border-cinza-medio dark:border-azul-light">
          <p className="text-xs uppercase tracking-wider text-cinza-escuro dark:text-cinza-medio mb-1">
            Maior categoria
          </p>
          <p className="text-sm font-semibold text-verde truncate">
            {categorias[0]?.nome ?? "—"}
          </p>
          {maior > 0 && (
            <p className="text-xs text-cinza-escuro dark:text-cinza-medio">
              {formatarValor(maior)}
            </p>
          )}
        </div>
      </div>

      {/* Categorias */}
      <h3 className="flex items-center gap-2 font-bold text-azul dark:text-white mb-3">
        <Wallet size={18} className="text-verde" />
        Por categoria
      </h3>

      <ul className="space-y-3 mb-6">
        {categorias.map((c) => (
          <li key={c.nome}>
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <span className="text-sm text-azul dark:text-white min-w-0">
                {c.nome}
              </span>
              <span className="text-sm font-semibold text-azul dark:text-white whitespace-nowrap">
                {formatarValor(c.valor)}
              </span>
            </div>
            <div className="h-2 bg-cinza-claro dark:bg-azul-light/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-verde/70 rounded-full"
                style={{ width: `${maior > 0 ? (c.valor / maior) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-cinza-escuro dark:text-cinza-medio mt-0.5">
              {c.qtd} {c.qtd === 1 ? "registro" : "registros"}
            </p>
          </li>
        ))}
      </ul>

      {/* Origem e limites */}
      <div className="p-4 rounded-xl bg-cinza-claro dark:bg-azul-light/10 text-sm text-cinza-escuro dark:text-cinza-medio space-y-2">
        <p>
          <strong className="inline-flex items-center gap-1.5">
            <TrendingDown size={14} className="text-verde" />
            Fonte
          </strong>{" "}
          —— gastos publicados pela Câmara dos Deputados, exercício de{" "}
          {anoDoDado()}, arquivo gerado em {geradoEm()}.
        </p>
        <p>
          São valores registrados, com número de documento e código do fornecedor.
          Eles dizem onde a cota e a verba de gabinete foram gastas, não se
          houve irregularidade: quem avalia isso é a auditoria da Casa.
        </p>
        <p>
          Esta tela não substitui a fonte. Para conferir item a item, use o
          {" "}
          <a
            href="https://www.camara.leg.br/transparencia/gastos-parlamentares/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-verde font-semibold hover:underline"
          >
            portal de transparência da Câmara
          </a>
          .
        </p>
      </div>
    </div>
  );
}
