import * as Haptics from 'expo-haptics';
import { Heart } from 'lucide-react-native';
import { MotiView } from 'moti';
import { Pressable } from 'react-native';

import { duration, icon, useColors } from '@/theme/tokens';

interface AnimatedHeartProps {
  active: boolean;
  onToggle: () => void;
  size?: number;
  /** Inactive outline color override (e.g. white over the detail banner). */
  inactiveColor?: string;
  /** Active (filled) color override (defaults to accent). */
  activeColor?: string;
}

/** Favorite toggle with a spring pop + subtle haptic. */
export function AnimatedHeart({
  active,
  onToggle,
  size = icon.lg,
  inactiveColor,
  activeColor,
}: AnimatedHeartProps) {
  const colors = useColors();
  const handle = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };
  const idle = inactiveColor ?? colors.muted;
  const on = activeColor ?? colors.accent;

  return (
    <Pressable
      onPress={handle}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={active ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      accessibilityHint="Guarda o quita este empleo de tus favoritos">
      <MotiView
        animate={{ scale: active ? [1, 1.35, 1] : 1 }}
        transition={{ type: 'timing', duration: duration.base }}>
        <Heart size={size} color={active ? on : idle} fill={active ? on : 'transparent'} />
      </MotiView>
    </Pressable>
  );
}
