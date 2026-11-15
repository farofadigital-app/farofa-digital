import {
  calcularCustoPrato,
  calcularLucro,
  calcularMargem,
  classificarMargem,
  obterFichaTecnica,
  FICHAS_TECNICAS_PADRAO
} from './fichaTecnica';
import todasReceitas from '../dados/receitas';

describe('Ficha Técnica e Precificação Culinária', () => {
  test('calcularCustoPrato soma corretamente (quantidade × custo unitário)', () => {
    const insumos = [
      { quantidade: 2, custoUnitario: 5 },
      { quantidade: 3, custoUnitario: 2.5 },
      { quantidade: 1, custoUnitario: 1.5 }
    ];
    expect(calcularCustoPrato(insumos)).toBe(19);
  });

  test('calcularLucro calcula exatamente Valor de Venda − Custo do Prato', () => {
    expect(calcularLucro(50, 20)).toBe(30);
    expect(calcularLucro(15, 20)).toBe(-5);
  });

  test('calcularMargem calcula (Lucro ÷ Valor de Venda) × 100%', () => {
    expect(calcularMargem(30, 50)).toBe(60);
    expect(calcularMargem(25, 100)).toBe(25);
    expect(calcularMargem(0, 0)).toBe(0);
  });

  test('classificarMargem categoriza alta, equilibrada, apertada e prejuizo', () => {
    expect(classificarMargem(60, 30).status).toBe('alta');
    expect(classificarMargem(35, 15).status).toBe('equilibrada');
    expect(classificarMargem(15, 5).status).toBe('apertada');
    expect(classificarMargem(-10, -5).status).toBe('prejuizo');
  });

  test('obterFichaTecnica calcula ficha para todas as 14 receitas do app', () => {
    todasReceitas.forEach(receita => {
      const ficha = obterFichaTecnica(receita);
      expect(ficha.custoTotal).toBeGreaterThan(0);
      expect(ficha.precoVenda).toBeGreaterThan(0);
      expect(ficha.lucro).toBe(Math.round((ficha.precoVenda - ficha.custoTotal) * 10) / 10);
      expect(ficha.margem).toBe(Math.round(((ficha.lucro / ficha.precoVenda) * 100) * 10) / 10);
    });
  });
});