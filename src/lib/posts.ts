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
  source?: string;
  sourceUrl?: string;
};

const postsDirectory = path.join(process.cwd(), 'content/posts');

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

    return {
      slug,
      content,
      title: data.title,
      date: data.date,
      category: data.category,
      excerpt: data.excerpt,
      pattern: data.pattern as PatternType,
      color: data.color,
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
