/**
 * Gera src/data/patrimonio.json: indice do patrimonio declarado ao TSE.
 *
 * A pagina /ferramentas/patrimonio mostrava cinco nomes com valores fixos no
 * codigo, Rotate presented as "Fonte: Dados declarados ao TSE". Nao havia
 * chamada nenhuma a fonte. Este indice substitui esse recorte por dado real.
 *
 * O que entra: o total declarado por candidato e a quantidade de bens, lidos
 * dos arquivos que o TSE ja distribui. Nao entra copia dos bens: a lista
 * completa continua na aba Patrimonio do perfil do candidato, e trazer 70 mil
 * descricoes para o indice custaria alguns megabytes a mais no download.
 *
 * O valor vem como texto ("R$ 190.000,00"). O conversor abaixo e o mesmo do
 * que ja existe no front: remove o que nao e digito e troca o separador.
 *
 * Uso: node scripts/gerar-indice-patrimonio.mjs
 */
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "src/data/tse");
const SAIDA = path.join(process.cwd(), "src/data/patrimonio.json");

/** "R$ 190.000,00" -> 190000 */
function paraNumero(texto) {
  if (!texto) return 0;
  const limpo = String(texto).replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const valor = Number(limpo);
  return Number.isFinite(valor) ? valor : 0;
}

const arquivos = (await readdir(DIR)).filter(
  (f) => f.endsWith(".json") && !f.startsWith("_")
);

const registros = [];
let semValor = 0;

for (const arquivo of arquivos) {
  const lista = JSON.parse(await readFile(path.join(DIR, arquivo), "utf-8"));

  for (const c of lista) {
    const bens = Array.isArray(c.patrimonio) ? c.patrimonio : [];
    if (bens.length === 0) continue;

    const total = bens.reduce(
      (soma, bem) => soma + paraNumero(bem.valor),
      0
    );

    // Bens sem valor legivel zeram o total sem aparecer: e melhor mostrar
    // menos do que mostrar R$ 0 como se o candidato nao tivesse declarado nada.
    if (total === 0) {
      semValor++;
      continue;
    }

    /*
     * O download monta estadoId como "br-" + UF, entao a eleicao nacional
     * (cujo SG_UF e "BR") vira "br-br". Isso e coerente com a convencao do id
     * do candidato, mas quebra qualquer contagem que espere 27 estados: sairia
     * 28. Aqui normalizamos para "br", e a pagina trata "br" como Brasil,
     * separado das 27 unidades da federacao.
     */
    const estadoId = c.estadoId === "br-br" ? "br" : c.estadoId;

    registros.push({
      id: c.id,
      nome: c.nome,
      nomeUrna: c.nomeUrna ?? c.nome,
      partido: c.partido,
      cargo: c.cargo,
      estadoId,
      total,
      bens: bens.length,
    });
  }
}

// Maior patrimonio primeiro: e o que a pagina de ranking mostra por padrao.
registros.sort((a, b) => b.total - a.total);

await writeFile(SAIDA, JSON.stringify(registros), "utf-8");

const porEstado = new Map();
for (const r of registros) {
  porEstado.set(r.estadoId, (porEstado.get(r.estadoId) ?? 0) + 1);
}

const federacao = [...porEstado.keys()].filter((e) => e !== "br").length;
const nacional = porEstado.get("br") ?? 0;
const bytes = (await readFile(SAIDA)).length;

console.log("> indice de patrimonio");
console.log(
  `   ${registros.length.toLocaleString("pt-BR")} candidatos com valor declarado`
);
console.log(
  `   ${semValor.toLocaleString("pt-BR")} com bens sem valor legivel (fora do indice)`
);
console.log(
  `   ${federacao} unidades da federacao + ${nacional} presidenciais (BR)`
);
console.log(
  `   maior declarado: ${registros[0]?.nome} (${registros[0]?.bens} bens)`
);
console.log(
  `   arquivo: ${path.relative(process.cwd(), SAIDA)} (${(bytes / 1024 / 1024).toFixed(2)} MB)`
);
console.log("");