/** Rotas de navegacao compartilhadas entre o header e o menu mobile. */

export interface ItemNav {
  label: string;
  href: string;
}

/** Navegacao principal exibida na barra superior (desktop). */
export const navItems: ItemNav[] = [
  { label: "Início", href: "/" },
  { label: "Candidatos", href: "/candidatos" },
  { label: "Mapa Eleitoral", href: "/mapa" },
  { label: "Pautas", href: "/pautas" },
  { label: "Deputados", href: "/deputados" },
  { label: "Planos de Governo", href: "/planos" },
  { label: "Notícias", href: "/noticias" },
  { label: "Comparador", href: "/comparador" },
  { label: "Ferramentas", href: "/ferramentas" },
  { label: "Sobre", href: "/sobre" },
];

/** Grupos exibidos no menu mobile, onde o espaco e mais generoso. */
export const navMobile: { titulo: string; itens: ItemNav[] }[] = [
  { titulo: "Navegar", itens: navItems },
  {
    titulo: "Dados e método",
    itens: [
      { label: "Metodologia", href: "/metodologia" },
      { label: "Fontes de dados", href: "/fontes" },
      { label: "Partidos", href: "/partidos" },
      { label: "Temas", href: "/temas" },
      { label: "Todos os recursos", href: "/recursos" },
    ],
  },
];
