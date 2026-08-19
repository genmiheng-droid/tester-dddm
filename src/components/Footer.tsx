import React, { useState } from 'react';
import { X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const openInfo = (title: string, body: string) => {
    setModalContent({ title, body });
  };

  return (
    <>
      <footer
        id="main-app-footer"
        className="bg-[#0A0A0A] text-zinc-500 text-xs w-full py-8 mt-auto border-t border-zinc-800"
      >
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto gap-4">
          <div className="font-headline text-base sm:text-lg text-zinc-300 font-semibold tracking-tight">
            © 2024 TradingView, Inc.
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-400">
            <button
              onClick={() =>
                openInfo(
                  'TradingView Platform Features',
                  'Featuring HTML5 Canvas charting, multi-chart synchronization, 100k+ global indicators, Pine Script® v5 custom engine, and ultra-low latency real-time market feeds.'
                )
              }
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Features
            </button>

            <button
              onClick={() =>
                openInfo(
                  'Plans & Pricing',
                  'Essential, Plus, and Premium tiers available. Includes unlimited indicators per chart, second-based intervals, server-side alerts, and priority data connections.'
                )
              }
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Pricing
            </button>

            <button
              onClick={() =>
                openInfo(
                  'Help Center & Documentation',
                  'Access 2,000+ tutorials on technical analysis, chart patterns, indicator setups, keyboard shortcuts, and broker account linking.'
                )
              }
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Help Center
            </button>

            <button
              onClick={() =>
                openInfo(
                  'Terms of Use',
                  'TradingView provides analytical tools and market data for informational purposes. Market quotes are subject to exchange delays unless subscribed to real-time streams.'
                )
              }
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Terms of Use
            </button>

            <button
              onClick={() =>
                openInfo(
                  'Privacy Policy',
                  'We adhere to rigorous data protection standards (GDPR, CCPA). Your trading strategies and watchlists remain encrypted and private.'
                )
              }
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>

            <button
              onClick={() =>
                openInfo(
                  'TradingView Desktop App',
                  'Native desktop performance with multi-monitor support, native notifications, and dedicated hardware acceleration for Windows, macOS, and Linux.'
                )
              }
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Desktop App
            </button>
          </div>
        </div>
      </footer>

      {/* Info Dialog Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h3 className="font-medium text-white text-base">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="text-zinc-500 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {modalContent.body}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-1.5 rounded-full bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 cursor-pointer shadow-md shadow-emerald-500/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
