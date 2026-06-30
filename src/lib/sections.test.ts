import { parseSections } from './sections';

describe('parseSections', () => {
  it('returns a single Description when there are no headings', () => {
    const out = parseSections('<p>Just a paragraph.</p>');
    expect(out).toHaveLength(1);
    expect(out[0].title).toBe('Description');
  });

  it('splits by headings and labels intro as Overview', () => {
    const html =
      '<p>We are hiring.</p><h2>Requirements</h2><ul><li>React</li></ul><h2>Benefits</h2><p>Remote</p>';
    const out = parseSections(html);
    expect(out.map((s) => s.title)).toEqual(['Overview', 'Requirements', 'Benefits']);
    expect(out[1].html).toContain('React');
  });

  it('returns empty for empty input', () => {
    expect(parseSections('')).toEqual([]);
  });
});
