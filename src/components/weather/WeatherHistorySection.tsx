import React from 'react';
import { History, Droplets, ArrowDown, ArrowUp } from 'lucide-react';
import { HistoricalHourItem } from '../../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface WeatherHistorySectionProps {
  history: HistoricalHourItem[];
  tempUnit: 'C' | 'F';
}

export const WeatherHistorySection: React.FC<WeatherHistorySectionProps> = ({
  history,
  tempUnit,
}) => {
  if (!history || history.length === 0) return null;

  const formatTemp = (celsius: number) => {
    const val = tempUnit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
    return `${Math.round(val)}°`;
  };

  const totalPastRain = Math.round(history.reduce((acc, h) => acc + (h.precipitationMm || 0), 0) * 10) / 10;
  const temps = history.map((h) => (tempUnit === 'F' ? (h.temperature * 9) / 5 + 32 : h.temperature));
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  return (
    <div className="bg-[#091626] border border-[#182f4c] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4" id="weather-history-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#14263c]">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Past 24-Hour Telemetry & Rainfall History
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">
            24h Accumulation: <strong className="text-sky-400">{totalPastRain} mm</strong>
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">
            Range: <strong className="text-white">{Math.round(minTemp)}° – {Math.round(maxTemp)}°</strong>
          </span>
        </div>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#14263c]">
        {history.map((h, idx) => (
          <div
            key={idx}
            className="shrink-0 w-24 p-3 rounded-xl bg-[#060e19] border border-[#13273e] text-center space-y-1.5"
            id={`history-hour-${idx}`}
          >
            <p className="text-[10px] font-mono text-slate-400">{h.displayTime}</p>
            <div className="flex justify-center my-1">
              <WeatherIcon
                name={h.condition.iconName || h.condition.type}
                isDaytime={h.condition.isDaytime}
                className="w-5 h-5"
              />
            </div>
            <p className="text-sm font-bold font-mono text-white">{formatTemp(h.temperature)}</p>
            <div className="flex items-center justify-center gap-1 text-[9px] font-mono text-sky-400">
              <Droplets className="w-2.5 h-2.5" />
              <span>{h.precipitationMm} mm</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
