/**
 * ========================================
 * ARQUIVO DE DADOS MOCK
 * ========================================
 * 
 * Este arquivo contém todos os dados estáticos da landing page.
 * Use este arquivo para personalizar facilmente o conteúdo sem
 * mexer no código dos componentes.
 * 
 * COMO PERSONALIZAR:
 * - Edite os textos diretamente
 * - Adicione/remova itens dos arrays
 * - Mantenha a estrutura dos objetos
 */

const mockData = {
  // ========================================
  // BENEFÍCIOS DO E-BOOK
  // ========================================
  // Lista dos 3 mitos abordados no e-book gratuito
  ebookBenefits: [
    {
      title: "Mito 1: Envelhecer é Sinônimo de Fraqueza",
      description: "Descubra como manter e até aumentar sua força e resistência após os 50 anos com exercícios específicos e seguros."
    },
    {
      title: "Mito 2: É Tarde Demais para Começar",
      description: "Aprenda por que nunca é tarde para iniciar uma rotina de exercícios e como começar de forma gradual e eficiente."
    },
    {
      title: "Mito 3: Exercícios São Perigosos na Terceira Idade",
      description: "Conheça os exercícios mais seguros e benéficos para pessoas maduras, com orientações práticas e científicas."
    }
  ],
  
  // ========================================
  // BENEFÍCIOS DO GRUPO WHATSAPP
  // ========================================
  // Principais vantagens de entrar no grupo VIP
  whatsappBenefits: [
    {
      title: "Dicas Diárias Exclusivas",
      description: "Receba todos os dias dicas práticas sobre exercícios, alimentação e hábitos saudáveis especialmente selecionadas para sua idade."
    },
    {
      title: "Comunidade Engajada",
      description: "Faça parte de uma comunidade de pessoas com os mesmos objetivos, compartilhe experiências e encontre motivação."
    },
    {
      title: "Suporte Especializado",
      description: "Tire suas dúvidas diretamente com nossos especialistas em saúde e educação física para a terceira idade."
    },
    {
      title: "Conteúdo Científico",
      description: "Acesse informações baseadas em evidências científicas, sempre atualizadas e adaptadas para pessoas 50+."
    },
    {
      title: "Exercícios Seguros",
      description: "Aprenda exercícios específicos para sua faixa etária, com demonstrações em vídeo e orientações detalhadas."
    },
    {
      title: "Acompanhamento Personalizado",
      description: "Receba orientações personalizadas baseadas em suas necessidades e limitações específicas."
    }
  ],
  
  // ========================================
  // DEPOIMENTOS DE CLIENTES
  // ========================================
  // Prova social com experiências reais (ou baseadas em casos reais)
  testimonials: [
    {
      name: "Maria Silva",
      age: 58,
      location: "São Paulo, SP",
      content: "Após seguir as dicas do grupo, consegui reduzir minhas dores nas costas e tenho muito mais energia para brincar com meus netos. O e-book foi um divisor de águas!"
    },
    {
      name: "João Santos",
      age: 62,
      location: "Rio de Janeiro, RJ",
      content: "Pensei que era tarde demais para começar, mas as orientações me mostraram que posso sim ter uma vida ativa. Já perdi 8kg e me sinto 10 anos mais jovem!"
    },
    {
      name: "Ana Costa",
      age: 55,
      location: "Belo Horizonte, MG",
      content: "A comunidade é incrível! Todos se ajudam e compartilham experiências. Os exercícios são seguros e eficazes. Recomendo para todos os amigos!"
    },
    {
      name: "Carlos Oliveira",
      age: 67,
      location: "Porto Alegre, RS",
      content: "Estava sedentário há anos, mas com as dicas do grupo consegui criar uma rotina saudável. Minha pressão arterial melhorou e durmo muito melhor!"
    }
  ],

  // ========================================
  // DADOS ADICIONAIS PARA FUTURAS EXPANSÕES
  // ========================================
  
  // Exercícios populares (para seção futura)
  popularExercises: [
    {
      name: "Caminhada",
      duration: "30 minutos",
      difficulty: "Fácil",
      benefits: "Melhora cardiovascular, fortalece pernas"
    },
    {
      name: "Alongamento",
      duration: "15 minutos", 
      difficulty: "Fácil",
      benefits: "Aumenta flexibilidade, reduz dores"
    },
    {
      name: "Exercícios com Peso Corporal",
      duration: "20 minutos",
      difficulty: "Moderado",
      benefits: "Fortalece músculos, melhora equilíbrio"
    }
  ],

  // Dicas de alimentação (para seção futura)
  nutritionTips: [
    {
      title: "Hidratação é Fundamental",
      description: "Beba pelo menos 8 copos de água por dia para manter o corpo funcionando bem."
    },
    {
      title: "Proteína em Cada Refeição",
      description: "Inclua fontes de proteína para manter a massa muscular após os 50."
    },
    {
      title: "Cores no Prato",
      description: "Varie as cores dos alimentos para garantir diferentes nutrientes."
    }
  ],

  // Estatísticas (para seção de credibilidade futura)
  stats: [
    {
      number: "500+",
      label: "Pessoas Transformadas"
    },
    {
      number: "95%",
      label: "Satisfação dos Membros"
    },
    {
      number: "2+", 
      label: "Anos de Experiência"
    },
    {
      number: "50+",
      label: "Dicas Exclusivas por Mês"
    }
  ]
};

// ========================================
// INSTRUÇÕES PARA PERSONALIZAÇÃO
// ========================================

/**
 * COMO ADICIONAR NOVOS BENEFÍCIOS DO E-BOOK:
 * 
 * Adicione um novo objeto ao array ebookBenefits:
 * {
 *   title: "Seu título aqui",
 *   description: "Sua descrição aqui"
 * }
 */

/**
 * COMO ADICIONAR NOVOS BENEFÍCIOS DO WHATSAPP:
 * 
 * Adicione um novo objeto ao array whatsappBenefits:
 * {
 *   title: "Título do benefício",
 *   description: "Descrição detalhada do benefício"
 * }
 */

/**
 * COMO ADICIONAR NOVOS DEPOIMENTOS:
 * 
 * Adicione um novo objeto ao array testimonials:
 * {
 *   name: "Nome do Cliente",
 *   age: 55,
 *   location: "Cidade, Estado",
 *   content: "Depoimento do cliente aqui..."
 * }
 */

export default mockData;