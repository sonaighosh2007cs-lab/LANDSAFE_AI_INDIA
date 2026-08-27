import React, { useState, useEffect, useRef } from 'react';
import {
  History,
  MapPin,
  Calendar,
  RefreshCw,
  Download,
  AlertTriangle,
  Layers,
  Thermometer,
  Wind,
  CloudRain,
  Droplets,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Database,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HistoryTimeRange, LocationHistoricalResponse } from '../types/history';
import { fetchValidatedHistory, exportHistoryToCsv } from '../services/historyDataService';
import { HistoricalSummaryCards } from '../components/history/HistoricalSummaryCards';
import { TemperatureChart } from '../components/history/TemperatureChart';
import { AqiTrendChart } from '../components/history/AqiTrendChart';
import { RainfallBarChart } from '../components/history/RainfallBarChart';
import { HumidityChart } from '../components/history/HumidityChart';
import { RiskTrendChart } from '../components/history/RiskTrendChart';
import { CombinedEnvironmentalChart } from '../components/history/CombinedEnvironmentalChart';
import { AqiDistributionChart } from '../components/history/AqiDistributionChart';
import { HistoricalDataTable } from '../components/history/HistoricalDataTable';
import { HistoricalFloodLandslideCard } from '../components/history/HistoricalFloodLandslideCard';

const TIME_RANGES: { id: HistoryTimeRange; label: string; subLabel: string }[] = [
  { id: '24h', label: '24 Hours', subLabel: 'Hourly Resolution' },
  { id: '7d', label: '7 Days', subLabel: 'Hourly / Daily' },
  { id: '1m', label: '1 Month', subLabel: 'Daily Aggregates' },
  { id: '6m', label: '6 Months', subLabel: 'Longitudinal' },
  { id: '1y', label: '1 Year', subLabel: 'Annual Cycle' },
];

