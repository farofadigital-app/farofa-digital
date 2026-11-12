import { validarPerguntas } from './quiz';

// 5 Pilares Reais do Chef José (O Dono da Praça & Energia Carioca):
// 1. Organização & Bancada (Mise en Place)
// 2. Nomes de Utensílios & Para que Servem
// 3. Limpeza, Higiene & Segurança
// 4. Guardar, Conservar & Descongelar
// 5. Técnicas Básicas de Fogo & Preparo

export const PERGUNTAS_JOSE = [
  // Pilar 1: Organização & Bancada (Mise en Place)
  {
    id: 'jose-001',
    categoria: 'Organização & Bancada',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Chegou na praça de serviço agitada! Qual é a primeira lei sagrada da bancada antes de soltar o primeiro pedido?',
    alternativas: [
      'Deixar tudo picadinho, medido e nos potinhos (mise en place pronto)',
      'Ligar logo todas as bocas do fogão no fogo alto',
      'Jogar água no chão da cozinha para refrescar',
      'Gritar que o almoço já tá saindo sem ter panela no fogo'
    ],
    correta: 'Deixar tudo picadinho, medido e nos potinhos (mise en place pronto)',
    explicacao: 'Aí sim, parceiro! Se a bancada tá arrumada e o mise en place tá na mão, o serviço voa baixo sem desespero!'
  },
  {
    id: 'jose-002',
    categoria: 'Organização & Bancada',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Você tá cortando cebola na correria e a tábua tá sambando na bancada. Qual o macete dos mestres?',
    alternativas: [
      'Calçar a tábua com pano de prato úmido por baixo na mesma hora',
      'Pisar no freio e segurar a tábua com o cotovelo',
      'Passar manteiga na bancada pra grudar',
      'Trocar de faca por uma sem corte nenhum'
    ],
    correta: 'Calçar a tábua com pano de prato úmido por baixo na mesma hora',
    explicacao: 'Tábua solta é convite pro corte no dedo! Pano úmido embaixo e a tábua trava na bancada igual âncora.'
  },
  {
    id: 'jose-003',
    categoria: 'Organização & Bancada',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'O que o cozinheiro de respeito faz com talos de salsa, pontas de cebola e cascas de cenoura limpos?',
    alternativas: [
      'Guarda num saco no congelador para ferver um caldo caseiro aromático de primeira',
      'Joga tudo no lixo imediatamente sem pensar duas vezes',
      'Bate no liquidificador com água gelada para beber cru',
      'Joga na pia pro ralo triturar tudo'
    ],
    correta: 'Guarda num saco no congelador para ferver um caldo caseiro aromático de primeira',
    explicacao: 'Na cozinha boa nada se perde! Esses restos limpos viram o melhor caldo de legumes da sua vida, sem gastar um centavo.'
  },

  // Pilar 2: Nomes de Utensílios & Para que Servem
  {
    id: 'jose-004',
    categoria: 'Utensílios de Cozinha',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Para que serve a famosa "escumadeira" na linha de frente do fogão?',
    alternativas: [
      'Retirar alimentos de líquidos quentes ou óleo fervendo escorrendo o excesso',
      'Bater claras em neve bem firmes',
      'Amassar alho cru até virar pasta',
      'Alinhar o corte de facas de desossa'
    ],
    correta: 'Retirar alimentos de líquidos quentes ou óleo fervendo escorrendo o excesso',
    explicacao: 'Os furinhos deixam o caldo ou óleo passar e você resgata o pastel ou a batata frita sequinha!'
  },
  {
    id: 'jose-005',
    categoria: 'Utensílios de Cozinha',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual utensílio é um fatiador de lâmina afiada ajustável usado para laminar batata fininha tipo chips e legumes no capricho?',
    alternativas: [
      'Mandoline',
      'Chaira',
      'Fouet',
      'Espátula pão-duro'
    ],
    correta: 'Mandoline',
    explicacao: 'O mandoline fatia numa velocidade absurda! Só não esquece de usar o protetor de mão pra não laminar os dedos junto.'
  },
  {
    id: 'jose-006',
    categoria: 'Utensílios de Cozinha',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Quando uma boa frigideira de ferro fundido pesada é a dona absoluta do pedaço?',
    alternativas: [
      'Quando você precisa reter calor bruto para selar bifes e carnes criando aquela crosta perfeita',
      'Apenas para ferver chá de camomila',
      'Para bater bolo de caixinha',
      'Para guardar legumes na geladeira úmida'
    ],
    correta: 'Quando você precisa reter calor bruto para selar bifes e carnes criando aquela crosta perfeita',
    explicacao: 'Panela de ferro aguenta o tranco! Ela não esfria quando a carne bate nela, selando com moral e brasa viva.'
  },
  {
    id: 'jose-007',
    categoria: 'Utensílios de Cozinha',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'O que é o utensílio clássico "chinois" (peneira cônica de malha fina) e qual o seu papel?',
    alternativas: [
      'Coar caldos, molhos e fundos retirando qualquer impureza sólida para deixar o molho aveludado e límpido',
      'Uma frigideira com furos para assar castanhas',
      'Um rolo pesado para abrir massa de pastel',
      'Uma forma de assar pão de queijo'
    ],
    correta: 'Coar caldos, molhos e fundos retirando qualquer impureza sólida para deixar o molho aveludado e límpido',
    explicacao: 'O chinois filtra que é uma beleza! Dá aquele brilho de restaurante estrelado para qualquer molho de panela.'
  },

  // Pilar 3: Limpeza, Higiene & Segurança
  {
    id: 'jose-008',
    categoria: 'Limpeza, Higiene & Segurança',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'O estagiário da cozinha foi ligar a torneira pra dar banho em frango cru na pia. O que o Chef José grita na hora?',
    alternativas: [
      '"Para tudo! Frango cru não se lava na pia, senão espirra bactéria por toda a bancada!"',
      '"Isso aí, aproveita e lava com sabão em pó!"',
      '"Lava bem na pia de lavar louça de sobremesa!"',
      '"Joga água morna que fica mais macio!"'
    ],
    correta: '"Para tudo! Frango cru não se lava na pia, senão espirra bactéria por toda a bancada!"',
    explicacao: 'Segura a onda! Água espirra micróbio até na esponja da pia. O calor da frigideira a mais de 74°C é quem resolve o jogo.'
  },
  {
    id: 'jose-009',
    categoria: 'Limpeza, Higiene & Segurança',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Cabo de panela no fogão: pra onde ele deve ficar virado enquanto você cozinha com fogo aceso?',
    alternativas: [
      'Sempre virado para o lado de dentro do fogão, nunca para fora no corredor de passagem',
      'Virado bem pra fora pra qualquer um puxar com pressa',
      'Encostado na boca acesa ao lado para aquecer o pegador',
      'Virado pro chão amarrado com pano'
    ],
    correta: 'Sempre virado para o lado de dentro do fogão, nunca para fora no corredor de passagem',
    explicacao: 'Cabo pra fora é o maior perigo: se alguém esbarra, a panela quente tomba no chão ou em cima de quem passa!'
  },
  {
    id: 'jose-010',
    categoria: 'Limpeza, Higiene & Segurança',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Pegar uma tampa de panela fervendo com pano de prato molhado ou úmido dá bom ou dá ruim?',
    alternativas: [
      'Dá muito ruim! O calor vira vapor imediato na umidade do pano e queima a mão na hora',
      'Dá bom, porque o pano molhado esfria o metal',
      'Dá bom, porque melhora a aderência dos dedos',
      'Tanto faz se o tecido é fino ou grosso'
    ],
    correta: 'Dá muito ruim! O calor vira vapor imediato na umidade do pano e queima a mão na hora',
    explicacao: 'Pano molhado em metal quente é queimadura na certa! Pano pra pegar panela tem que tá 100% seco e dobrado firme.'
  },
  {
    id: 'jose-011',
    categoria: 'Limpeza, Higiene & Segurança',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual é o lema do cozinheiro carioca ligeiro pra terminar a noite com a cozinha brilhando?',
    alternativas: [
      '"Sujou, passou pano e lavou": bancada sempre limpa enquanto o fogo trabalha',
      'Deixar toda a bagunça pro turno da manhã resolver',
      'Esconder as panelas sujas dentro do forno apagado',
      'Lavar só os garfos e deixar as panelas na pia'
    ],
    correta: '"Sujou, passou pano e lavou": bancada sempre limpa enquanto o fogo trabalha',
    explicacao: 'Enquanto o prato ferve ou apura na panela, você ganha tempo e deixa a bancada no brilho. Quem organiza, reina!'
  },

  // Pilar 4: Guardar, Conservar & Descongelar
  {
    id: 'jose-012',
    categoria: 'Guardar & Conservar',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Quer descongelar aquela carne bonita de sol pro churrasco do fim de semana. Qual o jeito de profissional?',
    alternativas: [
      'Tirar do congelador 24h antes e passar para a geladeira devagarzinho',
      'Deixar de molho na água parada na bancada quente o dia todo',
      'Colocar no sol na janela da cozinha',
      'Tirar e já jogar a pedra de gelo na brasa estalando'
    ],
    correta: 'Tirar do congelador 24h antes e passar para a geladeira devagarzinho',
    explicacao: 'Descongelamento lento na geladeira preserva o suco da carne e não dá mole pras bactérias fazerem a festa.'
  },
  {
    id: 'jose-013',
    categoria: 'Guardar & Conservar',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Como etiquetar os potes de preparos e molhos na geladeira pra não comer coisa vencida?',
    alternativas: [
      'Colocar fita crepe com nome do prato e a data em que foi preparado',
      'Guardar tudo sem tampa e tentar adivinhar pelo cheiro na semana que vem',
      'Guardar em sacola de mercado escura fechada com nó cego',
      'Apenas confiar na memória'
    ],
    correta: 'Colocar fita crepe com nome do prato e a data em que foi preparado',
    explicacao: 'Fita crepe e caneta são ferramentas de chef! Bateu o olho, sabe o que é e quando foi feito. Desperdício zero!'
  },
  {
    id: 'jose-014',
    categoria: 'Guardar & Conservar',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Onde fica a zona mais segura na geladeira para guardar frutos do mar e carnes frescas antes de preparar?',
    alternativas: [
      'Na prateleira inferior, bem fechados, evitando pingar em outros alimentos',
      'Na porta da geladeira balançando toda vez que abre',
      'Soltos por cima do pudim e dos frios na prateleira de cima',
      'Dentro do forno elétrico desligado'
    ],
    correta: 'Na prateleira inferior, bem fechados, evitando pingar em outros alimentos',
    explicacao: 'Embaixo é onde a temperatura é firme e, se por acaso escapar uma gota de sangue, não contamina nada que tá pronto!'
  },

  // Pilar 5: Técnicas Básicas de Fogo & Preparo
  {
    id: 'jose-015',
    categoria: 'Técnicas de Fogo & Preparo',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual a diferença entre DOURAR e QUEIMAR a cebola no refogado de arroz e feijão?',
    alternativas: [
      'Dourar carameliza os açúcares naturais e fica adocicado; queimar carboniza e amarga o prato inteiro',
      'Queimar é o segredo de dar cor preta bonita pro arroz',
      'Dourar é quando a cebola fica crua e estalando',
      'Não tem diferença nenhuma no sabor final'
    ],
    correta: 'Dourar carameliza os açúcares naturais e fica adocicado; queimar carboniza e amarga o prato inteiro',
    explicacao: 'Fogo amigo! A cebola dourada no ponto solta doçura. Se passar do ponto e escurecer demais, o amargor estraga o refogado.'
  },
  {
    id: 'jose-016',
    categoria: 'Técnicas de Fogo & Preparo',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'O que significa o verbo "saltear" quando o chef agita a frigideira com movimentos firmes?',
    alternativas: [
      'Fazer os alimentos pularem na frigideira quente com pouca gordura, cozinhando rápido e por igual',
      'Jogar punhados de sal refinado por cima da comida',
      'Ferver legumes em banho de água salgada durante horas',
      'Tampar a panela com água e deixar cozinhar no vapor'
    ],
    correta: 'Fazer os alimentos pularem na frigideira quente com pouca gordura, cozinhando rápido e por igual',
    explicacao: 'Vem do francês "sauter" (pular)! Movimento rápido de punho pra virar o alimento sem precisar de colher, dourando tudo!'
  },
  {
    id: 'jose-017',
    categoria: 'Técnicas de Fogo & Preparo',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Você tá refogando alho picado no óleo quente e ele começou a amarelar. Quando você adiciona os outros ingredientes?',
    alternativas: [
      'Imediatamente, porque o alho queima em questão de segundos e fica intragável',
      'Espera ele ficar marrom escuro feito carvão',
      'Desliga o fogo e vai tomar um café',
      'Tira o alho da panela e joga fora'
    ],
    correta: 'Imediatamente, porque o alho queima em questão de segundos e fica intragável',
    explicacao: 'Alho não espera ninguém! Quando soltou o perfume e começou a dourar de leve, entra com o restante da receita na hora.'
  },
  {
    id: 'jose-018',
    categoria: 'Técnicas de Fogo & Preparo',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'O molho de tomate ou vinagrete ficou excessivamente ácido na boca. O que ajuda a redondear o sabor?',
    alternativas: [
      'Uma pitadinha de açúcar ou cenoura ralada para equilibrar a acidez natural',
      'Colocar um copo de vinagre puro a mais',
      'Adicionar água com gás fervendo',
      'Bater com cubos de gelo'
    ],
    correta: 'Uma pitadinha de açúcar ou cenoura ralada para equilibrar a acidez natural',
    explicacao: 'O toque de doçura neutraliza a ponta azeda do tomate sem mascarar o tempero. Cozinha é harmonia de sabor!'
  },
  {
    id: 'jose-019',
    categoria: 'Técnicas de Fogo & Preparo',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'O que é a técnica de "deglaçar" a panela com vinho, caldo ou água após dourar uma carne?',
    alternativas: [
      'Colocar líquido na panela ainda quente para soltar aquele fundinho caramelizado saboroso grudado no fundo',
      'Lavar a panela na torneira antes de servir',
      'Congelar a panela quente para tirar a gordura',
      'Cobrir a carne com farinha seca crua'
    ],
    correta: 'Colocar líquido na panela ainda quente para soltar aquele fundinho caramelizado saboroso grudado no fundo',
    explicacao: 'Aquele fundinho marrom agarrado na panela é puro ouro de sabor! O líquido ferve, solta tudo e vira um molho dos deuses.'
  },
  {
    id: 'jose-020',
    categoria: 'Limpeza, Higiene & Segurança',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'Pegou fogo no óleo da frigideira! Qual é o procedimento IMEDIATO e correto de segurança?',
    alternativas: [
      'Desligar o fogo e abafar a panela com uma tampa de metal ou pano úmido bem espremido (NUNCA jogar água!)',
      'Jogar um balde de água fria direto na chama da frigideira',
      'Pegar a frigideira na mão e correr para fora da cozinha',
      'Assoprar com força em cima do óleo fervendo'
    ],
    correta: 'Desligar o fogo e abafar a panela com uma tampa de metal ou pano úmido bem espremido (NUNCA jogar água!)',
    explicacao: 'REGRA DE SOBREVIVÊNCIA: NUNCA jogue água em óleo quente pegando fogo! A água vaporiza e espalha uma bola de fogo gigante. Corte o oxigênio abafando com a tampa!'
  }
];

validarPerguntas('PERGUNTAS_JOSE', PERGUNTAS_JOSE);
