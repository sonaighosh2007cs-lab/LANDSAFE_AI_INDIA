import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  MapPin,
  Droplets,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { WARNING_HOTSPOTS } from '../data/disasterData';
import { useApp } from '../context/AppContext';
import { resolveLocation } from '../data/locations';

export const ActiveWarningHotspotPage: React.FC = () => {
  const { setUserLocation, changeUserLocation, setActiveRoute } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredHotspots = WARNING_HOTSPOTS.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev =
      filterSeverity === 'ALL' ||
      (filterSeverity === 'CRITICAL' && h.riskScore >= 75) ||
      (filterSeverity === 'HIGH' && h.riskScore >= 50 && h.riskScore < 75) ||
      (filterSeverity === 'MONITORED' && h.riskScore < 50);
    return matchesSearch && matchesSev;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="border-b border-[#14263c] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500 animate-pulse" />
            National Active Landslide Warning Hotspots
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time critical slope displacement alerts across Himalayas and Western Ghats.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 w-fit">
          ● 6 Active Monitored Corridors
        </span>
      </div>

      {/* Controls Bar */}
      <div className="bg-[#08121f] border border-[#162d47] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search hotspot by name or state..."
            className="w-full bg-[#060e19] border border-[#18314e] focus:border-[#00d492] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'CRITICAL', 'HIGH', 'MONITORED'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-[#009e60] text-white'
                  : 'bg-[#0c1e33] text-slate-400 hover:text-white border border-[#14263c]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Hotspots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHotspots.map((h) => {
          const isCritical = h.riskScore >= 75;
          return (
            <div
              key={h.id}
              className={`bg-[#091626] border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01] ${
                isCritical ? 'border-rose-700/60 shadow-rose-950/20' : 'border-[#182f4d]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      isCritical
                        ? 'bg-rose-950 text-rose-300 border-rose-700'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    }`}
                  >
                    {h.threatLevel} ({h.riskScore}%)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{h.state}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">{h.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{h.status}</p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#060e19] p-3 rounded-xl border border-[#14263c] mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">24h Rainfall:</span>
                    <span className="text-sky-400 font-bold">{h.rainfall24h} mm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Creep Rate:</span>
                    <span className="text-rose-400 font-bold">{h.slopeCreepRate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pore Saturation:</span>
                    <span className="text-purple-400 font-bold">{h.porePressure}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sensors Live:</span>
                    <span className="text-emerald-400 font-bold">
                      {h.sensorsOnline}/{h.totalSensors}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-amber-300 font-medium bg-[#141007] border border-amber-800/40 p-2.5 rounded-lg mb-4">
                  <span className="font-bold text-amber-400">Action:</span> {h.evacuationStatus}
                </div>
              </div>

              <button
                onClick={async () => {
                  const loc = resolveLocation(
                    h.state.split('/')[0].toLowerCase().trim(),
                    h.name.split('–')[0].toLowerCase().trim(),
                    h.name.split('–')[0].trim()
                  );
                  if (changeUserLocation) {
                    await changeUserLocation(loc);
                  } else {
                    setUserLocation(loc);
                  }
                  setActiveRoute('dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-[#0f243b] hover:bg-[#009e60] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Switch Dashboard to {h.name.split('–')[0].trim()}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
