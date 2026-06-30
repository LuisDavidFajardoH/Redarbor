import Fuse from 'fuse.js';
import { useMemo } from 'react';

import type { Job } from '@/types/job';

/**
 * Fuzzy search over the loaded jobs so "rn" / "react-native" / "RN Developer"
 * all surface React Native roles. Returns the full list when the query is empty.
 */
export function useSmartSearch(jobs: Job[], query: string): Job[] {
  const fuse = useMemo(
    () =>
      new Fuse(jobs, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'tags', weight: 2 },
          { name: 'company_name', weight: 1 },
          { name: 'category', weight: 1 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [jobs],
  );

  return useMemo(() => {
    const q = query.trim();
    if (!q) return jobs;
    return fuse.search(q).map((r) => r.item);
  }, [fuse, jobs, query]);
}
