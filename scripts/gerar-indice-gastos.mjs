/**
 * Gera src/data/gastos-camara.json: gastos de cada deputado, da propria Camara.
 *
 * A CGU daria os mesmos gastos, mas a chave dela exige conta gov.br de nivel
 * Prata ou Ouro, e a base e indexada por nome, o que agrupa homonimos.
 *
 * A Camara publica os proprios gastos em CSV, sem chave:
 *
 *   https://www.camara.leg.br/transparencia/api/download/tabelaComparativa.csv
 *
 * Fonte oficial, cobre cota e verba de gabinete, sem cadastro. O preco: vem
 * por ano, sem filtro por deputado, e a juncao e por nome.
 *
 * Como a juncao e por nome, o indice e gravado chaveado por ID de deputado.
 * Assim a tela busca por id e homonimos nunca se misturam.
 */
import { writeFile, stat } from "fs/promises";
import path from "path";

const SAIDA = path.join(process.cwd(), "src/data/gastos-camara.json");

const ANO = process.argv[2] ?? "2026";
const LEGISLATURA = process.argv[3] ?? "57";

const API = "https://dadosabertos.camara.leg.br/api/v2";
const CSV = "https://www.camara.leg.br/transparencia/api/download/tabelaComparativa.csv";

const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
};

/** R$ -4.920,37 -> -4920.37 */
function paraNumero(texto) {
  const limpo = String(texto ?? "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const v = Number(limpo);
  return Number.isFinite(v) ? v : 0;
}

/** Deputados em exercicio, direto da API. */
async function todos() {
  const todos = [];

  for (let pagina = 1; pagina <= 10; pagina++) {
    const url = `${API}/deputados?itens=100&pagina=${pagina}&ordem=ASC&ordenarPor=nome`;
    const r = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(40000) });
    if (!r.ok) break;

    const bloco = (await r.json()).dados ?? [];
    if (bloco.length === 0) break;

    todos.push(...bloco);
    if (bloco.length < 100) break;
  }

  return todos;
}

/** O CSV da Camara. */
async function csv() {
  const params = new URLSearchParams({ legislatura: LEGISLATURA, deputado: "", ano: ANO, periodo: "A" });
  const r = await fetch(`${CSV}?${params}`, { headers: UA, signal: AbortSignal.timeout(120000) });

  if (!r.ok) throw new Error(`CSV respondeu ${r.status}`);
  return r.text();
}

async function principal() {
  console.log("> indice de gastos (Camara)");
  console.log(`   ano ${ANO}, legislatura ${LEGISLATURA}`);

  const [lista, texto] = await Promise.all([todos(), csv()]);

  console.log(`   deputados em exercicio: ${lista.length}`);

  const linhas = texto.split(/\r?\n/).filter(Boolean);
  console.log(`   linhas no CSV: ${linhas.length - 1}`);

  // Indexa por nome normalizado, para casar ignoring acentos e caixa.
  const porNome = new Map();
  for (const d of lista) {
    porNome.set(d.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim(), d);
  }

  // aggregating
  const gastos = new Map();
  let semCasamento = 0;

  for (const linha of linhas.slice(1)) {
    const partes = linha.split(";");
    if (partes.length < 5) continue;

    const [nome, partido, uf, categoria, valorTexto] = partes;
    const valor = paraNumero(valorTexto);
    if (valor === 0) continue;

    const chave = String(nome ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
    const deputado = porNome.get(chave);

    if (!deputado) {
      semCasamento++;
      continue;
    }

    let linha_ = gastos.get(deputado.id);
    if (!linha_) {
      linha_ = { partido: deputado.siglaPartido, uf: deputado.siglaUf, total: 0, qtd: 0, categorias: {} };
      gastos.set(deputado.id, linha_);
    }

    linha_.total += valor;
    linha_.qtd++;

    const cat = String(categoria ?? "").trim() || "Nao classificada";
    const anterior = linha_.categorias[cat] ?? { qtd: 0, valor: 0 };
    linha_.categorias[cat] = { qtd: anterior.qtd + 1, valor: anterior.valor + valor };
  }

  // arredonda para 2 casas, como o dinheiro e
  for (const linha of gastos.values()) {
    linha.total = Math.round(linha.total * 100) / 100;
    for (const c of Object.values(linha.categorias)) c.valor = Math.round(c.valor * 100) / 100;
  }

  const indice = {
    geradoEm: new Date().toISOString().slice(0, 10),
    ano: Number(ANO),
    legislatura: Number(LEGISLATURA),
    totalRegistros: linhas.length - 1,
    valorTotal: Math.round([...gastos.values()].reduce((s, l) => s + l.total, 0) * 100) / 100,
    deputados: Object.fromEntries([...gastos.entries()].sort((a, b) => b[1].total - a[1].total)),
  };

  await writeFile(SAIDA, JSON.stringify(indice), "utf-8");

  const topo = Object.entries(indice.deputados).slice(0, 5);
  const bytes = (await stat(SAIDA)).size;

  console.log(`   com gastos: ${Object.keys(indice.deputados).length} deputados`);
  console.log(`   sem casamento de nome: ${semCasamento} linhas`);
  console.log(`   total: R$ ${(indice.valorTotal / 1e6).toFixed(1)} milhoes`);
  console.log(`   arquivo: ${path.relative(process.cwd(), SAIDA)} (${(bytes / 1024).toFixed(0)} KB)`);
  console.log("");
  for (const [id, d] of topo) {
    console.log(`   ${id} ${d.partido}/${d.uf}  R$ ${d.total.toFixed(2)}  (${d.qtd} registros)`);
  }
  console.log("");
}

await principal();
