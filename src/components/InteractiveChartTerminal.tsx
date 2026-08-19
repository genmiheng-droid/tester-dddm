import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  Plus,
  Minus,
  Settings,
  Layers,
  Sliders,
  DollarSign,
  Play,
  Pause,
  ChevronDown,
  LineChart as LineChartIcon,
  BarChart2,
  Code,
  Share2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
  Zap,
  Camera,
  Activity,
  Shield,
  SlidersHorizontal,
  ArrowDownRight,
  ArrowUpRight,
  Crosshair as CrosshairIcon,
} from 'lucide-react';
import { MarketAsset, Candlestick, PaperTradePosition, OrderBookLevel } from '../types';
import { generateOrderBook } from '../data/marketsData';

interface InteractiveChartTerminalProps {
  asset: MarketAsset;
  onClose: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
  allAssets: MarketAsset[];
  paperBalance: number;
  setPaperBalance: React.Dispatch<React.SetStateAction<number>>;
  positions: PaperTradePosition[];
  setPositions: React.Dispatch<React.SetStateAction<PaperTradePosition[]>>;
}

export const InteractiveChartTerminal: React.FC<InteractiveChartTerminalProps> = ({
  asset,
  onClose,
  onSelectAsset,
  allAssets,
  paperBalance,
  setPaperBalance,
  positions,
  setPositions,
}) => {
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W'>('15m');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showIndicators, setShowIndicators] = useState(false);
  const [showOrderBook, setShowOrderBook] = useState(true);
  const [activeDrawingTool, setActiveDrawingTool] = useState<'crosshair' | 'trendline' | 'horizontal' | 'fibonacci' | 'risk_reward'>('crosshair');

  const [activeIndicators, setActiveIndicators] = useState({
    ma20: true,
    ma50: true,
    bollinger: true,
    volume: true,
    rsi: true,
  });

  // Advanced Order Execution state
  const [orderExecutionType, setOrderExecutionType] = useState<'MARKET' | 'LIMIT' | 'STOP'>('MARKET');
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<number>(asset.price);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(Number((asset.price * 1.05).toFixed(asset.decimals)));
  const [stopLossPrice, setStopLossPrice] = useState<number>(Number((asset.price * 0.96).toFixed(asset.decimals)));
  const [leverage, setLeverage] = useState<number>(1);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // Active tab in bottom pane
  const [bottomTab, setBottomTab] = useState<'trading' | 'positions' | 'pinescript'>('trading');
  const [pineScriptCode, setPineScriptCode] = useState<string>(
    `//@version=5\nindicator("Alpha Momentum Strategy", overlay=true)\nlength = input(14, "RSI Length")\nprice = close\nvrsi = ta.rsi(price, length)\nplot(ta.sma(close, 20), color=color.emerald, title="20 SMA")\nplot(ta.sma(close, 50), color=color.purple, title="50 SMA")`
  );

  // Chart interactivity
  const [crosshair, setCrosshair] = useState<{ x: number; y: number; candle: Candlestick | null } | null>(null);
  const chartSvgRef = useRef<SVGSVGElement | null>(null);

  const candles = useMemo(() => asset.candlesticks, [asset]);

  const minPrice = useMemo(() => Math.min(...candles.map(c => c.low)) * 0.998, [candles]);
  const maxPrice = useMemo(() => Math.max(...candles.map(c => c.high)) * 1.002, [candles]);
  const priceRange = maxPrice - minPrice || 1;

  const chartHeight = 440;
  const chartWidth = 900;
  const candleSpacing = chartWidth / candles.length;
  const candleWidth = Math.max(3, candleSpacing * 0.65);

  const getY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * (chartHeight - 40) - 20;
  };

  // Generate simulated Order Book (Level 2)
  const orderBook = useMemo(() => generateOrderBook(asset.price, asset.decimals), [asset.price, asset.decimals]);

  // Web Audio fill chime
  const playTradeChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (err) {
      // Audio not permitted or sandbox blocked
    }
  };

  // Execute paper trade
  const handleExecuteTrade = () => {
    const totalNotional = asset.price * orderQuantity;
    const requiredMargin = totalNotional / leverage;

    if (requiredMargin > paperBalance) {
      alert(`Insufficient paper margin! Required: $${requiredMargin.toFixed(2)}, Available: $${paperBalance.toFixed(2)}`);
      return;
    }

    playTradeChime();

    const newPosition: PaperTradePosition = {
      id: `pos-${Date.now()}`,
      symbol: asset.symbol,
      type: orderSide,
      amount: orderQuantity,
      entryPrice: asset.price,
      currentPrice: asset.price,
      pnl: 0,
      pnlPercent: 0,
      entryTime: new Date().toLocaleTimeString(),
      stopLoss: stopLossPrice,
      takeProfit: takeProfitPrice,
      leverage,
      marginUsed: requiredMargin,
    };

    setPositions(prev => [newPosition, ...prev]);
    setPaperBalance(prev => prev - requiredMargin);

    setOrderSuccessMsg(`⚡ Executed ${leverage}x ${orderSide} order: ${orderQuantity} ${asset.symbol} @ $${asset.price.toFixed(asset.decimals)}`);
    setTimeout(() => setOrderSuccessMsg(null), 4000);
    setBottomTab('positions');
  };

  const handleClosePosition = (id: string) => {
    const pos = positions.find(p => p.id === id);
    if (!pos) return;

    const notionalDiff = pos.type === 'BUY'
      ? (asset.price - pos.entryPrice) * pos.amount * (pos.leverage || 1)
      : (pos.entryPrice - asset.price) * pos.amount * (pos.leverage || 1);

    const marginReturn = (pos.marginUsed || (pos.amount * pos.entryPrice)) + notionalDiff;

    setPaperBalance(prev => Math.max(0, prev + marginReturn));
    setPositions(positions.filter(p => p.id !== id));
    playTradeChime();
  };

  const handleCaptureScreenshot = () => {
    alert(`📸 Chart snapshot saved for ${asset.symbol} (${timeframe}) with active indicators.`);
  };

  // Handle crosshair calculation
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartSvgRef.current) return;
    const rect = chartSvgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const candleIdx = Math.min(
      Math.max(0, Math.floor(x / (rect.width / candles.length))),
      candles.length - 1
    );

    setCrosshair({
      x,
      y,
      candle: candles[candleIdx] || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        id="chart-terminal-modal"
        className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl w-full max-w-7xl h-[94vh] max-h-[940px] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="bg-zinc-900/95 px-4 py-2.5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Symbol info & quick asset dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-xl text-white font-bold text-sm tracking-wide cursor-pointer transition-colors">
                <span>{asset.symbol}</span>
                <span className="text-[11px] text-zinc-400 font-mono font-normal">{asset.exchange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Quick switch dropdown */}
              <div className="absolute top-full left-0 mt-1 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1 hidden group-hover:block z-50">
                {allAssets.map(a => (
                  <button
                    key={a.symbol}
                    onClick={() => onSelectAsset(a)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex justify-between items-center cursor-pointer ${
                      a.symbol === asset.symbol ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{a.symbol}</span>
                    <span className={`font-mono ${a.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {a.price.toFixed(a.decimals)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold font-mono text-white">
                ${asset.price.toLocaleString('en-US', { minimumFractionDigits: asset.decimals, maximumFractionDigits: asset.decimals })}
              </span>
              <span className={`font-mono font-semibold text-xs flex items-center ${asset.change >= 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(asset.decimals)} ({asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-full border border-zinc-800">
            {(['1m', '5m', '15m', '1h', '4h', '1D', '1W'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer font-mono ${
                  timeframe === tf ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Controls & Utilities */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-950 p-0.5 rounded-xl border border-zinc-800">
              <button
                onClick={() => setChartType('candles')}
                title="Candlesticks"
                className={`p-1.5 rounded-lg cursor-pointer ${chartType === 'candles' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setChartType('line')}
                title="Line Chart"
                className={`p-1.5 rounded-lg cursor-pointer ${chartType === 'line' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                <LineChartIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Indicators dropdown toggle */}
            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className={`px-3 py-1 rounded-full border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                showIndicators ? 'bg-emerald-500 text-black font-bold border-emerald-500' : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Indicators</span>
            </button>

            {/* Order Book Toggle */}
            <button
              onClick={() => setShowOrderBook(!showOrderBook)}
              className={`px-3 py-1 rounded-full border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                showOrderBook ? 'bg-zinc-800 text-emerald-400 border-zinc-700' : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>DOM L2</span>
            </button>

            {/* Screenshot button */}
            <button
              onClick={handleCaptureScreenshot}
              title="Capture Snapshot"
              className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Indicator pills bar */}
        {showIndicators && (
          <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="text-zinc-500 font-semibold text-[11px] uppercase">// Active Studies:</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={activeIndicators.ma20}
                onChange={e => setActiveIndicators(prev => ({ ...prev, ma20: e.target.checked }))}
                className="rounded bg-zinc-900 border-zinc-800 text-emerald-500"
              />
              <span className="text-emerald-400 font-medium">MA (20)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={activeIndicators.ma50}
                onChange={e => setActiveIndicators(prev => ({ ...prev, ma50: e.target.checked }))}
                className="rounded bg-zinc-900 border-zinc-800"
              />
              <span className="text-purple-400 font-medium">MA (50)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={activeIndicators.bollinger}
                onChange={e => setActiveIndicators(prev => ({ ...prev, bollinger: e.target.checked }))}
                className="rounded bg-zinc-900 border-zinc-800"
              />
              <span className="text-cyan-400 font-medium">Bollinger Bands (20,2)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={activeIndicators.rsi}
                onChange={e => setActiveIndicators(prev => ({ ...prev, rsi: e.target.checked }))}
                className="rounded bg-zinc-900 border-zinc-800"
              />
              <span className="text-amber-400 font-medium">RSI (14)</span>
            </label>
          </div>
        )}

        {/* Main Work Area: Pro Left Toolbar + Center Chart + Right Watchlist / DOM */}
        <div className="flex-1 flex overflow-hidden">
          {/* Pro Drawing Tools Toolbar (Left) */}
          <div className="w-12 bg-zinc-900/80 border-r border-zinc-800 flex flex-col items-center py-3 gap-2 text-zinc-500">
            <button
              onClick={() => setActiveDrawingTool('crosshair')}
              title="Crosshair (C)"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeDrawingTool === 'crosshair' ? 'bg-zinc-800 text-emerald-400' : 'hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <CrosshairIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveDrawingTool('trendline')}
              title="Trendline Ray (Alt+T)"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeDrawingTool === 'trendline' ? 'bg-zinc-800 text-emerald-400' : 'hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveDrawingTool('horizontal')}
              title="Horizontal Support/Resistance"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeDrawingTool === 'horizontal' ? 'bg-zinc-800 text-emerald-400' : 'hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveDrawingTool('fibonacci')}
              title="Fibonacci Retracement Grid"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeDrawingTool === 'fibonacci' ? 'bg-zinc-800 text-emerald-400' : 'hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveDrawingTool('risk_reward')}
              title="Long/Short Risk-Reward Box"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeDrawingTool === 'risk_reward' ? 'bg-zinc-800 text-emerald-400' : 'hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>

          {/* Central Interactive Chart Stage */}
          <div className="flex-1 flex flex-col relative bg-[#0A0A0A] overflow-hidden">
            {orderSuccessMsg && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-emerald-500 text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{orderSuccessMsg}</span>
              </div>
            )}

            {/* OHLC Bar when hovered */}
            {crosshair?.candle && (
              <div className="absolute top-2 left-4 z-20 flex items-center gap-3 text-[11px] font-mono bg-zinc-900/90 px-3 py-1 rounded-full border border-zinc-800 shadow-md">
                <span className="text-zinc-500">{crosshair.candle.time}</span>
                <span className="text-zinc-400">O: <span className="text-white">{crosshair.candle.open.toFixed(asset.decimals)}</span></span>
                <span className="text-zinc-400">H: <span className="text-white">{crosshair.candle.high.toFixed(asset.decimals)}</span></span>
                <span className="text-zinc-400">L: <span className="text-white">{crosshair.candle.low.toFixed(asset.decimals)}</span></span>
                <span className="text-zinc-400">C: <span className="text-white">{crosshair.candle.close.toFixed(asset.decimals)}</span></span>
              </div>
            )}

            {/* Drawing tool active indicator badge */}
            {activeDrawingTool !== 'crosshair' && (
              <div className="absolute top-2 right-4 z-20 flex items-center gap-1.5 text-[10px] font-mono bg-zinc-900 px-2.5 py-0.5 rounded-full border border-emerald-500/50 text-emerald-400 shadow-md">
                <span>Active Tool: {activeDrawingTool.toUpperCase()}</span>
              </div>
            )}

            {/* SVG Chart Surface */}
            <div className="flex-1 relative w-full h-full cursor-crosshair">
              <svg
                ref={chartSvgRef}
                className="w-full h-full"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setCrosshair(null)}
              >
                {/* Horizontal grid lines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => (
                  <line
                    key={idx}
                    x1="0"
                    y1={chartHeight * ratio}
                    x2="100%"
                    y2={chartHeight * ratio}
                    stroke="#27272a"
                    strokeDasharray="3 3"
                    strokeWidth="0.75"
                  />
                ))}

                {/* Fibonacci Overlay (if active) */}
                {activeDrawingTool === 'fibonacci' && (
                  <g opacity="0.6">
                    {[
                      { level: '0.0 (High)', y: getY(maxPrice), color: '#34d399' },
                      { level: '0.236', y: getY(maxPrice - priceRange * 0.236), color: '#38bdf8' },
                      { level: '0.382', y: getY(maxPrice - priceRange * 0.382), color: '#fbbf24' },
                      { level: '0.500', y: getY(maxPrice - priceRange * 0.5), color: '#a855f7' },
                      { level: '0.618 (Golden)', y: getY(maxPrice - priceRange * 0.618), color: '#ec4899' },
                      { level: '1.0 (Low)', y: getY(minPrice), color: '#f87171' },
                    ].map((fib, i) => (
                      <g key={i}>
                        <line x1="0" y1={fib.y} x2="100%" y2={fib.y} stroke={fib.color} strokeDasharray="4 2" strokeWidth="1" />
                        <text x="10" y={fib.y - 4} fill={fib.color} fontSize="9" fontFamily="monospace">{fib.level}</text>
                      </g>
                    ))}
                  </g>
                )}

                {/* Risk-Reward Box Overlay (if active) */}
                {activeDrawingTool === 'risk_reward' && (
                  <g opacity="0.25">
                    {/* Target Profit Area (Green) */}
                    <rect
                      x="200"
                      y={getY(asset.price * 1.04)}
                      width="350"
                      height={Math.abs(getY(asset.price) - getY(asset.price * 1.04))}
                      fill="#10b981"
                    />
                    {/* Stop Loss Area (Red) */}
                    <rect
                      x="200"
                      y={getY(asset.price)}
                      width="350"
                      height={Math.abs(getY(asset.price * 0.98) - getY(asset.price))}
                      fill="#ef4444"
                    />
                  </g>
                )}

                {/* Candles or Line rendering */}
                {chartType === 'candles' ? (
                  candles.map((c, i) => {
                    const x = i * candleSpacing + candleSpacing / 2;
                    const isGreen = c.close >= c.open;
                    const color = isGreen ? '#34d399' : '#f87171';
                    const yHigh = getY(c.high);
                    const yLow = getY(c.low);
                    const yOpen = getY(c.open);
                    const yClose = getY(c.close);
                    const bodyY = Math.min(yOpen, yClose);
                    const bodyHeight = Math.max(1.5, Math.abs(yOpen - yClose));
                    const rectX = x - candleWidth / 2;

                    return (
                      <g key={i}>
                        <line
                          x1={x}
                          y1={yHigh}
                          x2={x}
                          y2={yLow}
                          stroke={color}
                          strokeWidth="1.25"
                        />
                        <rect
                          x={rectX}
                          y={bodyY}
                          width={candleWidth}
                          height={bodyHeight}
                          fill={color}
                          stroke={color}
                          strokeWidth="0.5"
                          rx="0.5"
                        />
                      </g>
                    );
                  })
                ) : (
                  <path
                    d={candles.map((c, i) => {
                      const x = i * candleSpacing + candleSpacing / 2;
                      const y = getY(c.close);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2.5"
                  />
                )}

                {/* Current Price Line */}
                <line
                  x1="0"
                  y1={getY(asset.price)}
                  x2="100%"
                  y2={getY(asset.price)}
                  stroke={asset.change >= 0 ? '#34d399' : '#f87171'}
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>

          {/* Right Panel: Level 2 Order Book & Watchlist */}
          <div className="w-72 bg-zinc-900/90 border-l border-zinc-800 hidden lg:flex flex-col">
            {showOrderBook ? (
              /* Level 2 DOM View */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">// Level 2 Depth</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Live Bids/Asks</span>
                </div>

                <div className="p-2 border-b border-zinc-800 text-[10px] font-mono grid grid-cols-3 text-zinc-500">
                  <span>Price (USD)</span>
                  <span className="text-center">Size</span>
                  <span className="text-right">Total</span>
                </div>

                {/* Asks (Red) */}
                <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40 text-[11px] font-mono">
                  {orderBook.asks.slice(0, 5).reverse().map((ask, idx) => (
                    <div key={idx} className="px-3 py-1 flex justify-between relative">
                      <div
                        className="absolute inset-0 bg-red-950/30 -z-10"
                        style={{ width: `${Math.min(100, (ask.total / 15) * 100)}%` }}
                      />
                      <span className="text-red-400 font-medium">{ask.price.toFixed(asset.decimals)}</span>
                      <span className="text-zinc-400 text-center">{ask.amount}</span>
                      <span className="text-zinc-500 text-right">{ask.total}</span>
                    </div>
                  ))}
                </div>

                {/* Spread */}
                <div className="py-1.5 px-3 bg-zinc-950 border-y border-zinc-800 flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-white">${asset.price.toFixed(asset.decimals)}</span>
                  <span className="text-[10px] text-zinc-500">Spread: ${(asset.price * 0.0004).toFixed(asset.decimals)}</span>
                </div>

                {/* Bids (Green) */}
                <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40 text-[11px] font-mono">
                  {orderBook.bids.slice(0, 5).map((bid, idx) => (
                    <div key={idx} className="px-3 py-1 flex justify-between relative">
                      <div
                        className="absolute inset-0 bg-emerald-950/30 -z-10"
                        style={{ width: `${Math.min(100, (bid.total / 15) * 100)}%` }}
                      />
                      <span className="text-emerald-400 font-medium">{bid.price.toFixed(asset.decimals)}</span>
                      <span className="text-zinc-400 text-center">{bid.amount}</span>
                      <span className="text-zinc-500 text-right">{bid.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Watchlist View */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">// Watchlist</span>
                  <span className="text-[11px] text-zinc-500 font-mono">{allAssets.length} symbols</span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60">
                  {allAssets.map(item => (
                    <div
                      key={item.symbol}
                      onClick={() => onSelectAsset(item)}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                        item.symbol === asset.symbol ? 'bg-zinc-800 border-l-2 border-emerald-500' : 'hover:bg-zinc-800/50'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{item.symbol}</div>
                        <div className="text-[10px] text-zinc-500 truncate max-w-[90px]">{item.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-semibold text-white">
                          {item.price.toFixed(item.decimals)}
                        </div>
                        <div className={`text-[10px] font-mono font-semibold ${item.change >= 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Tabs: Direct Market Access (DMA) Order Ticket / Positions Ledger / Pine Editor */}
        <div className="bg-zinc-900/95 border-t border-zinc-800 flex flex-col">
          {/* Tab Selector */}
          <div className="flex items-center gap-4 px-4 pt-2 border-b border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setBottomTab('trading')}
              className={`pb-2 font-semibold flex items-center gap-1.5 cursor-pointer ${
                bottomTab === 'trading' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Pro Order Ticket
            </button>
            <button
              onClick={() => setBottomTab('positions')}
              className={`pb-2 font-semibold flex items-center gap-1.5 cursor-pointer ${
                bottomTab === 'positions' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Live Positions &amp; Margin ({positions.length})
            </button>
            <button
              onClick={() => setBottomTab('pinescript')}
              className={`pb-2 font-semibold flex items-center gap-1.5 cursor-pointer ${
                bottomTab === 'pinescript' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Pine Script® v5
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-3 max-h-52 overflow-y-auto">
            {bottomTab === 'trading' ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Order Type & Side */}
                <div className="space-y-2">
                  <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                    <button
                      onClick={() => setOrderSide('BUY')}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        orderSide === 'BUY' ? 'bg-emerald-500 text-black' : 'text-zinc-400'
                      }`}
                    >
                      BUY / LONG
                    </button>
                    <button
                      onClick={() => setOrderSide('SELL')}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        orderSide === 'SELL' ? 'bg-red-500 text-white' : 'text-zinc-400'
                      }`}
                    >
                      SELL / SHORT
                    </button>
                  </div>

                  {/* Leverage slider */}
                  <div className="bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500 text-[10px]">LEVERAGE</span>
                    <div className="flex items-center gap-1.5">
                      {[1, 5, 10, 25, 50].map(lev => (
                        <button
                          key={lev}
                          onClick={() => setLeverage(lev)}
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            leverage === lev ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {lev}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quantity & Targets */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-500">QUANTITY</span>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={orderQuantity}
                      onChange={e => setOrderQuantity(Math.max(0.01, parseFloat(e.target.value) || 1))}
                      className="w-20 bg-transparent text-white text-right font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-emerald-400">TP TARGET</span>
                    <input
                      type="number"
                      step="0.1"
                      value={takeProfitPrice}
                      onChange={e => setTakeProfitPrice(parseFloat(e.target.value) || asset.price)}
                      className="w-24 bg-transparent text-emerald-400 text-right font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Account & Margin Overview */}
                <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-zinc-500">AVAIL MARGIN</span>
                    <span className="text-white font-bold">${paperBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-zinc-500">REQ MARGIN</span>
                    <span className="text-emerald-400 font-semibold">${((asset.price * orderQuantity) / leverage).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-zinc-500">NOTIONAL VALUE</span>
                    <span className="text-zinc-300 font-semibold">${(asset.price * orderQuantity).toFixed(2)}</span>
                  </div>
                </div>

                {/* Execution Button */}
                <div>
                  <button
                    onClick={handleExecuteTrade}
                    className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center ${
                      orderSide === 'BUY'
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                        : 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20'
                    }`}
                  >
                    <span>PLACE {orderSide} ORDER</span>
                    <span className="text-[10px] font-normal opacity-80">
                      {orderQuantity} {asset.symbol} @ Market (${asset.price.toFixed(asset.decimals)})
                    </span>
                  </button>
                </div>
              </div>
            ) : bottomTab === 'positions' ? (
              /* Positions Ledger */
              <div className="overflow-x-auto text-xs font-mono">
                {positions.length === 0 ? (
                  <div className="py-6 text-center text-zinc-500 italic">
                    No active positions currently running. Execute a trade in the Order Ticket to simulate live risk.
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="text-[10px] text-zinc-500 uppercase border-b border-zinc-800">
                      <tr>
                        <th className="pb-2">Side</th>
                        <th className="pb-2">Symbol</th>
                        <th className="pb-2">Size</th>
                        <th className="pb-2">Entry Price</th>
                        <th className="pb-2">Mark Price</th>
                        <th className="pb-2">Margin</th>
                        <th className="pb-2">Unrealized PnL</th>
                        <th className="pb-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {positions.map(pos => {
                        const notionalDiff = pos.type === 'BUY'
                          ? (asset.price - pos.entryPrice) * pos.amount * (pos.leverage || 1)
                          : (pos.entryPrice - asset.price) * pos.amount * (pos.leverage || 1);
                        const isWin = notionalDiff >= 0;

                        return (
                          <tr key={pos.id} className="hover:bg-zinc-800/30">
                            <td className="py-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                pos.type === 'BUY' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                              }`}>
                                {pos.type} {pos.leverage || 1}x
                              </span>
                            </td>
                            <td className="py-2 text-white font-bold">{pos.symbol}</td>
                            <td className="py-2 text-zinc-300">{pos.amount}</td>
                            <td className="py-2 text-zinc-400">${pos.entryPrice.toFixed(2)}</td>
                            <td className="py-2 text-white font-bold">${asset.price.toFixed(2)}</td>
                            <td className="py-2 text-zinc-400">${(pos.marginUsed || 0).toFixed(2)}</td>
                            <td className="py-2">
                              <span className={`font-bold ${isWin ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isWin ? '+' : ''}${notionalDiff.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-2 text-right">
                              <button
                                onClick={() => handleClosePosition(pos.id)}
                                className="px-3 py-1 rounded-full bg-zinc-800 hover:bg-red-600 hover:text-white text-zinc-300 text-[10px] font-bold cursor-pointer transition-colors"
                              >
                                Market Close
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              /* Pine Script tab */
              <div className="flex flex-col gap-2">
                <textarea
                  value={pineScriptCode}
                  onChange={e => setPineScriptCode(e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-950 text-zinc-200 font-mono text-xs p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-emerald-500"
                />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-mono">Pine Script® v5 Compiler Ready</span>
                  <button
                    onClick={() => alert('Pine Script Compiled and Attached to Canvas!')}
                    className="bg-emerald-500 text-black px-4 py-1.5 rounded-full font-bold hover:bg-emerald-400 cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    Add to Chart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
