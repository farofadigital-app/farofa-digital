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
    node.type.name === 'TouchableOpacity'
    && node.props.accessibilityLabel === rotulo
    && typeof node.props.onPress === 'function'
  );
  act(() => botao.props.onPress());
}

function textoDoNo(node) {
  return node.children.map(filho =>
    typeof filho === 'string' ? filho : filho?.children ? textoDoNo(filho) : ''
  ).join('');
}

function pressionarTexto(renderer, texto) {
  const botao = renderer.root.find(node =>
    node.type.name === 'TouchableOpacity'
    && typeof node.props.onPress === 'function'
    && textoDoNo(node).includes(texto)
  );
  act(() => botao.props.onPress());
}

function encontrarTexto(renderer, texto) {
  return renderer.root.findAll(node =>
    node.type === 'Text'
    && node.children.filter(filho => typeof filho === 'string').join('').includes(texto)
  );
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

    expect(encontrarTexto(renderer, 'Minicozinha')).toHaveLength(1);
    pressionar(renderer, 'Preparar Moqueca Baiana, Nordeste, 45min');

    expect(encontrarTexto(renderer, 'O que vai em Moqueca Baiana?')).toHaveLength(1);
    expect(encontrarTexto(renderer, '0 de 9 ingredientes certos')).toHaveLength(1);
    expect(renderer.root.findAll(node =>
      node.type.name === 'TouchableOpacity'
      && typeof node.props.accessibilityLabel === 'string'
      && node.props.accessibilityLabel.startsWith('Ingrediente:')
    )).toHaveLength(12);
  });

  test('contabiliza acerto e penaliza intruso sem permitir selecionar o mesmo cartão duas vezes', () => {
    const renderer = renderizarJogo();
    const receita = RECEITAS.find(item => item.nome === 'Moqueca Baiana');
    const intrusos = renderer => renderer.root.findAll(node =>
      node.type.name === 'TouchableOpacity'
      && typeof node.props.accessibilityLabel === 'string'
      && node.props.accessibilityLabel.startsWith('Ingrediente:')
      && !receita.ingredientes.some(nome =>
        node.props.accessibilityLabel === `Ingrediente: ${nome}`
      )
      && typeof node.props.onPress === 'function'
    );

    pressionar(renderer, 'Preparar Moqueca Baiana, Nordeste, 45min');

    const ingrediente = renderer.root.find(node =>
      node.type.name === 'TouchableOpacity'
      && node.props.accessibilityLabel === `Ingrediente: ${receita.ingredientes[0]}`
      && typeof node.props.onPress === 'function'
    );
    act(() => {
      ingrediente.props.onPress();
      ingrediente.props.onPress();
    });
    expect(encontrarTexto(renderer, '1 de 9 ingredientes certos')).toHaveLength(1);

    const cartaoIntruso = intrusos(renderer)[0];
    act(() => {
      cartaoIntruso.props.onPress();
      cartaoIntruso.props.onPress();
    });
    expect(encontrarTexto(renderer, 'Precisão 92%')).toHaveLength(1);
  });

  test('não pula etapas quando o botão de avançar é acionado duas vezes rapidamente', () => {
    const renderer = renderizarJogo();
    const receita = RECEITAS.find(item => item.nome === 'Moqueca Baiana');

    pressionar(renderer, 'Preparar Moqueca Baiana, Nordeste, 45min');
    receita.ingredientes.forEach(nome => pressionar(renderer, `Ingrediente: ${nome}`));
    pressionarTexto(renderer, 'Tudo separado! Ir para o fogão');

    const avancar = renderer.root.find(node =>
      node.type.name === 'TouchableOpacity'
      && typeof node.props.onPress === 'function'
      && textoDoNo(node).includes('Feito! Próxima etapa')
    );
    act(() => {
      avancar.props.onPress();
      avancar.props.onPress();
    });

    expect(encontrarTexto(renderer, 'Etapa 2 de 5')).toHaveLength(1);
  });
});
