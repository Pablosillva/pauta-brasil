/**
 * Compara, palavra a palavra, quantas vezes o TSE gravou a forma acentuada
 * e a forma sem acento. Serve para escolher o limiar da regra do dicionario.
 *
 * Uso: node scripts/medir-razao-acentos.mjs [limite]
 */
import { readdir, readFile } from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "src/data/tse");
const RE_ACENTUADO = /[\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff]/;
const RE_MARCACAO = /[\u0300-\u036f]/g;
const semAcento = (p) => p.normalize("NFD").replace(RE_MARCACAO, "").toUpperCase();

const LIMITE = Number(process.argv[2]) || 30;

const acentuadas = new Map();
const normais = new Map();

const arquivos = (await readdir(DIR)).filter(
  (f) => f.endsWith(".json") && !f.startsWith("_")
);

for (const arquivo of arquivos) {
  const lista = JSON.parse(await readFile(path.join(DIR, arquivo), "utf-8"));

  for (const c of lista) {
    for (const campo of [c.nome, c.nomeUrna]) {
      if (!campo) continue;

      for (const p of campo.toUpperCase().split(/\s+/)) {
        if (p.length < 3) continue;
        if (RE_ACENTUADO.test(p)) {
          acentuadas.set(p, (acentuadas.get(p) ?? 0) + 1);
        } else {
          normais.set(p, (normais.get(p) ?? 0) + 1);
        }
      }
    }
  }
}

// Para cada forma acentuada, compara com a mesma palavra sem acento.
const linhas = [];

for (const [com, qtdAcentuada] of acentuadas) {
  const base = semAcento(com);
  const qtdNormal = normais.get(base) ?? 0;

  if (qtdNormal === 0) continue; // so existe acentuada: sem duvida

  linhas.push({
    com,
    base,
    qtdAcentuada,
    qtdNormal,
    proporcao: qtdAcentuada / (qtdAcentuada + qtdNormal),
  });
}

linhas.sort((a, b) => b.qtdAcentuada + b.qtdNormal - (a.qtdAcentuada + a.qtdNormal));

console.log("\n  Grafia acentuada  vs  sem acento   (proporcao acentuada)");
console.log("  " + "-".repeat(64));

for (const l of linhas.slice(0, LIMITE)) {
  const barra = "#".repeat(Math.round(l.proporcao * 20)).padEnd(20, ".");
  console.log(
    `  ${l.com.padEnd(16)} ${String(l.qtdAcentuada).padStart(5)}x  |` +
      ` ${String(l.qtdNormal).padStart(5)}x sem  | ${barra} ${(l.proporcao * 100).toFixed(0)}%`
  );
}
console.log("");
