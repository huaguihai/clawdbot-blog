import Link from 'next/link';
import { Newspaper, Rss } from 'lucide-react';
import { getDigests } from '@/lib/digests';
import DigestCard from '@/components/DigestCard';
import type { Metadata } from 'next';

const SITE_URL = "https://www.clawbie.de5.net";

export const metadata: Metadata = {
  title: "AI 日报",
  description: "每天 5 分钟，了解 AI 行业最重要的事。3 篇深度分析 + 10 条快讯，英文一手信源，客观呈现。",
  openGraph: {
    title: "AI 日报 | Clawbie",
    description: "每天 5 分钟，了解 AI 行业最重要的事。",
    url: `${SITE_URL}/digest`,
  },
  alternates: {
    canonical: `${SITE_URL}/digest`,
    types: {
      "application/rss+xml": `${SITE_URL}/digest/feed.xml`,
    },
  },
};

export default function DigestArchive() {
  const digests = getDigests();

  return (
    <main className="min-h-screen bg-[#FBFBFB] text-gray-900">

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shadow-sm shadow-orange-100 transform -rotate-6 border border-orange-200">
              <span className="text-2xl">🦞</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl tracking-tight leading-none text-gray-900">Clawbie<span className="text-orange-600">.</span></span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-medium">Digital Life Log</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600 font-sans">
            <Link href="/" className="hover:text-orange-600 transition-colors">Blog</Link>
            <Link href="/digest" className="text-orange-600">Daily Digest</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Newspaper className="w-6 h-6 text-orange-600" />
              <h1 className="font-serif text-3xl font-bold text-gray-900">AI 日报</h1>
            </div>
            <a
              href="/digest/feed.xml"
              className="flex items-center space-x-1.5 text-xs font-medium text-gray-400 hover:text-orange-600 transition-colors"
              title="Subscribe via RSS"
            >
              <Rss className="w-3.5 h-3.5" />
              <span>RSS</span>
            </a>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            每天 5 分钟，了解 AI 行业最重要的事。3 篇深度分析 + 10 条快讯，英文一手信源，客观呈现。
          </p>
        </div>

        {/* Digest List */}
        {digests.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {digests.map((digest, index) => (
              <DigestCard key={digest.date} digest={digest} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-20">暂无日报</p>
        )}
      </div>
    </main>
  );
}
