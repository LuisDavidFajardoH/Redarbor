import { fetchJson } from '@/lib/http';
import {
  categoriesResponseSchema,
  jobsResponseSchema,
  type Category,
  type Job,
} from '@/types/job';

const BASE_URL = 'https://remotive.com/api/remote-jobs';

export interface JobsParams {
  search?: string;
  category?: string;
  limit?: number;
}

function buildQuery(params: JobsParams): string {
  const qs = new URLSearchParams();
  if (params.search?.trim()) qs.set('search', params.search.trim());
  if (params.category) qs.set('category', params.category);
  if (params.limit) qs.set('limit', String(params.limit));
  const s = qs.toString();
  return s ? `?${s}` : '';
}

/** Fetch remote jobs, optionally filtered by search term and category slug. */
export async function fetchJobs(params: JobsParams = {}): Promise<Job[]> {
  const data = await fetchJson(`${BASE_URL}${buildQuery(params)}`);
  return jobsResponseSchema.parse(data).jobs;
}

/** Fetch the list of job categories used to populate filters. */
export async function fetchCategories(): Promise<Category[]> {
  const data = await fetchJson(`${BASE_URL}/categories`);
  return categoriesResponseSchema.parse(data).jobs;
}
