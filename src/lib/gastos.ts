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
 */

const BASE = "https://api.portaldatransparencia.gov.br/api-de-dados";
const TIMEOUT_MS = 20000;

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
        "Chave-Dados": apiKey,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: 3600 },
    });

    if (!resposta.ok) {
      console.error(`[gastos] HTTP ${resposta.status} ao consultar gastos`);
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
