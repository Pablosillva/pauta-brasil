import { readFile } from "fs/promises";
import path from "path";
import { nomesEstados, type Candidato } from "@/data/candidatos";

/** Extrai a UF de um id de candidato do TSE (ex.: "BR-SP-12345" -> "SP"). */
export function ufDoCandidato(id: string): string | null {
  const partes = id.split("-");
  for (let i = 0; i < partes.length - 1; i++) {
    if (partes[i].toUpperCase() === "BR" && partes[i + 1]) {
      return partes[i + 1].toUpperCase();
    }
  }
  const achado = partes.find((p) => /^[A-Z]{2}$/i.test(p));
  return achado ? achado.toUpperCase() : null;
}

const cache = new Map<string, Candidato | null>();

/**
 * Busca um candidato pelo id do TSE.
 * Retorna null se nao existir (ou se o arquivo do estado nao estiver no build).
 */
export async function buscarCandidatoPorId(
  id: string
): Promise<Candidato | null> {
  if (cache.has(id)) return cache.get(id)!;

  const uf = ufDoCandidato(id);
  if (!uf) {
    cache.set(id, null);
    return null;
  }

  try {
    const arquivo = path.join(
      process.cwd(),
      "src/data/tse",
      `${uf.toLowerCase()}.json`
    );
    const conteudo = await readFile(arquivo, "utf-8");
    const lista = JSON.parse(conteudo) as Candidato[];
    const encontrado = lista.find((c) => c.id === id) ?? null;
    cache.set(id, encontrado);
    return encontrado;
  } catch {
    cache.set(id, null);
    return null;
  }
}

/** Busca varios candidatos de uma vez, reusando o mesmo arquivo de estado. */
export async function buscarCandidatos(ids: string[]): Promise<Candidato[]> {
  const porUf = new Map<string, string[]>();

  for (const id of ids) {
    const uf = ufDoCandidato(id);
    if (!uf) continue;
    porUf.set(uf, [...(porUf.get(uf) ?? []), id]);
  }

  const encontrados: Candidato[] = [];

  for (const [uf, idsDoUf] of porUf) {
    try {
      const arquivo = path.join(
        process.cwd(),
        "src/data/tse",
        `${uf.toLowerCase()}.json`
      );
      const lista = JSON.parse(await readFile(arquivo, "utf-8")) as Candidato[];
      for (const id of idsDoUf) {
        const c = lista.find((x) => x.id === id);
        if (c) encontrados.push(c);
      }
    } catch {
      // arquivo ausente: segue sem esses candidatos
    }
  }

  return encontrados;
}

export function nomeEstadoDoCandidato(c: Candidato): string {
  return nomesEstados[`br-${c.estadoId.toLowerCase().replace(/^br-?/, "")}`] ?? c.estadoId.toUpperCase();
}
