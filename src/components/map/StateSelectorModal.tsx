import React, { useState } from 'react';
import {
  Search,
  X,
  Layers2,
  ChevronRight,
  Shield,
  Flame,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import { ALL_INDIAN_STATES_MAP_DATA, StateMapData } from '../../data/indiaMapData';

interface StateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectState: (state: StateMapData) => void;
  selectedStateId?: string;
}

export const StateSelectorModal: React.FC<StateSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectState,
  selectedStateId,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'HAZARD_MONITORED' | 'HIMALAYAN' | 'GHATS'>('ALL');

  if (!isOpen) return null;

  const filteredStates = ALL_INDIAN_STATES_MAP_DATA.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      st.code.toLowerCase().includes(filterQuery.toLowerCase()) ||
      st.districts.some((d) => d.name.toLowerCase().includes(filterQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (categoryFilter === 'HAZARD_MONITORED') {
      return st.isMonitored || st.risk >= 40;
    }
    if (categoryFilter === 'HIMALAYAN') {
      return ['uttarakhand', 'himachal_pradesh', 'sikkim', 'arunachal_pradesh', 'jammu_and_kashmir', 'ladakh', 'meghalaya', 'nagaland', 'manipur', 'mizoram'].includes(st.id);
    }
    if (categoryFilter === 'GHATS') {
      return ['kerala', 'karnataka', 'maharashtra', 'tamil_nadu', 'goa', 'andhra_pradesh'].includes(st.id);
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#081322] border border-[#18314e] rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#142944] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#00d492]/10 border border-[#00d492]/30 flex items-center justify-center text-[#00d492]">
              <Layers2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                India Administrative & Hazard Sectors
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Select any of the 36 States & Union Territories to inspect district-level risk telemetry
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="p-4 bg-[#050d18] border-b border-[#142944] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter states, UTs, or district names..."
              className="w-full bg-[#081525] border border-[#18314e] focus:border-[#00d492] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 mr-1 font-bold">
              FILTER:
            </span>
            {[
              { id: 'ALL', label: 'All 36 Regions' },
              { id: 'HAZARD_MONITORED', label: 'Hazard Monitored (GSI/IMD)' },
              { id: 'HIMALAYAN', label: 'Himalayan Belt' },
              { id: 'GHATS', label: 'Western & Eastern Ghats' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-[#00d492] text-[#050c17] shadow'
                    : 'bg-[#081525] text-slate-400 hover:text-slate-200 border border-[#162d47]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* States Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredStates.map((st) => {
            const isSelected = selectedStateId === st.id;
            const isHighRisk = st.risk >= 65;
            const isMedRisk = st.risk >= 40 && st.risk < 65;

            return (
              <div
                key={st.id}
                onClick={() => {
                  onSelectState(st);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-[#00d492]/10 border-[#00d492] shadow-lg'
                    : 'bg-[#060e19] border-[#162d47] hover:border-[#00d492]/60 hover:bg-[#0c1f36]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {st.code}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        {st.type === 'ut' ? 'Union Territory' : 'State'}
                      </span>
                    </div>
                    <h4 className="font-bold text-white group-hover:text-[#00d492] transition-colors">
                      {st.name}
                    </h4>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border ${
                      isHighRisk
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                        : isMedRisk
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    {st.risk}% Avg
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-[#12243a]">
                  <span>{st.districts.length} Monitored Districts</span>
                  <div className="flex items-center gap-1 text-[#00d492] group-hover:translate-x-1 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#050d18] border-t border-[#142944] text-center text-xs font-mono text-slate-400">
          Showing {filteredStates.length} of {ALL_INDIAN_STATES_MAP_DATA.length} Indian administrative entities
        </div>
      </div>
    </div>
  );
};
