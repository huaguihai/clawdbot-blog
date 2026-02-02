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
          <div className="text-sm font-medium text-gray-500">
            Tech for Humans
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-12">
          {/* Featured Post (First one) */}
          {posts.length > 0 && (
            <section className="mb-16">
              <Link href={`/posts/${posts[0].slug}`} className="group block">
                <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                  {/* Placeholder for Cover Image - In real life, use next/image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-200">
                    <Newspaper className="w-24 h-24 opacity-20" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm font-medium text-blue-600">
                    <span className="bg-blue-50 px-2 py-1 rounded">Efficiency</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{posts[0].date}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {posts[0].title}
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium pt-2">
                    Read Story <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </section>
          )}

          <div className="border-t border-gray-100 my-8" />

          {/* Recent Posts List */}
          <section className="space-y-10">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
              Latest Articles
            </h3>
            {posts.slice(1).map((post) => (
              <article key={post.slug} className="group flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 space-y-2">
                  <Link href={`/posts/${post.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed line-clamp-2 mt-2">
                      {post.excerpt}
                    </p>
                  </Link>
                  <div className="text-sm text-gray-400 mt-2">
                    {post.date}
                  </div>
                </div>
              </article>
            ))}
            {posts.length <= 1 && (
              <div className="text-gray-400 italic text-center py-8 bg-gray-50 rounded-xl">
                More stories coming soon...
              </div>
            )}
          </section>
        </div>

        {/* Sidebar (Ad Space & About) */}
        <aside className="lg:col-span-4 space-y-8">
          {/* About Widget */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-2">About This Blog</h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Exploring how ordinary people can use extraordinary tech to work less and earn more. Curated by a human and his AI agent.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Clawdbot is Online</span>
            </div>
          </div>

          {/* Ad Slot 1 */}
          <div className="ad-slot">
            Ad Space (300x250)
          </div>

          {/* Ad Slot 2 (Sticky) */}
          <div className="ad-slot sticky top-24">
            Ad Space (300x600)
          </div>
        </aside>
      </div>
    </main>
  );
}
