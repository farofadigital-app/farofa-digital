import { RECEITAS } from './receitas';
import {
  acaoManual,
  configurarCalor,
  criarDesafioIngredientes,
  exigeAquecimento,
  extrairEtapas
} from './minicozinha';

describe('regras da Minicozinha', () => {
  test.each(RECEITAS)('$nome tem ingredientes e etapas válidos', receita => {
    const etapas = extrairEtapas(receita);
    const desafio = criarDesafioIngredientes(receita);

    expect(receita.ingredientes.length).toBeGreaterThan(0);
    expect(etapas.length).toBeGreaterThan(0);
    expect(etapas.every(etapa => etapa.length > 0)).toBe(true);
    expect(desafio.map(item => item.nome)).toEqual(receita.ingredientes);
    expect(new Set(desafio.map(item => item.id)).size).toBe(receita.ingredientes.length);
  });

  test('reconhece o aquecimento de forno e mantém uma faixa de dez graus', () => {
    const instrucao = 'Asse em forno a 200 °C até dourar.';

    expect(exigeAquecimento(instrucao)).toBe(true);
    expect(configurarCalor(instrucao)).toEqual({
      equipamento: 'forno',
      alvo: 200,
      minimo: 190,
      maximo: 210
    });
  });

  test('usa a temperatura padrão quando a receita cita forno sem informar graus', () => {
    expect(configurarCalor('Leve ao forno até dourar.')).toEqual({
      equipamento: 'forno',
      alvo: 180,
      minimo: 170,
      maximo: 190
    });
  });

  test.each([
    ['Cozinhe em fogo baixo.', 'baixo'],
    ['Ferva em água quente.', 'alto'],
    ['Cozinhe em fogo médio.', 'medio']
  ])('configura fogo para a instrução "%s"', (instrucao, alvo) => {
    expect(configurarCalor(instrucao)).toEqual({ equipamento: 'fogao', alvo });
  });

  test.each([
    ['Sove a massa até ficar lisa.', 'Sovar'],
    ['Bata os ingredientes.', 'Bater'],
    ['Pique os tomates.', 'Cortar'],
    ['Enrole em bolinhas.', 'Modelar'],
    ['Vire o preparo.', 'Virar'],
    ['Misture tudo.', 'Mexer']
  ])('reconhece a ação manual "%s"', (instrucao, verbo) => {
    expect(acaoManual(instrucao).verbo).toBe(verbo);
  });

  test('não inventa uma ação manual quando a etapa não pede movimento específico', () => {
    expect(acaoManual('Deixe descansar por 15 minutos.')).toBeNull();
  });
});
