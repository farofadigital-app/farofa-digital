import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import Quiz from './Quiz';
import { useApp } from '../../estados/ContextoApp';
import { carregarPerguntasComFallback, sincronizarPerguntasSegundoPlano } from '../../servicos/sincronizacaoPerguntas';

jest.mock('../../estados/ContextoApp', () => ({
  useApp: jest.fn()
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => true)
  }),
  useIsFocused: () => true
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons'
}));

jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Error: 'error', Success: 'success' },
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve())
}));

jest.mock('../../servicos/sincronizacaoPerguntas', () => ({
  carregarPerguntasComFallback: jest.fn(),
  sincronizarPerguntasSegundoPlano: jest.fn(() => Promise.resolve({ sucesso: true }))
}));

function textoDoNo(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node.children)) {
    return node.children.map(filho => textoDoNo(filho)).join('');
  }
  return '';
}

function encontrarTexto(renderer, texto) {
  return renderer.root.findAll(node =>
    node.children && textoDoNo(node).includes(texto)
  );
}

describe('Tela do Quiz (regressão de inicialização)', () => {
  beforeEach(() => {
    useApp.mockReturnValue({
      mentorEscolhido: 'ana',
      adicionarBrasas: jest.fn(),
      adicionarExp: jest.fn(),
      dadosPerfil: { nome: 'Chef Teste', avatarUri: null }
    });
    carregarPerguntasComFallback.mockImplementation((_mentor, bancoLocal) =>
      Promise.resolve(bancoLocal)
    );
    sincronizarPerguntasSegundoPlano.mockResolvedValue({ sucesso: true });
  });

  test('renderiza tela inicial com perguntas carregadas sem erro de banco indefinido', async () => {
    let renderer;
    await act(async () => {
      renderer = TestRenderer.create(<Quiz />);
    });

    expect(encontrarTexto(renderer, 'Sala do Saber').length).toBeGreaterThan(0);
    expect(encontrarTexto(renderer, 'Chef Ana preparou').length).toBeGreaterThan(0);
    expect(encontrarTexto(renderer, 'Você tem 3 vidas').length).toBeGreaterThan(0);
    expect(encontrarTexto(renderer, 'Começar').length).toBeGreaterThan(0);
  });

  test('renderiza tela inicial com lista vazia sem quebrar em bancoPerguntas.length', async () => {
    carregarPerguntasComFallback.mockResolvedValue([]);

    let renderer;
    await act(async () => {
      renderer = TestRenderer.create(<Quiz />);
    });

    expect(encontrarTexto(renderer, 'Sala do Saber').length).toBeGreaterThan(0);
    expect(encontrarTexto(renderer, 'Ainda não há perguntas para Chef Ana.').length).toBeGreaterThan(0);
    expect(encontrarTexto(renderer, 'Começar')).toHaveLength(0);
  });

  test('renderiza tela inicial para o mentor José com perguntas carregadas', async () => {
    useApp.mockReturnValue({
      mentorEscolhido: 'jose',
      adicionarBrasas: jest.fn(),
      adicionarExp: jest.fn(),
      dadosPerfil: { nome: 'José Aluno', avatarUri: null }
    });

    let renderer;
    await act(async () => {
      renderer = TestRenderer.create(<Quiz />);
    });

    expect(encontrarTexto(renderer, 'Sala do Saber').length).toBeGreaterThan(0);
    expect(encontrarTexto(renderer, 'Chef José preparou').length).toBeGreaterThan(0);
    expect(encontrarTexto(renderer, 'Começar').length).toBeGreaterThan(0);
  });
});
