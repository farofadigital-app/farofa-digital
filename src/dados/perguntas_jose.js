import { validarPerguntas } from './quiz';

// dificuldade: 1 fácil, 2 médio, 3 difícil
// "correta" guarda o TEXTO da resposta (n a posiç), ent pode embaralhar à vontade.
export const PERGUNTAS_JOSE = [
  {
    id: 'jose-001',
    categoria: 'Regiões',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual regi é famosa pela Feijão completa?',
    alternativas: ['Nordeste', 'Sul', 'Sudeste', 'Centro-Oeste'],
    correta: 'Sudeste',
    explicacao: 'A Feijão completa é prato icônico do Sudeste, especialmente do Rio de Janeiro.'
  },
  {
    id: 'jose-002',
    categoria: 'Regiões',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Em qual regi o acarajé é um prato típico?',
    alternativas: ['Norte', 'Nordeste', 'Sul', 'Sudeste'],
    correta: 'Nordeste',
    explicacao: 'O acarajé é símbolo da culinária baiana, no Nordeste.'
  },
  {
    id: 'jose-003',
    categoria: 'Regiões',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual regi é famosa pelo churrasco e pelo chimarr?',
    alternativas: ['Norte', 'Nordeste', 'Centro-Oeste', 'Sul'],
    correta: 'Sul',
    explicacao: 'O churrasco e o chimarr fazem parte da tradiç gaúcha, no Sul do país.'
  },
  {
    id: 'jose-004',
    categoria: 'Ingredientes',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual carne salgada e seca ao ar é muito usada na cozinha nordestina?',
    alternativas: ['Carne de sol', 'Bacon', 'Presunto cru', 'Peito de peru'],
    correta: 'Carne de sol',
    explicacao: 'A carne de sol é salgada e curada à sombra, e é servida com mandioca, macaxeira ou bai de dois.'
  },
  {
    id: 'jose-005',
    categoria: 'Pratos típicos',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Em qual regi o arroz com pequi é um prato típico?',
    alternativas: ['Centro-Oeste', 'Sul', 'Nordeste', 'Sudeste'],
    correta: 'Centro-Oeste',
    explicacao: 'O pequi é fruto do Cerrado e muito usado na culinária de Goiás.'
  },
  {
    id: 'jose-006',
    categoria: 'Pratos típicos',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Em qual regi o tacacá é um prato tradicional?',
    alternativas: ['Sul', 'Norte', 'Sudeste', 'Nordeste'],
    correta: 'Norte',
    explicacao: 'O tacacá é um caldo quente de tucupi com jambu e camar, típico da Amazônia.'
  },
  {
    id: 'jose-007',
    categoria: 'Ingredientes',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual peixe gigante da Amazônia é muito usado na culinária do Norte?',
    alternativas: ['Tilápia', 'Pirarucu', 'Sardinha', 'Bacalhau'],
    correta: 'Pirarucu',
    explicacao: 'O pirarucu é um dos maiores peixes de água doce do mundo e está presente em muitos pratos amazônicos.'
  },
  {
    id: 'jose-008',
    categoria: 'Doces',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual doce amarelo feito com gema, açúcar e coco é tradicional da Bahia?',
    alternativas: ['Quindim', 'Brigadeiro', 'Cocada branca', 'Pudim'],
    correta: 'Quindim',
    explicacao: 'O quindim é feito com gemas, açúcar e coco ralado, e tem textura brilhante e cremosa.'
  },
  {
    id: 'jose-009',
    categoria: 'Pratos típicos',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual prato gaúcho é feito com arroz e charque?',
    alternativas: ['Arroz carreteiro', 'Risoto', 'Bai de dois', 'Arroz de forno'],
    correta: 'Arroz carreteiro',
    explicacao: 'O arroz carreteiro nasceu entre os tropeiros e leva arroz, charque e temperos.'
  },
  {
    id: 'jose-010',
    categoria: 'Pratos típicos',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'Em qual estado é famoso o pato no tucupi?',
    alternativas: ['Pará', 'Bahia', 'Goiás', 'Santa Catarina'],
    correta: 'Pará',
    explicacao: 'O pato no tucupi é o prato símbolo do Pará, servido em festas como o Círio de Nazaré.'
  },
  {
    id: 'jose-011',
    categoria: 'Pratos típicos',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'Qual prato de farinha de milho com sardinha e ovo é típico de S Paulo?',
    alternativas: ['Cuscuz paulista', 'Angu', 'Pir', 'Polenta'],
    correta: 'Cuscuz paulista',
    explicacao: 'O cuscuz paulista é feito com farinha de milho, sardinha, ovo cozido e legumes, e é moldado em forma.'
  },
  {
    id: 'jose-012',
    categoria: 'Pratos típicos',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'Qual prato do litoral do Paraná é cozido lentamente em panela de barro?',
    alternativas: ['Barreado', 'Vatapá', 'Tutu à mineira', 'Moqueca'],
    correta: 'Barreado',
    explicacao: 'O barreado é um ensopado de carne cozido por horas em panela de barro, tradicional em Morretes, no Paraná.'
  },
  {
    id: 'jose-013',
    categoria: 'Organizaç na cozinha',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'O que significa mise en place antes de começar uma receita?',
    alternativas: ['Separar e preparar ingredientes e utensílios', 'Servir a sobremesa primeiro', 'Lavar a louça apenas no final', 'Aquecer todos os alimentos juntos'],
    correta: 'Separar e preparar ingredientes e utensílios',
    explicacao: 'Mise en place é organizar ingredientes, medidas e utensílios antes de cozinhar; isso reduz esquecimentos e correria.'
  },
  {
    id: 'jose-014',
    categoria: 'Técnicas de cozinha',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'O que caracteriza a técnica de brasear?',
    alternativas: ['Dourar o alimento e terminar o cozimento lentamente com líquido', 'Cozinhar apenas em óleo abundante', 'Assar sem nenhuma fonte de calor', 'Misturar ingredientes crus e congelá-los'],
    correta: 'Dourar o alimento e terminar o cozimento lentamente com líquido',
    explicacao: 'Brasear combina uma etapa inicial de dourar com cozimento lento, parcialmente coberto por líquido, em panela tampada.'
  },
  {
    id: 'jose-015',
    categoria: 'Técnicas de cozinha',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual método cozinha o alimento usando o vapor de água quente?',
    alternativas: ['Cozimento a vapor', 'Grelhar', 'Empanar', 'Caramelizar'],
    correta: 'Cozimento a vapor',
    explicacao: 'No cozimento a vapor, o alimento fica acima da água e cozinha com o vapor quente, sem ficar submerso.'
  },
  {
    id: 'jose-016',
    categoria: 'Higiene e segurança',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Quando se deve lavar as ms durante o preparo de alimentos?',
    alternativas: ['Antes de cozinhar e depois de tocar em alimentos crus', 'Só depois de terminar de servir', 'Somente quando as ms parecem sujas', 'Apenas antes de lavar a louça'],
    correta: 'Antes de cozinhar e depois de tocar em alimentos crus',
    explicacao: 'Lave as ms antes de preparar alimentos e após tocar em carne, aves, ovos crus, lixo ou superfícies sujas.'
  },
  {
    id: 'jose-017',
    categoria: 'Higiene e segurança',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual é uma prática segura para guardar sobras de comida?',
    alternativas: ['Deixar a panela fora da geladeira durante a noite', 'Refrigerar as sobras em recipientes limpos e rasos sem deixá-las horas em temperatura ambiente', 'Misturar sobras novas às antigas sem identificar', 'Guardar comida quente na bancada até o dia seguinte'],
    correta: 'Refrigerar as sobras em recipientes limpos e rasos sem deixá-las horas em temperatura ambiente',
    explicacao: 'Divida grandes porções em recipientes rasos e refrigere as sobras prontamente; n deixe alimentos perecíveis horas fora da refrigeraç.'
  },
  {
    id: 'jose-018',
    categoria: 'Higiene e segurança',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual a diferença entre limpar e sanitizar uma superfície de cozinha?',
    alternativas: ['Limpar remove sujeira; sanitizar reduz microrganismos com método apropriado', 'S exatamente a mesma coisa', 'Sanitizar é apenas secar com pano', 'Limpar só é necessário após cozinhar'],
    correta: 'Limpar remove sujeira; sanitizar reduz microrganismos com método apropriado',
    explicacao: 'Remova resíduos primeiro; depois, quando necessário, use um produto ou método sanitizante próprio para superfícies de contato com alimentos.'
  },
  {
    id: 'jose-019',
    categoria: 'Ciência dos alimentos',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'O que o calor faz com as proteínas do ovo ao cozinhá-lo?',
    alternativas: ['Desnatura e reorganiza as proteínas, firmando o ovo', 'Transforma proteínas em água fria', 'Cria glúten', 'Remove todo o sabor do ovo'],
    correta: 'Desnatura e reorganiza as proteínas, firmando o ovo',
    explicacao: 'O calor altera a estrutura das proteínas do ovo; elas se reorganizam e formam uma rede mais firme.'
  },
  {
    id: 'jose-020',
    categoria: 'Ciência dos alimentos',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Por que algumas pessoas pingam lim sobre uma maçã cortada?',
    alternativas: ['A acidez ajuda a retardar o escurecimento da superfície', 'O lim congela a maçã', 'O lim transforma a maçã em conserva instantaneamente', 'A acidez remove as fibras'],
    correta: 'A acidez ajuda a retardar o escurecimento da superfície',
    explicacao: 'O suco ácido reduz a velocidade do escurecimento enzimático da maçã cortada, embora n o impeça para sempre.'
  },
  {
    id: 'jose-021',
    categoria: 'Panificaç',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual gás produzido pelo fermento biológico forma bolhas na massa do p?',
    alternativas: ['Dióxido de carbono', 'Oxigênio líquido', 'Hélio', 'Vapor de sal'],
    correta: 'Dióxido de carbono',
    explicacao: 'Durante a fermentaç, a levedura libera dióxido de carbono, que fica retido na massa e ajuda o p a crescer.'
  },
  {
    id: 'jose-022',
    categoria: 'Panificaç',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'O que pode acontecer se uma massa de p fermentada crescer demais?',
    alternativas: ['A estrutura pode enfraquecer e a massa perder parte do volume', 'A massa vira massa folhada', 'O fermento se transforma em açúcar', 'A farinha deixa de conter amido'],
    correta: 'A estrutura pode enfraquecer e a massa perder parte do volume',
    explicacao: 'Na fermentaç excessiva, a estrutura pode n sustentar as bolhas de gás; a massa pode murchar e assar com menos volume.'
  },
  {
    id: 'jose-023',
    categoria: 'Nutriç e ingredientes',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Qual ingrediente é uma fonte comum de sódio em muitos pratos?',
    alternativas: ['Sal de cozinha', 'Açúcar refinado', 'Canela', 'Amido de milho'],
    correta: 'Sal de cozinha',
    explicacao: 'O sal de cozinha contém sódio. Temperar aos poucos e provar ajuda a controlar a quantidade usada.'
  },
  {
    id: 'jose-024',
    categoria: 'Nutriç e ingredientes',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual é um motivo útil para incluir diferentes legumes e verduras nas refeições?',
    alternativas: ['Eles oferecem variedade de fibras e micronutrientes', 'Todos têm exatamente os mesmos nutrientes', 'Eles substituem a água do corpo', 'Eles eliminam a necessidade de outros grupos alimentares'],
    correta: 'Eles oferecem variedade de fibras e micronutrientes',
    explicacao: 'Variar legumes e verduras é uma forma prática de obter diferentes fibras, vitaminas e minerais ao longo da alimentaç.'
  },
  {
    id: 'jose-025',
    categoria: 'Cozinhas do mundo',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'De qual país é originária a paella, associada à regi de Valência?',
    alternativas: ['Espanha', 'Jap', 'Brasil', 'Índia'],
    correta: 'Espanha',
    explicacao: 'A paella é um prato espanhol associado a Valência, preparado com arroz e diferentes combinações de ingredientes.'
  },
  {
    id: 'jose-026',
    categoria: 'Cozinhas do mundo',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual ingrediente dá a base cremosa tradicional do hummus?',
    alternativas: ['Gr-de-bico', 'Arroz integral', 'Batata', 'Milho'],
    correta: 'Gr-de-bico',
    explicacao: 'Hummus é uma pasta do Oriente Médio feita principalmente de gr-de-bico, tahine, lim e outros temperos.'
  },
  {
    id: 'jose-027',
    categoria: 'Cozinhas do mundo',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual destes ingredientes é característico do curry verde tailandês?',
    alternativas: ['Pasta de curry com ervas e pimentas', 'Farinha de mandioca torrada', 'Queijo parmes', 'Chucrute'],
    correta: 'Pasta de curry com ervas e pimentas',
    explicacao: 'O curry verde tailandês costuma usar uma pasta aromática com pimentas verdes, ervas e especiarias; receitas variam por regi e família.'
  },
  {
    id: 'jose-028',
    categoria: 'Confeitaria',
    dificuldade: 2,
    exp: 20,
    brasas: 2,
    pergunta: 'Qual ingrediente ajuda a dar estrutura e emuls a muitos bolos e cremes?',
    alternativas: ['Ovo', 'Água com gás apenas', 'Sal grosso', 'Folha de louro'],
    correta: 'Ovo',
    explicacao: 'O ovo pode contribuir com estrutura, umidade e emulsificaç; sua funç depende da receita e do método.'
  },
  {
    id: 'jose-029',
    categoria: 'Confeitaria',
    dificuldade: 1,
    exp: 10,
    brasas: 1,
    pergunta: 'Por que é útil medir ingredientes antes de preparar um bolo?',
    alternativas: ['Para manter as proporções da receita', 'Para evitar que o forno precise aquecer', 'Para substituir a mistura dos ingredientes', 'Para dispensar o tempo de cozimento'],
    correta: 'Para manter as proporções da receita',
    explicacao: 'A confeitaria depende bastante de proporções; medir os ingredientes ajuda a repetir o resultado e diagnosticar problemas.'
  },
  {
    id: 'jose-030',
    categoria: 'Organizaç na cozinha',
    dificuldade: 3,
    exp: 30,
    brasas: 3,
    pergunta: 'Qual é uma boa prática ao adaptar uma receita para uma alergia alimentar?',
    alternativas: ['Confirmar ingredientes e evitar contato cruzado com utensílios e superfícies', 'Retirar o ingrediente alergênico só depois de cozinhar', 'Usar uma quantidade pequena para testar', 'Confiar apenas na aparência do alimento'],
    correta: 'Confirmar ingredientes e evitar contato cruzado com utensílios e superfícies',
    explicacao: 'Para alergias, confirme ingredientes e rótulos, evite contato cruzado e siga as orientações da pessoa. N improvise uma exposiç.'
  }
];

validarPerguntas('PERGUNTAS_JOSE', PERGUNTAS_JOSE);


