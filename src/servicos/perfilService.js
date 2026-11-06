import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const CHAVES = {
  NOME: '@FarofaDigital:nomeUsuario',
  AVATAR: '@FarofaDigital:avatarUri',
  PERFIL_COMPLETO: '@FarofaDigital:perfilCompleto'
};

export const salvarPerfil = async (nome, avatarUri) => {
  try {
    if (nome && nome.trim() !== '') {
      await AsyncStorage.setItem(CHAVES.NOME, nome.trim());
    }
    if (avatarUri) {
      await AsyncStorage.setItem(CHAVES.AVATAR, avatarUri);
    }
    await AsyncStorage.setItem(CHAVES.PERFIL_COMPLETO, 'true');
    return { sucesso: true };
  } catch (erro) {
    return { sucesso: false, mensagem: erro.message };
  }
};

export const carregarPerfil = async () => {
  try {
    const nome = await AsyncStorage.getItem(CHAVES.NOME);
    const avatarUri = await AsyncStorage.getItem(CHAVES.AVATAR);
    const completo = await AsyncStorage.getItem(CHAVES.PERFIL_COMPLETO);
    return {
      nome: nome || '',
      avatarUri: avatarUri || null,
      perfilCompleto: completo === 'true'
    };
  } catch (erro) {
    return { nome: '', avatarUri: null, perfilCompleto: false };
  }
};

export const escolherFotoGaleria = async () => {
  try {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) return { sucesso: false, mensagem: 'Permita acesso a galeria' };
    
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });
    
    if (!resultado.canceled) {
      return { sucesso: true, uri: resultado.assets[0].uri };
    }
    return { sucesso: false, cancelado: true };
  } catch (erro) {
    return { sucesso: false, mensagem: erro.message };
  }
};

export const tirarFotoCamera = async () => {
  try {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) return { sucesso: false, mensagem: 'Permita acesso a camera' };
    
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });
    
    if (!resultado.canceled) {
      return { sucesso: true, uri: resultado.assets[0].uri };
    }
    return { sucesso: false, cancelado: true };
  } catch (erro) {
    return { sucesso: false, mensagem: erro.message };
  }
};
