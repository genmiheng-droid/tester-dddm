import React, { useState } from 'react';
import { Calendar, AlertCircle, Clock, Globe, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { economicEvents } from '../data/marketsData';

export const EconomicCalendarSection: React.FC = () => {
  const [filterImpact, setFilterImpact] = useState<'all' | 'high' | 'medium'>('all');

  const filteredEvents = filterImpact === 'all'
    ? economicEvents
    : economicEvents.filter(e => e.impact === filterImpact);

  return (
    <section id="pro-economic-calendar-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <Calendar className="w-3.5 h-3.5" />
            // Global Macro Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Economic <span className="font-semibold italic text-emerald-400">Calendar &amp; Fed Watch</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-light">
            High-impact central bank interest decisions, CPI inflation prints, and global labor reports.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(['all', 'high', 'medium'] as const).map(impact => (
            <button
              key={impact}
              onClick={() => setFilterImpact(impact)}
              className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-all cursor-pointer ${
                filterImpact === impact
                  ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              {impact === 'all' ? 'All Impacts' : `${impact} Impact`}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Table Container */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Time (UTC)</th>
                <th className="py-3 px-4">Currency</th>
                <th className="py-3 px-4">Impact</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4 text-right">Actual</th>
                <th className="py-3 px-4 text-right">Forecast</th>
                <th className="py-3 px-4 text-right">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredEvents.map(evt => {
                const isHigh = evt.impact === 'high';
                return (
                  <tr key={evt.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 text-zinc-300 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      {evt.time}
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5 text-white font-bold">
                        <span>{evt.flag}</span>
                        <span>{evt.currency}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isHigh
                            ? 'bg-red-950/80 text-red-400 border border-red-800/80'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
                        }`}
                      >
                        {evt.impact}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-sans font-medium text-xs">
                      {evt.event}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      {evt.actual}
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-400">
                      {evt.forecast}
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-500">
                      {evt.previous}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
