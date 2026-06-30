import { Linking, Text, View } from 'react-native';

import { useThemeStore } from '@/store/themeStore';
import { useColors, type ThemeColors } from '@/theme/tokens';

interface HtmlContentProps {
  html: string;
}

/**
 * Minimal, dependency-free HTML renderer for Remotive job descriptions.
 * Replaces react-native-render-html (which triggers React 18.3 defaultProps
 * warnings). Only a safe subset of tags is interpreted; anything else is
 * stripped, so script/style/iframe content can never render (XSS-safe).
 */

function decodeEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&rsquo;|&lsquo;/g, '’')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripTags(input: string): string {
  return decodeEntities(input.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

const INLINE_RE =
  /<(a|strong|b|em|i|u)\b([^>]*)>([\s\S]*?)<\/\1>/i;

/** Render inline formatting (bold / italic / links) within a text fragment. */
function renderInline(html: string, keyPrefix: string, colors: ThemeColors): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let rest = html;
  let i = 0;

  while (rest.length > 0) {
    const m = INLINE_RE.exec(rest);
    if (!m) {
      const text = stripTags(rest);
      if (text) out.push(text);
      break;
    }
    const before = rest.slice(0, m.index);
    const beforeText = decodeEntities(before.replace(/<[^>]+>/g, ''));
    if (beforeText) out.push(beforeText);

    const tag = m[1].toLowerCase();
    const attrs = m[2];
    const inner = m[3];
    const key = `${keyPrefix}-${i++}`;

    if (tag === 'a') {
      const href = /href\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
      out.push(
        <Text
          key={key}
          onPress={href ? () => Linking.openURL(href) : undefined}
          style={{ color: colors.accent, textDecorationLine: 'underline' }}>
          {renderInline(inner, key, colors)}
        </Text>,
      );
    } else if (tag === 'strong' || tag === 'b') {
      out.push(
        <Text key={key} style={{ color: colors.foreground, fontWeight: '700' }}>
          {renderInline(inner, key, colors)}
        </Text>,
      );
    } else if (tag === 'u') {
      out.push(
        <Text key={key} style={{ textDecorationLine: 'underline' }}>
          {renderInline(inner, key, colors)}
        </Text>,
      );
    } else {
      out.push(
        <Text key={key} style={{ fontStyle: 'italic' }}>
          {renderInline(inner, key, colors)}
        </Text>,
      );
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}

interface Block {
  type: 'p' | 'h' | 'ul' | 'ol';
  level?: number;
  content?: string;
  items?: string[];
}

const BLOCK_RE = /<(h[1-3]|ul|ol|p)\b[^>]*>([\s\S]*?)<\/\1>/gi;

function parseBlocks(html: string): Block[] {
  const normalized = html.replace(/<br\s*\/?>/gi, '\n');
  const blocks: Block[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  const pushLoose = (chunk: string) => {
    const text = stripTags(chunk);
    if (text) blocks.push({ type: 'p', content: chunk });
  };

  BLOCK_RE.lastIndex = 0;
  while ((m = BLOCK_RE.exec(normalized))) {
    if (m.index > lastIndex) pushLoose(normalized.slice(lastIndex, m.index));
    const tag = m[1].toLowerCase();
    const inner = m[2];
    if (tag === 'ul' || tag === 'ol') {
      const items = [...inner.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((li) => li[1])
        .filter((t) => stripTags(t));
      if (items.length) blocks.push({ type: tag, items });
    } else if (tag[0] === 'h') {
      if (stripTags(inner)) blocks.push({ type: 'h', level: Number(tag[1]), content: inner });
    } else if (stripTags(inner)) {
      blocks.push({ type: 'p', content: inner });
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < normalized.length) pushLoose(normalized.slice(lastIndex));

  // No block tags at all → render the whole thing as one paragraph.
  if (blocks.length === 0 && stripTags(html)) blocks.push({ type: 'p', content: html });
  return blocks;
}

export function HtmlContent({ html }: HtmlContentProps) {
  const colors = useColors();
  const isDark = useThemeStore((s) => s.scheme) === 'dark';
  const body = isDark ? '#C7C7CC' : '#3F3F46';
  const blocks = parseBlocks(html);

  return (
    <View className="gap-3">
      {blocks.map((block, bi) => {
        if (block.type === 'h') {
          const size = block.level === 1 ? 19 : block.level === 2 ? 17 : 15;
          return (
            <Text key={bi} style={{ color: colors.foreground, fontSize: size, fontWeight: '700' }}>
              {renderInline(block.content ?? '', `h${bi}`, colors)}
            </Text>
          );
        }
        if (block.type === 'ul' || block.type === 'ol') {
          return (
            <View key={bi} className="gap-1.5">
              {block.items?.map((item, ii) => (
                <View key={ii} className="flex-row gap-2">
                  <Text style={{ color: colors.accent, fontSize: 15, lineHeight: 23 }}>
                    {block.type === 'ol' ? `${ii + 1}.` : '•'}
                  </Text>
                  <Text style={{ color: body, fontSize: 15, lineHeight: 23, flex: 1 }}>
                    {renderInline(item, `li${bi}-${ii}`, colors)}
                  </Text>
                </View>
              ))}
            </View>
          );
        }
        return (
          <Text key={bi} style={{ color: body, fontSize: 15.5, lineHeight: 24 }}>
            {renderInline(block.content ?? '', `p${bi}`, colors)}
          </Text>
        );
      })}
    </View>
  );
}
