interface JobSection {
  title: string;
  html: string;
}

const HEADING_RE = /<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi;

function plain(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split a job description into sections using the posting's own headings,
 * so the detail screen organizes content instead of dumping raw HTML.
 * Content before the first heading becomes "Overview". Falls back to a single
 * "Description" section when there are no headings.
 */
export function parseSections(html: string): JobSection[] {
  if (!html.trim()) return [];

  const headings: { title: string; start: number; contentStart: number }[] = [];
  let m: RegExpExecArray | null;
  HEADING_RE.lastIndex = 0;
  while ((m = HEADING_RE.exec(html))) {
    headings.push({
      title: plain(m[1]) || 'Section',
      start: m.index,
      contentStart: m.index + m[0].length,
    });
  }

  if (headings.length === 0) return [{ title: 'Description', html }];

  const sections: JobSection[] = [];
  const intro = html.slice(0, headings[0].start).trim();
  if (plain(intro).length > 0) sections.push({ title: 'Overview', html: intro });

  headings.forEach((h, i) => {
    const end = i + 1 < headings.length ? headings[i + 1].start : html.length;
    const body = html.slice(h.contentStart, end).trim();
    if (plain(body).length > 0) sections.push({ title: h.title, html: body });
  });

  return sections.length > 0 ? sections : [{ title: 'Description', html }];
}
