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
