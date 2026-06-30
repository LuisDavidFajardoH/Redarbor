import '@/global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme as NavDark, DefaultTheme as NavLight, ThemeProvider } from '@react-navigation/native';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

import { OfflineBanner } from '@/components/OfflineBanner';
import { ThemeTransition } from '@/components/ThemeTransition';
import { useThemeStore } from '@/store/themeStore';
import { darkColors, lightColors } from '@/theme/tokens';

// Reanimated strict mode floods logs with "Reading from value during render"
// (triggered internally by moti); keep warnings but disable strict.
configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

const ONE_DAY = 1000 * 60 * 60 * 24;

// gcTime must outlive the persisted maxAge so cached jobs survive restarts.
const queryClient = new QueryClient({
  defaultOptions: { queries: { gcTime: ONE_DAY, staleTime: 1000 * 60 * 5, retry: 1 } },
});

const persister = createAsyncStoragePersister({ storage: AsyncStorage });

function navTheme(scheme: 'light' | 'dark') {
  const c = scheme === 'dark' ? darkColors : lightColors;
  const base = scheme === 'dark' ? NavDark : NavLight;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: c.background,
      card: c.surface,
      text: c.foreground,
      border: c.border,
      primary: c.accent,
    },
  };
}

export default function RootLayout() {
  const scheme = useThemeStore((s) => s.scheme);
  const bg = scheme === 'dark' ? darkColors.background : lightColors.background;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: bg }}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister, maxAge: ONE_DAY }}>
        <ThemeProvider value={navTheme(scheme)}>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          {/* `dark` class drives NativeWind darkMode:'class' (CSS var flip). */}
          <View className={scheme === 'dark' ? 'dark flex-1' : 'flex-1'}>
            <OfflineBanner />
            <BottomSheetModalProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="job/[id]" options={{ animation: 'slide_from_right' }} />
              </Stack>
            </BottomSheetModalProvider>
            <ThemeTransition />
          </View>
        </ThemeProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}
