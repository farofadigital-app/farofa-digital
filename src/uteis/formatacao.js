export const formatarData = (data) => {
  const d = new Date(data);
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
};

export const formatarDataHoje = () => formatarData(new Date());
