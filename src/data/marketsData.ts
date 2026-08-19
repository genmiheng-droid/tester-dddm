import { MarketAsset, CommunityIdea, SpaceStoryChapter, Candlestick, EconomicEvent, HeatmapItem, OrderBookLevel } from '../types';

// Helper to generate realistic candlestick data
export function generateCandles(basePrice: number, count: number = 40, volatility: number = 0.012, upwardBias: number = 0.001): Candlestick[] {
  const candles: Candlestick[] = [];
  let currentPrice = basePrice * (1 - count * upwardBias * 0.4);
  const now = Date.now();
  const intervalMs = 15 * 60 * 1000; // 15 mins

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * intervalMs;
    const date = new Date(timestamp);
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    const delta = (Math.random() - 0.48 + upwardBias) * volatility * currentPrice;
    const open = currentPrice;
    const close = open + delta;
    const high = Math.max(open, close) + Math.random() * volatility * currentPrice * 0.8;
    const low = Math.min(open, close) - Math.random() * volatility * currentPrice * 0.8;
    const volume = Math.floor(Math.random() * 50000 + 10000);

    candles.push({
      time: timeStr,
      timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    currentPrice = close;
  }
  return candles;
}

export function generateOrderBook(midPrice: number, decimals: number = 2): { bids: OrderBookLevel[]; asks: OrderBookLevel[] } {
  const bids: OrderBookLevel[] = [];
  const asks: OrderBookLevel[] = [];
  let bidAccum = 0;
  let askAccum = 0;

  for (let i = 1; i <= 8; i++) {
    const spread = (i * 0.0006 + (Math.random() * 0.0002)) * midPrice;
    const bidPrice = Number((midPrice - spread).toFixed(decimals));
    const askPrice = Number((midPrice + spread).toFixed(decimals));
    const bidAmt = Number((Math.random() * 4 + 0.5).toFixed(2));
    const askAmt = Number((Math.random() * 4 + 0.5).toFixed(2));
    bidAccum += bidAmt;
    askAccum += askAmt;

    bids.push({ price: bidPrice, amount: bidAmt, total: Number(bidAccum.toFixed(2)) });
    asks.push({ price: askPrice, amount: askAmt, total: Number(askAccum.toFixed(2)) });
  }

  return { bids, asks };
}

export const initialMarketAssets: MarketAsset[] = [
  {
    symbol: 'S&P 500',
    name: 'S&P 500 Index',
    category: 'index',
    categoryLabel: 'Index',
    price: 5123.45,
    change: 62.80,
    changePercent: 1.24,
    high24h: 5135.20,
    low24h: 5068.10,
    volume24h: '3.42B',
    marketCap: '$44.8T',
    sparkline: [25, 22, 28, 15, 18, 10, 12, 5, 8, 2, 0],
    candlesticks: generateCandles(5123.45, 36, 0.004, 0.0015),
    description: 'The standard benchmark index measuring the stock performance of 500 of the largest companies listed on stock exchanges in the United States.',
    exchange: 'CBOE / S&P DOW JONES',
    currency: 'USD',
    decimals: 2,
    rsi: 64.2,
    volatility: 'Low (0.84% beta)',
    sentimentScore: 78,
  },
  {
    symbol: 'NASDAQ 100',
    name: 'NASDAQ 100 Index',
    category: 'index',
    categoryLabel: 'Index',
    price: 18050.12,
    change: 277.20,
    changePercent: 1.56,
    high24h: 18090.50,
    low24h: 17820.00,
    volume24h: '5.18B',
    marketCap: '$21.2T',
    sparkline: [28, 25, 20, 22, 14, 12, 8, 9, 4, 2, 0],
    candlesticks: generateCandles(18050.12, 36, 0.006, 0.002),
    description: 'A stock market index made up of 101 equity securities issued by 100 of the largest non-financial companies listed on the Nasdaq.',
    exchange: 'NASDAQ',
    currency: 'USD',
    decimals: 2,
    rsi: 68.9,
    volatility: 'Medium (1.22% beta)',
    sentimentScore: 84,
  },
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin',
    category: 'crypto',
    categoryLabel: 'Crypto',
    price: 64210.00,
    change: -1378.00,
    changePercent: -2.10,
    high24h: 66120.00,
    low24h: 63800.00,
    volume24h: '$38.4B',
    marketCap: '$1.26T',
    sparkline: [4, 6, 2, 8, 12, 10, 18, 16, 24, 22, 28],
    candlesticks: generateCandles(64210.00, 36, 0.015, -0.001),
    description: 'The first decentralized digital currency, enabling peer-to-peer transfers without intermediary authority on a proof-of-work blockchain ledger.',
    exchange: 'BINANCE / COINBASE',
    currency: 'USD',
    decimals: 2,
    rsi: 44.1,
    volatility: 'High (3.4% beta)',
    sentimentScore: 52,
  },
  {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    category: 'forex',
    categoryLabel: 'Forex',
    price: 1.0845,
    change: 0.0013,
    changePercent: 0.12,
    high24h: 1.0862,
    low24h: 1.0820,
    volume24h: '$120B',
    marketCap: 'Forex FX',
    sparkline: [18, 16, 20, 17, 14, 15, 12, 10, 11, 8, 5],
    candlesticks: generateCandles(1.0845, 36, 0.0015, 0.0003),
    description: 'The currency pair indicating how many US dollars are needed to purchase one Euro. It is the most actively traded currency pair globally.',
    exchange: 'FXCM / SPOT FOREX',
    currency: 'USD',
    decimals: 4,
    rsi: 51.3,
    volatility: 'Low (0.3% beta)',
    sentimentScore: 61,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    category: 'stock',
    categoryLabel: 'Stock',
    price: 128.45,
    change: 5.32,
    changePercent: 4.32,
    high24h: 129.80,
    low24h: 123.10,
    volume24h: '48.9M',
    marketCap: '$3.15T',
    sparkline: [28, 26, 24, 18, 14, 12, 10, 8, 4, 2, 0],
    candlesticks: generateCandles(128.45, 36, 0.012, 0.003),
    description: 'Pioneer of GPU-accelerated computing and undisputed market leader in generative AI enterprise infrastructure.',
    exchange: 'NASDAQ',
    currency: 'USD',
    decimals: 2,
    rsi: 72.4,
    volatility: 'High (2.1% beta)',
    sentimentScore: 91,
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'stock',
    categoryLabel: 'Stock',
    price: 224.23,
    change: 1.84,
    changePercent: 0.83,
    high24h: 225.10,
    low24h: 222.40,
    volume24h: '32.1M',
    marketCap: '$3.44T',
    sparkline: [15, 14, 16, 12, 10, 11, 9, 8, 6, 4, 3],
    candlesticks: generateCandles(224.23, 36, 0.005, 0.001),
    description: 'Global consumer technology giant designing premium hardware, silicon chips, and digital ecosystem services.',
    exchange: 'NASDAQ',
    currency: 'USD',
    decimals: 2,
    rsi: 58.1,
    volatility: 'Medium (0.95% beta)',
    sentimentScore: 74,
  },
  {
    symbol: 'GOLD',
    name: 'Spot Gold / USD',
    category: 'commodity',
    categoryLabel: 'Commodity',
    price: 2428.60,
    change: 14.20,
    changePercent: 0.59,
    high24h: 2435.00,
    low24h: 2410.50,
    volume24h: '$22.5B',
    marketCap: '$16.2T',
    sparkline: [20, 19, 17, 15, 16, 12, 10, 9, 6, 4, 2],
    candlesticks: generateCandles(2428.60, 36, 0.003, 0.0008),
    description: 'Physical gold spot bullion market, globally regarded as the quintessential sovereign monetary reserve and store of value.',
    exchange: 'COMEX / LBMA',
    currency: 'USD',
    decimals: 2,
    rsi: 62.0,
    volatility: 'Low (0.6% beta)',
    sentimentScore: 82,
  },
  {
    symbol: 'ETHUSD',
    name: 'Ethereum',
    category: 'crypto',
    categoryLabel: 'Crypto',
    price: 3480.50,
    change: -45.10,
    changePercent: -1.28,
    high24h: 3560.00,
    low24h: 3440.00,
    volume24h: '$18.2B',
    marketCap: '$418B',
    sparkline: [8, 6, 10, 12, 14, 18, 16, 20, 22, 26, 24],
    candlesticks: generateCandles(3480.50, 36, 0.012, -0.0008),
    description: 'Open-source decentralized smart contract platform facilitating global programmable finance and layer 2 scaling rollups.',
    exchange: 'BINANCE / COINBASE',
    currency: 'USD',
    decimals: 2,
    rsi: 48.7,
    volatility: 'High (2.8% beta)',
    sentimentScore: 66,
  },
];

