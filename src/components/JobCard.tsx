import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { BadgeCheck, Globe, Heart, HeartCrack, MapPin, Share2 } from 'lucide-react-native';
import { memo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';

import { AnimatedHeart } from '@/components/AnimatedHeart';
import { useFavorite } from '@/hooks/useFavorites';
import { formatShortAgo } from '@/lib/format';
import { shareJob } from '@/lib/share';
import { icon, useColors } from '@/theme/tokens';
import { employmentLabel } from '@/types/filters';
import { jobLogo, type Job } from '@/types/job';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onLongPress?: (job: Job) => void;
}

const BLUR_PLACEHOLDER = 'L6Pj0^jE.AyE_3t7t7R**0o#DgR4';

const logoStyle = { width: 56, height: 56, borderRadius: 16 } as const;

function SwipeAction({ side, isFavorite }: { side: 'favorite' | 'share'; isFavorite: boolean }) {
  const fav = side === 'favorite';
  const colors = useColors();

  if (!fav) {
    return (
      <View className="w-24 items-center justify-center gap-1 bg-surface-elevated">
        <Share2 size={icon.lg} color={colors.foreground} />
        <Text className="text-[11px] font-semibold text-faint">Compartir</Text>
      </View>
    );
  }

  // Favorite panel: red "Eliminar" + broken heart when already saved, else "Guardar".
  return (
    <View className={`w-24 items-center justify-center gap-1 ${isFavorite ? 'bg-coral' : 'bg-accent'}`}>
      {isFavorite ? (
        <HeartCrack size={icon.lg} color={colors.white} />
      ) : (
        <Heart size={icon.lg} color={colors.white} fill={colors.white} />
      )}
      <Text className="text-[11px] font-semibold text-white">
        {isFavorite ? 'Eliminar' : 'Guardar'}
      </Text>
    </View>
  );
}

// Margin lives on the Swipeable container (with clipping) so the action panels
// never peek out behind the card's rounded edges at rest.
const swipeContainer = {
  marginHorizontal: 16,
  marginBottom: 12,
  borderRadius: 20,
  overflow: 'hidden',
} as const;

function JobCardComponent({ job, onPress, onLongPress }: JobCardProps) {
  const { isFavorite, toggle } = useFavorite(job);
  const colors = useColors();
  const swipeRef = useRef<SwipeableMethods>(null);
  const logo = jobLogo(job);
  const location = job.candidate_required_location || 'Worldwide';
  const isWorldwide = /worldwide|anywhere/i.test(location);
  const tags = (job.tags ?? []).slice(0, 3);

  // 'left' = left panel (favorite), 'right' = right panel (share).
  const handleOpen = (direction: 'left' | 'right') => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (direction === 'left') toggle();
    else void shareJob(job);
    swipeRef.current?.close();
  };

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      friction={2}
      leftThreshold={64}
      rightThreshold={64}
      containerStyle={swipeContainer}
      renderLeftActions={() => <SwipeAction side="favorite" isFavorite={isFavorite} />}
      renderRightActions={() => <SwipeAction side="share" isFavorite={isFavorite} />}
      onSwipeableWillOpen={handleOpen}>
      <Pressable
        onPress={onPress}
        onLongPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onLongPress?.(job);
        }}
        delayLongPress={300}
        accessibilityRole="button"
        accessibilityLabel={`Empleo: ${job.title} en ${job.company_name}, ${isWorldwide ? 'en cualquier lugar' : location}`}
        accessibilityHint="Abre el detalle del empleo. Desliza a la derecha para guardar, a la izquierda para compartir."
        className="gap-3 rounded-[20px] border border-border bg-surface p-4">
        <View className="flex-row items-start gap-3.5">
          {logo ? (
            <Image
              source={{ uri: logo }}
              placeholder={BLUR_PLACEHOLDER}
              contentFit="contain"
              transition={150}
              style={logoStyle}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft">
              <Text className="text-xl font-bold text-accent">{job.company_name.charAt(0)}</Text>
            </View>
          )}

          <View className="flex-1 gap-1">
            <Text numberOfLines={2} className="text-[17px] font-bold leading-tight text-foreground">
              {job.title}
            </Text>
            <View className="flex-row items-center gap-1">
              <Text numberOfLines={1} className="text-[14px] text-faint">
                {job.company_name}
              </Text>
              <BadgeCheck size={icon.sm} color={colors.accent} fill="#6366F133" />
            </View>
            <View className="mt-0.5 flex-row items-center gap-1.5">
              {isWorldwide ? <Globe size={13} color={colors.muted} /> : <MapPin size={13} color={colors.muted} />}
              <Text numberOfLines={1} className="text-[12px] text-muted">
                {isWorldwide ? 'En cualquier lugar' : location}
              </Text>
              <Text className="text-[12px] text-muted">·</Text>
              <Text className="text-[12px] text-muted">{formatShortAgo(job.publication_date)}</Text>
            </View>
          </View>

          <AnimatedHeart active={isFavorite} onToggle={toggle} size={icon.lg} />
        </View>

        <View className="flex-row flex-wrap items-center gap-2">
          {job.job_type ? (
            <View className="rounded-lg border border-border bg-surface-elevated px-2.5 py-1">
              <Text className="text-[11px] font-medium text-faint">{employmentLabel(job.job_type)}</Text>
            </View>
          ) : null}
          {job.salary ? (
            <View className="rounded-lg bg-green-soft px-2.5 py-1">
              <Text numberOfLines={1} className="max-w-[120px] text-[11px] font-semibold text-green">
                💰 {job.salary}
              </Text>
            </View>
          ) : null}
          {tags.map((tag) => (
            <View key={tag} className="rounded-lg bg-accent-soft px-2.5 py-1">
              <Text className="text-[11px] font-medium text-accent">{tag}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    </ReanimatedSwipeable>
  );
}

export const JobCard = memo(JobCardComponent);
