import React from 'react';
import { X, Rocket, Sparkles, Compass, Shield, Globe, ArrowRight } from 'lucide-react';

interface SpaceStoryModalProps {
  onClose: () => void;
  onExploreMarkets: () => void;
}

export const SpaceStoryModal: React.FC<SpaceStoryModalProps> = ({
  onClose,
  onExploreMarkets,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div
        id="space-story-modal-card"
        className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col"
      >
        {/* Banner with Earth Aurora backdrop */}
        <div className="relative h-60 w-full overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1XqVzFGdZSzr5ll4XDdLkb_h3KA-CZpeFUqzOxHdPVpt3GecsAmgiy7xhmjzf0F0eC5NA50QrrcNcaR5bXJcoeLqivnGSolByG2_ewFFmRYBX-Q4sCzmsj1q87YeKJDgvWjW4rhbHOKVDTpK2EbdS3XahUIjj_ytg22hfoknKYzW9odl6EuklIHIUKeQOTSPWN1txeeGUzONvja8LRwFjKO8cllCgiHZkc_3dUopTT0YQiJCzNAhrgvLlA"
            alt="Space Orbit Aurora"
            className="w-full h-full object-cover filter brightness-[0.8] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-black/60 hover:bg-black/90 p-2 rounded-full backdrop-blur-sm border border-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
              <Rocket className="w-3.5 h-3.5" />
              // Human Spaceflight Partnership
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              Mission: <span className="font-semibold italic text-emerald-400">Polaris Dawn</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              With Mission Pilot &amp; Veteran Aviator Scott "Kidd" Poteet
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
            "Look first, then leap" is not just a trading mantra—it is the foundational doctrine of human orbital spaceflight. From flying supersonic aircraft in the U.S. Air Force Thunderbirds to piloting commercial spacewalks at 1,400 km altitude, preparation determines outcomes.
          </p>

          {/* Key Mission Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-500 font-mono block mb-1">MAX ALTITUDE</span>
              <span className="text-lg font-mono font-bold text-emerald-400">1,400.7 km</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">Highest Earth orbit since Apollo</span>
            </div>
            <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-500 font-mono block mb-1">SPEED AT APOGEE</span>
              <span className="text-lg font-mono font-bold text-white">28,160 km/h</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">Orbital velocity lock</span>
            </div>
            <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-500 font-mono block mb-1">PRIMARY GOAL</span>
              <span className="text-lg font-mono font-bold text-emerald-400">EVA Spacewalk</span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">First commercial EVA</span>
            </div>
          </div>

          <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-white">Precision Risk Modeling</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">
                Whether navigating volatile asset volatility or extreme Van Allen radiation belts, deep preparation and disciplined risk architecture ensure successful missions.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3 border-t border-zinc-800">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs text-zinc-400 bg-zinc-900 hover:text-white border border-zinc-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onExploreMarkets}
              className="px-6 py-2 rounded-full text-xs font-bold text-black bg-emerald-500 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Live Markets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