export const economicEvents: EconomicEvent[] = [
  {
    id: 'eco-1',
    time: '14:30 UTC',
    currency: 'USD',
    flag: '🇺🇸',
    event: 'US Core CPI (MoM / YoY)',
    impact: 'high',
    actual: '0.2% / 3.2%',
    forecast: '0.2% / 3.3%',
    previous: '0.3% / 3.4%',
  },
  {
    id: 'eco-2',
    time: '18:00 UTC',
    currency: 'USD',
    flag: '🇺🇸',
    event: 'FOMC Interest Rate Decision',
    impact: 'high',
    actual: '5.25% - 5.50%',
    forecast: '5.25% - 5.50%',
    previous: '5.25% - 5.50%',
  },
  {
    id: 'eco-3',
    time: '08:00 UTC',
    currency: 'EUR',
    flag: '🇪🇺',
    event: 'German Manufacturing PMI',
    impact: 'medium',
    actual: '43.2',
    forecast: '42.8',
    previous: '42.5',
  },
  {
    id: 'eco-4',
    time: '06:00 UTC',
    currency: 'GBP',
    flag: '🇬🇧',
    event: 'UK Claimant Count / Wage Growth',
    impact: 'medium',
    actual: '5.4%',
    forecast: '5.6%',
    previous: '5.7%',
  },
  {
    id: 'eco-5',
    time: '01:30 UTC',
    currency: 'JPY',
    flag: '🇯🇵',
    event: 'Bank of Japan Policy Rate & Yield Curve Control',
    impact: 'high',
    actual: '0.25%',
    forecast: '0.25%',
    previous: '0.10%',
  },
];

