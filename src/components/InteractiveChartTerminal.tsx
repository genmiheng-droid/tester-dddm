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
} from 'lucide-react';
import { MarketAsset, Candlestick, PaperTradePosition } from '../types';

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
  const [chartType, setChartType] = useState<'candles' | 'line' | 'area'>('candles');
  const [showIndicators, setShowIndicators] = useState(false);
  const [activeIndicators, setActiveIndicators] = useState({
    ma20: true,
    ma50: true,
    bollinger: true,
    volume: true,
    rsi: true,
  });

  // Paper trading order state
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // Active tab in bottom pane
  const [bottomTab, setBottomTab] = useState<'trading' | 'pinescript'>('trading');
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

  const chartHeight = 420;
  const chartWidth = 900;
  const candleSpacing = chartWidth / candles.length;
  const candleWidth = Math.max(2, candleSpacing * 0.65);

  const getY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * (chartHeight - 40) - 20;
  };

  // Execute paper trade
  const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
    const totalCost = asset.price * orderQuantity;
    if (type === 'BUY' && totalCost > paperBalance) {
      alert('Insufficient paper trading buying power!');
      return;
    }

    const newPosition: PaperTradePosition = {
      id: `pos-${Date.now()}`,
      symbol: asset.symbol,
      type,
      amount: orderQuantity,
      entryPrice: asset.price,
      currentPrice: asset.price,
      pnl: 0,
      pnlPercent: 0,
      entryTime: new Date().toLocaleTimeString(),
    };

    setPositions(prev => [newPosition, ...prev]);
    if (type === 'BUY') {
      setPaperBalance(prev => prev - totalCost);
    } else {
      setPaperBalance(prev => prev + totalCost);
    }

    setOrderSuccessMsg(`Simulated ${type} order filled for ${orderQuantity} ${asset.symbol} @ $${asset.price.toFixed(asset.decimals)}`);
    setTimeout(() => setOrderSuccessMsg(null), 4000);
  };

  const handleClosePosition = (id: string) => {
    const pos = positions.find(p => p.id === id);
    if (!pos) return;

    const returnCash = pos.amount * asset.price;
    if (pos.type === 'BUY') {
      setPaperBalance(prev => prev + returnCash);
    } else {
      setPaperBalance(prev => prev - returnCash);
    }

    setPositions(positions.filter(p => p.id !== id));
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
        className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl w-full max-w-7xl h-[92vh] max-h-[900px] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="bg-zinc-900/90 px-4 py-2.5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Symbol info & quick asset dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-xl text-white font-bold text-sm tracking-wide">
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
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex justify-between items-center ${
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
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  timeframe === tf ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Types & Indicator controls */}
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

            {/* Close button */}
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Indicator pills bar if enabled */}
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

        {/* Main Work Area: Left Toolbar + Center Chart + Right Watchlist */}
        <div className="flex-1 flex overflow-hidden">
          {/* Pro Drawing Tools Toolbar (Left) */}
          <div className="w-11 bg-zinc-900/60 border-r border-zinc-800 flex flex-col items-center py-3 gap-3 text-zinc-500">
            <button title="Crosshair (C)" className="p-1.5 rounded hover:bg-zinc-800 hover:text-white text-emerald-400">
              <Compass className="w-4 h-4" />
            </button>
            <button title="Trend Line (Alt+T)" className="p-1.5 rounded hover:bg-zinc-800 hover:text-white">
              <TrendingUp className="w-4 h-4" />
            </button>
            <button title="Horizontal Level" className="p-1.5 rounded hover:bg-zinc-800 hover:text-white">
              <Minus className="w-4 h-4" />
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

          {/* Right Panel: Watchlist */}
          <div className="w-64 bg-zinc-900/80 border-l border-zinc-800 hidden lg:flex flex-col">
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
        </div>

        {/* Bottom Tabs: Paper Trading Engine / Pine Script Editor */}
        <div className="bg-zinc-900/90 border-t border-zinc-800 flex flex-col">
          {/* Tab Selector */}
          <div className="flex items-center gap-4 px-4 pt-2 border-b border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setBottomTab('trading')}
              className={`pb-2 font-semibold flex items-center gap-1.5 cursor-pointer ${
                bottomTab === 'trading' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Paper Trading Panel ({positions.length} active)
            </button>
            <button
              onClick={() => setBottomTab('pinescript')}
              className={`pb-2 font-semibold flex items-center gap-1.5 cursor-pointer ${
                bottomTab === 'pinescript' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Pine Editor (Pine Script® v5)
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-3 max-h-48 overflow-y-auto">
            {bottomTab === 'trading' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Order execution form */}
                <div className="flex items-center gap-2">
                  <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                    <button
                      onClick={() => setOrderType('BUY')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        orderType === 'BUY' ? 'bg-emerald-500 text-black' : 'text-zinc-400'
                      }`}
                    >
                      BUY
                    </button>
                    <button
                      onClick={() => setOrderType('SELL')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        orderType === 'SELL' ? 'bg-red-500 text-white' : 'text-zinc-400'
                      }`}
                    >
                      SELL
                    </button>
                  </div>

                  <div className="flex items-center gap-1 bg-zinc-950 px-2.5 py-1.5 rounded-xl border border-zinc-800">
                    <span className="text-[11px] text-zinc-500">Qty:</span>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={orderQuantity}
                      onChange={e => setOrderQuantity(Math.max(0.01, parseFloat(e.target.value) || 1))}
                      className="w-16 bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => handleExecuteTrade(orderType)}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs text-black shadow-md transition-all active:scale-95 cursor-pointer ${
                      orderType === 'BUY' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-red-500 text-white hover:bg-red-400'
                    }`}
                  >
                    {orderType} {asset.symbol}
                  </button>
                </div>

                {/* Account balance status */}
                <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-mono">PAPER BUYING POWER</span>
                    <span className="text-white font-mono font-bold">
                      ${paperBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block font-mono">ESTIMATED VALUE</span>
                    <span className="text-emerald-400 font-mono font-semibold">
                      ${(asset.price * orderQuantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Active positions list */}
                <div className="overflow-x-auto text-[11px]">
                  {positions.length === 0 ? (
                    <span className="text-zinc-500 italic">No active simulated positions. Place a trade above to test your hypothesis.</span>
                  ) : (
                    <div className="flex gap-2">
                      {positions.slice(0, 2).map(pos => {
                        const currentVal = pos.amount * asset.price;
                        const entryVal = pos.amount * pos.entryPrice;
                        const pnl = pos.type === 'BUY' ? currentVal - entryVal : entryVal - currentVal;
                        const isWin = pnl >= 0;

                        return (
                          <div key={pos.id} className="bg-zinc-950 px-2.5 py-1.5 rounded-xl border border-zinc-800 flex items-center gap-2">
                            <span className={`font-bold ${pos.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>{pos.type}</span>
                            <span className="text-white font-mono">{pos.amount} {pos.symbol}</span>
                            <span className={`font-mono font-bold ${isWin ? 'text-emerald-400' : 'text-red-400'}`}>
                              {isWin ? '+' : ''}${pnl.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleClosePosition(pos.id)}
                              className="text-[10px] text-zinc-500 hover:text-white underline ml-1 cursor-pointer"
                            >
                              Close
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Pine script tab */
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
