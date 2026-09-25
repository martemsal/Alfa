import { Question, Student } from '../types';
import rawStudents from './studentsData.json';

export const EXAM_METADATA = {
  institution: "PROGRAMA DE DESENVOLVIMENTO GERENCIAL — COOPERALFA",
  program: "PDG Cooperalfa — Pós-Graduação & Desenvolvimento de Lideranças",
  course: "Negociação Estratégica no Agronegócio e Cooperativismo",
  hours: "24h/aula",
  professor: "Prof. Marcelo Saldanha",
  totalQuestions: 15,
  passingGrade: 7.0,
  maxGrade: 10.0,
  instructions: "Leia atentamente cada estudo de caso ou situação hipotética de balcão/campo e assinale a alternativa correta. Cada questão possui 4 alternativas e apenas 1 resposta correta."
};

export const STUDENTS_LIST: Student[] = rawStudents as Student[];

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Conceito de Negociação & Ecossistema Cooperativo",
    topic: "Ecossistema Cooperativo vs Venda Transacional",
    category: "Ecossistema Cooperativo",
    statement: "A negociação comercial no modelo cooperativista difere da venda transacional tradicional praticada por revendas privadas porque:",
    options: [
      { id: 'a', text: "O cooperado busca apenas a maximização do lucro imediato na compra de insumos, sem interesse no suporte técnico." },
      { id: 'b', text: "O associado ocupa a tríplice condição de cliente, fornecedor e proprietário do negócio, exigindo foco na sustentabilidade de longo prazo da relação." },
      { id: 'c', text: "A cooperativa tem a obrigação estatutária de cobrir qualquer cotação concorrente, independentemente da margem da filial." },
      { id: 'd', text: "Elimina a necessidade de metas comerciais e de gestão financeira por parte dos gerentes de filiais." }
    ],
    correctAnswer: 'b',
    explanation: "No cooperativismo, o associado é o dono; a relação busca continuidade e desenvolvimento conjunto, diferente da revenda mercantilista puramente transacional."
  },
  {
    id: 2,
    title: "Metodologia de Harvard: Posições vs. Interesses",
    topic: "Posições vs Interesses Reais",
    category: "Método de Harvard",
    statement: "Um produtor tradicional entra na Loja Agropecuária Alfa afirmando categoricamente: \"Ou vocês me dão 8% de desconto nessa carga de adubo, ou vou comprar tudo na revenda multinacional que visitou minha propriedade ontem.\" Sob a ótica do Método de Harvard, a fala do produtor representa:",
    options: [
      { id: 'a', text: "Seu interesse real e imutável." },
      { id: 'b', text: "Uma posição rígida que oculta interesses subjacentes, como proteção de fluxo de caixa ou busca por segurança produtiva." },
      { id: 'c', text: "A comprovação de que a cooperativa perdeu sua competitividade estrutural." },
      { id: 'd', text: "Um critério objetivo incontestável que exige concessão imediata de preço." }
    ],
    correctAnswer: 'b',
    explanation: "A exigência de 8% é uma posição; o interesse pode envolver alívio de fluxo de caixa, medo de prejuízo ou teste de autoridade do gerente."
  },
  {
    id: 3,
    title: "Técnicas de Investigação e Escuta Ativa",
    topic: "Comunicação Assertiva e Perguntas Abertas",
    category: "Comunicação Assertiva",
    statement: "Diante da exigência dura de desconto descrita na Questão 2, qual postura do gestor demonstra comunicação assertiva e foco em interesses?",
    options: [
      { id: 'a', text: "Retrucar imediatamente que o produto da concorrência é inferior e genérico." },
      { id: 'b', text: "Conceder o desconto solicitado para bater a cota do mês e evitar atritos no balcão." },
      { id: 'c', text: "Realizar perguntas abertas estratégicas para mapear a real necessidade de desembolso do produtor e ancorar a proposta no suporte técnico e na garantia de recebimento da safra no silo Alfa." },
      { id: 'd', text: "Informar que a política de preços da matriz é engessada e que nada pode ser feito." }
    ],
    correctAnswer: 'c',
    explanation: "Perguntas abertas revelam a raiz da objeção e viabilizam ancoragem no pacote de soluções da Cooperalfa (recebimento, assistência e retorno de sobras)."
  },
  {
    id: 4,
    title: "Conceito de BATNA / MAANA",
    topic: "Melhor Alternativa à Ausência de Acordo",
    category: "Método de Harvard",
    statement: "A MAANA (Melhor Alternativa à Ausência de Acordo) de um gestor da filial Cooperalfa durante a negociação de um pacote de sementes e defensivos serve para:",
    options: [
      { id: 'a', text: "Garantir que nenhum cliente saia da loja sem fechar contrato, custe o que custar à margem." },
      { id: 'b', text: "Definir o ponto de retirada seguro, impedindo concessões financeiras prejudiciais que firam a política de sustentabilidade da cooperativa." },
      { id: 'c', text: "Pressionar o cooperado através de ultimatos comerciais." },
      { id: 'd', text: "Substituir a necessidade de visitas agronômicas na lavoura." }
    ],
    correctAnswer: 'b',
    explanation: "A MAANA estabelece a linha de equilíbrio que impede fechar negócios que gerem prejuízo para a unidade cooperativa."
  },
  {
    id: 5,
    title: "Estilos de Negociadores: O Perfil Tecnificado",
    topic: "Atendimento ao Produtor Analítico",
    category: "Estilos de Negociadores",
    statement: "Ao atender um produtor com perfil analítico/tecnificado, que comparece à filial munido de planilhas de custos, dados de dosagem por hectare e cotações concorrentes, o gestor deve priorizar:",
    options: [
      { id: 'a', text: "Uma conversa longa informal regada a café, apelando para a amizade histórica da família com a cooperativa." },
      { id: 'b', text: "Apresentação de dados agronômicos consolidados, laudos de eficácia, histórico de produtividade e análise do retorno sobre o investimento (ROI)." },
      { id: 'c', text: "Bajulações verbais e termos informais para descontrair a reunião." },
      { id: 'd', text: "Mudança rápida de assunto para evitar o confronto com os dados trazidos pelo agricultor." }
    ],
    correctAnswer: 'b',
    explanation: "Negociadores analíticos exigem comprovação técnica, planilhas de rentabilidade e métricas de desempenho no campo."
  },
  {
    id: 6,
    title: "Estilos de Negociadores: O Perfil Tradicional/Relacional",
    topic: "Atendimento ao Produtor Relacional",
    category: "Estilos de Negociadores",
    statement: "O produtor rural de estilo predominantemente relacional/tradicional sente-se desmotivado e tende a buscar alternativas fora da cooperativa principalmente quando:",
    options: [
      { id: 'a', text: "A cooperativa disponibiliza relatórios digitais via aplicativo de celular." },
      { id: 'b', text: "Há alta rotatividade de atendentes e técnicos no balcão, quebrando o elo de confiança e o atendimento personalizado de palavra." },
      { id: 'c', text: "O agrônomo propõe visitas presenciais regulares à sua lavoura." },
      { id: 'd', text: "A filial mantém estabilidade em sua equipe de atendimento ao longo dos anos." }
    ],
    correctAnswer: 'b',
    explanation: "Produtores tradicionais baseiam a fidelidade no aperto de mão e na continuidade; o rodízio constante de funcionários destrói a confiança."
  },
  {
    id: 7,
    title: "Linguagem e Postura Profissional no Campo",
    topic: "Assertividade e Respeito Cultural no Agro",
    category: "Comunicação Assertiva",
    statement: "No relacionamento comercial com o agricultor, o uso excessivo de termos como \"doutor\", \"chefe\" ou \"patrão\" por parte da equipe de vendas tende a ser interpretado pelo homem do campo como:",
    options: [
      { id: 'a', text: "O mais alto nível de respeito e cortesia corporativa." },
      { id: 'b', text: "Tratamento artificial ou condescendente, fragilizando a relação de parceria genuína e respeito profissional mútuo." },
      { id: 'c', text: "Uma técnica eficaz de persuasão e fechamento rápido." },
      { id: 'd', text: "Uma exigência da comunicação cooperativista moderna." }
    ],
    correctAnswer: 'b',
    explanation: "Bajulações soam vazias e falsas; o produtor exige ser tratado com seriedade técnica e respeito profissional pelo nome."
  },
  {
    id: 8,
    title: "Gestão da Informação e Credibilidade",
    topic: "Transparência e Humildade Técnica",
    category: "Gestão da Informação e Liderança",
    statement: "Ao ser questionado por um associado sobre uma praga atípica ou especificação química de um novo produto da qual não tenha pleno domínio técnico no momento, a conduta correta do negociador é:",
    options: [
      { id: 'a', text: "Improvisar uma resposta convincente para demonstrar autoridade imediata no balcão." },
      { id: 'b', text: "Desviar o foco da conversa e tentar empurrar outro produto com estoque encalhado." },
      { id: 'c', text: "Agir com humildade técnica e transparência, comprometendo-se a buscar a informação precisa com a equipe agronômica e retornar prontamente ao associado." },
      { id: 'd', text: "Responsabilizar o fabricante pela falta de informações na embalagem." }
    ],
    correctAnswer: 'c',
    explanation: "Não tentar \"enrolar\" o produtor preserva a credibilidade; a humildade técnica valoriza o suporte profissional da cooperativa."
  },
  {
    id: 9,
    title: "Gerenciamento de Conflito de Pós-Venda: Falha na Aplicação",
    topic: "Escuta Empática e Investigação no Campo",
    category: "Gestão de Conflitos e Inadimplência",
    statement: "Um cooperado procura a gerência extremamente irritado, afirmando: \"O herbicida que vocês me venderam não matou o mato, perdi tempo e dinheiro por culpa da cooperativa!\" A primeira ação estratégica do gestor deve ser:",
    options: [
      { id: 'a', text: "Isentar sumariamente a cooperativa e acusá-lo de erro na dosagem ou no bico de pulverização." },
      { id: 'b', text: "Bonificar o produtor imediatamente com mais defensivos sem avaliar as causas da falha." },
      { id: 'c', text: "Praticar a escuta empática para acolher a frustração e agendar uma vistoria técnica presencial com o agrônomo para analisar clima, água, regulagem do maquinário e o lote do produto." },
      { id: 'd', text: "Encaminhar o caso diretamente para o departamento jurídico sem diálogo na filial." }
    ],
    correctAnswer: 'c',
    explanation: "Tratar o aspecto emocional primeiro, investigando os fatos na lavoura antes de assumir culpa ou criar conflito desnecessário."
  },
  {
    id: 10,
    title: "Separar as Pessoas dos Problemas",
    topic: "Princípio Central do Modelo de Harvard",
    category: "Método de Harvard",
    statement: "Segundo o Modelo de Harvard, o princípio de \"separar as pessoas dos problemas\" em uma negociação de cobrança após frustração climática significa:",
    options: [
      { id: 'a', text: "Ignorar os sentimentos do agricultor e focar estritamente na execução contratual da dívida." },
      { id: 'b', text: "Acolher a angústia do associado diante da quebra de safra com empatia e respeito, enquanto se trabalha racionalmente na reestruturação do plano financeiro de pagamento." },
      { id: 'c', text: "Transferir a cobrança para outra unidade para evitar constrangimentos pessoais." },
      { id: 'd', text: "Perdoar integralmente os débitos dos cooperados mais próximos da diretoria." }
    ],
    correctAnswer: 'b',
    explanation: "Separar pessoas do problema significa acolher a dor humana do cooperado com empatia, enquanto o desafio numérico e contratual é tratado com objetividade."
  },
  {
    id: 11,
    title: "Criação de Opções de Ganho Mútuo",
    topic: "Diferenciação Competitiva e Barter Integrado",
    category: "Método de Harvard",
    statement: "Quando a cooperativa enfrenta forte concorrência de uma distribuidora multinacional privada que vende insumos com margem predatória, uma forma de criar opções de ganho mútuo sem entrar em guerra destrutiva de preços é:",
    options: [
      { id: 'a', text: "Estruturar operações casadas de barter (troca de insumo por grão colhido) com garantia de recebimento, assistência técnica periódica e participação nas sobras." },
      { id: 'b', text: "Proibir o cooperado de comercializar com outras empresas sob pena de exclusão social." },
      { id: 'c', text: "Reduzir a equipe técnica de campo para cortar custos e nivelar o preço por baixo." },
      { id: 'd', text: "Vender produtos vencidos com desconto para desovar estoque." }
    ],
    correctAnswer: 'a',
    explanation: "O ecossistema integrado da Cooperalfa (loja + silo + assistência técnica + sobras) é a principal vantagem competitiva contra revendas pontuais."
  },
  {
    id: 12,
    title: "Comunicação Assertiva sob Pressão",
    topic: "Equilíbrio entre Firmeza e Empatia",
    category: "Comunicação Assertiva",
    statement: "A assertividade na comunicação do gestor caracteriza-se pelo equilíbrio entre:",
    options: [
      { id: 'a', text: "Agressividade impositiva e passividade submissa." },
      { id: 'b', text: "Capacidade de defender as diretrizes e a rentabilidade da cooperativa de forma clara e respeitosa, sem agredir o associado nem se omitir." },
      { id: 'c', text: "Falar mais do que o cliente para manter o controle total da conversa." },
      { id: 'd', text: "Concordar com todas as exigências do comprador para não perder o relacionamento." }
    ],
    correctAnswer: 'b',
    explanation: "Assertividade é a firmeza serena: não ser passivo (ceder tudo) nem agressivo (confrontar o associado)."
  },
  {
    id: 13,
    title: "Gestão de Inadimplência e Quebra de Safra",
    topic: "Sustentabilidade Negocial e Repactuação",
    category: "Gestão de Conflitos e Inadimplência",
    statement: "Em um cenário de estiagem severa que reduziu a colheita regional, a postura negocial mais sustentável de uma filial cooperativa para lidar com as contas a vencer dos insumos é:",
    options: [
      { id: 'a', text: "Protestar judicialmente as duplicatas na data exata do vencimento." },
      { id: 'b', text: "Negociar a rolagem estruturada do débito com amortização parcial, atrelando a quitação e o fornecimento da nova safra à assistência técnica da cooperativa." },
      { id: 'c', text: "Assumir o prejuízo financeiro integral sem repactuação documental." },
      { id: 'd', text: "Suspender qualquer novo diálogo até que o produtor pague a totalidade da dívida em dinheiro." }
    ],
    correctAnswer: 'b',
    explanation: "A prioridade no cooperativismo é manter o cooperado vivo e produzindo na terra, com segurança contábil e jurídica para a cooperativa."
  },
  {
    id: 14,
    title: "Gestão Estratégica da Informação Pré-Negociação",
    topic: "Inteligência Comercial e Histórico do Cooperado",
    category: "Gestão da Informação e Liderança",
    statement: "Antes de sentar à mesa com um cooperado de médio/grande porte para fechar o planejamento da safra de verão, qual conjunto de dados compõe a preparação estratégica do gestor?",
    options: [
      { id: 'a', text: "Apenas a cota de vendas que a diretoria estabeleceu para o mês corrente." },
      { id: 'b', text: "Histórico de compras, área plantada, rotação de culturas, pontualidade de pagamentos e histórico de entregas de grãos nos armazéns da Alfa." },
      { id: 'c', text: "Fofocas regionais sobre o patrimônio pessoal do associado." },
      { id: 'd', text: "As tabelas de preços de revendas concorrentes de outros estados do país." }
    ],
    correctAnswer: 'b',
    explanation: "Negociar com inteligência requer planejamento prévio com base no histórico completo do cooperado no sistema."
  },
  {
    id: 15,
    title: "Liderança e Visão Sistêmica",
    topic: "O Papel Estratégico do Gestor Cooperativo",
    category: "Gestão da Informação e Liderança",
    statement: "O objetivo final da disciplina de Negociação no PDG da Cooperalfa é capacitar os gestores para que atuem como:",
    options: [
      { id: 'a', text: "Simples conferentes de pedidos de balcão e aplicadores de tabelas de preços." },
      { id: 'b', text: "Líderes estratégicos capazes de conciliar a viabilidade do produtor rural à solidez econômica e aos princípios doutrinários da cooperativa." },
      { id: 'c', text: "Negociadores agressivos focados em vitórias de curto prazo sobre o associado." },
      { id: 'd', text: "Fiscais operacionais distantes da rotina e dos anseios da comunidade rural." }
    ],
    correctAnswer: 'b',
    explanation: "O papel do gestor cooperativista é ser a âncora de confiança e rentabilidade entre o campo e a cooperativa."
  }
];

export const CATEGORIES = [
  "Ecossistema Cooperativo",
  "Método de Harvard",
  "Comunicação Assertiva",
  "Estilos de Negociadores",
  "Gestão de Conflitos e Inadimplência",
  "Gestão da Informação e Liderança"
] as const;

// Default initial teacher feedback bank tailored for PDG Cooperalfa
export const DEFAULT_FEEDBACK_TEMPLATES = {
  high: "Excelente desempenho gerencial! Demonstrou pleno domínio dos conceitos do Método de Harvard e do modelo cooperativista, com visão estratégica e foco em relacionamentos de longo prazo.",
  medium: "Bom desempenho global. Recomenda-se reforçar a aplicação prática das técnicas de separação entre pessoas e problemas e cálculo de MAANA nas negociações de balcão.",
  needsImprovement: "Desempenho com pontos importantes de atenção. Necessário revisar os fundamentos de negociação cooperativa, escuta ativa e gerenciamento de conflitos de pós-venda.",
  pending: "Avaliação ainda não iniciada pelo aluno."
};
