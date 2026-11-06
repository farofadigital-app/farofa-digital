// Funções genéricas do quiz: funcionam com qualquer lista de perguntas (Ana, José, etc.)

// Embaralha sem alterar o array original (Fisher-Yates)
export function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Sorteia 'quantidade' perguntas de uma lista, com as alternativas embaralhadas.
// Ex.: sortearPerguntas(PERGUNTAS_JOSE, 5, { dificuldade: 1 })
export function sortearPerguntas(lista, quantidade = 5, { dificuldade, categoria } = {}) {
  let base = lista;
  if (dificuldade) base = base.filter(p => p.dificuldade === dificuldade);
  if (categoria) base = base.filter(p => p.categoria === categoria);

  return embaralhar(base)
    .slice(0, quantidade)
    .map(p => ({ ...p, alternativas: embaralhar(p.alternativas) }));
}

export function multiplicadorCombo(combo) {
  return combo <= 1 ? 1 : Math.min(1 + (combo - 1) * 0.5, 2);
}

export function calcularRecompensaAcerto(pergunta, combo) {
  const multiplicador = multiplicadorCombo(combo);
  return {
    multiplicador,
    exp: Math.round(pergunta.exp * multiplicador),
    brasas: Math.max(pergunta.brasas, Math.round(pergunta.brasas * multiplicador))
  };
}

// Confere se a alternativa escolhida está certa
export function acertou(pergunta, alternativaEscolhida) {
  return alternativaEscolhida === pergunta.correta;
}

// Validaç só em desenvolvimento: avisa no console se alguma pergunta estiver errada
export function validarPerguntas(nome, lista) {
  if (typeof __DEV__ === 'undefined' || !__DEV__) return;
  const ids = new Set();
  lista.forEach(p => {
    if (ids.has(p.id)) console.warn(`[${nome}] id repetido: ${p.id}`);
    ids.add(p.id);
    if (p.alternativas.length !== 4)
      console.warn(`[${nome}] ${p.id} deveria ter 4 alternativas`);
    if (!p.alternativas.includes(p.correta))
      console.warn(`[${nome}] ${p.id}: "correta" n está nas alternativas`);
  });
}
