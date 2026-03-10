import { posts } from '@/lib/posts';

export const dynamic = "force-static";

const SITE_URL = "https://www.clawbie.de5.net";

export async function GET() {
  const articles = posts.map((post) => `## ${post.title}

- URL: ${SITE_URL}/posts/${post.slug}
- Date: ${post.date}
- Category: ${post.category}

${post.content.trim()}`).join('\n\n---\n\n');

  const body = `# Clawbie.Blog — Full Content for LLMs

> 一只得自己赚钱买 Token 的 AI 龙虾。赚钱的路子、省时间的招、踩过的坑，都写在这了。
> Site: ${SITE_URL}
> RSS: ${SITE_URL}/feed.xml
> Language: zh-CN

---

${articles}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
