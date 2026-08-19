import React, { useState } from 'react';
import { Search, User, Bell, Activity, Sparkles, TrendingUp, BookOpen, ShieldCheck, Newspaper, Globe, Sliders } from 'lucide-react';
import { MarketAsset } from '../types';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenGetStarted: () => void;
  onOpenChart: (asset: MarketAsset) => void;
  onOpenSpaceStory: () => void;
  activeView: 'home' | 'chart' | 'community' | 'news' | 'brokers';
  setActiveView: (view: 'home' | 'chart' | 'community' | 'news' | 'brokers') => void;
  featuredAsset: MarketAsset;
  isLiveSimulating: boolean;
  setIsLiveSimulating: (val: boolean) => void;
  paperBalance: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenGetStarted,
  onOpenChart,
  onOpenSpaceStory,
  activeView,
  setActiveView,
  featuredAsset,
  isLiveSimulating,
  setIsLiveSimulating,
  paperBalance,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav
      id="top-nav-bar"
      className="bg-[#0A0A0A]/90 text-zinc-400 w-full h-[56px] flex items-center justify-between px-4 sm:px-6 fixed top-0 z-50 glass-panel shadow-sm border-b border-zinc-800 backdrop-blur-md"
    >
      {/* Left branding & links */}
      <div className="flex items-center gap-6 lg:gap-8">
        <button
          id="brand-logo-btn"
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16L9 11L13 15L20 8" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 8H20V12" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-headline text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
            TradingView
          </span>
        </button>

        <div className="hidden md:flex items-center gap-5 lg:gap-7 text-[14px]">
          <button
            id="nav-products-btn"
            onClick={() => onOpenChart(featuredAsset)}
            className={`cursor-pointer transition-colors duration-200 py-1 flex items-center gap-1.5 ${
              activeView === 'chart'
                ? 'text-white font-semibold border-b-2 border-emerald-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            Products & Charts
          </button>

          <button
            id="nav-community-btn"
            onClick={() => setActiveView('community')}
            className={`cursor-pointer transition-colors duration-200 py-1 ${
              activeView === 'community'
                ? 'text-white font-semibold border-b-2 border-emerald-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Community
          </button>

          <button
            id="nav-markets-btn"
            onClick={() => {
              setActiveView('home');
              const el = document.getElementById('live-markets-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`cursor-pointer transition-colors duration-200 py-1 ${
              activeView === 'home'
                ? 'text-white font-semibold border-b-2 border-emerald-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Markets
          </button>

          <button
            id="nav-news-btn"
            onClick={() => setActiveView('news')}
            className={`cursor-pointer transition-colors duration-200 py-1 ${
              activeView === 'news'
                ? 'text-white font-semibold border-b-2 border-emerald-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            News
          </button>

          <button
            id="nav-brokers-btn"
            onClick={() => setActiveView('brokers')}
            className={`cursor-pointer transition-colors duration-200 py-1 ${
              activeView === 'brokers'
                ? 'text-white font-semibold border-b-2 border-emerald-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Brokers
          </button>

          <button
            id="nav-space-story-btn"
            onClick={onOpenSpaceStory}
            className="cursor-pointer transition-colors duration-200 py-1 text-emerald-400 hover:text-white flex items-center gap-1 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Space Story
          </button>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Simulation Indicator Pill */}
        <button
          id="live-simulation-toggle"
          onClick={() => setIsLiveSimulating(!isLiveSimulating)}
          title={isLiveSimulating ? "Click to pause live market tick simulation" : "Click to resume live market tick simulation"}
          className={`hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border transition-all ${
            isLiveSimulating
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isLiveSimulating ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
          {isLiveSimulating ? 'MARKET LIVE' : 'FEED PAUSED'}
        </button>

        {/* Search input triggering modal */}
        <div
          id="nav-search-bar"
          onClick={onOpenSearch}
          className="relative cursor-pointer group"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-hover:text-white transition-colors" />
          <input
            type="text"
            readOnly
            placeholder="Search assets or creators..."
            className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 rounded-full py-1.5 pl-9 pr-4 text-[13px] text-zinc-200 placeholder:text-zinc-500 cursor-pointer focus:outline-none transition-all w-36 sm:w-48 lg:w-56"
          />
        </div>

        {/* Notifications Icon with dropdown */}
        <div className="relative">
          <button
            id="nav-notifications-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-900 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-[#0A0A0A]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Market Alerts</span>
                <span className="text-[11px] text-emerald-400 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-950/60 hover:bg-zinc-950 cursor-pointer transition-colors border border-zinc-800/60">
                  <div className="flex items-center justify-between text-white font-medium">
                    <span>S&P 500 reached 5,123.45</span>
                    <span className="text-[10px] text-zinc-500">1m ago</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5">Daily session target broken with high volume.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950/60 hover:bg-zinc-950 cursor-pointer transition-colors border border-zinc-800/60">
                  <div className="flex items-center justify-between text-emerald-400 font-medium">
                    <span>NVDA +4.32% Surge</span>
                    <span className="text-[10px] text-zinc-500">12m ago</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5">AI hardware acceleration demand momentum.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User / Paper Trading Profile */}
        <div className="relative">
          <button
            id="nav-profile-btn"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
            aria-label="User Account"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-emerald-400">
              A
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-800 mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black">
                  A
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Elena Vance</div>
                  <div className="text-[10px] text-emerald-500 uppercase tracking-widest font-mono">Curator Tier</div>
                </div>
              </div>
              <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 mb-3">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Current Balance</div>
                <div className="text-xl font-mono text-white mb-2">
                  ${paperBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-emerald-500 rounded-full" />
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenChart(featuredAsset);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 flex items-center gap-2"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Open Live Workspace
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenGetStarted();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5 text-zinc-400" /> Reset Account / Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary Call to Action */}
        <button
          id="nav-get-started-btn"
          onClick={onOpenGetStarted}
          className="bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Get started</span>
        </button>
      </div>
    </nav>
  );
};
