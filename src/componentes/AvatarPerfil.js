import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AvatarPerfil = ({ uri, aoPressionar, tamanho = 120 }) => {
  return (
    <TouchableOpacity onPress={aoPressionar} style={estilos.container}>
      {uri ? (
        <Image source={{ uri }} style={[estilos.imagem, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]} />
      ) : (
        <View style={[estilos.placeholder, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]}>
          <Text style={estilos.icone}>👤</Text>
          <Text style={estilos.texto}>Adicionar foto</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  container: {
    alignSelf: 'center'
  },
  imagem: {
    borderWidth: 4,
    borderColor: '#D4A574',
    backgroundColor: '#F5E6D3'
  },
  placeholder: {
    borderWidth: 4,
    borderColor: '#D4A574',
    backgroundColor: '#F5E6D3',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icone: {
    fontSize: 32
  },
  texto: {
    fontSize: 12,
    color: '#8B5A2B',
    marginTop: 4
  }
});

export default AvatarPerfil;
