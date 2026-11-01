import {
  acertou, calcularRecompensaAcerto, multiplicadorCombo, sortearPerguntas
} from './quiz';
import { PERGUNTAS_ANA } from './perguntas_ana';
import { PERGUNTAS_JOSE } from './perguntas_jose';

describe('dados do Quiz', () => {
  test.each([
    ['Chef Ana', PERGUNTAS_ANA],
    ['Chef José', PERGUNTAS_JOSE]
  ])('%s tem perguntas válidas', (_mentor, perguntas) => {
    const ids = new Set();

    perguntas.forEach(pergunta => {
      expect(ids.has(pergunta.id)).toBe(false);
      ids.add(pergunta.id);
      expect(pergunta.alternativas).toHaveLength(4);
      expect(new Set(pergunta.alternativas).size).toBe(4);
      expect(pergunta.alternativas).toContain(pergunta.correta);
      expect(Number.isFinite(pergunta.exp)).toBe(true);
      expect(Number.isFinite(pergunta.brasas)).toBe(true);
    });
  });

  test('sorteia sem repetir perguntas nem alterar a lista original', () => {
    const original = PERGUNTAS_ANA.slice(0, 12);
    const copiaOriginal = structuredClone(original);
    const sorteadas = sortearPerguntas(original, 8);

    expect(sorteadas).toHaveLength(8);
    expect(new Set(sorteadas.map(pergunta => pergunta.id)).size).toBe(8);
    expect(original).toEqual(copiaOriginal);
    sorteadas.forEach(pergunta => {
      expect(pergunta.alternativas).toHaveLength(4);
      expect(pergunta.alternativas).toContain(pergunta.correta);
    });
  });

  test('respeita filtros de dificuldade e categoria', () => {
    const sorteadas = sortearPerguntas(PERGUNTAS_JOSE, 5, {
      dificuldade: 2,
      categoria: 'Ingredientes'
    });

    expect(sorteadas.length).toBeGreaterThan(0);
    sorteadas.forEach(pergunta => {
      expect(pergunta.dificuldade).toBe(2);
      expect(pergunta.categoria).toBe('Ingredientes');
    });
  });

  test('confere a resposta pelo texto, mesmo com alternativas embaralhadas', () => {
    const pergunta = PERGUNTAS_ANA[0];

    expect(acertou(pergunta, pergunta.correta)).toBe(true);
    expect(acertou(pergunta, 'Resposta incorreta')).toBe(false);
  });
});

describe('recompensas e combos do Quiz', () => {
  const pergunta = { exp: 10, brasas: 1 };

  test.each([
    [0, 1],
    [1, 1],
    [2, 1.5],
    [3, 2],
    [20, 2]
  ])('combo %i usa multiplicador x%s', (combo, esperado) => {
    expect(multiplicadorCombo(combo)).toBe(esperado);
  });

  test('recompensa o primeiro acerto sem multiplicação', () => {
    expect(calcularRecompensaAcerto(pergunta, 1)).toEqual({
      multiplicador: 1,
      exp: 10,
      brasas: 1
    });
  });

  test('aumenta a recompensa em combos e respeita os arredondamentos do jogo', () => {
    expect(calcularRecompensaAcerto(pergunta, 2)).toEqual({
      multiplicador: 1.5,
      exp: 15,
      brasas: 2
    });
    expect(calcularRecompensaAcerto(pergunta, 3)).toEqual({
      multiplicador: 2,
      exp: 20,
      brasas: 2
    });
  });

  test('preserva o mínimo de Brasas da pergunta em recompensas pequenas', () => {
    expect(calcularRecompensaAcerto({ exp: 10, brasas: 2 }, 1).brasas).toBe(2);
  });
});
