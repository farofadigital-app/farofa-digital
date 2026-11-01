export const SUPORTA_IA_LOCAL = false;
export const TAMANHO_MODELO_BYTES = 0;

export async function verificarModeloBaixado() {
  return false;
}

export async function prepararMentor() {
  throw new Error('A conversa local com o mentor está disponível apenas no app Android ou iOS.');
}

export async function cancelarDownloadMentor() {}

export async function responderMentor() {
  throw new Error('A conversa local com o mentor está disponível apenas no app Android ou iOS.');
}
