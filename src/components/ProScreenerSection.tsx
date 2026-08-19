import React, { useState } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, ArrowUpRight, Search, Activity, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { MarketAsset } from '../types';

interface ProScreenerSectionProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const ProScreenerSection: React.FC<ProScreenerSectionProps> = ({
  assets,
  onSelectAsset,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSetup, setFilterSetup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = assets.filter(a => {
    if (filterCategory !== 'all' && a.category !== filterCategory) return false;
    if (searchQuery && !a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterSetup === 'oversold' && (a.rsi || 50) >= 50) return false;
    if (filterSetup === 'overbought' && (a.rsi || 50) <= 60) return false;
    if (filterSetup === 'bullish_sentiment' && (a.sentimentScore || 50) < 70) return false;
    if (filterSetup === 'high_momentum' && Math.abs(a.changePercent) < 1.5) return false;
    return true;
  });

  return (
    <section id="pro-screener-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            // Algorithmic Market Scanner
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Technical <span className="font-semibold italic text-emerald-400">Scanner &amp; Screener</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-light">
            Filter 10,000+ financial securities by quantitative RSI indicators, volatility bands, and institutional volume flows.
          </p>
        </div>

        {/* Search bar inside screener */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter symbols..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      </div>

      {/* Preset Filters Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80">
        <div className="flex items-center gap-1 text-xs font-mono text-zinc-500 mr-2">
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          <span>Setups:</span>
        </div>

        {[
          { id: 'all', label: 'All Instruments' },
          { id: 'high_momentum', label: '⚡ High Momentum (> 1.5%)' },
          { id: 'bullish_sentiment', label: '🟢 Strong Bullish Flow' },
          { id: 'oversold', label: '📉 RSI Pullback (< 50)' },
          { id: 'overbought', label: '🔥 Overbought Breakout (> 60)' },
        ].map(preset => (
          <button
            key={preset.id}
            onClick={() => setFilterSetup(preset.id)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
              filterSetup === preset.id
                ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Screener Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-500 uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Symbol</th>
                <th className="py-3.5 px-4">Price (USD)</th>
                <th className="py-3.5 px-4">24h Change</th>
                <th className="py-3.5 px-4">RSI (14)</th>
                <th className="py-3.5 px-4">Sentiment Score</th>
                <th className="py-3.5 px-4">Volatility Beta</th>
                <th className="py-3.5 px-4">24h Volume</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500 italic">
                    No securities match current scanner filters.
                  </td>
                </tr>
              ) : (
                filtered.map(asset => {
                  const isGreen = asset.change >= 0;
                  const rsiVal = asset.rsi || 50;
                  const sentiment = asset.sentimentScore || 65;

                  return (
                    <tr
                      key={asset.symbol}
                      onClick={() => onSelectAsset(asset)}
                      className="hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center font-bold text-[11px] text-emerald-400 group-hover:border-emerald-500/50">
                            {asset.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <span className="text-white font-bold text-xs block">{asset.symbol}</span>
                            <span className="text-[10px] text-zinc-500 truncate max-w-[120px] block font-sans">{asset.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-white font-bold text-xs">
                        ${asset.price.toLocaleString('en-US', { minimumFractionDigits: asset.decimals })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-bold flex items-center gap-1 ${isGreen ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isGreen ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {isGreen ? '+' : ''}{asset.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={rsiVal > 65 ? 'text-amber-400 font-bold' : rsiVal < 45 ? 'text-cyan-400 font-bold' : 'text-zinc-300'}>
                            {rsiVal.toFixed(1)}
                          </span>
                          <div className="w-16 h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 hidden md:block">
                            <div
                              className={`h-full ${rsiVal > 65 ? 'bg-amber-400' : rsiVal < 45 ? 'bg-cyan-400' : 'bg-emerald-500'}`}
                              style={{ width: `${rsiVal}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                          {sentiment}% Bullish
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                        {asset.volatility || 'Normal (1.0)'}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">
                        {asset.volume24h}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onSelectAsset(asset);
                          }}
                          className="px-3 py-1 rounded-full bg-zinc-800 hover:bg-emerald-500 hover:text-black text-zinc-300 font-bold text-[11px] transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Chart</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
