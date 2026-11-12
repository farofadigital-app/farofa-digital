import { RECEITAS } from './receitas';
import {
  acaoManual,
  calcularRecompensaMinicozinha,
  criarBancada,
  configurarCalor,
  criarDesafioIngredientes,
  exigeAquecimento,
  extrairEtapas,
  zonaDoPonto
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

  test.each(RECEITAS)('$nome tem zonas de calor jogáveis em todas as etapas', receita => {
    const etapas = extrairEtapas(receita);
    const etapasComCalor = etapas.filter(exigeAquecimento);

    for (const etapa of etapasComCalor) {
      const zona = zonaDoPonto(configurarCalor(etapa));
      expect(zona.inicio).toBeGreaterThanOrEqual(0);
      expect(zona.fim).toBeLessThanOrEqual(1);
      expect(zona.inicio).toBeLessThan(zona.fim);
    }
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

  test('usa a temperatura padr quando a receita cita forno sem informar graus', () => {
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
  ])('configura fogo para a instruç "%s"', (instrucao, alvo) => {
    expect(configurarCalor(instrucao)).toEqual({ equipamento: 'fogao', alvo });
  });

  test.each([
    ['Sove a massa até ficar lisa.', 'Sovar'],
    ['Bata os ingredientes.', 'Bater'],
    ['Pique os tomates.', 'Cortar'],
    ['Enrole em bolinhas.', 'Modelar'],
    ['Vire o preparo.', 'Virar'],
    ['Misture tudo.', 'Mexer']
  ])('reconhece a aç manual "%s"', (instrucao, verbo) => {
    expect(acaoManual(instrucao).verbo).toBe(verbo);
  });

  test('n inventa uma aç manual quando a etapa n pede movimento específico', () => {
    expect(acaoManual('Deixe descansar por 15 minutos.')).toBeNull();
  });

  test('mistura ingredientes corretos e até três opções de outras receitas', () => {
    const receita = {
      id: 1,
      ingredientes: ['Feij', 'Sal']
    };
    const receitas = [
      receita,
      { id: 2, ingredientes: ['Arroz', 'arroz', 'Farinha', 'Cebola', 'Sal'] }
    ];
    const bancada = criarBancada(receita, receitas);
    const certos = bancada.filter(item => item.certo);
    const intrusos = bancada.filter(item => !item.certo);

    expect(new Set(certos.map(item => item.nome))).toEqual(new Set(receita.ingredientes));
    expect(intrusos).toHaveLength(3);
    expect(intrusos.every(item =>
      !receita.ingredientes.some(nome => nome.toLowerCase() === item.nome.toLowerCase())
    )).toBe(true);
    expect(new Set(intrusos.map(item => item.nome.toLowerCase())).size).toBe(intrusos.length);
    expect(new Set(bancada.map(item => item.id)).size).toBe(bancada.length);
  });

  test('calcula a faixa do medidor para forno e fog', () => {
    expect(zonaDoPonto({
      equipamento: 'forno',
      minimo: 190,
      maximo: 210
    })).toEqual({
      inicio: 0.5625,
      fim: 0.6875,
      rotulos: ['100°', '260°']
    });
    expect(zonaDoPonto({ equipamento: 'fogao', alvo: 'alto' }, 0.04)).toEqual({
      inicio: 2 / 3 - 0.04,
      fim: 1,
      rotulos: ['Baixo', 'Médio', 'Alto']
    });
    expect(zonaDoPonto({ equipamento: 'forno', minimo: 290, maximo: 310 })).toEqual({
      inicio: 1,
      fim: 1,
      rotulos: ['100°', '260°']
    });
  });

  test.each([
    [100, { estrelas: 3, brasas: 15, exp: 40 }],
    [90, { estrelas: 3, brasas: 15, exp: 40 }],
    [89, { estrelas: 2, brasas: 12, exp: 30 }],
    [70, { estrelas: 2, brasas: 12, exp: 30 }],
    [69, { estrelas: 1, brasas: 10, exp: 25 }],
    [0, { estrelas: 1, brasas: 10, exp: 25 }]
  ])('atribui recompensas para precis %i', (precisao, recompensa) => {
    expect(calcularRecompensaMinicozinha(precisao)).toEqual(recompensa);
  });
});
