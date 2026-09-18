export interface Proposta {
  area: string;         // "Saúde", "Educação", "Economia"...
  resumo: string;       // Texto curto
}

export interface Candidato {
  id: string;
  nome: string;
  numero: string;
  partido: string;
  cargo: "Presidente" | "Governador" | "Senador" | "Deputado Federal" | "Deputado Estadual";
  estadoId: string;
  foto: string;
  idade: number;
  genero: "M" | "F";
  status: "Candidato oficial" | "Pré-candidato" | "Eleito" | "Atual ocupante";
  // ⬇️ Agora opcionais
  bio?: string;
  propostas?: Proposta[];
  planoGovernoUrl?: string;
  historico?: { cargo: string; periodo: string }[];
  patrimonio?: { bem: string; valor: string }[];
  redesSociais?: { rede: string; url: string }[];
}

export const candidatos: Candidato[] = [
  // São Paulo
  {
    id: "sp-gov-1",
    nome: "Tarcísio de Freitas",
    numero: "10",
    partido: "Republicanos",
    cargo: "Governador",
    estadoId: "br-sp",
    foto: "https://i.pravatar.cc/150?img=12",
    idade: 49,
    genero: "M",
    status: "Atual ocupante",
    bio: "Engenheiro civil e político brasileiro. Atual governador do Estado de São Paulo. Foi Ministro da Infraestrutura entre 2019 e 2022.",
    propostas: [
      { area: "Segurança", resumo: "Ampliar o efetivo policial e integrar as forças de segurança do estado em um sistema unificado de inteligência." },
      { area: "Educação", resumo: "Expandir o programa de escolas cívico-militares e ampliar o ensino técnico integrado ao ensino médio." },
      { area: "Saúde", resumo: "Reduzir filas de cirurgias eletivas e ampliar a rede de atenção primária nos municípios." },
      { area: "Economia", resumo: "Atrair investimentos privados e reduzir a burocracia para abertura de empresas em até 50%." },
    ],
    planoGovernoUrl: "#",
    historico: [
      { cargo: "Governador de São Paulo", periodo: "2023 — atual" },
      { cargo: "Ministro da Infraestrutura", periodo: "2019 — 2022" },
      { cargo: "Diretor-geral do DNIT", periodo: "2016 — 2018" },
    ],
    patrimonio: [
      { bem: "Apartamento em São Paulo (SP)", valor: "R$ 1.200.000,00" },
      { bem: "Veículo Toyota Corolla", valor: "R$ 130.000,00" },
      { bem: "Aplicações financeiras", valor: "R$ 350.000,00" },
    ],
    redesSociais: [
      { rede: "Instagram", url: "#" },
      { rede: "Twitter", url: "#" },
      { rede: "Facebook", url: "#" },
    ],
  },
  {
    id: "sp-gov-2",
    nome: "Fernando Haddad",
    numero: "13",
    partido: "PT",
    cargo: "Governador",
    estadoId: "br-sp",
    foto: "https://i.pravatar.cc/150?img=15",
    idade: 62,
    genero: "M",
    status: "Pré-candidato",
    bio: "Professor universitário, advogado e político. Foi prefeito de São Paulo (2013-2016) e Ministro da Fazenda (2023-2024).",
    propostas: [
      { area: "Educação", resumo: "Ampliar a oferta de vagas em creches e ensino técnico público, com meta de universalizar o acesso." },
      { area: "Saúde", resumo: "Fortalecer o SUS estadual com mais médicos de família e expansão da rede de hospitais regionais." },
      { area: "Economia", resumo: "Retomar o papel do estado como indutor do desenvolvimento, com foco em infraestrutura e inovação." },
      { area: "Meio Ambiente", resumo: "Metas ambiciosas de redução de desmatamento e transição energética justa." },
    ],
    planoGovernoUrl: "#",
    historico: [
      { cargo: "Ministro da Fazenda", periodo: "2023 — 2024" },
      { cargo: "Prefeito de São Paulo", periodo: "2013 — 2016" },
      { cargo: "Ministro da Educação", periodo: "2005 — 2012" },
    ],
    patrimonio: [
      { bem: "Casa em São Paulo (SP)", valor: "R$ 2.100.000,00" },
      { bem: "Aplicações financeiras", valor: "R$ 500.000,00" },
    ],
    redesSociais: [
      { rede: "Instagram", url: "#" },
      { rede: "Twitter", url: "#" },
    ],
  },
  {
    id: "sp-gov-3",
    nome: "Rodrigo Garcia",
    numero: "45",
    partido: "PSDB",
    cargo: "Governador",
    estadoId: "br-sp",
    foto: "https://i.pravatar.cc/150?img=33",
    idade: 50,
    genero: "M",
    status: "Pré-candidato",
    bio: "Advogado e político. Foi governador de São Paulo (2022) e vice-governador (2019-2022).",
    propostas: [
      { area: "Saúde", resumo: "Ampliar o programa Corujão da Saúde e contratar mais médicos para a rede pública estadual." },
      { area: "Educação", resumo: "Expandir o programa Bolsa do Povo para estudantes de baixa renda e ampliar o ensino técnico." },
      { area: "Economia", resumo: "Manter o equilíbrio fiscal e atrair investimento privado com incentivos fiscais para indústrias." },
      { area: "Segurança", resumo: "Investir em inteligência policial e integração das forças de segurança metropolitanas." },
    ],
    planoGovernoUrl: "#",
    historico: [
      { cargo: "Governador de São Paulo", periodo: "2022" },
      { cargo: "Vice-governador de São Paulo", periodo: "2019 — 2022" },
      { cargo: "Secretário Estadual", periodo: "2011 — 2014" },
    ],
    patrimonio: [{ bem: "Imóveis em São Paulo", valor: "R$ 1.500.000,00" }],
    redesSociais: [{ rede: "Instagram", url: "#" }],
  },
  {
    id: "sp-gov-4",
    nome: "Carla Zambelli",
    numero: "22",
    partido: "PL",
    cargo: "Governador",
    estadoId: "br-sp",
    foto: "https://i.pravatar.cc/150?img=47",
    idade: 43,
    genero: "F",
    status: "Pré-candidato",
    bio: "Jornalista e política. Atual deputada federal por São Paulo.",
    propostas: [
      { area: "Segurança", resumo: "Armamento civil ampliado, tolerância zero com o crime organizado e endurecimento penal." },
      { area: "Economia", resumo: "Redução de impostos estaduais e desburocratização total para empreendedores." },
      { area: "Educação", resumo: "Defesa do homeschooling e ampliação de escolas cívico-militares." },
      { area: "Saúde", resumo: "Parcerias com hospitais privados para reduzir filas do SUS estadual." },
    ],
    planoGovernoUrl: "#",
    historico: [{ cargo: "Deputada Federal por SP", periodo: "2019 — atual" }],
    patrimonio: [{ bem: "Apartamento em São Paulo", valor: "R$ 800.000,00" }],
    redesSociais: [{ rede: "Instagram", url: "#" }, { rede: "Twitter", url: "#" }],
  },
  {
    id: "sp-sen-1",
    nome: "Simone Tebet",
    numero: "123",
    partido: "MDB",
    cargo: "Senador",
    estadoId: "br-sp",
    foto: "https://i.pravatar.cc/150?img=45",
    idade: 55,
    genero: "F",
    status: "Pré-candidato",
  },
  {
    id: "sp-df-1",
    nome: "Guilherme Boulos",
    numero: "5010",
    partido: "PSOL",
    cargo: "Deputado Federal",
    estadoId: "br-sp",
    foto: "https://i.pravatar.cc/150?img=68",
    idade: 42,
    genero: "M",
    status: "Pré-candidato",
  },
  {
    id: "sp-de-1",
    nome: "Eduardo Suplicy",
    numero: "13000",
    partido: "PT",
    cargo: "Deputado Estadual",
    estadoId: "br-sp",
    foto: "https://i.pravatar.cc/150?img=13",
    idade: 82,
    genero: "M",
    status: "Pré-candidato",
  },

  // Rio de Janeiro
  {
    id: "rj-gov-1",
    nome: "Cláudio Castro",
    numero: "22",
    partido: "PL",
    cargo: "Governador",
    estadoId: "br-rj",
    foto: "https://i.pravatar.cc/150?img=52",
    idade: 45,
    genero: "M",
    status: "Atual ocupante",
  },
  {
    id: "rj-gov-2",
    nome: "Eduardo Paes",
    numero: "15",
    partido: "PSD",
    cargo: "Governador",
    estadoId: "br-rj",
    foto: "https://i.pravatar.cc/150?img=59",
    idade: 54,
    genero: "M",
    status: "Pré-candidato",
  },
  {
    id: "rj-sen-1",
    nome: "Romário",
    numero: "400",
    partido: "PL",
    cargo: "Senador",
    estadoId: "br-rj",
    foto: "https://i.pravatar.cc/150?img=11",
    idade: 60,
    genero: "M",
    status: "Atual ocupante",
  },

  // Minas Gerais
  {
    id: "mg-gov-1",
    nome: "Romeu Zema",
    numero: "55",
    partido: "Novo",
    cargo: "Governador",
    estadoId: "br-mg",
    foto: "https://i.pravatar.cc/150?img=15",
    idade: 60,
    genero: "M",
    status: "Atual ocupante",
    bio: "Empresário e político. Atual governador de Minas Gerais.",
    propostas: [
      { area: "Economia", resumo: "Privatizações e choque de gestão no estado, com foco em eficiência fiscal." },
      { area: "Educação", resumo: "Expansão de escolas técnicas e ampliação do programa Trilhas de Futuro." },
      { area: "Segurança", resumo: "Integração das polícias e investimento em videomonitoramento." },
      { area: "Saúde", resumo: "Regionalização do atendimento e ampliação da atenção primária." },
    ],
    planoGovernoUrl: "#",
    historico: [
      { cargo: "Governador de Minas Gerais", periodo: "2019 — atual" },
      { cargo: "Empresário do setor varejista", periodo: "1989 — 2018" },
    ],
    patrimonio: [{ bem: "Participação em empresa", valor: "R$ 25.000.000,00" }],
    redesSociais: [{ rede: "Instagram", url: "#" }],
  },
  {
    id: "mg-gov-2",
    nome: "Alexandre Kalil",
    numero: "12",
    partido: "PDT",
    cargo: "Governador",
    estadoId: "br-mg",
    foto: "https://i.pravatar.cc/150?img=60",
    idade: 55,
    genero: "M",
    status: "Pré-candidato",
  },
  // Adicione ao final do array de candidatos
  ...["ac", "al", "ap", "am", "ba", "ce", "df", "es", "go", "ma", "mt", "ms", "pa", "pb", "pr", "pe", "pi", "rn", "ro", "rr", "sc", "se", "to"].flatMap((uf, i) => [
    {
      id: `${uf}-gov-1`,
      nome: `Candidato A - ${uf.toUpperCase()}`,
      numero: "10",
      partido: "PSDB",
      cargo: "Governador" as const,
      estadoId: `br-${uf}`,
      foto: `https://i.pravatar.cc/150?img=${10 + i}`,
      idade: 50 + (i % 15),
      genero: "M" as const,
      status: "Pré-candidato" as const,
      bio: "Candidato de exemplo para demonstração.",
      propostas: [
        { area: "Saúde", resumo: "Ampliar o atendimento básico e reduzir filas de exames." },
        { area: "Educação", resumo: "Investir em escolas técnicas e formação de professores." },
        { area: "Economia", resumo: "Atrair investimentos e simplificar impostos." },
        { area: "Segurança", resumo: "Reforçar o efetivo policial e integrar forças." },
      ],
      historico: [{ cargo: "Deputado Estadual", periodo: "2019 — 2022" }],
      patrimonio: [{ bem: "Imóvel", valor: "R$ 500.000,00" }],
      redesSociais: [{ rede: "Instagram", url: "#" }],
    },
    {
      id: `${uf}-gov-2`,
      nome: `Candidato B - ${uf.toUpperCase()}`,
      numero: "13",
      partido: "PT",
      cargo: "Governador" as const,
      estadoId: `br-${uf}`,
      foto: `https://i.pravatar.cc/150?img=${30 + i}`,
      idade: 45 + (i % 20),
      genero: "F" as const,
      status: "Pré-candidato" as const,
      bio: "Candidata de exemplo para demonstração.",
      propostas: [
        { area: "Saúde", resumo: "Fortalecer o SUS e ampliar a atenção primária." },
        { area: "Educação", resumo: "Universalizar creches e ampliar o ensino integral." },
        { area: "Economia", resumo: "Estimular a indústria local e o empreendedorismo." },
        { area: "Meio Ambiente", resumo: "Metas de redução de emissões e transição energética." },
      ],
      historico: [{ cargo: "Vereadora", periodo: "2017 — 2020" }],
      patrimonio: [{ bem: "Apartamento", valor: "R$ 800.000,00" }],
      redesSociais: [{ rede: "Instagram", url: "#" }],
    },
  ]),
];

