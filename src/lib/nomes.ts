import dicionarioCru from "@/data/nomes-accentos.json";

/**
 * Formata nomes de candidato vindos do TSE.
 *
 * O TSE grava os nomes de forma inconsistente: a mesma pessoa aparece como
 * "SILMARA BORGES GONÇALVES" em um registro e "SILMARA GONCALVES" em outro.
 * 73% dos 20 mil candidatos nao tem acento nenhum em nenhum dos dois campos.
 *
 * Para arrumar sem inventar, usamos duas fontes:
 *
 * 1. src/data/nomes-accentos.json, gerado por scripts/gerar-dicionario-nomes.mjs
 *    a partir dos proprios dados do TSE: sempre que a mesma palavra aparece
 *    com e sem acento, o par e a correcao.
 * 2. A regra de capitalizacao, que hoje nao existe: o TSE entrega tudo em
 *    caixa alta, e "CICERO MACEDO DA SILVA" deveria sair como
 *    "Cicero Macedo da Silva".
 *
 * O que nao estiver no dicionario fica como a fonte entregou. Preferimos
 * deixar "Joao" (sem acento) a arriscar "João" numa palavra que nao e nome.
 */

export const dicionario = dicionarioCru as Record<string, string>;

/** Conectivos que ficam em minúscula no português. */
const CONECTIVOS = new Set([
  "DA", "DAS", "DE", "DO", "DOS", "E", "D", "A", "O",
]);

/** Prefixos e sufixos que os candidatos usam como apelido na urna. */
const PREFIXOS_TITULACAO = ["DR", "DRA", "PROF", "PROFA", "DEP", "DEPUTADO", "SENADOR", "PRESIDENTE", "GOVERNADOR", "PREFEITO", "PASTOR", "CORONEL", "SARGENTO", "MAJOR", "CAPITAO", "TENENTE", "COMANDANTE", "BISPO", "DOM"];

function ehSemAcento(palavra: string): string {
  return palavra
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Aplica o dicionário de acentos a uma palavra em caixa alta.
 * Se não houver entrada confiável, devolve a palavra como veio.
 */
export function acentuar(palavra: string): string {
  const maiuscula = palavra.toUpperCase();
  const base = ehSemAcento(maiuscula);

  const correcao = dicionario[base];
  if (correcao && ehSemAcento(correcao) === base) return correcao;

  return maiuscula;
}

/** Aplica acentos a todas as palavras de um texto. */
export function acentuarTexto(texto: string): string {
  return texto
    .split(/\s+/)
    .map((p) => (p ? acentuar(p) : p))
    .join(" ");
}

/**
 * Converte um nome do TSE em formato de leitura: acentos corrigidos e
 * capitalização normalizada.
 *
 *   "CICERO MACEDO DA SILVA" -> "Cicero Macedo da Silva"
 *   "PROFESSOR JOAO DA CRUZ" -> "Prof. João da Cruz"
 */
export function formatarNome(bruto: string): string {
  if (!bruto?.trim()) return "";

  const palavras = acentuarTexto(bruto.trim()).split(/\s+/);
  const total = palavras.length;

  const resultado = palavras.map((palavra, indice) => {
    const maiuscula = palavra.toUpperCase();
    const minuscula = palavra.toLowerCase();

    // Título professionally usada vem abreviada: "Prof.", "Dep.".
    if (indice === 0 && PREFIXOS_TITULACAO.includes(maiuscula)) {
      return maiuscula === "PROF" || maiuscula === "DEP"
        ? `${maiuscula.slice(0, 4)}.`
        : `${maiuscula.slice(0, 3)}.`;
    }

    // Conectivos no meio do nome ficam minúsculos: "da Silva", "de Souza".
    const ehConectivo =
      CONECTIVOS.has(maiuscula) &&
      indice > 0 &&
      indice < total - 1;

    if (ehConectivo) return minuscula;

    // Primeira e última letra maiúsculas, resto minúsculo: "Cicero", not "CICERO".
    return minuscula.charAt(0).toUpperCase() + minuscula.slice(1);
  });

  return resultado.join(" ");
}

/** Nome e partido para exibição nas listas. */
export function formatarNomeCurto(bruto: string, maximo = 28): string {
  const formatado = formatarNome(bruto);
  if (formatado.length <= maximo) return formatado;

  // Corte pelo primeiro espaço depois do limite, para não quebrar o nome.
  const cortado = formatado.slice(0, maximo);
  const ultimoEspaco = cortado.lastIndexOf(" ");
  return `${(ultimoEspaco > 10 ? cortado.slice(0, ultimoEspaco) : cortado).trim()}…`;
}
