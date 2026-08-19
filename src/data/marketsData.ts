import { MarketAsset, CommunityIdea, SpaceStoryChapter, Candlestick } from '../types';

// Helper to generate realistic candlestick data
function generateCandles(basePrice: number, count: number = 40, volatility: number = 0.012, upwardBias: number = 0.001): Candlestick[] {
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
  },
  {
    symbol: 'NASDAQ 100',
    name: 'NASDAQ 100 Index',
    category: 'index',
    categoryLabel: 'Index',
    price: 18050.12,
    change: 277.20,
    changePercent: 1.56,
    high24h: 18095.40,
    low24h: 17790.00,
    volume24h: '4.85B',
    marketCap: '$21.2T',
    sparkline: [20, 25, 12, 18, 8, 15, 4, 0],
    candlesticks: generateCandles(18050.12, 36, 0.006, 0.002),
    description: 'A stock market index made up of 101 equity securities issued by 100 of the largest non-financial companies listed on the Nasdaq stock network.',
    exchange: 'NASDAQ',
    currency: 'USD',
    decimals: 2,
  },
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin / US Dollar',
    category: 'crypto',
    categoryLabel: 'Crypto',
    price: 64210.00,
    change: -1378.50,
    changePercent: -2.10,
    high24h: 65890.00,
    low24h: 63920.00,
    volume24h: '28.9B',
    marketCap: '$1.26T',
    sparkline: [5, 8, 2, 15, 10, 22, 18, 28],
    candlesticks: generateCandles(64210.00, 36, 0.015, -0.002),
    description: 'The world’s first decentralized cryptocurrency, running on a peer-to-peer network secured by proof-of-work cryptographic consensus.',
    exchange: 'COINBASE / BINANCE',
    currency: 'USD',
    decimals: 2,
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
    low24h: 1.0829,
    volume24h: '112.4B',
    sparkline: [15, 12, 18, 10, 14, 8],
    candlesticks: generateCandles(1.0845, 36, 0.002, 0.0003),
    description: 'The most traded currency pair in the foreign exchange market, representing the world’s two largest economies: the Eurozone and the USA.',
    exchange: 'FXCM / OANDA',
    currency: 'USD',
    decimals: 4,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    category: 'stock',
    categoryLabel: 'Stock',
    price: 128.40,
    change: 5.32,
    changePercent: 4.32,
    high24h: 130.10,
    low24h: 123.60,
    volume24h: '56.2M',
    marketCap: '$3.15T',
    sparkline: [22, 18, 15, 12, 8, 4, 1, 0],
    candlesticks: generateCandles(128.40, 36, 0.012, 0.004),
    description: 'Pioneer of GPU-accelerated computing and world leader in AI hardware, data center acceleration architectures, and high-performance computing.',
    exchange: 'NASDAQ',
    currency: 'USD',
    decimals: 2,
  },
  {
    symbol: 'ETHUSD',
    name: 'Ethereum / US Dollar',
    category: 'crypto',
    categoryLabel: 'Crypto',
    price: 3485.20,
    change: 106.40,
    changePercent: 3.15,
    high24h: 3510.00,
    low24h: 3370.00,
    volume24h: '15.4B',
    marketCap: '$418.9B',
    sparkline: [20, 22, 16, 12, 9, 5, 2, 0],
    candlesticks: generateCandles(3485.20, 36, 0.014, 0.003),
    description: 'Decentralized global software platform powered by blockchain technology and smart contracts, enabling DeFi, NFTs, and dApps.',
    exchange: 'COINBASE',
    currency: 'USD',
    decimals: 2,
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'stock',
    categoryLabel: 'Stock',
    price: 224.80,
    change: 1.90,
    changePercent: 0.85,
    high24h: 226.10,
    low24h: 223.20,
    volume24h: '41.8M',
    marketCap: '$3.44T',
    sparkline: [10, 8, 12, 6, 7, 3, 2, 1],
    candlesticks: generateCandles(224.80, 36, 0.005, 0.001),
    description: 'Global technology giant designing consumer electronics, software, and services including iPhone, Mac, iPad, and Apple Intelligence ecosystem.',
    exchange: 'NASDAQ',
    currency: 'USD',
    decimals: 2,
  },
  {
    symbol: 'GOLD',
    name: 'Gold (XAU/USD)',
    category: 'commodity',
    categoryLabel: 'Commodity',
    price: 2415.80,
    change: 15.60,
    changePercent: 0.65,
    high24h: 2424.00,
    low24h: 2398.50,
    volume24h: '18.2B',
    sparkline: [18, 14, 16, 10, 8, 5, 4, 0],
    candlesticks: generateCandles(2415.80, 36, 0.003, 0.0008),
    description: 'Spot Gold traded against the US Dollar, universally recognized as a premier safe-haven asset and inflation hedge.',
    exchange: 'COMEX',
    currency: 'USD',
    decimals: 2,
  }
];

export const spaceStoryChapters: SpaceStoryChapter[] = [
  {
    title: 'Polaris Dawn: Reaching New Heights',
    subtitle: 'Astronaut Scott "Kidd" Poteet takes research to orbital extremes',
    detail: 'Scott "Kidd" Poteet, pilot for the groundbreaking Polaris Dawn mission, tested advanced technical systems and precision instruments in high-radiation Van Allen orbital bands up to 1,400 km above Earth—the highest human altitude since Apollo.',
    statLabel: 'Orbital Apogee',
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
