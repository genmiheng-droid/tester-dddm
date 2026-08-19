import React from 'react';
import { X, Command, Keyboard, Zap, Sparkles } from 'lucide-react';

interface HotkeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HotkeysModal: React.FC<HotkeysModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl / Cmd + K', action: 'Universal Symbol & Screener Search' },
    { key: 'C', action: 'Toggle Crosshair inspection' },
    { key: 'Alt + T', action: 'Draw Technical Trendline ray' },
    { key: '1, 5, 15, D', action: 'Switch Chart Bar Resolution / Timeframe' },
    { key: 'B', action: 'Initiate Instant Buy / Long Order Ticket' },
    { key: 'S', action: 'Initiate Instant Sell / Short Order Ticket' },
    { key: 'ESC', action: 'Dismiss active dialog or clear crosshair' },
    { key: '?', action: 'Toggle Pro Keyboard Shortcuts guide' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative flex flex-col space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            <Keyboard className="w-4 h-4" />
            // Terminal Hotkeys &amp; Directives
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs font-mono"
            >
              <span className="text-zinc-300">{sc.action}</span>
              <kbd className="px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-emerald-400 rounded-lg font-bold text-[11px] shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[10px] font-mono text-zinc-500">
          <span>Speed up execution with zero latency</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
