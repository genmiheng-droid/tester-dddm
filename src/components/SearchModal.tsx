import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { MarketAsset } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via synthetic or custom mechanism
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = assets.filter(
    a =>
      a.symbol.toLowerCase().includes(query.toLowerCase()) ||
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (asset: MarketAsset) => {
    onSelectAsset(asset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div
        id="universal-search-dialog"
        className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Search Input Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search symbols, indices, crypto, forex..."
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60 p-2">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs font-mono">
              No matching financial instruments found for "{query}"
            </div>
          ) : (
            filteredAssets.map((asset, idx) => (
              <div
                key={asset.symbol}
                onClick={() => handleSelect(asset)}
                className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                  idx === selectedIndex ? 'bg-zinc-900 border border-zinc-700/80' : 'hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                    {asset.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{asset.symbol}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                        {asset.categoryLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">{asset.name}</p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className="text-xs font-mono text-white font-medium">
                      ${asset.price.toLocaleString('en-US', { minimumFractionDigits: asset.decimals })}
                    </div>
                    <div className={`text-[10px] font-mono font-semibold ${asset.change >= 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-zinc-950/80 border-t border-zinc-800 flex justify-between items-center text-[10px] font-mono text-zinc-500">
          <span>Navigate with arrows</span>
          <span>ENTER to select</span>
        </div>
      </div>
    </div>
  );
};
