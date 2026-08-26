import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CloudRain,
  MapPin,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Layers,
  Thermometer,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WeatherData } from '../types/weather';
import { WeatherSkeleton } from '../components/weather/WeatherSkeleton';
import { WeatherHero } from '../components/weather/WeatherHero';
import { RainForecastBanner } from '../components/weather/RainForecastBanner';
import { HourlyForecastSection } from '../components/weather/HourlyForecastSection';
import { DailyForecastSection } from '../components/weather/DailyForecastSection';
import { WeatherMetricsGrid } from '../components/weather/WeatherMetricsGrid';
import { WeatherHistorySection } from '../components/weather/WeatherHistorySection';
import { WeatherAlertsBanner } from '../components/weather/WeatherAlertsBanner';
import { LandSafeRiskImpactCard } from '../components/weather/LandSafeRiskImpactCard';
import { LocationQuickSelectorModal } from '../components/weather/LocationQuickSelectorModal';
import { UserLocation } from '../types';
import { fetchValidatedWeather } from '../services/locationDataService';

export const LiveWeatherPage: React.FC = () => {
  const { userProfile, setUserLocation, changeUserLocation } = useApp();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Unit toggle state with local persistence
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>(() => {
    return (localStorage.getItem('landsafe_weather_unit') as 'C' | 'F') || 'C';
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const currentLocationRef = useRef<UserLocation>(userProfile.location);

  const toggleUnit = () => {
    setTempUnit((prev) => {
      const next = prev === 'C' ? 'F' : 'C';
      localStorage.setItem('landsafe_weather_unit', next);
      return next;
    });
  };

  const fetchWeather = useCallback(
    async (isManualRefresh = false) => {
      const loc = userProfile.location;
      if (!loc || !loc.coordinates) return;

      currentLocationRef.current = loc;

      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        // Immediate clean skeleton state on location change to prevent stale data display
        setIsLoading(true);
        setWeatherData(null);
      }

      setError(null);

      // Cancel any ongoing fetch to avoid race conditions
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const data = await fetchValidatedWeather(loc, abortControllerRef.current.signal);
        
        // Double check this response matches the current location
        if (
          currentLocationRef.current.coordinates.lat === loc.coordinates.lat &&
          currentLocationRef.current.coordinates.lng === loc.coordinates.lng
        ) {
          setWeatherData(data);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching live weather telemetry:', err);
          setError(err.message || 'Failed to load meteorological data');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userProfile.location]
  );

  // Initial and reactive fetch on location change
  useEffect(() => {
    fetchWeather();

    // Auto-refresh interval (every 3 minutes)
    const interval = setInterval(() => {
      fetchWeather(true);
    }, 180000);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeather]);

  const handleSelectLocation = async (newLoc: UserLocation) => {
    if (changeUserLocation) {
      await changeUserLocation(newLoc);
    } else {
      setUserLocation(newLoc);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16" id="live-weather-page">
      {/* Header section with Location Switch trigger */}
      <div className="border-b border-[#14263c] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-6 h-6 text-sky-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Live Weather & Doppler Telemetry
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time India-wide meteorological conditions, precipitation windows, and atmospheric radar parameters.
          </p>
        </div>

        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#091626] hover:bg-[#0e2238] border border-[#1b385a] hover:border-sky-400 text-xs font-bold text-sky-400 transition-all w-fit shadow-md"
          id="header-location-switch-btn"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Change Location: {userProfile.location.area || userProfile.location.district}</span>
        </button>
      </div>

      {/* Error state */}
      {error && !weatherData && (
        <div className="bg-rose-950/40 border border-rose-800/80 rounded-2xl p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Meteorological Telemetry Error</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => fetchWeather(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && !weatherData && <WeatherSkeleton />}

      {/* Main Weather Content */}
      {weatherData && (
        <div className="space-y-6">
          {/* Active Advisories & Warnings Banner (if any) */}
          <WeatherAlertsBanner alerts={weatherData.alerts} />

          {/* Weather Hero Card (Current Conditions & AI Summary) */}
          <WeatherHero
            weather={weatherData}
            tempUnit={tempUnit}
            onToggleUnit={toggleUnit}
            onRefresh={() => fetchWeather(true)}
            isRefreshing={isRefreshing}
            onOpenLocationPicker={() => setIsLocationModalOpen(true)}
          />

          {/* Rain Forecast & Precipitation Window Visualizer */}
          <RainForecastBanner
            rainWindow={weatherData.rainWindow}
            hourly={weatherData.hourly}
          />

          {/* Hourly Forecast Timeline (24 Hours) */}
          <HourlyForecastSection
            hourly={weatherData.hourly}
            tempUnit={tempUnit}
          />

          {/* 10-Day Daily Forecast & Temperature Range Bars */}
          <DailyForecastSection
            daily={weatherData.daily}
            tempUnit={tempUnit}
          />

          {/* Comprehensive Atmospheric Parameter Metrics Grid */}
          <WeatherMetricsGrid
            current={weatherData.current}
            tempUnit={tempUnit}
          />

          {/* Past 24-Hour Historical Telemetry */}
          <WeatherHistorySection
            history={weatherData.history24h}
            tempUnit={tempUnit}
          />

          {/* LandSafe AI Geotechnical & Slope Safety Analysis Layer */}
          <LandSafeRiskImpactCard
            weather={weatherData}
            location={userProfile.location}
          />
        </div>
      )}

      {/* Location Picker Modal */}
      <LocationQuickSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={userProfile.location}
        onSelectLocation={handleSelectLocation}
      />
    </div>
  );
};
