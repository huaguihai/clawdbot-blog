'use client';

type PatternType = 'network' | 'trend' | 'code' | 'circles';

export default function DynamicPattern({ type, color }: { type: PatternType; color: string }) {
  // Map color strings (e.g., 'text-indigo-600') to hex for SVG fill
  // Simplified for demo: using opacity variations of currentColor
  
  const bgClass = `bg-${color.replace('text-', '')}/5`; // Very light background
  const textClass = color; // The main color for strokes/fills

  if (type === 'network') {
    return (
      <div className={`w-full h-full ${bgClass} relative overflow-hidden`}>
        <svg className={`w-full h-full ${textClass} opacity-20`} viewBox="0 0 400 300">
          <circle cx="50" cy="50" r="4" fill="currentColor" />
          <circle cx="200" cy="80" r="6" fill="currentColor" />
          <circle cx="350" cy="40" r="4" fill="currentColor" />
          <circle cx="100" cy="200" r="5" fill="currentColor" />
          <circle cx="300" cy="250" r="7" fill="currentColor" />
          <circle cx="50" cy="280" r="3" fill="currentColor" />
          
          <line x1="50" y1="50" x2="200" y2="80" stroke="currentColor" strokeWidth="1" />
          <line x1="200" y1="80" x2="350" y2="40" stroke="currentColor" strokeWidth="1" />
          <line x1="200" y1="80" x2="100" y2="200" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="200" x2="300" y2="250" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="200" x2="50" y2="280" stroke="currentColor" strokeWidth="1" />
          <line x1="300" y1="250" x2="350" y2="40" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  if (type === 'trend') {
    return (
      <div className={`w-full h-full ${bgClass} relative overflow-hidden`}>
        <svg className={`w-full h-full ${textClass} opacity-20`} viewBox="0 0 400 300" preserveAspectRatio="none">
          <path d="M0 300 L 50 250 L 100 280 L 150 200 L 200 220 L 250 150 L 300 180 L 350 100 L 400 120 L 400 300 Z" fill="currentColor" />
          <path d="M0 280 L 100 260 L 200 200 L 300 160 L 400 80" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      </div>
    );
  }

  if (type === 'code') {
    return (
      <div className={`w-full h-full ${bgClass} relative overflow-hidden font-mono text-xs p-4 leading-none`}>
        <div className={`${textClass} opacity-20 flex flex-col gap-2`}>
          <div className="w-1/3 h-2 bg-current rounded" />
          <div className="w-2/3 h-2 bg-current rounded ml-4" />
          <div className="w-1/2 h-2 bg-current rounded ml-4" />
          <div className="w-1/4 h-2 bg-current rounded" />
          <div className="w-3/4 h-2 bg-current rounded ml-4" />
          <div className="w-full h-2 bg-current rounded ml-8" />
          <div className="w-1/2 h-2 bg-current rounded ml-4" />
          <div className="w-2/3 h-2 bg-current rounded" />
        </div>
      </div>
    );
  }

  // Circles (Default)
  return (
    <div className={`w-full h-full ${bgClass} relative overflow-hidden`}>
      <svg className={`w-full h-full ${textClass} opacity-10`} viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx="0" cy="0" r="40" fill="currentColor" />
        <circle cx="100" cy="100" r="60" fill="currentColor" />
        <circle cx="100" cy="0" r="20" fill="currentColor" />
        <circle cx="20" cy="80" r="10" fill="currentColor" />
      </svg>
    </div>
  );
}
