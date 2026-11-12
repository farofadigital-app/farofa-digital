export const formatarData = (data) => {
  const d = new Date(data);
  // Proteç: se a data for inválida, retorna vazio em vez de dar erro
  if (isNaN(d.getTime())) return '';
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
};

export const formatarDataHoje = (data = new Date()) => formatarData(data);

export const normalizarBusca = valor =>
  String(valor ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
