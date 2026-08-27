import React from 'react';
import {
  MapPin,
  RefreshCw,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { WeatherData } from '../../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface WeatherHeroProps {
  weather: WeatherData;
  tempUnit: 'C' | 'F';
  onToggleUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenLocationPicker: () => void;
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({
  weather,
  tempUnit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
  onOpenLocationPicker,
}) => {
  const { current, location, rainWindow, summary } = weather;

  // Convert temperature if in Fahrenheit
  const displayTemp = tempUnit === 'F' ? (current.temperature * 9) / 5 + 32 : current.temperature;
  const displayFeelsLike = tempUnit === 'F' ? (current.feelsLike * 9) / 5 + 32 : current.feelsLike;
  const displayMax = tempUnit === 'F' ? (current.tempMax * 9) / 5 + 32 : current.tempMax;
  const displayMin = tempUnit === 'F' ? (current.tempMin * 9) / 5 + 32 : current.tempMin;

  const isDay = current.isDaytime;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 transition-all duration-500 shadow-2xl ${
        isDay
          ? 'bg-gradient-to-br from-[#0c1f36] via-[#091728] to-[#06101c] border-[#1d3d63]'
          : 'bg-gradient-to-br from-[#091322] via-[#060e19] to-[#04080e] border-[#152a44]'
      }`}
      id="weather-hero-card"
    >
      {/* Ambient background glow */}
      <div
        className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isDay ? 'bg-amber-400' : 'bg-cyan-500'
        }`}
      />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15 bg-sky-600" />

      {/* Top Bar: Location & Control Actions */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#182f4c]">
        {/* Location Breadcrumb & Trigger */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Live Weather
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Updated {weather.lastUpdated}
            </span>
          </div>

          <button
            onClick={onOpenLocationPicker}
            className="group flex items-center gap-2 text-left hover:opacity-90 transition-opacity"
            id="open-location-picker-btn"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                {location.name}
              </h1>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
            </div>
          </button>

          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
            <span>{location.district}</span>
            <span className="text-slate-500">•</span>
            <span>{location.state}</span>
            <span className="text-slate-500">•</span>
            <span className="text-sky-400 font-mono">
              {location.latitude.toFixed(3)}°N, {location.longitude.toFixed(3)}°E
            </span>
            {location.elevation && (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 font-mono">{location.elevation}m MSL</span>
              </>
            )}
          </p>
        </div>

        {/* Action Controls: Refresh & Unit Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e2136] hover:bg-[#152e4b] border border-[#1d3d63] text-xs font-medium text-slate-200 hover:text-white transition-colors disabled:opacity-50"
            id="weather-refresh-button"
            title="Refresh meteorological telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Unit Toggle */}
          <div className="flex items-center bg-[#071322] border border-[#1d3d63] rounded-xl p-0.5">
            <button
              onClick={() => tempUnit !== 'C' && onToggleUnit()}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                tempUnit === 'C'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="unit-toggle-celsius"
            >
              °C
            </button>
            <button
              onClick={() => tempUnit !== 'F' && onToggleUnit()}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                tempUnit === 'F'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="unit-toggle-fahrenheit"
            >
              °F
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero Body: Giant Temperature & Live Atmospheric Parameters */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
        {/* Temperature & Condition (Left 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Weather Animated Icon with Glow */}
          <div className="relative shrink-0 flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0c1f36]/80 border border-[#204068] shadow-inner">
            <WeatherIcon
              name={current.condition.iconName || current.condition.type}
              isDaytime={isDay}
              className="w-14 h-14 sm:w-16 sm:h-16"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter">
                <AnimatedNumber value={displayTemp} decimals={1} />
                <span className="text-3xl sm:text-4xl text-sky-400 font-light ml-1">
                  °{tempUnit}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg sm:text-xl font-bold text-slate-100">
                {current.condition.description}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#132d4e] text-sky-300 font-medium border border-[#1f4779]">
                Feels like {displayFeelsLike.toFixed(1)}°{tempUnit}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-300 pt-1">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                H: {displayMax.toFixed(0)}°{tempUnit}
              </span>
              <span className="flex items-center gap-1 text-sky-400 font-bold">
                <ArrowDownRight className="w-3.5 h-3.5" />
                L: {displayMin.toFixed(0)}°{tempUnit}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                {current.daylightStatus} ({current.dayLength})
              </span>
            </div>
          </div>
        </div>

        {/* Current Key Micro-Metrics (Right 5 Cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {/* Rain Probability */}
          <div className="bg-[#071322]/80 backdrop-blur-sm border border-[#182f4c] rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">Rain Probability</span>
              <CloudRain className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white font-mono">
              <AnimatedNumber value={current.precipitationProbability} decimals={0} suffix="%" />
            </p>
            <p className="text-[11px] text-sky-400 font-mono truncate font-medium">
              {current.precipitation > 0 ? `${current.precipitation} mm/h active` : '0 mm/h current'}
            </p>
          </div>

          {/* Humidity */}
          <div className="bg-[#071322]/80 backdrop-blur-sm border border-[#182f4c] rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">Humidity</span>
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white font-mono">
              <AnimatedNumber value={current.humidity} decimals={0} suffix="%" />
            </p>
            <p className="text-[11px] text-blue-400 font-mono font-medium">
              Dew Pt {current.dewPoint}°C
            </p>
          </div>

          {/* Wind Speed */}
          <div className="bg-[#071322]/80 backdrop-blur-sm border border-[#182f4c] rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">Wind Speed</span>
              <Wind className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white font-mono">
              <AnimatedNumber value={current.windSpeed} decimals={1} suffix=" km/h" />
            </p>
            <p className="text-[11px] text-teal-400 font-mono font-medium">
              From {current.windDirection} • Gust {current.windGust} km/h
            </p>
          </div>

          {/* UV Index */}
          <div className="bg-[#071322]/80 backdrop-blur-sm border border-[#182f4c] rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">UV Index</span>
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white font-mono">
              <AnimatedNumber value={current.uvIndex} decimals={0} />
            </p>
            <p className="text-[11px] text-amber-400 font-mono font-medium">
              {current.uvDescription} Category
            </p>
          </div>
        </div>
      </div>

      {/* AI Weather Summary Ribbon */}
      {summary && (
        <div className="relative z-10 mt-6 pt-4 border-t border-[#182f4c] flex items-start gap-3 bg-[#071322]/60 rounded-2xl p-3.5 border border-[#162d49]">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0 text-sky-400 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase font-bold text-sky-400 tracking-wider">
              LandSafe Meteorological Intelligence Briefing
            </span>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
              {summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
