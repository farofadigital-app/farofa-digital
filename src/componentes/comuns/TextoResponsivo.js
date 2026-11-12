import React from 'react';
import { Text, TextInput, StyleSheet, useWindowDimensions } from 'react-native';

const LARGURA_REFERENCIA = 390;
const ESCALA_MINIMA = 0.9;
const ESCALA_MAXIMA = 1.18;

export function escalaFonte(base, largura) {
  if (typeof base !== 'number' || typeof largura !== 'number' || largura <= 0) {
    return base;
  }
  const fator = Math.min(ESCALA_MAXIMA, Math.max(ESCALA_MINIMA, largura / LARGURA_REFERENCIA));
  return base * fator;
}

function useEstiloResponsivo(estilo) {
  const { width } = useWindowDimensions();
  const fator = Math.min(ESCALA_MAXIMA, Math.max(ESCALA_MINIMA, (width || LARGURA_REFERENCIA) / LARGURA_REFERENCIA));
  const estiloPlano = StyleSheet.flatten(estilo);

  if (!estiloPlano) return estilo;
  return {
    ...estiloPlano,
    ...(typeof estiloPlano.fontSize === 'number'
      ? { fontSize: estiloPlano.fontSize * fator }
      : {}),
    ...(typeof estiloPlano.lineHeight === 'number'
      ? { lineHeight: estiloPlano.lineHeight * fator }
      : {})
  };
}

export function TextoResponsivo({ style, maxFontSizeMultiplier = 1.5, ...props }) {
  return (
    <Text
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...props}
      style={useEstiloResponsivo(style)}
    />
  );
}

export function CampoTextoResponsivo({ style, maxFontSizeMultiplier = 1.5, ...props }) {
  return (
    <TextInput
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...props}
      style={useEstiloResponsivo(style)}
    />
  );
}