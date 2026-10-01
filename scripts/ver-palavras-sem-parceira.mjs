/**
 * Lista as palavras sem acento que NAO tem parceira acentuada nos dados,
 * ordenadas por frequencia. Sao as que valem uma correcao manual.
 *
 * Uso: node scripts/ver-palavras-sem-parceira.mjs [limite]
 */
import { readdir, readFile } from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "src/data/tse");
const dicionario = JSON.parse(
  await readFile(path.join(process.cwd(), "src/data/nomes-accentos.json"), "utf-8")
);

const LIMITE = Number(process.argv[2]) || 200;

const temAcento = (p) => /[À-ÖØ-öø-ÿ]/.test(p);
const semAcento = (p) =>
  p
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

const arquivos = (await readdir(DIR)).filter(
  (f) => f.endsWith(".json") && !f.startsWith("_")
);

const frequencia = new Map();

for (const arquivo of arquivos) {
  const lista = JSON.parse(await readFile(path.join(DIR, arquivo), "utf-8"));

  for (const c of lista) {
    for (const campo of [c.nome, c.nomeUrna]) {
      if (!campo) continue;

      for (const palavra of campo.toUpperCase().split(/\s+/)) {
        if (palavra.length < 3) continue;
        if (temAcento(palavra)) continue;
        if (dicionario[semAcento(palavra)]) continue;

        frequencia.set(palavra, (frequencia.get(palavra) ?? 0) + 1);
      }
    }
  }
}

const ordenado = [...frequencia.entries()].sort((a, b) => b[1] - a[1]);

console.log(
  `\n> ${ordenado.length} palavras sem parceira acentuada (top ${LIMITE}):\n`
);

let i = 0;
for (const [palavra, qtd] of ordenado.slice(0, LIMITE)) {
  console.log(`  ${String(qtd).padStart(5)}  ${palavra}`);
  i++;
}

console.log("");
