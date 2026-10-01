import { nomesEstados } from "@/data/candidatos";

/** UFs em ordem alfabética pelo nome, com o código de duas letras. */
export const ufs: { sigla: string; nome: string }[] = Object.entries(nomesEstados)
  .map(([id, nome]) => ({ sigla: id.replace(/^br-/, "").toUpperCase(), nome }))
  .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

export function nomeUf(sigla: string | null | undefined): string {
  if (!sigla) return "";
  const alvo = sigla.toUpperCase();
  return ufs.find((u) => u.sigla === alvo)?.nome ?? sigla;
}
