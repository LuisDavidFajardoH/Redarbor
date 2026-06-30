import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { JobCard } from '@/components/JobCard';
import { SearchBar } from '@/components/SearchBar';
import { FiltersSheet } from '@/components/sheets/FiltersSheet';
import { QuickActionsSheet } from '@/components/sheets/QuickActionsSheet';
import { JobCardSkeleton } from '@/components/Skeleton';
import { StateView } from '@/components/StateView';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useDebounce } from '@/hooks/useDebounce';
import { useCategories, useJobs } from '@/hooks/useJobs';
import { useSmartSearch } from '@/hooks/useSmartSearch';
import { filterAndSortJobs } from '@/lib/filterJobs';
import { formatShortAgo } from '@/lib/format';
import { useColors } from '@/theme/tokens';
import { activeFilterCount, EMPTY_FILTERS, filterSummary, type JobFilters } from '@/types/filters';
import type { Job } from '@/types/job';

function updatedLabel(ts: number): string {
  if (!ts) return '';
  return Date.now() - ts < 60_000 ? 'ahora mismo' : formatShortAgo(ts);
}

export default function JobsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<JobFilters>(EMPTY_FILTERS);
  const [quickJob, setQuickJob] = useState<Job | null>(null);
  const debouncedSearch = useDebounce(search);

  const filtersRef = useRef<BottomSheetModal>(null);
  const quickRef = useRef<BottomSheetModal>(null);

  // One request returns the full active set; Remotive rate-limits hard, so we
  // fetch once and rely on the cache (no pagination — the API has no offset).
  const { data: jobs, isLoading, isError, refetch, isRefetching, dataUpdatedAt } = useJobs({
    limit: 200,
  });
  const { data: categories } = useCategories();

  const searched = useSmartSearch(jobs ?? [], debouncedSearch);

  // Distinct locations from loaded jobs, most common first.
  const locationOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const j of jobs ?? []) {
      const loc = j.candidate_required_location?.trim();
      if (loc) counts.set(loc, (counts.get(loc) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([loc]) => loc);
  }, [jobs]);

  const results = useMemo(() => filterAndSortJobs(searched, filters), [searched, filters]);

  const filterCount = activeFilterCount(filters);
  const summary = filterSummary(filters);

  const openJob = useCallback((job: Job) => router.push(`/job/${job.id}`), [router]);
  const openQuick = useCallback((job: Job) => {
    setQuickJob(job);
    quickRef.current?.present();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Job }) => (
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 200 }}>
        <JobCard job={item} onPress={() => openJob(item)} onLongPress={openQuick} />
      </MotiView>
    ),
    [openJob, openQuick],
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      {/* Fixed header */}
      <View className="gap-3 px-4 pb-3 pt-1">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-[30px] font-bold leading-tight text-foreground">Empleos Remotos</Text>
            <Text className="text-[15px] text-faint">Encuentra tu próxima oportunidad remota.</Text>
          </View>
          <ThemeToggle />
        </View>

        <View className="flex-row items-center gap-2.5">
          <View className="flex-1">
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar empleos o empresas..."
            />
          </View>
          <Pressable
            onPress={() => filtersRef.current?.present()}
            accessibilityRole="button"
            accessibilityLabel={filterCount > 0 ? `Filtros, ${filterCount} activos` : 'Filtros'}
            className="h-[52px] flex-row items-center gap-1.5 rounded-[18px] bg-accent px-4 active:opacity-80">
            <SlidersHorizontal size={18} color={colors.white} />
            <Text className="text-[14px] font-semibold text-white">
              Filtros{filterCount > 0 ? ` (${filterCount})` : ''}
            </Text>
          </Pressable>
        </View>

        {summary ? (
          <View className="flex-row items-center justify-between rounded-xl border border-border bg-surface px-3 py-2">
            <Text numberOfLines={1} className="flex-1 text-[13px] text-faint">
              {summary}
            </Text>
            <Pressable
              onPress={() => setFilters(EMPTY_FILTERS)}
              accessibilityRole="button"
              accessibilityLabel="Limpiar filtros"
              hitSlop={8}
              className="flex-row items-center gap-1">
              <X size={14} color={colors.faint} />
              <Text className="text-[13px] font-semibold text-faint">Limpiar</Text>
            </Pressable>
          </View>
        ) : null}

        {jobs ? (
          <View className="flex-row items-baseline justify-between">
            <Text className="text-[16px] font-bold text-foreground">
              {results.length} {results.length === 1 ? 'empleo' : 'empleos'}
            </Text>
            {dataUpdatedAt ? (
              <Text className="text-[12px] text-faint">Actualizado {updatedLabel(dataUpdatedAt)}</Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* List / states */}
      {isLoading && !jobs ? (
        <View className="pt-1">
          {[0, 1, 2, 3].map((i) => (
            <JobCardSkeleton key={i} />
          ))}
        </View>
      ) : isError && !jobs ? (
        <StateView kind="error" onRetry={refetch} />
      ) : (
        <FlashList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          estimatedItemSize={190}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 96 }}
          ListEmptyComponent={
            <StateView
              kind="empty"
              title="Sin empleos"
              message="Ningún empleo coincide con tu búsqueda."
              onRetry={isError ? refetch : undefined}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.accent}
              colors={[colors.accent]}
              progressBackgroundColor={colors.surface}
            />
          }
        />
      )}

      <FiltersSheet
        ref={filtersRef}
        categories={categories ?? []}
        locations={locationOptions}
        value={filters}
        onApply={setFilters}
      />
      <QuickActionsSheet ref={quickRef} job={quickJob} />
    </SafeAreaView>
  );
}
