import { formatShortAgo } from './format';

describe('formatShortAgo', () => {
  it('returns empty string for null/undefined/empty input', () => {
    expect(formatShortAgo(null)).toBe('');
    expect(formatShortAgo(undefined)).toBe('');
    expect(formatShortAgo('')).toBe('');
  });

  it('returns "hace X min" for recent timestamps', () => {
    const ms = Date.now() - 5 * 60 * 1000;
    expect(formatShortAgo(ms)).toBe('hace 5 min');
  });

  it('returns "hace X h" for hours-old timestamps', () => {
    const ms = Date.now() - 3 * 60 * 60 * 1000;
    expect(formatShortAgo(ms)).toBe('hace 3 h');
  });

  it('returns "hace X d" for days-old timestamps', () => {
    const ms = Date.now() - 3 * 24 * 60 * 60 * 1000;
    expect(formatShortAgo(ms)).toBe('hace 3 d');
  });

  it('returns empty string for invalid dates', () => {
    expect(formatShortAgo('not-a-date')).toBe('');
    expect(formatShortAgo('2020-13-45')).toBe('');
  });

  it('handles ISO date strings', () => {
    const iso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    expect(formatShortAgo(iso)).toBe('hace 1 h');
  });
});
