import type { Job } from '@/types/job';

export const sampleJob: Job = {
  id: 1,
  url: 'https://remotive.com/job/1',
  title: 'Senior React Native Engineer',
  company_name: 'Acme Inc',
  company_logo: 'https://example.com/logo.png',
  company_logo_url: null,
  category: 'Software Development',
  job_type: 'full_time',
  publication_date: '2026-06-20T10:00:00',
  candidate_required_location: 'Worldwide',
  salary: '$120k - $150k',
  tags: ['React Native', 'TypeScript', 'Redux'],
  description: '<p>Build <b>great</b> apps.</p><script>alert(1)</script>',
};

export const sampleJob2: Job = {
  ...sampleJob,
  id: 2,
  title: 'Backend Engineer',
  company_name: 'Globex',
  category: 'Software Development',
};
