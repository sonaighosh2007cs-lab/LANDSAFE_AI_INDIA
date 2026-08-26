import React, { useState } from 'react';
import { Clock, LayoutGrid, LineChart as ChartIcon, Droplets, Wind } from 'lucide-react';
import { HourlyForecastItem } from '../../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastSectionProps {
  hourly: HourlyForecastItem[];
  tempUnit: 'C' | 'F';
}

export const HourlyForecastSection: React.FC<HourlyForecastSectionProps> = ({
  hourly,
  tempUnit,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'chart'>('cards');

  // Convert temp based on unit
  const formatTemp = (celsius: number) => {
    const val = tempUnit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
    return `${Math.round(val)}°`;
  };

  // Min and max for chart scaling
  const temps = hourly.map((h) => (tempUnit === 'F' ? (h.temperature * 9) / 5 + 32 : h.temperature));
  const minTemp = Math.floor(Math.min(...temps) - 1);
  const maxTemp = Math.ceil(Math.max(...temps) + 1);
  const tempRange = Math.max(maxTemp - minTemp, 1);

  return (
    <div className="bg-[#091626] border border-[#182f4c] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4" id="hourly-forecast-section">
      {/* Header & View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" />
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            24-Hour Hourly Forecast
          </h2>
          <span className="hidden sm:inline text-xs font-mono text-slate-400">
            ({hourly.length} hourly data points)
          </span>
        </div>

        <div className="flex items-center bg-[#060e19] border border-[#14263c] rounded-xl p-0.5">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-sky-500 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            id="hourly-view-cards-btn"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'chart'
                ? 'bg-sky-500 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            id="hourly-view-chart-btn"
          >
            <ChartIcon className="w-3.5 h-3.5" />
            <span>Timeline Chart</span>
          </button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        /* Horizontal Scrolling Cards */
        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-[#14263c] scrollbar-track-transparent">
          {hourly.map((h, idx) => (
            <div
              key={idx}
              className={`shrink-0 w-28 sm:w-32 p-3.5 rounded-2xl border text-center flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                idx === 0
                  ? 'bg-gradient-to-b from-[#0e2a4a] to-[#091728] border-sky-400/60 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
                  : 'bg-[#060e19] border-[#13273e] hover:border-[#1e4470]'
              }`}
              id={`hourly-card-${idx}`}
            >
              <div>
                <p className={`text-xs font-bold mb-1 ${idx === 0 ? 'text-sky-300' : 'text-slate-300'}`}>
                  {h.displayTime}
                </p>
                <p className="text-[10px] font-mono text-slate-400 mb-2 truncate">
                  {h.fullDate.split(',')[0]}
                </p>

                <div className="flex justify-center my-2">
                  <WeatherIcon
                    name={h.condition.iconName || h.condition.type}
                    isDaytime={h.isDaytime}
                    className="w-7 h-7"
                  />
                </div>

                <p className="text-lg font-black text-white font-mono my-1">
                  {formatTemp(h.temperature)}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight truncate px-1" title={h.condition.description}>
                  {h.condition.description}
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-[#13273e] space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-sky-400">
                  <Droplets className="w-3 h-3" />
                  <span>{h.precipitationProbability}%</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-[9px] font-mono text-slate-400">
                  <Wind className="w-2.5 h-2.5" />
                  <span>{h.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Interactive Temperature & Precipitation Chart */
        <div className="bg-[#060e19] border border-[#13273e] rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-1 bg-sky-400 rounded-full" /> Temperature Curve (°{tempUnit})
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-sky-500/30 border border-sky-400 rounded" /> Rain Probability (%)
            </span>
          </div>

          <div className="relative h-48 w-full">
            {/* SVG Chart */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 160" preserveAspectRatio="none">
              {/* Rain Probability Bars (Background) */}
              {hourly.map((h, i) => {
                const x = (i / (hourly.length - 1)) * 960 + 20;
                const barHeight = (h.precipitationProbability / 100) * 100;
                return (
                  <rect
                    key={`bar-${i}`}
                    x={x - 14}
                    y={150 - barHeight}
                    width="28"
                    height={barHeight}
                    fill="rgba(56, 189, 248, 0.15)"
                    rx="3"
                    className="hover:fill-sky-500/30 transition-colors"
                  />
                );
              })}

              {/* Temperature Line Path */}
              <path
                d={hourly.reduce((acc, h, i) => {
                  const t = tempUnit === 'F' ? (h.temperature * 9) / 5 + 32 : h.temperature;
                  const x = (i / (hourly.length - 1)) * 960 + 20;
                  const y = 140 - ((t - minTemp) / tempRange) * 110;
                  return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }, '')}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Temperature Points & Text */}
              {hourly.map((h, i) => {
                const t = tempUnit === 'F' ? (h.temperature * 9) / 5 + 32 : h.temperature;
                const x = (i / (hourly.length - 1)) * 960 + 20;
                const y = 140 - ((t - minTemp) / tempRange) * 110;
                return (
                  <g key={`pt-${i}`}>
                    <circle cx={x} cy={y} r="4" fill="#091626" stroke="#38bdf8" strokeWidth="2" />
                    {i % 2 === 0 && (
                      <text
                        x={x}
                        y={y - 10}
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {Math.round(t)}°
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* X-axis Timeline Labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-[#13273e]">
            {hourly.filter((_, i) => i % 3 === 0).map((h, idx) => (
              <span key={idx}>{h.displayTime}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
