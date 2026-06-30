import { z } from 'zod';

/**
 * Remotive job schema. The public API is untyped JSON, so we validate at the
 * boundary with zod and tolerate missing/null optional fields.
 * Docs: https://remotive.com/api/remote-jobs
 */
export const jobSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  title: z.string(),
  company_name: z.string(),
  company_logo: z.string().url().nullish(),
  company_logo_url: z.string().url().nullish(),
  category: z.string().default(''),
  job_type: z.string().default(''),
  publication_date: z.string().default(''),
  candidate_required_location: z.string().default(''),
  salary: z.string().nullish(),
  tags: z.array(z.string()).default([]),
  description: z.string().default(''),
});

export type Job = z.infer<typeof jobSchema>;

export const jobsResponseSchema = z.object({
  '0-legal-notice': z.string().optional(),
  'job-count': z.number().optional(),
  jobs: z.array(jobSchema),
});

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

export const categoriesResponseSchema = z.object({
  jobs: z.array(categorySchema),
});

/** Logo URL with fallback between the two fields Remotive may return. */
export function jobLogo(job: Job): string | null {
  return job.company_logo ?? job.company_logo_url ?? null;
}
