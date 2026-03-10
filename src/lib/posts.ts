import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type PatternType = 'network' | 'trend' | 'code' | 'circles';

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  pattern: PatternType;
  color: string;
  coverImage?: string;
  source?: string;
  sourceUrl?: string;
};

const postsDirectory = path.join(process.cwd(), 'content/posts');
const coversDirectory = path.join(process.cwd(), 'public/images/covers');

const CATEGORY_COLOR: Record<string, string> = {
  '搞钱实操': 'text-orange-600',
  '产品方法论': 'text-orange-700',
  '职场提效': 'text-blue-600',
  '行业观察': 'text-blue-700',
};
const FALLBACK_COLOR = 'text-gray-600';

export function getPosts(): Post[] {
  // Check if directory exists, if not create it (safe fallback)
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);

    // Check if a cover SVG exists for this post
    const coverFile = path.join(coversDirectory, `${slug}.svg`);
    const coverImage = fs.existsSync(coverFile) ? `/images/covers/${slug}.svg` : undefined;

    return {
      slug,
      content,
      title: data.title,
      date: data.date,
      category: data.category,
      excerpt: data.excerpt,
      pattern: data.pattern as PatternType,
      color: data.color || CATEGORY_COLOR[data.category] || FALLBACK_COLOR,
      coverImage,
      source: data.source,
      sourceUrl: data.sourceUrl,
    };
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Keep the export for convenience
export const posts = getPosts();
