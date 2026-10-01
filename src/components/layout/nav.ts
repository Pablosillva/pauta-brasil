/** Rotas de navegacao compartilhadas entre o header e o menu mobile. */

export interface ItemNav {
  label: string;
  href: string;
  descricao?: string;
}

/** Item que abre submenu no desktop. */
export interface GrupoNav {
  label: string;
  itens: ItemNav[];
}

/** Submenu de Eleicoes: o que o eleitor procura primeiro. */
export const eleicoes: ItemNav[] = [
  {
    label: "Candidatos",
    href: "/candidatos",
    descricao: "Todos os inscritos no TSE",
  },
  {
    label: "Mapa eleitoral",
    href: "/mapa",
    descricao: "Distribuicao por estado",
  },
  {
    label: "Planos de governo",
    href: "/planos",
    descricao: "PDFs enviados ao TSE",
  },
];

/** Navegacao principal exibida na barra superior (desktop). */
export const navItems: ItemNav[] = [
  { label: "Início", href: "/" },
  { label: "Projetos", href: "/projetos" },
  { label: "Parlamentares", href: "/parlamentares" },
  { label: "Notícias", href: "/noticias" },
  { label: "Ferramentas", href: "/ferramentas" },
  { label: "Sobre", href: "/sobre" },
];

/** Grupos do menu mobile, onde o espaco permite mais detalhe. */
export const navMobile: { titulo: string; itens: ItemNav[] }[] = [
  {
    titulo: "Eleicoes 2026",
    itens: eleicoes,
  },
  {
    titulo: "Congresso",
    itens: [
      { label: "Projetos e votacoes", href: "/projetos" },
      { label: "Parlamentares", href: "/parlamentares" },
      { label: "Notícias", href: "/noticias" },
    ],
  },
  {
    titulo: "Navegar",
    itens: [
      { label: "Início", href: "/" },
      { label: "Ferramentas", href: "/ferramentas" },
      { label: "Sobre", href: "/sobre" },
    ],
  },
  {
    titulo: "Dados e metodo",
    itens: [
      { label: "Metodologia", href: "/metodologia" },
      { label: "Fontes de dados", href: "/fontes" },
      { label: "Partidos", href: "/partidos" },
      { label: "Todos os recursos", href: "/recursos" },
    ],
  },
];
