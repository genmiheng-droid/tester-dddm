import React, { useState, useEffect } from 'react';
import { Navbar, NavViewType } from './components/Navbar';
import { ProTickerTape } from './components/ProTickerTape';
import { HeroSection } from './components/HeroSection';
import { LiveMarketsGrid } from './components/LiveMarketsGrid';
import { StatsSection } from './components/StatsSection';
import { InteractiveChartTerminal } from './components/InteractiveChartTerminal';
import { MarketHeatmapSection } from './components/MarketHeatmapSection';
import { EconomicCalendarSection } from './components/EconomicCalendarSection';
import { ProScreenerSection } from './components/ProScreenerSection';
import { SpaceStoryModal } from './components/SpaceStoryModal';
import { SearchModal } from './components/SearchModal';
import { GetStartedModal } from './components/GetStartedModal';
import { HotkeysModal } from './components/HotkeysModal';
import { CommunityIdeasSection } from './components/CommunityIdeasSection';
import { NewsSection } from './components/NewsSection';
import { BrokersSection } from './components/BrokersSection';
import { Footer } from './components/Footer';
import { initialMarketAssets } from './data/marketsData';
import { MarketAsset, PaperTradePosition } from './types';

export default function App() {
  const [assets, setAssets] = useState<MarketAsset[]>(initialMarketAssets);
  const [activeView, setActiveView] = useState<NavViewType>('home');
  const [selectedAssetForChart, setSelectedAssetForChart] = useState<MarketAsset | null>(null);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSpaceStoryOpen, setIsSpaceStoryOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [isHotkeysOpen, setIsHotkeysOpen] = useState(false);

  // Simulation & Paper Trading
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);
  const [flashingSymbols, setFlashingSymbols] = useState<{ [symbol: string]: 'up' | 'down' }>({});
  const [paperBalance, setPaperBalance] = useState<number>(100000.0);
  const [positions, setPositions] = useState<PaperTradePosition[]>([]);

  // Keyboard shortcut listener for hotkeys '?'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        setIsHotkeysOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market tick generator
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 2) + 1;
      const targetIndices: number[] = [];

      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * assets.length);
        if (!targetIndices.includes(idx)) targetIndices.push(idx);
      }

      setAssets(prevAssets => {
        const newAssets = [...prevAssets];
        const newFlashes: { [symbol: string]: 'up' | 'down' } = {};

        targetIndices.forEach(idx => {
          const item = newAssets[idx];
          const volatility = item.category === 'crypto' ? 0.0018 : item.category === 'forex' ? 0.0002 : 0.0008;
          const direction = Math.random() > 0.49 ? 1 : -1;
          const delta = direction * item.price * volatility * (Math.random() * 0.9 + 0.1);
          const newPrice = Number(Math.max(0.0001, item.price + delta).toFixed(item.decimals));
          const newChange = item.change + delta;
          const newChangePercent = Number(((newChange / (newPrice - newChange)) * 100).toFixed(2));

          const flashType = delta >= 0 ? 'up' : 'down';
          newFlashes[item.symbol] = flashType;

          // Append to sparkline
          const sparkVal = item.sparkline.length > 0 ? item.sparkline[item.sparkline.length - 1] + (direction * (Math.random() * 5 + 1)) : 10;
          const updatedSpark = [...item.sparkline.slice(1), Math.max(0, Math.min(30, sparkVal))];

          // Update latest candlestick
          const updatedCandles = [...item.candlesticks];
          if (updatedCandles.length > 0) {
            const lastCandle = { ...updatedCandles[updatedCandles.length - 1] };
            lastCandle.close = newPrice;
            lastCandle.high = Math.max(lastCandle.high, newPrice);
            lastCandle.low = Math.min(lastCandle.low, newPrice);
            lastCandle.volume += Math.floor(Math.random() * 200 + 50);
            updatedCandles[updatedCandles.length - 1] = lastCandle;
          }

          newAssets[idx] = {
            ...item,
            price: newPrice,
            change: Number(newChange.toFixed(item.decimals)),
            changePercent: newChangePercent,
            sparkline: updatedSpark,
            candlesticks: updatedCandles,
          };
        });

        setFlashingSymbols(newFlashes);
        setTimeout(() => {
          setFlashingSymbols({});
        }, 800);

        return newAssets;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveSimulating, assets.length]);

  // Keep selected chart asset synced with live price updates
  useEffect(() => {
    if (selectedAssetForChart) {
      const updated = assets.find(a => a.symbol === selectedAssetForChart.symbol);
      if (updated && updated.price !== selectedAssetForChart.price) {
        setSelectedAssetForChart(updated);
      }
    }
  }, [assets, selectedAssetForChart]);

  // Handle open chart
  const handleOpenChart = (asset: MarketAsset) => {
    setSelectedAssetForChart(asset);
  };

  const handleOpenChartBySymbol = (symbol: string) => {
    const found = assets.find(a => a.symbol === symbol) || assets[0];
    setSelectedAssetForChart(found);
  };

  const handleGetStartedConfirm = (startingCash: number, traderName: string) => {
    setPaperBalance(startingCash);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-400 flex flex-col font-['Inter',sans-serif] selection:bg-emerald-500 selection:text-black">
      {/* Fixed Top Navigation Bar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
        onOpenChart={handleOpenChart}
        onOpenSpaceStory={() => setIsSpaceStoryOpen(true)}
        onOpenHotkeys={() => setIsHotkeysOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        featuredAsset={assets[0]}
        isLiveSimulating={isLiveSimulating}
        setIsLiveSimulating={setIsLiveSimulating}
        paperBalance={paperBalance}
      />

      {/* Pro Ticker Tape Bar (Fixed below navbar) */}
      <ProTickerTape
        assets={assets}
        onSelectAsset={handleOpenChart}
        isLiveSimulating={isLiveSimulating}
      />

      {/* Main Screen Views with offset for fixed navbar + ticker tape */}
      <main className="flex-1 flex flex-col pt-[90px]">
        {activeView === 'home' && (
          <>
            {/* Exact Hero Section with Image, Title, Subtitle, CTAs & Space Widget */}
            <HeroSection
              onGetStarted={() => setIsGetStartedOpen(true)}
              onOpenSpaceStory={() => setIsSpaceStoryOpen(true)}
            />

            {/* Live Markets 4-Card Dense Grid (S&P 500, NASDAQ 100, BTCUSD, EURUSD, etc.) */}
            <LiveMarketsGrid
              assets={assets}
              onSelectAsset={handleOpenChart}
              flashingSymbols={flashingSymbols}
            />

            {/* Sector Heatmap & Flow Preview */}
            <MarketHeatmapSection
              onSelectSymbol={handleOpenChartBySymbol}
              allAssets={assets}
            />

            {/* Technical Screener Preview */}
            <ProScreenerSection
              assets={assets}
              onSelectAsset={handleOpenChart}
            />

            {/* Economic Calendar */}
            <EconomicCalendarSection />

            {/* Social Proof / Stats Section (60M+, #1, 1.5M+, 8M+) */}
            <StatsSection />

            {/* Featured Community Ideas */}
            <CommunityIdeasSection
              onOpenChart={handleOpenChartBySymbol}
              allAssets={assets}
            />
          </>
        )}

        {activeView === 'heatmap' && (
          <div className="py-4">
            <MarketHeatmapSection
              onSelectSymbol={handleOpenChartBySymbol}
              allAssets={assets}
            />
          </div>
        )}

        {activeView === 'screener' && (
          <div className="py-4">
            <ProScreenerSection
              assets={assets}
              onSelectAsset={handleOpenChart}
            />
          </div>
        )}

        {activeView === 'calendar' && (
          <div className="py-4">
            <EconomicCalendarSection />
          </div>
        )}

        {activeView === 'community' && (
          <div className="py-4">
            <CommunityIdeasSection
              onOpenChart={handleOpenChartBySymbol}
              allAssets={assets}
            />
          </div>
        )}

        {activeView === 'news' && (
          <div className="py-4">
            <NewsSection />
          </div>
        )}

        {activeView === 'brokers' && (
          <div className="py-4">
            <BrokersSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Chart Terminal Modal */}
      {selectedAssetForChart && (
        <InteractiveChartTerminal
          asset={selectedAssetForChart}
          onClose={() => setSelectedAssetForChart(null)}
          onSelectAsset={handleOpenChart}
          allAssets={assets}
          paperBalance={paperBalance}
          setPaperBalance={setPaperBalance}
          positions={positions}
          setPositions={setPositions}
        />
      )}

      {/* Scott "Kidd" Poteet / Polaris Dawn Space Story Modal */}
      {isSpaceStoryOpen && (
        <SpaceStoryModal
          onClose={() => setIsSpaceStoryOpen(false)}
          onExploreMarkets={() => {
            setIsSpaceStoryOpen(false);
            const el = document.getElementById('live-markets-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Universal Search Command Palette (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={assets}
        onSelectAsset={handleOpenChart}
      />

      {/* Get Started / Paper Trading Setup Modal */}
      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
        onConfirm={handleGetStartedConfirm}
        currentBalance={paperBalance}
      />

      {/* Pro Keyboard Shortcuts Modal */}
      <HotkeysModal
        isOpen={isHotkeysOpen}
        onClose={() => setIsHotkeysOpen(false)}
      />
    </div>
  );
}
