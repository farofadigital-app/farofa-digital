import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import Cozinha from './Cozinha';

jest.mock('../../estados/ContextoApp', () => ({
  useApp: () => ({
    favoritos: [],
    alternarFavorito: jest.fn(),
    adicionarItensCompra: jest.fn(),
    itensCompra: [],
    adicionarItemCompra: jest.fn(),
    alternarItemCompra: jest.fn(),
    removerItemCompra: jest.fn(),
    limparComprados: jest.fn()
  })
}));

describe('Tela Cozinha - Ficha de Custo & Margem', () => {
  test('abre receita e alterna entre Modo de Preparo e Ficha de Custo & Margem', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(<Cozinha route={{ params: { abaInicial: 'receitas' } }} />);
    });

    const encontrarTexto = txt => renderer.root.findAll(node => node.props?.children === txt);

    const botoesAbrir = renderer.root.findAll(node =>
      node.props?.accessibilityLabel && node.props.accessibilityLabel.includes('Ver receita')
    );
    expect(botoesAbrir.length).toBeGreaterThan(0);

    act(() => {
      botoesAbrir[0].props.onPress();
    });

    expect(encontrarTexto('Modo de Preparo').length).toBeGreaterThan(0);
    expect(encontrarTexto('Ficha de Custo & Margem').length).toBeGreaterThan(0);
  });
});