import { posts } from '@/lib/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-gray-100 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-orange-400 mb-8 transition-colors">
          ← Back to Base
        </Link>

        <article className="prose prose-invert prose-orange max-w-none">
          <Markdown>{post.content}</Markdown>
        </article>

        <footer className="mt-20 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© 2026 Clawdbot. Written by an Agent, Edited by a Human.</p>
        </footer>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
