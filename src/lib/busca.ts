import { readFile, readdir } from "fs/promises";
import path from "path";
import { nomesEstados, type Candidato } from "@/data/candidatos";
import { listarNoticias, type Noticia } from "@/lib/noticias";
import { listarVotacoes, type Votacao } from "@/lib/camara";

const DIR = path.join(process.cwd(), "src/data/tse");

/** Remove acento e caixa, para comparar "SAUDE" com "saúde". */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function ehArquivoDeCandidatos(nome: string): boolean {
  return nome.endsWith(".json") && !nome.startsWith("_");
}

export interface ResultadoBusca {
  candidatos: Candidato[];
  noticias: Noticia[];
  pautas: Votacao[];
  total: number;
}

export interface OpcoesBusca {
  termo?: string;
  estado?: string;
  cargo?: string;
  partido?: string;
  limite?: number;
}

/**
 * Busca unificada sobre candidatos, noticias e pautas do Congresso.
 *
 * Os arquivos do TSE somam ~17 MB. Em vez de ler tudo sempre, so abrimos os
 * estados que podem conter o termo: quando ha busca textual, verificamos o
 * nome do arquivo contra o termo e ignoramos os que nao batem.
 */
export async function buscarTudo(opcoes: OpcoesBusca = {}): Promise<ResultadoBusca> {
  const termo = normalizar(opcoes.termo?.trim() ?? "");
  const limite = opcoes.limite ?? 60;

  const [candidatos, noticias, pautas] = await Promise.all([
    buscarCandidatos({ termo, estado: opcoes.estado, cargo: opcoes.cargo, partido: opcoes.partido, limite }),
    termo ? buscarNoticias(termo, limite) : Promise.resolve([]),
    termo ? buscarPautas(termo, 20) : Promise.resolve([]),
  ]);

  return {
    candidatos,
    noticias,
    pautas,
    total: candidatos.length + noticias.length + pautas.length,
  };
}

async function buscarCandidatos(filtros: {
  termo: string;
  estado?: string;
  cargo?: string;
  partido?: string;
  limite: number;
}): Promise<Candidato[]> {
  const { termo, limite } = filtros;

  const arquivos = (await readdir(DIR)).filter(ehArquivoDeCandidatos);

  // Com estado definido, so abrimos aquele arquivo.
  let alvo = arquivos;

  if (filtros.estado) {
    const uf = filtros.estado.replace(/^br-?/i, "").toUpperCase();
    alvo = arquivos.filter((a) => a.toUpperCase() === `${uf}.JSON`);
  }

  // Sem estado, descartamos os arquivos cujo nome nao bate com o termo.
  // Isso vale para nomes de partido e cargo (ex.: "MOBILIZA", "SENADOR").
  if (!filtros.estado && termo) {
    alvo = alvo.filter((arquivo) => {
      const nomeSemExtensao = arquivo.replace(/\.json$/i, "").toLowerCase();
      // Siglas de 2-3 letras (BR, SP, DF) e nomes genericos nao ajudam.
      if (nomeSemExtensao.length <= 3) return true;
      return nomeSemExtensao.includes(termo);
    });
  }

  const encontrados: Candidato[] = [];
  let percorreuTodos = true;

  for (const arquivo of alvo) {
    if (encontrados.length >= limite) {
      percorreuTodos = false;
      break;
    }

    try {
      const lista = JSON.parse(
        await readFile(path.join(DIR, arquivo), "utf-8")
      ) as Candidato[];

      for (const c of lista) {
        if (filtros.estado && c.estadoId !== normalizarEstado(filtros.estado)) {
          continue;
        }
        if (filtros.cargo && c.cargo !== filtros.cargo) continue;
        if (filtros.partido && c.partido !== filtros.partido) continue;

        if (termo && !candidatoBate(c, termo)) continue;

        encontrados.push(c);
        if (encontrados.length >= limite) break;
      }
    } catch {
      // arquivo ausente ou invalido: segue sem ele
    }
  }

  void percorreuTodos;
  return encontrados;
}

function normalizarEstado(estado: string): string {
  return `br-${estado.replace(/^br-?/i, "").toLowerCase()}`;
}

function candidatoBate(c: Candidato, termo: string): boolean {
  const campos = [
    c.nome,
    c.nomeUrna,
    c.partido,
    c.cargo,
    c.numero,
    c.ocupacao,
    c.grauInstrucao,
    nomesEstados[c.estadoId] ?? "",
    c.estadoId,
  ];

  return campos.some((campo) => normalizar(campo ?? "").includes(termo));
}

async function buscarNoticias(termo: string, limite: number): Promise<Noticia[]> {
  const noticias = await listarNoticias();

  return noticias
    .filter((n) => {
      const alvo = [
        n.titulo,
        n.resumo,
        n.categoria,
        n.autor,
        ...(n.tags ?? []),
      ]
        .map((t) => normalizar(t ?? ""))
        .join(" ");

      return alvo.includes(termo);
    })
    .slice(0, limite);
}

async function buscarPautas(termo: string, limite: number): Promise<Votacao[]> {
  const votacoes = await listarVotacoes(100);

  return votacoes
    .filter((v) => normalizar(v.descricao).includes(termo))
    .slice(0, limite);
}
