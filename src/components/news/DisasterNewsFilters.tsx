import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  RotateCw,
  Filter,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { DisasterCategory, UserLocation } from '../../types';

interface DisasterNewsFiltersProps {
  timeframe: 'today' | '30days' | 'my-location';
  setTimeframe: (tf: 'today' | '30days' | 'my-location') => void;
  disasterType: DisasterCategory;
  setDisasterType: (type: DisasterCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: UserLocation;
  onOpenLocationModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdatedTime: string;
}

const DISASTER_CATEGORIES: DisasterCategory[] = [
  'All',
  'Flood',
  'Heavy Rain',
  'Landslide',
  'Cyclone',
  'Storm',
  'Earthquake',
  'Cloudburst',
  'Land Subsidence',
  'Avalanche',
  'Heatwave',
  'Wildfire',
  'Lightning',
  'Tsunami',
  'Other',
];

export const DisasterNewsFilters: React.FC<DisasterNewsFiltersProps> = ({
  timeframe,
  setTimeframe,
  disasterType,
  setDisasterType,
  searchQuery,
  setSearchQuery,
  location,
  onOpenLocationModal,
  onRefresh,
  isRefreshing,
  lastUpdatedTime,
}) => {
  // Current dynamic date for TODAY tab
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* 1. Primary Timeframe Switcher Tabs + Location Info Bar */}
      <div className="bg-[#081322] border border-[#162d47] rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-xl">
        {/* Three Main Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#050c16] rounded-xl border border-[#13273e]">
          {/* TODAY Tab */}
          <button
            onClick={() => setTimeframe('today')}
            className={`py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              timeframe === 'today'
                ? 'bg-[#009e60] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1f35]'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>TODAY</span>
            <span className="hidden sm:inline text-[10px] font-mono opacity-80">
              ({todayFormatted})
            </span>
          </button>

          {/* LAST 30 DAYS Tab */}
          <button
            onClick={() => setTimeframe('30days')}
            className={`py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              timeframe === '30days'
                ? 'bg-[#009e60] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1f35]'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>LAST 30 DAYS</span>
          </button>

          {/* MY LOCATION Tab */}
          <button
            onClick={() => setTimeframe('my-location')}
            className={`py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              timeframe === 'my-location'
                ? 'bg-[#009e60] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1f35]'
            }`}
          >
            <MapPin className="w-4 h-4 shrink-0 text-amber-400" />
            <span>MY LOCATION</span>
          </button>
        </div>

        {/* Global Location Indicator & Change Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap">
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b1b2d] border border-[#193758] hover:border-[#00d492] text-xs transition-all cursor-pointer group"
          >
            <MapPin className="w-3.5 h-3.5 text-[#00d492]" />
            <div className="text-left">
              <div className="text-[9px] font-mono uppercase text-slate-400">
                Active Location
              </div>
              <div className="font-bold text-white group-hover:text-[#00d492] transition-colors truncate max-w-[170px] sm:max-w-[220px]">
                {location.area}, {location.district} ({location.state})
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-[#06101c] px-1.5 py-0.5 rounded border border-[#142840]">
              Change
            </span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh disaster news"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0b1b2d] border border-[#193758] hover:border-[#00d492] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#00d492] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Search Field and Disaster Category Filter Carousel */}
      <div className="bg-[#081322] border border-[#162d47] rounded-2xl p-3 sm:p-4 space-y-3">
        {/* Search input + Subtitle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search disaster news by keyword, river basin, highway, or district..."
              className="w-full bg-[#050c16] border border-[#18314e] focus:border-[#00d492] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono self-end md:self-auto">
            <span>Last updated: <strong>{lastUpdatedTime}</strong></span>
          </div>
        </div>

        {/* Disaster Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
          {DISASTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setDisasterType(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                disasterType === cat
                  ? 'bg-[#009e60] text-white shadow-sm ring-1 ring-[#00d492]'
                  : 'bg-[#0b1a2a] border border-[#162e49] text-slate-300 hover:bg-[#122840] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
