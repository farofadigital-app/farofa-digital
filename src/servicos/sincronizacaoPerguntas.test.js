import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  validarPergunta,
  normalizarPergunta,
  carregarPerguntasComFallback
} from './sincronizacaoPerguntas';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Serviço de Sincronização de Perguntas Online', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  test('validarPergunta aceita pergunta com resposta correta em texto', () => {
    const p = {
      pergunta: 'Qual o tempo ideal de cozimento da mandioca?',
      alternativas: ['10 min', '25 min', '60 min', '120 min'],
      correta: '25 min',
      explicacao: 'Aproximadamente 25 minutos na pressão.'
    };
    expect(validarPergunta(p)).toBe(true);
  });

  test('validarPergunta aceita e normaliza resposta correta como índice numérico (0..3)', () => {
    const p = {
      pergunta: 'Qual a erva clássica do molho vinagrete?',
      alternativas: ['Coentro', 'Salsinha', 'Hortelã', 'Alecrim'],
      correta: 1,
      explicacao: 'Salsinha e cebolinha são o cheiro-verde tradicional.'
    };
    expect(validarPergunta(p)).toBe(true);
    const normalizada = normalizarPergunta(p, 0);
    expect(normalizada.correta).toBe('Salsinha');
  });

  test('validarPergunta rejeita pergunta com menos de 4 alternativas ou respostas vazias', () => {
    expect(validarPergunta({ pergunta: 'Teste?', alternativas: ['A', 'B'], correta: 'A', explicacao: 'X' })).toBe(false);
    expect(validarPergunta({ pergunta: 'Teste?', alternativas: ['A', 'A', 'B', 'C'], correta: 'A', explicacao: 'X' })).toBe(false);
  });

  test('carregarPerguntasComFallback usa banco local se não houver cache', async () => {
    const bancoLocal = [{ id: 'local-1', pergunta: 'Local?' }];
    const resultado = await carregarPerguntasComFallback('ana', bancoLocal);
    expect(resultado).toEqual(bancoLocal);
  });
});