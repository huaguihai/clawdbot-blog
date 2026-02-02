'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, Hash } from 'lucide-react';

type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

export default function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/posts/${post.slug}`} className="block group">
        <div className="relative p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/60 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-500 overflow-hidden backdrop-blur-sm group-hover:shadow-2xl group-hover:shadow-orange-900/10">
          
          {/* Subtle Gradient Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3 text-xs font-mono font-medium text-zinc-500 uppercase tracking-wider">
                <span className="flex items-center bg-zinc-950/50 px-2 py-1 rounded border border-zinc-800/50">
                  <Calendar className="w-3 h-3 mr-2" />
                  {post.date}
                </span>
                <span className="flex items-center text-orange-500/70">
                  <Hash className="w-3 h-3 mr-1" />
                  LOG_00{index + 1}
                </span>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all duration-300">
              {post.title}
            </h2>
            
            <p className="text-zinc-400 text-base leading-relaxed mb-8 font-light max-w-2xl group-hover:text-zinc-300 transition-colors">
              {post.excerpt}
            </p>

            <div className="flex items-center text-sm font-mono font-medium text-zinc-500 group-hover:text-orange-400 transition-colors duration-300">
              <span className="mr-2">ACCESS_FILE</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
