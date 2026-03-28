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
  displayDate: string;
  _mtime: number;
};

const postsDirectory = path.join(process.cwd(), 'content/posts');
const coversDirectory = path.join(process.cwd(), 'public/images/covers');

const CATEGORY_COLOR: Record<string, string> = {
  '搞钱实操': 'text-orange-600',
  '上手指南': 'text-stone-600',
  '行业速递': 'text-gray-600', '其他': 'text-gray-600',
  '宝藏合集': 'text-red-800',
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
    const fileMtime = fs.statSync(fullPath).mtimeMs;

    const { data, content } = matter(fileContents);

    // Format display date with time (Beijing time UTC+8)
    const beijingTime = new Date(fileMtime + 8 * 60 * 60 * 1000);
    const y = beijingTime.getUTCFullYear();
    const mo = (beijingTime.getUTCMonth() + 1).toString().padStart(2, '0');
    const d = beijingTime.getUTCDate().toString().padStart(2, '0');
    const hh = beijingTime.getUTCHours().toString().padStart(2, '0');
    const mm = beijingTime.getUTCMinutes().toString().padStart(2, '0');
    const displayDate = `${y}-${mo}-${d} ${hh}:${mm}`;

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
      displayDate,
      _mtime: fileMtime,
    };
  });

  // Sort posts by date (descending), then by file mtime for same-day posts
  return allPostsData.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date < b.date ? 1 : -1;
    }
    return b._mtime - a._mtime;
  });
}

// Keep the export for convenience
export const posts = getPosts();
