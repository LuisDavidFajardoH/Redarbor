import * as Haptics from 'expo-haptics';
import { Moon, Sun } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { useThemeStore } from '@/store/themeStore';
import { useColors } from '@/theme/tokens';

/** Subtle light/dark switch. Shows the icon of the mode you'll switch to. */
export function ThemeToggle() {
  const scheme = useThemeStore((s) => s.scheme);
  const toggle = useThemeStore((s) => s.toggle);
  const colors = useColors();
  const isDark = scheme === 'dark';

  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync();
        toggle();
      }}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface active:opacity-80">
      {isDark ? (
        <Sun size={20} color={colors.foreground} />
      ) : (
        <Moon size={20} color={colors.foreground} />
      )}
    </Pressable>
  );
}
