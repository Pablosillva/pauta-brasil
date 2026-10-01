/**
 * Senadores em exercicio.
 *
 * Usa o endpoint legado do Senado, que responde XML e NAO exige chave de API:
 * https://legis.senado.leg.br/dadosabertos/dados/ListaParlamentarEmExercicio.xml
 *
 * A API nova (dadosabertos.senado.leg.br/api/v3) devolve 401 sem autenticacao,
 * entao nao serve para um site publico. O arquivo XML e atualizado pelo
 * proprio Senado e traz nome, partido, UF, bloco, foto e email.
 *
 * Como o payload e XML e nao JSON, usamos regex em vez de um parser completo:
 * o formato e gerado pela Camara dos Deputados, bem previsivel, e o arquivo
 * tem cerca de 200 KB.
 */

const URL_DADOS =
  "https://legis.senado.leg.br/dadosabertos/dados/ListaParlamentarEmExercicio.xml";

const TIMEOUT_MS = 25000;

export interface Senador {
  codigo: string;
  nome: string;
  nomeCompleto: string | null;
  partido: string;
  uf: string;
  bloco: string | null;
  lideranca: boolean;
  mesa: boolean;
  email: string | null;
  telefone: string | null;
  foto: string | null;
  pagina: string | null;
  suplentes: { nome: string; participacao: string }[];
}

export interface DadoSenado {
  /** Data da ultima atualizacao do arquivo, como consta no XML. */
  versao: string | null;
  Senado: Senador[];
}

/** Texto do primeiro grupo de captura de uma tag, ou null. */
function tag(xml: string, nome: string): string | null {
  const achado = xml.match(new RegExp(`<${nome}>([^<]*)</${nome}>`));
  return achado ? achado[1].trim() : null;
}

/** Todos os valores de uma tag que pode se repetir (telefones, suplentes). */
function todasTags(xml: string, nome: string): string[] {
  return [...xml.matchAll(new RegExp(`<${nome}>([^<]*)</${nome}>`, "g"))].map(
    (m) => m[1].trim()
  );
}

/** O Senado devolve ISO-8859-1; o Node decodifica como latin1. */
function paraTexto(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString("latin1");
}

export async function obterSenadores(): Promise<DadoSenado> {
  try {
    const resposta = await fetch(URL_DADOS, {
      headers: { Accept: "application/xml, text/xml" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: 3600 },
    });

    if (!resposta.ok) {
      console.error(`[senado] HTTP ${resposta.status} ao baixar a lista`);
      return { versao: null, Senado: [] };
    }

    const xml = paraTexto(await resposta.arrayBuffer());

    // Recortamos cada bloco <Parlamentar> para nao misturar telefones e suplentes
    // blocos para nao misturar telefones e suplentes de pessoas diferentes.
    const blocos = xml
      .split("<Parlamentar>")
      .slice(1)
      .map((parte) => parte.split("</Parlamentar>")[0]);

    const lista: Senador[] = [];

    for (const bloco of blocos) {
      const nome = tag(bloco, "NomeParlamentar");
      const codigo = tag(bloco, "CodigoParlamentar");

      if (!nome || !codigo) continue;

      lista.push({
        codigo,
        nome,
        nomeCompleto: tag(bloco, "NomeCompletoParlamentar"),
        partido: tag(bloco, "SiglaPartidoParlamentar") ?? "—",
        uf: tag(bloco, "UfParlamentar") ?? "—",
        bloco: tag(bloco, "NomeApelido"),
        lideranca: tag(bloco, "MembroLideranca") === "Sim",
        mesa: tag(bloco, "MembroMesa") === "Sim",
        email: tag(bloco, "EmailParlamentar"),
        telefone: todasTags(bloco, "NumeroTelefone")[0] ?? null,
        // A foto vem em http; forçamos https para não gerar aviso de mixed content.
        foto: tag(bloco, "UrlFotoParlamentar")?.replace(
          /^http:/,
          "https:"
        ) ?? null,
        pagina: tag(bloco, "UrlPaginaParlamentar")?.replace(
          /^http:/,
          "https:"
        ) ?? null,
        suplentes: (() => {
          // Suplentes vem em pares (participacao, codigo, nome).
          const partes = bloco.split("<Suplente>").slice(1);
          return partes.map((s) => ({
            participacao: tag(s, "DescricaoParticipacao") ?? "Suplente",
            nome: tag(s, "NomeParlamentar") ?? "—",
          }));
        })(),
      });
    }

    lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

    return { versao: tag(xml, "Data"), Senado: lista };
  } catch (erro) {
    console.error("[senado] falha ao baixar a lista:", (erro as Error).message);
    return { versao: null, Senado: [] };
  }
}

export async function listarSenadores(): Promise<Senador[]> {
  return (await obterSenadores()).Senado;
}

export async function buscarSenador(codigo: string): Promise<Senador | null> {
  const lista = await listarSenadores();
  return lista.find((s) => s.codigo === codigo) ?? null;
}
