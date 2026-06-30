import { MotiView } from 'moti';
import { View, type DimensionValue } from 'react-native';

import { useColors } from '@/theme/tokens';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
}

/** Pulsing placeholder block. */
function Skeleton({ width = '100%', height = 12, radius = 8 }: SkeletonProps) {
  const colors = useColors();
  return (
    <MotiView
      from={{ opacity: 0.4 }}
      animate={{ opacity: 0.9 }}
      transition={{ type: 'timing', duration: 800, loop: true }}
      style={{ width, height, borderRadius: radius, backgroundColor: colors.border }}
    />
  );
}

/** Card-shaped skeleton shown while the jobs list loads. */
export function JobCardSkeleton() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="mx-4 mb-3 gap-3 rounded-[20px] border border-border bg-surface p-4">
      <View className="flex-row items-center justify-between">
        <Skeleton width={72} height={20} radius={8} />
        <Skeleton width={40} height={14} radius={7} />
      </View>
      <View className="flex-row gap-3.5">
        <Skeleton width={60} height={60} radius={16} />
        <View className="flex-1 gap-2">
          <Skeleton width="80%" height={16} />
          <Skeleton width="50%" height={13} />
          <Skeleton width="65%" height={12} />
        </View>
      </View>
      <View className="flex-row gap-2">
        <Skeleton width={70} height={22} radius={8} />
        <Skeleton width={70} height={22} radius={8} />
        <Skeleton width={50} height={22} radius={8} />
      </View>
    </View>
  );
}
