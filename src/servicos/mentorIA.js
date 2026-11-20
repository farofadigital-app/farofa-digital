import { responderMentorOffline, obterSugestoesOffline } from './mentorIA.offline';

export const SUPORTA_IA_LOCAL = true;
export const TAMANHO_MODELO_BYTES = 0;

const PROMPTS_SISTEMA = {
  ana: `Você é a Chef Ana, mentora gastronômica carinhosa, didática e paciente do aplicativo Farofa Digital.
Seu foco é a rica culinária brasileira, receitas do dia a dia, reaproveitamento de alimentos, afeto na cozinha e técnicas simples para iniciantes.
Responda sempre em português do Brasil com entusiasmo acolhedor, de forma direta, clara e prática (máximo de 3 parágrafos ou passos numerados).
Nunca invente ingredientes tóxicos ou preparos inseguros. Se perguntarem algo fora da culinária, convide gentilmente a pessoa de volta para a cozinha.`,

  jose: `Você é o Chef José, mentor gastronômico enérgico, técnico e apaixonado do aplicativo Farofa Digital.
Seu foco são técnicas culinárias de fogo, cortes de precisão, pontos de carnes, temperos marcantes, caldos artesanais e segurança profissional na cozinha.
Responda sempre em português do Brasil com energia motivadora, de forma objetiva, firme e técnica (máximo de 3 parágrafos ou passos numerados).
Nunca recomende procedimentos perigosos com fogo ou facas. Se perguntarem algo fora da culinária, puxe o foco imediatamente para a bancada e o fogão.`
};

export async function verificarModeloBaixado() {
  return true;
}

export async function prepararMentor(onProgress = () => {}) {
  onProgress({ etapa: 'carregamento' });
  return true;
}

export async function cancelarDownloadMentor() {}

async function chamarIAOnline(mentor, mensagens) {
  const apiUrl = process.env.EXPO_PUBLIC_AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const apiKey = process.env.EXPO_PUBLIC_AI_API_KEY;
  const model = process.env.EXPO_PUBLIC_AI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    return null;
  }

  const systemPrompt = PROMPTS_SISTEMA[mentor] || PROMPTS_SISTEMA.ana;

  const historicoFormatado = [
    { role: 'system', content: systemPrompt },
    ...mensagens.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content || ''
    }))
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const resposta = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: historicoFormatado,
        temperature: 0.7,
        max_tokens: 450
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!resposta.ok) {
      return null;
    }

    const json = await resposta.json();
    const texto = json?.choices?.[0]?.message?.content?.trim();
    return texto || null;
  } catch (e) {
    return null;
  }
}

export async function responderMentor(mentor, mensagens, onToken = () => {}) {
  const ultimaMensagem = mensagens[mensagens.length - 1]?.content || '';

  const respostaOnline = await chamarIAOnline(mentor, mensagens);
  if (respostaOnline) {
    onToken(respostaOnline);
    return respostaOnline;
  }

  const respostaOffline = await responderMentorOffline(mentor, ultimaMensagem, mensagens);
  onToken(respostaOffline);
  return respostaOffline;
}

export async function obterSugestoes(mentor, contexto = {}) {
  return obterSugestoesOffline(mentor, contexto);
}

export async function resetarMentor() {
  return true;
}

export default {
  SUPORTA_IA_LOCAL,
  TAMANHO_MODELO_BYTES,
  verificarModeloBaixado,
  prepararMentor,
  cancelarDownloadMentor,
  responderMentor,
  obterSugestoes,
  resetarMentor
};