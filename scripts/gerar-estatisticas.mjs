/**
 * Gera src/data/tse/_estatisticas.json a partir dos arquivos do TSE.
 *
 * Rodar no build mantem as paginas de /partidos e o painel de numeros da home
 * rapidas: em vez de ler ~28 MB de JSON a cada requisicao, lemos um resumo de
 * poucos kilobytes.
 *
 * Uso: npm run estatisticas
 */
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "src/data/tse");
const SAIDA = path.join(DIR, "_estatisticas.json");

/** Normaliza texto para comparacao sem acento nem caixa. */
function normalizar(texto) {
  return (texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const arquivos = (await readdir(DIR)).filter(
  (f) => f.endsWith(".json") && f !== "_indice.json" && f !== "_estatisticas.json"
);

const porPartido = new Map();
const porCargo = new Map();
const porUf = new Map();
const porStatus = new Map();
const porGenero = new Map();

let total = 0;
let comFoto = 0;
let comPlano = 0;
let comPropostas = 0;

for (const arquivo of arquivos) {
  const uf = path.basename(arquivo, ".json").toUpperCase();
  const lista = JSON.parse(await readFile(path.join(DIR, arquivo), "utf-8"));

  for (const c of lista) {
    total++;

    if (c.foto) comFoto++;
    if (c.planoGovernoUrl) comPlano++;
    if (Array.isArray(c.propostas) && c.propostas.length > 0) comPropostas++;

    const acrescentar = (mapa, chave) => {
      if (!chave) return;
      mapa.set(chave, (mapa.get(chave) ?? 0) + 1);
    };

    acrescentar(porPartido, c.partido);
    acrescentar(porCargo, c.cargo);
    acrescentar(porUf, uf);
    acrescentar(porStatus, c.status);
    acrescentar(porGenero, c.genero);
  }
}

const ordenar = (mapa) =>
  Array.from(mapa.entries())
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);

const estatisticas = {
  geradoEm: new Date().toISOString(),
  total,
  comFoto,
  comPlano,
  comPropostas,
  partidos: ordenar(porPartido),
  cargos: ordenar(porCargo),
  ufs: ordenar(porUf),
  status: ordenar(porStatus),
  genero: ordenar(porGenero),
};

await writeFile(SAIDA, JSON.stringify(estatisticas, null, 2), "utf-8");

console.log(`> estatisticas: ${total} candidatos em ${arquivos.length} estado(s)`);
console.log(`   ${porPartido.size} partidos, ${porCargo.size} cargos`);
console.log(`   ${comFoto} com foto, ${comPlano} com plano de governo`);
console.log(`   escrito em ${path.relative(process.cwd(), SAIDA)}`);
