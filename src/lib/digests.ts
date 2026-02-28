import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type Digest = {
  date: string;
  title: string;
  excerpt: string;
  content: string;
};

const digestsDirectory = path.join(process.cwd(), 'content/digest');

export function getDigests(): Digest[] {
  if (!fs.existsSync(digestsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(digestsDirectory).filter(f => f.endsWith('.md'));
  const allDigests = fileNames.map((fileName) => {
    const fullPath = path.join(digestsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      date: data.date || fileName.replace(/\.md$/, ''),
      title: data.title || `AI 日报 | ${data.date}`,
      excerpt: data.excerpt || '',
      content,
    };
  });

  return allDigests.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const digests = getDigests();
