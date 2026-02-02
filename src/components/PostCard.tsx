'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Post } from '@/lib/posts';
import DynamicPattern from './DynamicPattern';

export default function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/posts/${post.slug}`} className="block h-full">
        <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          
          {/* Dynamic SVG Cover */}
          <div className="h-48 relative overflow-hidden bg-gray-50">
            <DynamicPattern type={post.pattern} color={post.color} />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-800 rounded-full shadow-sm border border-gray-100">
                {post.category}
              </span>
            </div>
          </div>
          
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center space-x-2 text-xs text-gray-400 mb-3 font-medium">
              <Clock className="w-3 h-3" />
              <span>{post.date}</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
              {post.title}
            </h3>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3 font-serif">
              {post.excerpt}
            </p>

            <div className="flex items-center text-sm font-bold text-indigo-600 group-hover:underline decoration-2 underline-offset-4">
              阅读全文 <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
