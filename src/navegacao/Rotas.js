import { ActivityIndicator, StyleSheet, View, useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TextoResponsivo as Text, escalaFonte } from '../componentes/comuns/TextoResponsivo';
import { vibrarToque } from '../componentes/comuns/BotaoInterativo';
import { useApp } from '../estados/ContextoApp';
import { CORES } from '../uteis/constantes';

import BoasVindas from '../telas/onboarding/BoasVindas';
import EscolherMentor from '../telas/onboarding/EscolherMentor';
import CriarPerfil from '../telas/CriarPerfil';
import Mentor from '../telas/mentor/Mentor';
import Academia from '../telas/aprendizado/Academia';
import Cozinha from '../telas/receitas/Cozinha';
import Perfil from '../telas/perfil/Perfil';

const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

const Icone = ({ emoji, focused }) => (
  <Text style={[estilos.iconeAba, !focused && estilos.iconeInativo]}>{emoji}</Text>
);

function NavegacaoAutenticada() {
  const { width } = useWindowDimensions();

  return (
    <Tab.Navigator
      screenListeners={{ tabPress: vibrarToque }}
      screenOptions={{
        headerStyle: { backgroundColor: CORES.fundo },
        headerTintColor: CORES.destaque,
        headerTitleStyle: { fontSize: escalaFonte(18, width) },
        tabBarStyle: { backgroundColor: CORES.superficie, borderTopWidth: 0 },
        tabBarActiveTintColor: CORES.destaque,
        tabBarInactiveTintColor: CORES.textoSecundario,
        tabBarLabelStyle: { fontSize: escalaFonte(11, width), fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Mentor"
        component={Mentor}
        options={{
          title: 'Farofa Digital',
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused }) => <Icone emoji="👩‍🍳" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Academia"
        component={Academia}
        options={{
          title: 'Academia Culinária',
          tabBarLabel: 'Academia',
          tabBarIcon: ({ focused }) => <Icone emoji="🎓" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Cozinha"
        component={Cozinha}
        options={{
          title: 'Cozinha do Mundo',
          tabBarLabel: 'Receitas',
          tabBarIcon: ({ focused }) => <Icone emoji="🍲" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          title: 'Meu Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused }) => <Icone emoji="👤" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={Academia}
        initialParams={{ modulo: 'quiz' }}
        options={{
          tabBarItemStyle: { display: 'none' },
          title: 'Sala do Saber',
        }}
      />
      <Tab.Screen
        name="Minicozinha"
        component={Academia}
        initialParams={{ modulo: 'minigame' }}
        options={{
          tabBarItemStyle: { display: 'none' },
          title: 'Minicozinha',
        }}
      />
      <Tab.Screen
        name="Cortes"
        component={Academia}
        initialParams={{ modulo: 'cortes' }}
        options={{
          tabBarItemStyle: { display: 'none' },
          title: 'Guia de Cortes & Facas',
        }}
      />
    </Tab.Navigator>
  );
}

const estilos = StyleSheet.create({
  iconeAba: { fontSize: 18 },
  iconeInativo: { opacity: 0.55 },
  carregando: {
    flex: 1,
    backgroundColor: CORES.fundo,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function Rotas() {
  const { carregando, onboardingConcluido, perfilCompleto } = useApp();

  if (carregando) {
    return (
      <View style={estilos.carregando}>
        <ActivityIndicator size="large" color={CORES.destaque} />
      </View>
    );
  }

  if (!onboardingConcluido) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="BoasVindas" component={BoasVindas} />
        <AuthStack.Screen name="EscolherMentor" component={EscolherMentor} />
      </AuthStack.Navigator>
    );
  }

  if (!perfilCompleto) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="CriarPerfil" component={CriarPerfil} />
      </AuthStack.Navigator>
    );
  }

  return <NavegacaoAutenticada />;
}