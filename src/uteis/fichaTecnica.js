export function calcularCustoPrato(insumos = []) {
  if (!Array.isArray(insumos) || insumos.length === 0) return 0;
  const total = insumos.reduce((acc, item) => {
    const qtd = Number(item.quantidade ?? item.qtd ?? 1);
    const custo = Number(item.custoUnitario ?? item.custoUnit ?? 0);
    return acc + (qtd * custo);
  }, 0);
  return Math.round(total * 10) / 10;
}

export function calcularLucro(precoVenda = 0, custoPrato = 0) {
  const v = Number(precoVenda) || 0;
  const c = Number(custoPrato) || 0;
  return Math.round((v - c) * 10) / 10;
}

export function calcularMargem(lucro = 0, precoVenda = 0) {
  const v = Number(precoVenda) || 0;
  if (v <= 0) return 0;
  const l = Number(lucro) || 0;
  const margem = (l / v) * 100;
  return Math.round(margem * 10) / 10;
}

export function classificarMargem(margemPercentual = 0, lucro = 0) {
  if (lucro < 0) {
    return {
      status: 'prejuizo',
      rotulo: 'Prejuízo',
      cor: '#EF4444',
      dica: 'O preço de venda não cobre os insumos! Aumente o valor ou reduza o desperdício.'
    };
  }
  if (margemPercentual >= 50) {
    return {
      status: 'alta',
      rotulo: 'Alta Rentabilidade',
      cor: '#10B981',
      dica: 'Excelente margem! Prato com alta lucratividade para financiar o seu restaurante.'
    };
  }
  if (margemPercentual >= 25) {
    return {
      status: 'equilibrada',
      rotulo: 'Margem Equilibrada',
      cor: '#F5A623',
      dica: 'Padrão profissional da gastronomia. CMV saudável entre 30% e 40%.'
    };
  }
  return {
    status: 'apertada',
    rotulo: 'Margem Apertada',
    cor: '#EAB308',
    dica: 'Margem baixa. Pequenas variações no preço do insumo podem zerar seu lucro.'
  };
}

