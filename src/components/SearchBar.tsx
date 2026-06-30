import { Search, X } from 'lucide-react-native';
import { Pressable, TextInput, View } from 'react-native';

import { useColors } from '@/theme/tokens';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Buscar empleos…' }: SearchBarProps) {
  const colors = useColors();
  return (
    <View className="flex-row items-center gap-2.5 rounded-[18px] border border-accent-soft bg-surface-elevated px-3.5">
      <Search size={20} color={colors.accent} />
      <TextInput
        className="flex-1 py-3.5 text-[16px] text-foreground"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Buscar empleos"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
          hitSlop={8}>
          <X size={18} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}