export const governadoresAtuais: Record<string, string> = {
  "br-sp": "Tarcísio de Freitas (Republicanos)",
  "br-rj": "Cláudio Castro (PL)",
  "br-mg": "Romeu Zema (Novo)",
  "br-ba": "Jerônimo Rodrigues (PT)",
  "br-rs": "Eduardo Leite (PSDB)",
  "br-pr": "Ratinho Junior (PSD)",
  "br-pe": "Raquel Lyra (PSDB)",
  "br-ce": "Elmano de Freitas (PT)",
  "br-pa": "Helder Barbalho (MDB)",
  "br-sc": "Jorginho Mello (PL)",
  // ... adicione os outros conforme necessidade
};

export const nomesEstados: Record<string, string> = {
  "br-ac": "Acre",
  "br-al": "Alagoas",
  "br-ap": "Amapá",
  "br-am": "Amazonas",
  "br-ba": "Bahia",
  "br-ce": "Ceará",
  "br-df": "Distrito Federal",
  "br-es": "Espírito Santo",
  "br-go": "Goiás",
  "br-ma": "Maranhão",
  "br-mt": "Mato Grosso",
  "br-ms": "Mato Grosso do Sul",
  "br-mg": "Minas Gerais",
  "br-pa": "Pará",
  "br-pb": "Paraíba",
  "br-pr": "Paraná",
  "br-pe": "Pernambuco",
  "br-pi": "Piauí",
  "br-rj": "Rio de Janeiro",
  "br-rn": "Rio Grande do Norte",
  "br-rs": "Rio Grande do Sul",
  "br-ro": "Rondônia",
  "br-rr": "Roraima",
  "br-sc": "Santa Catarina",
  "br-sp": "São Paulo",
  "br-se": "Sergipe",
  "br-to": "Tocantins",
};

// Normaliza IDs: "br-sp", "BR-SP", "sp", "SP", "df" → "sp"/"df"
export function normalizarId(id: string): string {
  return id.toLowerCase().replace(/^br[-_]?/, "").trim();
}

export function getNomeEstado(id: string): string {
  const norm = normalizarId(id);
  for (const [key, nome] of Object.entries(nomesEstados)) {
    if (normalizarId(key) === norm) return nome;
  }
  return id.toUpperCase();
}

export function getGovernador(id: string): string | undefined {
  const norm = normalizarId(id);
  for (const [key, gov] of Object.entries(governadoresAtuais)) {
    if (normalizarId(key) === norm) return gov;
  }
  return undefined;
}

export function getCandidatosDoEstado(id: string): Candidato[] {
  const norm = normalizarId(id);
  return candidatos.filter((c) => normalizarId(c.estadoId) === norm);
}