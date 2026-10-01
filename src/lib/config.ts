/**
 * URL publica do site.
 *
 * Antes a string estava repetida em cinco arquivos, o que fez o dominio antigo
 * sobreviver a varias trocas de marca. Agora ha um unico lugar para mudar.
 *
 * NEXT_PUBLIC_SITE_URL precisa estar definido no ambiente (Vercel e .env.local).
 * O fallback abaixo e apenas para desenvolvimento.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Nome da marca, usado em textos e no schema.org. */
export const NOME_SITE = "Centro Politico";

/** Dominio sem esquema, util em comparacoes e avisos. */
export const DOMINIO = SITE_URL.replace(/^https?:\/\//, "");
