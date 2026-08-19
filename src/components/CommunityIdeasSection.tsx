import React, { useState } from 'react';
import { Lightbulb, ThumbsUp, MessageSquare, Plus, ArrowUpRight } from 'lucide-react';
import { communityIdeas } from '../data/marketsData';
import { MarketAsset } from '../types';

interface CommunityIdeasSectionProps {
  onOpenChart: (symbol: string) => void;
  allAssets: MarketAsset[];
}

export const CommunityIdeasSection: React.FC<CommunityIdeasSectionProps> = ({
  onOpenChart,
  allAssets,
}) => {
  const [ideas, setIdeas] = useState(communityIdeas);
  const [likedIds, setLikedIds] = useState<{ [id: string]: boolean }>({});
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'bullish' | 'bearish'>('all');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSymbol, setNewSymbol] = useState('BTCUSD');
  const [newSentiment, setNewSentiment] = useState<'bullish' | 'bearish'>('bullish');

  const toggleLike = (id: string) => {
    setLikedIds(prev => {
      const isLiked = !!prev[id];
      setIdeas(ideas.map(idea => {
        if (idea.id === id) {
          return { ...idea, likes: isLiked ? idea.likes - 1 : idea.likes + 1 };
        }
        return idea;
      }));
      return { ...prev, [id]: !isLiked };
    });
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newIdea = {
      id: `idea-${Date.now()}`,
      author: {
        name: 'Elena Vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        badge: 'CURATOR TIER',
        reputation: 240,
      },
      symbol: newSymbol,
      title: newTitle,
      sentiment: newSentiment,
      timeframe: '4h',
      timeAgo: 'Just now',
      likes: 1,
      comments: 0,
      description: newDesc,
      tags: [newSymbol, newSentiment === 'bullish' ? 'Long' : 'Short', 'Alpha'],
    };

    setIdeas([newIdea, ...ideas]);
    setShowPublishModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const filteredIdeas = filterSentiment === 'all'
    ? ideas
    : ideas.filter(i => i.sentiment === filterSentiment);

  return (
    <section id="community-ideas-section" className="w-full bg-[#0A0A0A] py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-widest mb-1">
            <Lightbulb className="w-3.5 h-3.5" />
            // Alpha & Insights
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Community Market Ideas
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900/80 p-1 rounded-full border border-zinc-800 text-xs">
            {(['all', 'bullish', 'bearish'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterSentiment(s)}
                className={`px-3.5 py-1 rounded-full capitalize font-medium transition-colors cursor-pointer ${
                  filterSentiment === s
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {s === 'all' ? 'All Ideas' : s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowPublishModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Publish Idea
          </button>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredIdeas.map(idea => {
          const isLiked = likedIds[idea.id];
          return (
            <div
              key={idea.id}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
            >
              <div>
                {/* Author Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={idea.author.avatar}
                      alt={idea.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span>{idea.author.name}</span>
                        {idea.author.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-emerald-400 border border-zinc-700 font-mono">
                            {idea.author.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">{idea.timeAgo} · {idea.timeframe}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      idea.sentiment === 'bullish'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {idea.sentiment}
                  </span>
                </div>

                {/* Instrument Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-semibold text-emerald-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {idea.symbol}
                  </span>
                </div>

                <h3 className="font-medium text-[15px] text-white group-hover:text-zinc-200 transition-colors leading-snug mb-2">
                  {idea.title}
                </h3>

                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                  {idea.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {idea.tags.map(tag => (
                    <span key={tag} className="text-[10px] text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(idea.id)}
                    className={`flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer ${
                      isLiked ? 'text-emerald-400 font-bold' : ''
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{idea.likes}</span>
                  </button>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{idea.comments}</span>
                  </span>
                </div>

                <button
                  onClick={() => onOpenChart(idea.symbol)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  View Setup <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-light text-white tracking-tight">Publish Trade Idea</h3>
            <form onSubmit={handlePublish} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Instrument</label>
                <select
                  value={newSymbol}
                  onChange={e => setNewSymbol(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {allAssets.map(a => (
                    <option key={a.symbol} value={a.symbol}>
                      {a.symbol} - {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Sentiment</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSentiment('bullish')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      newSentiment === 'bullish' ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    Bullish
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSentiment('bearish')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      newSentiment === 'bearish' ? 'bg-red-500 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    Bearish
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Headline</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. S&P 500: Key Fibonacci Extension Level Reached"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Analysis & Description</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="Outline key support/resistance, RSI divergence, or macroeconomic catalysts..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-1.5 text-xs text-zinc-400 bg-zinc-900 rounded-full border border-zinc-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-black bg-emerald-500 hover:bg-emerald-400 rounded-full shadow-md shadow-emerald-500/20"
                >
                  Publish to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
