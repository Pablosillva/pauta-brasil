/**
 * Cliente da API de Dados Abertos da Câmara dos Deputados.
 *
 * https://dadosabertos.camara.leg.br
 *
 * Todas as funções usam o cache do Next (`revalidate`), entao o trafego para a
 * Câmara fica limitado a uma consulta por intervalo. Nenhuma delas lanca excecao:
 * se a API estiver fora do ar, a pagina devolve estado vazio em vez de quebrar.
 */

const BASE = "https://dadosabertos.camara.leg.br/api/v2";

/** 1 hora: suficientemente atual para um site informativo, barato para a API. */
const REVALIDACAO = 3600;

const TIMEOUT_MS = 12000;
const POR_PAGINA = 100;

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

export interface Deputado {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  idLegislatura: number;
  urlFoto: string;
  email: string | null;
}

export interface DeputadoDetalhe {
  id: number;
  nome: string;
  nomeCivil: string | null;
  partido: string;
  uf: string;
  email: string | null;
  telefone: string | null;
  urlFoto: string;
  situacao: string | null;
  dataNascimento: string | null;
  ufNascimento: string | null;
  municipioNascimento: string | null;
  escolaridade: string | null;
  sexo: string | null;
  redesSociais: string[];
}

export interface Votacao {
  id: string;
  data: string;
  dataHoraRegistro: string;
  siglaOrgao: string;
  descricao: string;
  aprovacao: number;
}

export interface Proposicao {
  id: number;
  siglaTipo: string;
  numero: number;
  ano: number;
  ementa: string | null;
  dataApresentacao: string | null;
  uri: string;
  /** "PL 2630/2020" */
  identificacao: string;
}

export interface VotacaoDetalhe extends Votacao {
  descricaoAbertura: string | null;
  dataHoraAbertura: string | null;
  apresentacaoProposicao: string | null;
  objetosPossiveis: Proposicao[];
  proposicoesAfectadas: Proposicao[];
}

export interface VotoDeputado {
  tipoVoto: string;
  deputado: Deputado;
}

export interface Tramitacao {
  dataHora: string | null;
  siglaOrgao: string | null;
  nomeOrgao: string | null;
  etapa: string | null;
  texto: string | null;
  siglaSituacao: string | null;
  descricaoSituacao: string | null;
}

export interface Partido {
  id: number;
  sigla: string;
  nome: string;
  nomeCompleto: string | null;
  uri: string;
}

export interface ProposicaoDetalhe extends Proposicao {
  autores: string[];
  situacao: string | null;
  tema: string | null;
}

/* ------------------------------------------------------------------ */
/*  Fetch base                                                         */
/* ------------------------------------------------------------------ */

interface Envelope<T> {
  dados: T;
  links?: { rel: string; href: string }[];
}

/**
 * Consulta a API e devolve apenas o campo `dados`.
 * Retorna null em qualquer erro, para que a pagina degrade com elegância.
 */
async function camara<T>(caminho: string, revalidate = REVALIDACAO): Promise<T | null> {
  try {
    const resposta = await fetch(`${BASE}${caminho}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate },
    });

    if (!resposta.ok) {
      console.error(`[camara] HTTP ${resposta.status} em ${caminho}`);
      return null;
    }

    const envelope = (await resposta.json()) as Envelope<T>;
    return envelope.dados;
  } catch (erro) {
    console.error(`[camara] falha em ${caminho}:`, (erro as Error).message);
    return null;
  }
}

/** Número total de páginas, lido do link "last" da resposta paginada. */
async function contarPaginas(caminho: string): Promise<number> {
  try {
    const resposta = await fetch(`${BASE}${caminho}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: REVALIDACAO },
    });

    if (!resposta.ok) return 1;

    const envelope = (await resposta.json()) as Envelope<unknown[]>;
    const ultimo = envelope.links?.find((l) => l.rel === "last");
    if (!ultimo) return 1;

    const pagina = new URL(ultimo.href).searchParams.get("pagina");
    const n = pagina ? Number(pagina) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  } catch {
    return 1;
  }
}

/* ------------------------------------------------------------------ */
/*  Deputados                                                          */
/* ------------------------------------------------------------------ */

/**
 * Todos os deputados em exercício (~513). São baixados em blocos de 100,
 * todos em paralelo. O resultado fica em cache por uma hora.
 */
