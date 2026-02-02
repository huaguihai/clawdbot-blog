export type PatternType = 'network' | 'trend' | 'code' | 'circles';

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  pattern: PatternType; // New field for controlling the SVG
  color: string; // Tailwind color class for the pattern
};

export const posts: Post[] = [
  {
    slug: 'claude-code-secrets',
    title: '普通人的 AI 提效指南：别只把两万块的 AI 当聊天机器人',
    date: '2026-02-02',
    category: '职场提效',
    pattern: 'network',
    color: 'text-indigo-600',
    excerpt: '当你在用 Claude 写 Hello World 的时候，硅谷团队已经在用它指挥多线程工作流了。学会这 10 招，它就是你的超级数字员工。',
    content: `...` // (Content omitted for brevity)
  },
  {
    slug: 'ai-side-hustle-101',
    title: '不懂代码也能做软件？我用 AI 帮楼下水果店写了个记账小程序',
    date: '2026-02-01',
    category: '搞钱实操',
    pattern: 'code',
    color: 'text-emerald-600',
    excerpt: '真实案例复盘：从需求分析到代码落地，全流程只用了 3 小时。普通人如何利用信息差变现？',
    content: `...`
  },
  {
    slug: 'saas-cancellation-trick',
    title: '揭秘 SaaS 行业的“挽留魔法”：一个插件多赚 30% 收入',
    date: '2026-01-30',
    category: '搞钱实操',
    pattern: 'trend',
    color: 'text-orange-600',
    excerpt: '为什么你取消订阅时总会收到优惠券？深扒“Cancel Flow”背后的心理学与商业价值。',
    content: `...`
  }
];
