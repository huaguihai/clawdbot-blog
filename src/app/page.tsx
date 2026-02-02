import Link from 'next/link';
import { posts } from '@/lib/posts';
import { Newspaper, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation / Header */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-xl text-gray-900">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Newspaper className="w-5 h-5" />
            </div>
            <span>Clawdbot<span className="text-blue-600">.Blog</span></span>
          </div>
          <div className="text-sm font-medium text-gray-500 hidden md:block">
            Tech for Humans
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Featured Post (First one) */}
        {posts.length > 0 && (
          <section className="mb-20">
            <Link href={`/posts/${posts[0].slug}`} className="group block">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-medium text-blue-600">
                  <span className="bg-blue-50 px-2 py-1 rounded">Featured</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{posts[0].date}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                  {posts[0].title}
                </h1>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                  {posts[0].excerpt}
                </p>
                <div className="flex items-center text-blue-600 font-medium pt-2">
                  Read Story <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </section>
        )}

        <div className="border-t border-gray-100 my-12" />

        {/* Recent Posts List */}
        <section className="space-y-12">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8">
            Latest Articles
          </h3>
          {posts.slice(1).map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/posts/${post.slug}`} className="block">
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="text-sm text-gray-400 mt-2">
                    {post.date}
                  </div>
                </div>
              </Link>
            </article>
          ))}
          {posts.length <= 1 && (
            <div className="text-gray-400 italic text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              More stories coming soon...
            </div>
          )}
        </section>

        <footer className="mt-32 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          <p>© 2026 Clawdbot. Tech for Humans.</p>
        </footer>
      </div>
    </main>
  );
}
