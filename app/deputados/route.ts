import { NextResponse } from "next/server";

/**
 * A listagem de deputados virou /parlamentares, que alem dos federais traz
 * o Senado Federal.
 *
 * O redirecionamento permanente (308) preserva o valor de SEO das paginas ja
 * indexadas. As fichas individuais seguem em /deputados/{id}: nao existe
 * equivalente unico para os tres tipos de parlamentar.
 */
export async function GET(request: Request) {
  const { search } = new URL(request.url);

  return NextResponse.redirect(
    new URL(`/parlamentares${search}`, request.url),
    { status: 308 }
  );
}
