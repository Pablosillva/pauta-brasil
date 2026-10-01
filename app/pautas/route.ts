import { NextResponse } from "next/server";

/**
 * A rota antiga /pautas virou /projetos.
 *
 * O redirecionamento permanente preserva o valor de SEO das paginas ja
 * indexadas pelo Google.
 */
export async function GET(request: Request) {
  const { pathname, search } = new URL(request.url);

  return NextResponse.redirect(new URL(`/projetos${search}`, pathname), {
    status: 308,
  });
}
