/**
 * Aplica correcoes pontuais de layout, substituindo TRECHO e nao linha.
 *
 * Existe porque editar linhas por indice em PowerShell e traicoeiro: um array
 * de arrays achata e o laco passa a escrever numero e texto em linhas erradas.
 * Ja aconteceu de sobrescrever a linha 1 de uma pagina com a letra "l".
 *
 * Aqui a troca e por substring: o trecho do meio e substituido dentro da linha
 * e o resto dela permanece intacto. Isso importa porque as classes Tailwind
 * vivem na mesma linha, e trocar a linha inteira derrubaria o container inteiro.
 *
 * As trocas ficam em scripts/ajustes-layout.txt:
 *
 *   caminho|trecho que existe hoje|trecho que entra no lugar
 *
 * Se o trecho nao existir, ou aparecer mais de uma vez, o ajuste e pulado e
 * aparece no relatorio. Nada e escrito nesse caso.
 *
 * Uso: node scripts/aplicar-ajustes-layout.mjs [--simular]
 */
import { readFile, writeFile } from "fs/promises";
import path from "path";

const ARQUIVO = path.join(process.cwd(), "scripts/ajustes-layout.txt");
const simular = process.argv.includes("--simular");

const texto = await readFile(ARQUIVO, "utf-8");

const ajustes = texto
  .split(/\r?\n/)
  .map((linha) => linha.trim())
  .filter((linha) => linha && !linha.startsWith("#"))
  .map((linha, i) => {
    const partes = linha.split("|");
    if (partes.length < 3) {
      throw new Error(
        `Linha ${i + 1} de ajustes-layout.txt precisa de 3 campos separados por "|" (veio ${partes.length}): ${linha}`
      );
    }
    return {
      caminho: partes[0].trim(),
      de: partes[1],
      para: partes.slice(2).join("|"),
    };
  });

const porArquivo = new Map();

for (const ajuste of ajustes) {
  if (!porArquivo.has(ajuste.caminho)) porArquivo.set(ajuste.caminho, []);
  porArquivo.get(ajuste.caminho).push(ajuste);
}

let aplicadas = 0;
let pulados = 0;

for (const [caminho, lista] of porArquivo) {
  const completo = path.join(process.cwd(), caminho);
  const original = await readFile(completo, "utf-8");
  let atual = original;

  for (const ajuste of lista) {
    const ocorrencias = atual.split(ajuste.de).length - 1;

    if (ocorrencias === 0) {
      console.log(`   [pulado] ${caminho}: nao achei "${ajuste.de}"`);
      pulados++;
      continue;
    }

    if (ocorrencias > 1) {
      console.log(
        `   [pulado] ${caminho}: "${ajuste.de}" aparece ${ocorrencias}x, ambigua`
      );
      pulados++;
      continue;
    }

    // Substitui so o trecho, preservando o resto da linha.
    atual = atual.replace(ajuste.de, ajuste.para);

    console.log(`   ${caminho}`);
    console.log(`      - ${ajuste.de.slice(0, 72)}`);
    console.log(`      + ${ajuste.para.slice(0, 72)}`);
    aplicadas++;
  }

  if (!simular && atual !== original) {
    await writeFile(completo, atual, "utf-8");
  }
}

console.log("");
console.log(
  `${simular ? "simulado" : "aplicado"}: ${aplicadas} ajuste(s), ${pulados} pulado(s)`
);

if (pulados > 0) process.exitCode = 1;