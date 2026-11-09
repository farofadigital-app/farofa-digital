import { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { TextoResponsivo as Text, escalaFonte } from '../../componentes/comuns/TextoResponsivo';
import TelaSegura from '../../componentes/layout/TelaSegura';
import TouchableOpacity from '../../componentes/comuns/BotaoInterativo';
import { CORES, RAIO } from '../../uteis/constantes';
import Quiz from './Quiz';
import MiniGame from './MiniGame';
import Cortes from '../receitas/Cortes';

const MODULOS = [
  { id: 'quiz', titulo: 'Quiz', emoji: '🧠', subtitulo: 'Sala do Saber' },
  { id: 'minigame', titulo: 'Minicozinha', emoji: '🍳', subtitulo: 'Prática & Gestos' },
  { id: 'cortes', titulo: 'Cortes', emoji: '🔪', subtitulo: 'Guia Técnico de Facas' }
];

export default function Academia({ route, navigation }) {
  const { width } = useWindowDimensions();
  const moduloParam = route?.params?.modulo;
  const [moduloAtivo, setModuloAtivo] = useState(moduloParam || 'quiz');

  useEffect(() => {
    if (moduloParam && MODULOS.some(m => m.id === moduloParam)) {
      setModuloAtivo(moduloParam);
    }
  }, [moduloParam]);

  return (
    <TelaSegura>
      <View style={estilos.cabecalhoAbas}>
        {MODULOS.map(m => {
          const ativo = moduloAtivo === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={[estilos.abaBotao, ativo && estilos.abaBotaoAtivo]}
              onPress={() => setModuloAtivo(m.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: ativo }}
              accessibilityLabel={m.titulo + ' - ' + m.subtitulo}
            >
              <Text style={estilos.abaEmoji}>{m.emoji}</Text>
              <Text
                style={[
                  estilos.abaTexto,
                  { fontSize: escalaFonte(12, width) },
                  ativo && estilos.abaTextoAtivo
                ]}
                numberOfLines={1}
              >
                {m.titulo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={estilos.conteudoModulo}>
        {moduloAtivo === 'quiz' && <Quiz navigation={navigation} route={route} />}
        {moduloAtivo === 'minigame' && <MiniGame navigation={navigation} route={route} />}
        {moduloAtivo === 'cortes' && <Cortes navigation={navigation} route={route} />}
      </View>
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  cabecalhoAbas: {
    flexDirection: 'row',
    backgroundColor: CORES.superficie,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: RAIO.media,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  abaBotao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: RAIO.pequena,
    gap: 4
  },
  abaBotaoAtivo: {
    backgroundColor: CORES.destaque
  },
  abaEmoji: {
    fontSize: 14
  },
  abaTexto: {
    fontWeight: '700',
    color: CORES.textoSecundario
  },
  abaTextoAtivo: {
    color: CORES.fundo
  },
  conteudoModulo: {
    flex: 1
  }
});