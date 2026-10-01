/** Mostra de onde vem cada par do dicionario, para depurar mapeamentos errados. */
import { readdir, readFile } from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "src/data/tse");
const RE_ACENTUADO = /[\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff]/;
const RE_MARCACAO = /[\u0300-\u036f]/g;
const semAcento = (p) => p.normalize("NFD").replace(RE_MARCACAO, "").toUpperCase();

const alvo = (process.argv[2] ?? "MACEDO").toUpperCase();
const arquivos = (await readdir(DIR)).filter(
  (f) => f.endsWith(".json") && !f.startsWith("_")
);

const achados = [];

for (const arquivo of arquivos) {
  const lista = JSON.parse(await readFile(path.join(DIR, arquivo), "utf-8"));

  for (const c of lista) {
    for (const campo of [c.nome, c.nomeUrna]) {
      if (!campo) continue;

      for (const palavra of campo.toUpperCase().split(/\s+/)) {
        if (palavra.length < 3) continue;
        if (!RE_ACENTUADO.test(palavra)) continue;
        if (semAcento(palavra) !== alvo) continue;

        achados.push({
          arquivo,
          palavra,
          hex: [...palavra].map((ch) => ch.codePointAt(0).toString(16)).join(" "),
          nome: c.nome,
          urna: c.nomeUrna,
        });
      }
    }
  }
}

console.log(`\n> Palavras acentuadas que normalizam para "${alvo}": ${achados.length}`);

for (const a of achados) {
  console.log(
    `\n  ${a.arquivo}  "${a.palavra}"`
  );
  console.log(`    codepoints: ${a.hex}`);
  console.log(`    nome:   ${a.nome}`);
  console.log(`    urna:   ${a.urna}`);
}
console.log("");
