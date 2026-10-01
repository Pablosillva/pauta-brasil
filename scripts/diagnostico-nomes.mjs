/**
 * Diagnostico dos nomes de candidato do TSE.
 *
 * O TSE grava NM_CANDIDATO e NM_URNA_CANDIDATO inconsistente: alguns
 * registros vem acentuados, outros nao. Este script mede isso e mostra
 * quais palavras aparecem sem acento nas duas colunas.
 *
 * Uso: node scripts/diagnostico-nomes.mjs
 */
import { readdir, readFile } from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "src/data/tse");

const COM_ACENTO = /[À-ÖØ-öø-ÿ]/;
const MAIUSCULO_ACENTUADO = /[À-ÖØ-öø-ÿ]/;

const arquivos = (await readdir(DIR)).filter(
  (f) => f.endsWith(".json") && !f.startsWith("_")
);

let total = 0;
let nomeComAcento = 0;
let urnaComAcento = 0;
let nenhumComAcento = 0;

/** Palavra -> com quantos caracteres que aparecem ela quase sempre vem sem acento. */
const semAcentoFrequente = new Map();
/** Palavra -> vezes que veio acentuada. */
const comAcentoFrequente = new Map();

for (const arquivo of arquivos) {
  const lista = JSON.parse(await readFile(path.join(DIR, arquivo), "utf-8"));

  for (const c of lista) {
    total++;

    const nomeOk = COM_ACENTO.test(c.nome ?? "");
    const urnaOk = COM_ACENTO.test(c.nomeUrna ?? "");

    if (nomeOk) nomeComAcento++;
    if (urnaOk) urnaComAcento++;
    if (!nomeOk && !urnaOk) nenhumComAcento++;

    // Word-level stats: same word, once with accent and once without.
    for (const campo of [c.nome, c.nomeUrna]) {
      if (!campo) continue;

      for (const palavra of campo.toUpperCase().split(/\s+/)) {
        if (palavra.length < 3) continue;

        if (MAIUSCULO_ACENTUADO.test(palavra)) {
          comAcentoFrequente.set(
            palavra,
            (comAcentoFrequente.get(palavra) ?? 0) + 1
          );
        } else {
          semAcentoFrequente.set(
            palavra,
            (semAcentoFrequente.get(palavra) ?? 0) + 1
          );
        }
      }
    }
  }
}

const pct = (n) => `${((n / total) * 100).toFixed(1)}%`;

console.log("=".repeat(60));
console.log("  Diagnostico: nomes de candidato do TSE");
console.log("=".repeat(60));

console.log(`\n  Total de candidatos:        ${total.toLocaleString("pt-BR")}`);
console.log(`  Nome completo com acento:  ${nomeComAcento.toLocaleString("pt-BR")} (${pct(nomeComAcento)})`);
console.log(`  Nome de urna com acento:   ${urnaComAcento.toLocaleString("pt-BR")} (${pct(urnaComAcento)})`);
console.log(`  Nenhum dos dois com acento:${String(nenhumComAcento).padStart(11)} (${pct(nenhumComAcento)})`);

/**
 * Palavras que aparecem SEM acento e, se existisse outra grafia COM acento
 * com o mesmo nome "desacentoado", provavelmente e a mesma palavra.
 */
const candidatos = [...semAcentoFrequente.entries()]
  .filter(([palavra, qtd]) => {
    const variante = [...comAcentoFrequente.keys()].find(
      (com) =>
        com !== palavra &&
        com.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === palavra
    );
    return Boolean(variante) && qtd >= 5;
  })
  .sort((a, b) => b[1] - a[1])
  .slice(0, 40);

console.log(`\n  Palavras que o TSE manda ora com, ora sem acento (top 40):`);
for (const [palavra, qtd] of candidatos) {
  const variante = [...comAcentoFrequente.keys()].find(
    (com) =>
      com !== palavra &&
      com.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === palavra
  );
  console.log(
    `    ${String(qtd).padStart(6)}x sem acento   ->  ${variante}`
  );
}

console.log("\n  Conclusao: a fonte e inconsistente, nao encoding local.");
console.log("  Corrigir exige um dicionario de nomes, nao um replace simples.\n");
