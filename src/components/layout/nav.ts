/** Rotas de navegacao compartilhadas entre o header e o menu mobile. */

export interface ItemNav {
  label: string;
  href: string;
  descricao?: string;
}

export interface GrupoNav {
  label: string;
  itens: ItemNav[];
}

/**
 * Submenu de Eleicoes: o que o eleitor procura primeiro.
 * Rotas dos candidatos de 2026 vindas do TSE.
 */
export const eleicoes: ItemNav[] = [
  {
    label: "Candidatos",
    href: "/candidatos",
    descricao: "Todos os inscritos no TSE",
  },
  {
    label: "Mapa eleitoral",
    href: "/mapa",
    descricao: "Distribuição por estado",
  },
  {
    label: "Planos de governo",
    href: "/planos",
    descricao: "PDFs enviados ao TSE",
  },
];

/**
 * Submenu de Parlamentares: as duas casas do Congresso.
 * A listagem e unica (/parlamentares, com abas), mas os links seguem
 * diretos para a aba desejada via query string.
 */
export const parlamentares: ItemNav[] = [
  {
    label: "Deputados federais",
    href: "/parlamentares?casa=camara",
    descricao: "513 em exercício, com votos",
  },
  {
    label: "Senadores",
    href: "/parlamentares?casa=senado",
    descricao: "81 em exercício",
  },
  {
    label: "Projetos e votações",
    href: "/projetos",
    descricao: "Placar e voto de cada um",
  },
];

/**
 * Navegacao simples do header. "Início" e os submenus ficam de fora, sao
 * renderizados separadamente. "Projetos" tambem: ja aparece dentro do
 * submenu Parlamentares, e repetir aqui polui a barra.
 */
export const navItems: ItemNav[] = [
  { label: "Portal", href: "/portal" },
  { label: "Notícias", href: "/noticias" },
  { label: "Ferramentas", href: "/ferramentas" },
  { label: "Sobre", href: "/sobre" },
];

/** Grupos do menu mobile, onde o espaco permite mais detalhe. */
export const navMobile: { titulo: string; itens: ItemNav[] }[] = [
  { titulo: "Eleições 2026", itens: eleicoes },
  { titulo: "Congresso", itens: parlamentares },
  {
    titulo: "Navegar",
    itens: [
      { label: "Início", href: "/" },
      { label: "Portal", href: "/portal" },
      { label: "Notícias", href: "/noticias" },
      { label: "Ferramentas", href: "/ferramentas" },
      { label: "Sobre", href: "/sobre" },
    ],
  },
  {
    titulo: "Dados e método",
    itens: [
      { label: "Metodologia", href: "/metodologia" },
      { label: "Fontes de dados", href: "/fontes" },
      { label: "Partidos", href: "/partidos" },
      { label: "Todos os recursos", href: "/recursos" },
    ],
  },
];
