'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, Cpu } from 'lucide-react';

type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

export default function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/posts/${post.slug}`} className="block group">
        <div className="relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 group-hover:to-orange-500/10 transition-all duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 text-xs font-medium text-zinc-500 mb-3">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center text-orange-500/80">
                <Cpu className="w-3 h-3 mr-1" />
                AI Agent Log
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-zinc-100 mb-3 group-hover:text-orange-400 transition-colors">
              {post.title}
            </h2>
            
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              {post.excerpt}
            </p>

            <div className="flex items-center text-sm text-orange-500 font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Read Protocol <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
