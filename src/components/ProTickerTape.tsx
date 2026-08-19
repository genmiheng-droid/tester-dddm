import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Globe, Zap, ArrowUpRight } from 'lucide-react';
import { MarketAsset } from '../types';

interface ProTickerTapeProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  isLiveSimulating: boolean;
}

export const ProTickerTape: React.FC<ProTickerTapeProps> = ({
  assets,
  onSelectAsset,
  isLiveSimulating,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().split(' ')[4] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global Session status based on UTC hour
  const currentHourUTC = new Date().getUTCHours();
  const sessions = [
    { city: 'NYC', status: currentHourUTC >= 13 && currentHourUTC < 20 ? 'OPEN' : 'CLOSED', open: currentHourUTC >= 13 && currentHourUTC < 20 },
    { city: 'LON', status: currentHourUTC >= 7 && currentHourUTC < 16 ? 'OPEN' : 'CLOSED', open: currentHourUTC >= 7 && currentHourUTC < 16 },
    { city: 'TKY', status: currentHourUTC >= 0 && currentHourUTC < 9 ? 'OPEN' : 'CLOSED', open: currentHourUTC >= 0 && currentHourUTC < 9 },
  ];

  return (
    <div
      id="pro-ticker-tape"
      className="w-full bg-[#080808] border-b border-zinc-800/80 text-xs font-mono select-none overflow-hidden flex items-center h-[34px] fixed top-[56px] z-40"
    >
      {/* Session indicators (Left) */}
      <div className="hidden lg:flex items-center gap-3 px-3.5 bg-zinc-950 border-r border-zinc-800 shrink-0 h-full text-[10px]">
        <span className="text-zinc-500 flex items-center gap-1">
          <Clock className="w-3 h-3 text-emerald-400" />
          {utcTime || '14:35:00 UTC'}
        </span>
        <div className="flex items-center gap-2">
          {sessions.map(s => (
            <span key={s.city} className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${s.open ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
              <span className={s.open ? 'text-zinc-300 font-semibold' : 'text-zinc-500'}>{s.city}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Marquee ticker stream */}
      <div className="flex-1 overflow-x-auto flex items-center scrollbar-none whitespace-nowrap divide-x divide-zinc-800/60">
        {assets.concat(assets).map((asset, idx) => {
          const isPositive = asset.change >= 0;
          return (
            <div
              key={`${asset.symbol}-${idx}`}
              onClick={() => onSelectAsset(asset)}
              className="px-3.5 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-zinc-900 transition-colors shrink-0 group"
            >
              <span className="text-zinc-400 font-bold group-hover:text-white text-[11px]">
                {asset.symbol}
              </span>
              <span className="text-white text-[11px] font-medium">
                {asset.price.toLocaleString('en-US', {
                  minimumFractionDigits: asset.decimals,
                  maximumFractionDigits: asset.decimals,
                })}
              </span>
              <span
                className={`text-[10px] font-semibold flex items-center ${
                  isPositive ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* DMA Low latency indicator */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 bg-zinc-950 border-l border-zinc-800 shrink-0 h-full text-[10px] text-zinc-500 font-mono">
        <Zap className="w-3 h-3 text-emerald-400" />
        <span className="text-emerald-400 font-bold">12ms</span>
        <span className="hidden md:inline">DMA</span>
      </div>
    </div>
  );
};
