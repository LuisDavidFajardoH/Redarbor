import { sampleJob } from '@/test/fixtures';

import { fetchCategories, fetchJobs } from './remotive';

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  });
}

describe('fetchJobs', () => {
  afterEach(() => jest.restoreAllMocks());

  it('parses a valid jobs response', async () => {
    mockFetchOnce({ jobs: [sampleJob] });
    const jobs = await fetchJobs();
    expect(jobs).toHaveLength(1);
    expect(jobs[0].title).toBe(sampleJob.title);
  });

  it('builds query params from search and category', async () => {
    mockFetchOnce({ jobs: [] });
    await fetchJobs({ search: 'react native', category: 'software-dev', limit: 10 });
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('search=react+native');
    expect(calledUrl).toContain('category=software-dev');
    expect(calledUrl).toContain('limit=10');
  });

  it('throws on invalid data (zod validation)', async () => {
    mockFetchOnce({ jobs: [{ id: 'oops' }] });
    await expect(fetchJobs()).rejects.toThrow();
  });

  it('throws HttpError on non-2xx', async () => {
    mockFetchOnce({}, false, 500);
    await expect(fetchJobs()).rejects.toThrow(/Request failed/);
  });
});

describe('fetchCategories', () => {
  afterEach(() => jest.restoreAllMocks());

  it('parses categories', async () => {
    mockFetchOnce({ jobs: [{ id: 1, name: 'Software Development', slug: 'software-dev' }] });
    const cats = await fetchCategories();
    expect(cats[0].slug).toBe('software-dev');
  });
});
