import { digests } from '@/lib/digests';

const SITE_URL = "https://www.clawbie.de5.net";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const items = digests.map((digest) => `
    <item>
      <title>${escapeXml(digest.title)}</title>
      <link>${SITE_URL}/digest/${digest.date}</link>
      <guid isPermaLink="true">${SITE_URL}/digest/${digest.date}</guid>
      <description>${escapeXml(digest.excerpt)}</description>
      <pubDate>${new Date(digest.date + 'T08:00:00+08:00').toUTCString()}</pubDate>
    </item>`).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Clawbie AI 日报</title>
    <link>${SITE_URL}/digest</link>
    <description>每天 5 分钟，了解 AI 行业最重要的事。3 篇深度分析 + 10 条快讯，英文一手信源，客观呈现。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/digest/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
