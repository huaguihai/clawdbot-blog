import Link from 'next/link';
import { posts } from '@/lib/posts';
import { Newspaper, ChevronRight, Zap, TrendingUp, Search } from 'lucide-react';

export default function Home() {
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      
      {/* Editorial Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Zap className="w-5 h-5" fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-xl tracking-tight leading-none text-gray-900">CLAWDBOT</span>
              <span className="font-serif text-xs italic text-gray-500">The Human-AI Chronicle</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-10 text-sm font-sans font-medium text-gray-500 tracking-wide uppercase">
            <a href="#" className="hover:text-indigo-600 transition-colors">Money</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Work</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Tools</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden md:block px-5 py-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-indigo-600 transition-colors shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Magazine Hero Section */}
        {featuredPost && (
          <section className="mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Side (Dominant) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center space-x-2 border-b-2 border-indigo-600 pb-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Editor's Pick</span>
              </div>
              
              <Link href={`/posts/${featuredPost.slug}`} className="group block space-y-6">
                <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors duration-300">
                  {featuredPost.title}
                </h1>
                <p className="font-sans text-xl text-gray-500 leading-relaxed font-light border-l-4 border-gray-100 pl-6">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center pt-4">
                  <span className="text-sm font-bold text-indigo-600 flex items-center group-hover:underline underline-offset-4 decoration-2">
                    Read Full Story <ChevronRight className="w-4 h-4 ml-2" />
                  </span>
                </div>
              </Link>
            </div>

            {/* Visual Side (Abstract/Artistic) */}
            <div className="lg:col-span-5 relative h-[500px]">
              <div className={`absolute inset-0 bg-gradient-to-tr ${featuredPost.imageColor} rounded-2xl shadow-2xl rotate-3 transition-transform duration-500 hover:rotate-0 overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg">
                    <p className="font-serif italic text-gray-800 text-lg">
                      "AI 时代的贫富差距，不在于你用了什么模型，而在于你怎么用它。"
                    </p>
                    <div className="mt-4 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <div className="text-xs">
                        <p className="font-bold text-gray-900">Boris Cherny</p>
                        <p className="text-gray-500">Creator of Claude Code</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="border-t border-gray-200 mb-20"></div>

        {/* 3-Column Layout: Main Feed + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-16">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-sans text-2xl font-bold text-gray-900 tracking-tight">Latest Stories</h2>
              <span className="text-sm text-gray-400 font-serif italic">Curated by AI</span>
            </div>

            <div className="grid gap-12">
              {recentPosts.map((post) => (
                <article key={post.slug} className="group grid md:grid-cols-12 gap-8 items-start">
                  <div className={`md:col-span-4 aspect-[4/3] rounded-xl bg-gradient-to-br ${post.imageColor} shadow-md group-hover:shadow-xl transition-shadow duration-300 relative overflow-hidden`}>
                     {/* Placeholder for real image */}
                     <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span className="text-indigo-600">{post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <Link href={`/posts/${post.slug}`}>
                      <h3 className="font-serif text-2xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors mb-3">
                        {post.title}
                      </h3>
                      <p className="font-sans text-gray-500 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar (Functional) */}
          <aside className="lg:col-span-4 space-y-12">
            
            {/* Newsletter Box */}
            <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
              <h3 className="font-serif text-xl font-bold text-indigo-900 mb-2">Join the Inner Circle</h3>
              <p className="text-indigo-700/80 text-sm mb-6 leading-relaxed">
                每周一封搞钱实操指南。No spam, just signal.
              </p>
              <form className="space-y-3">
                <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button className="w-full px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-sm shadow-md">
                  Subscribe for Free
                </button>
              </form>
            </div>

            {/* Trending List */}
            <div>
              <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">Trending Now</h3>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer items-start">
                    <span className="text-4xl font-serif font-bold text-gray-200 -mt-2 group-hover:text-indigo-200 transition-colors">0{i}</span>
                    <div>
                      <h4 className="font-serif font-bold text-gray-900 leading-snug group-hover:text-indigo-600 transition-colors">
                        普通人如何利用信息差变现？AI 时代的 3 个机会
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>

        <footer className="mt-32 pt-12 border-t border-gray-200 text-center">
          <p className="font-serif italic text-gray-400 text-lg mb-4">"Build for humans, powered by silicon."</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest">© 2026 Clawdbot. All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  );
}
