import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../estados/ContextoApp';
import { CORES } from '../uteis/constantes';

import BoasVindas from '../telas/onboarding/BoasVindas';
import EscolherMentor from '../telas/onboarding/EscolherMentor';
import Carreira from '../telas/progresso/Carreira';

const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

function NavegacaoAutenticada() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: CORES.fundo },
        headerTintColor: CORES.destaque,
        tabBarStyle: { backgroundColor: CORES.superficie, borderTopWidth: 0 },
        tabBarActiveTintColor: CORES.destaque,
        tabBarInactiveTintColor: CORES.textoSecundario
      }}
    >
      <Tab.Screen name="Carreira" component={Carreira} options={{ tabBarIcon: ({color}) => <Ionicons name="trophy" size={20} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function Rotas() {
  const { onboardingConcluido, carregando } = useApp();

  if (carregando) return null;

  if (!onboardingConcluido) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="BoasVindas" component={BoasVindas} />
        <AuthStack.Screen name="EscolherMentor" component={EscolherMentor} />
      </AuthStack.Navigator>
    );
  }

  return <NavegacaoAutenticada />;
}
