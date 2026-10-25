import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ProvedorApp } from './estados/ContextoApp';
import Rotas from './navegacao/Rotas';

export default function App() {
  return (
    <ProvedorApp>
      <NavigationContainer>
        <Rotas />
        <StatusBar style="light" />
      </NavigationContainer>
    </ProvedorApp>
  );
}
