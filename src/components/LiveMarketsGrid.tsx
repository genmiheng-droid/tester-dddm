import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, Maximize2, Sparkles, Filter } from 'lucide-react';
import { MarketAsset, AssetCategory } from '../types';

interface LiveMarketsGridProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  flashingSymbols: { [symbol: string]: 'up' | 'down' };
}

export const LiveMarketsGrid: React.FC<LiveMarketsGridProps> = ({
  assets,
  onSelectAsset,
  flashingSymbols,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const categories: { id: AssetCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Featured' },
    { id: 'index', label: 'Indices' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'stock', label: 'Stocks' },
    { id: 'commodity', label: 'Commodities' },
  ];

  const filteredAssets = selectedCategory === 'all'
    ? assets
    : assets.filter(a => a.category === selectedCategory);

  // Helper to render SVG sparklines with area fill
  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length === 0) return null;
    const maxVal = Math.max(...points);
    const minVal = Math.min(...points);
    const range = maxVal - minVal || 1;
    const width = 100;
    const height = 30;

    const coords = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((p - minVal) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathD = `M ${coords.join(' L ')}`;
    const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;
    const color = isPositive ? '#34d399' : '#f87171';

    return (
      <div className="h-10 w-full mt-3 relative overflow-hidden pointer-events-none">
        {/* Soft bottom gradient */}
        <div
          className="absolute bottom-0 w-full h-2/3 opacity-20"
          style={{
            background: isPositive
              ? 'linear-gradient(to top, rgba(52, 211, 153, 0.5), transparent)'
              : 'linear-gradient(to top, rgba(248, 113, 113, 0.5), transparent)',
          }}
        />
        <svg
          className="w-full h-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox={`0 0 ${width} ${height}`}
        >
          <path
            d={areaD}
            fill={isPositive ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)'}
          />
          <path
            d={pathD}
            stroke={color}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  return (
    <section
      id="live-markets-section"
      className="w-full bg-[#0A0A0A] relative z-20 -mt-12 sm:-mt-14 px-4 sm:px-6 max-w-7xl mx-auto pb-16"
    >
      {/* Category selector pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <span className="text-xs font-semibold text-zinc-500 mr-2 uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
            <Filter className="w-3 h-3" /> Markets:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-500 flex items-center gap-1.5 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>REAL-TIME STREAMING</span>
        </div>
      </div>

      {/* Grid of market cards styled with Elegant Dark gradients & rounded-2xl */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => {
          const isPositive = asset.change >= 0;
          const flashState = flashingSymbols[asset.symbol];

          return (
            <div
              key={asset.symbol}
              id={`market-card-${asset.symbol.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
              onClick={() => onSelectAsset(asset)}
              onMouseEnter={() => setHoveredAsset(asset.symbol)}
              onMouseLeave={() => setHoveredAsset(null)}
              className={`bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-5 border transition-all duration-200 cursor-pointer group relative overflow-hidden ${
                flashState === 'up'
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : flashState === 'down'
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-zinc-800 hover:border-emerald-500/40 hover:from-zinc-800 hover:to-zinc-950'
              }`}
            >
              {/* Card Header: Symbol, Name, Price, Change */}
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[15px] text-white tracking-tight uppercase">
                      {asset.symbol}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 font-mono">
                      {asset.categoryLabel}
                    </span>
                  </div>
                  <p className="text-[12px] text-zinc-500 truncate max-w-[130px] mt-0.5">
                    {asset.name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-mono text-[14px] font-medium text-white">
                    {asset.price.toLocaleString('en-US', {
                      minimumFractionDigits: asset.decimals,
                      maximumFractionDigits: asset.decimals,
                    })}
                  </p>
                  <p
                    className={`font-mono text-[12px] font-semibold flex items-center justify-end gap-0.5 ${
                      isPositive ? 'text-emerald-400' : 'text-zinc-500'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {asset.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Sparkline Graphic */}
              {renderSparkline(asset.sparkline, isPositive)}

              {/* Interactive Hover prompt */}
              <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 group-hover:text-emerald-400 transition-colors">
                <span className="flex items-center gap-1 font-mono">
                  Vol: {asset.volume24h}
                </span>
                <span className="flex items-center gap-0.5 font-medium">
                  Launch Chart <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
