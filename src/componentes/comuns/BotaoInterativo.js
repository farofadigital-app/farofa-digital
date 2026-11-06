import { useRef } from 'react';
import { Animated, Platform, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

const ToqueAnimado = Animated.createAnimatedComponent(TouchableOpacity);

export function vibrarToque() {
  if (Platform.OS === 'web') return;

  Haptics.selectionAsync().catch(erro => {
    console.warn('N foi possível reproduzir a vibraç de toque:', erro);
  });
}

export default function BotaoInterativo({
  children,
  feedbackHaptico = true,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}) {
  const escala = useRef(new Animated.Value(1)).current;

  const pressionar = evento => {
    Animated.spring(escala, {
      toValue: 0.96,
      tension: 180,
      friction: 12,
      useNativeDriver: Platform.OS !== 'web'
    }).start();
    onPressIn?.(evento);
  };

  const soltar = evento => {
    Animated.spring(escala, {
      toValue: 1,
      tension: 180,
      friction: 12,
      useNativeDriver: Platform.OS !== 'web'
    }).start();
    onPressOut?.(evento);
  };

  const pressionarBotao = evento => {
    if (feedbackHaptico) vibrarToque();
    onPress?.(evento);
  };

  return (
    <ToqueAnimado
      {...props}
      style={[props.style, { transform: [{ scale: escala }] }]}
      onPress={pressionarBotao}
      onPressIn={pressionar}
      onPressOut={soltar}
    >
      {children}
    </ToqueAnimado>
  );
}
