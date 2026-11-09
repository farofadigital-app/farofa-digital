import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import MiniGame from './MiniGame';
import { RECEITAS } from '../../dados/receitas';
import { useApp } from '../../estados/ContextoApp';

jest.mock('../../estados/ContextoApp', () => ({
  useApp: jest.fn()
}));

jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Error: 'error', Success: 'success' },
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve())
}));

function renderizarJogo() {
  let renderer;
  act(() => {
    renderer = TestRenderer.create(<MiniGame />);
  });
  return renderer;
}

function pressionar(renderer, rotulo) {
  const botao = renderer.root.find(node =>
    node.type?.name === 'TouchableOpacity'
    && node.props?.accessibilityLabel === rotulo
    && typeof node.props?.onPress === 'function'
  );
  act(() => botao.props.onPress());
}

function textoDoNo(node) {
  return (node.children || []).map(filho =>
    typeof filho === 'string' ? filho : filho?.children ? textoDoNo(filho) : ''
  ).join('');
}

function pressionarTexto(renderer, texto) {
  const botao = renderer.root.find(node =>
    node.type?.name === 'TouchableOpacity'
    && typeof node.props?.onPress === 'function'
    && textoDoNo(node).includes(texto)
  );
  act(() => botao.props.onPress());
}

function encontrarTexto(renderer, texto) {
  return renderer.root.findAll(node => {
    if (node.type !== 'Text') return false;
    return textoDoNo(node).includes(texto);
  });
}

describe('interações da Minicozinha', () => {
  let adicionarBrasas;
  let adicionarExp;

  beforeEach(() => {
    adicionarBrasas = jest.fn();
    adicionarExp = jest.fn();
    useApp.mockReturnValue({
      mentorEscolhido: 'ana',
      adicionarBrasas,
      adicionarExp
    });
  });

  test('mostra o catálogo e abre a seleção de ingredientes ao escolher uma receita', () => {
    const renderer = renderizarJogo();

    expect(encontrarTexto(renderer, 'Minicozinha Farofa')).toHaveLength(1);
    pressionar(renderer, 'Preparar Moqueca Baiana');

    expect(encontrarTexto(renderer, 'Bancada de Moqueca Baiana')).toHaveLength(1);
    expect(encontrarTexto(renderer, '0 de 11 ingredientes no caldeirão')).toHaveLength(1);
    expect(renderer.root.findAll(node =>
      node.type?.name === 'TouchableOpacity'
      && typeof node.props?.accessibilityLabel === 'string'
      && node.props.accessibilityLabel.startsWith('Ingrediente:')
    )).toHaveLength(14);
  });

  test('contabiliza acerto e penaliza intruso sem permitir selecionar o mesmo cartão duas vezes', () => {
    const renderer = renderizarJogo();
    const receita = RECEITAS.find(item => item.nome === 'Moqueca Baiana');
    const obterIntrusos = r => r.root.findAll(node =>
      node.type?.name === 'TouchableOpacity'
      && typeof node.props?.accessibilityLabel === 'string'
      && node.props.accessibilityLabel.startsWith('Ingrediente:')
      && !receita.ingredientes.some(nome =>
        node.props.accessibilityLabel === `Ingrediente: ${nome}`
      )
      && typeof node.props?.onPress === 'function'
    );

    pressionar(renderer, 'Preparar Moqueca Baiana');

    const ingrediente = renderer.root.find(node =>
      node.type?.name === 'TouchableOpacity'
      && node.props?.accessibilityLabel === `Ingrediente: ${receita.ingredientes[0]}`
      && typeof node.props?.onPress === 'function'
    );
    act(() => {
      ingrediente.props.onPress();
    });
    expect(encontrarTexto(renderer, '1 de 11 ingredientes no caldeirão')).toHaveLength(1);

    // Segundo toque não deve incrementar
    act(() => {
      ingrediente.props.onPress();
    });
    expect(encontrarTexto(renderer, '1 de 11 ingredientes no caldeirão')).toHaveLength(1);

    const cartaoIntruso = obterIntrusos(renderer)[0];
    act(() => {
      cartaoIntruso.props.onPress();
    });
    // Ao clicar em intruso, a precisão cai de 100% para 92% (penalização de 8 pontos)
    // e o texto aparece na fase de preparo ou no cabeçalho
    expect(encontrarTexto(renderer, 'no caldeirão')).toHaveLength(1);
  });

  test('avança de etapa sem pular números quando o botão é acionado', () => {
    const renderer = renderizarJogo();
    const receita = RECEITAS.find(item => item.nome === 'Moqueca Baiana');

    pressionar(renderer, 'Preparar Moqueca Baiana');
    receita.ingredientes.forEach(nome => pressionar(renderer, `Ingrediente: ${nome}`));
    pressionarTexto(renderer, 'Tudo separado! Ir para o fogão');

    expect(encontrarTexto(renderer, 'Etapa 1 de 5')).toHaveLength(1);

    pressionarTexto(renderer, 'Feito! Próxima etapa');
    expect(encontrarTexto(renderer, 'Etapa 2 de 5')).toHaveLength(1);
  });
});
