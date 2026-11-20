import { ScrollView, StyleSheet, View } from 'react-native';
import { TextoResponsivo as Text } from '../../componentes/comuns/TextoResponsivo';
import TelaSegura from '../../componentes/layout/TelaSegura';
import TouchableOpacity from '../../componentes/comuns/BotaoInterativo';
import { CORES } from '../../uteis/constantes';
import Quiz from './Quiz';
import MiniGame from './MiniGame';
import Cortes from '../receitas/Cortes';

// Cada módulo é uma tela própria, com o próprio nome no cabeçalho (ver navegacao/Rotas.js).
// A tela "Academia" é só o menu que leva até elas.
export const MODULOS = [
  { id: 'quiz', rota: 'Quiz', titulo: 'Quiz', emoji: '🧠', subtitulo: 'Sala do Saber', descricao: 'Perguntas dos chefs, com vidas, tempo e combo.' },
  { id: 'minigame', rota: 'Minicozinha', titulo: 'Minicozinha', emoji: '🍳', subtitulo: 'Prática & Gestos', descricao: 'Cozinhe na prática: separe os ingredientes, corte e mexa no ponto certo.' },
  { id: 'cortes', rota: 'Cortes', titulo: 'Guia de Cortes', emoji: '🔪', subtitulo: 'Facas, cortes e técnicas', descricao: 'Aprenda o corte certo, a faca ideal e as técnicas clássicas.' }
];

function Modulo({ id, navigation, route }) {
  if (id === 'quiz') return <Quiz navigation={navigation} route={route} />;
  if (id === 'minigame') return <MiniGame navigation={navigation} route={route} />;
  return <Cortes navigation={navigation} route={route} />;
}

export default function Academia({ route, navigation }) {
  const moduloParam = route?.params?.modulo;

  if (moduloParam && MODULOS.some(m => m.id === moduloParam)) {
    return (
      <TelaSegura>
        <View style={estilos.conteudoModulo}>
          <Modulo id={moduloParam} navigation={navigation} route={route} />
        </View>
      </TelaSegura>
    );
  }

  return (
    <TelaSegura>
      <ScrollView contentContainerStyle={estilos.lista} showsVerticalScrollIndicator={false}>
        <Text style={estilos.intro}>Escolha o que praticar agora.</Text>
        {MODULOS.map(m => (
          <TouchableOpacity
            key={m.id}
            style={estilos.cartao}
            onPress={() => navigation?.navigate?.(m.rota)}
            accessibilityRole="button"
            accessibilityLabel={m.titulo + ' - ' + m.subtitulo}
          >
            <Text style={estilos.emoji}>{m.emoji}</Text>
            <View style={estilos.textos}>
              <Text style={estilos.titulo}>{m.titulo}</Text>
              <Text style={estilos.subtitulo}>{m.subtitulo}</Text>
              <Text style={estilos.descricao}>{m.descricao}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  conteudoModulo: { flex: 1 },
  lista: { paddingTop: 16, paddingBottom: 24, gap: 12 },
  intro: { color: CORES.textoSecundario, fontSize: 15, lineHeight: 22 },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: CORES.superficie,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: CORES.borda
  },
  emoji: { fontSize: 32, lineHeight: 40 },
  textos: { flex: 1 },
  titulo: { color: CORES.texto, fontSize: 18, fontWeight: 'bold', lineHeight: 26 },
  subtitulo: { color: CORES.destaque, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  descricao: { color: CORES.textoSecundario, fontSize: 14, lineHeight: 20, marginTop: 4 }
});
