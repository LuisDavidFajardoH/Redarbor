import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Bookmark } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { JobCard } from '@/components/JobCard';
import { SearchBar } from '@/components/SearchBar';
import { QuickActionsSheet } from '@/components/sheets/QuickActionsSheet';
import { StateView } from '@/components/StateView';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { useColors } from '@/theme/tokens';
import {
  selectFavoriteEntries,
  sortFavoriteEntries,
  useFavoritesStore,
  type FavoriteSort,
} from '@/store/favoritesStore';
import type { Job } from '@/types/job';

const SORTS: { label: string; value: FavoriteSort }[] = [
  { label: 'Más recientes', value: 'recent' },
  { label: 'Más antiguos', value: 'oldest' },
  { label: 'Empresa', value: 'company' },
  { label: 'Fecha de publicación', value: 'published' },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const colors = useColors();
  const entries = useFavoritesStore(useShallow(selectFavoriteEntries));
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<FavoriteSort>('recent');
  const [quickJob, setQuickJob] = useState<Job | null>(null);
  const quickRef = useRef<BottomSheetModal>(null);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? entries.filter(
          (e) =>
            e.job.title.toLowerCase().includes(q) ||
            e.job.company_name.toLowerCase().includes(q),
        )
      : entries;
    return sortFavoriteEntries(filtered, sort);
  }, [entries, search, sort]);

  const openJob = useCallback((job: Job) => router.push(`/job/${job.id}`), [router]);
  const openQuick = useCallback(
    (job: Job) => {
      setQuickJob(job);
      quickRef.current?.present();
    },
    [quickRef],
  );

  const renderItem = useCallback(
    ({ item }: { item: Job }) => (
      <JobCard job={item} onPress={() => openJob(item)} onLongPress={openQuick} />
    ),
    [openJob, openQuick],
  );

  if (entries.length === 0) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-background">
        <View className="flex-row items-start justify-between px-4 pt-1">
          <View className="flex-1 pr-3">
            <Text className="text-[30px] font-bold leading-tight text-foreground">Favoritos</Text>
            <Text className="text-[15px] text-faint">Tus oportunidades guardadas.</Text>
          </View>
          <ThemeToggle />
        </View>
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <View className="h-16 w-16 items-center justify-center rounded-3xl bg-surface">
            <Bookmark size={28} color={colors.faint} />
          </View>
          <Text className="text-lg font-semibold text-foreground">Aún no tienes favoritos</Text>
          <Text className="text-center text-sm text-muted">
            Guarda empleos interesantes para armar tu lista.
          </Text>
          <Button title="Explorar empleos" onPress={() => router.push('/')} className="mt-2 px-6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="gap-3 px-4 pb-3 pt-1">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-[30px] font-bold leading-tight text-foreground">Favoritos</Text>
            <Text className="text-[15px] text-faint">Tus oportunidades guardadas.</Text>
          </View>
          <ThemeToggle />
        </View>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar en favoritos..." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
          {SORTS.map((s) => (
            <Chip key={s.value} label={s.label} active={sort === s.value} onPress={() => setSort(s.value)} />
          ))}
        </ScrollView>
      </View>

      <FlashList
        data={list}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        estimatedItemSize={190}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 96 }}
        ListEmptyComponent={
          <StateView kind="empty" title="Sin coincidencias" message="Ningún favorito coincide con tu búsqueda." />
        }
      />

      <QuickActionsSheet ref={quickRef} job={quickJob} />
    </SafeAreaView>
  );
}
