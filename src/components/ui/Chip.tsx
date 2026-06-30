import { Pressable, Text } from 'react-native';

import { cn } from '@/lib/cn';

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

/** Selectable pill used by filters and sort controls. */
export function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      className={cn(
        'rounded-full border px-4 py-2.5 active:opacity-80',
        active ? 'border-accent bg-accent' : 'border-border bg-surface-elevated',
      )}>
      <Text className={cn('text-[14px] font-semibold', active ? 'text-white' : 'text-faint')}>
        {label}
      </Text>
    </Pressable>
  );
}