export async function todosOsDeputados(): Promise<Deputado[]> {
  const base = `deputados?itens=${POR_PAGINA}&ordem=ASC&ordenarPor=nome`;
  const totalPaginas = await contarPaginas(`${base}&pagina=1`);

  const blocos = await Promise.all(
    Array.from({ length: totalPaginas }, (_, i) =>
      camara<Deputado[]>(`${base}&pagina=${i + 1}`)
    )
  );

  return blocos.flatMap((b) => b ?? []);
}

export async function buscarDeputado(
  id: number
): Promise<DeputadoDetalhe | null> {
  const d = await camara<{
    id: number;
    nome: string;
    nomeCivil: string | null;
    sexo: string | null;
    dataNascimento: string | null;
    ufNascimento: string | null;
    municipioNascimento: string | null;
    escolaridade: string | null;
    redeSocial?: string[] | null;
    ultimoStatus: {
      nome: string;
      siglaPartido: string;
      siglaUf: string;
      email: string | null;
      urlFoto: string;
      situacao: string | null;
      gabinete?: { telefone?: string | null } | null;
    } | null;
  }>(`deputados/${id}`);

  if (!d) return null;

  const status = d.ultimoStatus;

  return {
    id: d.id,
    nome: status?.nome || d.nome,
    nomeCivil: d.nomeCivil,
    partido: status?.siglaPartido ?? "—",
    uf: status?.siglaUf ?? "—",
    email: status?.email ?? null,
    telefone: status?.gabinete?.telefone ?? null,
    urlFoto: status?.urlFoto ?? "",
    situacao: status?.situacao ?? null,
    dataNascimento: d.dataNascimento,
    ufNascimento: d.ufNascimento,
    municipioNascimento: d.municipioNascimento,
    escolaridade: d.escolaridade,
    sexo: d.sexo,
    redesSociais: d.redeSocial ?? [],
  };
}

/** Últimas votações de um deputado. */
export async function votosDoDeputado(
  id: number,
  itens = 20
): Promise<{ votacao: Votacao; voto: string }[]> {
  const dados = await camara<{ votacao: Votacao; voto: string }[]>(
    `deputados/${id}/votos?itens=${itens}`
  );

  return dados ?? [];
}

/* ------------------------------------------------------------------ */
/*  Votações                                                           */
/* ------------------------------------------------------------------ */

export async function listarVotacoes(
  itens = 20,
  pagina = 1,
  filtro?: { dataInicio?: string; dataFim?: string }
): Promise<Votacao[]> {
  const params = new URLSearchParams({
    itens: String(itens),
    pagina: String(pagina),
  });

  if (filtro?.dataInicio) params.set("dataInicio", filtro.dataInicio);
  if (filtro?.dataFim) params.set("dataFim", filtro.dataFim);

  return (await camara<Votacao[]>(`votacoes?${params}`)) ?? [];
}

function paraProposicao(p: {
  id: number;
  siglaTipo: string;
  numero: number;
  ano: number;
  ementa: string | null;
  dataApresentacao: string | null;
  uri: string;
}): Proposicao {
  return {
    ...p,
    identificacao: `${p.siglaTipo} ${p.numero}/${p.ano}`,
  };
}

export async function buscarVotacao(
  id: string
): Promise<VotacaoDetalhe | null> {
  const d = await camara<{
    id: string;
    data: string;
    dataHoraRegistro: string;
    siglaOrgao: string;
    descricao: string;
    aprovacao: number;
    descUltimaAberturaVotacao: string | null;
    dataHoraUltimaAberturaVotacao: string | null;
    ultimaApresentacaoProposicao?: { descricao: string | null } | null;
    objetosPossiveis?: Parameters<typeof paraProposicao>[0][];
    proposicoesAfetadas?: Parameters<typeof paraProposicao>[0][];
  }>(`votacoes/${encodeURIComponent(id)}`);

  if (!d) return null;

  return {
    id: d.id,
    data: d.data,
    dataHoraRegistro: d.dataHoraRegistro,
    siglaOrgao: d.siglaOrgao,
    descricao: d.descricao,
    aprovacao: d.aprovacao,
    descricaoAbertura: d.descUltimaAberturaVotacao,
    dataHoraAbertura: d.dataHoraUltimaAberturaVotacao,
    apresentacaoProposicao: d.ultimaApresentacaoProposicao?.descricao ?? null,
    objetosPossiveis: (d.objetosPossiveis ?? []).map(paraProposicao),
    proposicoesAfectadas: (d.proposicoesAfetadas ?? []).map(paraProposicao),
  };
}

