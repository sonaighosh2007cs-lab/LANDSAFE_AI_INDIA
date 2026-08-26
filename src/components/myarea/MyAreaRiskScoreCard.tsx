import React from 'react';
import { ExternalLink, ShieldAlert, AlertTriangle, Map } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MyAreaRiskScoreCardProps {
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export const MyAreaRiskScoreCard: React.FC<MyAreaRiskScoreCardProps> = ({
  riskScore,
  riskLevel,
}) => {
  const { setActiveRoute, setIsNotificationDrawerOpen } = useApp();

  const isCritical = riskScore >= 75;
  const isHigh = riskScore >= 50 && riskScore < 75;
  const isModerate = riskScore >= 35 && riskScore < 50;

  const strokeColor = isCritical
    ? '#f43f5e'
    : isHigh
    ? '#f97316'
    : isModerate
    ? '#eab308'
    : '#00d492';

  const badgeStyle = isCritical
    ? 'text-rose-400 border-rose-800/80 bg-rose-950/60'
    : isHigh
    ? 'text-orange-400 border-orange-800/80 bg-orange-950/60'
    : isModerate
    ? 'text-amber-400 border-amber-800/80 bg-amber-950/60'
    : 'text-emerald-400 border-emerald-800/80 bg-emerald-950/60';

  // SVG Circular Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div className="bg-[#060e19] border border-[#14263c] rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-[#1d3d63] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#0f2136]">
        <h2 className="font-mono text-xs sm:text-sm font-black tracking-wider text-slate-300">
          AI RISK SCORE
        </h2>
        <span
          className={`text-[11px] font-mono font-black px-2.5 py-0.5 rounded border uppercase tracking-wider ${badgeStyle}`}
        >
          {riskLevel}
        </span>
      </div>

      {/* Main Center Area: Gauge & Big Instability Display */}
      <div className="flex flex-col items-center justify-center my-auto py-2 text-center">
        {/* Circular Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-3">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 130 130">
            {/* Background track circle */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke="#0f2238"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Active glowing metric circle */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke={strokeColor}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${strokeColor}80)`,
              }}
            />
          </svg>

          {/* Center Text inside gauge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-white font-mono leading-none">
              {riskScore}
            </span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-1">
              / 100
            </span>
          </div>
        </div>

        {/* Large Score Label */}
        <div className="space-y-1 mb-4">
          <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
            {riskScore}%
          </div>
          <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            AI INSTABILITY SCORE
          </p>
        </div>

        {/* Confidence & Threshold Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full border border-teal-500/40 bg-teal-950/30 text-teal-300 font-mono text-xs font-semibold">
            98% Confidence
          </span>
          <span className="px-3 py-1 rounded-full border border-amber-500/40 bg-amber-950/30 text-amber-300 font-mono text-xs font-semibold">
            Threshold: 70%
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-[#0f2136]">
        <button
          type="button"
          onClick={() => setActiveRoute('india-map')}
          className="w-full py-2.5 px-3 rounded-xl bg-[#00d492] hover:bg-[#00b870] text-[#050c17] font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-950/40 hover:scale-[1.02]"
        >
          <ExternalLink className="w-4 h-4 text-[#050c17]" />
          <span>GIS Risk Map</span>
        </button>

        <button
          type="button"
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-[#0a1523] border border-[#1b3656] hover:bg-[#10233b] text-amber-300 hover:text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:border-amber-500/50"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Active Alerts</span>
        </button>
      </div>
    </div>
  );
};
