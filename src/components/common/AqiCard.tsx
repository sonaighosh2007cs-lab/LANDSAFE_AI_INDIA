import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Wind,
  Activity,
  RefreshCw,
  AlertTriangle,
  Info,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { UserLocation } from '../../types';
import { AqiData } from '../../types/aqi';
import { fetchValidatedAqi } from '../../services/locationDataService';

interface AqiCardProps {
  location: UserLocation;
  variant?: 'dashboard' | 'myarea';
  className?: string;
}

export const AqiCard: React.FC<AqiCardProps> = ({
  location,
  variant = 'dashboard',
  className = '',
}) => {
  const [aqiData, setAqiData] = useState<AqiData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPollutants, setShowPollutants] = useState<boolean>(true);

  const abortControllerRef = useRef<AbortController | null>(null);
  const currentLocRef = useRef<UserLocation>(location);

  const fetchAqi = useCallback(
    async (isManual = false) => {
      if (!location || !location.coordinates) return;

      currentLocRef.current = location;

      if (isManual) {
        setIsRefreshing(true);
      } else {
        // Immediate clean state on location change
        setIsLoading(true);
        setAqiData(null);
      }
      setError(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const data = await fetchValidatedAqi(location, abortControllerRef.current.signal);
        
        // Ensure this response matches the current location
        if (
          currentLocRef.current.coordinates.lat === location.coordinates.lat &&
          currentLocRef.current.coordinates.lng === location.coordinates.lng
        ) {
          setAqiData(data);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching live AQI:', err);
          setError(err.message || 'Unable to retrieve live air quality');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [location]
  );

  useEffect(() => {
    fetchAqi();

    const interval = setInterval(() => {
      fetchAqi(true);
    }, 180000); // 3 minutes refresh

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAqi]);

  const getBadgeStyle = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'good':
        return {
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
          dot: 'bg-emerald-400',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-950/80',
          border: 'border-amber-500/40',
          text: 'text-amber-300',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
          dot: 'bg-amber-400',
        };
      case 'poor':
        return {
          bg: 'bg-orange-950/80',
          border: 'border-orange-500/40',
          text: 'text-orange-400',
          glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]',
          dot: 'bg-orange-400',
        };
      case 'very poor':
        return {
          bg: 'bg-rose-950/80',
          border: 'border-rose-500/50',
          text: 'text-rose-400',
          glow: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]',
          dot: 'bg-rose-500',
        };
      case 'severe':
        return {
          bg: 'bg-red-950/90',
          border: 'border-red-600',
          text: 'text-red-300',
          glow: 'shadow-[0_0_20px_rgba(220,38,38,0.35)]',
          dot: 'bg-red-500 animate-ping',
        };
      default:
        return {
          bg: 'bg-slate-900',
          border: 'border-slate-700',
          text: 'text-slate-300',
          glow: '',
          dot: 'bg-slate-400',
        };
    }
  };

  const style = getBadgeStyle(aqiData?.category);

  if (isLoading && !aqiData) {
    return (
      <div
        className={`bg-[#060e19] border border-[#14263c] rounded-2xl p-4 sm:p-5 animate-pulse ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-36 bg-slate-800 rounded" />
          <div className="h-4 w-20 bg-slate-800 rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="h-16 bg-slate-900/60 rounded-xl" />
          <div className="h-16 bg-slate-900/60 rounded-xl" />
          <div className="h-16 bg-slate-900/60 rounded-xl" />
          <div className="h-16 bg-slate-900/60 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-[#060e19] border border-[#14263c] rounded-2xl p-4 sm:p-5 shadow-xl transition-all hover:border-[#1e3d64] ${className}`}
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#10243a]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                Air Quality Index (AQI)
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#09182a] text-slate-400 border border-[#122842]">
                {location.area}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              CPCB / Continuous Ambient Air Monitoring Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchAqi(true)}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-[#09182a] border border-[#142840] text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            title="Refresh AQI Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      {/* Main AQI Score + Category Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 items-center">
        {/* Main AQI Big Metric Box (5 cols) */}
        <div
          className={`md:col-span-5 rounded-xl border p-4 flex items-center justify-between transition-all ${style.bg} ${style.border} ${style.glow}`}
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">
              Current AQI
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                {aqiData ? aqiData.aqi : '--'}
              </span>
              <span className="text-xs font-mono text-slate-400 font-normal">US/NAQI</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${style.dot}`} />
              <span className={`text-xs font-bold font-mono tracking-wide ${style.text}`}>
                {aqiData?.category?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="text-right flex flex-col items-end justify-center">
            <span className="text-[10px] font-mono text-slate-400">Dominant</span>
            <span className="text-xs font-bold font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/80 mt-0.5">
              {aqiData?.dominantPollutant || 'PM2.5'}
            </span>
            <span className="text-[9px] font-mono text-slate-500 mt-1">
              {location.district} Sector
            </span>
          </div>
        </div>

        {/* Health Advisory & Scale Guide (7 cols) */}
        <div className="md:col-span-7 bg-[#081525] border border-[#11263e] rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
              <span className="flex items-center gap-1 text-slate-300 font-semibold">
                <Info className="w-3 h-3 text-cyan-400" />
                Health Impact & Advisory
              </span>
              <span className="text-slate-500">CPCB Standards</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {aqiData?.healthRecommendation ||
                'Air quality is within baseline limits. Maintain general ambient ventilation.'}
            </p>
          </div>

          {/* Mini scale reference bar */}
          <div className="mt-3 pt-2.5 border-t border-[#0e2136]">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
              <span>0 (Good)</span>
              <span>100 (Mod)</span>
              <span>200 (Poor)</span>
              <span>300 (V.Poor)</span>
              <span>500 (Severe)</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-900 flex">
              <div className="h-full w-[20%] bg-emerald-500" />
              <div className="h-full w-[20%] bg-amber-500" />
              <div className="h-full w-[20%] bg-orange-500" />
              <div className="h-full w-[20%] bg-rose-500" />
              <div className="h-full w-[20%] bg-red-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown of 6 Key Pollutants */}
      {aqiData && aqiData.pollutants && (
        <div className="mt-4 pt-3 border-t border-[#10243a]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Live Pollutant Concentrations (Micro-Sensors)
            </span>
            <button
              type="button"
              onClick={() => setShowPollutants(!showPollutants)}
              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer"
            >
              <span>{showPollutants ? 'Hide Breakdown' : 'Show Breakdown'}</span>
              {showPollutants ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {showPollutants && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {/* PM2.5 */}
              <div className="bg-[#081525] border border-[#122740] rounded-xl p-2.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="font-bold text-white">PM2.5</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded ${
                      (aqiData.pollutants?.pm2_5?.value ?? 0) > 60
                        ? 'text-rose-400 bg-rose-950/60'
                        : (aqiData.pollutants?.pm2_5?.value ?? 0) > 30
                        ? 'text-amber-300 bg-amber-950/60'
                        : 'text-emerald-400 bg-emerald-950/60'
                    }`}
                  >
                    {aqiData.pollutants?.pm2_5?.status || 'Good'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {aqiData.pollutants?.pm2_5?.value ?? '--'}{' '}
                  <span className="text-[9px] font-normal text-slate-400">µg/m³</span>
                </div>
              </div>

              {/* PM10 */}
              <div className="bg-[#081525] border border-[#122740] rounded-xl p-2.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="font-bold text-white">PM10</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded ${
                      (aqiData.pollutants?.pm10?.value ?? 0) > 100
                        ? 'text-rose-400 bg-rose-950/60'
                        : (aqiData.pollutants?.pm10?.value ?? 0) > 50
                        ? 'text-amber-300 bg-amber-950/60'
                        : 'text-emerald-400 bg-emerald-950/60'
                    }`}
                  >
                    {aqiData.pollutants?.pm10?.status || 'Good'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {aqiData.pollutants?.pm10?.value ?? '--'}{' '}
                  <span className="text-[9px] font-normal text-slate-400">µg/m³</span>
                </div>
              </div>

              {/* NO2 */}
              <div className="bg-[#081525] border border-[#122740] rounded-xl p-2.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="font-bold text-white">NO₂</span>
                  <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded">
                    {aqiData.pollutants?.no2?.status || 'Good'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {aqiData.pollutants?.no2?.value ?? '--'}{' '}
                  <span className="text-[9px] font-normal text-slate-400">µg/m³</span>
                </div>
              </div>

              {/* SO2 */}
              <div className="bg-[#081525] border border-[#122740] rounded-xl p-2.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="font-bold text-white">SO₂</span>
                  <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded">
                    {aqiData.pollutants?.so2?.status || 'Good'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {aqiData.pollutants?.so2?.value ?? '--'}{' '}
                  <span className="text-[9px] font-normal text-slate-400">µg/m³</span>
                </div>
              </div>

              {/* CO */}
              <div className="bg-[#081525] border border-[#122740] rounded-xl p-2.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="font-bold text-white">CO</span>
                  <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded">
                    {aqiData.pollutants?.co?.status || 'Good'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {aqiData.pollutants?.co?.value ?? '--'}{' '}
                  <span className="text-[9px] font-normal text-slate-400">µg/m³</span>
                </div>
              </div>

              {/* O3 */}
              <div className="bg-[#081525] border border-[#122740] rounded-xl p-2.5 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="font-bold text-white">O₃</span>
                  <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded">
                    {aqiData.pollutants?.o3?.status || 'Good'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  {aqiData.pollutants?.o3?.value ?? '--'}{' '}
                  <span className="text-[9px] font-normal text-slate-400">µg/m³</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
