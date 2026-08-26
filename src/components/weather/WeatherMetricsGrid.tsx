import React from 'react';
import {
  Sun,
  Droplets,
  Wind,
  Eye,
  Activity,
  Cloud,
  Compass,
  Moon,
  Sunrise,
  Sunset,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { CurrentWeather } from '../../types/weather';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface WeatherMetricsGridProps {
  current: CurrentWeather;
  tempUnit: 'C' | 'F';
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({
  current,
  tempUnit,
}) => {
  const formatTemp = (celsius: number) => {
    const val = tempUnit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
    return `${val.toFixed(1)}°${tempUnit}`;
  };

  // UV categories
  const uvLevel = current.uvIndex;
  const uvBadgeColor =
    uvLevel >= 11
      ? 'bg-purple-950 text-purple-300 border-purple-800'
      : uvLevel >= 8
      ? 'bg-rose-950 text-rose-300 border-rose-800'
      : uvLevel >= 6
      ? 'bg-amber-950 text-amber-300 border-amber-800'
      : uvLevel >= 3
      ? 'bg-yellow-950 text-yellow-300 border-yellow-800'
      : 'bg-emerald-950 text-emerald-300 border-emerald-800';

  const uvAdvice =
    uvLevel >= 8
      ? 'Very high risk of harm from unprotected sun exposure. Seek shade & wear SPF 50.'
      : uvLevel >= 6
      ? 'High risk. Protection required between 11 AM – 4 PM.'
      : uvLevel >= 3
      ? 'Moderate risk. Wear a hat and sunglasses if outdoors.'
      : 'Low risk. Minimal sun protection required for mountain corridors.';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="weather-metrics-grid">
      {/* 1. UV Index Card */}
      <div className="bg-[#091626] border border-[#182f4c] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Sun className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold">UV Index</h3>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold ${uvBadgeColor}`}>
            {current.uvDescription}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              <AnimatedNumber value={current.uvIndex} decimals={0} />
            </span>
            <span className="text-xs font-mono text-slate-400">/ 15 Index</span>
          </div>

          {/* Segmented UV Progress Bar */}
          <div className="h-2 w-full bg-[#060e19] rounded-full overflow-hidden flex gap-1 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                uvLevel >= 8
                  ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500'
                  : uvLevel >= 4
                  ? 'bg-gradient-to-r from-emerald-400 to-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min((uvLevel / 12) * 100, 100)}%` }}
            />
          </div>

          <p className="text-xs text-slate-300 leading-snug">{uvAdvice}</p>
        </div>
      </div>

      {/* 2. Humidity & Dew Point Card (Specifically titled "Humidity") */}
      <div className="bg-[#091626] border border-[#182f4c] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Droplets className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold">Humidity</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
            {current.humidity >= 80 ? 'Very Humid / Wet' : current.humidity >= 50 ? 'Comfortable' : 'Dry'}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              <AnimatedNumber value={current.humidity} decimals={0} suffix="%" />
            </span>
            <span className="text-xs font-mono text-slate-400">Relative Saturation</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#14263c]">
            <div className="bg-[#060e19] p-2.5 rounded-xl border border-[#13273e]">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Dew Point</p>
              <p className="text-sm font-bold font-mono text-white">{formatTemp(current.dewPoint)}</p>
            </div>
            <div className="bg-[#060e19] p-2.5 rounded-xl border border-[#13273e]">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Heat Index</p>
              <p className="text-sm font-bold font-mono text-white">{formatTemp(current.heatIndex)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Wind & Gusts with Compass needle */}
      <div className="bg-[#091626] border border-[#182f4c] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Wind className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold">Wind & Gusts</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
            {current.windDirection} • {current.windDirectionDegrees}°
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white font-mono">
                <AnimatedNumber value={current.windSpeed} decimals={1} />
              </span>
              <span className="text-xs font-mono text-slate-400">km/h</span>
            </div>
            <p className="text-xs text-slate-300">
              Gusts reaching <strong className="text-teal-300 font-mono">{current.windGust} km/h</strong>
            </p>
          </div>

          {/* Compass Graphic */}
          <div className="relative w-14 h-14 rounded-full border border-[#1d3d63] bg-[#060e19] flex items-center justify-center shrink-0">
            <span className="absolute text-[8px] font-mono text-slate-500 top-0.5">N</span>
            <span className="absolute text-[8px] font-mono text-slate-500 bottom-0.5">S</span>
            <span className="absolute text-[8px] font-mono text-slate-500 left-1">W</span>
            <span className="absolute text-[8px] font-mono text-slate-500 right-1">E</span>
            <div
              className="w-1 h-8 bg-gradient-to-t from-teal-400 to-rose-400 rounded-full transition-transform duration-700"
              style={{ transform: `rotate(${current.windDirectionDegrees}deg)` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Visibility & Mountain Fog */}
      <div className="bg-[#091626] border border-[#182f4c] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Eye className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold">Visibility</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#13273e] text-slate-300">
            {current.visibilityStatus}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              <AnimatedNumber value={current.visibility} decimals={1} suffix=" km" />
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {current.visibility >= 10
              ? 'Clear line of sight across mountain passes.'
              : current.visibility >= 5
              ? 'Moderate haze or light drizzle over ridges.'
              : 'Dense valley fog or heavy rain. Reduce speed along ghat switchbacks.'}
          </p>
        </div>
      </div>

      {/* 5. Air Pressure & Barometric Gradient */}
      <div className="bg-[#091626] border border-[#182f4c] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Activity className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold">Air Pressure</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
            Sea Level Calibrated
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              <AnimatedNumber value={current.pressure} decimals={0} suffix=" hPa" />
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {current.pressure < 1005
              ? 'Low pressure trough — monsoonal convective activity likely.'
              : current.pressure > 1015
              ? 'High pressure anticyclone — stable atmospheric profile.'
              : 'Standard barometric gradient across this topography.'}
          </p>
        </div>
      </div>

      {/* 6. Cloud Cover Card */}
      <div className="bg-[#091626] border border-[#182f4c] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Cloud className="w-4 h-4 text-slate-300" />
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold">Cloud Cover</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#13273e] text-slate-300">
            Sky Coverage
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              <AnimatedNumber value={current.cloudCover} decimals={0} suffix="%" />
            </span>
          </div>
          <div className="h-2 w-full bg-[#060e19] rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-400 rounded-full transition-all duration-700"
              style={{ width: `${current.cloudCover}%` }}
            />
          </div>
          <p className="text-xs text-slate-300">
            {current.cloudCover > 75
              ? 'Dense cloud deck obscuring mountain crests.'
              : current.cloudCover > 35
              ? 'Scattered cumulus clouds with sun intervals.'
              : 'Mainly clear skies with high solar irradiance.'}
          </p>
        </div>
      </div>

      {/* 7. Sun & Astronomical Ephemeris Card (Spans full width or 3 cols) */}
      <div className="sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-[#091626] via-[#0b1d33] to-[#071322] border border-[#182f4c] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#14263c]">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Sun & Moon Astronomical Ephemeris
            </h3>
          </div>
          <span className="text-xs font-mono text-sky-400">
            Total Day Length: {current.dayLength} • Currently in {current.daylightStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Sunrise */}
          <div className="bg-[#060e19] p-3.5 rounded-xl border border-[#14263c] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sunrise className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Sunrise</p>
              <p className="text-sm sm:text-base font-black font-mono text-white">{current.sunrise}</p>
            </div>
          </div>

          {/* Sunset */}
          <div className="bg-[#060e19] p-3.5 rounded-xl border border-[#14263c] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <Sunset className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Sunset</p>
              <p className="text-sm sm:text-base font-black font-mono text-white">{current.sunset}</p>
            </div>
          </div>

          {/* Moon Phase */}
          <div className="bg-[#060e19] p-3.5 rounded-xl border border-[#14263c] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Moon Phase</p>
              <p className="text-xs sm:text-sm font-bold text-white truncate">{current.moonPhase}</p>
              <p className="text-[10px] font-mono text-cyan-300">{current.moonIllumination}% Illum</p>
            </div>
          </div>

          {/* Moonset / Moonrise */}
          <div className="bg-[#060e19] p-3.5 rounded-xl border border-[#14263c] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Moon Cycle</p>
              <p className="text-xs font-mono text-slate-200">Rise: {current.moonrise}</p>
              <p className="text-xs font-mono text-slate-400">Set: {current.moonset}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
