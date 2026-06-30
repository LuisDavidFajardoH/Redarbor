import { SearchX, WifiOff } from 'lucide-react-native';
import { MotiView } from 'moti';
import { ActivityIndicator, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { useColors } from '@/theme/tokens';

type Kind = 'loading' | 'error' | 'empty';

interface StateViewProps {
  kind: Kind;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const DEFAULTS: Record<Kind, { title: string; message: string }> = {
  loading: { title: 'Cargando…', message: 'Obteniendo empleos remotos.' },
  error: { title: 'Algo salió mal', message: 'No se pudieron cargar los empleos. Revisa tu conexión.' },
  empty: { title: 'Sin empleos', message: 'Ningún empleo coincide con tu búsqueda.' },
};

export function StateView({ kind, title, message, onRetry }: StateViewProps) {
  const fallback = DEFAULTS[kind];
  const colors = useColors();

  return (
    <View className="flex-1 items-center justify-center gap-4 px-8 pb-24" accessibilityRole="summary">
      {kind === 'loading' ? (
        <View className="h-20 w-20 items-center justify-center rounded-full bg-surface">
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <MotiView
          from={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 300 }}
          className="items-center justify-center"
          style={{
            height: 88,
            width: 88,
            borderRadius: 44,
            backgroundColor: kind === 'error' ? '#E85A4F20' : colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {kind === 'error' ? (
            <WifiOff size={36} color="#E85A4F" />
          ) : (
            <SearchX size={36} color={colors.faint} />
          )}
        </MotiView>
      )}

      <View className="gap-1.5">
        <Text className="text-center text-[18px] font-bold text-foreground">
          {title ?? fallback.title}
        </Text>
        <Text className="text-center text-[14px] leading-relaxed text-muted">
          {message ?? fallback.message}
        </Text>
      </View>

      {kind === 'error' && onRetry ? (
        <Button title="Reintentar" onPress={onRetry} className="mt-1 px-8" />
      ) : null}
    </View>
  );
}
