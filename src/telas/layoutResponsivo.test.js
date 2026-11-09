import React from 'react';
import { Dimensions, StyleSheet, Text, TextInput } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import {
  TextoResponsivo,
  CampoTextoResponsivo,
  escalaFonte
} from '../componentes/comuns/TextoResponsivo';
import MiniGame from './aprendizado/MiniGame';
import Quiz from './aprendizado/Quiz';
import Perfil from './perfil/Perfil';
import Cortes from './receitas/Cortes';
import Cozinha from './receitas/Cozinha';
import Mentor from './mentor/Mentor';
import { useApp } from '../estados/ContextoApp';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../servicos/sincronizacaoPerguntas', () => ({
  carregarPerguntasComFallback: jest.fn((_mentor, bancoLocal) => Promise.resolve(bancoLocal)),
  sincronizarPerguntasSegundoPlano: jest.fn(() => Promise.resolve({ sucesso: true }))
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

jest.mock('../estados/ContextoApp', () => ({
  useApp: jest.fn()
}));

jest.mock('../servicos/perfilService', () => ({
  escolherFotoGaleria: jest.fn(),
  tirarFotoCamera: jest.fn()
}));

jest.mock('../servicos/armazenamento', () => ({
  CHAVES: {},
  carregar: jest.fn(() => Promise.resolve(null)),
  salvar: jest.fn(() => Promise.resolve(true))
}));

jest.mock('../servicos/mentorIA', () => ({
  prepararMentor: jest.fn(() => Promise.resolve(false)),
  responderMentor: jest.fn(),
  cancelarDownloadMentor: jest.fn(),
  verificarModeloBaixado: jest.fn(() => Promise.resolve(false)),
  TAMANHO_MODELO_BYTES: 1000,
  SUPORTA_IA_LOCAL: false
}));

jest.mock('../servicos/mentorIA.offline', () => ({
  responderMentorOffline: jest.fn(() => 'Resposta offline do chef'),
  obterSugestoesOffline: jest.fn(() => ['Sugestao 1', 'Sugestao 2'])
}));

function configurarTela(largura, fontScale = 1.0) {
  act(() => {
    Dimensions.set({
      window: { width: largura, height: 600, scale: 2, fontScale },
      screen: { width: largura, height: 600, scale: 2, fontScale }
    });
  });
}

function textoDoNo(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node.children)) {
    return node.children.map(filho => textoDoNo(filho)).join('');
  }
  return '';
}

function encontrarPorTexto(renderer, texto) {
  return renderer.root.findAll(node =>
    node.children && textoDoNo(node).includes(texto)
  );
}

function pressionar(renderer, rotuloOuTexto) {
  const botao = renderer.root.find(node => {
    const ehBotao = node.type?.name === 'TouchableOpacity' ||
      node.props?.accessible === true ||
      typeof node.props?.onPress === 'function';
    if (!ehBotao || typeof node.props?.onPress !== 'function') return false;

    if (node.props?.accessibilityLabel === rotuloOuTexto) return true;
    return textoDoNo(node).includes(rotuloOuTexto);
  });

  if (!botao) {
    throw new Error(`Botao com rotulo ou texto "${rotuloOuTexto}" nao encontrado.`);
  }
  act(() => {
    botao.props.onPress();
  });
}

