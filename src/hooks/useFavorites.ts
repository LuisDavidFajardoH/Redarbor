import { useFavoritesStore } from '@/store/favoritesStore';
import type { Job } from '@/types/job';

/** Reactive favorite flag + toggle for a single job. */
export function useFavorite(job: Job) {
  const isFavorite = useFavoritesStore((s) => Boolean(s.favorites[job.id]));
  const toggle = useFavoritesStore((s) => s.toggle);
  return { isFavorite, toggle: () => toggle(job) };
}
