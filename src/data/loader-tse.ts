import type { Candidato } from "./candidatos";
import indice from "./tse/_indice.json";

const cache = new Map<string, Candidato[]>();

export function estadosDisponiveis(): string[] {
  return Object.keys(indice);
}

export function totalDoEstado(uf: string): number {
  return (indice as Record<string, number>)[uf.toUpperCase()] ?? 0;
}

export function totalGeral(): number {
  return Object.values(indice as Record<string, number>).reduce(
    (a, b) => a + b,
    0
  );
}

export async function carregarCandidatosDoEstado(
  uf: string
): Promise<Candidato[]> {
  const ufUpper = uf.toUpperCase();

  if (cache.has(ufUpper)) {
    return cache.get(ufUpper)!;
  }

  try {
    const mod: unknown = await import(`./tse/${ufUpper.toLowerCase()}.json`);

    // O import dinamico pode devolver { default: [...] } ou o array direto.
    const bruto =
      mod && typeof mod === "object" && "default" in mod
        ? (mod as { default: unknown }).default
        : mod;

    if (!Array.isArray(bruto)) {
      console.error(`Formato inesperado para ${ufUpper}:`, typeof bruto);
      return [];
    }

    const lista = bruto as Candidato[];
    cache.set(ufUpper, lista);
    return lista;
  } catch (err) {
    console.error(`Erro ao carregar ${ufUpper}:`, err);
    return [];
  }
}