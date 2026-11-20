import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const AVATAR_KEY = '@FarofaDigital:avatar';
const NOME_KEY = '@FarofaDigital:nome';

export const solicitarPermissoes = async () => {
  const galeria = await ImagePicker.requestMediaLibraryPermissionsAsync();
  const camera = await ImagePicker.requestCameraPermissionsAsync();
  return galeria.granted && camera.granted;
};

export const escolherAvatarGaleria = async () => {
  try {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!res.canceled) {
      await salvarAvatar(res.assets[0].uri);
      return { sucesso: true, uri: res.assets[0].uri };
    }
    return { sucesso: false };
  } catch (erro) { return { sucesso: false, mensagem: erro.message }; }
};

export const tirarFotoAvatar = async () => {
  try {
    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!res.canceled) {
      await salvarAvatar(res.assets[0].uri);
      return { sucesso: true, uri: res.assets[0].uri };
    }
    return { sucesso: false };
  } catch (erro) { return { sucesso: false, mensagem: erro.message }; }
};

export const salvarAvatar = async (uri) => {
  try { await AsyncStorage.setItem(AVATAR_KEY, uri); return true; }
  catch (e) { return false; }
};

export const carregarAvatar = async () => {
  try { return await AsyncStorage.getItem(AVATAR_KEY); }
  catch { return null; }
};

export const salvarNome = async (nome) => {
  try { await AsyncStorage.setItem(NOME_KEY, nome); return true; }
  catch { return false; }
};

export const carregarNome = async () => {
  try { return await AsyncStorage.getItem(NOME_KEY) || ''; }
  catch { return ''; }
};
