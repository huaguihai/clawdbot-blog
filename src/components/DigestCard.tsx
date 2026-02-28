'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { Digest } from '@/lib/digests';

export default function DigestCard({ digest, index }: { digest: Digest; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/digest/${digest.date}`} className="block group">
        <div className="flex items-start gap-5 py-5 px-4 -mx-4 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200">
          <div className="flex-shrink-0 text-center w-16">
            <div className="text-2xl font-bold text-gray-900 leading-none font-sans">
              {new Date(digest.date + 'T00:00:00').getDate().toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-sans">
              {new Date(digest.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-snug">
              {digest.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
              {digest.excerpt}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
