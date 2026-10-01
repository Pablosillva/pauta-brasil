import estatisticasBrutas from "./tse/_estatisticas.json";

/** Resumo dos dados do TSE, gerado por scripts/gerar-estatisticas.mjs. */
export interface Estatisticas {
  geradoEm: string;
  total: number;
  comFoto: number;
  comPlano: number;
  comPropostas: number;
  partidos: { nome: string; quantidade: number }[];
  cargos: { nome: string; quantidade: number }[];
  ufs: { nome: string; quantidade: number }[];
  status: { nome: string; quantidade: number }[];
  genero: { nome: string; quantidade: number }[];
}

export const estatisticas = estatisticasBrutas as Estatisticas;

/** Sigla do partido -> slug usado na URL /partidos/[slug]. */
export function slugPartido(sigla: string): string {
  return sigla
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buscarPartido(sigla: string) {
  return estatisticas.partidos.find((p) => p.nome === sigla) ?? null;
}

export function partidosComSlugs() {
  return estatisticas.partidos.map((p) => ({
    ...p,
    slug: slugPartido(p.nome),
  }));
}
