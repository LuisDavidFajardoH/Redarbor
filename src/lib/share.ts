import { Share } from 'react-native';

import type { Job } from '@/types/job';

/** Share a job with a clean, formatted message (used across card, sheet, detail). */
export function shareJob(job: Job): Promise<unknown> {
  return Share.share({
    message: `🚀 ${job.title}\n\nCompany: ${job.company_name}\nLocation: ${job.candidate_required_location || 'Worldwide'}\n\nApply:\n${job.url}`,
  });
}
