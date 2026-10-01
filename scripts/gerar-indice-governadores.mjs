/**
 * Gera src/data/governadores.json: candidatos a governador por unidade.
 *
 * A tela "Quem governa cada estado hoje?" usava uma lista escrita a mao com 10
 * dos 27 estados e partidos incorretos. Este indice vem do que o TSE registra:
 * quem disputa a vaga em 2026, com partido e numero.
 *
 * Sai pequeno de proposito (201 candidatos), para o componente do portal poder
 * importar direto sem abrir os 27 arquivos do TSE a cada visita.
 *
 * Uso: node scripts/gerar-indice-governadores.mjs
 */
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "src/data/tse");
const SAIDA = path.join(process.cwd(), "src/data/governadores.json");

const arquivos = (await readdir(DIR)).filter(
  (f) => f.endsWith(".json") && !f.startsWith("_")
);

const porUf = {};
let total = 0;

for (const arquivo of arquivos) {
  const uf = arquivo.replace(".json", "").toUpperCase();
  const lista = JSON.parse(await readFile(path.join(DIR, arquivo), "utf-8"));

  const candidatos = lista
    .filter((c) => c.cargo === "Governador")
    .map((c) => ({
      id: c.id,
      nome: c.nomeUrna || c.nome,
      partido: c.partido,
      numero: c.numero,
    }))
    .sort((a, b) => Number(b.numero) - Number(a.numero));

  if (candidatos.length === 0) continue;

  porUf[uf] = candidatos;
  total += candidatos.length;
}

await writeFile(SAIDA, JSON.stringify(porUf), "utf-8");

const bytes = (await readFile(SAIDA)).length;
const units = Object.keys(porUf).length;

console.log("> indice de governadores");
console.log(`   ${total} candidatos a governador em ${units} unidades`);
console.log(
  `   maior disputa: ${
    Object.entries(porUf).sort((a, b) => b[1].length - a[1].length)[0][0]
  }`
);
console.log(
  `   arquivo: ${path.relative(process.cwd(), SAIDA)} (${(bytes / 1024).toFixed(1)} KB)`
);
console.log("");