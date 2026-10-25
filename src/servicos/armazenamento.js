import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVES = {
  USUARIO: '@Farofa:usuario',
  BRASAS: '@Farofa:brasas',
  PROGRESSO: '@Farofa:progresso',
  FAVORITOS: '@Farofa:favoritos',
  COMPRAS: '@Farofa:compras',
  HISTORICO: '@Farofa:historico',
  ULTIMO_ACESSO: '@Farofa:ultimoAcesso',
  MENTOR_ESCOLHIDO: '@Farofa:mentor',
  ONBOARDING_CONCLUIDO: '@Farofa:onboarding'
};

export const salvar = async (chave, valor) => {
  try { await AsyncStorage.setItem(chave, JSON.stringify(valor)); }
  catch (e) { console.warn('Erro ao salvar:', e); }
};

export const carregar = async (chave) => {
  try {
    const dados = await AsyncStorage.getItem(chave);
    return dados ? JSON.parse(dados) : null;
  } catch (e) { return null; }
};

export const limparTudo = async () => {
  const chaves = Object.values(CHAVES);
  await AsyncStorage.multiRemove(chaves);
};

export { CHAVES };
