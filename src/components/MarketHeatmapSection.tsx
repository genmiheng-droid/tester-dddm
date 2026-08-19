import React, { useState } from 'react';
import { LayoutGrid, Layers, Filter, TrendingUp, TrendingDown, Sparkles, ArrowUpRight } from 'lucide-react';
import { heatmapData } from '../data/marketsData';
import { HeatmapItem, MarketAsset } from '../types';

interface MarketHeatmapSectionProps {
  onSelectSymbol: (symbol: string) => void;
  allAssets: MarketAsset[];
}

export const MarketHeatmapSection: React.FC<MarketHeatmapSectionProps> = ({
  onSelectSymbol,
  allAssets,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('All');

  const sectors = ['All', 'Technology', 'Communication', 'Consumer Discretionary', 'Financials', 'Healthcare', 'Crypto Majors'];

  const filteredItems = selectedSector === 'All'
    ? heatmapData
    : heatmapData.filter(item => item.sector === selectedSector);

  // Helper for background color intensity
  const getTileColor = (pct: number) => {
    if (pct >= 3.0) return 'bg-emerald-600/40 border-emerald-500/80 text-emerald-300';
    if (pct > 0.5) return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400';
    if (pct >= 0) return 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400';
    if (pct > -1.5) return 'bg-red-950/40 border-red-500/30 text-red-400';
    return 'bg-red-950/80 border-red-500/70 text-red-300';
  };

  return (
    <section id="pro-market-heatmap-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <LayoutGrid className="w-3.5 h-3.5" />
            // Institutional Market Map
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Sector <span className="font-semibold italic text-emerald-400">Heatmap &amp; Flow</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-light">
            Real-time capital allocation weight and performance across global equities and crypto assets.
          </p>
        </div>

        {/* Sector Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {sectors.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                selectedSector === sec
                  ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredItems.map(item => {
          const isGreen = item.changePercent >= 0;
          return (
            <div
              key={item.symbol}
              onClick={() => onSelectSymbol(item.symbol)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] flex flex-col justify-between min-h-[120px] ${getTileColor(
                item.changePercent
              )}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-bold font-mono text-white block">
                    {item.symbol}
                  </span>
                  <span className="text-[11px] text-zinc-400 block truncate max-w-[120px]">
                    {item.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-zinc-300">
                  {item.marketCap}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono text-zinc-400">{item.sector}</span>
                <div className="flex items-center gap-1 font-mono font-bold text-sm">
                  {isGreen ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
                  <span>{isGreen ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-500 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Click any sector block to load high-frequency candlestick stream
        </span>
        <div className="flex items-center gap-2">
          <span>-3%</span>
          <div className="flex h-2 w-32 rounded-full overflow-hidden border border-zinc-800">
            <div className="w-1/2 bg-gradient-to-r from-red-600 to-zinc-900" />
            <div className="w-1/2 bg-gradient-to-r from-zinc-900 to-emerald-500" />
          </div>
          <span>+3%</span>
        </div>
      </div>
    </section>
  );
};
