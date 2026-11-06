import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const CHAVES = {
  NOME: '@FarofaDigital:nomeUsuario',
  AVATAR: '@FarofaDigital:avatarUri',
  PERFIL_COMPLETO: '@FarofaDigital:perfilCompleto'
};

const Perfil = () => {
  const [nome, setNome] = useState('');
  const [fotoUri, setFotoUri] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const navegacao = useNavigation();

  // Carregar dados salvos ao abrir
  useEffect(() => {
    const carregar = async () => {
      const nomeSalvo = await AsyncStorage.getItem(CHAVES.NOME);
      const fotoSalva = await AsyncStorage.getItem(CHAVES.AVATAR);
      if (nomeSalvo) setNome(nomeSalvo);
      if (fotoSalva) setFotoUri(fotoSalva);
    };
    carregar();
  }, []);

  const escolherFoto = () => {
    Alert.alert(
      'Escolher Foto',
      'De onde quer pegar sua foto?',
      [
        {
          text: '📷 Tirar Foto',
          onPress: async () => {
            const permissao = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissao.granted) {
              Alert.alert('Atenção', 'Permita acesso à câmera nas configurações');
              return;
            }
            const resultado = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7
            });
            if (!resultado.canceled) {
              setFotoUri(resultado.assets[0].uri);
            }
          }
        },
        {
          text: '🖼️ Escolher da Galeria',
          onPress: async () => {
            const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissao.granted) {
              Alert.alert('Atenção', 'Permita acesso à galeria nas configurações');
              return;
            }
            const resultado = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7
            });
            if (!resultado.canceled) {
              setFotoUri(resultado.assets[0].uri);
            }
          }
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const salvar = async () => {
    if (!nome.trim()) {
      Alert.alert('Digite seu nome', 'Precisamos saber seu nome para continuar!');
      return;
    }
    setSalvando(true);
    await AsyncStorage.setItem(CHAVES.NOME, nome.trim());
    if (fotoUri) {
      await AsyncStorage.setItem(CHAVES.AVATAR, fotoUri);
    }
    await AsyncStorage.setItem(CHAVES.PERFIL_COMPLETO, 'true');
    setSalvando(false);
    Alert.alert('✅ Salvo!', 'Perfil atualizado com sucesso!', [
      { text: 'Continuar', onPress: () => navegacao.goBack() }
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={estilos.tela}
    >
      <View style={estilos.conteudo}>
        <Text style={estilos.titulo}>👤 Seu Perfil</Text>
        <Text style={estilos.subtitulo}>Atualize seus dados</Text>

        <TouchableOpacity style={estilos.avatarContainer} onPress={escolherFoto}>
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={estilos.avatarImagem} />
          ) : (
            <View style={estilos.avatarPlaceholder}>
              <Text style={estilos.avatarIcone}>📷</Text>
              <Text style={estilos.avatarTexto}>Adicionar foto</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={estilos.dicaFoto}>Toque na foto para alterar</Text>

        <View style={estilos.campo}>
          <Text style={estilos.rotulo}>Seu Nome</Text>
          <TextInput
            style={estilos.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome..."
            placeholderTextColor="#A0826D"
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity style={estilos.botao} onPress={salvar} disabled={salvando}>
          <Text style={estilos.textoBotao}>
            {salvando ? 'Salvando...' : '✅ Salvar e Continuar'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#FFF8F0'
  },
  conteudo: {
    flex: 1,
    padding: 24,
    paddingTop: 40
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5C3D2E',
    textAlign: 'center',
    marginBottom: 4
  },
  subtitulo: {
    fontSize: 16,
    color: '#8B5A2B',
    textAlign: 'center',
    marginBottom: 32
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#D4A574',
    backgroundColor: '#F5E6D3',
    overflow: 'hidden',
    alignSelf: 'center'
  },
  avatarImagem: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarIcone: {
    fontSize: 32
  },
  avatarTexto: {
    fontSize: 12,
    color: '#8B5A2B',
    marginTop: 4
  },
  dicaFoto: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    color: '#8B5A2B',
    marginBottom: 32
  },
  campo: {
    marginBottom: 24
  },
  rotulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C3D2E',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0C4A8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#5C3D2E'
  },
  botao: {
    backgroundColor: '#8B5A2B',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default Perfil;
