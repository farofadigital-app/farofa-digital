import { StyleSheet } from 'react-native';
import { TextoResponsivo as Text } from '../../componentes/comuns/TextoResponsivo';
import TelaSegura from '../../componentes/layout/TelaSegura';
import BotaoPrincipal from '../../componentes/comuns/BotaoPrincipal';
import { CORES } from '../../uteis/constantes';

export default function BoasVindas({ navigation }) {
  return (
    <TelaSegura estilo={estilos.centro}>
      <Text style={estilos.titulo}>🔥 Farofa Digital 🔥</Text>
      <Text style={estilos.subtitulo}>Descubra a culinária brasileira!</Text>
      <BotaoPrincipal
        titulo="Começar"
        onPress={() => navigation.navigate('EscolherMentor')}
      />
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  centro: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24
  },
  titulo: {
    fontSize: 28,
    lineHeight: 38,
    fontWeight: 'bold',
    color: CORES.destaque,
    textAlign: 'center',
    marginBottom: 12
  },
  subtitulo: {
    fontSize: 16,
    lineHeight: 24,
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginBottom: 40
  }
});