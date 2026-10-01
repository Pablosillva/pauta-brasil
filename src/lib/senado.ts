/**
 * Senadores em exercicio, via API de Dados Abertos do Senado.
 *
 * Diferente da Camara, o Senado exige autenticacao: a API responde 401 sem a
 * chave. Por isso este modulo so e usado quando SENADO_API_KEY esta definida,
 * e a pagina degrada com uma explicacao em vez de mostrar zero Fácil.
 *
 * Chave gratuita: https://dadosabertos.senado.leg.br (cadastro por e-mail)
 */

const BASE = "https://dadosabertos.senado.leg.br/api/v3";
const REVALIDACAO = 3600;
const TIMEOUT_MS = 15000;

export interface Senador {
  codigo: string;
  nome: string;
  partido: string;
  uf: string;
  ufNome: string | null;
  /** Fotografia servida pelo Senado. */
  foto: string | null;
  email: string | null;
  telefone: string | null;
  partidoNome: string | null;
}

export function temChaveSenado(): boolean {
  return Boolean((process.env.SENADO_API_KEY ?? "").trim());
}

async function senado<T>(caminho: string): Promise<T | null> {
  const apiKey = (process.env.SENADO_API_KEY ?? "").trim();

  if (!apiKey) return null;

  try {
    const resposta = await fetch(`${BASE}${caminho}`, {
      headers: {
        Accept: "application/json",
        // O Senado aceita a chave no header X-Api-Key.
        "X-Api-Key": apiKey,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDACAO },
    });

    if (!resposta.ok) {
      console.error(`[senado] HTTP ${resposta.status} em ${caminho}`);
      return null;
    }

    return (await resposta.json()) as T;
  } catch (erro) {
    console.error(`[senado] falha em ${caminho}:`, (erro as Error).message);
    return null;
  }
}

interface RespostaSenadores {
  dados: {
    codigoSenador: string;
    nomeParlamentar: string;
    siglaPartido: string;
    nomePartido: string | null;
    siglaUf: string;
    nomeUf: string | null;
    foto: string | null;
    email: string | null;
    telefone: string | null;
  }[];
}

/** Lista de senadores em exercicio na legislatura atual. */
export async function listarSenadores(): Promise<Senador[]> {
  const dados = await senado<RespostaSenadores>(
    "/senador/lista/atual?ordem=ASC&ordenarPor=nomeParlamentar"
  );

  if (!dados?.dados) return [];

  return dados.dados.map((s) => ({
    codigo: s.codigoSenador,
    nome: s.nomeParlamentar,
    partido: s.siglaPartido || "—",
    partidoNome: s.nomePartido,
    uf: s.siglaUf || "—",
    ufNome: s.nomeUf,
    foto: s.foto,
    email: s.email,
    telefone: s.telefone,
  }));
}

export async function buscarSenador(codigo: string): Promise<Senador | null> {
  const dados = await senado<{
    dados: {
      codigoSenador: string;
      nomeParlamentar: string;
      siglaPartido: string;
      nomePartido: string | null;
      siglaUf: string;
      nomeUf: string | null;
      foto: string | null;
      email: string | null;
      telefone: string | null;
    };
  }>(`/senador/${codigo}`);

  const s = dados?.dados;

  if (!s) return null;

  return {
    codigo: s.codigoSenador,
    nome: s.nomeParlamentar,
    partido: s.siglaPartido || "—",
    partidoNome: s.nomePartido,
    uf: s.siglaUf || "—",
    ufNome: s.nomeUf,
    foto: s.foto,
    email: s.email,
    telefone: s.telefone,
  };
}
