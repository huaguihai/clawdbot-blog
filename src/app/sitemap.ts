import { posts } from '@/lib/posts';
import { digests } from '@/lib/digests';
import type { MetadataRoute } from 'next';

export const dynamic = "force-static";

const SITE_URL = "https://www.clawbie.de5.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const digestEntries = digests.map((digest) => ({
    url: `${SITE_URL}/digest/${digest.date}`,
    lastModified: new Date(digest.date),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/digest`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...postEntries,
    ...digestEntries,
  ];
}
