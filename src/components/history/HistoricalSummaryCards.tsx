import React from 'react';
import {
  Wind,
  Thermometer,
  Droplets,
  CloudRain,
  ShieldAlert,
  Flame,
  Activity,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { HistoricalStatistics } from '../../types/history';

interface HistoricalSummaryCardsProps {
  stats: HistoricalStatistics;
  timeRangeLabel: string;
  locationName: string;
}

export const HistoricalSummaryCards: React.FC<HistoricalSummaryCardsProps> = ({
  stats,
  timeRangeLabel,
  locationName,
}) => {
  const getAqiBadge = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' };
    if (aqi <= 200) return { label: 'Poor', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
    if (aqi <= 300) return { label: 'Very Poor', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
    return { label: 'Severe', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30' };
  };

  const getRiskBadge = (risk: number) => {
    if (risk >= 75) return { label: 'Critical Risk', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    if (risk >= 50) return { label: 'High Risk', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
    if (risk >= 30) return { label: 'Moderate Risk', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Low Risk', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  };

  const aqiBadge = getAqiBadge(stats.averageAQI);
  const riskBadge = getRiskBadge(stats.averageRisk);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="historical-summary-cards">
      {/* 1. Air Quality Summary Card */}
      <div className="bg-[#091626] border border-[#182f4d] hover:border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>AIR QUALITY (AQI)</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${aqiBadge.color}`}>
              {aqiBadge.label}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-black text-white tracking-tight">{stats.averageAQI}</span>
            <span className="text-xs text-slate-400 font-mono">Avg AQI</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#14263c] flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1">
            <ArrowUp className="w-3 h-3 text-rose-400" />
            <span className="text-slate-400">Peak:</span>
            <strong className="text-white font-bold">{stats.highestAQI}</strong>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDown className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-400">Min:</span>
            <strong className="text-white font-bold">{stats.lowestAQI}</strong>
          </div>
        </div>
      </div>

      {/* 2. Temperature Summary Card */}
      <div className="bg-[#091626] border border-[#182f4d] hover:border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>TEMPERATURE RANGE</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-[#060e19] px-2 py-0.5 rounded border border-[#14263c]">
              Celsius (°C)
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-black text-white tracking-tight">{stats.averageTemperature}°</span>
            <span className="text-xs text-slate-400 font-mono">Mean Temp</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#14263c] flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1">
            <ArrowUp className="w-3 h-3 text-amber-400" />
            <span className="text-slate-400">Max:</span>
            <strong className="text-amber-300 font-bold">{stats.highestTemperature}°C</strong>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDown className="w-3 h-3 text-sky-400" />
            <span className="text-slate-400">Min:</span>
            <strong className="text-sky-300 font-bold">{stats.lowestTemperature}°C</strong>
          </div>
        </div>
      </div>

      {/* 3. Rainfall & Humidity Summary Card */}
      <div className="bg-[#091626] border border-[#182f4d] hover:border-sky-500/30 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <CloudRain className="w-4 h-4 text-sky-400" />
              <span>PRECIPITATION & RAIN</span>
            </div>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              {stats.rainyDaysCount > 0 ? `${stats.rainyDaysCount} Rain Events` : 'Dry Period'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-black text-sky-400 tracking-tight">{stats.totalRainfall}</span>
            <span className="text-xs text-slate-400 font-mono">mm Total Rain</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#14263c] flex items-center justify-between text-xs font-mono text-slate-300">
          <div>
            <span className="text-slate-400">Peak Rain:</span>{' '}
            <strong className="text-sky-300">{stats.highestRainfall} mm</strong>
          </div>
          <div>
            <span className="text-slate-400">Avg Humidity:</span>{' '}
            <strong className="text-white">{stats.averageHumidity}%</strong>
          </div>
        </div>
      </div>

      {/* 4. LandSafe AI Geotechnical Risk Assessment Card */}
      <div className="bg-[#091626] border border-[#182f4d] hover:border-orange-500/30 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <span>LANDSAFE AI RISK</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${riskBadge.color}`}>
              {riskBadge.label}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-black text-white tracking-tight">{stats.averageRisk}</span>
            <span className="text-xs text-slate-400 font-mono">/100 Avg Index</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#14263c] flex items-center justify-between text-xs font-mono text-slate-300">
          <div>
            <span className="text-slate-400">Max Risk:</span>{' '}
            <strong className={stats.highestRisk >= 50 ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
              {stats.highestRisk}/100
            </strong>
          </div>
          <div>
            <span className="text-slate-400">Surge Events:</span>{' '}
            <strong className="text-white">{stats.highRiskEventsCount}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
