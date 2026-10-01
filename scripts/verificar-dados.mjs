/**
 * Impede que dado politico inventado volte para o codigo.
 *
 * Em setembro de 2026 a auditoria achou quatro telas com numeros escritos a mao
 * e apresentados como oficial:
 *
 *   /ferramentas/ranking     aprovacao de governadores e Instantiate
 *   /ferramentas/mapa-calor  aprovacao por estado, com tendencia
 *   /ferramentas/patrimonio  patrimonio de candidatos ficticios
 *   /ferramentas/transparencia  emendas e gastos ficticios
 *
 * O mesmo bloco de ranking ainda aparecia em /portal, e o painel admin tinha
 * tres botoes "Salvar" sem acao alguma. Nenhum desses numeros tinha origem.
 *
 * Como o projeto repete esse erro quando a tela e montada as pressas, a
 * verificacao entra no prebuild: o build para antes de publicar dado sem fonte.
 *
 * Uso: node scripts/verificar-dados.mjs
 */
import { readdir, readFile } from "fs/promises";
import path from "path";

const IGNORAR = new Set([
  "node_modules",
  ".next",
  ".git",
  ".vercel",
  ".turbo",
  "coverage",
  "data", // arquivos do TSE vem prontos
]);

const EXTENSOES = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);

/*
 * Campos que so fazem sentido num dado politico vindo de fonte oficial. Se
 * aparecem com valor literal no codigo, e dado escrito a mao.
 */
const PADROES = [
  { re: /\baprovacao\s*:\s*\d/, nome: "aprovacao (nota de pesquisa)" },
  { re: /\btendencia\s*:\s*"/, nome: "tendencia de alta/queda" },
  { re: /\bemendas?20\d\d\s*:\s*\d/, nome: "emendas por ano" },
  { re: /\bpatrimonio20\d\d\s*:\s*\d/, nome: "patrimonio por ano" },
  { re: /\bmargem de erro/i, nome: "metodologia de pesquisa declarada" },
  { re: /\binstitutos?\s+credenciados?\b/i, nome: "pesquisa declarada" },
];

/**
 * Trechos que sao comentario, texto de receita ou documento de teste: nao sao
 * dado servido ao leitor, entao nao entram na regra.
 */
const IGNORAR_LINHA = [
  /^\s*\/\//,
  /^\s*\*/,
  /^\s*\/\*/,
  /document\.createElement/,
  /*
   * As telas explicam por que o dado nao e publicado, e essa explicacao cita a
   * metodologia que foi removida. Marcar a linha e o jeito de dizer "aqui eu
   * estou falando do dado falso, nao servindo ele".
   */
  /verificar-dados:-exempt/,
];

async function* arquivos(raiz) {
  for (const entrada of await readdir(raiz, { withFileTypes: true })) {
    if (IGNORAR.has(entrada.name)) continue;
    const caminho = path.join(raiz, entrada.name);

    if (entrada.isDirectory()) {
      yield* arquivos(caminho);
    } else if (entrada.isFile() && EXTENSOES.has(path.extname(entrada.name))) {
      yield caminho;
    }
  }
}

const problemas = [];

for await (const caminho of arquivos(process.cwd())) {
  const texto = await readFile(caminho, "utf-8");
  const relativo = path.relative(process.cwd(), caminho);

  texto.split(/\r?\n/).forEach((linha, indice) => {
    if (IGNORAR_LINHA.some((re) => re.test(linha))) return;

    for (const { re, nome } of PADROES) {
      if (re.test(linha)) {
        problemas.push({
          relativo,
          linha: indice + 1,
          nome,
          trecho: linha.trim().slice(0, 80),
        });
        break;
      }
    }
  });
}

if (problemas.length === 0) {
  console.log("> verificar-dados: nenhum dado politico fixo no codigo");
  process.exit(0);
}

console.error(`> verificar-dados: ${problemas.length} campo(s) com valor literal\n`);

for (const p of problemas) {
  console.error(`   ${p.relativo}:${p.linha}  [${p.nome}]`);
  console.error(`      ${p.trecho}`);
}

console.error(
  "\n   Dado politico tem de vir de API oficial ou de script de geracao." +
    "\n   Para bloco indisponivel, a tela declara o motivo em vez de inventar" +
    "\n   numero. Exemplos de script: npm run patrimonio, npm run governadores.\n"
);

process.exit(1);