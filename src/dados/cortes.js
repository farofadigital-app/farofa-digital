// Maciez indicativa: escala de 1 (mais firme) a 5 (mais macia).
export const CORTES = [
  {
    id: 'picanha',
    nome: 'Picanha',
    categoria: 'Bovinos',
    parte: 'Traseiro',
    dificuldade: 'Fácil',
    maciez: 4,
    gordura: 'Média',
    descricao:
      'Corte do traseiro do boi, com uma capa de gordura por cima que mantém a carne suculenta. É o símbolo do churrasco brasileiro.',
    usoIdeal: 'Churrasco na brasa ou na grelha, inteira ou em bifes grossos.',
    dica:
      'N retire a capa de gordura antes de assar. Tempere com sal grosso e vire poucas vezes.'
  },
  {
    id: 'alcatra',
    nome: 'Alcatra',
    categoria: 'Bovinos',
    parte: 'Traseiro',
    dificuldade: 'Fácil',
    maciez: 3,
    gordura: 'Baixa',
    descricao:
      'Corte magro e macio do traseiro. A maminha, muito usada no churrasco, faz parte dela.',
    usoIdeal: 'Bifes na chapa, churrasco e assados no forno.',
    dica:
      'Por ser magra, n deixe passar do ponto. Cortar a carne contra o sentido das fibras deixa a mordida mais macia.'
  },
  {
    id: 'file-mignon',
    nome: 'Filé Mignon',
    categoria: 'Bovinos',
    parte: 'Traseiro',
    dificuldade: 'Médio',
    maciez: 5,
    gordura: 'Baixa',
    descricao:
      'Fica no lombo e é um músculo pouco usado pelo animal, por isso é o corte mais macio. Tem pouquíssima gordura.',
    usoIdeal: 'Medalhões, grelhados rápidos, strogonoff e pratos com molho.',
    dica:
      'Cozinha rápido e seca com facilidade. Sele em fogo alto e retire antes de passar do ponto.'
  },
  {
    id: 'costela',
    nome: 'Costela',
    categoria: 'Bovinos',
    parte: 'Dianteiro',
    dificuldade: 'Difícil',
    maciez: 3,
    gordura: 'Alta',
    descricao:
      'Corte com osso, muita gordura e tecido que derrete no cozimento. Pede tempo, mas rende muito sabor.',
    usoIdeal: 'Assado lento (fogo de ch ou forno baixo) e cozidos.',
    dica:
      'A paciência faz a diferença: fogo baixo por várias horas deixa a carne macia e soltando do osso.'
  },
  {
    id: 'coxao-mole',
    nome: 'Cox Mole',
    categoria: 'Bovinos',
    parte: 'Traseiro',
    dificuldade: 'Médio',
    maciez: 3,
    gordura: 'Baixa',
    descricao:
      'Corte magro da parte interna da coxa. É muito versátil e comum no dia a dia.',
    usoIdeal: 'Bifes, carne de panela, rocambole e bife à milanesa.',
    dica:
      'Bata levemente os bifes antes de temperar e evite cozinhar demais em fogo alto, para n ressecar.'
  },
  {
    id: 'patinho',
    nome: 'Patinho',
    categoria: 'Bovinos',
    parte: 'Traseiro',
    dificuldade: 'Fácil',
    maciez: 3,
    gordura: 'Baixa',
    descricao:
      'Corte magro da coxa, com fibras finas e poucas gorduras. Muito usado para moer.',
    usoIdeal: 'Carne moída, almôndegas, bifes e carne de panela.',
    dica:
      'Na carne moída, refogue bem para soltar o sabor e acrescente um pouco de gordura se quiser mais suculência.'
  },
  {
    id: 'acem',
    nome: 'Acém',
    categoria: 'Bovinos',
    parte: 'Dianteiro',
    dificuldade: 'Médio',
    maciez: 2,
    gordura: 'Média',
    descricao:
      'Corte do pescoço e da parte da frente do boi, com fibras mais firmes. Fica macio e saboroso com cozimento longo.',
    usoIdeal: 'Cozidos, ensopados, picadinho e carne moída para molhos.',
    dica:
      'Cozinhe em fogo baixo e com líquido, de preferência na panela de press, até a carne ficar macia.'
  },
  {
    id: 'peito-frango',
    nome: 'Peito de frango',
    categoria: 'Aves',
    parte: 'Peito',
    dificuldade: 'Fácil',
    maciez: 3,
    gordura: 'Baixa',
    descricao: 'Carne magra e versátil, vendida com ou sem osso e pele.',
    usoIdeal: 'Grelhados, assados, empanados, recheados e desfiados.',
    dica: 'Corte em porções de espessura parecida para cozinhar por igual e confira se está completamente cozido antes de servir.'
  },
  {
    id: 'coxa-sobrecoxa',
    nome: 'Coxa e sobrecoxa',
    categoria: 'Aves',
    parte: 'Perna',
    dificuldade: 'Fácil',
    maciez: 4,
    gordura: 'Média',
    descricao: 'Partes da perna do frango, geralmente mais suculentas que o peito.',
    usoIdeal: 'Assados, ensopados, grelhados e preparos com molho.',
    dica: 'Com osso, o cozimento costuma levar mais tempo. Garanta que a parte mais espessa esteja completamente cozida.'
  },
  {
    id: 'asa-frango',
    nome: 'Asa de frango',
    categoria: 'Aves',
    parte: 'Asa',
    dificuldade: 'Fácil',
    maciez: 3,
    gordura: 'Média',
    descricao: 'Corte com pele e osso, dividido em ponta, meio da asa e drumette.',
    usoIdeal: 'Assada, grelhada ou cozida em molhos.',
    dica: 'Se assar, disponha as peças sem amontoar para dourarem por igual e cozinhe completamente.'
  },
  {
    id: 'lombo-suino',
    nome: 'Lombo suíno',
    categoria: 'Suínos',
    parte: 'Lombo',
    dificuldade: 'Médio',
    maciez: 3,
    gordura: 'Baixa',
    descricao: 'Corte comprido e relativamente magro, retirado da regi do lombo do porco.',
    usoIdeal: 'Assados, medalhões e bifes.',
    dica: 'Como é mais magro, evite cozinhar por tempo excessivo; use um termômetro culinário para conferir o ponto seguro.'
  },
  {
    id: 'pernil-suino',
    nome: 'Pernil suíno',
    categoria: 'Suínos',
    parte: 'Perna traseira',
    dificuldade: 'Médio',
    maciez: 3,
    gordura: 'Média',
    descricao: 'Corte grande da perna traseira, vendido com osso ou desossado.',
    usoIdeal: 'Assados, bifes e carne desfiada.',
    dica: 'Para assados grandes, cozinhe até o centro atingir uma temperatura segura e deixe descansar antes de fatiar.'
  },
  {
    id: 'costelinha-suino',
    nome: 'Costelinha suína',
    categoria: 'Suínos',
    parte: 'Costela',
    dificuldade: 'Médio',
    maciez: 3,
    gordura: 'Média',
    descricao: 'Costelas menores com carne entre os ossos e uma camada de gordura.',
    usoIdeal: 'Assada lentamente, grelhada ou cozida com molho.',
    dica: 'O cozimento lento ajuda a amaciar; evite que a superfície queime antes de o interior cozinhar.'
  },
  {
    id: 'cubos',
    nome: 'Cubos',
    categoria: 'Frutas e vegetais',
    tipo: 'Corte em cubos',
    parte: 'Frutas e vegetais',
    descricao: 'Pedaços em forma de cubo. Tente manter o tamanho parecido para um resultado uniforme.',
    usoIdeal: 'Batata para ensopados, abóbora para assar, manga para saladas de frutas.',
    dica: 'Primeiro corte o alimento em fatias ou tiras e depois divida em cubos do tamanho desejado.'
  },
  {
    id: 'rodelas',
    nome: 'Rodelas',
    categoria: 'Frutas e vegetais',
    tipo: 'Corte transversal',
    parte: 'Frutas e vegetais',
    descricao: 'Fatias redondas feitas ao cortar o alimento transversalmente.',
    usoIdeal: 'Cenoura, abobrinha, pepino, banana e tomate.',
    dica: 'Apoie o alimento na tábua e procure manter a espessura das fatias regular.'
  },
  {
    id: 'julienne',
    nome: 'Julienne',
    categoria: 'Frutas e vegetais',
    tipo: 'Tiras finas',
    parte: 'Frutas e vegetais',
    descricao: 'Tiras finas e compridas, também chamadas de tirinhas.',
    usoIdeal: 'Cenoura, piment e abobrinha em salteados ou saladas.',
    dica: 'Corte o alimento em placas e depois transforme as placas em tiras de espessura semelhante.'
  },
  {
    id: 'bastoes',
    nome: 'Bastões',
    categoria: 'Frutas e vegetais',
    tipo: 'Tiras grossas',
    parte: 'Frutas e vegetais',
    descricao: 'Tiras mais grossas, parecidas com palitos.',
    usoIdeal: 'Batata para assar, pepino e cenoura para servir como petisco.',
    dica: 'Apare as laterais para estabilizar o alimento antes de cortar os bastões.'
  },
  {
    id: 'brunoise',
    nome: 'Brunoise',
    categoria: 'Frutas e vegetais',
    tipo: 'Cubinhos pequenos',
    parte: 'Frutas e vegetais',
    descricao: 'Cubinhos pequenos e regulares, geralmente feitos a partir de tiras finas.',
    usoIdeal: 'Cebola, cenoura e sals para bases de molhos e recheios.',
    dica: 'Faça primeiro tiras finas e corte-as transversalmente em cubinhos.'
  },
  {
    id: 'chiffonade',
    nome: 'Chiffonade',
    categoria: 'Frutas e vegetais',
    tipo: 'Tiras de folhas',
    parte: 'Folhas',
    descricao: 'Tiras finas feitas ao empilhar e enrolar folhas antes de fatiá-las.',
    usoIdeal: 'Couve, manjeric, espinafre e outras folhas.',
    dica: 'Lave e seque bem as folhas, empilhe algumas, enrole sem apertar e fatie com cuidado.'
  }
];



