import { db } from "@/db";
import { noticias } from "@/db/schema";
import { eq, and, desc, lte } from "drizzle-orm";

export type { Noticia } from "@/db/schema";

/*
 * Duas leituras distintas, e a distincao importa:
 *
 *   listarTodasNoticias  area administrativa, ve rascunho e agendamento
 *   listarNoticias       site publico, so o que ja pode ser lido
 *
 * Sem essa separacao, uma noticia marcada como rascunho aparecia na home, na
 * pagina de noticias, na busca e no sitemap. E como o painel agora aceita
 * escolher a data, uma noticia agendada para amanha apareceria hoje.
 *
 * O que conta como "no ar": marcada como publicada e com a data de publicacao
 * ja vencida.
 */
function ehPublicavel(): ReturnType<typeof and> {
  return and(eq(noticias.publicado, true), lte(noticias.createdAt, new Date()));
}

export async function listarNoticias() {
  return await db
    .select()
    .from(noticias)
    .where(ehPublicavel())
    .orderBy(desc(noticias.createdAt));
}

export async function listarTodasNoticias() {
  return await db.select().from(noticias).orderBy(desc(noticias.createdAt));
}

export async function buscarNoticia(slug: string) {
  const resultado = await db
    .select()
    .from(noticias)
    .where(eq(noticias.slug, slug))
    .limit(1);
  return resultado[0] || null;
}

/** Igual a buscarNoticia, mas devolve null para rascunho e para data futura. */
export async function buscarNoticiaPublicada(slug: string) {
  const resultado = await db
    .select()
    .from(noticias)
    .where(and(eq(noticias.slug, slug), ehPublicavel()))
    .limit(1);
  return resultado[0] || null;
}

export interface DadosNoticia {
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  autor?: string;
  imagemCapa?: string | null;
  tags?: string[];
  destaque?: boolean;
  publicado?: boolean;
  /** Data de publicacao escolhida no painel. Padrao: agora. */
  dataPublicacao?: Date | null;
}

export function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 60);
}
/**
 * Prepara o conteudo Markdown antes de gravar e antes de renderizar.
 *
 * O que foi medido, e nao suposito:
 *
 * - CRLF nao quebra o MDX. Compilando o mesmo texto com LF e com CRLF, a
 *   saida sai byte a byte igual. A conversao para LF e feita mesmo assim para
 *   gravar texto uniforme, mas ela nao era a causa do problema de espaco.
 *
 * - Nao tentamos "consertar" marcadores colados ("-1", "##Titulo"). O regex
 *   capaz de fazer isso tambem quebra o que ja estava certo: em "## Titulo"
 *   ele casa o primeiro "#" e devolve "# # Titulo", e em "**negrito**" devolve
 *   "* *negrito*". Erro de digitacao se corrige na origem.
 *
 * O que de fato faltava era o plugin @tailwindcss/typography, sem o qual a
 * classe `prose` nao aplica espaco entre paragrafos, titulos nem listas.
 */
export function normalizarConteudo(bruto: string): string {
  return bruto
    // CRLF e CR viram LF
    .replace(/\r\n?/g, "\n")
    // Tres ou mais quebras viram uma: evita linha em branco sobrando
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
/** Garante um slug único, acrescentando -2, -3... se necessário. */
export async function gerarSlugUnico(titulo: string): Promise<string> {
  const base = slugify(titulo) || "noticia";
  let slug = base;
  let n = 2;

  while (await buscarNoticia(slug)) {
    slug = `${base}-${n}`;
    n++;
  }

  return slug;
}

export async function criarNoticia(dados: DadosNoticia) {
  const slug = await gerarSlugUnico(dados.titulo);

  const [criada] = await db
    .insert(noticias)
    .values({
      id: slug,
      slug,
      titulo: dados.titulo,
      resumo: dados.resumo,
      conteudo: normalizarConteudo(dados.conteudo),
      autor: dados.autor || "Redação Centro Político",
      categoria: dados.categoria,
      imagemCapa: dados.imagemCapa || null,
      tags: dados.tags ?? [],
      destaque: dados.destaque ?? false,
      publicado: dados.publicado ?? true,
      // Sem data escolhida, a noticia entra com a hora atual.
      createdAt: dados.dataPublicacao ?? new Date(),
    })
    .returning();

  return criada;
}

export async function atualizarNoticia(slug: string, dados: DadosNoticia) {
  const [atualizada] = await db
    .update(noticias)
    .set({
      titulo: dados.titulo,
      resumo: dados.resumo,
      conteudo: normalizarConteudo(dados.conteudo),
      categoria: dados.categoria,
      imagemCapa: dados.imagemCapa ?? null,
      tags: dados.tags ?? [],
      destaque: dados.destaque ?? false,
      publicado: dados.publicado ?? true,
      // A data escolhida no painel e o que o leitor ve.
      ...(dados.dataPublicacao ? { createdAt: dados.dataPublicacao } : {}),
      updatedAt: new Date(),
    })
    .where(eq(noticias.slug, slug))
    .returning();

  return atualizada ?? null;
}

export async function deletarNoticia(slug: string) {
  const removidas = await db
    .delete(noticias)
    .where(eq(noticias.slug, slug))
    .returning();

  return removidas.length > 0;
}
