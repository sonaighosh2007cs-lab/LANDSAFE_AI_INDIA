import React, { useState } from 'react';
import {
  Calendar,
  ChevronRight,
  Droplets,
  Sun,
  Moon,
  Wind,
  Compass,
  Sparkles,
  Info,
} from 'lucide-react';
import { DailyForecastItem } from '../../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastSectionProps {
  daily: DailyForecastItem[];
  tempUnit: 'C' | 'F';
}

export const DailyForecastSection: React.FC<DailyForecastSectionProps> = ({
  daily,
  tempUnit,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(daily[0]?.date || '');

  // Calculate global min and max across all days for proportional range bars
  const allMins = daily.map((d) => (tempUnit === 'F' ? (d.tempMin * 9) / 5 + 32 : d.tempMin));
  const allMaxs = daily.map((d) => (tempUnit === 'F' ? (d.tempMax * 9) / 5 + 32 : d.tempMax));
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const globalSpread = Math.max(globalMax - globalMin, 1);

  const formatTemp = (celsius: number) => {
    const val = tempUnit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
    return `${Math.round(val)}°`;
  };

  const activeDay = daily.find((d) => d.date === selectedDate) || daily[0];

  return (
    <div className="bg-[#091626] border border-[#182f4c] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5" id="daily-forecast-section">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            10-Day Meteorological Forecast & Range Analysis
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">Click any day for deep breakdown</span>
      </div>

      {/* 10-Day List Cards */}
      <div className="space-y-2">
        {daily.map((day, idx) => {
          const isSelected = day.date === selectedDate;
          const min = tempUnit === 'F' ? (day.tempMin * 9) / 5 + 32 : day.tempMin;
          const max = tempUnit === 'F' ? (day.tempMax * 9) / 5 + 32 : day.tempMax;

          // Proportional offsets for visual bar
          const leftPercent = ((min - globalMin) / globalSpread) * 100;
          const widthPercent = Math.max(((max - min) / globalSpread) * 100, 10);

          return (
            <div
              key={day.date || idx}
              onClick={() => setSelectedDate(isSelected ? '' : day.date)}
              className={`rounded-xl border p-3 sm:p-4 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0e2744] border-sky-400 shadow-md'
                  : 'bg-[#060e19] border-[#13273e] hover:bg-[#0c1f36] hover:border-[#1d3d63]'
              }`}
              id={`daily-forecast-row-${idx}`}
            >
              <div className="grid grid-cols-12 items-center gap-2 sm:gap-4">
                {/* Day name & date (3 cols) */}
                <div className="col-span-4 sm:col-span-3">
                  <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                    {day.displayDate.split(',')[0]}
                    {idx === 0 && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300">
                        Today
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">{day.shortDate}</p>
                </div>

                {/* Condition & Icon (3 cols) */}
                <div className="col-span-4 sm:col-span-3 flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <WeatherIcon
                      name={day.condition.iconName || day.condition.type}
                      isDaytime={true}
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-xs text-slate-200 truncate">{day.condition.description}</p>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-sky-400">
                      <Droplets className="w-2.5 h-2.5" />
                      <span>{day.precipitationProbability}%</span>
                      {day.precipitationMm > 0 && <span>({day.precipitationMm}mm)</span>}
                    </div>
                  </div>
                </div>

                {/* Proportional Range Bar & Temps (5 cols sm, 4 cols mobile) */}
                <div className="col-span-4 sm:col-span-5 flex items-center gap-2 sm:gap-3">
                  <span className="text-xs font-mono font-bold text-sky-300 w-7 text-right">
                    {formatTemp(day.tempMin)}
                  </span>

                  {/* Range Bar */}
                  <div className="flex-1 h-2 bg-[#091626] rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-teal-300 to-amber-400"
                      style={{
                        left: `${Math.max(0, Math.min(leftPercent, 80))}%`,
                        width: `${Math.min(widthPercent, 100)}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-300 w-7 text-left">
                    {formatTemp(day.tempMax)}
                  </span>
                </div>

                {/* Expand Indicator (1 col desktop) */}
                <div className="hidden sm:flex col-span-1 justify-end text-slate-400">
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-sky-400' : ''}`}
                  />
                </div>
              </div>

              {/* Expandable Date Details Drawer */}
              {isSelected && activeDay && (
                <div className="mt-4 pt-4 border-t border-[#1a385c] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                  {/* Sun / Moon Astro */}
                  <div className="bg-[#071322] p-3 rounded-xl border border-[#14263c] space-y-1">
                    <p className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-400" /> Solar Schedule
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-200">
                      <span>Sunrise: <strong className="text-white font-mono">{activeDay.sunrise}</strong></span>
                      <span>Sunset: <strong className="text-white font-mono">{activeDay.sunset}</strong></span>
                    </div>
                    {activeDay.moonPhase && (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                        <Moon className="w-3 h-3 text-cyan-300" /> Moon: {activeDay.moonPhase}
                      </p>
                    )}
                  </div>

                  {/* Wind & UV telemetry */}
                  <div className="bg-[#071322] p-3 rounded-xl border border-[#14263c] space-y-1">
                    <p className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                      <Wind className="w-3 h-3 text-teal-400" /> Peak Wind & UV
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-200">
                      <span>Max Wind: <strong className="text-white font-mono">{activeDay.windSpeedMax} km/h</strong></span>
                      <span>Max UV: <strong className="text-amber-400 font-mono">{activeDay.uvIndexMax}</strong></span>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1">
                      Mean Relative Humidity: {activeDay.humidityAvg}%
                    </p>
                  </div>

                  {/* Natural Language Daily Summary */}
                  <div className="bg-[#071322] p-3 rounded-xl border border-[#14263c] space-y-1 flex flex-col justify-between">
                    <p className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-sky-400" /> Daily Outlook
                    </p>
                    <p className="text-xs text-slate-300 leading-snug">
                      {activeDay.detailedSummary || `${activeDay.condition.description} with high of ${formatTemp(activeDay.tempMax)}.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
