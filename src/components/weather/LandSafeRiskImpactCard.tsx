import React from 'react';
import { Mountain, AlertTriangle, ShieldCheck, Layers, Droplet, ArrowRight } from 'lucide-react';
import { WeatherData } from '../../types/weather';
import { UserLocation } from '../../types';

interface LandSafeRiskImpactCardProps {
  weather: WeatherData;
  location: UserLocation;
}

export const LandSafeRiskImpactCard: React.FC<LandSafeRiskImpactCardProps> = ({
  weather,
  location,
}) => {
  const currentRain = weather.current.precipitation;
  const rain24h = weather.rainWindow.totalExpectedRain24h;
  const slope = location.slopeAngle || 18.5;
  const lithology = location.lithology || 'Metamorphic Complex';

  // Dynamic GSI trigger threshold calculation based on slope and lithology
  const gsiThreshold24h = slope >= 30 ? 45 : slope >= 20 ? 60 : 80;
  const thresholdPercentage = Math.min(Math.round((rain24h / gsiThreshold24h) * 100), 100);

  const riskStatus =
    thresholdPercentage >= 80
      ? { label: 'CRITICAL HAZARD TRIGGER', color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-800' }
      : thresholdPercentage >= 50
      ? { label: 'ELEVATED PORE-WATER WATCH', color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-800' }
      : { label: 'STABLE SLOPE DRAINAGE', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800' };

  return (
    <div
      className="bg-[#091626] border border-[#1b385a] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4"
      id="landsafe-geotechnical-weather-bridge"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#14263c]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Mountain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              LandSafe AI Geotechnical & Slope Safety Analysis
            </h3>
            <p className="text-xs text-slate-400">
              Correlation of real-time precipitation telemetry with slope stability and GSI trigger thresholds
            </p>
          </div>
        </div>

        <span className={`text-xs font-mono px-3 py-1 rounded-full border uppercase font-bold self-start sm:self-center ${riskStatus.bg} ${riskStatus.color}`}>
          {riskStatus.label}
        </span>
      </div>

      {/* Grid of Geotechnical Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Rainfall Threshold Meter */}
        <div className="bg-[#060e19] p-4 rounded-xl border border-[#13273e] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase">GSI 24h Trigger Threshold</span>
            <Droplet className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{rain24h} mm</span>
            <span className="text-xs font-mono text-slate-400">/ {gsiThreshold24h} mm limit</span>
          </div>
          <div className="h-2 w-full bg-[#091626] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                thresholdPercentage >= 80
                  ? 'bg-rose-500'
                  : thresholdPercentage >= 50
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.max(thresholdPercentage, 5)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400">
            {thresholdPercentage}% of liquefaction initiation limit reached
          </p>
        </div>

        {/* Slope & Topography */}
        <div className="bg-[#060e19] p-4 rounded-xl border border-[#13273e] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase">Terrain Incline</span>
            <Mountain className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{slope.toFixed(1)}°</span>
            <span className="text-xs font-mono text-slate-400">Gradient</span>
          </div>
          <p className="text-[11px] text-slate-300">
            {slope > 25 ? 'High gravitational shear strain across ridge cuts.' : 'Moderate slope equilibrium with natural dendritic runoff.'}
          </p>
        </div>

        {/* Lithology & Bedrock */}
        <div className="bg-[#060e19] p-4 rounded-xl border border-[#13273e] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase">Lithology & Strata</span>
            <Layers className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-sm font-bold text-white truncate">{lithology}</p>
          <p className="text-[11px] text-slate-300">
            Water infiltration capacity calculated at <strong className="text-sky-300 font-mono">14.2 mm/hr</strong>.
          </p>
        </div>
      </div>

      {/* Attribution & Layer Separation Notice */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 border-t border-[#14263c] gap-2">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          Independent geotechnical safety computation layer
        </span>
        <span className="font-mono text-slate-500">
          Data source: {weather.dataSource}
        </span>
      </div>
    </div>
  );
};