/** Como cada deputado votou em uma votação específica. */
export async function votosDaVotacao(
  id: string
): Promise<VotoDeputado[]> {
  const dados = await camara<{ tipoVoto: string; deputado_?: Deputado }[]>(
    `votacoes/${encodeURIComponent(id)}/votos`
  );

  return (dados ?? [])
    .filter((v): v is { tipoVoto: string; deputado_: Deputado } => Boolean(v.deputado_))
    .map((v) => ({ tipoVoto: v.tipoVoto, deputado: v.deputado_ }));
}

/* ------------------------------------------------------------------ */
/*  Proposições                                                        */
/* ------------------------------------------------------------------ */

export async function listarProposicoes(
  opts: {
    itens?: number;
    pagina?: number;
    siglaTipo?: string;
    ano?: number;
    autor?: string;
  } = {}
): Promise<Proposicao[]> {
  const params = new URLSearchParams({
    itens: String(opts.itens ?? 20),
    pagina: String(opts.pagina ?? 1),
    ordem: "DESC",
    ordenarPor: "id",
  });

  if (opts.siglaTipo) params.set("siglaTipo", opts.siglaTipo);
  if (opts.ano) params.set("ano", String(opts.ano));
  if (opts.autor) params.set("autor", opts.autor);

  const dados = (await camara<Parameters<typeof paraProposicao>[0][]>(
    `proposicoes?${params}`
  )) ?? [];

  return dados.map(paraProposicao);
}

export async function buscarProposicao(
  id: number
): Promise<ProposicaoDetalhe | null> {
  const d = await camara<Parameters<typeof paraProposicao>[0] & {
    autores?: { nome: string }[];
    ultimaSituacao?: { descricaoSituacao: string | null } | null;
    temas?: string[] | null;
  }>(`proposicoes/${id}`);

  if (!d) return null;

  const base = paraProposicao(d);

  return {
    ...base,
    autores: (d.autores ?? []).map((a) => a.nome),
    situacao: d.ultimaSituacao?.descricaoSituacao ?? null,
    tema: d.temas?.[0] ?? null,
  };
}

/** Tramitação completa: o dossiê de cada projeto de lei. */
export async function tramitacaoDaProposicao(
  id: number
): Promise<Tramitacao[]> {
  return (
    (await camara<Tramitacao[]>(`proposicoes/${id}/tramitacoes`)) ?? []
  );
}

/* ------------------------------------------------------------------ */
/*  Partidos                                                           */
/* ------------------------------------------------------------------ */

export async function listarPartidos(): Promise<Partido[]> {
  return (
    (await camara<
      { id: number; sigla: string; nome: string; nomeCompleto: string | null; uri: string }[]
    >("partidos?itens=60&ordem=ASC&ordenarPor=sigla")) ?? []
  );
}

/* ------------------------------------------------------------------ */
/*  Utilidades                                                         */
/* ------------------------------------------------------------------ */

export type CorVoto = "verde" | "vermelho" | "neutro";

export function rotuloVoto(voto: string): { texto: string; cor: CorVoto } {
  const normalizado = voto.trim();

  if (normalizado.startsWith("Sim")) return { texto: "Sim", cor: "verde" };
  if (normalizado.startsWith("Não") || normalizado.startsWith("Nao")) {
    return { texto: "Não", cor: "vermelho" };
  }
  if (normalizado.startsWith("Absten")) return { texto: "Abstenção", cor: "neutro" };
  if (normalizado.startsWith("Voto não registrado")) {
    return { texto: "Não registrado", cor: "neutro" };
  }

  return { texto: normalizado || "—", cor: "neutro" };
}

/** Extrai "PL 2630/2020" da descrição textual de uma votação. */
export function extrairIdentificacao(texto: string): string | null {
  const achado = texto.match(
    /\b(PLP|PL|PEC|MP)\s+n?o?\s*([\d.]+)\s*,?\s*de\s*(\d{4})/i
  );

  if (!achado) return null;

  return `${achado[1].toUpperCase()} ${achado[2]}/${achado[3]}`;
}

/** Converte data ISO da Câmara ("2026-09-03T17:28:34") em Date. */
export function dataDaCamara(iso: string | null): Date | null {
  if (!iso) return null;
  const data = new Date(iso);
  return Number.isNaN(data.getTime()) ? null : data;
}
