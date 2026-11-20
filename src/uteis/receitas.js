// Funções de texto das receitas: deixam a tela mostrar nomes legíveis
// em vez de chaves técnicas e sem repetir a unidade das porções.

export const ROTULOS_CATEGORIA = {
  pratosPrincipais: 'Pratos principais',
  salgados: 'Salgados',
  doces: 'Doces',
  acompanhamentos: 'Acompanhamentos',
  massas: 'Massas'
};

export function rotuloCategoria(chave) {
  if (!chave) return '';
  return ROTULOS_CATEGORIA[chave] || String(chave);
}

// "8 porções" e "20 unidades" já trazem a unidade e ficam como estão.
// Um número solto vira "8 porções" (ou "1 porção").
export function textoPorcoes(porcoes) {
  if (porcoes === undefined || porcoes === null || porcoes === '') return '';
  const texto = String(porcoes).trim();
  if (!/^\d+$/.test(texto)) return texto;
  return Number(texto) === 1 ? '1 porção' : `${texto} porções`;
}

export function linhaRegiaoCategoria(receita = {}) {
  return [receita.regiao, rotuloCategoria(receita.categoria)].filter(Boolean).join(' · ');
}
