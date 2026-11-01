export function extrairEtapas(receita) {
  const frases = receita.modoPreparo.match(/[^.!?]+[.!?]?/g) || [];
  return frases.map(frase => frase.trim()).filter(Boolean);
}

export function exigeAquecimento(instrucao) {
  return /fogo|forno|aqueça|aquec|ferv|cozinh|\basse\b|\bassar\b|refog|dour|frit|tost|derret|grelh|desgrud|mexa.{0,30}por.{0,10}minut/i.test(instrucao);
}

export function configurarCalor(instrucao) {
  const temperaturaForno = instrucao.match(/(\d{2,3})\s*°\s*C/i);
  if (temperaturaForno || /forno|\basse\b|\bassar\b/i.test(instrucao)) {
    const alvo = temperaturaForno ? Number(temperaturaForno[1]) : 180;
    return { equipamento: 'forno', alvo, minimo: alvo - 10, maximo: alvo + 10 };
  }

  let alvo = 'medio';
  if (/fogo baixo|fogo brando/i.test(instrucao)) {
    alvo = 'baixo';
  } else if (/água fervente|água quente|fervente|ferver|ferva|fogo alto|doure|dourar|frite|fritar/i.test(instrucao)) {
    alvo = 'alto';
  }
  return { equipamento: 'fogao', alvo };
}

export function acaoManual(instrucao) {
  if (/sove|sovar|sovando|amasse|amassar|amassando/i.test(instrucao)) {
    return { nome: 'Trabalhar a massa', verbo: 'Sovar', emoji: '👐' };
  }
  if (/bata|bater|batendo/i.test(instrucao)) {
    return { nome: 'Bater os ingredientes', verbo: 'Bater', emoji: '🥣' };
  }
  if (/corte|cortar|cortando|fatie|fatiar|fatiando|desfie|desfiar|desfiando|pique|picar/i.test(instrucao)) {
    return { nome: 'Preparar os ingredientes', verbo: 'Cortar', emoji: '🔪' };
  }
  if (/enrole|enrolar|enrolando|modele|modelar|bolinhas/i.test(instrucao)) {
    return { nome: 'Modelar', verbo: 'Modelar', emoji: '🤲' };
  }
  if (/\bvire\b|\bvirar\b/i.test(instrucao)) {
    return { nome: 'Virar o preparo', verbo: 'Virar', emoji: '↩️' };
  }
  if (/mex|mistur|revire/i.test(instrucao)) {
    return { nome: 'Mexer ou misturar', verbo: 'Mexer', emoji: '🥄' };
  }
  return null;
}

export function criarDesafioIngredientes(receita) {
  return receita.ingredientes.map((nome, indice) => ({
    id: `necessario-${receita.id}-${indice}`,
    nome
  }));
}
