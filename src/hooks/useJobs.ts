import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchCategories, fetchJobs, type JobsParams } from '@/api/remotive';
import { useFavoritesStore } from '@/store/favoritesStore';
import type { Category, Job } from '@/types/job';

// Remotive blocks >2 requests/min and recommends ~4/day with 24h-delayed data,
// so we cache aggressively and avoid background refetches.
const SIX_HOURS = 6 * 60 * 60 * 1000;

/** Server-state for the jobs list (cache + retry; refetch only on pull-to-refresh). */
export function useJobs(params: JobsParams) {
  return useQuery<Job[], Error>({
    queryKey: ['jobs', params],
    queryFn: () => fetchJobs(params),
    staleTime: SIX_HOURS,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity,
    retry: 1,
  });
}

/**
 * Resolve a single job by id. Remotive has no per-job endpoint, so we look in
 * (1) the favorites store, (2) any cached jobs list, and only then (3) fetch.
 */
export function useJobById(id: number) {
  const queryClient = useQueryClient();
  const fromFavorites = useFavoritesStore((s) => s.favorites[id]?.job);

  return useQuery<Job | undefined, Error>({
    queryKey: ['job', id],
    initialData: () => {
      if (fromFavorites) return fromFavorites;
      const cached = queryClient.getQueriesData<Job[]>({ queryKey: ['jobs'] });
      for (const [, list] of cached) {
        const found = list?.find((j) => j.id === id);
        if (found) return found;
      }
      return undefined;
    },
    queryFn: async () => {
      const jobs = await fetchJobs({ limit: 200 });
      return jobs.find((j) => j.id === id);
    },
    staleTime: SIX_HOURS,
    retry: 1,
  });
}
