import { pratosPrincipais } from './pratosPrincipais';
import { salgados } from './salgados';
import { doces } from './doces';
import { acompanhamentos } from './acompanhamentos';
import { massas } from './massas';

export const todasReceitas = [
  ...pratosPrincipais,
  ...salgados,
  ...doces,
  ...acompanhamentos,
  ...massas,
];

export { pratosPrincipais, salgados, doces, acompanhamentos, massas };
export default todasReceitas;
