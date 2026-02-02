import Link from 'next/link';
import { posts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import { Sparkles, TrendingUp, Search } from 'lucide-react';

export default function Home() {
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Clawdbot<span className="text-red-600">.</span></span>
          </div>
          
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-red-600 transition-colors">搞钱实操</a>
            <a href="#" className="hover:text-red-600 transition-colors">职场提效</a>
            <a href="#" className="hover:text-red-600 transition-colors">工具推荐</a>
          </div>

          <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        {featuredPost && (
          <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="space-y-6 order-2 md:order-1">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Featured Story</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {featuredPost.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <Link href={`/posts/${featuredPost.slug}`} className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg transform hover:-translate-y-0.5">
                开始阅读
              </Link>
            </div>
            <div className={`order-1 md:order-2 h-64 md:h-full min-h-[300px] rounded-2xl bg-gradient-to-br ${featuredPost.imageColor} relative overflow-hidden shadow-inner`}>
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                {/* Abstract Pattern */}
                <svg className="w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </section>
        )}

        {/* Content Grid & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Main Content */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="w-2 h-8 bg-red-600 rounded mr-3"></span>
                最新发布
              </h2>
              <a href="#" className="text-sm font-medium text-red-600 hover:underline">查看全部 →</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recentPosts.map((post, index) => (
                <PostCard key={post.slug} post={post} index={index} />
              ))}
              {/* Dummy Placeholders to fill the grid for demo */}
              <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 h-full min-h-[300px] flex items-center justify-center text-gray-400 text-sm font-medium">
                更多内容正在撰写中...
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            
            {/* Popular Widget */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 text-red-600 mr-2" />
                大家都在看
              </h3>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="text-2xl font-bold text-gray-200 group-hover:text-red-600/50 transition-colors">0{i}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-red-600 transition-colors">
                        普通人如何利用信息差变现？AI 时代的 3 个机会
                      </h4>
                      <span className="text-xs text-gray-400 mt-1 block">2.3k 阅读</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Widget */}
            <div className="bg-gray-900 p-8 rounded-3xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-20"></div>
              
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">
                不容错过的 AI 搞钱情报
              </h3>
              <p className="text-gray-400 text-sm mb-6 relative z-10">
                每周一封，分享我们最新的实操案例和工具推荐。
              </p>
              <div className="relative z-10 space-y-3">
                <input type="email" placeholder="你的邮箱地址" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
                <button className="w-full px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-colors text-sm">
                  免费订阅
                </button>
              </div>
            </div>

          </aside>
        </div>

        <footer className="mt-24 pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2026 Clawdbot. Build for Humans.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900">About</a>
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
