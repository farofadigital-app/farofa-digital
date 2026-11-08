import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_CACHE_ANA = '@farofa_perguntas_cache_ana';
const CHAVE_CACHE_JOSE = '@farofa_perguntas_cache_jose';
const CHAVE_ULTIMA_SINC = '@farofa_ultima_sincronizacao';

export function validarPergunta(p) {
  if (!p || typeof p !== 'object') return false;
  if (typeof p.pergunta !== 'string' || p.pergunta.trim().length < 6) return false;
  if (!Array.isArray(p.alternativas) || p.alternativas.length !== 4) return false;
  const unicas = new Set(p.alternativas.map(a => (typeof a === 'string' ? a.trim() : '')));
  if (unicas.size !== 4 || unicas.has('')) return false;
  if (typeof p.correta !== 'number' || p.correta < 0 || p.correta > 3) return false;
  if (typeof p.explicacao !== 'string' || p.explicacao.trim().length === 0) return false;
  return true;
}

export function validarLote(lista) {
  if (!Array.isArray(lista) || lista.length === 0) return [];
  return lista.filter(validarPergunta);
}

export async function carregarPerguntasComFallback(mentor, bancoLocal) {
  const chave = mentor === 'jose' ? CHAVE_CACHE_JOSE : CHAVE_CACHE_ANA;
  try {
    const cache = await AsyncStorage.getItem(chave);
    if (cache) {
      const parsed = JSON.parse(cache);
      const validas = validarLote(parsed);
      if (validas.length > 0) return validas;
    }
  } catch (e) {
    // Falha silenciosa no cache, segue com banco local
  }
  return bancoLocal;
}

export async function sincronizarPerguntasSegundoPlano(urlBase) {
  const endpoint = urlBase || process.env.EXPO_PUBLIC_FAROFA_PERGUNTAS_URL;
  if (!endpoint) return { sucesso: false, motivo: 'URL nao configurada' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const resp = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeout);

    if (!resp.ok) return { sucesso: false, motivo: `HTTP ${resp.status}` };
    const dados = await resp.json();

    let totalSalvo = 0;
    if (Array.isArray(dados.perguntas_ana)) {
      const validasAna = validarLote(dados.perguntas_ana);
      if (validasAna.length > 0) {
        await AsyncStorage.setItem(CHAVE_CACHE_ANA, JSON.stringify(validasAna));
        totalSalvo += validasAna.length;
      }
    }
    if (Array.isArray(dados.perguntas_jose)) {
      const validasJose = validarLote(dados.perguntas_jose);
      if (validasJose.length > 0) {
        await AsyncStorage.setItem(CHAVE_CACHE_JOSE, JSON.stringify(validasJose));
        totalSalvo += validasJose.length;
      }
    }

    await AsyncStorage.setItem(CHAVE_ULTIMA_SINC, new Date().toISOString());
    return { sucesso: true, salvas: totalSalvo };
  } catch (err) {
    return { sucesso: false, motivo: err.message };
  }
}
