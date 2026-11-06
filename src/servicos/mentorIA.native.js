import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';

// O modelo local precisa de um app compilado; n roda no Expo Go
export const SUPORTA_IA_LOCAL =
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

const TAMANHO_MODELO = 1117320736;
const DIRETORIO_MODELOS = `${FileSystem.documentDirectory}modelos/`;
const ARQUIVO_MODELO = `${DIRETORIO_MODELOS}qwen2.5-1.5b-instruct-q4_k_m.gguf`;
const URL_MODELO =
  'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/dd26da440ef0330c47919d1ecae0966d24022222/qwen2.5-1.5b-instruct-q4_k_m.gguf?download=true';

let contexto;
let preparacao;
let tarefaDownload;

export async function verificarModeloBaixado() {
  const info = await FileSystem.getInfoAsync(ARQUIVO_MODELO);
  return info.exists && info.size === TAMANHO_MODELO;
}

async function prepararContexto(onProgress) {
  if (!SUPORTA_IA_LOCAL) {
    throw new Error('O modelo local n funciona no Expo Go. Use o guia offline.');
  }
  const { initLlama } = require('llama.rn');
  if (!FileSystem.documentDirectory) {
    throw new Error('O armazenamento local do aplicativo n está disponível.');
  }

  await FileSystem.makeDirectoryAsync(DIRETORIO_MODELOS, { intermediates: true });

  let info = await FileSystem.getInfoAsync(ARQUIVO_MODELO);
  if (info.exists && info.size !== TAMANHO_MODELO) {
    await FileSystem.deleteAsync(ARQUIVO_MODELO, { idempotent: true });
    info = { exists: false };
  }

  if (!info.exists) {
    const espacoLivre = await FileSystem.getFreeDiskStorageAsync();
    if (espacoLivre < TAMANHO_MODELO + 150 * 1024 * 1024) {
      throw new Error('Libere pelo menos 1,3 GB de espaço no aparelho e tente novamente.');
    }

    tarefaDownload = FileSystem.createDownloadResumable(
      URL_MODELO,
      ARQUIVO_MODELO,
      {},
      ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
        onProgress({
          etapa: 'download',
          baixado: totalBytesWritten,
          total: totalBytesExpectedToWrite || TAMANHO_MODELO
        });
      }
    );

    const resultado = await tarefaDownload.downloadAsync();
    tarefaDownload = null;
    if (!resultado) {
      throw new Error('DOWNLOAD_CANCELADO');
    }
    if (resultado.status < 200 || resultado.status >= 300) {
      throw new Error(`O download do modelo falhou (HTTP ${resultado.status}).`);
    }

    info = await FileSystem.getInfoAsync(ARQUIVO_MODELO);
    if (!info.exists || info.size !== TAMANHO_MODELO) {
      await FileSystem.deleteAsync(ARQUIVO_MODELO, { idempotent: true });
      throw new Error('O arquivo baixado está incompleto. Verifique a conex e tente novamente.');
    }
  }

  onProgress({ etapa: 'carregamento' });
  contexto = await initLlama({
    model: ARQUIVO_MODELO,
    n_ctx: 2048,
    n_batch: 256,
    n_threads: 4,
    n_gpu_layers: 99,
    use_mlock: false
  });
  return contexto;
}

export async function prepararMentor(onProgress = () => {}) {
  if (contexto) return contexto;
  if (!preparacao) {
    preparacao = prepararContexto(onProgress);
  }

  try {
    return await preparacao;
  } catch (erro) {
    contexto = undefined;
    throw erro;
  } finally {
    preparacao = undefined;
  }
}

export async function cancelarDownloadMentor() {
  if (tarefaDownload) {
    await tarefaDownload.cancelAsync();
  }
}

export async function responderMentor(mentor, mensagens, onToken = () => {}) {
  if (!contexto) {
    throw new Error('Carregue o modelo antes de iniciar uma conversa.');
  }

  const nome = mentor === 'jose' ? 'Chef José' : 'Chef Ana';
  const estilo = mentor === 'jose'
    ? 'Tenha um jeito descontraído e prático, valorizando sabores brasileiros e adaptações com ingredientes acessíveis.'
    : 'Tenha um jeito acolhedor e paciente, explicando o preparo em etapas simples e incentivando quem está aprendendo.';
  const historico = mensagens
    .filter(mensagem => mensagem.role === 'user' || mensagem.role === 'assistant')
    .slice(-10)
    .map(({ role, content }) => ({ role, content }));

  const resultado = await contexto.completion(
    {
      messages: [
        {
          role: 'system',
          content: `Você é ${nome}, mentor culinário do aplicativo Farofa Digital. ${estilo} Converse em português brasileiro correto, com simpatia e clareza. Ajude com receitas, ingredientes, técnicas de cozinha e cultura gastronômica. Dê respostas organizadas, com passos curtos e detalhes úteis, sem repetir a pergunta nem revelar raciocínio interno privado. Ao falar de segurança alimentar, seja prudente e recomende práticas seguras; nunca recomende lavar carnes cruas. Se n souber algo, diga isso claramente.`
        },
        ...historico
      ],
      n_predict: 192,
      temperature: 0.7,
      top_p: 0.9,
      stop: ['<|im_end|>', '<|endoftext|>']
    },
    ({ token }) => onToken(token)
  );

  return resultado.text.trim();
}

export const TAMANHO_MODELO_BYTES = TAMANHO_MODELO;
