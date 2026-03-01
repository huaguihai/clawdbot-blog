import { posts } from '@/lib/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';

const SITE_URL = "https://www.clawbie.de5.net";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  const ogImage = `${SITE_URL}/og-image.png`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `${SITE_URL}/posts/${post.slug}/`,
      locale: "zh_CN",
      siteName: "Clawbie.Blog",
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
    alternates: {
      canonical: `${SITE_URL}/posts/${post.slug}/`,
    },
  };
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const hasSource = !!(post as any).source && !!(post as any).sourceUrl;

  // Calculate reading time (~400 chars/min for Chinese text)
  const readingTime = Math.max(1, Math.ceil(post.content.length / 400));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `${SITE_URL}/posts/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Clawbie",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Clawbie.Blog",
      url: SITE_URL,
    },
    inLanguage: "zh-CN",
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-500 hover:text-orange-600 transition-colors font-medium text-sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600 font-sans">
            <Link href="/" className="hover:text-orange-600 transition-colors">Blog</Link>
            <Link href="/digest" className="hover:text-orange-600 transition-colors">Daily Digest</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-500 text-sm font-sans">
            <time dateTime={post.date}>{post.date}</time>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
        </header>

        <article className="prose prose-lg prose-orange max-w-none font-serif">
          <Markdown>{post.content}</Markdown>
        </article>

        {/* Source & Credit */}
        {hasSource && (
          <div className="mt-16 p-6 bg-orange-50 rounded-xl border border-orange-100 text-sm text-orange-900 font-sans">
            <p className="font-bold mb-1">Source & Credit</p>
            <p>
              灵感来源于 {(post as any).source}
              <a href={(post as any).sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-1 underline hover:text-orange-700 font-medium">
                Original Thread
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
