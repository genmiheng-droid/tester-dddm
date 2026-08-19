import React, { useState } from 'react';
import { Newspaper, Clock, Globe, ArrowUpRight } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const articles = [
    {
      id: 1,
      source: 'Bloomberg Markets',
      time: '14 mins ago',
      title: 'Federal Reserve Signals Measured Pace on Balance Sheet Reduction Amid Stable Yields',
      summary: 'Treasury yields consolidated as central bankers reiterated patience on policy easing, keeping tech equities buoyant.',
      category: 'macro',
      readTime: '3 min read',
      tag: 'Fed Policy',
    },
    {
      id: 2,
      source: 'Reuters Financial',
      time: '42 mins ago',
      title: 'Global Semiconductor Shipments Hit All-Time High as AI Infrastructure Spending Surges',
      summary: 'Hyperscalers ramp up custom silicon and GPU cluster investments, driving record revenue guidance across supply chains.',
      category: 'stocks',
      readTime: '4 min read',
      tag: 'AI & Chips',
    },
    {
      id: 3,
      source: 'CoinDesk',
      time: '1 hour ago',
      title: 'Bitcoin Spot ETF Inflows Rebound Above $450 Million Following Institutional Rebalancing',
      summary: 'Sovereign wealth desks and corporate treasuries expand digital asset allocations into weekly closes.',
      category: 'crypto',
      readTime: '2 min read',
      tag: 'Crypto ETFs',
    },
    {
      id: 4,
      source: 'Financial Times',
      time: '2 hours ago',
      title: 'European Central Bank Holds Benchmarks Steady While Monitoring Energy Price Trajectories',
      summary: 'Governing council points to domestic wage growth normalization and services disinflation trends.',
      category: 'forex',
      readTime: '5 min read',
      tag: 'Forex & ECB',
    },
  ];

  const filtered = filterCategory === 'all'
    ? articles
    : articles.filter(a => a.category === filterCategory);

  return (
    <section id="news-wire-section" className="w-full bg-[#0A0A0A] py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-widest mb-1">
            <Newspaper className="w-3.5 h-3.5" />
            // Live Financial Wire
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Market News &amp; Macro Intelligence
          </h2>
        </div>

        <div className="flex gap-2">
          {['all', 'macro', 'stocks', 'crypto', 'forex'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1 rounded-full text-xs capitalize font-medium transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat === 'all' ? 'All Headlines' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-3 font-mono">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  {item.source}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
              </div>

              <h3 className="text-base font-medium text-white group-hover:text-zinc-200 transition-colors leading-snug mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                {item.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-500 border border-zinc-800">
                #{item.tag}
              </span>
              <span className="text-emerald-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Story <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
