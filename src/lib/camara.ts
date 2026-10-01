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

/** Junta BASE e caminho garantindo exatamente uma barra entre os dois. */
function url(caminho: string): string {
  return `${BASE}/${caminho.replace(/^\/+/, "")}`;
}

/** 1 hora: suficientemente atual para um site informativo, barato para a API. */
const REVALIDACAO = 3600;

const TIMEOUT_MS = 12000;
const POR_PAGINA = 100;

/**
 * A API da Camara nao aguenta muitas requisicoes ao mesmo tempo: quando o build
 * monta varias paginas em paralelo, ela devolve uma pagina HTML de erro em
 * vez de JSON. Este semaforo limita a 3 chamadas simultaneas.
 */
const MAXIMO_PARALELO = 3;
let emVoo = 0;
const fila: (() => void)[] = [];

async function adquirirVaga(): Promise<void> {
  if (emVoo < MAXIMO_PARALELO) {
    emVoo++;
    return;
  }

  await new Promise<void>((resolver) => fila.push(resolver));
  emVoo++;
}

function liberarVaga(): void {
  emVoo--;
  const proximo = fila.shift();
  if (proximo) proximo();
}

const ESPERA_ENTRE_TENTATIVAS = 400;

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
 *
 * Faz ate 3 tentativas: o limite de taxa da Camara costuma responder com uma
 * pagina HTML em vez de JSON, e um nova tentativa resolve.
 */
