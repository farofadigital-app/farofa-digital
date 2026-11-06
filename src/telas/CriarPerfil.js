import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../estados/ContextoApp';
import AvatarPerfil from '../componentes/AvatarPerfil';
import { escolherFotoGaleria, tirarFotoCamera } from '../servicos/perfilService';

const CriarPerfil = () => {
  const [nome, setNome] = useState('');
  const [fotoUri, setFotoUri] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const navegacao = useNavigation();
  const { salvarPerfilCompleto } = useApp();

  const escolherFoto = () => {
    Alert.alert(
      'Escolher Foto',
      'De onde quer pegar sua foto?',
      [
        {
          text: 'Tirar Foto',
          onPress: async () => {
            const res = await tirarFotoCamera();
            if (res.sucesso) setFotoUri(res.uri);
            else if (res.mensagem) Alert.alert('Atenção', res.mensagem);
          }
        },
        {
          text: 'Escolher da Galeria',
          onPress: async () => {
            const res = await escolherFotoGaleria();
            if (res.sucesso) setFotoUri(res.uri);
            else if (res.mensagem) Alert.alert('Atenção', res.mensagem);
          }
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const confirmar = async () => {
    if (!nome.trim()) {
      Alert.alert('Digite seu nome', 'Precisamos saber seu nome para continuar!');
      return;
    }
    setSalvando(true);
    await salvarPerfilCompleto(nome.trim(), fotoUri);
    setSalvando(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={estilos.tela}
    >
      <View style={estilos.conteudo}>
        <Text style={estilos.titulo}>Crie seu Perfil</Text>
        <Text style={estilos.subtitulo}>Conte-nos quem é você</Text>

        <AvatarPerfil uri={fotoUri} aoPressionar={escolherFoto} tamanho={140} />
        <Text style={estilos.dicaFoto}>Toque para adicionar sua foto</Text>

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

        <TouchableOpacity style={estilos.botao} onPress={confirmar} disabled={salvando}>
          <Text style={estilos.textoBotao}>
            {salvando ? 'Salvando...' : 'Confirmar e Continuar'}
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

export default CriarPerfil;
