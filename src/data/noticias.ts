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
    autor: "Redação Centro Político",
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
    autor: "Redação Centro Político",
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
    autor: "Redação Centro Político",
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
    autor: "Redação Centro Político",
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
  {
    id: 10,
    titulo: "Eleições 2026: veja o calendário completo do TSE",
    categoria: "Eleições",
    data: "05 de abril de 2026",
    autor: "Redação Centro Político",
    cor: "bg-verde",
    resumo:
      "Confira as datas mais importantes das eleições de 2026, do prazo de justificativa ao segundo turno.",
    conteudo: [
      "O Tribunal Superior Eleitoral divulgou o calendário completo das eleições de 2026. O primeiro turno será no dia 4 de outubro, e o segundo turno (se necessário) em 25 de outubro.",
      "Entre as datas mais importantes estão o prazo para solicitar o voto em trânsito (20 de julho a 20 de agosto) e o prazo para justificar a ausência (até 3 de dezembro para o 1º turno).",
      "O eleitor também deve ficar atento ao prazo para regularizar o título de eleitor, que encerra em 6 de maio de 2026.",
    ],
    tags: ["Eleições 2026", "TSE", "Calendário"],
  },
  {
    id: 11,
    titulo: "STF julga ação sobre redes sociais e eleições",
    categoria: "Justiça",
    data: "04 de abril de 2026",
    autor: "Ricardo Antunes",
    cor: "bg-azul",
    resumo:
      "Supremo decide sobre responsabilidade de plataformas por conteúdo eleitoral falso.",
    conteudo: [
      "O Supremo Tribunal Federal retomou o julgamento sobre a responsabilidade das redes sociais por conteúdo eleitoral falso. A decisão pode impactar diretamente as eleições de 2026.",
      "A ação discute se as plataformas devem ser obrigadas a remover conteúdos considerados falsos por decisão judicial ou se devem agir apenas após notificação.",
      "O julgamento deve ser concluído nas próximas semanas e servirá de base para a regulamentação das plataformas durante o período eleitoral.",
    ],
    tags: ["STF", "Redes Sociais", "Eleições"],
  },
  {
    id: 12,
    titulo: "Governo anuncia novo pacote de investimentos em infraestrutura",
    categoria: "Economia",
    data: "03 de abril de 2026",
    autor: "Marina Silva",
    cor: "bg-verde-dark",
    resumo:
      "Programa prevê R$ 120 bilhões em investimentos em rodovias, ferrovias e saneamento básico.",
    conteudo: [
      "O governo federal anunciou nesta quinta-feira um novo pacote de investimentos em infraestrutura no valor de R$ 120 bilhões. O programa inclui obras em rodovias, ferrovias e saneamento básico.",
      "Os investimentos serão feitos em parceria com estados e municípios, além de parcerias com a iniciativa privada. A expectativa é gerar 500 mil empregos diretos e indiretos.",
      "O programa será financiado com recursos do Orçamento Geral da União e de linhas de crédito do BNDES.",
    ],
    tags: ["Infraestrutura", "Investimentos", "Economia"],
  },
  {
    id: 13,
    titulo: "Câmara aprova projeto que amplia transparência em emendas parlamentares",
    categoria: "Política",
    data: "02 de abril de 2026",
    autor: "Redação Centro Político",
    cor: "bg-azul-light",
    resumo:
      "Texto exige divulgação detalhada de emendas individuais e cria portal de acompanhamento.",
    conteudo: [
      "A Câmara dos Deputados aprovou nesta quarta-feira o projeto de lei que amplia a transparência em emendas parlamentares. O texto exige a divulgação detalhada de todas as emendas individuais.",
      "O projeto cria também um portal de acompanhamento onde qualquer cidadão pode verificar como os recursos das emendas estão sendo aplicados.",
      "O texto segue agora para o Senado, onde deve ser votado nas próximas semanas.",
    ],
    tags: ["Transparência", "Emendas", "Câmara"],
  },
  {
    id: 14,
    titulo: "Pesquisa mostra que 75% dos brasileiros apoiam proibição das bets",
    categoria: "Sociedade",
    data: "01 de abril de 2026",
    autor: "Carlos Eduardo",
    cor: "bg-verde",
    resumo:
      "Levantamento Atlas/Bloomberg indica apoio popular à medida que proíbe casas de apostas online.",
    conteudo: [
      "Pesquisa Atlas/Bloomberg divulgada nesta terça-feira aponta que 75% dos brasileiros apoiam a proibição das casas de apostas online (bets). O levantamento ouviu 2.000 pessoas em 120 municípios.",
      "O apoio é maior entre mulheres (81%) e pessoas com mais de 60 anos (84%). Entre os jovens de 18 a 29 anos, o apoio é de 62%.",
      "O governo federal já enviou ao Congresso um projeto de lei que proíbe a exploração de apostas de quota fixa no país.",
    ],
    tags: ["Pesquisa", "Bets", "Sociedade"],
  },
  {
    id: 15,
    titulo: "TSE define regras para uso de inteligência artificial nas campanhas",
    categoria: "Eleições",
    data: "31 de março de 2026",
    autor: "Paula Mendes",
    cor: "bg-azul",
    resumo:
      "Tribunal estabelece limites para uso de deepfakes e IA generativa em propaganda eleitoral.",
    conteudo: [
      "O Tribunal Superior Eleitoral aprovou nesta segunda-feira as regras para o uso de inteligência artificial nas campanhas eleitorais de 2026. A resolução estabelece limites claros para o uso de deepfakes e IA generativa.",
      "Entre as regras estão a obrigação de identificar conteúdos gerados por IA e a proibição de uso de deepfakes para difamar candidatos ou eleitores.",
      "A fiscalização será feita em parceria com as plataformas digitais, que deverão remover conteúdos irregulares em até 24 horas após notificação.",
    ],
    tags: ["TSE", "Inteligência Artificial", "Eleições"],
  },
  {
    id: 16,
    titulo: "Senado aprova PEC que limita reeleição para cargos executivos",
    categoria: "Política",
    data: "30 de março de 2026",
    autor: "Marina Silva",
    cor: "bg-verde-dark",
    resumo:
      "Proposta limita a uma reeleição para presidente, governadores e prefeitos.",
    conteudo: [
      "O Senado Federal aprovou nesta segunda-feira a PEC que limita a uma reeleição para presidente, governadores e prefeitos. O texto já foi aprovado na Câmara e agora vai à promulgação.",
      "A proposta também estabelece que quem ocupou o cargo de forma interina por mais de um ano não poderá concorrer à reeleição.",
      "A medida vale a partir das eleições de 2028 e não afeta os atuais ocupantes dos cargos.",
    ],
    tags: ["Senado", "Reeleição", "Política"],
  },
  {
    id: 17,
    titulo: "Banco Central mantém taxa Selic em 10,75% ao ano",
    categoria: "Economia",
    data: "29 de março de 2026",
    autor: "Redação Centro Político",
    cor: "bg-verde",
    resumo:
      "Comitê de Política Monetária decide manter taxa estável pela terceira vez consecutiva.",
    conteudo: [
      "O Comitê de Política Monetária (Copom) do Banco Central decidiu manter a taxa Selic em 10,75% ao ano. É a terceira vez consecutiva que a taxa se mantém estável.",
      "A decisão foi unânime e reflete a avaliação de que a inflação está sob controle e a economia cresce em ritmo moderado.",
      "Analistas projetam que a taxa deve começar a cair no segundo semestre de 2026, chegando a 9,5% ao ano em dezembro.",
    ],
    tags: ["Selic", "Banco Central", "Economia"],
  },
  {
    id: 18,
    titulo: "Ministério da Saúde lança campanha nacional de vacinação",
    categoria: "Saúde",
    data: "28 de março de 2026",
    autor: "Carlos Eduardo",
    cor: "bg-azul-light",
    resumo:
      "Campanha visa vacinar 90% da população contra gripe e outras doenças.",
    conteudo: [
      "O Ministério da Saúde lançou nesta sexta-feira a campanha nacional de vacinação de 2026. A meta é vacinar 90% da população contra gripe e outras doenças.",
      "A campanha começa pelos grupos prioritários: idosos, crianças, gestantes e profissionais de saúde. As vacinas estão disponíveis em todos os postos de saúde do país.",
      "O governo federal investiu R$ 2 bilhões na compra de vacinas e na estrutura da campanha.",
    ],
    tags: ["Saúde", "Vacinação", "Governo"],
  },
  {
    id: 19,
    titulo: "STF decide que estados podem criar leis mais rigorosas sobre armas",
    categoria: "Justiça",
    data: "27 de março de 2026",
    autor: "Ricardo Antunes",
    cor: "bg-azul",
    resumo:
      "Decisão permite que estados e municípios criem normas mais restritivas que a legislação federal.",
    conteudo: [
      "O Supremo Tribunal Federal decidiu nesta quinta-feira que estados e municípios podem criar leis mais rigorosas sobre armas de fogo que a legislação federal.",
      "A decisão foi tomada no julgamento de uma ação que questionava a lei de armas do estado de São Paulo, mais restritiva que a legislação federal.",
      "O entendimento abre espaço para que outros estados criem normas mais restritivas sobre o porte e a posse de armas.",
    ],
    tags: ["STF", "Armas", "Justiça"],
  },
  {
    id: 20,
    titulo: "Governo federal anuncia programa de habitação popular",
    categoria: "Sociedade",
    data: "26 de março de 2026",
    autor: "Marina Silva",
    cor: "bg-verde-dark",
    resumo:
      "Programa 'Minha Casa, Minha Vida 2.0' prevê construção de 2 milhões de unidades.",
    conteudo: [
      "O governo federal anunciou nesta quarta-feira a segunda fase do programa Minha Casa, Minha Vida. A meta é construir 2 milhões de unidades habitacionais até 2028.",
      "O programa terá investimento de R$ 150 bilhões, com recursos do Orçamento Geral da União e do FGTS. As casas serão destinadas a famílias com renda de até R$ 8 mil.",
      "As obras começam em abril e priorizam as regiões metropolitanas com maior déficit habitacional.",
    ],
    tags: ["Habitação", "Minha Casa Minha Vida", "Governo"],
  },
];