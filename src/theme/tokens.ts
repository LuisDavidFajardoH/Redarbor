import { useThemeStore } from '@/store/themeStore';

/**
 * Raw color values for JS usage (icons, gradients, inline styles). NativeWind
 * class names handle most theming via CSS vars; these mirror them for the
 * places that need literal values. Use `useColors()` so they flip with the theme.
 */

// Brand colors — constant across light and dark.
const brand = {
  white: '#FFFFFF',
  accent: '#6366F1',
  accentSoft: '#6366F120',
  green: '#32D583',
  amber: '#FFB547',
  coral: '#E85A4F',
} as const;

export const darkColors = {
  background: '#0B0B0E',
  surface: '#16161A',
  surfaceElevated: '#1A1A1E',
  border: '#2A2A2E',
  borderStrong: '#3A3A40',
  foreground: '#FAFAF9',
  muted: '#6B6B70',
  faint: '#8E8E93',
  ...brand,
} as const;

export const lightColors = {
  background: '#FFFFFF',
  surface: '#F4F4F6',
  surfaceElevated: '#FFFFFF',
  border: '#E4E4E7',
  borderStrong: '#D4D4D8',
  foreground: '#18181B',
  muted: '#71717A',
  faint: '#52525B',
  ...brand,
} as const;

export type ThemeColors = Record<keyof typeof darkColors, string>;

/** Reactive colors that follow the active light/dark scheme. */
export function useColors(): ThemeColors {
  const scheme = useThemeStore((s) => s.scheme);
  return scheme === 'light' ? lightColors : darkColors;
}

export const duration = {
  fast: 200,
  base: 300,
  slow: 600,
} as const;

export const icon = {
  sm: 14,
  md: 18,
  lg: 22,
} as const;
