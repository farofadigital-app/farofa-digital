import { View, StyleSheet, StatusBar } from 'react-native';
import { CORES } from '../../uteis/constantes';

export default function TelaSegura({ children, estilo }) {
  return (
    <View style={[estilos.fundo, estilo]}>
      <StatusBar barStyle="light-content" backgroundColor={CORES.fundo} />
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: CORES.fundo,
    paddingHorizontal: 16
  }
});
