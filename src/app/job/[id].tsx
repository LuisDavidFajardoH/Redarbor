import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
  ArrowLeft,
  Banknote,
  Briefcase,
  CalendarDays,
  ExternalLink,
  MapPin,
  Share2,
  Tag,
  type LucideIcon,
} from 'lucide-react-native';
import { lazy, Suspense, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedHeart } from '@/components/AnimatedHeart';
import { StateView } from '@/components/StateView';
import { useJobById } from '@/hooks/useJobs';
import { formatShortAgo } from '@/lib/format';
import { parseSections } from '@/lib/sections';
import { shareJob } from '@/lib/share';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useThemeStore } from '@/store/themeStore';
import { icon, useColors } from '@/theme/tokens';
import { employmentLabel } from '@/types/filters';
import { jobLogo } from '@/types/job';

const HtmlContent = lazy(() =>
  import('@/components/HtmlContent').then((m) => ({ default: m.HtmlContent })),
);

const BANNER_HEIGHT = 210;

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: boolean;
}

function InfoCard({ icon: Icon, label, value, accent }: InfoCardProps) {
  const colors = useColors();
  return (
    <View className="w-[48%] gap-1.5 rounded-2xl border border-border bg-surface p-3.5">
      <View className="flex-row items-center gap-1.5">
        <Icon size={14} color={accent ? colors.green : colors.faint} />
        <Text className="text-[11px] font-semibold uppercase tracking-wide text-faint">{label}</Text>
      </View>
      <Text numberOfLines={2} className={accent ? 'text-[14px] font-bold text-green' : 'text-[14px] font-semibold text-foreground'}>
        {value}
      </Text>
    </View>
  );
}

export default function JobDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const isDark = useThemeStore((s) => s.scheme) === 'dark';
  const { id } = useLocalSearchParams<{ id: string }>();
  const jobId = Number(id);
  const { data: job, isLoading, isError, refetch } = useJobById(jobId);
  const isFavorite = useFavoritesStore((s) => Boolean(s.favorites[jobId]));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const sections = useMemo(() => (job ? parseSections(job.description) : []), [job]);

  if (isLoading) return <StateView kind="loading" />;
  if (isError || !job) return <StateView kind="error" onRetry={refetch} />;

  const logo = jobLogo(job);

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        {/* Header banner */}
        <View style={{ height: BANNER_HEIGHT, overflow: 'hidden' }}>
          <LinearGradient
            colors={
              isDark
                ? ['#6366F1', '#2A2A4A', colors.background]
                : ['#6366F1', '#A5B4FC', colors.background]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          />
        </View>

        {/* Hero (overlaps banner) */}
        <View className="items-center px-5" style={{ marginTop: -68 }}>
          {logo ? (
            <Image
              source={{ uri: logo }}
              contentFit="cover"
              transition={150}
              style={{
                width: 92,
                height: 92,
                borderRadius: 46,
                backgroundColor: colors.surfaceElevated,
                borderWidth: 3,
                borderColor: colors.border,
              }}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <View
              className="h-[92px] w-[92px] items-center justify-center rounded-full bg-accent-soft"
              style={{ borderWidth: 3, borderColor: colors.border }}>
              <Text className="text-3xl font-bold text-accent">{job.company_name.charAt(0)}</Text>
            </View>
          )}
          <Text className="mt-4 text-center text-[26px] font-bold leading-tight text-foreground">
            {job.title}
          </Text>
          <Text className="mt-1.5 text-[16px] font-medium text-faint">{job.company_name}</Text>
        </View>

        {/* Info grid */}
        <View className="mt-6 flex-row flex-wrap justify-between gap-y-3 px-5">
          <InfoCard icon={MapPin} label="Ubicación" value={job.candidate_required_location || 'En cualquier lugar'} />
          <InfoCard icon={Briefcase} label="Tipo" value={job.job_type ? employmentLabel(job.job_type) : 'N/D'} />
          {job.salary ? <InfoCard icon={Banknote} label="Salario" value={job.salary} accent /> : null}
          {job.category ? <InfoCard icon={Tag} label="Categoría" value={job.category} /> : null}
          <InfoCard icon={CalendarDays} label="Publicado" value={formatShortAgo(job.publication_date)} />
        </View>

        {/* Sections */}
        <View className="mt-6 gap-3 px-5">
          {sections.map((section, i) => (
            <View key={`${section.title}-${i}`} className="gap-2.5 rounded-2xl border border-border bg-surface p-4">
              <View className="flex-row items-center gap-2">
                <View className="h-4 w-1 rounded-full bg-accent" />
                <Text className="text-[16px] font-bold text-foreground">{section.title}</Text>
              </View>
              <Suspense
                fallback={
                  <View className="items-center py-6">
                    <ActivityIndicator size="small" color={colors.accent} />
                  </View>
                }>
                <HtmlContent html={section.html} />
              </Suspense>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed top bar over banner */}
      <View
        className="absolute left-0 right-0 flex-row items-center justify-between px-4"
        style={{ top: insets.top + 4 }}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          className="h-10 w-10 items-center justify-center rounded-full bg-black/30">
          <ArrowLeft size={20} color={colors.white} />
        </Pressable>
        <View className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-black/30">
            <AnimatedHeart
              active={isFavorite}
              onToggle={() => toggleFavorite(job)}
              inactiveColor={colors.white}
              activeColor={colors.coral}
            />
          </View>
          <Pressable
            onPress={() => shareJob(job)}
            accessibilityRole="button"
            accessibilityLabel="Compartir empleo"
            accessibilityHint="Abre la hoja de compartir con un resumen"
            className="h-10 w-10 items-center justify-center rounded-full bg-black/30">
            <Share2 size={18} color={colors.white} />
          </Pressable>
        </View>
      </View>

      {/* Sticky Apply */}
      <View className="absolute bottom-6 left-5 right-5">
        <Pressable
          onPress={() => WebBrowser.openBrowserAsync(job.url)}
          accessibilityRole="button"
          accessibilityLabel="Postular ahora, abre la oferta en tu navegador"
          className="h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-accent active:opacity-90"
          style={{
            shadowColor: colors.accent,
            shadowOpacity: 0.45,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 8 },
            elevation: 6,
          }}>
          <ExternalLink size={icon.md} color={colors.white} />
          <Text className="text-[16px] font-bold text-white">Postular ahora</Text>
        </Pressable>
      </View>
    </View>
  );
}
