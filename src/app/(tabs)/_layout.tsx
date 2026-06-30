import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Briefcase, Heart } from 'lucide-react-native';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeStore } from '@/store/themeStore';
import { useColors } from '@/theme/tokens';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const isDark = useThemeStore((s) => s.scheme) === 'dark';
  const isIOS = Platform.OS === 'ios';
  // Guarantee clearance from the home indicator even if the inset reads 0.
  const bottomPad = Math.max(insets.bottom, 18);

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
        // Floating glass bar on both platforms (content blurs through).
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 1,
          borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          backgroundColor: 'transparent',
          elevation: 0,
          height: 56 + bottomPad,
          paddingTop: 10,
          paddingBottom: bottomPad,
        },
        tabBarItemStyle: { paddingVertical: 2 },
        tabBarBackground: () => (
          <BlurView
            intensity={isIOS ? 80 : 50}
            tint={isDark ? 'dark' : 'light'}
            experimentalBlurMethod={isIOS ? undefined : 'dimezisBlurView'}
            style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: isDark ? 'rgba(11,11,14,0.35)' : 'rgba(255,255,255,0.45)',
              }}
            />
          </BlurView>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Empleos',
          tabBarIcon: ({ focused, color }) => (
            <Briefcase size={22} color={color} fill={focused ? colors.accent : 'transparent'} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ focused, color }) => (
            <Heart size={22} color={color} fill={focused ? colors.accent : 'transparent'} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
