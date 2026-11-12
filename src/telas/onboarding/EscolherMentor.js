import { StyleSheet } from 'react-native';
import { TextoResponsivo as Text } from '../../componentes/comuns/TextoResponsivo';
import TelaSegura from '../../componentes/layout/TelaSegura';
import TouchableOpacity from '../../componentes/comuns/BotaoInterativo';
import { CORES, RAIO, BRASAS_BOAS_VINDAS } from '../../uteis/constantes';
import { useApp } from '../../estados/ContextoApp';

const MENTORES = [
  { id: 'ana', emoji: '👩‍🍳', nome: 'Chef Ana' },
  { id: 'jose', emoji: '👨‍🍳', nome: 'Chef José' }
];

export default function EscolherMentor() {
  const { escolherMentor } = useApp();

  return (
    <TelaSegura estilo={estilos.centro}>
      <Text style={estilos.titulo}>Escolha seu mentor</Text>
      <Text style={estilos.subtitulo}>Seu primeiro mentor é grátis</Text>

      {MENTORES.map(m => (
        <TouchableOpacity
          key={m.id}
          style={estilos.cartao}
          activeOpacity={0.8}
          onPress={() => escolherMentor(m.id)}
        >
          <Text style={estilos.emoji}>{m.emoji}</Text>
          <Text style={estilos.nome}>
            {m.nome} (+{BRASAS_BOAS_VINDAS} Brasas)
          </Text>
        </TouchableOpacity>
      ))}
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  centro: { justifyContent: 'center', paddingTop: 60 },
  titulo: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    color: CORES.texto,
    textAlign: 'center',
    marginBottom: 6
  },
  subtitulo: {
    fontSize: 15,
    lineHeight: 22,
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginBottom: 28
  },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.destaque,
    borderRadius: RAIO,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14
  },
  emoji: { fontSize: 28, lineHeight: 38, marginRight: 12 },
  nome: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: 'bold',
    color: '#000'
  }
});
