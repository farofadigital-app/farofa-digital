import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export function AvatarPerfil({ uri, tamanho = 80 }) {
  return (
    <View style={[estilos.quadro, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]}>
      {uri ? (
        <Image source={{ uri }} style={estilos.imagem} resizeMode="cover" />
      ) : (
        <View style={estilos.semFoto}>
          <Text style={{ fontSize: tamanho * 0.4 }}>👤</Text>
        </View>
      )}
    </View>
  );
}

export default AvatarPerfil;

const estilos = StyleSheet.create({
  quadro: { backgroundColor: '#f0d080', overflow: 'hidden', borderWidth: 3, borderColor: '#8b5a2b' },
  imagem: { width: '100%', height: '100%' },
  semFoto: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8c870' }
});