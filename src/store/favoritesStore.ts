import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Job } from '@/types/job';

interface FavoriteEntry {
  job: Job;
  savedAt: number;
}

interface FavoritesState {
  /** Keyed by job id for O(1) lookup and de-duplication. */
  favorites: Record<number, FavoriteEntry>;
  add: (job: Job) => void;
  remove: (id: number) => void;
  toggle: (job: Job) => void;
  isFavorite: (id: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},
      add: (job) =>
        set((state) => ({
          favorites: { ...state.favorites, [job.id]: { job, savedAt: Date.now() } },
        })),
      remove: (id) =>
        set((state) => {
          const next = { ...state.favorites };
          delete next[id];
          return { favorites: next };
        }),
      toggle: (job) => (get().favorites[job.id] ? get().remove(job.id) : get().add(job)),
      isFavorite: (id) => Boolean(get().favorites[id]),
    }),
    {
      name: 'favorites-storage',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      // v1 stored raw Job objects; wrap them into entries.
      migrate: (persisted: unknown, version) => {
        if (version < 2 && persisted && typeof persisted === 'object') {
          const old = (persisted as { favorites?: Record<number, unknown> }).favorites ?? {};
          const favorites: Record<number, FavoriteEntry> = {};
          for (const [id, value] of Object.entries(old)) {
            const job = (value as FavoriteEntry).job ?? (value as Job);
            favorites[Number(id)] = { job: job as Job, savedAt: Date.now() };
          }
          return { favorites };
        }
        return persisted as FavoritesState;
      },
    },
  ),
);

export type FavoriteSort = 'recent' | 'oldest' | 'company' | 'published';

/** All favorited jobs, newest-saved first (default). */
export function selectFavoriteList(state: FavoritesState): Job[] {
  return Object.values(state.favorites)
    .sort((a, b) => b.savedAt - a.savedAt)
    .map((e) => e.job);
}

/** Raw favorite entries (with savedAt) for custom sorting. */
export function selectFavoriteEntries(state: FavoritesState): FavoriteEntry[] {
  return Object.values(state.favorites);
}

/** Favorite entries sorted by the chosen criterion (favorites screen). */
export function sortFavoriteEntries(entries: FavoriteEntry[], sort: FavoriteSort): Job[] {
  const copy = [...entries];
  switch (sort) {
    case 'oldest':
      copy.sort((a, b) => a.savedAt - b.savedAt);
      break;
    case 'company':
      copy.sort((a, b) => a.job.company_name.localeCompare(b.job.company_name));
      break;
    case 'published':
      copy.sort(
        (a, b) =>
          new Date(b.job.publication_date).getTime() - new Date(a.job.publication_date).getTime(),
      );
      break;
    case 'recent':
    default:
      copy.sort((a, b) => b.savedAt - a.savedAt);
  }
  return copy.map((e) => e.job);
}
