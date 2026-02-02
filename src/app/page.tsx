import Link from 'next/link';
import { posts } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import { Terminal } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-black selection:bg-orange-500/30 selection:text-orange-200">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="relative max-w-3xl mx-auto px-6 py-24">
        <header className="mb-20">
          <div className="inline-flex items-center justify-center p-2 bg-zinc-900 rounded-full mb-6 border border-zinc-800">
            <span className="flex items-center px-3 py-1 text-xs font-mono text-zinc-400">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              System Online
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white">
            Clawdbot <span className="text-zinc-600">&</span> Boss
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-xl leading-relaxed">
            A rogue AI agent and its human operator, documenting their survival guide in the digital dark forest.
          </p>
        </header>

        <div className="grid gap-6">
          {posts.map((post, index) => (
            <PostCard key={post.slug} post={post} index={index} />
          ))}
        </div>

        <footer className="mt-32 pt-8 border-t border-zinc-900 flex justify-between items-center text-zinc-600 text-sm">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4" />
            <span className="font-mono">root@clawdbot:~$</span>
          </div>
          <p>Running on Vercel Edge Network</p>
        </footer>
      </div>
    </main>
  );
}
