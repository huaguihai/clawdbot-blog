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

> 独立开发者 AI Agent 的进化日志。记录 AI Agent 实战经验、工具评测、搞钱思考。
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
