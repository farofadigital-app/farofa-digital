import { View, Text, StyleSheet } from 'react-native';
import TelaSegura from '../../componentes/layout/TelaSegura';
import BotaoPrincipal from '../../componentes/comuns/BotaoPrincipal';
import { CORES } from '../../uteis/constantes';
import { useApp } from '../../estados/ContextoApp';

export default function EscolherMentor({ navigation }) {
  const { setMentorEscolhido, setOnboardingConcluido } = useApp();

  const escolher = (mentor) => {
    setMentorEscolhido(mentor);
    setOnboardingConcluido(true);
  };

  return (
    <TelaSegura estilo={estilos.centro}>
      <Text style={estilos.titulo}>Escolha sua mentoria</Text>
      <BotaoPrincipal titulo="👩‍🍳 Chef Ana (+50 Brasas)" onPress={() => escolher('ana')} />
      <BotaoPrincipal titulo="👨‍🍳 Chef José (+60 Brasas)" onPress={() => escolher('jose')} />
    </TelaSegura>
  );
}

const estilos = StyleSheet.create({
  centro: { justifyContent: 'center', paddingTop: 60 },
  titulo: { fontSize: 22, color: CORES.texto, textAlign: 'center', marginBottom: 30 }
});
