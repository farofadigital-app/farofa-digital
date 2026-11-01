// Mantém o mesmo formato de antes (id numérico, ingredientes em texto, modoPreparo em texto),
// então as telas atuais continuam funcionando. Campos novos: categoria, regiao e tempoMinutos.
export const RECEITAS = [
  {
    id: 1,
    nome: 'Feijoada Completa',
    categoria: 'Prato principal',
    regiao: 'Sudeste',
    tempo: '3h',
    tempoMinutos: 180,
    porcoes: 8,
    dificuldade: 'Média',
    ingredientes: [
      '500 g de feijão preto',
      '300 g de carne seca dessalgada',
      '500 g de costelinha de porco',
      '300 g de linguiça calabresa',
      '1 cebola picada',
      '4 dentes de alho',
      '2 folhas de louro',
      'Sal a gosto',
      '2 xícaras de arroz',
      '1 maço de couve',
      '2 laranjas'
    ],
    modoPreparo:
      'Deixe o feijão de molho de um dia para o outro e a carne seca dessalgando na água, trocando-a algumas vezes. Cozinhe o feijão com o louro, a carne seca e a costelinha por cerca de 2 horas, até ficar macio. Refogue a cebola e o alho, junte a linguiça em rodelas e acrescente ao feijão. Cozinhe por mais 30 minutos e acerte o sal. Sirva com arroz, couve refogada e laranja em fatias.',
    favorito: false
  },
  {
    id: 2,
    nome: 'Moqueca Baiana',
    categoria: 'Prato principal',
    regiao: 'Nordeste',
    tempo: '45min',
    tempoMinutos: 45,
    porcoes: 4,
    dificuldade: 'Fácil',
    ingredientes: [
      '800 g de peixe em postas',
      'Suco de 1 limão',
      '400 ml de leite de coco',
      '3 colheres (sopa) de azeite de dendê',
      '2 pimentões',
      '3 tomates em rodelas',
      '1 cebola em rodelas',
      '1 maço de coentro',
      'Sal a gosto'
    ],
    modoPreparo:
      'Tempere o peixe com limão e sal e deixe descansar por 15 minutos. Em uma panela, monte camadas de cebola, tomate, pimentão e peixe. Regue com o leite de coco e o dendê. Cozinhe tampado, em fogo médio, por cerca de 20 minutos. Finalize com coentro picado.',
    favorito: false
  },
  {
    id: 3,
    nome: 'Pão de Queijo',
    categoria: 'Salgados',
    regiao: 'Sudeste',
    tempo: '45min',
    tempoMinutos: 45,
    porcoes: 8,
    dificuldade: 'Média',
    ingredientes: [
      '2 xícaras de polvilho azedo',
      '1 xícara de leite',
      '1/2 xícara de óleo',
      '1 colher (chá) de sal',
      '2 ovos',
      '200 g de queijo minas curado ralado'
    ],
    modoPreparo:
      'Ferva o leite com o óleo e o sal e despeje sobre o polvilho, misturando bem. Deixe amornar e junte os ovos e o queijo, sovando até a massa ficar lisa. Faça bolinhas e coloque em uma assadeira. Asse em forno a 200 °C por cerca de 25 minutos, até dourar.',
    favorito: false
  },
  {
    id: 4,
    nome: 'Brigadeiro',
    categoria: 'Doces',
    regiao: 'Todo o Brasil',
    tempo: '30min',
    tempoMinutos: 30,
    porcoes: 10,
    dificuldade: 'Fácil',
    ingredientes: [
      '1 lata de leite condensado',
      '1 colher (sopa) de manteiga',
      '4 colheres (sopa) de chocolate em pó',
      'Chocolate granulado para enrolar'
    ],
    modoPreparo:
      'Misture o leite condensado, a manteiga e o chocolate em pó em uma panela. Cozinhe em fogo baixo, mexendo sempre, por cerca de 10 minutos, até desgrudar do fundo. Deixe esfriar, enrole em bolinhas e passe no granulado.',
    favorito: false
  },
  {
    id: 5,
    nome: 'Farofa Simples',
    categoria: 'Acompanhamentos',
    regiao: 'Todo o Brasil',
    tempo: '20min',
    tempoMinutos: 20,
    porcoes: 6,
    dificuldade: 'Fácil',
    ingredientes: [
      '2 xícaras de farinha de mandioca',
      '3 colheres (sopa) de manteiga',
      '1/2 cebola picada',
      '2 dentes de alho',
      '2 ovos',
      'Sal a gosto'
    ],
    modoPreparo:
      'Refogue a cebola e o alho na manteiga. Junte os ovos e mexa até cozinharem. Acrescente a farinha aos poucos, mexendo por cerca de 5 minutos, até ficar soltinha. Acerte o sal.',
    favorito: false
  },
  {
    id: 6,
    nome: 'Arroz Carreteiro',
    categoria: 'Prato principal',
    regiao: 'Sul',
    tempo: '1h',
    tempoMinutos: 60,
    porcoes: 4,
    dificuldade: 'Média',
    ingredientes: [
      '300 g de charque dessalgado',
      '2 xícaras de arroz',
      '1 cebola picada',
      '3 dentes de alho',
      '2 tomates picados',
      '4 xícaras de água quente',
      'Cheiro-verde a gosto',
      '2 colheres (sopa) de óleo'
    ],
    modoPreparo:
      'Deixe o charque de molho no dia anterior, trocando a água, e cozinhe até amaciar. Desfie. Refogue a cebola e o alho no óleo, junte o charque e frite por alguns minutos. Acrescente o tomate e o arroz e mexa. Adicione a água quente e cozinhe com a panela semitampada até o arroz secar. Finalize com cheiro-verde.',
    favorito: false
  },
  {
    id: 7,
    nome: 'Espaguete ao Molho de Tomate',
    categoria: 'Massa',
    regiao: 'Itália',
    tempo: '35min',
    tempoMinutos: 35,
    porcoes: 4,
    dificuldade: 'Fácil',
    ingredientes: [
      '400 g de espaguete',
      '6 tomates maduros picados',
      '2 dentes de alho picados',
      '2 colheres (sopa) de azeite',
      'Folhas de manjericão',
      'Sal e pimenta a gosto',
      'Queijo parmesão ralado'
    ],
    modoPreparo:
      'Cozinhe o espaguete em água fervente com sal até ficar al dente e reserve um pouco da água do cozimento. Aqueça o azeite e doure o alho. Junte os tomates e cozinhe em fogo baixo por 20 minutos, mexendo até formar um molho. Tempere com sal e pimenta, misture a massa ao molho e ajuste a textura com um pouco da água reservada. Sirva com manjericão e parmesão.',
    favorito: false
  },
  {
    id: 8,
    nome: 'Tacos de Frango',
    categoria: 'Prato principal',
    regiao: 'México',
    tempo: '40min',
    tempoMinutos: 40,
    porcoes: 4,
    dificuldade: 'Fácil',
    ingredientes: [
      '500 g de peito de frango em tiras',
      '8 tortillas de milho ou trigo',
      '1 colher (chá) de páprica',
      '1 colher (chá) de cominho',
      '1 cebola fatiada',
      '2 tomates picados',
      '1 abacate maduro',
      'Suco de 1 limão',
      'Coentro e sal a gosto'
    ],
    modoPreparo:
      'Tempere o frango com páprica, cominho e sal. Aqueça uma frigideira com um fio de óleo e cozinhe o frango até dourar e ficar completamente cozido. Amasse o abacate com o limão e uma pitada de sal. Aqueça as tortillas, recheie com frango, tomate, cebola e o creme de abacate. Finalize com coentro.',
    favorito: false
  },
  {
    id: 9,
    nome: 'Yakisoba de Legumes',
    categoria: 'Massa',
    regiao: 'Japão',
    tempo: '35min',
    tempoMinutos: 35,
    porcoes: 4,
    dificuldade: 'Fácil',
    ingredientes: [
      '300 g de macarrão para yakisoba',
      '1 cenoura em tiras',
      '1 xícara de brócolis em floretes',
      '1 xícara de repolho fatiado',
      '150 g de cogumelos fatiados',
      '4 colheres (sopa) de molho de soja',
      '1 colher (sopa) de óleo de gergelim',
      '1 colher (chá) de gengibre ralado',
      'Cebolinha a gosto'
    ],
    modoPreparo:
      'Cozinhe o macarrão conforme as instruções da embalagem e escorra. Aqueça o óleo de gergelim em uma frigideira grande e refogue o gengibre, a cenoura e o brócolis por alguns minutos. Junte o repolho e os cogumelos e cozinhe até os legumes ficarem macios, mas ainda firmes. Acrescente o macarrão e o molho de soja, misture bem e finalize com cebolinha.',
    favorito: false
  },
  {
    id: 10,
    nome: 'Chana Masala',
    categoria: 'Prato principal',
    regiao: 'Índia',
    tempo: '40min',
    tempoMinutos: 40,
    porcoes: 4,
    dificuldade: 'Média',
    ingredientes: [
      '2 xícaras de grão-de-bico cozido',
      '1 cebola picada',
      '2 tomates picados',
      '2 dentes de alho picados',
      '1 colher (sopa) de gengibre ralado',
      '1 colher (chá) de garam masala',
      '1/2 colher (chá) de cúrcuma',
      '2 colheres (sopa) de óleo',
      '1 xícara de água',
      'Coentro e sal a gosto'
    ],
    modoPreparo:
      'Aqueça o óleo e refogue a cebola até ficar macia. Junte o alho, o gengibre, a cúrcuma e o garam masala e mexa por um minuto. Acrescente os tomates e cozinhe até formar um molho. Adicione o grão-de-bico, a água e o sal. Cozinhe em fogo baixo por 15 minutos, amassando alguns grãos para engrossar o molho. Sirva com coentro.',
    favorito: false
  },
  {
    id: 11,
    nome: 'Pad Thai de Tofu',
    categoria: 'Massa',
    regiao: 'Tailândia',
    tempo: '40min',
    tempoMinutos: 40,
    porcoes: 4,
    dificuldade: 'Média',
    ingredientes: [
      '250 g de macarrão de arroz',
      '200 g de tofu firme em cubos',
      '2 ovos',
      '1 cenoura em tiras',
      '2 xícaras de broto de feijão',
      '3 colheres (sopa) de molho de soja',
      '2 colheres (sopa) de suco de limão',
      '1 colher (sopa) de açúcar mascavo',
      '2 colheres (sopa) de óleo',
      'Amendoim torrado e cebolinha a gosto'
    ],
    modoPreparo:
      'Deixe o macarrão de arroz de molho em água morna pelo tempo indicado na embalagem e escorra. Misture o molho de soja, o limão e o açúcar. Doure o tofu em uma frigideira grande com metade do óleo e reserve. Adicione o restante do óleo, cozinhe os ovos mexendo e junte a cenoura e o macarrão. Acrescente o molho e misture até aquecer. Volte o tofu à frigideira, junte o broto de feijão e finalize com amendoim e cebolinha.',
    favorito: false
  },
  {
    id: 12,
    nome: 'Tortilla Espanhola',
    categoria: 'Prato principal',
    regiao: 'Espanha',
    tempo: '45min',
    tempoMinutos: 45,
    porcoes: 4,
    dificuldade: 'Média',
    ingredientes: [
      '600 g de batatas',
      '1 cebola',
      '6 ovos',
      '4 colheres (sopa) de azeite',
      'Sal e pimenta a gosto'
    ],
    modoPreparo:
      'Descasque e corte as batatas em fatias finas. Aqueça o azeite em uma frigideira e cozinhe as batatas com a cebola fatiada em fogo baixo, mexendo com cuidado até ficarem macias. Bata os ovos com sal e pimenta em uma tigela e misture as batatas escorridas. Volte a mistura à frigideira untada e cozinhe em fogo baixo. Quando firmar nas bordas, vire a tortilla com a ajuda de um prato e cozinhe o outro lado até ficar firme.',
    favorito: false
  },
  {
    id: 13,
    nome: 'Ratatouille',
    categoria: 'Prato principal',
    regiao: 'França',
    tempo: '1h',
    tempoMinutos: 60,
    porcoes: 4,
    dificuldade: 'Média',
    ingredientes: [
      '1 berinjela',
      '1 abobrinha',
      '1 pimentão',
      '4 tomates',
      '1 cebola',
      '2 dentes de alho',
      '3 colheres (sopa) de azeite',
      'Tomilho, sal e pimenta a gosto'
    ],
    modoPreparo:
      'Aqueça o forno a 190 °C. Refogue a cebola e o alho com uma colher de azeite e espalhe no fundo de uma assadeira. Corte a berinjela, a abobrinha, o pimentão e os tomates em rodelas. Disponha os legumes alternados sobre o refogado, tempere com sal, pimenta e tomilho e regue com o azeite restante. Cubra com papel-alumínio e asse por 30 minutos; retire o papel e asse por mais 15 minutos, até os legumes ficarem macios.',
    favorito: false
  },
  {
    id: 14,
    nome: 'Cuscuz Marroquino com Legumes',
    categoria: 'Acompanhamentos',
    regiao: 'Marrocos',
    tempo: '30min',
    tempoMinutos: 30,
    porcoes: 4,
    dificuldade: 'Fácil',
    ingredientes: [
      '1 xícara de cuscuz marroquino',
      '1 xícara de caldo de legumes quente',
      '1 cenoura em cubos pequenos',
      '1 abobrinha em cubos pequenos',
      '1/2 xícara de grão-de-bico cozido',
      '2 colheres (sopa) de azeite',
      '1/2 colher (chá) de cominho',
      'Uvas-passas e salsinha a gosto',
      'Sal e pimenta a gosto'
    ],
    modoPreparo:
      'Coloque o cuscuz em uma tigela, despeje o caldo quente, tampe e deixe hidratar por cinco minutos. Solte os grãos com um garfo. Aqueça o azeite e refogue a cenoura e a abobrinha até ficarem macias. Junte o grão-de-bico, o cominho e as uvas-passas e aqueça por alguns minutos. Misture ao cuscuz, tempere com sal e pimenta e finalize com salsinha.',
    favorito: false
  }
];