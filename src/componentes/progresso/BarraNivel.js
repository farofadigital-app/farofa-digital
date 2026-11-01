import { View, StyleSheet } from 'react-native';
import { TextoResponsivo as Text } from '../comuns/TextoResponsivo';
import { CORES } from '../../uteis/constantes';
import { NIVEIS } from '../../dados/niveis';

export default function BarraNivel({ expAtual = 0, nivelAtual = 1 }) {
  const atual = NIVEIS.find(n => n.nivel === nivelAtual);
  const proximo = NIVEIS.find(n => n.nivel === nivelAtual + 1);

  const base = atual?.expNecessaria ?? 0;
  const meta = proximo?.expNecessaria;

  // Sem proximo nivel = nivel maximo, barra cheia
  const progresso = meta
    ? Math.min(Math.max((expAtual - base) / (meta - base), 0), 1)
    : 1;

  return (
    <View>
      <View style={estilos.trilho}>
        <View style={[estilos.preenchimento, { width: `${progresso * 100}%` }]} />
      </View>
      <Text style={estilos.texto}>
        {meta ? `${expAtual} / ${meta} EXP` : 'Nível máximo'}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  trilho: {
    height: 12,
    borderRadius: 6,
    backgroundColor: CORES.borda,
    overflow: 'hidden'
  },
  preenchimento: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: CORES.destaque
  },
  texto: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: CORES.textoSecundario
  }
});