import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  ShieldAlert,
  ArrowUpDown,
  Search,
  CheckCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { INDIAN_STATES_RISK_RANKING } from '../data/disasterData';
import { useApp } from '../context/AppContext';
import { resolveLocation } from '../data/locations';

export const IndianRiskRankingPage: React.FC = () => {
  const { setUserLocation, setActiveRoute } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'riskScore' | 'incidents' | 'coverage'>('rank');

  const sortedList = [...INDIAN_STATES_RISK_RANKING]
    .filter(
      (s) =>
        s.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.region.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'rank') return a.rank - b.rank;
      if (sortBy === 'riskScore') return b.riskScore - a.riskScore;
      if (sortBy === 'incidents') return b.incidentsThisYear - a.incidentsThisYear;
      if (sortBy === 'coverage') return b.sensorCoverage - a.sensorCoverage;
      return 0;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="border-b border-[#14263c] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            National Landslide Vulnerability Rankings (All States & UTs)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Official GSI National Landslide Susceptibility Index (NLSI) weighted rankings.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#091626] border border-[#1b385a] text-amber-400 w-fit">
          2026 Monsoon Dynamic Vulnerability Model
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#08121f] border border-[#162d47] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search state, UT, or region..."
            className="w-full bg-[#060e19] border border-[#18314e] focus:border-[#00d492] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Sort By:</span>
          <button
            onClick={() => setSortBy('rank')}
            className={`px-2.5 py-1 rounded-lg border ${
              sortBy === 'rank' ? 'bg-[#009e60] text-white border-transparent' : 'bg-[#060e19] border-[#14263c]'
            }`}
          >
            Hazard Rank
          </button>
          <button
            onClick={() => setSortBy('riskScore')}
            className={`px-2.5 py-1 rounded-lg border ${
              sortBy === 'riskScore' ? 'bg-[#009e60] text-white border-transparent' : 'bg-[#060e19] border-[#14263c]'
            }`}
          >
            Risk Index
          </button>
          <button
            onClick={() => setSortBy('incidents')}
            className={`px-2.5 py-1 rounded-lg border ${
              sortBy === 'incidents' ? 'bg-[#009e60] text-white border-transparent' : 'bg-[#060e19] border-[#14263c]'
            }`}
          >
            2026 Events
          </button>
        </div>
      </div>

      {/* Ranking Table Card */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#14263c] bg-[#060e19] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Rank</th>
                <th className="py-3.5 px-4 font-semibold">State / Territory</th>
                <th className="py-3.5 px-4 font-semibold">Geological Zone</th>
                <th className="py-3.5 px-4 font-semibold">Risk Score</th>
                <th className="py-3.5 px-4 font-semibold">Population at Risk</th>
                <th className="py-3.5 px-4 font-semibold">2026 Slips</th>
                <th className="py-3.5 px-4 font-semibold">Sensor Mesh</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#12243a]">
              {sortedList.map((st) => {
                const isTopHazard = st.rank <= 3;
                return (
                  <tr
                    key={st.rank}
                    className="hover:bg-[#0c1f36] transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${
                          isTopHazard
                            ? 'bg-rose-950 text-rose-300 border border-rose-700'
                            : 'bg-[#060e19] text-slate-300 border border-[#14263c]'
                        }`}
                      >
                        #{st.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-xs group-hover:text-[#00d492] transition-colors">
                        {st.state}
                      </p>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                          st.hazardTier === 'Critical Hazard'
                            ? 'text-rose-400 bg-rose-950/60'
                            : st.hazardTier === 'High Hazard'
                            ? 'text-amber-400 bg-amber-950/60'
                            : 'text-emerald-400 bg-emerald-950/60'
                        }`}
                      >
                        {st.hazardTier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{st.region}</td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span
                        className={
                          st.riskScore >= 75
                            ? 'text-rose-400'
                            : st.riskScore >= 50
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {st.riskScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">{st.populationAtRisk}</td>
                    <td className="py-3.5 px-4 text-white font-mono font-bold">{st.incidentsThisYear}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#060e19] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00d492] rounded-full"
                            style={{ width: `${st.sensorCoverage}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">{st.sensorCoverage}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          const loc = resolveLocation(st.state.toLowerCase(), '', '');
                          setUserLocation(loc);
                          setActiveRoute('dashboard');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#0f243b] hover:bg-[#009e60] text-white text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Monitor →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
