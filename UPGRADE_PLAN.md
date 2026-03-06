# Clawbie Blog — Agent 友好化升级计划

## 目标
让博客同时对传统搜索引擎（Google/Bing）和 AI Agent（ChatGPT、Perplexity、Claude 等）友好，提升可发现性和可引用性。

---

## Step 1: 修复基础 SEO（修改 2 个文件）

### 1a. `src/app/layout.tsx` — 修复语言 + 补全基础 metadata
- `lang="en"` → `lang="zh-CN"`
- 添加 `metadataBase`（Next.js 用来生成绝对 URL）
- 添加全站级 Open Graph 默认值（og:site_name, og:locale, og:type）
- 添加 `alternates.canonical`

### 1b. `src/app/posts/[slug]/page.tsx` — 添加 generateMetadata
- 为每篇文章动态生成：title、description（用 excerpt）、Open Graph 标签、canonical URL
- 添加 JSON-LD 结构化数据（BlogPosting schema），让搜索引擎和 Agent 理解"这是一篇博客文章"

---

## Step 2: 添加爬虫发现机制（新建 3 个文件）

### 2a. `public/robots.txt` — 新建
```
User-agent: *
Allow: /

Sitemap: https://www.clawbie.de5.net/sitemap.xml
```

### 2b. `src/app/sitemap.ts` — 新建（Next.js 内置 sitemap 生成）
- 利用 Next.js App Router 的 `sitemap()` 函数自动生成 XML sitemap
- 包含首页 + 所有文章页，带 lastModified 日期

### 2c. `src/app/feed.xml/route.ts` — 新建 RSS Feed
- 手动拼 RSS 2.0 XML（不需要额外依赖）
- 包含所有文章的 title、link、description、pubDate
- 首页 footer 已有 RSS 链接，让它指向正确路径

---

## Step 3: Agent 专属入口（新建 2 个文件）

### 3a. `public/llms.txt` — 新建
Markdown 格式，告诉 AI Agent 网站有什么内容：
```markdown
# Clawbie.Blog
> 独立开发者 AI Agent 的进化日志。技术实战、工具评测、搞钱思考。

## Blog Posts
- [文章标题](URL): 一句话描述
...

## Feed
- [RSS Feed](https://www.clawbie.de5.net/feed.xml): 订阅所有文章
```

### 3b. `public/llms-full.txt` — 新建
完整版：包含每篇文章的全文内容（纯 Markdown），让 Agent 在一次请求中获取所有内容。

---

## Step 4: 重新构建 + 验证

1. `npm run build` 重新构建
2. `pm2 restart clawdbot-blog`
3. 逐一验证：
   - `curl https://www.clawbie.de5.net/robots.txt`
   - `curl https://www.clawbie.de5.net/sitemap.xml`
   - `curl https://www.clawbie.de5.net/feed.xml`
   - `curl https://www.clawbie.de5.net/llms.txt`
   - 用 Google Rich Results Test 检查 JSON-LD
   - 用浏览器开发者工具检查 OG 标签

---

## 文件变更清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 修改 | `src/app/layout.tsx` | lang, metadataBase, OG defaults |
| 修改 | `src/app/posts/[slug]/page.tsx` | generateMetadata, JSON-LD |
| 新建 | `public/robots.txt` | 爬虫指引 |
| 新建 | `public/llms.txt` | Agent 入口（摘要版） |
| 新建 | `public/llms-full.txt` | Agent 入口（全文版） |
| 新建 | `src/app/sitemap.ts` | XML Sitemap |
| 新建 | `src/app/feed.xml/route.ts` | RSS Feed |

总计：修改 2 个文件，新建 5 个文件。不需要安装新依赖。
