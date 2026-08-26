import React from 'react';
import {
  Search,
  Navigation,
  Compass,
  Layers,
  Globe,
  Flame,
  AlertTriangle,
  Layers2,
  X,
} from 'lucide-react';
import { StateMapData } from '../../data/indiaMapData';
import { FlatLocationResult } from '../../data/locations';

export type MapFilterTab = 'ALL' | 'HIGH' | 'CRITICAL' | 'STATE' | 'SAFE_ROUTE';

interface MapHeaderControlsProps {
  activeTab: MapFilterTab;
  onTabChange: (tab: MapFilterTab) => void;
  selectedState: StateMapData | null;
  onClearSelectedState: () => void;
  onOpenStateSelector: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: FlatLocationResult[];
  onSelectSearchResult: (result: FlatLocationResult) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  onRecenterMyLocation: () => void;
  mapTileMode: 'SATELLITE' | 'DARK' | 'TOPO';
  onMapTileModeChange: (mode: 'SATELLITE' | 'DARK' | 'TOPO') => void;
  totalHotspotsCount: number;
  highRiskCount?: number;
}

export const MapHeaderControls: React.FC<MapHeaderControlsProps> = ({
  activeTab,
  onTabChange,
  selectedState,
  onClearSelectedState,
  onOpenStateSelector,
  searchQuery,
  onSearchChange,
  searchResults,
  onSelectSearchResult,
  isSearchFocused,
  setIsSearchFocused,
  onRecenterMyLocation,
  mapTileMode,
  onMapTileModeChange,
  totalHotspotsCount,
  highRiskCount = 42,
}) => {
  return (
    <div className="bg-[#091524] border border-[#162d47] rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-wrap items-center justify-between gap-3 relative z-30">
      {/* Layer Filter Buttons: ALL / HIGH (≥60%) / CRITICAL (≥85%) / STATE / SAFE ROUTE */}
      <div className="flex items-center gap-1.5 bg-[#060e19] p-1 rounded-xl border border-[#12243a] overflow-x-auto max-w-full">
        <button
          type="button"
          onClick={() => onTabChange('ALL')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'ALL'
              ? 'bg-[#00d492] text-[#050c17] shadow-lg font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>ALL INDIA</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('HIGH')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'HIGH'
              ? 'bg-amber-500 text-[#050c17] shadow-lg font-black'
              : 'text-slate-400 hover:text-amber-400'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>RISK ≥60% ({highRiskCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('CRITICAL')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'CRITICAL'
              ? 'bg-rose-600 text-white shadow-lg font-black'
              : 'text-slate-400 hover:text-rose-400'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>CRITICAL ≥85% ({totalHotspotsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('STATE')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'STATE'
              ? 'bg-cyan-500 text-[#050c17] shadow-lg font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers2 className="w-3.5 h-3.5" />
          <span>STATES & UTS</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('SAFE_ROUTE')}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'SAFE_ROUTE'
              ? 'bg-emerald-600 text-white shadow-lg font-black'
              : 'text-slate-400 hover:text-emerald-400'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>SAFE ROUTE</span>
        </button>
      </div>

      {/* State Breadcrumb or Quick State Picker */}
      {selectedState ? (
        <div className="flex items-center gap-2 bg-[#060e19] px-3 py-1.5 rounded-xl border border-[#162d47] text-xs font-mono text-slate-300">
          <button
            type="button"
            onClick={onClearSelectedState}
            className="text-[#00d492] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
          >
            <span>← All India</span>
          </button>
          <span className="text-slate-500">•</span>
          <span className="font-black text-white">{selectedState.name}</span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {selectedState.districts.length} Districts
          </span>
          <button
            type="button"
            onClick={onOpenStateSelector}
            className="text-xs text-cyan-400 hover:text-cyan-300 underline ml-1 cursor-pointer"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenStateSelector}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#060e19] border border-[#162d47] text-slate-300 hover:text-white hover:border-[#00d492]/50 text-xs font-mono transition-colors cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-[#00d492]" />
          <span>Browse 36 States & UTs</span>
        </button>
      )}

      {/* Search Input Bar with Auto-suggest */}
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          placeholder="Search state, district, ghat road, or locality..."
          className="w-full bg-[#060e19] border border-[#162d47] focus:border-[#00d492] rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-colors font-medium"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Autocomplete Dropdown */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#060e19]/98 border border-[#1b3554] rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto divide-y divide-[#10243a] backdrop-blur-md">
            <div className="p-2 bg-[#081424] text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>MATCHING INDIAN GEOGRAPHIC SECTORS</span>
              <span>{searchResults.length} Results</span>
            </div>
            {searchResults.map((item, idx) => (
              <div
                key={`${item.state}-${item.district}-${item.area}-${idx}`}
                onClick={() => {
                  onSelectSearchResult(item);
                  setIsSearchFocused(false);
                }}
                className="p-2.5 hover:bg-[#0c223c] text-xs text-slate-200 cursor-pointer flex items-center justify-between group transition-colors"
              >
                <div>
                  <p className="font-bold text-white group-hover:text-[#00d492] transition-colors">
                    {item.area}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {item.district}, {item.state} • Elev: {item.elevation}m
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-extrabold border ${
                      item.score >= 75
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                        : item.score >= 45
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    {item.score}% Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Tile Switcher & Compass */}
      <div className="flex items-center gap-2">
        {/* Tile mode toggle */}
        <div className="flex items-center bg-[#060e19] p-0.5 rounded-xl border border-[#162d47]">
          <button
            type="button"
            onClick={() => onMapTileModeChange('SATELLITE')}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              mapTileMode === 'SATELLITE'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Esri Satellite Imagery"
          >
            SAT
          </button>
          <button
            type="button"
            onClick={() => onMapTileModeChange('DARK')}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              mapTileMode === 'DARK'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Dark CartoDB Theme"
          >
            DARK
          </button>
          <button
            type="button"
            onClick={() => onMapTileModeChange('TOPO')}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              mapTileMode === 'TOPO'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Topographic Contours"
          >
            TOPO
          </button>
        </div>

        {/* Elevated status badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/70 border border-amber-700/60 text-[11px] font-mono text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>ELEVATED (+40%)</span>
          <span className="text-slate-400">• 104 Hotspots</span>
        </div>

        {/* My Location / GPS Re-center button */}
        <button
          type="button"
          onClick={onRecenterMyLocation}
          className="p-2 rounded-xl bg-[#060e19] border border-[#162d47] hover:bg-[#0c1f36] text-[#00d492] hover:text-white text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
          title="Fly to My Active Location"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
