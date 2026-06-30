export type SortOrder = 'recent' | 'oldest';

export interface JobFilters {
  category: string | null; // slug
  categoryName: string | null; // display label for the summary
  employmentType: string | null; // job_type slug
  location: string | null; // substring matched against candidate_required_location
  locationName: string | null; // display label for the summary
  sort: SortOrder;
}

export const EMPTY_FILTERS: JobFilters = {
  category: null,
  categoryName: null,
  employmentType: null,
  location: null,
  locationName: null,
  sort: 'recent',
};

export const EMPLOYMENT_TYPES: { label: string; value: string | null }[] = [
  { label: 'Cualquiera', value: null },
  { label: 'Tiempo completo', value: 'full_time' },
  { label: 'Contrato', value: 'contract' },
  { label: 'Medio tiempo', value: 'part_time' },
  { label: 'Prácticas', value: 'internship' },
];

export const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: 'Más recientes', value: 'recent' },
  { label: 'Más antiguos', value: 'oldest' },
];

/** Spanish label for a Remotive job_type slug (used in cards and detail). */
export function employmentLabel(jobType: string): string {
  const map: Record<string, string> = {
    full_time: 'Tiempo completo',
    contract: 'Contrato',
    part_time: 'Medio tiempo',
    freelance: 'Freelance',
    internship: 'Prácticas',
    other: 'Otro',
  };
  return map[jobType] ?? jobType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Count of non-default filters (drives the "Filters (n)" badge). */
export function activeFilterCount(f: JobFilters): number {
  let n = 0;
  if (f.category) n += 1;
  if (f.employmentType) n += 1;
  if (f.location) n += 1;
  if (f.sort !== 'recent') n += 1;
  return n;
}

/** Human summary like "Software Development • Full Time". */
export function filterSummary(f: JobFilters): string {
  const parts: string[] = [];
  if (f.categoryName) parts.push(f.categoryName);
  if (f.employmentType) {
    parts.push(
      EMPLOYMENT_TYPES.find((t) => t.value === f.employmentType)?.label ?? f.employmentType,
    );
  }
  if (f.locationName) parts.push(f.locationName);
  if (f.sort === 'oldest') parts.push('Más antiguos');
  return parts.join(' • ');
}
