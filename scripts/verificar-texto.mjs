/**
 * Procura corrupcao de caracteres em arquivos de texto do projeto.
 *
 * Existe um problema recorrente na edicao destes arquivos: um caractere nao-ASCII
 * sobrevive de um trecho e invade o vizinho. Ja aconteceu de "não" virar "n" +
 * caractere CJK, e de um intervalo de combining marks usado em regex virar
 * lixo quando o arquivo passa por transformacao de texto.
 *
 * Este script nao juzga conteudo, so bloqueia o que nao pode ter sido escrito de
 * proposito:
 *
 * - CJK e(fullwidth): nao existe em site brasileiro, entao e corrupcao
 * - U+FFFD: o proprio caractere de substituicao
 * - combining marks soltos fora de regex: so fazem sentido la
 *
 * Alem disso, avisa sobre acentos suspeitos e sobre a faixa de combining marks
 * escrita literal em codigo, que e a origem de varios desses problemas.
 *
 * Uso: node scripts/verificar-texto.mjs
 */
import { readdir, readFile, stat } from "fs/promises";
import path from "path";

const IGNORAR = new Set([
  "node_modules",
  ".next",
  ".git",
  ".vercel",
  "coverage",
  ".turbo",
]);

const EXTENSOES = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".md",
  ".mdx",
]);

/** CJK, hiragana, katakana, hangul e formas de largura cheia. */
const RE_CJK = /[\u3000-\u9fff\uac00-\ud7af\uff00-\uffef]/;
/** Caractere de substituicao: aparece quando o texto original ja se perdeu. */
const RE_SUBSTITUICAO = /\ufffd/;
/** Combining marks, que so aparecem dentro de um intervalo de regex. */
const RE_COMBINING = /[\u0300-\u036f]/;

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

/** Todos os arquivos nao-ASCII do projeto, como bytes crus. */
async function* arquivosBinarios(raiz) {
  for (const entrada of await readdir(raiz, { withFileTypes: true })) {
    if (IGNORAR.has(entrada.name)) continue;
    const caminho = path.join(raiz, entrada.name);

    if (entrada.isDirectory()) {
      yield* arquivosBinarios(caminho);
    } else if (entrada.isFile()) {
      yield caminho;
    }
  }
}

const problemas = [];

for await (const caminho of arquivos(process.cwd())) {
  const texto = await readFile(caminho, "utf-8");
  const relativo = path.relative(process.cwd(), caminho);
  const linhas = texto.split(/\r?\n/);

  linhas.forEach((linha, indice) => {
    const n = indice + 1;

    const cjk = linha.match(new RegExp(RE_CJK.source, "gu"));
    if (cjk) {
      problemas.push({
        relativo,
        n,
        tipo: "caractere CJK",
        detalhe: [...new Set(cjk)]
          .map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase())
          .join(" "),
      });
    }

    if (RE_SUBSTITUICAO.test(linha)) {
      problemas.push({
        relativo,
        n,
        tipo: "caractere de substituicao",
        detalhe: "U+FFFD",
      });
    }

    // Combining mark fora de regex: em texto corrido nao deveria existir.
    const isRegex = /\/[\][[^\n]*$/.test(linha.slice(0, linha.indexOf(linha.match(RE_COMBINING)?.[0] ?? "")));
    if (RE_COMBINING.test(linha) && !linha.includes("/[") && !isRegex) {
      const cps = [...line]
        .filter((c) => RE_COMBINING.test(c))
        .map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase());
      problemas.push({
        relativo,
        n,
        tipo: "combining mark fora de regex",
        detalhe: [...new Set(cps)].join(" "),
      });
    }
  });
}

/*
 * Dados de terceiros ficam de fora: os arquivos do TSE sao baixados, nao
 * escritos por nos, e podem legitimately conter qualquer coisa.
 */
for await (const caminho of arquivosBinarios(path.join(process.cwd(), "src/data"))) {
  if (!caminho.endsWith(".json")) continue;

  const info = await stat(caminho);
  // Acima de 5 MB sao os arquivos de candidatos, que vem do TSE direto.
  if (info.size > 5 * 1024 * 1024) continue;

  const texto = await readFile(caminho, "utf-8");
  const relativo = path.relative(process.cwd(), caminho);

  if (RE_CJK.test(texto) || RE_SUBSTITUICAO.test(texto)) {
    problemas.push({
      relativo,
      n: 0,
      tipo: "caractere invalido em dado",
      detalhe: "CJK ou substituicao",
    });
  }
}

if (problemas.length === 0) {
  console.log("> verificar-texto: nenhum problema encontrado");
  process.exit(0);
}

console.error(`> verificar-texto: ${problemas.length} problema(s)\n`);
for (const p of problemas) {
  console.error(`   ${p.relativo}${p.n ? ":" + p.n : ""}  [${p.tipo}]  ${p.detalhe}`);
}
console.error("");
process.exit(1);