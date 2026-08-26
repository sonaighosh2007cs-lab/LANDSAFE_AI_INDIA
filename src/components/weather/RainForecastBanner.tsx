import React from 'react';
import { CloudRain, CloudDrizzle, AlertCircle, Droplets, CheckCircle2, Clock } from 'lucide-react';
import { RainWindowInfo, HourlyForecastItem } from '../../types/weather';

interface RainForecastBannerProps {
  rainWindow: RainWindowInfo;
  hourly: HourlyForecastItem[];
}

export const RainForecastBanner: React.FC<RainForecastBannerProps> = ({
  rainWindow,
  hourly,
}) => {
  const next12h = hourly.slice(0, 12);
  const isRaining = rainWindow.status === 'ACTIVE_RAIN';
  const isRainLikely = rainWindow.status === 'RAIN_LIKELY';

  return (
    <div
      className={`rounded-2xl border p-5 transition-all shadow-xl ${
        isRaining
          ? 'bg-gradient-to-r from-[#0d2238] via-[#091a2e] to-[#081729] border-sky-500/40'
          : isRainLikely
          ? 'bg-gradient-to-r from-[#172233] via-[#0f1a28] to-[#091523] border-cyan-500/30'
          : 'bg-[#091626] border-[#182f4c]'
      }`}
      id="rain-forecast-window-card"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#14263c]">
        {/* Left Status & Headline */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
              isRaining
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/50 animate-pulse'
                : isRainLikely
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isRaining ? (
              <CloudRain className="w-5 h-5" />
            ) : isRainLikely ? (
              <CloudDrizzle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-sky-400">
                Precipitation Window & Rain Radar Telemetry
              </span>
              {rainWindow.expectedStartTime && (
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#13273e] text-slate-300">
                  <Clock className="w-3 h-3 text-sky-400" />
                  {rainWindow.expectedStartTime}
                  {rainWindow.expectedEndTime ? ` – ${rainWindow.expectedEndTime}` : ''}
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              {rainWindow.headline}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {rainWindow.details}
            </p>
          </div>
        </div>

        {/* Right Metric Highlights */}
        <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
          <div className="bg-[#060e19] border border-[#14263c] rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] font-mono text-slate-400 uppercase">24h Total Rain</p>
            <p className="text-sm sm:text-base font-black font-mono text-sky-400">
              {rainWindow.totalExpectedRain24h} mm
            </p>
          </div>

          <div className="bg-[#060e19] border border-[#14263c] rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] font-mono text-slate-400 uppercase">Peak 6h Probability</p>
            <p className="text-sm sm:text-base font-black font-mono text-cyan-300">
              {rainWindow.maxProbabilityNext6h}%
            </p>
          </div>
        </div>
      </div>

      {/* 12-Hour Hourly Rain Bar Timeline */}
      <div className="pt-4 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Next 12 Hours Rain Probability (%)</span>
          <span className="flex items-center gap-1 text-sky-400">
            <Droplets className="w-3 h-3" />
            Hover bars for hourly precipitation volume
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-1">
          {next12h.map((hour, idx) => {
            const prob = hour.precipitationProbability;
            const mm = hour.precipitationMm;

            return (
              <div
                key={idx}
                className="group relative flex flex-col items-center justify-end bg-[#060e19] hover:bg-[#0c1f36] border border-[#13273e] hover:border-sky-500/50 rounded-xl p-2 transition-all cursor-pointer h-24"
                id={`rain-hour-bar-${idx}`}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 bg-slate-900 text-white border border-sky-500/40 text-[10px] font-mono px-2 py-1 rounded shadow-xl whitespace-nowrap">
                  {hour.displayTime}: {prob}% rain ({mm} mm)
                </div>

                {/* Vertical probability bar */}
                <div className="w-full h-12 bg-[#0a1726] rounded-md overflow-hidden flex flex-col justify-end p-0.5">
                  <div
                    className={`w-full rounded-sm transition-all duration-500 ${
                      prob >= 70
                        ? 'bg-gradient-to-t from-sky-500 to-cyan-300 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                        : prob >= 40
                        ? 'bg-gradient-to-t from-sky-600 to-sky-400'
                        : prob >= 15
                        ? 'bg-sky-800/80'
                        : 'bg-slate-800'
                    }`}
                    style={{ height: `${Math.max(prob, 4)}%` }}
                  />
                </div>

                {/* Percentage & Time */}
                <span className="text-[10px] font-mono font-bold text-sky-300 mt-1">
                  {prob}%
                </span>
                <span className="text-[9px] font-mono text-slate-400 truncate w-full text-center">
                  {hour.displayTime}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
