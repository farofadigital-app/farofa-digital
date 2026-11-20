import {
  ROTULOS_CATEGORIA,
  rotuloCategoria,
  textoPorcoes,
  linhaRegiaoCategoria
} from './receitas';
import todasReceitas from '../dados/receitas';

describe('Texto das receitas', () => {
  test('rotuloCategoria troca a chave técnica por um nome legível', () => {
    expect(rotuloCategoria('pratosPrincipais')).toBe('Pratos principais');
    expect(rotuloCategoria('doces')).toBe('Doces');
    expect(rotuloCategoria('outraCoisa')).toBe('outraCoisa');
    expect(rotuloCategoria(undefined)).toBe('');
  });

  test('textoPorcoes não repete a unidade', () => {
    expect(textoPorcoes('8 porções')).toBe('8 porções');
    expect(textoPorcoes('20 unidades')).toBe('20 unidades');
    expect(textoPorcoes(6)).toBe('6 porções');
    expect(textoPorcoes('1')).toBe('1 porção');
    expect(textoPorcoes('')).toBe('');
    expect(textoPorcoes(undefined)).toBe('');
  });

  test('linhaRegiaoCategoria junta região e categoria sem sobras', () => {
    expect(linhaRegiaoCategoria({ regiao: 'Nordeste', categoria: 'pratosPrincipais' }))
      .toBe('Nordeste · Pratos principais');
    expect(linhaRegiaoCategoria({ categoria: 'doces' })).toBe('Doces');
    expect(linhaRegiaoCategoria()).toBe('');
  });

  test('toda receita tem região, categoria conhecida e porções com unidade', () => {
    expect(todasReceitas.length).toBeGreaterThan(0);
    todasReceitas.forEach(receita => {
      expect(typeof receita.regiao).toBe('string');
      expect(receita.regiao.length).toBeGreaterThan(0);
      expect(ROTULOS_CATEGORIA[receita.categoria]).toBeTruthy();
      expect(textoPorcoes(receita.porcoes)).not.toMatch(/porções porções/);
      expect(linhaRegiaoCategoria(receita)).not.toMatch(/pratosPrincipais|undefined/);
    });
  });
});
