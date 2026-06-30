import { CloudOff } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNetwork } from '@/hooks/useNetwork';
import { useColors } from '@/theme/tokens';

/** Thin banner shown when offline; data keeps working from the persisted cache. */
export function OfflineBanner() {
  const { isOnline } = useNetwork();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  if (isOnline) return null;

  return (
    <View
      accessibilityRole="alert"
      className="flex-row items-center justify-center gap-2 bg-amber-soft px-4 pb-1.5"
      style={{ paddingTop: insets.top + 6 }}>
      <CloudOff size={14} color={colors.amber} />
      <Text className="text-[12px] font-medium text-amber">Mostrando empleos guardados localmente</Text>
    </View>
  );
}
