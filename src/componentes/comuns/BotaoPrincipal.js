import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CORES, RAIO } from '../../uteis/constantes';

export default function BotaoPrincipal({ titulo, onPress, desativado, estilo }) {
  return (
    <TouchableOpacity
      style={[estilos.botao, desativado && estilos.desativado, estilo]}
      onPress={onPress}
      disabled={desativado}
    >
      <Text style={estilos.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  botao: {
    backgroundColor: CORES.destaque,
    paddingVertical: 14,
    borderRadius: RAIO,
    alignItems: 'center',
    marginVertical: 8
  },
  desativado: { opacity: 0.5 },
  texto: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  }
});
