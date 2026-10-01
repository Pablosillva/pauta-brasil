/**
 * Monta src/data/nomes-accentos.json: mapeia grafia sem acento -> com acento.
 *
 * O TSE grava NM_CANDIDATO e NM_URNA_CANDIDATO de forma inconsistente: 73% dos
 * 20 mil candidatos vem sem acento nenhum, mas 11% do nome completo e 20% do
 * nome de urna chegam acentuados. O mesmo nome aparece das duas formas
 * (SILMARA BORGES GONÇALVES / SILMARA GONCALVES).
 *
 * Isso permite deduzir a grafia certa sem dicionario externo: sempre que a
 * mesma palavra desacentoada aparece junto da variante acentuada, o par e a
 * correcao. O que sobrar sem par fica sem acento, porque adivinhar seria pior
 * do que mostrar a grafia da fonte.
 *
 * Os regex usam \uXXXX em vez de acentos literais de proposito: estes
 * arquivos passam por transformacoes de texto que corrompem caractere nao-ASCII,
 * e um regex quebrado geraria mapeamentos inventados.
 *
 * Uso: node scripts/gerar-dicionario-nomes.mjs
 */
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "src/data/tse");
const SAIDA = path.join(process.cwd(), "src/data/nomes-accentos.json");

/** Faixa de caracteres acentuados, em unicode. */
const RE_ACENTUADO = /[\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff]/;
const RE_MARCACAO = /[\u0300-\u036f]/g;

const semAcento = (p) =>
  p
    .normalize("NFD")
    .replace(RE_MARCACAO, "")
    .toUpperCase();

/** Grafia acentuada -> contagem. */
const acentuadas = new Map();
/** Grafia sem acento -> contagem. */
const normais = new Map();

const arquivos = (await readdir(DIR)).filter(
  (f) => f.endsWith(".json") && !f.startsWith("_")
);

for (const arquivo of arquivos) {
  const lista = JSON.parse(await readFile(path.join(DIR, arquivo), "utf-8"));

  for (const candidato of lista) {
    for (const campo of [candidato.nome, candidato.nomeUrna]) {
      if (!campo) continue;

      for (const palavra of campo.toUpperCase().split(/\s+/)) {
        // Ignora apelidos curtos e particulas, que nao precisam de acento.
        if (palavra.length < 3) continue;

        if (RE_ACENTUADO.test(palavra)) {
          acentuadas.set(palavra, (acentuadas.get(palavra) ?? 0) + 1);
        } else {
          normais.set(palavra, (normais.get(palavra) ?? 0) + 1);
        }
      }
    }
  }
}

/*
 * Filtro de ruido. Medindo a base inteira (scripts/medir-razao-acentos.mjs), os
 * dois grupos se separam com folga:
 *
 *   erros de digitacao, de 0% a 4%:  OLIVEIRA 1x, JOSE 1x, JUNIOR 1x,
 *                                    LUIZ 2x, COELHO 4x
 *
 *   grafias reais, de 14% para cima:  LUIS 14%, CESAR 16%, ANTONIO 17%,
 *                                    JOSE 36%, CONCEICAO 54%, JOAO 68%
 *
 * A razao explica o metodo: o TSE grava o nome como o candidato digitou no
 * cadastro. Quem escreve "Jose" sem acento vira "JOSE" no arquivo; quem
 * escreve com acento vira a forma acentuada. Os dois convivem, e a proporcao
 * indica qual grafia e a verdadeira.
 *
 * Cortar em 8% elimina todos os erros medidos e preserva todas as grafias
 * reais, inclusive as de proporcao mais baixa. E o que evita que o site
 * escreva "Macêdo" (7 ocorrencias) quando o certo e "Macedo" (100).
 */
const PROPORCAO_MINIMA = 0.08;
const FREQUENCIA_MINIMA = 3;

const dicionario = {};
let semParceira = 0;
let rejeitadas = 0;

for (const [base, qtdSemAcento] of normais) {
  // Todas as variantes acentuadas que correspondem a esta base sem acento.
  const variantes = [...acentuadas.entries()].filter(
    ([com]) => semAcento(com) === base
  );

  if (variantes.length === 0) {
    semParceira++;
    continue;
  }

  // A mais frequente ganha; as demais quase sempre sao erro de digitacao.
  variantes.sort((a, b) => b[1] - a[1]);
  const [escolhida, qtdAcentuado] = variantes[0];

  const proporcao = qtdAcentuado / (qtdAcentuado + qtdSemAcento);

  if (qtdAcentuado < FREQUENCIA_MINIMA || proporcao < PROPORCAO_MINIMA) {
    rejeitadas++;
    continue;
  }

  dicionario[base] = escolhida;
}

const ordenadas = Object.fromEntries(
  Object.entries(dicionario).sort(([a], [b]) => a.localeCompare(b, "pt-BR"))
);

await writeFile(SAIDA, JSON.stringify(ordenadas, null, 0), "utf-8");

console.log("> dicionario de nomes");
console.log(`   ${Object.keys(ordenadas).length} palavras com acento recuperadas`);
console.log(`   ${semParceira} sem variante acentuada (mantidas como vieram)`);
console.log(`   ${rejeitadas} rejeitadas como erro de digitacao`);
console.log(`   escrito em ${path.relative(process.cwd(), SAIDA)}`);

console.log("\n   Exemplos:");
for (const [de, para] of Object.entries(ordenadas).slice(0, 15)) {
  console.log(`     ${de} -> ${para}`);
}
console.log("");