export const GsiHistoricalAnalysisPage: React.FC = () => {
  const { userProfile, setIsLocationModalOpen } = useApp();
  const location = userProfile.location;

  const [timeRange, setTimeRange] = useState<HistoryTimeRange>('7d');
  const [activeGraphTab, setActiveGraphTab] = useState<
    'all' | 'temperature' | 'aqi' | 'rainfall' | 'humidity' | 'risk' | 'combined'
  >('all');

  const [historyData, setHistoryData] = useState<LocationHistoricalResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadData = async (selectedRange: HistoryTimeRange) => {
    // Abort previous pending fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchValidatedHistory(location, selectedRange, controller.signal);
      setHistoryData(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('History load failure:', err);
        setError(
          err.message || 'Historical telemetry records currently unavailable for this period.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(timeRange);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [location.coordinates.lat, location.coordinates.lng, location.area, timeRange]);

  const handleRefresh = () => {
    loadData(timeRange);
  };

  const handleExportCsv = () => {
    if (historyData && historyData.records.length > 0) {
      exportHistoryToCsv(location, timeRange, historyData.records);
    }
  };

  const locationTitle = `${location.area || location.district || 'Sector'}, ${location.state || 'India'}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16" id="history-section-main">
      {/* 1. Header & Location Context Bar */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <History className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Risk History & Environmental Intelligence
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Location-Specific Historical Telemetry, Weather Dynamics, AQI & Geotechnical Risk Archive
                </p>
              </div>
            </div>

            {/* Selected Location Pill */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#060e19] border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-white">{locationTitle}</span>
                <span className="text-slate-500 text-[10px]">
                  ({location.coordinates.lat.toFixed(3)}°N, {location.coordinates.lng.toFixed(3)}°E)
                </span>
              </div>

              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-[#0e2238] hover:bg-[#143252] border border-[#1b385a] text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer flex items-center gap-1"
                id="btn-switch-history-location"
              >
                <span>Change Location</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
              </button>

              {location.elevation && (
                <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-[#060e19] border border-[#14263c]">
                  Elev: <strong className="text-slate-200">{location.elevation}m</strong>
                </span>
              )}
              {location.slopeAngle && (
                <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-[#060e19] border border-[#14263c]">
                  Slope: <strong className="text-slate-200">{location.slopeAngle}°</strong>
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#060e19] hover:bg-[#0e2238] border border-[#182f4d] text-slate-300 text-xs font-mono transition-all cursor-pointer disabled:opacity-50"
              id="btn-refresh-history"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCsv}
              disabled={!historyData || isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-40"
              id="btn-export-history-csv-main"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 2. Time Range Selector Controls */}
        <div className="pt-2 border-t border-[#14263c] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>SELECT HISTORICAL TIME RANGE:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5" id="history-timerange-selector">
            {TIME_RANGES.map((tr) => {
              const isSelected = timeRange === tr.id;
              return (
                <button
                  key={tr.id}
                  onClick={() => setTimeRange(tr.id)}
                  disabled={isLoading && isSelected}
                  className={`px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20 border border-cyan-400'
                      : 'bg-[#060e19] text-slate-400 border border-[#14263c] hover:border-slate-600 hover:text-white'
                  }`}
                  id={`btn-timerange-${tr.id}`}
                >
                  <span className="block font-bold">{tr.label}</span>
                  <span className="block text-[9px] opacity-75">{tr.subLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading Skeleton & Error State */}
      {isLoading && (
        <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-8 text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-500/10 text-cyan-400 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <p className="text-white font-bold text-sm">
            Retrieving Historical Telemetry & Weather Logs for {locationTitle}...
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Querying Open-Meteo Archive API & Geological Stability Mesh for range [{timeRange.toUpperCase()}]
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-6 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-white font-bold text-base">Historical Data Notice</h3>
          <p className="text-xs sm:text-sm text-rose-200 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => loadData(timeRange)}
            className="px-4 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-mono font-bold hover:bg-rose-600 transition-colors cursor-pointer"
          >
            Retry Fetch
          </button>
        </div>
      )}

      {/* Main Historical Content Display when Data Loaded */}
      {historyData && !isLoading && (
        <>
          {/* 1. Statistics Summary Bento */}
          <HistoricalSummaryCards
            stats={historyData.statistics}
            timeRangeLabel={historyData.timeRangeLabel}
            locationName={locationTitle}
          />

          {/* 2. Interactive Graph Navigation Bar */}
          <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 text-xs font-mono text-slate-400 pl-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">VIEW GRAPHS:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All Graphs' },
                { id: 'temperature', label: 'Temperature' },
                { id: 'aqi', label: 'AQI & Pollutants' },
                { id: 'rainfall', label: 'Rainfall (mm)' },
                { id: 'humidity', label: 'Humidity' },
                { id: 'risk', label: 'LandSafe Risk' },
                { id: 'combined', label: 'Combined Matrix' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGraphTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    activeGraphTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-[#060e19] text-slate-400 border border-[#14263c] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Render Graph Modules */}
          <div className="space-y-6" id="history-graphs-container">
            {(activeGraphTab === 'all' || activeGraphTab === 'temperature') && (
              <TemperatureChart
                records={historyData.records}
                locationName={locationTitle}
                timeRange={timeRange}
              />
            )}

            {(activeGraphTab === 'all' || activeGraphTab === 'aqi') && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AqiTrendChart records={historyData.records} locationName={locationTitle} />
                </div>
                <div>
                  <AqiDistributionChart
                    stats={historyData.statistics}
                    totalPoints={historyData.totalPoints}
                  />
                </div>
              </div>
            )}

            {(activeGraphTab === 'all' || activeGraphTab === 'rainfall') && (
              <RainfallBarChart records={historyData.records} locationName={locationTitle} />
            )}

            {(activeGraphTab === 'all' || activeGraphTab === 'humidity') && (
              <HumidityChart records={historyData.records} locationName={locationTitle} />
            )}

            {(activeGraphTab === 'all' || activeGraphTab === 'risk') && (
              <RiskTrendChart records={historyData.records} locationName={locationTitle} />
            )}

            {(activeGraphTab === 'all' || activeGraphTab === 'combined') && (
              <CombinedEnvironmentalChart
                records={historyData.records}
                locationName={locationTitle}
              />
            )}
          </div>

          {/* 4. Flood & Landslide Recurrence Verification */}
          <HistoricalFloodLandslideCard location={location} records={historyData.records} />

          {/* 5. Granular Historical Data Table with Search, Filter & CSV Export */}
          <HistoricalDataTable
            records={historyData.records}
            location={location}
            timeRange={timeRange}
          />
        </>
      )}
    </div>
  );
};
