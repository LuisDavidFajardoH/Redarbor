import { EMPTY_FILTERS } from '@/types/filters';
import { sampleJob } from '@/test/fixtures';
import type { Job } from '@/types/job';

import { filterAndSortJobs } from './filterJobs';

const make = (over: Partial<Job>): Job => ({ ...sampleJob, ...over });

const jobs: Job[] = [
  make({ id: 1, category: 'Software Development', job_type: 'full_time', candidate_required_location: 'USA', publication_date: '2026-06-01' }),
  make({ id: 2, category: 'Design', job_type: 'contract', candidate_required_location: 'Europe', publication_date: '2026-06-10' }),
  make({ id: 3, category: 'Software Development', job_type: 'contract', candidate_required_location: 'USA', publication_date: '2026-06-05' }),
];

describe('filterAndSortJobs', () => {
  it('sorts by most recent by default', () => {
    const r = filterAndSortJobs(jobs, EMPTY_FILTERS);
    expect(r.map((j) => j.id)).toEqual([2, 3, 1]);
  });

  it('sorts oldest first', () => {
    const r = filterAndSortJobs(jobs, { ...EMPTY_FILTERS, sort: 'oldest' });
    expect(r.map((j) => j.id)).toEqual([1, 3, 2]);
  });

  it('filters by category', () => {
    const r = filterAndSortJobs(jobs, { ...EMPTY_FILTERS, category: 'Design' });
    expect(r.map((j) => j.id)).toEqual([2]);
  });

  it('filters by employment type and location together', () => {
    const r = filterAndSortJobs(jobs, {
      ...EMPTY_FILTERS,
      employmentType: 'contract',
      location: 'USA',
    });
    expect(r.map((j) => j.id)).toEqual([3]);
  });
});
