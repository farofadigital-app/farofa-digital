import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import Academia from './Academia';

jest.mock('./Quiz', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockQuiz() {
    return <Text testID="modulo-quiz">Conteudo do Quiz</Text>;
  };
});

jest.mock('./MiniGame', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockMiniGame() {
    return <Text testID="modulo-minigame">Conteudo da Minicozinha</Text>;
  };
});

jest.mock('../receitas/Cortes', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockCortes() {
    return <Text testID="modulo-cortes">Conteudo de Cortes</Text>;
  };
});

function textoDoNo(node) {
  return (node.children || []).map(filho =>
    typeof filho === 'string' ? filho : filho?.children ? textoDoNo(filho) : ''
  ).join('');
}

describe('Hub de Aprendizado (Academia Culinária)', () => {
  test('inicia por padrão no Quiz e renderiza as abas dos 3 módulos', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(<Academia />);
    });

    const abas = renderer.root.findAll(node =>
      node.type?.name === 'TouchableOpacity' && node.props?.accessibilityRole === 'tab'
    );
    expect(abas).toHaveLength(3);

    const quizConteudo = renderer.root.findAll(node => textoDoNo(node).includes('Conteudo do Quiz'));
    expect(quizConteudo.length).toBeGreaterThan(0);
  });

  test('permite alternar entre Quiz, Minicozinha e Cortes', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(<Academia />);
    });

    const abaMinicozinha = renderer.root.find(node =>
      node.type?.name === 'TouchableOpacity' &&
      node.props?.accessibilityRole === 'tab' &&
      node.props?.accessibilityLabel?.includes('Minicozinha')
    );
    act(() => {
      abaMinicozinha.props.onPress();
    });

    expect(renderer.root.findAll(node => textoDoNo(node).includes('Conteudo da Minicozinha')).length).toBeGreaterThan(0);

    const abaCortes = renderer.root.find(node =>
      node.type?.name === 'TouchableOpacity' &&
      node.props?.accessibilityRole === 'tab' &&
      node.props?.accessibilityLabel?.includes('Cortes')
    );
    act(() => {
      abaCortes.props.onPress();
    });

    expect(renderer.root.findAll(node => textoDoNo(node).includes('Conteudo de Cortes')).length).toBeGreaterThan(0);
  });

  test('abre diretamente no módulo especificado via route.params.modulo', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(<Academia route={{ params: { modulo: 'cortes' } }} />);
    });

    expect(renderer.root.findAll(node => textoDoNo(node).includes('Conteudo de Cortes')).length).toBeGreaterThan(0);
  });
});