export const FICHAS_TECNICAS_PADRAO = {
  'brigadeiro-tradicional': {
    precoVendaSugerido: 45,
    porcoes: 20,
    insumos: [
      { nome: 'Leite condensado (395g)', quantidade: 1, unidade: 'lata', custoUnitario: 8 },
      { nome: 'Cacau em pó 50%', quantidade: 3, unidade: 'colheres', custoUnitario: 1.5 },
      { nome: 'Manteiga sem sal', quantidade: 1, unidade: 'colher', custoUnitario: 2 },
      { nome: 'Granulado de chocolate', quantidade: 1, unidade: 'pacote', custoUnitario: 4 },
      { nome: 'Sal refinado', quantidade: 1, unidade: 'pitada', custoUnitario: 0.5 }
    ]
  },
  'quindim': {
    precoVendaSugerido: 60,
    porcoes: 12,
    insumos: [
      { nome: 'Gemas de ovos caipiras', quantidade: 10, unidade: 'unidades', custoUnitario: 1.5 },
      { nome: 'Açúcar refinado', quantidade: 2, unidade: 'xícaras (200g)', custoUnitario: 1 },
      { nome: 'Coco ralado fresco', quantidade: 1, unidade: 'pacote (100g)', custoUnitario: 4 },
      { nome: 'Manteiga em ponto pomada', quantidade: 1, unidade: 'colher', custoUnitario: 2 },
      { nome: 'Manteiga e açúcar para untar', quantidade: 1, unidade: 'porção', custoUnitario: 1 }
    ]
  },
  'pudim-de-leite': {
    precoVendaSugerido: 50,
    porcoes: 10,
    insumos: [
      { nome: 'Leite condensado (395g)', quantidade: 1, unidade: 'lata', custoUnitario: 8 },
      { nome: 'Leite integral fresco', quantidade: 1, unidade: 'medida da lata', custoUnitario: 3.5 },
      { nome: 'Ovos inteiros', quantidade: 3, unidade: 'unidades', custoUnitario: 1.5 },
      { nome: 'Açúcar refinado para calda', quantidade: 1, unidade: 'xícara', custoUnitario: 2 }
    ]
  },
  'feijoada-completa': {
    precoVendaSugerido: 160,
    porcoes: 8,
    insumos: [
      { nome: 'Feijão preto selecionado', quantidade: 1, unidade: 'kg', custoUnitario: 7 },
      { nome: 'Carne-seca dessalgada', quantidade: 2, unidade: 'porções (400g)', custoUnitario: 7 },
      { nome: 'Lombo e costelinha de porco', quantidade: 2, unidade: 'porções (600g)', custoUnitario: 11 },
      { nome: 'Linguiça paio e calabresa', quantidade: 2, unidade: 'gomos (400g)', custoUnitario: 5 },
      { nome: 'Bacon defumado em cubos', quantidade: 1, unidade: 'porção (200g)', custoUnitario: 6 },
      { nome: 'Alho, cebola, louro e laranjas', quantidade: 1, unidade: 'kit temperos', custoUnitario: 5 }
    ]
  },
  'moqueca-baiana': {
    precoVendaSugerido: 110,
    porcoes: 4,
    insumos: [
      { nome: 'Postas de peixe firme', quantidade: 1, unidade: 'kg', custoUnitario: 28 },
      { nome: 'Leite de coco artesanal', quantidade: 1, unidade: 'vidro (200ml)', custoUnitario: 5 },
      { nome: 'Azeite de dendê puro', quantidade: 3, unidade: 'colheres', custoUnitario: 1.3 },
      { nome: 'Tomates, pimentões e cebola', quantidade: 1, unidade: 'kit legumes', custoUnitario: 4 },
      { nome: 'Coentro fresco e limão', quantidade: 1, unidade: 'porção', custoUnitario: 3 }
    ]
  },
  'vatapa': {
    precoVendaSugerido: 85,
    porcoes: 6,
    insumos: [
      { nome: 'Camarão seco defumado', quantidade: 1, unidade: 'porção (250g)', custoUnitario: 16 },
      { nome: 'Pão francês amanhecido', quantidade: 4, unidade: 'unidades', custoUnitario: 0.75 },
      { nome: 'Castanha de caju e amendoim', quantidade: 1, unidade: 'porção (150g)', custoUnitario: 8 },
      { nome: 'Leite de coco e azeite de dendê', quantidade: 1, unidade: 'kit base', custoUnitario: 6 },
      { nome: 'Gengibre, cebola e pimenta', quantidade: 1, unidade: 'temperos', custoUnitario: 3 }
    ]
  },
  'bobo-de-camarao': {
    precoVendaSugerido: 120,
    porcoes: 6,
    insumos: [
      { nome: 'Camarão limpo fresco', quantidade: 1, unidade: 'kg', custoUnitario: 30 },
      { nome: 'Mandioca descascada macia', quantidade: 1, unidade: 'kg', custoUnitario: 6 },
      { nome: 'Leite de coco e azeite de dendê', quantidade: 1, unidade: 'kit base', custoUnitario: 6 },
      { nome: 'Tomate, cebola e coentro', quantidade: 1, unidade: 'kit temperos', custoUnitario: 4 }
    ]
  },
  'barreado': {
    precoVendaSugerido: 95,
    porcoes: 6,
    insumos: [
      { nome: 'Carne bovina (músculo/paleta)', quantidade: 1.5, unidade: 'kg', custoUnitario: 17.3 },
      { nome: 'Bacon e toucinho em cubos', quantidade: 1, unidade: 'porção (150g)', custoUnitario: 5 },
      { nome: 'Cebola, alho, louro e cominho', quantidade: 1, unidade: 'temperos', custoUnitario: 3 },
      { nome: 'Farinha de mandioca e banana', quantidade: 1, unidade: 'acompanhamentos', custoUnitario: 4 }
    ]
  },
  'coxinha-de-frango': {
    precoVendaSugerido: 65,
    porcoes: 20,
    insumos: [
      { nome: 'Peito de frango desfiado', quantidade: 1, unidade: 'porção (500g)', custoUnitario: 9 },
      { nome: 'Catupiry cremoso', quantidade: 1, unidade: 'porção (200g)', custoUnitario: 6 },
      { nome: 'Farinha de trigo e caldo de frango', quantidade: 1, unidade: 'base da massa', custoUnitario: 3 },
      { nome: 'Manteiga e leite', quantidade: 1, unidade: 'porção', custoUnitario: 3 },
      { nome: 'Farinha de rosca e óleo para fritura', quantidade: 1, unidade: 'kit empanar', custoUnitario: 4 }
    ]
  },
  'pastel-de-feira': {
    precoVendaSugerido: 60,
    porcoes: 10,
    insumos: [
      { nome: 'Massa fresca de pastel com cachaça', quantidade: 1, unidade: 'rolo (500g)', custoUnitario: 5 },
      { nome: 'Carne moída refogada com azeitonas', quantidade: 1, unidade: 'recheio (400g)', custoUnitario: 10 },
      { nome: 'Queijo mussarela ralado', quantidade: 1, unidade: 'porção (250g)', custoUnitario: 6 },
      { nome: 'Óleo vegetal para imersão', quantidade: 1, unidade: 'porção (500ml)', custoUnitario: 4 }
    ]
  },
  'pao-de-queijo': {
    precoVendaSugerido: 60,
    porcoes: 30,
    insumos: [
      { nome: 'Polvilho doce e azedo', quantidade: 1, unidade: 'porção (500g)', custoUnitario: 5 },
      { nome: 'Queijo meia-cura artesanal', quantidade: 1, unidade: 'porção (300g)', custoUnitario: 12 },
      { nome: 'Ovos caipiras frescos', quantidade: 3, unidade: 'unidades', custoUnitario: 1.5 },
      { nome: 'Leite integral, óleo e sal', quantidade: 1, unidade: 'líquidos', custoUnitario: 3.5 }
    ]
  },
  'acaraje': {
    precoVendaSugerido: 90,
    porcoes: 10,
    insumos: [
      { nome: 'Feijão-fradinho quebrado', quantidade: 1, unidade: 'kg', custoUnitario: 8 },
      { nome: 'Cebola e sal para bater a massa', quantidade: 1, unidade: 'kit', custoUnitario: 2 },
      { nome: 'Azeite de dendê para fritura', quantidade: 1, unidade: 'garrafa (500ml)', custoUnitario: 10 },
      { nome: 'Vatapá, caruru e camarão seco', quantidade: 1, unidade: 'kit recheios', custoUnitario: 18 }
    ]
  },
  'farofa-especial-de-bacon': {
    precoVendaSugerido: 40,
    porcoes: 6,
    insumos: [
      { nome: 'Farinha de mandioca biju torrada', quantidade: 1, unidade: 'pacote (400g)', custoUnitario: 4 },
      { nome: 'Bacon em cubos crocante', quantidade: 1, unidade: 'porção (200g)', custoUnitario: 6 },
      { nome: 'Manteiga aromatizada', quantidade: 2, unidade: 'colheres', custoUnitario: 1.5 },
      { nome: 'Cebola fatiada fininha e alho', quantidade: 1, unidade: 'refogado', custoUnitario: 2 },
      { nome: 'Cheiro-verde e temperos', quantidade: 1, unidade: 'ervas', custoUnitario: 1 }
    ]
  },
  'torta-de-liquidificador': {
    precoVendaSugerido: 65,
    porcoes: 8,
    insumos: [
      { nome: 'Ovos, óleo e leite da massa', quantidade: 1, unidade: 'líquidos da massa', custoUnitario: 6 },
      { nome: 'Farinha de trigo e fermento em pó', quantidade: 1, unidade: 'secos da massa', custoUnitario: 3 },
      { nome: 'Frango desfiado com palmito e milho', quantidade: 1, unidade: 'recheio farto', custoUnitario: 14 },
      { nome: 'Queijo parmesão para dourar', quantidade: 1, unidade: 'cobertura', custoUnitario: 3 }
    ]
  }
};

