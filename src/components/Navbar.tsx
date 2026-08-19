import React, { useState } from 'react';
import {
  Search,
  User,
  Bell,
  Activity,
  Sparkles,
  TrendingUp,
  BookOpen,
  ShieldCheck,
  Newspaper,
  Globe,
  Sliders,
  LayoutGrid,
  Calendar,
  SlidersHorizontal,
  HelpCircle,
} from 'lucide-react';
import { MarketAsset } from '../types';

export type NavViewType = 'home' | 'chart' | 'heatmap' | 'screener' | 'calendar' | 'community' | 'news' | 'brokers';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenGetStarted: () => void;
  onOpenChart: (asset: MarketAsset) => void;
  onOpenSpaceStory: () => void;
  onOpenHotkeys?: () => void;
  activeView: NavViewType;
  setActiveView: (view: NavViewType) => void;
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
  onOpenHotkeys,
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
      className="bg-[#0A0A0A]/95 text-zinc-400 w-full h-[56px] flex items-center justify-between px-3 sm:px-6 fixed top-0 z-50 glass-panel shadow-sm border-b border-zinc-800 backdrop-blur-md"
    >
      {/* Left branding & links */}
      <div className="flex items-center gap-4 lg:gap-6">
        <button
          id="brand-logo-btn"
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16L9 11L13 15L20 8" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 8H20V12" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-[18px] sm:text-[20px] font-bold text-white tracking-tight leading-none">
              TradingView
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest leading-none mt-0.5">
              PRO TERMINAL
            </span>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] font-medium">
          <button
            onClick={() => onOpenChart(featuredAsset)}
            className={`cursor-pointer px-2.5 py-1 rounded-full transition-colors flex items-center gap-1.5 ${
              activeView === 'chart'
                ? 'bg-emerald-500 text-black font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Terminal
          </button>

          <button
            onClick={() => setActiveView('home')}
            className={`cursor-pointer px-2.5 py-1 rounded-full transition-colors ${
              activeView === 'home'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Markets
          </button>

          <button
            onClick={() => setActiveView('heatmap')}
            className={`cursor-pointer px-2.5 py-1 rounded-full transition-colors flex items-center gap-1.5 ${
              activeView === 'heatmap'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
            Heatmap
          </button>

          <button
            onClick={() => setActiveView('screener')}
            className={`cursor-pointer px-2.5 py-1 rounded-full transition-colors flex items-center gap-1.5 ${
              activeView === 'screener'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            Screener
          </button>

          <button
            onClick={() => setActiveView('calendar')}
            className={`cursor-pointer px-2.5 py-1 rounded-full transition-colors flex items-center gap-1.5 ${
              activeView === 'calendar'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            Macro Calendar
          </button>

          <button
            onClick={() => setActiveView('community')}
            className={`cursor-pointer px-2.5 py-1 rounded-full transition-colors ${
              activeView === 'community'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Community
          </button>

          <button
            onClick={() => setActiveView('news')}
            className={`cursor-pointer px-2.5 py-1 rounded-full transition-colors ${
              activeView === 'news'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            News
          </button>

          <button
            onClick={() => setActiveView('brokers')}
            className={`cursor-pointer px-2.5 py-1 rounded-full transition-colors ${
              activeView === 'brokers'
                ? 'bg-zinc-800 text-white font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Brokers
          </button>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Simulation Indicator Pill */}
        <button
          id="live-simulation-toggle"
          onClick={() => setIsLiveSimulating(!isLiveSimulating)}
          title={isLiveSimulating ? "Click to pause live market tick simulation" : "Click to resume live market tick simulation"}
          className={`hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border transition-all cursor-pointer ${
            isLiveSimulating
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isLiveSimulating ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
          {isLiveSimulating ? 'FEED LIVE' : 'PAUSED'}
        </button>

        {/* Search input triggering modal */}
        <div
          id="nav-search-bar"
          onClick={onOpenSearch}
          className="relative cursor-pointer group"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5 group-hover:text-white transition-colors" />
          <input
            type="text"
            readOnly
            placeholder="Search symbols (Ctrl+K)..."
            className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 rounded-full py-1 pl-8 pr-3 text-[12px] font-mono text-zinc-200 placeholder:text-zinc-500 cursor-pointer focus:outline-none transition-all w-28 sm:w-44 lg:w-52"
          />
        </div>

        {/* Hotkeys helper button */}
        {onOpenHotkeys && (
          <button
            onClick={onOpenHotkeys}
            title="Keyboard Shortcuts"
            className="hidden sm:flex text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}

        {/* Notifications Icon with dropdown */}
        <div className="relative">
          <button
            id="nav-notifications-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-900 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-[#0A0A0A]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">// High-Priority Alerts</span>
                <span className="text-[11px] font-mono text-emerald-400 cursor-pointer hover:underline">Mark read</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-950 cursor-pointer transition-colors border border-zinc-800">
                  <div className="flex items-center justify-between text-white font-bold">
                    <span>S&P 500 reached 5,123.45</span>
                    <span className="text-[10px] text-zinc-500 font-normal">1m ago</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5 font-sans">Daily session target broken with institutional volume expansion.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-950 cursor-pointer transition-colors border border-zinc-800">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>NVDA +4.32% Surge</span>
                    <span className="text-[10px] text-zinc-500 font-normal">12m ago</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5 font-sans">Breakout above 20-day exponential moving average.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account / Buying Power Indicator */}
        <div className="relative">
          <button
            id="nav-profile-btn"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-900 transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label="User Account"
          >
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">
              E
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-800 mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black font-mono">
                  E
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Elena Vance</div>
                  <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono font-bold">VIP Institutional Tier</div>
                </div>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 mb-3">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-mono">Available Paper Margin</div>
                <div className="text-xl font-mono font-bold text-white mb-2">
                  ${paperBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-emerald-500 rounded-full" />
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenChart(featuredAsset);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 flex items-center gap-2 cursor-pointer font-mono"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Open DMA Terminal
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenGetStarted();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 flex items-center gap-2 cursor-pointer font-mono"
                >
                  <Sliders className="w-3.5 h-3.5 text-zinc-400" /> Reset Paper Capital
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary Call to Action */}
        <button
          id="nav-get-started-btn"
          onClick={onOpenGetStarted}
          className="bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95 px-3.5 py-1 rounded-full text-[12px] font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer font-mono"
        >
          <span>Get Started</span>
        </button>
      </div>
    </nav>
  );
};
