import React, { useState } from 'react';
import { Shield, ChevronUp, ChevronDown, Info, Radio } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="absolute bottom-4 right-4 z-20 bg-[#081322]/90 border border-[#18314e] rounded-2xl p-3 shadow-2xl backdrop-blur-md text-xs font-mono max-w-[280px]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[11px]">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>HAZARD TIER INDEX</span>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2.5 pt-2 border-t border-[#12243a] space-y-1.5 text-[10px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-ping" />
              <span className="text-rose-300 font-bold">Critical Hazard</span>
            </div>
            <span className="text-slate-400">≥ 85%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
              <span className="text-amber-300 font-semibold">Elevated Watch</span>
            </div>
            <span className="text-slate-400">70 – 84%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-yellow-300">Moderate</span>
            </div>
            <span className="text-slate-400">40 – 69%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-300">Nominal / Stable</span>
            </div>
            <span className="text-slate-400">&lt; 40%</span>
          </div>

          <div className="pt-1.5 border-t border-[#12243a] text-[9px] text-slate-500 flex items-center justify-between">
            <span>Mesh: GSI • IMD • BRO</span>
            <span className="text-emerald-400">● 100% Live</span>
          </div>
        </div>
      )}
    </div>
  );
};
