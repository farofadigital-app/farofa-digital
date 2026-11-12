import { validarPerguntas } from './quiz';

// 5 Pilares Reais da Chef Ana (Acolhedora & Olho Clínico):
// 1. Organização & Bancada (Mise en Place)
// 2. Nomes de Utensílios & Para que Servem
// 3. Limpeza, Higiene & Segurança
// 4. Guardar, Conservar & Descongelar
// 5. Técnicas Básicas de Fogo & Preparo

export const PERGUNTAS_ANA = [
  // Pilar 1: Organização & Bancada (Mise en Place)
  {
    id: 'ana-001',
    categoria: 'Organização & Bancada',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Antes de acender qualquer chama no fogão, qual é a primeira coisa indispensável a fazer?',
    alternativas: [
      'Separar, lavar, picar e medir todos os ingredientes na bancada (mise en place)',
      'Já jogar o óleo frio na panela e esperar esquentar',
      'Ligar o exaustor no máximo e abrir a geladeira',
      'Colocar a mesa de jantar com os talheres'
    ],
    correta: 'Separar, lavar, picar e medir todos os ingredientes na bancada (mise en place)',
    explicacao: 'Vem cá com calma: o famoso mise en place evita que o alho queime enquanto você ainda procura a cebola na gaveta!'
  },
  {
    id: 'ana-002',
    categoria: 'Organização & Bancada',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Sua tábua de corte está deslizando na bancada lisa enquanto você corta. Como resolver com segurança?',
    alternativas: [
      'Colocar um pano de prato limpo levemente úmido embaixo da tábua',
      'Segurar com mais força usando apenas a ponta dos dedos',
      'Passar um pouco de óleo na bancada para fixar',
      'Apoiar a tábua na beirada da pia suspensa'
    ],
    correta: 'Colocar um pano de prato limpo levemente úmido embaixo da tábua',
    explicacao: 'Segredo de ouro de cozinha: um pano úmido (ou papel toalha) embaixo cria atrito e a tábua fica firme como pedra.'
  },
  {
    id: 'ana-003',
    categoria: 'Organização & Bancada',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'O que é a famosa "lixeira de bancada" e por que os chefs a mantêm por perto ao picar legumes?',
    alternativas: [
      'Uma tigela ou recipiente para recolher cascas e talos sem precisar ir à lixeira no chão a todo instante',
      'Um saco plástico para jogar restos de comida depois de cozidos',
      'Um balde com água sanitária para mergulhar as facas',
      'Um pote de vidro hermético para armazenar sobras'
    ],
    correta: 'Uma tigela ou recipiente para recolher cascas e talos sem precisar ir à lixeira no chão a todo instante',
    explicacao: 'Uma tigela de descartes ao lado da tábua mantém sua área de corte limpa e evita ficar abrindo lixeira com as mãos enquanto cozinha.'
  },

  // Pilar 2: Nomes de Utensílios & Para que Servem
  {
    id: 'ana-004',
    categoria: 'Utensílios de Cozinha',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Para que serve a espátula de silicone conhecida popularmente no Brasil como "pão-duro"?',
    alternativas: [
      'Raspar tigelas e panelas perfeitamente sem deixar sobras nem arranhar',
      'Cortar pães rústicos de fermentação natural',
      'Bater massas pesadas de pão de queijo',
      'Retirar alimentos de fritura em imersão'
    ],
    correta: 'Raspar tigelas e panelas perfeitamente sem deixar sobras nem arranhar',
    explicacao: 'O pão-duro não perdoa: raspa até a última gota de brigadeiro ou massa, evitando qualquer desperdício com carinho!'
  },
  {
    id: 'ana-005',
    categoria: 'Utensílios de Cozinha',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual utensílio de arames em formato de gota é o melhor amigo para bater ovos e emulsionar molhos sem grumos?',
    alternativas: [
      'Fouet (batedor de arame)',
      'Escumadeira perfurada',
      'Garfo de assado',
      'Concha de feijão'
    ],
    correta: 'Fouet (batedor de arame)',
    explicacao: 'O fouet incorpora ar e desfaz pelotinhos de farinha ou cacau rapidinho, deixando cremes e omeletes macios.'
  },
  {
    id: 'ana-006',
    categoria: 'Utensílios de Cozinha',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Para que serve a haste de aço estriada chamada "chaira" antes de usar a faca do chef?',
    alternativas: [
      'Alinhar e assentar o fio da lâmina já afiada',
      'Lixar e desgastar lâminas enferrujadas',
      'Quebrar ossos e cartilagens antes de picar',
      'Descascar legumes cilíndricos como cenouras'
    ],
    correta: 'Alinhar e assentar o fio da lâmina já afiada',
    explicacao: 'A chaira não afia do zero, mas desentorta o microfio que dobra no uso diário. Faca alinhada corta manteiga!'
  },
  {
    id: 'ana-007',
    categoria: 'Utensílios de Cozinha',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'Quando devemos dar preferência a uma panela de aço inox com fundo triplo em vez de uma de alumínio fino?',
    alternativas: [
      'Em cozimentos longos e molhos que precisam de calor distribuído de forma homogênea sem queimar o fundo',
      'Apenas para esquentar água rápida de café',
      'Somente para fazer pipoca sem óleo',
      'Para fritar ovos com manteiga fria'
    ],
    correta: 'Em cozimentos longos e molhos que precisam de calor distribuído de forma homogênea sem queimar o fundo',
    explicacao: 'O fundo triplo retém e espalha o calor suavemente, evitando que o fundo do ensopado queime enquanto o restante cozinha.'
  },

  // Pilar 3: Limpeza, Higiene & Segurança
  {
    id: 'ana-008',
    categoria: 'Limpeza, Higiene & Segurança',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Por que os manuais de saúde e os chefs profissionais proíbem terminantemente lavar frango cru na pia?',
    alternativas: [
      'Os respingos d’água espalham bactérias perigosas (como Salmonella) por até 1 metro na pia, esponja e louça',
      'A água retira toda a gordura natural saborosa do peito de frango',
      'O frango desmancha completamente ao contato com água corrente',
      'O sal e a pimenta não fixam mais na carne úmida'
    ],
    correta: 'Os respingos d’água espalham bactérias perigosas (como Salmonella) por até 1 metro na pia, esponja e louça',
    explicacao: 'Nunca lave o frango! O que mata bactérias é o calor do cozimento (acima de 74°C), e não a água da torneira.'
  },
  {
    id: 'ana-009',
    categoria: 'Limpeza, Higiene & Segurança',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Por que NUNCA devemos usar um pano de prato úmido para tirar uma assadeira ou panela pelando do fogo?',
    alternativas: [
      'A água conduz calor quase instantaneamente e o vapor queima sua mão na hora',
      'O pano úmido pode manchar o metal da assadeira',
      'O choque térmico do pano racha as assadeiras de inox',
      'O pano solta fiapos na comida quente'
    ],
    correta: 'A água conduz calor quase instantaneamente e o vapor queima sua mão na hora',
    explicacao: 'Cuidado essencial: tecido molhado ou úmido vira condutor térmico violento! Use sempre luva térmica ou pano 100% seco e dobrado.'
  },
  {
    id: 'ana-010',
    categoria: 'Limpeza, Higiene & Segurança',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Você acabou de cortar peito de frango cru na tábua e agora precisa cortar alface e tomates para a salada. O que fazer?',
    alternativas: [
      'Lavar a tábua e faca com água quente e sabão (ou usar uma tábua separada e higienizada)',
      'Apenas passar um guardanapo de papel seco para tirar o líquido',
      'Virar a tábua do outro lado sem lavar',
      'Cortar os tomates primeiro empurrando os restos para o cantinho'
    ],
    correta: 'Lavar a tábua e faca com água quente e sabão (ou usar uma tábua separada e higienizada)',
    explicacao: 'Isso é contaminação cruzada! O frango vai ao fogo e mata germes, mas a salada será comida crua.'
  },
  {
    id: 'ana-011',
    categoria: 'Limpeza, Higiene & Segurança',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual é a regra clássica de ouro de quem cozinha com capricho e sem sofrimento na pia?',
    alternativas: [
      '"Sujou, lavou": lavar tigelas e tábuas nos intervalos do cozimento para a pia não virar uma montanha',
      'Acumular toda a louça na cuba e só lavar no dia seguinte',
      'Usar pratos descartáveis para não ter trabalho de esponja',
      'Deixar panelas de molho durante uma semana inteira'
    ],
    correta: '"Sujou, lavou": lavar tigelas e tábuas nos intervalos do cozimento para a pia não virar uma montanha',
    explicacao: 'Enquanto a cebola doura ou o caldo apura, passe a bucha no que usou. Cozinha limpa é mente tranquila!'
  },

  // Pilar 4: Guardar, Conservar & Descongelar
  {
    id: 'ana-012',
    categoria: 'Guardar & Conservar',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual é o lugar correto e seguro para descongelar carnes e aves para o almoço do dia seguinte?',
    alternativas: [
      'Dentro da geladeira, na prateleira de baixo, em recipiente com bordas',
      'Em cima da pia na cozinha quente durante a noite toda',
      'Em uma bacia de água quente sob sol forte',
      'Direto no micro-ondas em potência máxima até cozinhar as pontas'
    ],
    correta: 'Dentro da geladeira, na prateleira de baixo, em recipiente com bordas',
    explicacao: 'Descongelar na bancada deixa a parte de fora em temperatura perigosa (bactérias adoram) enquanto o meio ainda está congelado.'
  },
  {
    id: 'ana-013',
    categoria: 'Guardar & Conservar',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Ao organizar a geladeira de casa, em qual prateleira devemos colocar carnes cruas marinando?',
    alternativas: [
      'Na prateleira mais baixa, para evitar que qualquer líquido pingue em alimentos prontos',
      'Na prateleira mais alta ao lado do queijo e do leite',
      'Na porta da geladeira junto dos refrigerantes',
      'Na gaveta fechada junto com as folhas de alface'
    ],
    correta: 'Na prateleira mais baixa, para evitar que qualquer líquido pingue em alimentos prontos',
    explicacao: 'Alimentos prontos no topo e carnes cruas na parte mais baixa: se vazar uma gota, não contamina nada embaixo.'
  },
  {
    id: 'ana-014',
    categoria: 'Guardar & Conservar',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Para guardar sobras de comida cozida na geladeira com segurança, qual a melhor recomendação?',
    alternativas: [
      'Guardar em potes fechados e rasos assim que a comida parar de soltar fumaça intensa (até 2h)',
      'Esperar a panela esfriar por 8 horas em cima do fogão',
      'Guardar na panela de alumínio sem tampa para circular ar',
      'Colocar no congelador ainda fervendo borbulhando na panela de pressão'
    ],
    correta: 'Guardar em potes fechados e rasos assim que a comida parar de soltar fumaça intensa (até 2h)',
    explicacao: 'Potes rasos resfriam por igual e rápido. Não deixe comida cozida mais de duas horas passeando na temperatura ambiente!'
  },

  // Pilar 5: Técnicas Básicas de Fogo & Preparo
  {
    id: 'ana-015',
    categoria: 'Técnicas de Fogo & Preparo',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Na hora do refogado brasileiro clássico, quem entra primeiro na panela: o alho ou a cebola?',
    alternativas: [
      'A cebola entra primeiro; o alho entra só quando a cebola já amoleceu e começou a ficar translúcida',
      'O alho entra primeiro e deve ficar marrom escuro antes da cebola',
      'Ambos juntos com a panela fria e fogo no máximo',
      'O alho entra no fim com o prato já servido no prato'
    ],
    correta: 'A cebola entra primeiro; o alho entra só quando a cebola já amoleceu e começou a ficar translúcida',
    explicacao: 'O alho tem menos água e queima com facilidade, ficando amargo. A cebola precisa de mais tempo para soltar água e adoçar!'
  },
  {
    id: 'ana-016',
    categoria: 'Técnicas de Fogo & Preparo',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Ao selar cubos de carne para um picadinho, o que acontece se você encher a frigideira até o topo?',
    alternativas: [
      'A temperatura da panela despenca, a carne solta água e ferve em vez de tostar dourada',
      'A carne doura muito mais rápido por causa da pressão',
      'O óleo espirra menos e a crosta fica crocante',
      'O sal penetra com o dobro de força na carne'
    ],
    correta: 'A temperatura da panela despenca, a carne solta água e ferve em vez de tostar dourada',
    explicacao: 'Para selar e criar aquela crostinha saborosa (reação de Maillard), precisa de espaço e calor alto. Sele aos poucos!'
  },
  {
    id: 'ana-017',
    categoria: 'Técnicas de Fogo & Preparo',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Você provou o ensopado e sentiu que ficou ligeiramente salgado além da conta. Qual truque caseiro ajuda a equilibrar?',
    alternativas: [
      'Acrescentar um pouco de água ou caldo sem sal, ou rodelas de batata crua para puxar o excesso',
      'Jogar uma colherada de farinha de trigo crua diretamente no prato',
      'Ferver em fogo alto para reduzir e evaporar o líquido',
      'Adicionar bicarbonato de sódio em pó'
    ],
    correta: 'Acrescentar um pouco de água ou caldo sem sal, ou rodelas de batata crua para puxar o excesso',
    explicacao: 'Diluir com caldo neutro ou cozinhar pedaços de batata ajuda a absorver e dispersar a concentração de sódio.'
  },
  {
    id: 'ana-018',
    categoria: 'Técnicas de Fogo & Preparo',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'O que significa a técnica suave de "banho-maria" e quando ela é indicada?',
    alternativas: [
      'Cozinhar o alimento em um recipiente aquecido pelo vapor ou água quente de outra panela (para pudins e derreter chocolate)',
      'Mergulhar o alimento em água com gelo e sal grosso',
      'Fritar em fogo alto com óleo até o meio da panela',
      'Deixar legumes marinando em vinagre sob o sol'
    ],
    correta: 'Cozinhar o alimento em um recipiente aquecido pelo vapor ou água quente de outra panela (para pudins e derreter chocolate)',
    explicacao: 'O banho-maria garante calor suave e controlado (abaixo de 100°C), ideal para não queimar chocolate nem talhar ovos do pudim.'
  },
  {
    id: 'ana-019',
    categoria: 'Técnicas de Fogo & Preparo',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'Na confeitaria, o que é o "ponto de fita" ao bater ovos e açúcar com o batedor?',
    alternativas: [
      'Quando o creme fica claro, volumoso e cai do batedor formando dobras contínuas que demoram a sumir',
      'Quando o açúcar queima no fundo da tigela de vidro',
      'Quando a mistura endurece e vira uma pasta de modelar',
      'Quando o ovo talha em pedacinhos cozidos'
    ],
    correta: 'Quando o creme fica claro, volumoso e cai do batedor formando dobras contínuas que demoram a sumir',
    explicacao: 'O ponto de fita retém ar na estrutura dos ovos, deixando bolos como o pão de ló incrivelmente fofos e aerados.'
  },
  {
    id: 'ana-020',
    categoria: 'Organização & Bancada',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'Como posicionar a mão de apoio ("mão de garra") ao usar a faca do chef para picar ervas ou vegetais?',
    alternativas: [
      'Dedos curvados para dentro com nós dos dedos guiando a lateral da lâmina e polegar protegido atrás',
      'Dedos bem abertos e espalmados sobre a tábua para segurar o alimento',
      'Segurar o vegetal com a ponta das unhas voltadas para a lâmina',
      'Manter a outra mão no bolso para não atrapalhar o corte'
    ],
    correta: 'Dedos curvados para dentro com nós dos dedos guiando a lateral da lâmina e polegar protegido atrás',
    explicacao: 'A postura da garra protege as pontas dos dedos e unhas. A lâmina desliza contra o nó dos dedos com total segurança!'
  }
];

validarPerguntas('PERGUNTAS_ANA', PERGUNTAS_ANA);
