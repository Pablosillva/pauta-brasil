import { NextResponse } from "next/server";

/**
 * A pagina antiga /ferramentas/historico continha votacoes inventadas
 * (Arthur Lira, Pacheco e Hugo Motta com votos ficticios). Foi substituida por
 * /ferramentas/historico-votacao, que usa a API oficial da Camara.
 *
 * O redirect 308 preserva o valor de SEO e, principalmente, retira do ar um
 * inventario de votacoes que nunca existiram.
 */
export async function GET(request: Request) {
  const { search } = new URL(request.url);

  return NextResponse.redirect(
    new URL(`/ferramentas/historico-votacao${search}`, request.url),
    { status: 308 }
  );
}
