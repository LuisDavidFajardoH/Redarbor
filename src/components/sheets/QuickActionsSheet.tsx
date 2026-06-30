import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import * as WebBrowser from 'expo-web-browser';
import { ExternalLink, Heart, Share2, X, type LucideIcon } from 'lucide-react-native';
import { forwardRef, useCallback } from 'react';
import { Pressable, Text } from 'react-native';

import { shareJob } from '@/lib/share';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useColors } from '@/theme/tokens';
import type { Job } from '@/types/job';

interface QuickActionsSheetProps {
  job: Job | null;
}

function Row({
  icon: Icon,
  label,
  onPress,
  tint,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  tint?: string;
}) {
  const colors = useColors();
  const color = tint ?? colors.foreground;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-row items-center gap-3 rounded-2xl px-4 py-3.5 active:bg-surface-elevated">
      <Icon size={20} color={color} />
      <Text className="text-[16px] font-medium" style={{ color }}>
        {label}
      </Text>
    </Pressable>
  );
}

export const QuickActionsSheet = forwardRef<BottomSheetModal, QuickActionsSheetProps>(
  ({ job }, ref) => {
    const colors = useColors();
    const isFavorite = useFavoritesStore((s) => (job ? Boolean(s.favorites[job.id]) : false));
    const toggle = useFavoritesStore((s) => s.toggle);

    const dismiss = useCallback(() => {
      if (typeof ref === 'object' && ref?.current) ref.current.dismiss();
    }, [ref]);

    const renderBackdrop = useCallback(
      (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.6} />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.borderStrong }}>
        <BottomSheetView style={{ paddingHorizontal: 12, paddingBottom: 32 }}>
          {job ? (
            <>
              <Text numberOfLines={1} className="px-4 pb-2 pt-1 text-[15px] font-bold text-foreground">
                {job.title}
              </Text>
              <Row
                icon={Heart}
                label={isFavorite ? 'Quitar de favoritos' : 'Favorito'}
                tint={isFavorite ? colors.accent : colors.foreground}
                onPress={() => {
                  toggle(job);
                  dismiss();
                }}
              />
              <Row
                icon={Share2}
                label="Compartir"
                onPress={() => {
                  void shareJob(job);
                  dismiss();
                }}
              />
              <Row
                icon={ExternalLink}
                label="Postular"
                onPress={() => {
                  void WebBrowser.openBrowserAsync(job.url);
                  dismiss();
                }}
              />
              <Row icon={X} label="Cancelar" tint={colors.faint} onPress={dismiss} />
            </>
          ) : null}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

QuickActionsSheet.displayName = 'QuickActionsSheet';
