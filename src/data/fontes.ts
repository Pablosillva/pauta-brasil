/**
 * Fontes oficiais usadas pelo Centro Politico.
 * Cada entrada aparece nas paginas /fontes e /metodologia.
 */

export interface Fonte {
  nome: string;
  orgao: string;
  url: string;
  urlAlternativa?: string;
  oQueFornece: string[];
  frequencia: string;
}

export const fontes: Fonte[] = [
  {
    nome: "DivulgaCand",
    orgao: "Tribunal Superior Eleitoral (TSE)",
    url: "https://www.tse.jus.br/eleicoes/eleicoes-2024/dados-abertos",
    urlAlternativa: "https://dados.tse.jus.br",
    oQueFornece: [
      "Lista completa de candidatos registrados nas 27 unidades da federacao",
      "Fotos oficiais de campanha",
      "Numero de urna, partido e cargo pretendido",
      "Planos de governo submetidos ao TSE",
      "Bens declarados e dados de Fillacao",
    ],
    frequencia:
      "Atualizado a cada ciclo eleitoral, conforme o calendario do TSE",
  },
  {
    nome: "API de Dados Abertos",
    orgao: "Camara dos Deputados",
    url: "https://dadosabertos.camara.leg.br",
    oQueFornece: [
      "Cadastro dos deputados federais em exercicio",
      "Votacoes nominais com o voto de cada deputado",
      "Projetos de lei e sua tramitacao completa",
      "Situcao partidaria e dados de gabinete",
    ],
    frequencia: "Diario",
  },
  {
    nome: "Senado Federal - Dados Abertos",
    orgao: "Senado Federal",
    url: "https://dadosabertos.senado.leg.br",
    oQueFornece: ["Materia e votacoes do Senado", "Composicao das Comissoes"],
    frequencia: "Diario",
  },
  {
    nome: "Portal da Transparencia",
    orgao: "Controladoria-Geral da Uniao (CGU)",
    url: "https://www.gov.br/cgu/pt-br/acesso-a-informacao/dados-abertos",
    oQueFornece: [
      "Gastos do Executivo federal",
      "Transferencias a estados e municipios",
      "Cota parlamentar",
    ],
    frequencia: "Mensal",
  },
  {
    nome: "Estatisticas do TSE",
    orgao: "Tribunal Superior Eleitoral (TSE)",
    url: "https://www.tse.jus.br/eleicoes/eleicoes-2024",
    oQueFornece: [
      "Resultados oficiais das eleicoes",
      "Apuracao por municipio, cargo e partido",
      "Comparecimento do eleitor",
    ],
    frequencia: "Apos cada eleicao",
  },
];

/** Limitações que assume publicamente o que o site ainda não cobre. */
export const limitacoes = [
  {
    titulo: "Situacao de candidatura em 2026",
    texto:
      "O TSE ainda nao concluiu a atualizacao definitiva do status de candidatura de todos os estados. Enquanto o registro nao for consolidado, alguns candidatos aparecem como pre-candidato.",
  },
  {
    titulo: "Propostas por candidato sao parciais",
    texto:
      "Nem todo candidato registra plano de governo no TSE. Onde o plano existe, ele e exibido em PDF. Onde nao existe, a secao fica em branco de proposito, sem preenchimento por estimativa.",
  },
  {
    titulo: "Senadores e eleicoes anteriores",
    texto:
      "O foco atual do Centro Politico sao os candidatos das eleicoes e os deputados federais. Dados de senadores e de eleicoes anteriores a 2024 ainda nao foram integrados.",
  },
  {
    titulo: "Atraso em relacao a fonte",
    texto:
      "Como dependemos de sistemas governamentais, existe um pequeno intervalo entre a publicacao oficial e a exibicao aqui.",
  },
  {
    titulo: "Cache de votacoes",
    texto:
      "As votacoes do Congresso sao consultadas na API da Camara e ficam em cache por uma hora. Uma votacao pode levar ate esse tempo para aparecer.",
  },
];
