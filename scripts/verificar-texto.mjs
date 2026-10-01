/**
 * Procura corrupcao de texto nos arquivos do projeto.
 *
 * Erros de geracao de codigo costumao introduzir caracteres de outros alfabetos
 * (chino, cirilico, arabe) dentro de strings em portugues. Este script falha se
 * encontrar algum, e tambem avisa sobre marcadores de texto quebrado conhecidos.
 *
 * Uso: node scripts/verificar-texto.mjs
 */
import { readdir, readFile } from "fs/promises";
import path from "path";

const RAIZ = process.cwd();
const DIRETORIOS = ["app", "src", "scripts"];

/** Blocos que nunca aparecem em codigo deste projeto. */
const SUSPEITOS = [
  { nome: "cirilico", re: /[\u0400-\u04FF]/ },
  { nome: "arabe/hebraico", re: /[\u0600-\u06FF\u0590-\u05FF]/ },
  { nome: "CJK", re: /[\u3000-\u9FFF\uFF00-\uFFEF]/ },
  { nome: "devanagari", re: /[\u0900-\u097F]/ },
  { nome: "marcador quebrado", re: /(_detail_dependency_package_package|resonate_detail|packaging_detail|COORDena_KL|derospection|\?\?\?\?)/ },
];

async function* Walk(dir) {
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    const completo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      yield* walk(completo);
    } else if (/\.(ts|tsx|mjs|js|json)$/.test(entrada.name)) {
      yield completo;
    }
  }
}

const problemas = [];

for (const dir of DIRETORIOS) {
  let arquivos;
  try {
    arquivos = walk(path.join(RAIZ, dir));
  } catch {
    continue;
  }

  for await (const arquivo of arquivos) {
    // Ignora artefatos de build e dependencias.
    if (arquivo.includes(`${path.sep}node_modules${path.sep}`)) continue;
    if (arquivo.includes(`${path.sep}.next${path.sep}`)) continue;

    const conteudo = await readFile(arquivo, "utf-8");
    const linhas = conteudo.split(/\r?\n/);

    linhas.forEach((linha, i) => {
      for (const { nome, re } of SUSPEITOS) {
        if (re.test(linha)) {
          problemas.push(
            `${path.relative(RAIZ, arquivo)}:${i + 1} [${nome}] ${linha.trim()}`
          );
        }
      }
    });
  }
}

if (problemas.length === 0) {
  console.log("> verificar-texto: nenhum problema encontrado");
  process.exit(0);
}

console.error(`> verificar-texto: ${problemas.length} problema(s):`);
for (const p of problemas) console.error(`   ${p}`);
process.exit(1);
