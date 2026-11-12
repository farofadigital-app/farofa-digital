import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_CACHE_ANA = '@farofa_perguntas_cache_ana';
const CHAVE_CACHE_JOSE = '@farofa_perguntas_cache_jose';
const CHAVE_ULTIMA_SINC = '@farofa_ultima_sincronizacao';

const URLS_PADRAO = [
  process.env.EXPO_PUBLIC_FAROFA_PERGUNTAS_URL,
  'https://raw.githubusercontent.com/farofadigital-app/farofa-digital/minha-atualizacao/docs/dados/perguntas.json',
  'https://farofadigital-app.github.io/farofa-digital/dados/perguntas.json'
].filter(Boolean);

export function validarPergunta(p) {
  if (!p || typeof p !== 'object') return false;
  if (typeof p.pergunta !== 'string' || p.pergunta.trim().length < 6) return false;
  if (!Array.isArray(p.alternativas) || p.alternativas.length !== 4) return false;
  const unicas = new Set(p.alternativas.map(a => (typeof a === 'string' ? a.trim() : '')));
  if (unicas.size !== 4 || unicas.has('')) return false;

  let respostaCorreta = p.correta;
  if (typeof respostaCorreta === 'number' && respostaCorreta >= 0 && respostaCorreta <= 3) {
    respostaCorreta = p.alternativas[respostaCorreta];
  }
  if (typeof respostaCorreta !== 'string' || !p.alternativas.includes(respostaCorreta)) {
    return false;
  }

  if (typeof p.explicacao !== 'string' || p.explicacao.trim().length === 0) return false;
  return true;
}

export function normalizarPergunta(p, index = 0) {
  let correta = p.correta;
  if (typeof correta === 'number' && correta >= 0 && correta <= 3) {
    correta = p.alternativas[correta];
  }
  return {
    id: p.id || `online-${index + 1}`,
    categoria: p.categoria || 'Culinária Brasileira',
    dificuldade: typeof p.dificuldade === 'number' ? p.dificuldade : 1,
    exp: typeof p.exp === 'number' ? p.exp : 10,
    brasas: typeof p.brasas === 'number' ? p.brasas : 1,
    pergunta: p.pergunta.trim(),
    alternativas: p.alternativas.map(a => a.trim()),
    correta: typeof correta === 'string' ? correta.trim() : correta,
    explicacao: p.explicacao.trim()
  };
}

export function validarLote(lista) {
  if (!Array.isArray(lista) || lista.length === 0) return [];
  return lista.filter(validarPergunta).map((item, idx) => normalizarPergunta(item, idx));
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
  const urlsParaTentar = urlBase ? [urlBase] : URLS_PADRAO;

  for (const url of urlsParaTentar) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!resp.ok) continue;
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

      if (totalSalvo > 0) {
        await AsyncStorage.setItem(CHAVE_ULTIMA_SINC, new Date().toISOString());
        return { sucesso: true, salvas: totalSalvo, fonte: url };
      }
    } catch (err) {
      // Tenta próxima URL
    }
  }

  return { sucesso: false, motivo: 'Nenhuma fonte online respondeu ou dados invalidos' };
}