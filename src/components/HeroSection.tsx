import React from 'react';
import { Rocket, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
  onOpenSpaceStory: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onOpenSpaceStory,
}) => {
  return (
    <section
      id="hero-section"
      className="relative w-full h-screen min-h-[640px] max-h-[920px] flex flex-col justify-center items-center pt-[56px] overflow-hidden select-none bg-[#0A0A0A]"
    >
      {/* Space Aurora Earth Background Image */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <img
          src="https://lh3.googleusercontent.com/aida/AEtjO1XqVzFGdZSzr5ll4XDdLkb_h3KA-CZpeFUqzOxHdPVpt3GecsAmgiy7xhmjzf0F0eC5NA50QrrcNcaR5bXJcoeLqivnGSolByG2_ewFFmRYBX-Q4sCzmsj1q87YeKJDgvWjW4rhbHOKVDTpK2EbdS3XahUIjj_ytg22hfoknKYzW9odl6EuklIHIUKeQOTSPWN1txeeGUzONvja8LRwFjKO8cllCgiHZkc_3dUopTT0YQiJCzNAhrgvLlA"
          alt="Earth from space at night with vibrant auroral streaks"
          className="w-full h-full object-cover object-top filter brightness-[0.85] contrast-110"
          loading="eager"
        />
        {/* Exact gradient overlay matching Elegant Dark design */}
        <div className="absolute inset-0 hero-bg-overlay" />
      </div>

      {/* Hero Core Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-6 md:mt-12">
        <h1
          id="hero-main-title"
          className="font-headline text-[54px] leading-[62px] sm:text-[68px] sm:leading-[76px] md:text-[84px] md:leading-[92px] text-white font-bold tracking-tight mb-4 drop-shadow-2xl"
        >
          Look first / Then leap.
        </h1>

        <p
          id="hero-subtitle"
          className="text-[17px] sm:text-[19px] md:text-[20px] text-zinc-400 font-normal mb-9 max-w-2xl mx-auto tracking-normal drop-shadow"
        >
          The best trades require research, then commitment.
        </p>

        <div className="flex flex-col items-center gap-3">
          <button
            id="hero-get-started-cta"
            onClick={onGetStarted}
            className="bg-emerald-500 text-black px-8 py-3.5 rounded-full font-bold text-[16px] hover:bg-emerald-400 hover:scale-[1.02] active:scale-98 transition-all duration-200 shadow-xl shadow-emerald-500/25 flex items-center gap-2 group cursor-pointer"
          >
            <span>Get started for free</span>
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
          </button>

          <span
            id="hero-caption-note"
            className="text-[12px] sm:text-[13px] text-zinc-500 font-normal tracking-wide"
          >
            $0 forever, no credit card needed
          </span>
        </div>
      </div>

      {/* Space Teaser Widget (Scott "Kidd" Poteet) */}
      <div
        id="space-story-teaser-widget"
        className="absolute bottom-12 right-6 md:right-10 z-20 hidden md:flex flex-col items-end gap-1.5 text-right"
      >
        <p className="text-[17px] font-semibold text-white tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          See our space story
        </p>
        <p className="text-[13px] text-zinc-400 font-normal">
          With astronaut Scott "Kidd" Poteet
        </p>
        <button
          id="space-mission-trigger-btn"
          onClick={onOpenSpaceStory}
          className="mt-2 glass-panel hover:bg-zinc-900 hover:border-emerald-500/40 text-white px-4 py-2 rounded-full text-[13px] font-medium flex items-center gap-2 border border-zinc-800 shadow-lg transition-all duration-200 hover:scale-[1.03] cursor-pointer group"
        >
          <Rocket className="w-4 h-4 text-emerald-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          <span>Space mission</span>
        </button>
      </div>
    </section>
  );
};
