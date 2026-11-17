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
  if (!receita || typeof receita.modoPreparo !== 'string') return [];
  const normalizado = receita.modoPreparo.replace(/\\n/g, '\n');
  const linhas = normalizado
    .split(/\r?\n/)
    .map(linha => linha.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(linha => linha.length > 2);

  if (linhas.length > 1) return linhas;

  const frases = normalizado.match(/[^.!?]+[.!?]?/g) || [];
  return frases
    .map(frase => frase.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(frase => frase.length > 2);
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

// Palavras de medida e de preparo: nao ajudam a identificar o ingrediente
const PALAVRAS_DE_MEDIDA = new Set('colher colheres sopa sopas cha xicara xicaras copo copos medida lata pitada dente dentes gosto picado picada picados picadas fatiado fatiada fatiados ralado ralada fresco fresca fresquinho grande grandes media medio pequeno pequena maduro maduros madura cortado cortada cortados temperado aproximadamente pacote porcao gramas grama litro litros mililitros para com sem bem uns umas pedacos pedaco rodelas rodela cubos cubo inteiro inteiros inteira cozido cozida cozidos meia lua opcional dos das uma por que ate sob mas'.split(' '));

// Nome-base do ingrediente: tira numeros, medidas, acentos e o que vem entre parenteses
export function nucleoIngrediente(nome) {
  return String(nome)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\(.*?\)/g, ' ')
    .split(/[^a-z]+/)
    .filter(palavra => palavra.length > 2 && !PALAVRAS_DE_MEDIDA.has(palavra))
    .map(palavra => (palavra.length > 3 && palavra.endsWith('s') ? palavra.slice(0, -1) : palavra))
    .filter(palavra => palavra.length > 2 && !PALAVRAS_DE_MEDIDA.has(palavra));
}

// True quando o intruso e o mesmo ingrediente de um item certo, so com outra medida ou preparo
// (ex.: "500 ml de leite integral" x "2 xícaras de leite integral")
export function mesmoIngrediente(intruso, certo) {
  const a = new Set(nucleoIngrediente(intruso));
  const b = new Set(nucleoIngrediente(certo));
  if (a.size === 0 || b.size === 0) return false;
  const contido = (menor, maior) => [...menor].every(palavra => maior.has(palavra));
  // igual ou mais simples que o item certo, ou o item certo com ate 2 palavras a mais
  // (ex.: "azeite de dende para fritar")
  return contido(a, b) || (contido(b, a) && a.size - b.size <= 2);
}

export function criarBancada(receita, receitas) {
  const certos = criarDesafioIngredientes(receita).map(item => ({
    ...item,
    certo: true
  }));
  const nomes = new Set((receita.ingredientes || []).map(nome => nome.toLocaleLowerCase()));
  const nomesIntrusos = new Set();
  // Prioriza itens de receitas da mesma categoria para evitar intrusos sem sentido
  // (por exemplo, caldo de peixe em uma sobremesa). Só amplia a busca se faltar opção.
  const outrasReceitas = receitas.filter(item => item.id !== receita.id);
  const candidatas = outrasReceitas.filter(item => item.categoria === receita.categoria);
  const fontesIntrusos = candidatas.length > 0 ? candidatas : outrasReceitas;
  const nomesDisponiveis = fontesIntrusos
    .flatMap(item => item.ingredientes || [])
    .filter(nome => !nomes.has(nome.toLocaleLowerCase()));
  const fontesFallback = outrasReceitas
    .flatMap(item => item.ingredientes || [])
    .filter(nome => !nomes.has(nome.toLocaleLowerCase()));
  const opcoesIntrusos = new Set(nomesDisponiveis.map(nome => nome.toLocaleLowerCase()));
  const candidatosIntrusos = [...nomesDisponiveis, ...fontesFallback.filter(nome => !opcoesIntrusos.has(nome.toLocaleLowerCase()))];
  const ehConfuso = nome => (receita.ingredientes || []).some(certo => mesmoIngrediente(nome, certo));
  // Opcoes que repetem o ingrediente de um item certo so entram se faltar opcao melhor
  const priorizar = lista => [...embaralhar(lista.filter(nome => !ehConfuso(nome))), ...embaralhar(lista.filter(ehConfuso))];
  const intrusos = priorizar(candidatosIntrusos
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
