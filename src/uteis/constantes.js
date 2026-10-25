import { Dimensions } from 'react-native';
import TEMA from '../../assets/tema.json';

export const { width: TELA_LARGURA, height: TELA_ALTURA } = Dimensions.get('window');
export const CORES = TEMA.cores;
export const ESP = TEMA.espacamento;
export const RAIO = TEMA.raioBorda;

export const BRASAS_DIARIAS = 10;
export const BRASAS_ACERTO_QUIZ = 15;
export const EXP_POR_ACERTO = 20;
