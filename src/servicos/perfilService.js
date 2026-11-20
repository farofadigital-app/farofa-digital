import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

const CHAVES = {
  NOME: '@FarofaDigital:nomeUsuario',
  AVATAR: '@FarofaDigital:avatarUri',
  COMPLETO: '@FarofaDigital:perfilCompleto'
};

export const salvarPerfil = async (nome, avatarUri) => {
  try {
    if (nome) await AsyncStorage.setItem(CHAVES.NOME, nome);
    if (avatarUri) await AsyncStorage.setItem(CHAVES.AVATAR, avatarUri);
    await AsyncStorage.setItem(CHAVES.COMPLETO, 'true');
    return { sucesso: true, nome, avatarUri };
  } catch (e) {
    return { sucesso: false, erro: e.message };
  }
};

export const carregarPerfil = async () => {
  try {
    const nome = await AsyncStorage.getItem(CHAVES.NOME);
    const avatarUri = await AsyncStorage.getItem(CHAVES.AVATAR);
    const completo = await AsyncStorage.getItem(CHAVES.COMPLETO);
    return {
      nome: nome || '',
      avatarUri: avatarUri || null,
      perfilCompleto: completo === 'true'
    };
  } catch (e) {
    return { nome: '', avatarUri: null, perfilCompleto: false };
  }
};

export const escolherFotoGaleria = async () => {
  try {
    if (Platform.OS === 'web') {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = e.target?.files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            resolve({ sucesso: true, uri: url });
          } else {
            resolve({ sucesso: false });
          }
        };
        input.click();
      });
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return { sucesso: false, mensagem: 'Permissão para acessar a galeria é necessária.' };
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      return { sucesso: true, uri: res.assets[0].uri };
    }
    return { sucesso: false };
  } catch (e) {
    return { sucesso: false, mensagem: e.message };
  }
};

export const tirarFotoCamera = async () => {
  try {
    if (Platform.OS === 'web') {
      return escolherFotoGaleria();
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return { sucesso: false, mensagem: 'Permissão para usar a câmera é necessária.' };
    }
    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      return { sucesso: true, uri: res.assets[0].uri };
    }
    return { sucesso: false };
  } catch (e) {
    return { sucesso: false, mensagem: e.message };
  }
};

export const PerfilService = {
  salvar: salvarPerfil,
  carregar: carregarPerfil,
  escolherImagem: async (tipo) => {
    const res = tipo === 'camera' ? await tirarFotoCamera() : await escolherFotoGaleria();
    return res.sucesso ? res.uri : null;
  },
  limpar: async () => AsyncStorage.multiRemove(Object.values(CHAVES))
};

export default PerfilService;