export const heatmapData: HeatmapItem[] = [
  { symbol: 'NVDA', name: 'Nvidia', marketCap: '$3.15T', changePercent: 4.32, weight: 14, sector: 'Technology' },
  { symbol: 'AAPL', name: 'Apple', marketCap: '$3.44T', changePercent: 0.83, weight: 15, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft', marketCap: '$3.28T', changePercent: 1.45, weight: 14, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon', marketCap: '$1.92T', changePercent: 2.15, weight: 10, sector: 'Consumer Discretionary' },
  { symbol: 'GOOGL', name: 'Alphabet', marketCap: '$2.10T', changePercent: -0.65, weight: 9, sector: 'Communication' },
  { symbol: 'META', name: 'Meta', marketCap: '$1.32T', changePercent: 2.80, weight: 8, sector: 'Communication' },
  { symbol: 'TSLA', name: 'Tesla', marketCap: '$720B', changePercent: -1.85, weight: 6, sector: 'Consumer Discretionary' },
  { symbol: 'JPM', name: 'JPMorgan', marketCap: '$610B', changePercent: 1.12, weight: 6, sector: 'Financials' },
  { symbol: 'LLY', name: 'Eli Lilly', marketCap: '$840B', changePercent: 3.10, weight: 6, sector: 'Healthcare' },
  { symbol: 'XOM', name: 'Exxon Mobil', marketCap: '$470B', changePercent: -0.45, weight: 4, sector: 'Energy' },
  { symbol: 'BTC', name: 'Bitcoin', marketCap: '$1.26T', changePercent: -2.10, weight: 12, sector: 'Crypto Majors' },
  { symbol: 'SOL', name: 'Solana', marketCap: '$68B', changePercent: 5.40, weight: 5, sector: 'Crypto Majors' },
];

