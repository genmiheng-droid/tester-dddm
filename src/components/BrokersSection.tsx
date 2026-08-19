import React from 'react';
import { ShieldCheck, Star, ArrowRight } from 'lucide-react';

export const BrokersSection: React.FC = () => {
  const brokers = [
    {
      name: 'Interactive Brokers',
      rating: 4.9,
      reviews: '28k reviews',
      regulatedBy: 'SEC, FINRA, FCA',
      minDeposit: '$0',
      assets: 'Stocks, Options, Futures, Forex',
      badge: 'PRO TIER',
    },
    {
      name: 'TradeStation',
      rating: 4.8,
      reviews: '19k reviews',
      regulatedBy: 'SEC, FINRA, SIPC',
      minDeposit: '$0',
      assets: 'Equities, Cryptos, Futures',
      badge: 'INTEGRATED API',
    },
    {
      name: 'OANDA',
      rating: 4.7,
      reviews: '15k reviews',
      regulatedBy: 'CFTC, NFA, FCA',
      minDeposit: '$0',
      assets: 'Forex, Precious Metals, Indices',
      badge: 'FOREX ALPHA',
    },
    {
      name: 'Binance / Coinbase',
      rating: 4.8,
      reviews: '45k reviews',
      regulatedBy: 'FinCEN, Global Regulators',
      minDeposit: '$10',
      assets: '350+ Spot & Perpetual Pairs',
      badge: 'CRYPTO LIQUIDITY',
    },
  ];

  return (
    <section id="brokers-directory-section" className="w-full bg-[#0A0A0A] py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          // Verified Broker Direct Route
        </div>
        <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-3">
          Trade Directly from TradingView Charts
        </h2>
        <p className="text-sm text-zinc-500">
          Execute institutional-grade orders through verified, regulated broker partners without leaving your unified workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brokers.map((broker) => (
          <div
            key={broker.name}
            className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-zinc-700">
                  {broker.badge}
                </span>
                <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono font-semibold">
                  <Star className="w-3.5 h-3.5 fill-emerald-400" />
                  <span>{broker.rating}</span>
                </div>
              </div>

              <h3 className="text-lg font-medium text-white mb-1">{broker.name}</h3>
              <p className="text-xs text-zinc-500 mb-4 font-mono">Regulated: {broker.regulatedBy}</p>

              <div className="space-y-2 text-xs py-3 border-t border-b border-zinc-800/80 mb-4 font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Min Deposit:</span>
                  <span className="text-white font-semibold">{broker.minDeposit}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Coverage:</span>
                  <span className="text-white text-[11px] truncate max-w-[130px]">{broker.assets}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Connecting with ${broker.name} simulated API bridge...`)}
              className="w-full py-2.5 rounded-xl bg-zinc-800/80 hover:bg-emerald-500 hover:text-black text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Connect Broker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
