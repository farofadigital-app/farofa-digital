import { StyleSheet } from 'react-native';
import { TextoResponsivo as Text } from './TextoResponsivo';
import BotaoInterativo from './BotaoInterativo';
import { CORES, RAIO } from '../../uteis/constantes';

export default function BotaoPrincipal({
  titulo, onPress, desativado, estilo, feedbackHaptico
}) {
  return (
    <BotaoInterativo
      style={[estilos.botao, desativado && estilos.desativado, estilo]}
      onPress={onPress}
      disabled={desativado}
      activeOpacity={0.8}
      feedbackHaptico={feedbackHaptico}
    >
      <Text style={estilos.texto}>{titulo}</Text>
    </BotaoInterativo>
  );
}

const estilos = StyleSheet.create({
  botao: {
    backgroundColor: CORES.destaque,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 200,
    borderRadius: RAIO,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8
  },
  desativado: { opacity: 0.5 },
  texto: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center'
  }
});
