import { View, Text, StyleSheet } from 'react-native';
import TelaSegura from '../../componentes/layout/TelaSegura';
import BotaoPrincipal from '../../componentes/comuns/BotaoPrincipal';
import { CORES } from '../../uteis/constantes';

export default function BoasVindas({ navigation }) {
  return (
    <TelaSegura estilo={estilos.centro}>
      <Text style={estilos.titulo}>🔥 Farofa Digital 🔥</Text>
      <Text style={estilos.subtitulo}>Descubra a culinária brasileira!</Text>
      <BotaoPrincipal titulo="Começar" onPress={() => navigation.navigate('EscolherMentor')} />
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  centro: { justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: CORES.destaque, marginBottom: 12 },
  subtitulo: { fontSize: 16, color: CORES.textoSecundario, marginBottom: 40 }
});
