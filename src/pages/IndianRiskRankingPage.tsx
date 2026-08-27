import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  ShieldAlert,
  Search,
  RefreshCw,
  Clock,
  AlertTriangle,
  Radio,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { resolveLocation } from '../data/locations';
import { computeDynamicStateRiskRankings } from '../services/liveData/rankingService';
import { DynamicStateRiskRanking } from '../services/liveData/types';

export const IndianRiskRankingPage: React.FC = () => {
  const { setUserLocation, setActiveRoute } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'riskScore' | 'incidents' | 'coverage' | 'gsi'>('rank');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rankingData, setRankingData] = useState(() => computeDynamicStateRiskRankings());

  const refreshRankings = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRankingData(computeDynamicStateRiskRankings());
      setIsRefreshing(false);
    }, 450);
  };

  useEffect(() => {
    // Auto-refresh rankings every 5 minutes
    const interval = setInterval(() => {
      setRankingData(computeDynamicStateRiskRankings());
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const sortedList = useMemo(() => {
    return [...rankingData.rankings]
      .filter(
        (s) =>
          s.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.activeAlertLevel.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'rank') return a.rank - b.rank;
        if (sortBy === 'riskScore') return b.riskScore - a.riskScore;
        if (sortBy === 'incidents') return b.incidentsThisYear - a.incidentsThisYear;
        if (sortBy === 'coverage') return b.sensorCoverage - a.sensorCoverage;
        if (sortBy === 'gsi') return b.gsiSusceptibilityIndex - a.gsiSusceptibilityIndex;
        return 0;
      });
  }, [rankingData.rankings, searchTerm, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="border-b border-[#14263c] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-950/80 text-[#00d492] border border-emerald-800 flex items-center gap-1.5 uppercase">
              <Radio className="w-3 h-3 animate-pulse" />
              Live Vulnerability Model
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-[#0c1d30] px-2 py-0.5 rounded border border-[#163456]">
              Source: {rankingData.source}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            National Landslide Vulnerability Rankings (All Indian States & UTs)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time multi-criteria ranking synthesized from GSI National Landslide Susceptibility Index (NLSI), active IMD rainfall pulses, and telemetry density.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#091626] border border-[#1b385a] text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Updated: {rankingData.lastUpdatedFormatted}</span>
          </div>
          <button
            onClick={refreshRankings}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-xl bg-[#0f243b] hover:bg-[#009e60] border border-[#1d3d63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#08121f] border border-[#162d47] rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by state, region, or alert level..."
            className="w-full bg-[#060e19] border border-[#18314e] focus:border-[#00d492] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto text-xs font-mono text-slate-400">
          <span>Sort By:</span>
          {[
            { id: 'rank', label: 'Hazard Rank' },
            { id: 'riskScore', label: 'Risk Index' },
            { id: 'gsi', label: 'GSI NLSI' },
            { id: 'incidents', label: '2026 Slips' },
            { id: 'coverage', label: 'Sensor Mesh' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSortBy(btn.id as any)}
              className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                sortBy === btn.id
                  ? 'bg-[#009e60] text-white border-transparent'
                  : 'bg-[#060e19] border-[#14263c] hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#091626] border border-rose-900/50 p-3.5 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Critical Hazard Zones</span>
          <span className="text-xl font-bold text-rose-400 font-mono">
            {rankingData.rankings.filter((r) => r.hazardTier === 'Critical Hazard').length} States
          </span>
        </div>
        <div className="bg-[#091626] border border-amber-900/50 p-3.5 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Active IMD Warnings</span>
          <span className="text-xl font-bold text-amber-400 font-mono">
            {rankingData.rankings.filter((r) => r.activeAlertLevel !== 'Green Normal').length} Active
          </span>
        </div>
        <div className="bg-[#091626] border border-[#1b385a] p-3.5 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total At-Risk Population</span>
          <span className="text-xl font-bold text-white font-mono">24.5+ Million</span>
        </div>
        <div className="bg-[#091626] border border-[#1b385a] p-3.5 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Average Sensor Mesh Coverage</span>
          <span className="text-xl font-bold text-[#00d492] font-mono">77.4%</span>
        </div>
      </div>

      {/* Ranking Table Card */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#14263c] bg-[#060e19] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Rank</th>
                <th className="py-3.5 px-4 font-semibold">State / Union Territory</th>
                <th className="py-3.5 px-4 font-semibold">Geological Zone</th>
                <th className="py-3.5 px-4 font-semibold">Risk Score</th>
                <th className="py-3.5 px-4 font-semibold">IMD Warning Level</th>
                <th className="py-3.5 px-4 font-semibold">Monsoon Rainfall Pulse</th>
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
                    key={st.state}
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
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase inline-block mt-0.5 ${
                          st.hazardTier === 'Critical Hazard'
                            ? 'text-rose-400 bg-rose-950/60 border border-rose-800'
                            : st.hazardTier === 'High Hazard'
                            ? 'text-amber-400 bg-amber-950/60 border border-amber-800'
                            : 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
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
                            ? 'text-rose-400 font-extrabold'
                            : st.riskScore >= 50
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {st.riskScore}%
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal block font-mono">
                        NLSI: {st.gsiSusceptibilityIndex}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          st.activeAlertLevel === 'Red Alert'
                            ? 'bg-rose-950 text-rose-300 border border-rose-700'
                            : st.activeAlertLevel === 'Orange Alert'
                            ? 'bg-amber-950 text-amber-300 border border-amber-700'
                            : st.activeAlertLevel === 'Yellow Watch'
                            ? 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {st.activeAlertLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                      {st.liveRainfallAnomaly}
                    </td>
                    <td className="py-3.5 px-4 text-white font-mono font-bold">{st.incidentsThisYear}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-[#060e19] rounded-full overflow-hidden">
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
                        className="px-3 py-1 rounded-lg bg-[#0f243b] hover:bg-[#009e60] text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-sm inline-flex items-center gap-1"
                      >
                        <span>Monitor</span>
                        <ChevronRight className="w-3 h-3" />
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