export function obterFichaTecnica(receita = {}, precoVendaCustom = null) {
  const padrao = FICHAS_TECNICAS_PADRAO[receita.id];
  let insumos = [];
  let precoSugerido = 50;
  let porcoes = 4;

  if (padrao) {
    insumos = padrao.insumos.map(item => ({
      ...item,
      subtotal: Math.round(item.quantidade * item.custoUnitario * 10) / 10
    }));
    precoSugerido = padrao.precoVendaSugerido;
    porcoes = padrao.porcoes;
  } else {
    const lista = Array.isArray(receita.ingredientes) ? receita.ingredientes : [];
    insumos = lista.map((ing, idx) => ({
      nome: ing,
      quantidade: 1,
      unidade: 'un/medida',
      custoUnitario: 3 + (idx % 4),
      subtotal: 3 + (idx % 4)
    }));
    porcoes = parseInt(receita.porcoes, 10) || 4;
    const custoEstimado = calcularCustoPrato(insumos);
    precoSugerido = Math.round(custoEstimado * 2.5);
  }

  const custoTotal = calcularCustoPrato(insumos);
  const precoVenda = typeof precoVendaCustom === 'number' && !isNaN(precoVendaCustom)
    ? Math.max(0, Math.round(precoVendaCustom * 10) / 10)
    : precoSugerido;

  const lucro = calcularLucro(precoVenda, custoTotal);
  const margem = calcularMargem(lucro, precoVenda);
  const custoPorPorcao = porcoes > 0 ? Math.round((custoTotal / porcoes) * 10) / 10 : custoTotal;
  const lucroPorPorcao = porcoes > 0 ? Math.round((lucro / porcoes) * 10) / 10 : lucro;
  const classificacao = classificarMargem(margem, lucro);

  return {
    receitaId: receita.id,
    receitaNome: receita.nome,
    porcoes,
    insumos,
    custoTotal,
    custoPorPorcao,
    precoVenda,
    precoVendaSugerido: precoSugerido,
    lucro,
    lucroPorPorcao,
    margem,
    classificacao
  };
}