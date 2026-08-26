import React, { useState } from 'react';
import {
  Radio,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  ExternalLink,
  Sparkles,
  Share2,
  Bookmark,
} from 'lucide-react';
import { DISASTER_NEWS_FEED } from '../data/disasterData';
import { DisasterNewsItem } from '../types';

export const DisasterNewsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');

  const categories = ['All', 'Landslide', 'Cloudburst', 'Flash Flood', 'Highway Blockage', 'Early Warning'];
  const states = ['All', 'Kerala', 'West Bengal', 'Uttarakhand', 'Himachal Pradesh', 'Maharashtra', 'Arunachal Pradesh'];

  const filteredNews = DISASTER_NEWS_FEED.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.state.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesState = selectedState === 'All' || item.state === selectedState;
    return matchesSearch && matchesCat && matchesState;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Page Header */}
      <div className="border-b border-[#14263c] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-rose-400 animate-pulse" />
            Live Disaster & Geological News Feed
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time verified incident reports from IMD, GSI, NDMA, SDRF, and Border Roads Organisation.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 w-fit flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          Live Satellite Radar Stream
        </span>
      </div>

      {/* AI Geotechnical Synthesis Card */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-[#00d492] mb-2">
          <Sparkles className="w-4 h-4" />
          <span>AI National Disaster Geotechnical Synthesis (Last 6 Hours)</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          High-intensity monsoon depressions continue to saturate upper soil mantles across the Western Ghats (Wayanad, Idukki, Nilgiris) and the Teesta Basin (Darjeeling-Kalimpong corridor). Total precipitation in these basins has exceeded the critical 120 mm/24h threshold. Geotechnical sensors report active creep on 18 slopes along NH-10 and NH-58. Emergency response teams remain on Level-2 pre-positioning.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#08121f] border border-[#162d47] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news by district, state, keyword..."
            className="w-full bg-[#060e19] border border-[#18314e] focus:border-[#00d492] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#009e60] text-white font-semibold'
                  : 'bg-[#0c1e33] border border-[#162d47] text-slate-300 hover:bg-[#122b47]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <div
              key={item.id}
              className="bg-[#091626] border border-[#182f4d] rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-[#224874] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        item.severity === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border-rose-700'
                          : item.severity === 'Severe'
                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                          : item.severity === 'Alert'
                          ? 'bg-yellow-950 text-yellow-300 border-yellow-700'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      }`}
                    >
                      {item.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-[#060e19] px-2 py-0.5 rounded border border-[#14263c]">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.summary}</p>
              </div>

              <div className="pt-3 border-t border-[#14263c] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {item.source} Verified
                  </span>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#00d492]" />
                    {item.state}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <button className="p-1 hover:text-white transition-colors cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:text-white transition-colors cursor-pointer">
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center bg-[#091626] border border-[#182f4d] rounded-2xl text-slate-400 text-xs">
            No disaster news matching your search criteria. Try clearing the filter.
          </div>
        )}
      </div>
    </div>
  );
};
