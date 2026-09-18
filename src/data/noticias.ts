export interface Noticia {
  id: number;
  titulo: string;
  categoria: string;
  data: string;
  autor: string;
  cor: string;
  resumo: string;
  conteudo: string[];
  tags: string[];
}

export const noticias: Noticia[] = [
  {
    id: 1,
    titulo: "Congresso aprova nova lei de licitações para obras públicas",
    categoria: "Política",
    data: "14 de abril de 2026",
    autor: "Redação Pauta Brasil",
    cor: "bg-verde",
    resumo:
      "A nova lei promete acelerar obras públicas, mas especialistas alertam para riscos de flexibilização excessiva.",
    conteudo: [
      "O Congresso Nacional aprovou nesta terça-feira, por 312 votos a 145, a nova Lei de Licitações para obras públicas. O texto tramitava há mais de dois anos e foi alvo de intensa negociação entre governo e oposição.",
      "A principal mudança é a criação de um regime diferenciado para obras de grande porte, que poderá reduzir em até 40% o tempo de tramitação dos editais. Em contrapartida, o texto prevê mecanismos de fiscalização digital para evitar fraudes.",
      "Especialistas em contas públicas divergem sobre os efeitos da nova lei. Para o professor Carlos Alberto, da FGV, o texto representa um avanço. Já a ONG Transparência Brasil alerta para pontos que podem enfraquecer o controle social.",
      "A lei entra em vigor em 90 dias após a sanção presidencial. Estados e municípios terão até 2027 para adaptar seus procedimentos.",
    ],
    tags: ["Congresso", "Licitações", "Obras Públicas"],
  },
  {
    id: 2,
    titulo: "Governadores se reúnem em Brasília para discutir reforma tributária",
    categoria: "Economia",
    data: "13 de abril de 2026",
    autor: "Marina Silva",
    cor: "bg-azul",
    resumo:
      "Encontro reúne 27 governadores para debater impactos da reforma nos estados e definir posição comum.",
    conteudo: [
      "Os 27 governadores se reuniram nesta segunda-feira em Brasília para discutir os impactos da reforma tributária aprovada no ano passado. O encontro foi organizado pelo Fórum de Governadores e contou com a presença do Ministro da Fazenda.",
      "A principal preocupação dos estados é com a transição do modelo atual para o novo sistema de tributação sobre consumo. Governadores de estados produtores temem perda de arrecadação.",
      "Um grupo de trabalho foi criado para negociar pontos específicos com o governo federal nas próximas semanas. A expectativa é que uma proposta conjunta seja apresentada em maio.",
    ],
    tags: ["Reforma Tributária", "Governadores", "Economia"],
  },
  {
    id: 3,
    titulo: "STF decide sobre marco temporal de terras indígenas",
    categoria: "Justiça",
    data: "12 de abril de 2026",
    autor: "Ricardo Antunes",
    cor: "bg-verde-dark",
    resumo:
      "Decisão tem impacto direto sobre mais de 200 processos de demarcação em todo o país.",
    conteudo: [
      "O Supremo Tribunal Federal retomou nesta semana o julgamento sobre o marco temporal de terras indígenas. A tese em discussão define que os povos originários só teriam direito às terras que ocupavam em 5 de outubro de 1988.",
      "O julgamento foi interrompido por um pedido de vista e deve ser retomado nas próximas semanas. Representantes de comunidades indígenas acompanham o caso com preocupação.",
      "A decisão terá impacto direto sobre mais de 200 processos de demarcação em todo o país, além de afetar áreas de conflito em estados como Mato Grosso, Pará e Roraima.",
    ],
    tags: ["STF", "Terras Indígenas", "Justiça"],
  },
  {
    id: 4,
    titulo: "Pesquisa aponta aprovação recorde do Congresso Nacional",
    categoria: "Sociedade",
    data: "11 de abril de 2026",
    autor: "Redação Pauta Brasil",
    cor: "bg-azul-light",
    resumo:
      "Índice de aprovação chega a 42%, o maior desde 2013, segundo levantamento do Datafolha.",
    conteudo: [
      "Pesquisa Datafolha divulgada nesta sexta-feira aponta que a aprovação do Congresso Nacional atingiu 42%, o maior índice desde 2013. Outros 38% desaprovam o trabalho dos parlamentares.",
      "O levantamento ouviu 2.500 pessoas em 130 municípios entre os dias 8 e 10 de abril. A margem de erro é de 2 pontos percentuais.",
      "Entre os fatores apontados para a melhora estão a aprovação de pautas econômicas e a maior visibilidade das atividades parlamentares nas redes sociais.",
    ],
    tags: ["Datafolha", "Congresso", "Pesquisa"],
  },
  {
    id: 5,
    titulo: "Nova regra para candidaturas independentes entra em vigor",
    categoria: "Eleições",
    data: "10 de abril de 2026",
    autor: "Paula Mendes",
    cor: "bg-verde",
    resumo:
      "TSE regulamenta candidaturas sem vínculo partidário para as eleições de 2026.",
    conteudo: [
      "O Tribunal Superior Eleitoral publicou nesta quinta-feira a resolução que regulamenta as candidaturas independentes para as eleições de 2026. A medida atende a uma decisão do STF do ano passado.",
      "Para concorrer sem partido, o candidato precisará reunir 1% das assinaturas do eleitorado do estado ou município, distribuídas em pelo menos um terço dos municípios.",
      "Especialistas avaliam que a regra pode alterar a dinâmica das eleições proporcionais, embora o impacto deva ser limitado no primeiro ciclo.",
    ],
    tags: ["TSE", "Eleições 2026", "Candidaturas"],
  },
  {
    id: 6,
    titulo: "TSE lança sistema de fiscalização de fake news nas eleições",
    categoria: "Justiça",
    data: "09 de abril de 2026",
    autor: "Redação Pauta Brasil",
    cor: "bg-azul",
    resumo:
      "Ferramenta usa IA para identificar conteúdos falsos em tempo real durante o período eleitoral.",
    conteudo: [
      "O Tribunal Superior Eleitoral apresentou nesta quarta-feira o novo sistema de fiscalização de notícias falsas que será usado nas eleições de 2026. A ferramenta utiliza inteligência artificial para identificar conteúdos suspeitos em tempo real.",
      "O sistema trabalhará em parceria com plataformas digitais, partidos políticos e órgãos de checagem. Denúncias também poderão ser feitas por qualquer cidadão através do aplicativo do TSE.",
      "Segundo o presidente do TSE, a meta é reduzir em 50% o tempo de resposta a conteúdos comprovadamente falsos durante o período eleitoral.",
    ],
    tags: ["TSE", "Fake News", "Eleições"],
  },
  {
    id: 7,
    titulo: "Cresce interesse dos jovens na política, aponta pesquisa",
    categoria: "Sociedade",
    data: "08 de abril de 2026",
    autor: "Carlos Eduardo",
    cor: "bg-verde-dark",
    resumo:
      "62% dos jovens entre 16 e 24 anos dizem ter interesse por política, contra 41% em 2020.",
    conteudo: [
      "Pesquisa do Instituto DataJovem aponta que 62% dos jovens entre 16 e 24 anos dizem ter interesse por política, contra 41% em 2020. É o maior índice desde o início da série histórica, em 2014.",
      "O levantamento também aponta maior participação em movimentos sociais e coletivos. Redes sociais continuam sendo a principal fonte de informação política para esse público.",
      "Especialistas veem com otimismo o resultado, mas alertam para o risco de desinformação nessa faixa etária.",
    ],
    tags: ["Juventude", "Política", "Pesquisa"],
  },
  {
    id: 8,
    titulo: "Reforma administrativa avança na Câmara dos Deputados",
    categoria: "Política",
    data: "07 de abril de 2026",
    autor: "Marina Silva",
    cor: "bg-azul-light",
    resumo:
      "Comissão especial aprova texto-base que altera carreiras e salários do funcionalismo.",
    conteudo: [
      "A comissão especial da reforma administrativa aprovou nesta terça-feira o texto-base que altera carreiras, salários e a estrutura do funcionalismo público federal. A votação foi de 22 votos a 15.",
      "O texto segue agora para o plenário da Câmara, onde deve enfrentar resistência de parte da base aliada. Servidores públicos prometem mobilizações contra pontos considerados prejudiciais.",
      "Entre as principais mudanças estão o fim da estabilidade para novos servidores e a criação de novos modelos de contratação.",
    ],
    tags: ["Reforma Administrativa", "Câmara", "Servidores"],
  },
  {
    id: 9,
    titulo: "Banco Central divulga novos dados sobre inflação",
    categoria: "Economia",
    data: "06 de abril de 2026",
    autor: "Redação Pauta Brasil",
    cor: "bg-verde",
    resumo:
      "IPCA acumulado em 12 meses fica em 3,8%, dentro da meta estabelecida pelo governo.",
    conteudo: [
      "O Banco Central divulgou nesta segunda-feira os dados mais recentes sobre a inflação. O IPCA acumulado em 12 meses ficou em 3,8%, dentro da meta estabelecida pelo governo (3% com margem de 1,5 ponto).",
      "A queda foi puxada principalmente pela redução nos preços dos alimentos e dos combustíveis. Por outro lado, os serviços continuam pressionando o índice.",
      "Analistas projetam que a inflação deve se manter sob controle ao longo de 2026, o que abre espaço para novos cortes na taxa Selic.",
    ],
    tags: ["Inflação", "Banco Central", "Economia"],
  },
];