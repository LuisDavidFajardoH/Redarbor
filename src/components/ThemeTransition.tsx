import { MotiView } from 'moti';
import { StyleSheet } from 'react-native';

import { useThemeStore } from '@/store/themeStore';
import { darkColors, lightColors } from '@/theme/tokens';

/**
 * Crossfade when switching theme: an overlay of the new background color fades
 * out, revealing the (already re-themed) UI underneath. Re-keyed by scheme so
 * it replays on every toggle. Non-interactive.
 */
export function ThemeTransition() {
  const scheme = useThemeStore((s) => s.scheme);
  const bg = scheme === 'dark' ? darkColors.background : lightColors.background;

  return (
    <MotiView
      key={scheme}
      pointerEvents="none"
      from={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 320 }}
      style={[StyleSheet.absoluteFill, { backgroundColor: bg, zIndex: 999 }]}
    />
  );
}
