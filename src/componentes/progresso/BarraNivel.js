import { View, Text, StyleSheet } from 'react-native';
import { CORES, RAIO } from '../../uteis/constantes';
import { NIVEIS } from '../../dados/niveis';

export default function BarraNivel({ expAtual, nivelAtual }) {
  const infoAtual = NIVEIS.find(n => n.nivel === nivelAtual);
  const proximo = NIVEIS.find(n => n.nivel === nivelAtual + 1);
  if (!proximo) return <Text style={estilos.texto}>Nível Máximo! 🌟</Text>;

  const expParaProximo = proximo.expNecessaria - infoAtual.expNecessaria;
  const expDesteNivel = expAtual - infoAtual.expNecessaria;
  const porcentagem = Math.min((expDesteNivel / expParaProximo) * 100, 100);

  return (
    <View style={estilos.container}>
      <View style={estilos.linhaTexto}>
        <Text style={estilos.nome}>{infoAtual.icone} {infoAtual.nome}</Text>
        <Text style={estilos.exp}>{expAtual}/{proximo.expNecessaria} EXP</Text>
      </View>
      <View style={estilos.fundoBarra}>
        <View style={[estilos.preenchimento, { width: `${porcentagem}%` }]} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { marginVertical: 12 },
  linhaTexto: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  nome: { color: CORES.texto, fontWeight: 'bold' },
  exp: { color: CORES.textoSecundario, fontSize: 12 },
  fundoBarra: { height: 10, backgroundColor: CORES.superficie, borderRadius: 5 },
  preenchimento: { height: '100%', backgroundColor: CORES.destaque, borderRadius: 5 }
});
