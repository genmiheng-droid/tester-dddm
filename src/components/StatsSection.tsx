import React from 'react';
import { Users, Trophy, Lightbulb, Code2 } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      prefix: '// COMMUNITY_01',
      metric: '60M+',
      label: 'Traders & Investors',
      desc: 'Active market participants sharing real-time technical setups and macro conviction across 180+ countries.',
      icon: Users,
    },
    {
      prefix: '// RANKING_02',
      metric: '#1',
      label: 'Top Investing Website',
      desc: 'Ranked global leader in financial market traffic, interactive charting tools, and high-frequency analytical software.',
      icon: Trophy,
    },
    {
      prefix: '// INSIGHTS_03',
      metric: '1.5M+',
      label: 'Published Ideas',
      desc: 'Crowdsourced technical analysis, harmonic pattern blueprints, and risk-managed market commentary.',
      icon: Lightbulb,
    },
    {
      prefix: '// ALGORITHMS_04',
      metric: '8M+',
      label: 'Custom Scripts',
      desc: 'Open-source Pine Script® quantitative models, backtested strategies, and bespoke algorithmic overlays.',
      icon: Code2,
    },
  ];

  return (
    <section
      id="stats-social-proof-section"
      className="w-full bg-[#0A0A0A] py-20 px-4 sm:px-6 border-t border-b border-zinc-800"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">
            Global Analytics Engine
          </p>
          <h2
            id="stats-headline-title"
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-4"
          >
            Where the world does <span className="font-semibold italic text-emerald-400">markets</span>.
          </h2>
          <p
            id="stats-subheadline-desc"
            className="text-base sm:text-lg text-zinc-500 font-normal leading-relaxed"
          >
            Join 60 million traders and investors taking the future into their own hands with high-precision instruments.
          </p>
        </div>

        {/* 4 Cards Grid styled with Elegant Dark gradients & zinc-800 borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-2xl border border-zinc-800 hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-mono text-emerald-500">{item.prefix}</p>
                    <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-1 font-mono">
                    {item.metric}
                  </h3>

                  <p className="text-sm font-semibold text-zinc-300 mb-3">
                    {item.label}
                  </p>

                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>STATUS: VERIFIED</span>
                  <span className="text-emerald-400">● LIVE</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