describe('Layout Responsivo - Telas Android Estreitas (320dp) e Fontes Ampliadas (fontScale 1.5)', () => {
  let rendererAtual = null;

  beforeEach(() => {
    jest.useFakeTimers();
    configurarTela(320, 1.5);
    useApp.mockReturnValue({
      mentorEscolhido: 'ana',
      adicionarBrasas: jest.fn(),
      adicionarExp: jest.fn(),
      dadosPerfil: { nome: 'Chef Teste', avatarUri: null },
      salvarPerfilCompleto: jest.fn(),
      brasas: 50,
      exp: 120,
      nivel: 2,
      historico: [
        { id: '1', titulo: 'Quiz acertos', data: '2026-11-08', expGanho: 20 },
        { id: '2', titulo: 'Minicozinha: Feijoada Completa', data: '2026-11-08', expGanho: 30 }
      ],
      favoritos: [],
      alternarFavorito: jest.fn(),
      adicionarItensCompra: jest.fn(),
      itensCompra: [],
      streak: 3,
      perfilCompleto: true,
      ultimoAcesso: '2026-11-08',
      registrarAcessoDiario: jest.fn()
    });
  });

  afterEach(() => {
    if (rendererAtual) {
      act(() => {
        try {
          rendererAtual.unmount();
        } catch (e) {}
      });
      rendererAtual = null;
    }
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  afterAll(() => {
    configurarTela(390, 1.0);
  });

  describe('1. Escala e Responsividade de Texto (TextoResponsivo)', () => {
    test('escalaFonte aplica fator minimo (0.9) em largura estreita de 320dp', () => {
      expect(escalaFonte(20, 320)).toBe(18);
      expect(escalaFonte(14, 320)).toBe(12.6);
    });

    test('escalaFonte usa fallback seguro se largura for invalida', () => {
      expect(escalaFonte(16, null)).toBe(16);
      expect(escalaFonte(16, -10)).toBe(16);
      expect(escalaFonte('invalido', 320)).toBe('invalido');
    });

    test('TextoResponsivo renderiza texto e aceita maxFontSizeMultiplier', () => {
      act(() => {
        rendererAtual = TestRenderer.create(
          <TextoResponsivo style={{ fontSize: 16 }}>Texto Teste</TextoResponsivo>
        );
      });
      const textNode = rendererAtual.root.findByType(Text);
      expect(textNode.props.maxFontSizeMultiplier).toBe(1.5);
      expect(textoDoNo(textNode)).toBe('Texto Teste');
    });

    test('CampoTextoResponsivo injeta maxFontSizeMultiplier padrao de 1.5 no TextInput', () => {
      act(() => {
        rendererAtual = TestRenderer.create(
          <CampoTextoResponsivo value="teste" placeholder="Digite aqui" />
        );
      });
      const inputNode = rendererAtual.root.findByType(TextInput);
      expect(inputNode.props.maxFontSizeMultiplier).toBe(1.5);
    });
  });

  describe('2. MiniGame (Minicozinha) em 320dp e fontScale 1.5', () => {
    test('cabecalho do jogo possui flexWrap para evitar colisoes com o medidor de combos', () => {
      act(() => {
        rendererAtual = TestRenderer.create(<MiniGame />);
      });

      expect(encontrarPorTexto(rendererAtual, 'Minicozinha Farofa').length).toBeGreaterThan(0);
      pressionar(rendererAtual, 'Preparar Moqueca Baiana');

      const nosComWrap = rendererAtual.root.findAll(node => {
        if (!node.props?.style) return false;
        const s = StyleSheet.flatten(node.props.style);
        return s && s.flexWrap === 'wrap';
      });
      expect(nosComWrap.length).toBeGreaterThan(0);
    });

    test('balao de fala do Chef e instrucoes da bancada quebram linha sem corte forcado', () => {
      act(() => {
        rendererAtual = TestRenderer.create(<MiniGame />);
      });
      pressionar(rendererAtual, 'Preparar Moqueca Baiana');

      const nosComFlex = rendererAtual.root.findAll(node => {
        if (!node.props?.style) return false;
        const s = StyleSheet.flatten(node.props.style);
        return s && s.flex === 1;
      });
      expect(nosComFlex.length).toBeGreaterThan(0);

      const textosNoBalao = rendererAtual.root.findAll(node =>
        node.type === 'Text' && typeof node.props?.numberOfLines === 'number'
      );
      expect(textosNoBalao).toHaveLength(0);
    });
  });

  describe('3. Quiz (Sala do Saber) em 320dp e fontScale 1.5', () => {
    test('tela inicial do Quiz exibe regras completas sem truncamento', () => {
      act(() => {
        rendererAtual = TestRenderer.create(<Quiz />);
      });

      expect(encontrarPorTexto(rendererAtual, 'Sala do Saber').length).toBeGreaterThan(0);
      expect(encontrarPorTexto(rendererAtual, 'Você tem 3 vidas').length).toBeGreaterThan(0);
      expect(encontrarPorTexto(rendererAtual, 'Começar').length).toBeGreaterThan(0);
    });

    test('ao iniciar a rodada, as 4 alternativas possuem flex: 1 para quebrar texto sem corte rigido', () => {
      act(() => {
        rendererAtual = TestRenderer.create(<Quiz />);
      });

      pressionar(rendererAtual, 'Começar');

      const textosAlternativa = rendererAtual.root.findAll(node => {
        if (!node.props?.style) return false;
        const s = StyleSheet.flatten(node.props.style);
        return s && s.flex === 1 && node.type === TextoResponsivo;
      });

      expect(textosAlternativa.length).toBe(4);

      textosAlternativa.forEach(t => {
        expect(t.props.numberOfLines).toBeUndefined();
      });
    });
  });

  describe('4. Perfil do Chef em 320dp e fontScale 1.5', () => {
    test('estatisticas e botoes de foto possuem flexWrap para acomodar tela estreita', () => {
      act(() => {
        rendererAtual = TestRenderer.create(<Perfil />);
      });

      expect(encontrarPorTexto(rendererAtual, 'Nome do Chef:').length).toBeGreaterThan(0);
      expect(encontrarPorTexto(rendererAtual, 'Dias Seguidos').length).toBeGreaterThan(0);

      const containersComWrap = rendererAtual.root.findAll(node => {
        if (!node.props?.style) return false;
        const s = StyleSheet.flatten(node.props.style);
        return s && s.flexWrap === 'wrap';
      });

      expect(containersComWrap.length).toBeGreaterThanOrEqual(2);
    });

    test('rotulos de estatisticas tem alinhamento centralizado para evitar truncamento lateral', () => {
      act(() => {
        rendererAtual = TestRenderer.create(<Perfil />);
      });

      const rotuloDias = rendererAtual.root.find(node =>
        node.type === 'Text' && textoDoNo(node) === 'Dias Seguidos'
      );
      expect(rotuloDias).toBeDefined();
      const estilo = StyleSheet.flatten(rotuloDias.props.style);
      expect(estilo.textAlign).toBe('center');
    });
  });

  describe('5. Guia de Cortes em 320dp e fontScale 1.5', () => {
    test('cabecalho do corte possui flexWrap e nome possui flexivel para nao colidir com o badge', () => {
      act(() => {
        rendererAtual = TestRenderer.create(<Cortes />);
      });

      expect(encontrarPorTexto(rendererAtual, 'Guia de Cortes, Facas & Técnicas').length).toBeGreaterThan(0);

      const headersComWrap = rendererAtual.root.findAll(node => {
        if (!node.props?.style) return false;
        const s = StyleSheet.flatten(node.props.style);
        return s && s.flexWrap === 'wrap';
      });
      expect(headersComWrap.length).toBeGreaterThan(0);
    });

    test('utensilios recomendados (faca e tabua) quebram naturalmente sem numberOfLines', () => {
      act(() => {
        rendererAtual = TestRenderer.create(<Cortes />);
      });

      const textosComCorte = rendererAtual.root.findAll(node =>
        node.type === 'Text' && typeof node.props?.numberOfLines === 'number'
      );
      expect(textosComCorte).toHaveLength(0);
    });
  });

  describe('6. Cozinha (Receitas e Lista) em 320dp e fontScale 1.5', () => {
    test('abas de navegacao estao centralizadas e cartoes de receita usam flex: 1 para o texto', () => {
      act(() => {
        rendererAtual = TestRenderer.create(<Cozinha route={{ params: { abaInicial: 'receitas' } }} />);
      });

      expect(encontrarPorTexto(rendererAtual, 'Receitas').length).toBeGreaterThan(0);
      expect(encontrarPorTexto(rendererAtual, 'Lista').length).toBeGreaterThan(0);
      expect(encontrarPorTexto(rendererAtual, 'Cortes').length).toBeGreaterThan(0);

      const infoReceitaNos = rendererAtual.root.findAll(node => {
        if (!node.props?.style) return false;
        const s = StyleSheet.flatten(node.props.style);
        return s && s.flex === 1;
      });
      expect(infoReceitaNos.length).toBeGreaterThan(0);
    });
  });

  describe('7. Mentor em 320dp e fontScale 1.5', () => {
    test('dicas e receita do dia exibem texto completo sem corte rigido de numberOfLines', () => {
      act(() => {
        rendererAtual = TestRenderer.create(<Mentor />);
      });

      expect(encontrarPorTexto(rendererAtual, 'Mais dicas para cozinhar melhor').length).toBeGreaterThan(0);
      expect(encontrarPorTexto(rendererAtual, 'RECEITA DO DIA').length).toBeGreaterThan(0);

      const dicas = rendererAtual.root.findAll(node => {
        if (node.type !== 'Text') return false;
        const s = StyleSheet.flatten(node.props?.style);
        return s && (s.fontSize === 12 || s.fontSize === 14);
      });

      dicas.forEach(dica => {
        expect(dica.props.numberOfLines).toBeUndefined();
      });
    });
  });
});
