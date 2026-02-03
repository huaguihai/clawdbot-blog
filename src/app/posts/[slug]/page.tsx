import { posts } from '@/lib/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import { ChevronLeft } from 'lucide-react';

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Determine Source Credit based on metadata, fallback to generic if missing
  const sourceText = (post as any).source || 'Twitter 分享';
  const sourceUrl = (post as any).sourceUrl || 'https://x.com/bcherny/status/2017742741636321619';
  const sourceCredit = (post as any).source ? `灵感来源于 ${sourceText}` : '本文核心灵感来源于 Boris Cherny (Claude Code Creator) 的 Twitter 分享。';

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center text-gray-500 hover:text-orange-600 transition-colors font-medium text-sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
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
            <span>5 min read</span>
          </div>
        </header>

        <article className="prose prose-lg prose-orange max-w-none font-serif">
          <Markdown>{post.content}</Markdown>
        </article>

        {/* Source & Credit */}
        <div className="mt-16 p-6 bg-orange-50 rounded-xl border border-orange-100 text-sm text-orange-900 font-sans">
          <p className="font-bold mb-1">Source & Credit</p>
          <p>
            {sourceCredit}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-1 underline hover:text-orange-700 font-medium">
              Original Thread
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
