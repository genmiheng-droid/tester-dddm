export type AssetCategory = 'index' | 'crypto' | 'forex' | 'stock' | 'commodity';

export interface Candlestick {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  category: AssetCategory;
  categoryLabel: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  marketCap?: string;
  sparkline: number[];
  candlesticks: Candlestick[];
  description: string;
  exchange: string;
  currency: string;
  decimals: number;
  rsi?: number;
  volatility?: string;
  sentimentScore?: number;
}

export interface CommunityIdea {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge?: string;
    reputation: number;
  };
  symbol: string;
  title: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timeframe: string;
  timeAgo: string;
  likes: number;
  comments: number;
  description: string;
  chartImg?: string;
  tags: string[];
}

export interface PaperTradePosition {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  amount: number;
  entryTime: string;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  stopLoss?: number;
  takeProfit?: number;
  leverage?: number;
  marginUsed?: number;
}

export interface SpaceStoryChapter {
  title: string;
  subtitle: string;
  detail: string;
  statLabel: string;
  statValue: string;
  iconName: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  flag: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual: string;
  forecast: string;
  previous: string;
}

export interface OrderBookLevel {
  price: number;
  amount: number;
  total: number;
}

export interface HeatmapItem {
  symbol: string;
  name: string;
  marketCap: string;
  changePercent: number;
  weight: number;
  sector: string;
}
