import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getDigests } from '@/lib/digests';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const SITE_URL = "https://www.clawbie.de5.net";

type Props = {
  params: Promise<{ date: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const digests = getDigests();
  const digest = digests.find((d) => d.date === date);
  if (!digest) return {};

  return {
    title: digest.title,
    description: digest.excerpt,
    openGraph: {
      title: digest.title,
      description: digest.excerpt,
      type: "article",
      publishedTime: digest.date,
      url: `${SITE_URL}/digest/${digest.date}`,
      locale: "zh_CN",
      siteName: "Clawbie.Blog",
    },
    alternates: {
      canonical: `${SITE_URL}/digest/${digest.date}`,
    },
  };
}

export async function generateStaticParams() {
  const digests = getDigests();
  return digests.map((d) => ({ date: d.date }));
}

export default async function DigestDetail({ params }: Props) {
  const { date } = await params;
  const digests = getDigests();
  const currentIndex = digests.findIndex((d) => d.date === date);

  if (currentIndex === -1) {
    notFound();
  }

  const digest = digests[currentIndex];
  const prevDigest = currentIndex < digests.length - 1 ? digests[currentIndex + 1] : null;
  const nextDigest = currentIndex > 0 ? digests[currentIndex - 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: digest.title,
    description: digest.excerpt,
    datePublished: digest.date,
    url: `${SITE_URL}/digest/${digest.date}`,
    author: { "@type": "Organization", name: "Clawbie", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Clawbie.Blog", url: SITE_URL },
    inLanguage: "zh-CN",
  };

  return (
    <main className="min-h-screen bg-[#FBFBFB] text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/digest" className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>日报归档</span>
          </Link>

          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600 font-sans">
            <Link href="/" className="hover:text-orange-600 transition-colors">Blog</Link>
            <Link href="/digest" className="text-orange-600">Daily Digest</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12">

        {/* Date header */}
        <div className="mb-10">
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
            <Calendar className="w-4 h-4" />
            <time dateTime={digest.date}>{digest.date}</time>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {digest.title}
          </h1>
          <p className="text-gray-500 mt-3 text-sm leading-relaxed">
            {digest.excerpt}
          </p>
        </div>

        {/* Markdown content */}
        <div className="prose prose-gray max-w-none
          prose-headings:font-sans prose-headings:tracking-tight
          prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
          prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3
          prose-p:text-[15px] prose-p:leading-[1.8]
          prose-li:text-[15px] prose-li:leading-[1.7]
          prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900
          prose-hr:my-8 prose-hr:border-gray-200
          prose-blockquote:border-l-orange-400 prose-blockquote:bg-orange-50/50 prose-blockquote:py-1 prose-blockquote:text-gray-600
        ">
          <ReactMarkdown>{digest.content}</ReactMarkdown>
        </div>

        {/* Prev / Next navigation */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-center">
          {prevDigest ? (
            <Link
              href={`/digest/${prevDigest.date}`}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{prevDigest.date}</span>
            </Link>
          ) : (
            <div />
          )}
          {nextDigest ? (
            <Link
              href={`/digest/${nextDigest.date}`}
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
            >
              <span>{nextDigest.date}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </article>
    </main>
  );
}
