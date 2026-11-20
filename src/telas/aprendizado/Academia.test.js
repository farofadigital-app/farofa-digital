import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import Academia, { MODULOS } from './Academia';

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

const ehCartao = node => node.type?.name === 'TouchableOpacity' && node.props?.accessibilityRole === 'button';
const temTexto = (renderer, texto) => renderer.root.findAll(node => textoDoNo(node).includes(texto)).length > 0;
const CONTEUDOS = { quiz: 'Conteudo do Quiz', minigame: 'Conteudo da Minicozinha', cortes: 'Conteudo de Cortes' };

describe('Academia Culinária: cada módulo é uma tela própria', () => {
  test('sem módulo mostra o menu com os 3 módulos, sem abas e sem conteúdo de módulo', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(<Academia navigation={{ navigate: jest.fn() }} />);
    });

    expect(renderer.root.findAll(ehCartao)).toHaveLength(3);
    expect(renderer.root.findAll(node => node.props?.accessibilityRole === 'tab')).toHaveLength(0);
    Object.values(CONTEUDOS).forEach(conteudo => {
      expect(temTexto(renderer, conteudo)).toBe(false);
    });
  });

  test('o menu mostra o nome completo de cada módulo, sem limite de linhas', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(<Academia navigation={{ navigate: jest.fn() }} />);
    });

    MODULOS.forEach(modulo => {
      expect(temTexto(renderer, modulo.titulo)).toBe(true);
      expect(temTexto(renderer, modulo.subtitulo)).toBe(true);
      expect(temTexto(renderer, modulo.descricao)).toBe(true);
    });
    expect(renderer.root.findAll(node => node.props?.numberOfLines > 0)).toHaveLength(0);
  });

  test('cada cartão abre a própria tela', () => {
    const navigate = jest.fn();
    let renderer;
    act(() => {
      renderer = TestRenderer.create(<Academia navigation={{ navigate }} />);
    });

    renderer.root.findAll(ehCartao).forEach(cartao => {
      act(() => {
        cartao.props.onPress();
      });
    });

    expect(navigate.mock.calls.map(chamada => chamada[0])).toEqual(['Quiz', 'Minicozinha', 'Cortes']);
  });

  test.each(MODULOS)('abre só o módulo $titulo, sem a barra de abas e sem o menu', modulo => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(<Academia route={{ params: { modulo: modulo.id } }} />);
    });

    expect(temTexto(renderer, CONTEUDOS[modulo.id])).toBe(true);
    Object.entries(CONTEUDOS).filter(([id]) => id !== modulo.id).forEach(([, conteudo]) => {
      expect(temTexto(renderer, conteudo)).toBe(false);
    });
    expect(renderer.root.findAll(node => node.props?.accessibilityRole === 'tab')).toHaveLength(0);
    expect(renderer.root.findAll(ehCartao)).toHaveLength(0);
  });
});
