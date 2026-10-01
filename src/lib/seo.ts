import { nomesEstados } from "@/data/candidatos";
import { SITE_URL, NOME_SITE } from "@/lib/config";
export function jsonLdSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: NOME_SITE,
    url: SITE_URL,
    description:
      "Portal de informação política brasileira. Mapa eleitoral, candidatos, comparador de propostas e notícias.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/busca?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: NOME_SITE,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
  };
}

export function jsonLdCandidato(candidato: {
  nome: string;
  cargo: string;
  partido: string;
  estadoId: string;
  foto: string;
}) {
  const fotoAbsoluta = candidato.foto.startsWith("http")
    ? candidato.foto
    : `${SITE_URL}${candidato.foto}`;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: candidato.nome,
    jobTitle: candidato.cargo,
    affiliation: {
      "@type": "Organization",
      name: candidato.partido,
    },
    image: fotoAbsoluta,
    address: {
      "@type": "PostalAddress",
      addressRegion: nomesEstados[candidato.estadoId] ?? candidato.estadoId,
      addressCountry: "BR",
    },
  };
}

/**
 * Normaliza o valor do token do Search Console.
 *
 * A tela do Google mostra a tag HTML inteira, e o reflexo natural e copiar a
 * linha toda. Quando isso acontece, o Next.js escapa o markup e o site passa
 * a entregar isto no head:
 *
 *   <meta name="google-site-verification" content="&lt;meta name=&quot;...&quot; /&gt;" />
 *
 * O content fica com a tag em vez do token, e o Search Console recusa com
 * "sua metatag nao esta formatada corretamente". Foi exatamente o que
 * aconteceu com a variavel do Vercel.
 *
 * Aqui aceitamos todas as formas em que o token costuma ser colado:
 *
 *   JGTBz0Q2...                                   (so o token)
 *   google-site-verification=JGTBz0Q2...          (com o prefixo)
 *   <meta name="google-site-verification" content="JGTBz0Q2..." />
 *
 * Se nao reconhecer nenhum dos formatos, devolve o valor sem mexer: e melhor
 * deixar o Google recusar e dizer qual formato ele quer do que devolver vazio
 * e sumir com a meta tag.
 */
export function normalizarTokenGoogle(valor: string | undefined): string | undefined {
  const bruto = (valor ?? "").trim();

  if (!bruto) return undefined;

  // 1) A tag inteira: extrai o content, aceitando aspas simples ou duplas.
  const tag = bruto.match(
    /<meta[^>]*name\s*=\s*["']google-site-verification["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/i
  );
  if (tag) return tag[1].trim();

  // 2) content= sem a tag em volta, util para quem copia o atributo sozinho.
  const atributo = bruto.match(/content\s*=\s*["']?([^"'\s>]+)["']?/i);
  if (atributo && /google-site-verification/i.test(bruto)) {
    return atributo[1].trim();
  }

  // 3) O token com o prefixo, ou o token sozinho.
  const comPrefixo = bruto.replace(/^google-site-verification\s*=\s*/i, "").trim();
  return comPrefixo || undefined;
}

export function jsonLdBreadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function jsonLdNewsArticle(noticia: {
  titulo: string;
  resumo: string;
  data: string;
  autor: string;
  id: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: noticia.titulo,
    description: noticia.resumo,
    datePublished: noticia.data,
    author: { "@type": "Person", name: noticia.autor },
    publisher: {
      "@type": "Organization",
      name: NOME_SITE,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/noticias/${noticia.id}`,
    },
  };
}