export const spaceStoryData: SpaceStoryChapter[] = [
  {
    title: 'Orbiting at 1,400 Kilometers',
    subtitle: 'The highest Earth altitude reached by humans in over 50 years',
    detail: 'Polaris Dawn commander Jared Isaacman and mission pilot Scott "Kidd" Poteet reached an apogee of 1,400.7 kilometers aboard the SpaceX Crew Dragon "Resilience", flying through portions of the inner Van Allen radiation belt.',
    statLabel: 'Apogee Altitude',
    statValue: '1,400.7 km',
    iconName: 'rocket',
  },
  {
    title: 'The First Commercial Spacewalk',
    subtitle: 'Extravehicular activity in next-gen SpaceX EVA suits',
    detail: 'Executing precision maneuvers in the vacuum of space requires relentless calculation, real-time telemetry, and absolute discipline—mirroring the philosophy behind "Look first / Then leap."',
    statLabel: 'EVA Duration',
    statValue: '1h 46m',
    iconName: 'shield',
  },
  {
    title: 'Laser Space Communications',
    subtitle: 'Starlink optical laser interconnects tested in orbit',
    detail: 'High-bandwidth, low-latency laser communications tested between Dragon spacecraft and Starlink constellation satellites, streaming HD video and telemetry with millisecond precision.',
    statLabel: 'Data Bandwidth',
    statValue: '100+ Gbps',
    iconName: 'zap',
  },
];

export const communityIdeas: CommunityIdea[] = [
  {
    id: 'idea-1',
    author: {
      name: 'Alan_ForexPro',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      badge: 'PRO+',
      reputation: 24800,
    },
    symbol: 'BTCUSD',
    title: 'Bitcoin: Key Liquidity Sweep Before Next Wave Highs',
    sentiment: 'bullish',
    timeframe: '4h',
    timeAgo: '2 hours ago',
    likes: 482,
    comments: 67,
    description: 'BTC has respected the $63,800 demand order block with clear Wyckoff accumulation characteristics. Looking for a breakout above $66,200 with RSI divergence confirmation.',
    tags: ['Bitcoin', 'Crypto', 'Wyckoff', 'Breakout'],
  },
  {
    id: 'idea-2',
    author: {
      name: 'MarketWizard_Sarah',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      badge: 'PREMIUM',
      reputation: 41200,
    },
    symbol: 'S&P 500',
    title: 'S&P 500: Ascending Channel Breakout Pattern Targets 5,200',
    sentiment: 'bullish',
    timeframe: '1D',
    timeAgo: '4 hours ago',
    likes: 614,
    comments: 89,
    description: 'Broad equity breadth continues expanding across semiconductor and healthcare sectors. 20-day EMA support holds firm across pullback tests.',
    tags: ['SP500', 'Index', 'TrendFollowing', 'EMA'],
  },
  {
    id: 'idea-3',
    author: {
      name: 'MacroAlpha_Quant',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      badge: 'PINESCRIPT GURU',
      reputation: 33900,
    },
    symbol: 'EURUSD',
    title: 'EURUSD: ECB Rate Outlook & Institutional Fair Value Gap',
    sentiment: 'bearish',
    timeframe: '1h',
    timeAgo: '6 hours ago',
    likes: 318,
    comments: 42,
    description: 'Testing the 1.0860 resistance liquidity pool. Bearish order block in play targeting lower imbalance near 1.0790.',
    tags: ['Forex', 'EURUSD', 'FVG', 'SmartMoney'],
  },
];
