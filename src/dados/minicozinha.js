const QTD_INTRUSOS = 3;
const FORNO_MIN = 100;
const FORNO_MAX = 260;
const RECOMPENSAS = {
  3: { brasas: 15, exp: 40 },
  2: { brasas: 12, exp: 30 },
  1: { brasas: 10, exp: 25 }
};

function embaralhar(lista) {
  const resultado = [...lista];
  for (let indice = resultado.length - 1; indice > 0; indice--) {
    const outroIndice = Math.floor(Math.random() * (indice + 1));
    [resultado[indice], resultado[outroIndice]] = [resultado[outroIndice], resultado[indice]];
  }
  return resultado;
}

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

export function criarBancada(receita, receitas) {
  const certos = criarDesafioIngredientes(receita).map(item => ({
    ...item,
    certo: true
  }));
  const nomes = new Set((receita.ingredientes || []).map(nome => nome.toLowerCase()));
  const nomesIntrusos = new Set();
  const intrusos = embaralhar(receitas
    .filter(item => item.id !== receita.id)
    .flatMap(item => item.ingredientes || [])
    .filter(nome => {
      const normalizado = nome.toLowerCase();
      if (nomes.has(normalizado) || nomesIntrusos.has(normalizado)) return false;
      nomesIntrusos.add(normalizado);
      return true;
    }))
    .slice(0, QTD_INTRUSOS)
    .map((nome, indice) => ({
    id: `intruso-${receita.id}-${indice}`,
    nome,
    certo: false
  }));

  return embaralhar([...certos, ...intrusos]);
}

export function zonaDoPonto(calor, ajuda = 0) {
  let inicio;
  let fim;
  let rotulos;

  if (calor.equipamento === 'forno') {
    const faixa = FORNO_MAX - FORNO_MIN;
    inicio = (calor.minimo - FORNO_MIN) / faixa;
    fim = (calor.maximo - FORNO_MIN) / faixa;
    rotulos = [`${FORNO_MIN}°`, `${FORNO_MAX}°`];
  } else {
    const terco = {
      baixo: [0, 1 / 3],
      medio: [1 / 3, 2 / 3],
      alto: [2 / 3, 1]
    }[calor.alvo] || [1 / 3, 2 / 3];
    [inicio, fim] = terco;
    rotulos = ['Baixo', 'Médio', 'Alto'];
  }

  return {
    inicio: Math.min(1, Math.max(0, inicio - ajuda)),
    fim: Math.min(1, Math.max(0, fim + ajuda)),
    rotulos
  };
}

export function calcularRecompensaMinicozinha(precisao) {
  const estrelas = precisao >= 90 ? 3 : precisao >= 70 ? 2 : 1;
  return { estrelas, ...RECOMPENSAS[estrelas] };
}
