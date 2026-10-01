/**
 * Gastos de parlamentar.
 *
 * Historicamente vinha do Portal da Transparencia (CGU), que exige conta gov.br
 * de nivel Prata ou Ouro. Como esse cadastro travou, a fonte passou a ser a
 * propria Camara dos Deputados, que publica os gastos em CSV aberto e sem
 * chave:
 *
 *   https://www.camara.leg.br/transparencia/api/download/tabelaComparativa.csv
 *
 * Script que gera o indice: scripts/gerar-indice-gastos.mjs
 *
 * Tres diferencas em relacao a CGU, e todas declaradas na tela:
 *
 * 1. A CGU tem detalhe de despesa (documento, orgao, fornecedor). Aqui ha
 *    categoria, valor e quantidade, que e o que a Camara divulga.
 * 2. A CGU responde na hora. Aqui o dado e de {ANO}, gerado por
 *    scripts/gerar-indice-gastos.mjs.
 * 3. A CGU indexa por nome e agrupa homonimos. Aqui o indice e chaveado por ID
 *    de deputado, entao homonimos nunca se misturam.
 *
 * A chave da CGU continua sendo lida: se algum dia existir, ela vira a fonte
 * de detalhe, porque tem mais informacao por linha.
 */
import indiceBruto from "@/data/gastos-camara.json";

export interface CategoriaGasto {
  qtd: number;
  valor: number;
}

export interface GastosDeputado {
  partido: string;
  uf: string;
  total: number;
  qtd: number;
  categorias: Record<string, CategoriaGasto>;
}

interface IndiceGastos {
  geradoEm: string;
  ano: number;
  legislatura: number;
  totalRegistros: number;
  valorTotal: number;
  deputados: Record<string, GastosDeputado>;
}

const indice = indiceBruto as IndiceGastos;

/** Categorias ordenadas por valor, que e o que interessa ao leitor. */
export function categoriasOrdenadas(
  gastos: GastosDeputado
): { nome: string; qtd: number; valor: number }[] {
  return Object.entries(gastos.categorias)
    .map(([nome, c]) => ({ nome, qtd: c.qtd, valor: c.valor }))
    .sort((a, b) => b.valor - a.valor);
}

export function gastosDoDeputado(id: number | string): GastosDeputado | null {
  return indice.deputados[String(id)] ?? null;
}

export function anoDoDado(): number {
  return indice.ano;
}

export function geradoEm(): string {
  return indice.geradoEm;
}

/**
 * A fonte antiga. Continua exportada porque, se a chave existir, passa a
 * complementar o indice local com o detalhe que a CGU tem.
 */
export function temChavePortalTransparencia(): boolean {
  return Boolean((process.env.PORTAL_TRANSPARENCIA_API_KEY ?? "").trim());
}

export function formatarValor(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}