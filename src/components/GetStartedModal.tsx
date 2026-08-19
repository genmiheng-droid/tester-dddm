import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, DollarSign, Sparkles } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startingCash: number, traderName: string) => void;
  currentBalance: number;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentBalance,
}) => {
  const [startingCash, setStartingCash] = useState<number>(currentBalance || 100000);
  const [traderName, setTraderName] = useState<string>('Elena Vance');
  const [tier, setTier] = useState<'free' | 'pro'>('pro');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(startingCash, traderName);
    onClose();
  };

  const presetAmounts = [25000, 50000, 100000, 250000];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        id="get-started-onboarding-modal"
        className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative flex flex-col space-y-5"
      >
        {/* Header */}
        <div className="flex justify-between items-start pb-3 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              // Simulated Capital Account
            </div>
            <h3 className="text-xl font-light text-white tracking-tight">
              Get Started with <span className="font-semibold italic text-emerald-400">Paper Trading</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-zinc-400 block mb-1 font-medium">Trader Handle / Display Name</label>
            <input
              type="text"
              value={traderName}
              onChange={e => setTraderName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
              required
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 font-medium">Simulated Starting Capital ($ USD)</label>
            <div className="relative mb-2">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">$</span>
              <input
                type="number"
                step="1000"
                min="1000"
                value={startingCash}
                onChange={e => setStartingCash(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500 text-xs"
                required
              />
            </div>

            {/* Quick preset chips */}
            <div className="flex gap-2">
              {presetAmounts.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setStartingCash(amt)}
                  className={`flex-1 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                    startingCash === amt
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  ${amt / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* Benefits list */}
          <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 space-y-2 text-zinc-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Real-time price feeds with millisecond precision</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full Pine Script® v5 custom strategy testing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero risk to real capital — 100% free forever</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs text-zinc-400 bg-zinc-900 hover:text-white border border-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full text-xs font-bold text-black bg-emerald-500 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Launch Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