async function camara<T>(
  caminho: string,
  revalidate = REVALIDACAO
): Promise<T | null> {
  const TENTATIVAS = 3;

  for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa++) {
    await adquirirVaga();

    try {
      const resposta = await fetch(url(caminho), {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        next: { revalidate },
      });

      // 429 e 5xx costumam ser transitorios.
      if (!resposta.ok) {
        if ((resposta.status === 429 || resposta.status >= 500) && tentativa < TENTATIVAS) {
          await new Promise((r) => setTimeout(r, ESPERA_ENTRE_TENTATIVAS * tentativa));
          continue;
        }

        console.error(`[camara] HTTP ${resposta.status} em ${caminho}`);
        return null;
      }

      const texto = await resposta.text();

      // Resposta que comeca com "<" e uma pagina de erro, nao JSON.
      if (texto.trimStart().startsWith("<")) {
        if (tentativa < TENTATIVAS) {
          await new Promise((r) => setTimeout(r, ESPERA_ENTRE_TENTATIVAS * tentativa));
          continue;
        }

        console.error(
          `[camara] resposta HTML em ${url(caminho)}\n` +
            `   status: ${resposta.status} | redirect: ${resposta.redirected}\n` +
            `   corpo: ${texto.slice(0, 200).replace(/\s+/g, " ")}`
        );
        return null;
      }

      return (JSON.parse(texto) as Envelope<T>).dados;
    } catch (erro) {
      if (tentativa < TENTATIVAS) {
        await new Promise((r) => setTimeout(r, ESPERA_ENTRE_TENTATIVAS * tentativa));
        continue;
      }

      console.error(`[camara] falha em ${caminho}:`, (erro as Error).message);
      return null;
    } finally {
      liberarVaga();
    }
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Deputados                                                          */
/* ------------------------------------------------------------------ */

/**
 * Todos os deputadores em exercício (~513).
 *
 * As páginas são trazidas em sequência até a API devolver uma lista vazia,
 * em vez de ler o total de páginas e buscar todas de uma vez: são ~6
 * requisições, e o limite de taxa da Câmara é sensível.
 */
export async function todosOsDeputados(): Promise<Deputado[]> {
  const base = `deputados?itens=${POR_PAGINA}&ordem=ASC&ordenarPor=nome`;

  const coletados: Deputado[] = [];

  for (let pagina = 1; pagina <= 10; pagina++) {
    const bloco = await camara<Deputado[]>(`${base}&pagina=${pagina}`);

    if (!bloco || bloco.length === 0) break;

    coletados.push(...bloco);

    // Menos de uma pagina cheia significa que chegamos ao fim da lista.
    if (bloco.length < POR_PAGINA) break;
  }

  return coletados;
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

/**
 * Quantas votações são abertas para montar o índice de votos.
 *
 * A API não oferece "votos de um deputado" (`/deputados/{id}/votos` responde
 * 405), mas responde bem "votos de uma votação". Então invertemos a direção:
 * abrimos as últimas votações nominais e montamos o índice aqui.
 *
 * O custo é uma requisição por votação, amortizado pelo cache de 1 hora.
 */
const VOTACOES_NO_INDICE = 12;

interface IndiceVotos {
  /** deputadoId -> [{ votacao, voto }] */
  porDeputado: Map<number, { votacao: Votacao; voto: string }[]>;
  /** Cacheado junto, evita refazer as consultas de votação. */
  votacoes: Votacao[];
}

/**
 * Índice de votos das últimas votações nominais, para uso em cálculo
 * estatístico (ranking de participação e de alinhamento partidário).
 *
 * A API não entrega "votos de um deputado", mas entrega "votos de uma
 * votação". Quem precisa de número agregado consulta por aqui em vez de
 * refazer as mesmas 12 requisições.
 */
export function indiceDeVotos(): Promise<IndiceVotos | null> {
  return obterIndice();
}

let indiceCache: { dados: IndiceVotos; geradoEm: number } | null = null;
const VALIDADE_INDICE_MS = REVALIDACAO * 1000;

async function construirIndice(): Promise<IndiceVotos> {
  const votacoes = await listarVotacoes(VOTACOES_NO_INDICE);

  const porDeputado = new Map<number, { votacao: Votacao; voto: string }[]>();

  for (const votacao of votacoes) {
    const votos = await votosDaVotacao(votacao.id);
    if (votos.length === 0) continue;

    for (const { tipoVoto, deputado } of votos) {
      const lista = porDeputado.get(deputado.id) ?? [];
      lista.push({ votacao, voto: tipoVoto });
      porDeputado.set(deputado.id, lista);
    }
  }

  return { porDeputado, votacoes };
}

async function obterIndice(): Promise<IndiceVotos | null> {
  if (
    indiceCache &&
    Date.now() - indiceCache.geradoEm < VALIDADE_INDICE_MS
  ) {
    return indiceCache.dados;
  }

  try {
    const dados = await construirIndice();
    indiceCache = { dados, geradoEm: Date.now() };
    return dados;
  } catch (erro) {
    console.error("[camara] falha ao montar o indice de votos:", erro);
    return null;
  }
}

/**
 * Votacoes em que um deputado aparece, com o voto registrado.
 *
 * Baseado nas últimas {@link VOTACOES_NO_INDICE} votações nominais, não no
 * histórico completo da legislatura.
 */
export async function votosDoDeputado(
  id: number,
  limite = 20
): Promise<{ votacao: Votacao; voto: string }[]> {
  const indice = await obterIndice();
  if (!indice) return [];

  const votos = indice.porDeputado.get(id) ?? [];

  return votos
    .slice()
    .sort(
      (a, b) =>
        new Date(b.votacao.dataHoraRegistro).getTime() -
        new Date(a.votacao.dataHoraRegistro).getTime()
    )
    .slice(0, limite);
}

/** As votações que compõem o índice, para exibir o aviso de recorte. */
export async function votacoesDoIndice(): Promise<Votacao[]> {
  const indice = await obterIndice();
  return indice?.votacoes ?? [];
}

export { VOTACOES_NO_INDICE };

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
/*  Projetos por parlamentar                                           */
/* ------------------------------------------------------------------ */

/**
 * Projetos de lei autoria de um parlamentar.
 *
 * A API filtra por NOME, nao por id: o endpoint `/deputados/{id}/proposicoes`
 * responde 405. Isso cria dois limites reais, declarados na tela: um nome
 * grafado de outra forma na base oficial nao encontra nada, e um homonimo
 * poderia trazer projetos de outra pessoa.
 */
export async function projetosDoDeputado(
  nome: string,
  itens = 30
): Promise<Proposicao[]> {
  if (!nome.trim()) return [];

  return await listarProposicoes({ itens, autor: nome });
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
