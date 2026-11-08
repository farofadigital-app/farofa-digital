import { validarPerguntas } from './quiz';

// dificuldade: 1 fácil, 2 médio, 3 difícil
// "correta" guarda o TEXTO da resposta (não a posição), ent pode embaralhar à vontade.
export const PERGUNTAS_ANA = [
  {
    id: 'ana-001',
    categoria: 'Pratos típicos',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual ingrediente é a base da feijoada?',
    alternativas: ['Feijão branco', 'Feijão preto', 'Feijão carioca', 'Grão-de-bico'],
    correta: 'Feijão preto',
    explicacao: 'A Feijão tradicional brasileira é feita com feijão preto.'
  },
  {
    id: 'ana-002',
    categoria: 'Pratos típicos',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual é a base da farofa tradicional?',
    alternativas: ['Farinha de trigo', 'Farinha de mandioca', 'Fubá', 'Amido de milho'],
    correta: 'Farinha de mandioca',
    explicacao: 'A farofa é feita com farinha de mandioca torrada na manteiga ou no óleo, com temperos.'
  },
  {
    id: 'ana-003',
    categoria: 'Salgados e petiscos',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual é o recheio tradicional da coxinha?',
    alternativas: ['Carne moída', 'Queijo', 'Frango desfiado', 'Presunto'],
    correta: 'Frango desfiado',
    explicacao: 'A coxinha clássica é recheada com frango desfiado e tem formato que lembra uma coxa.'
  },
  {
    id: 'ana-004',
    categoria: 'Doces',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual ingrediente dá a base cremosa do brigadeiro?',
    alternativas: ['Leite condensado', 'Creme de leite fresco', 'Leite em pó', 'Requeijão'],
    correta: 'Leite condensado',
    explicacao: 'O brigadeiro é feito com leite condensado, chocolate em pó e manteiga.'
  },
  {
    id: 'ana-005',
    categoria: 'Bebidas',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual bebida destilada é a base da caipirinha?',
    alternativas: ['Vodka', 'Rum', 'Cachaça', 'Tequila'],
    correta: 'Cachaça',
    explicacao: 'A caipirinha leva cachaça, limão, açúcar e gelo.'
  },
  {
    id: 'ana-006',
    categoria: 'Regiões',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'De qual estado é originário o pão de queijo?',
    alternativas: ['Bahia', 'Minas Gerais', 'Rio Grande do Sul', 'Pará'],
    correta: 'Minas Gerais',
    explicacao: 'O pão de queijo é um dos símbolos da culinária mineira.'
  },
  {
    id: 'ana-007',
    categoria: 'Regiões',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual é o principal ingrediente da massa do acarajé?',
    alternativas: ['Feijão-fradinho', 'Milho', 'Mandioca', 'Arroz'],
    correta: 'Feijão-fradinho',
    explicacao: 'O acarajé é um bolinho de feijão-fradinho frito no azeite de dendê, típico da Bahia.'
  },
  {
    id: 'ana-008',
    categoria: 'Bebidas',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual erva é usada no chimarrão?',
    alternativas: ['Erva-doce', 'Erva-cidreira', 'Erva-mate', 'Hortelã'],
    correta: 'Erva-mate',
    explicacao: 'O chimarrão é preparado com erva-mate e água quente, muito comum no Sul do Brasil.'
  },
  {
    id: 'ana-009',
    categoria: 'Salgados e petiscos',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual é o ingrediente principal da pamonha?',
    alternativas: ['Milho verde', 'Mandioca', 'Arroz', 'Batata-doce'],
    correta: 'Milho verde',
    explicacao: 'A pamonha é feita com milho verde ralado, cozida na palha do próprio milho.'
  },
  {
    id: 'ana-010',
    categoria: 'Regiões',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual sal é tradicionalmente usado no churrasco gaúcho?',
    alternativas: ['Sal refinado', 'Sal grosso', 'Sal light', 'Flor de sal'],
    correta: 'Sal grosso',
    explicacao: 'O sal grosso tempera a carne por fora sem desidratar demais durante o assado.'
  },
  {
    id: 'ana-011',
    categoria: 'Ingredientes',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'De qual raiz é extraído o tucupi, usado em pratos do Pará?',
    alternativas: ['Inhame', 'Batata-doce', 'Mandioca', 'Cará'],
    correta: 'Mandioca',
    explicacao: 'O tucupi é o caldo amarelo extraído da mandioca brava, base do pato no tucupi.'
  },
  {
    id: 'ana-012',
    categoria: 'Pratos típicos',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'Qual ingrediente é típico da moqueca baiana, mas não da capixaba?',
    alternativas: ['Azeite de dendê', 'Tomate', 'Coentro', 'Peixe'],
    correta: 'Azeite de dendê',
    explicacao: 'A moqueca baiana leva dendê e leite de coco. A capixaba usa urucum e azeite, e é feita na panela de barro.'
  },
  {
    id: 'ana-013',
    categoria: 'Técnicas de cozinha',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'O que significa cortar um alimento em tiras finas e compridas, no estilo julienne?',
    alternativas: ['Cortar em cubos grandes', 'Cortar em tiras finas', 'Ralar bem fino', 'Fatiar em rodelas grossas'],
    correta: 'Cortar em tiras finas',
    explicacao: 'Julienne é um corte em tiras finas e uniformes, usado em legumes para salteados, sopas e saladas.'
  },
  {
    id: 'ana-014',
    categoria: 'Técnicas de cozinha',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'No salteado, por que é melhor não encher demais a frigideira?',
    alternativas: ['Para evitar que os alimentos soltem vapor e cozinhem em vez de dourar', 'Para esfriar o óleo', 'Para impedir que os temperos se misturem', 'Para cozinhar tudo sem mexer'],
    correta: 'Para evitar que os alimentos soltem vapor e cozinhem em vez de dourar',
    explicacao: 'Com espaço e frigideira quente, a umidade evapora melhor e os alimentos douram em vez de ficarem abafados.'
  },
  {
    id: 'ana-015',
    categoria: 'Técnicas de cozinha',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual é a sequência clássica para branquear um vegetal e interromper seu cozimento?',
    alternativas: ['Assar e cobrir', 'Ferver brevemente e resfriar em água com gelo', 'Fritar e deixar tampado', 'Marinar e congelar'],
    correta: 'Ferver brevemente e resfriar em água com gelo',
    explicacao: 'O branqueamento cozinha o vegetal por pouco tempo; o banho de gelo interrompe o cozimento e ajuda a preservar a textura.'
  },
  {
    id: 'ana-016',
    categoria: 'Higiene e segurança',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Como reduzir o risco de contaminação cruzada ao preparar frango cru e salada?',
    alternativas: ['Usar a mesma tábua sem lavar', 'Separar utensílios e lavar as mãos e superfícies após tocar no frango cru', 'Enxaguar o frango na pia', 'Cortar a salada antes e depois passar o frango na mesma tábua'],
    correta: 'Separar utensílios e lavar as mãos e superfícies após tocar no frango cru',
    explicacao: 'Separe alimentos crus dos prontos para consumo, lave as mãos e higienize utensílios e superfícies entre tarefas. Não lave frango cru na pia.'
  },
  {
    id: 'ana-017',
    categoria: 'Higiene e segurança',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Onde é mais seguro guardar carne crua na geladeira?',
    alternativas: ['Na prateleira superior, sem embalagem', 'Na porta da geladeira', 'Em recipiente fechado, na prateleira inferior', 'Junto a frutas prontas para consumo'],
    correta: 'Em recipiente fechado, na prateleira inferior',
    explicacao: 'A prateleira inferior ajuda a evitar que líquidos da carne crua pingem sobre outros alimentos. Mantenha-a bem embalada e refrigerada.'
  },
  {
    id: 'ana-018',
    categoria: 'Ciência dos alimentos',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Que mudança ajuda a criar a crosta dourada e aromática de um alimento tostado?',
    alternativas: ['A reação de Maillard entre açúcares e proteínas', 'O congelamento da água', 'A fermentação do sal', 'A dissolução completa das fibras'],
    correta: 'A reação de Maillard entre açúcares e proteínas',
    explicacao: 'A reação de Maillard ocorre com calor e envolve açúcares e compostos de proteínas, formando cor e aromas de tostado.'
  },
  {
    id: 'ana-019',
    categoria: 'Ciência dos alimentos',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'O que é uma emulsão, como a que dá estrutura à maionese?',
    alternativas: ['Uma mistura estável de líquidos que normalmente não se combinam', 'Um tipo de fermento seco', 'Uma técnica de congelamento rápido', 'Uma mistura de farinha e água assada'],
    correta: 'Uma mistura estável de líquidos que normalmente não se combinam',
    explicacao: 'Na maionese, gotículas de óleo ficam dispersas em uma fase aquosa; a gema ajuda a estabilizar essa emulsão.'
  },
  {
    id: 'ana-020',
    categoria: 'Panificação',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual é a função principal do fermento biológico em uma massa de pão?',
    alternativas: ['Produzir gás que ajuda a massa a crescer', 'Tostar a superfície', 'Substituir toda a farinha', 'Impedir a formação de glúten'],
    correta: 'Produzir gás que ajuda a massa a crescer',
    explicacao: 'A levedura fermenta açúcares e libera dióxido de carbono, que fica retido na massa e contribui para seu crescimento.'
  },
  {
    id: 'ana-021',
    categoria: 'Panificação',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Por que sovar uma massa de pão feita com farinha de trigo?',
    alternativas: ['Para desenvolver a rede de glúten que dá elasticidade à massa', 'Para retirar todo o ar da farinha', 'Para dissolver o fermento', 'Para transformar o amido em açúcar imediatamente'],
    correta: 'Para desenvolver a rede de glúten que dá elasticidade à massa',
    explicacao: 'A sova ajuda proteínas da farinha a formar uma rede elástica capaz de reter parte do gás produzido na fermentação.'
  },
  {
    id: 'ana-022',
    categoria: 'Panificação',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual ingrediente costuma fornecer acidez para ativar o bicarbonato de sódio em uma receita?',
    alternativas: ['Suco de limão', 'Óleo vegetal', 'Sal refinado', 'Amido de milho'],
    correta: 'Suco de limão',
    explicacao: 'O bicarbonato precisa de um ingrediente ácido, como limão ou iogurte, para reagir e liberar gás que ajuda a massa a crescer.'
  },
  {
    id: 'ana-023',
    categoria: 'Nutrição e ingredientes',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual destes alimentos é uma leguminosa?',
    alternativas: ['Lentilha', 'Maçã', 'Alface', 'Mandioca'],
    correta: 'Lentilha',
    explicacao: 'Lentilha, feijão e grão-de-bico são leguminosas. Elas fornecem proteínas vegetais e fibras.'
  },
  {
    id: 'ana-024',
    categoria: 'Nutrição e ingredientes',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'De qual ingrediente é feito o tofu?',
    alternativas: ['Soja', 'Milho', 'Arroz', 'Amendoim'],
    correta: 'Soja',
    explicacao: 'O tofu é feito a partir da bebida de soja coagulada e prensada. Confira os rótulos em caso de alergia.'
  },
  {
    id: 'ana-025',
    categoria: 'Nutrição e ingredientes',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'Qual cuidado é essencial ao preparar comida para alguém com doença celíaca?',
    alternativas: ['Retirar o trigo só do prato pronto', 'Evitar glúten e prevenir contato cruzado com utensílios e superfícies', 'Usar farinha de trigo em pouca quantidade', 'Lavar a farinha antes de cozinhar'],
    correta: 'Evitar glúten e prevenir contato cruzado com utensílios e superfícies',
    explicacao: 'Na doença celíaca, é necessário evitar glúten e contato cruzado. Verifique ingredientes e siga as orientações da pessoa.'
  },
  {
    id: 'ana-026',
    categoria: 'Cozinhas do mundo',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual ingrediente costuma dar sabor umami ao missô japonês?',
    alternativas: ['Pasta fermentada de soja', 'Leite de coco', 'Farinha de mandioca', 'Creme de leite'],
    correta: 'Pasta fermentada de soja',
    explicacao: 'Missô é uma pasta fermentada, geralmente de soja, usada em sopas, molhos e marinadas no Japão.'
  },
  {
    id: 'ana-027',
    categoria: 'Cozinhas do mundo',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual arroz é tradicionalmente usado para preparar risoto cremoso?',
    alternativas: ['Arborio', 'Basmati', 'Jasmim', 'Agulhinha parboilizado'],
    correta: 'Arborio',
    explicacao: 'Arborio é um arroz de grão curto rico em amido; mexer e adicionar caldo aos poucos ajuda a criar a textura cremosa do risoto.'
  },
  {
    id: 'ana-028',
    categoria: 'Cozinhas do mundo',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'Qual erva aromática é muito associada ao pesto genovês, da Itália?',
    alternativas: ['Manjericão', 'Coentro', 'Hortelã', 'Erva-mate'],
    correta: 'Manjericão',
    explicacao: 'O pesto genovês tradicional tem manjericão, azeite, alho, pinoli e queijos como parmesão e pecorino.'
  },
  {
    id: 'ana-029',
    categoria: 'Confeitaria',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Por que receitas de bolo costumam pedir que o forno seja preaquecido?',
    alternativas: ['Para a massa começar a assar na temperatura indicada', 'Para deixar o fermento inativo antes de misturar', 'Para evitar que a forma precise ser untada', 'Para dispensar a medição dos ingredientes'],
    correta: 'Para a massa começar a assar na temperatura indicada',
    explicacao: 'O preaquecimento ajuda a receita a começar a assar na temperatura prevista, favorecendo crescimento e cozimento mais uniformes.'
  },
  {
    id: 'ana-030',
    categoria: 'Confeitaria',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'O que acontece principalmente quando o açúcar é aquecido até virar caramelo?',
    alternativas: ['O açúcar passa por caramelização e desenvolve cor e sabor', 'O açúcar fermenta como o pão', 'O açúcar vira sal', 'O açúcar se transforma em glúten'],
    correta: 'O açúcar passa por caramelização e desenvolve cor e sabor',
    explicacao: 'A caramelização é uma transformação do açúcar pelo calor, que cria cor e aromas característicos de caramelo.'
  }
];

validarPerguntas('PERGUNTAS_ANA', PERGUNTAS_ANA);

