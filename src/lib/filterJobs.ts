import type { JobFilters } from '@/types/filters';
import type { Job } from '@/types/job';

/**
 * Apply category / employment-type / location filters and sort by date.
 * Pure & framework-free so it can be unit-tested in isolation. Search is
 * handled separately (fuzzy) before this runs.
 */
export function filterAndSortJobs(jobs: Job[], filters: JobFilters): Job[] {
  let list = jobs;
  if (filters.category) list = list.filter((j) => j.category === filters.category);
  if (filters.employmentType) list = list.filter((j) => j.job_type === filters.employmentType);
  if (filters.location) {
    list = list.filter((j) => j.candidate_required_location === filters.location);
  }
  return [...list].sort((a, b) => {
    const da = new Date(a.publication_date).getTime();
    const db = new Date(b.publication_date).getTime();
    return filters.sort === 'oldest' ? da - db : db - da;
  });
}
