/**
 * Remove as propostas genericas que o script adicionar-propostas.mjs gravou.
 *
 * O TSE nao fornece propostas: o download oficial entrega `propostas: []`. O
 * script antigo preencheu o campo com 4 frases genericas por cargo, iguais
 * para todos os candidatos daquela categoria. Como essas frases aparecem em
 * fichas de pessoas reais, sao conteudo inventado. Este script apaga apenas o
 * campo, preservando todo o resto do registro e o plano de governo do TSE.
 *
 * Uso: node scripts/remover-propostas-genericas.mjs
 */
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "src/data/tse");

const arquivos = (await readdir(DIR)).filter(
  (f) =>
    f.endsWith(".json") && f !== "_indice.json" && !f.startsWith("_")
);

let candidatosLimpos = 0;
let propostasRemovidas = 0;
let semAlteracao = 0;

for (const arquivo of arquivos) {
  const caminho = path.join(DIR, arquivo);
  const candidatos = JSON.parse(await readFile(caminho, "utf-8"));

  let alterado = false;

  for (const candidato of candidatos) {
    if (Array.isArray(candidato.propostas) && candidato.propostas.length > 0) {
      // Garante que nao sobra espaco vazio onde o campo ficava.
      delete candidato.propostas;
      candidatosLimpos++;
      propostasRemovidas += 1;
      alterado = true;
    }
  }

  if (alterado) {
    await writeFile(caminho, JSON.stringify(candidatos, null, 2), "utf-8");
  }
}

console.log(`> remover-propostas: ${candidatosLimpos} candidatos limpos`);
console.log(`   ${propostasRemovidas} campos "propostas" removidos`);
console.log(`   ${semAlteracao} arquivos sem alteracao`);
