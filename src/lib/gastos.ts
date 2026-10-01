/**
 * Gastos de parlamentar — Portal da Transparência (CGU).
 *
 * A API do CGU exige uma chave obtida por cadastro gratuito em
 * https://www.portaldatransparencia.gov.br/api-de-dados/cadastrar-email
 * Sem a chave, todo endpoint responde 401. Por isso este modulo e usado
 * apenas quando PORTAL_TRANSPARENCIA_API_KEY esta definida.
 *
 * Atencao: a base da CGU indexa por nome, nao por id. O filtro por nome pode
 * agrupar mais de uma pessoa com o mesmo nome, por isso a tela sempre mostra
 * o nome exato consultado e os valores brutos.
 *
 * O nome do header e "chave-api-dados", todo em minusculo, conforme os exemplos
 * oficiais de Javascript, Java, PHP e .NET. Ja esteve como "Chave-Dados", que a
 * API nao le: a resposta era "Chave de API nao informada", indistinguivel de
 * falta de chave, e fazia uma chave valida parecer invalida.
 *
 * Limite de taxa declarado pela CGU: 400 requisicoes por minuto entre 6h e 23h59,
 * e 700 por minuto entre 0h e 5h59. O cache de uma hora abaixo mantem o uso
 * bem abaixo disso.
 */

const BASE = "https://api.portaldatransparencia.gov.br/api-de-dados";
const CABECALHO_CHAVE = "chave-api-dados";
const TIMEOUT_MS = 20000;

/**
 * A chave tem 32 caracteres alfanumericos minusculos, como no exemplo da
 * documentacao oficial. Validar o formato evita cadastrar por engano o
 * segredo de outro servico e esperar resultado que nunca vem.
 */
export function formatoDaChaveValido(chave: string): boolean {
  return /^[a-z0-9]{32}$/.test(chave.trim());
}

export interface Gasto {
  codigo: string;
  /** Descricao da despesa, como registrada no documento. */
  descricao: string;
  valor: number;
  data: string | null;
  orgao: string | null;
  documento: string | null;
}

export function temChavePortalTransparencia(): boolean {
  return Boolean((process.env.PORTAL_TRANSPARENCIA_API_KEY ?? "").trim());
}

export async function listarGastos(
  nome: string,
  itens = 40
): Promise<Gasto[] | null> {
  const apiKey = (process.env.PORTAL_TRANSPARENCIA_API_KEY ?? "").trim();

  if (!apiKey || !nome.trim()) return null;

  const params = new URLSearchParams({
    pagina: "1",
    tamanho: String(Math.min(itens, 100)),
    nome: nome.trim(),
  });

  try {
    const resposta = await fetch(`${BASE}/gastos?${params}`, {
      headers: {
        Accept: "application/json",
        [CABECALHO_CHAVE]: apiKey,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: 3600 },
    });

    if (!resposta.ok) {
      // A CGU distingue "chave nao informada" de "chave invalida". A primeira
      // mensagem aparece quando o header chega com o nome errado, e e o sinal
      // de que vale checar CABECALHO_CHAVE.
      const erro = await resposta.text().catch(() => "");
      const causa = erro.includes("não informada")
        ? "header recusado (confira o nome da variavel)"
        : erro.includes("inválida")
          ? "chave invalida ou nao ativada"
          : "";

      console.error(`[gastos] HTTP ${resposta.status} ao consultar gastos${causa ? `: ${causa}` : ""}`);
      return null;
    }

    const dados = (await resposta.json()) as {
      dados?: {
        codigo: string;
        descricao: string;
        valor: number;
        data?: string;
        orgao?: string;
        documento?: string;
      }[];
    };

    if (!Array.isArray(dados.dados)) return null;

    return dados.dados.map((g) => ({
      codigo: g.codigo,
      descricao: g.descricao,
      valor: Number(g.valor) || 0,
      data: g.data ?? null,
      orgao: g.orgao ?? null,
      documento: g.documento ?? null,
    }));
  } catch (erro) {
    console.error("[gastos] falha na consulta:", (erro as Error).message);
    return null;
  }
}

export function formatarValor(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
