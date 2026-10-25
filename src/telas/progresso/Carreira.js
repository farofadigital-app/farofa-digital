import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TelaSegura from '../../componentes/layout/TelaSegura';
import BarraNivel from '../../componentes/progresso/BarraNivel';
import { useApp } from '../../estados/ContextoApp';
import { CORES } from '../../uteis/constantes';
import { NIVEIS } from '../../dados/niveis';

export default function Carreira() {
  const { exp, nivel, brasas } = useApp();
  const infoAtual = NIVEIS.find(n => n.nivel === nivel);

  return (
    <TelaSegura>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={estilos.titulo}>🏅 Minha Carreira</Text>
        <View style={estilos.cartao}>
          <Text style={estilos.nivelAtual}>{infoAtual?.icone} {infoAtual?.nome}</Text>
          <Text style={estilos.brasas}>🔥 {brasas} Brasas</Text>
          <BarraNivel expAtual={exp} nivelAtual={nivel} />
        </View>
        <Text style={estilos.subtitulo}>Todos os Níveis</Text>
        {NIVEIS.map(info => (
          <View key={info.nivel} style={[estilos.linha, nivel === info.nivel && estilos.linhaAtual]}>
            <Text style={estilos.linhaTexto}>{info.icone} {info.nivel}. {info.nome}</Text>
            <Text style={estilos.linhaExp}>{info.expNecessaria} EXP</Text>
          </View>
        ))}
      </ScrollView>
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  titulo: { fontSize: 24, fontWeight: 'bold', color: CORES.destaque, marginVertical: 20 },
  cartao: { backgroundColor: CORES.superficie, padding: 20, borderRadius: 16, marginBottom: 20 },
  nivelAtual: { fontSize: 20, fontWeight: 'bold', color: CORES.texto, marginBottom: 8 },
  brasas: { fontSize: 16, color: CORES.destaque, marginBottom: 12 },
  subtitulo: { fontSize: 18, color: CORES.texto, marginBottom: 12 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: CORES.borda },
  linhaAtual: { backgroundColor: 'rgba(245,166,35,0.1)', borderRadius: 8, paddingHorizontal: 8 },
  linhaTexto: { color: CORES.texto },
  linhaExp: { color: CORES.textoSecundario, fontSize: 12 }
});
