import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import BoasVindas from './BoasVindas';
import EscolherMentor from './EscolherMentor';
import { ProvedorApp, useApp } from '../../estados/ContextoApp';
import { CHAVES } from '../../servicos/armazenamento';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve())
}));

function EstadoDoApp() {
  const { carregando, onboardingConcluido, mentorEscolhido, brasas } = useApp();
  return (
    <Text testID="estado">
      {JSON.stringify({ carregando, onboardingConcluido, mentorEscolhido, brasas })}
    </Text>
  );
}

function textoDoNo(node) {
  return node.children.map(filho =>
    typeof filho === 'string' ? filho : filho?.children ? textoDoNo(filho) : ''
  ).join('');
}

function pressionarBotao(renderer, texto) {
  const botao = renderer.root.find(node =>
    node.type.name === 'TouchableOpacity'
    && typeof node.props.onPress === 'function'
    && textoDoNo(node).includes(texto)
  );
  act(() => botao.props.onPress());
}

function lerEstado(renderer) {
  return JSON.parse(textoDoNo(renderer.root.find(node => node.props.testID === 'estado')));
}

async function aguardarAtualizacoes() {
  for (let indice = 0; indice < 4; indice++) {
    await new Promise(resolve => setImmediate(resolve));
  }
}

async function renderizarProvedor() {
  let renderer;
  await act(async () => {
    renderer = TestRenderer.create(
      <ProvedorApp>
        <EscolherMentor />
        <EstadoDoApp />
      </ProvedorApp>
    );
    await aguardarAtualizacoes();
  });
  return renderer;
}

describe('fluxo inicial do Farofa Digital', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  test('a tela de boas-vindas apresenta o app e encaminha para a escolha do mentor', () => {
    const navegar = jest.fn();
    let renderer;
    act(() => {
      renderer = TestRenderer.create(<BoasVindas navigation={{ navigate: navegar }} />);
    });

    expect(textoDoNo(renderer.root.find(node =>
      node.type === 'Text' && textoDoNo(node).includes('Farofa Digital')
    ))).toContain('Farofa Digital');
    expect(textoDoNo(renderer.root.find(node =>
      node.type === 'Text' && textoDoNo(node).includes('Descubra a culinária brasileira!')
    ))).toContain('Descubra a culinária brasileira!');

    pressionarBotao(renderer, 'Começar');
    expect(navegar).toHaveBeenCalledWith('EscolherMentor');
  });

  test.each([
    ['ana', 'Chef Ana'],
    ['jose', 'Chef José']
  ])('selecionar %s salva mentor e conclui o onboarding', async (id, nome) => {
    const renderer = await renderizarProvedor();

    expect(lerEstado(renderer)).toMatchObject({
      carregando: false,
      onboardingConcluido: false,
      mentorEscolhido: null,
      brasas: 0
    });
    expect(textoDoNo(renderer.root.find(node =>
      node.type === 'Text' && textoDoNo(node).includes('Escolha seu mentor')
    ))).toContain('Escolha seu mentor');

    pressionarBotao(renderer, nome);

    await act(async () => {
      await aguardarAtualizacoes();
    });

    expect(lerEstado(renderer)).toMatchObject({
      carregando: false,
      onboardingConcluido: true,
      mentorEscolhido: id,
      brasas: 80
    });
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(CHAVES.MENTOR_ESCOLHIDO);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(CHAVES.ONBOARDING_CONCLUIDO);
    expect(AsyncStorage.__INTERNAL_MOCK_STORAGE__[CHAVES.MENTOR_ESCOLHIDO]).toBe(
      JSON.stringify(id)
    );
    expect(AsyncStorage.__INTERNAL_MOCK_STORAGE__[CHAVES.ONBOARDING_CONCLUIDO]).toBe('true');

    act(() => renderer.unmount());
    const appReaberto = await renderizarProvedor();
    expect(lerEstado(appReaberto)).toMatchObject({
      carregando: false,
      onboardingConcluido: true,
      mentorEscolhido: id,
      brasas: 80
    });
  });

});
