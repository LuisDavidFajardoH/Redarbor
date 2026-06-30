import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  type BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { Check, Search } from 'lucide-react-native';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { useColors } from '@/theme/tokens';
import type { Category } from '@/types/job';
import {
  EMPLOYMENT_TYPES,
  EMPTY_FILTERS,
  SORT_OPTIONS,
  type JobFilters,
  type SortOrder,
} from '@/types/filters';

interface FiltersSheetProps {
  categories: Category[];
  /** Distinct locations derived from the loaded jobs. */
  locations: string[];
  value: JobFilters;
  onApply: (filters: JobFilters) => void;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="mb-2 mt-5 text-[13px] font-semibold uppercase tracking-wide text-faint">
      {children}
    </Text>
  );
}

export const FiltersSheet = forwardRef<BottomSheetModal, FiltersSheetProps>(
  ({ categories, locations, value, onApply }, ref) => {
    const colors = useColors();
    const [draft, setDraft] = useState<JobFilters>(value);
    const [query, setQuery] = useState('');

    // Re-seed the draft from props whenever the sheet is opened.
    const handleChange = useCallback(
      (index: number) => {
        if (index >= 0) {
          setDraft(value);
          setQuery('');
        }
      },
      [value],
    );

    const filteredCategories = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return categories;
      return categories.filter((c) => c.name.toLowerCase().includes(q));
    }, [categories, query]);

    const dismiss = useCallback(() => {
      if (typeof ref === 'object' && ref?.current) ref.current.dismiss();
    }, [ref]);

    const renderBackdrop = useCallback(
      (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.6} />
      ),
      [],
    );

    // Sticky footer: rendered via gorhom's footerComponent so it never scrolls off.
    const renderFooter = useCallback(
      (props: BottomSheetFooterProps) => (
        <BottomSheetFooter {...props} bottomInset={0}>
          <View className="flex-row gap-3 border-t border-border bg-surface px-5 pb-8 pt-3">
            <Pressable
              onPress={() => setDraft(EMPTY_FILTERS)}
              accessibilityRole="button"
              accessibilityLabel="Restablecer filtros"
              className="flex-1 items-center rounded-2xl border border-border bg-surface-elevated py-3.5 active:opacity-80">
              <Text className="text-[15px] font-semibold text-faint">Restablecer</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onApply(draft);
                dismiss();
              }}
              accessibilityRole="button"
              accessibilityLabel="Aplicar filtros"
              className="flex-1 items-center rounded-2xl bg-accent py-3.5 active:opacity-80">
              <Text className="text-[15px] font-semibold text-white">Aplicar filtros</Text>
            </Pressable>
          </View>
        </BottomSheetFooter>
      ),
      [draft, onApply, dismiss],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['85%']}
        onChange={handleChange}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.borderStrong }}>
        <BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}>
          <Text className="text-[20px] font-bold text-foreground">Filtros</Text>

          <SectionTitle>Tipo de empleo</SectionTitle>
          <View className="flex-row flex-wrap gap-2">
            {EMPLOYMENT_TYPES.map((t) => (
              <Chip
                key={t.label}
                label={t.label}
                active={draft.employmentType === t.value}
                onPress={() => setDraft((d) => ({ ...d, employmentType: t.value }))}
              />
            ))}
          </View>

          <SectionTitle>Ubicación / Región</SectionTitle>
          <View className="flex-row flex-wrap gap-2">
            <Chip
              label="En cualquier lugar"
              active={draft.location === null}
              onPress={() => setDraft((d) => ({ ...d, location: null, locationName: null }))}
            />
            {locations.map((loc) => (
              <Chip
                key={loc}
                label={loc}
                active={draft.location === loc}
                onPress={() => setDraft((d) => ({ ...d, location: loc, locationName: loc }))}
              />
            ))}
          </View>

          <SectionTitle>Orden</SectionTitle>
          <View className="flex-row flex-wrap gap-2">
            {SORT_OPTIONS.map((s) => (
              <Chip
                key={s.value}
                label={s.label}
                active={draft.sort === s.value}
                onPress={() => setDraft((d) => ({ ...d, sort: s.value as SortOrder }))}
              />
            ))}
          </View>

          <SectionTitle>Categoría</SectionTitle>
          <View className="flex-row items-center gap-2 rounded-2xl border border-border bg-surface-elevated px-3.5">
            <Search size={18} color={colors.faint} />
            <BottomSheetTextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar categorías…"
              placeholderTextColor={colors.muted}
              style={{ flex: 1, paddingVertical: 12, fontSize: 15, color: colors.foreground }}
              accessibilityLabel="Buscar categorías"
            />
          </View>
          <View className="mt-2 gap-0.5">
            <Pressable
              onPress={() => setDraft((d) => ({ ...d, category: null, categoryName: null }))}
              className="flex-row items-center justify-between py-2.5"
              accessibilityRole="button"
              accessibilityLabel="Todas las categorías">
              <Text className={draft.category === null ? 'text-[15px] font-semibold text-accent' : 'text-[15px] text-foreground'}>
                Todas las categorías
              </Text>
              {draft.category === null ? <Check size={18} color={colors.accent} /> : null}
            </Pressable>
            {filteredCategories.map((c) => {
              const active = draft.category === c.slug;
              return (
                <Pressable
                  key={c.slug}
                  onPress={() => setDraft((d) => ({ ...d, category: c.slug, categoryName: c.name }))}
                  className="flex-row items-center justify-between py-2.5"
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={c.name}>
                  <Text className={active ? 'text-[15px] font-semibold text-accent' : 'text-[15px] text-foreground'}>
                    {c.name}
                  </Text>
                  {active ? <Check size={18} color={colors.accent} /> : null}
                </Pressable>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

FiltersSheet.displayName = 'FiltersSheet';
