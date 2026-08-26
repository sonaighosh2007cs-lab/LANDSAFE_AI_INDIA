import React from 'react';
import {
  MapPin,
  ExternalLink,
  Shield,
  X,
  Navigation,
  Droplets,
  Mountain,
  History,
  Wind,
  Thermometer,
  Activity,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { resolveLocation } from '../../data/locations';

export interface SelectedPinData {
  name: string;
  state: string;
  lat: number;
  lng: number;
  riskScore: number;
  elevation?: number;
  slope?: number;
  lithology?: string;
  rainfall?: number;
  soilMoisture?: number;
  historicalSlips?: number;
  temp?: number;
  humidity?: number;
  wind?: number;
  sop?: string;
  isMonitored?: boolean;
}

interface TelemetryCardProps {
  pin: SelectedPinData;
  onClose: () => void;
  onPlanRouteToHere: (pin: SelectedPinData) => void;
}

export const TelemetryCard: React.FC<TelemetryCardProps> = ({
  pin,
  onClose,
  onPlanRouteToHere,
}) => {
  const { setUserLocation, setActiveRoute } = useApp();

  const isCritical = pin.riskScore >= 85;
  const isHigh = pin.riskScore >= 60 && pin.riskScore < 85;
  const isModerate = pin.riskScore >= 30 && pin.riskScore < 60;

  const rainfall = pin.rainfall ?? Math.round(pin.riskScore * 0.32 * 10) / 10;
  const soilMoisture = pin.soilMoisture ?? Math.min(96, Math.max(22, pin.riskScore + 8));
  const slope = pin.slope ?? Math.round((pin.riskScore * 0.42 + 8) * 10) / 10;
  const historicalSlips = pin.historicalSlips ?? Math.max(4, Math.floor(pin.riskScore / 2.2));
  const elevation = pin.elevation ?? 850;
  const lithology = pin.lithology || 'Himalayan Metamorphic & Gneiss Series';
  const temp = pin.temp ?? 21;
  const humidity = pin.humidity ?? (soilMoisture > 70 ? 92 : 65);
  const wind = pin.wind ?? 14;

  const strokeColor = isCritical
    ? '#f43f5e'
    : isHigh
    ? '#f97316'
    : isModerate
    ? '#eab308'
    : '#10b981';

  // SVG Gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pin.riskScore / 100) * circumference;

  const sop =
    pin.sop ??
    (isCritical
      ? `Mandatory RED-ALERT advisory for ${pin.name}. High pore-water pressure detected along cut slopes. SDRF rescue staging units deployed; keep arterial bypass roads clear.`
      : isHigh
      ? `ORANGE WATCH advisory active for ${pin.name}. Soil saturation is approaching trigger thresholds. Exercise high caution on ghat hairpins.`
      : isModerate
      ? `YELLOW ADVISORY: Moderate slope saturation in ${pin.name}. Monitor electronic signages and keep drainage culverts clear.`
      : `Nominal slope conditions in ${pin.name}. Standard traffic flow permitted across all sectors.`);

  const handleSelectLocation = () => {
    const resolved = resolveLocation(pin.state, pin.name, pin.name);
    setUserLocation(resolved);
    setActiveRoute('dashboard');
  };

  return (
    <div className="absolute top-4 left-4 z-20 w-84 sm:w-96 max-w-[calc(100vw-2rem)] bg-[#081322]/95 border border-[#18314e] rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-left-4 max-h-[calc(100%-2rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#12243a]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#00d492]" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">
            LIVE GEOTECHNICAL TELEMETRY
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border uppercase ${
              isCritical
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : isHigh
                ? 'bg-orange-950 text-orange-300 border-orange-800'
                : isModerate
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}
          >
            {isCritical ? 'CRITICAL (≥85%)' : isHigh ? 'HIGH RISK' : isModerate ? 'MODERATE' : 'LOW RISK'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Location Titles */}
      <div className="mb-3">
        <h3 className="text-lg font-black text-white tracking-tight leading-snug">{pin.name}</h3>
        <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
          <span>{pin.state}</span>
          <span>•</span>
          <span>
            {pin.lat.toFixed(3)}°N, {pin.lng.toFixed(3)}°E
          </span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">{elevation}m Elev</span>
        </p>
      </div>

      {/* Main Landslide Hazard Probability Circle & Info */}
      <div className="bg-[#050d18] border border-[#122338] rounded-xl p-3 mb-3 flex items-center gap-4">
        {/* SVG Circular Probability Gauge */}
        <div className="relative w-22 h-22 flex-shrink-0 flex items-center justify-center">
          <svg className="w-22 h-22 -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#13273e"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={strokeColor}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-black text-white font-mono leading-none">{pin.riskScore}%</span>
            <span className="text-[8px] font-mono uppercase text-slate-400 mt-0.5">PROBABILITY</span>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            HAZARD CLASSIFICATION
          </p>
          <span
            className={`inline-block text-[11px] font-mono px-2 py-0.5 rounded font-black border ${
              isCritical
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : isHigh
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                : isModerate
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isCritical ? 'TIER 4 • SEVERE CRITICAL' : isHigh ? 'TIER 3 • HIGH VULNERABILITY' : isModerate ? 'TIER 2 • MODERATE WATCH' : 'TIER 1 • STABLE NOMINAL'}
          </span>
          <p className="text-[9px] text-slate-400 font-mono">
            GSI Geomorphic Confidence: <span className="text-emerald-400 font-bold">98.4%</span>
          </p>
        </div>
      </div>

      {/* Geotechnical Metric Bars */}
      <div className="space-y-2 mb-3 bg-[#050d18] p-3 rounded-xl border border-[#122338]">
        {/* Rainfall */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-sky-400" />
              <span>Rainfall (24h)</span>
            </span>
            <span className="font-black text-sky-400">{rainfall} mm</span>
          </div>
          <div className="w-full bg-[#0d2035] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (rainfall / 60) * 100)}%` }}
            />
          </div>
        </div>

        {/* Soil Moisture */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-400" />
              <span>Soil Saturation</span>
            </span>
            <span className="font-black text-amber-400">{soilMoisture}%</span>
          </div>
          <div className="w-full bg-[#0d2035] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                soilMoisture >= 85 ? 'bg-rose-500' : soilMoisture >= 60 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${soilMoisture}%` }}
            />
          </div>
        </div>

        {/* Slope Incline */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <Mountain className="w-3 h-3 text-emerald-400" />
              <span>Slope Gradient</span>
            </span>
            <span className="font-black text-white">{slope}° Incline</span>
          </div>
          <div className="w-full bg-[#0d2035] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (slope / 50) * 100)}%` }}
            />
          </div>
        </div>

        {/* Historical Slips */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <History className="w-3 h-3 text-purple-400" />
              <span>Historical Landslides</span>
            </span>
            <span className="font-black text-purple-400">{historicalSlips} Recorded</span>
          </div>
          <div className="w-full bg-[#0d2035] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (historicalSlips / 60) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lithology & Weather */}
      <div className="bg-[#050d18] p-2.5 rounded-xl border border-[#122338] mb-3 space-y-1.5">
        <div className="flex items-start gap-1.5 text-[10px] font-mono text-slate-400">
          <Layers className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-500">Lithology: </span>
            <span className="text-slate-300 font-semibold">{lithology}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-[#10243a]">
          <div className="flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-orange-400" />
            <span>{temp}°C</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-cyan-400" />
            <span>{humidity}% RH</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3 text-slate-300" />
            <span>{wind} km/h</span>
          </div>
        </div>
      </div>

      {/* Safety Guidance Box */}
      <div className="bg-[#0c1e33] border border-[#193b61] rounded-xl p-3 mb-3 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1 text-[11px]">
          <Shield className="w-3.5 h-3.5" />
          <span>SAFETY PROTOCOL & SDRF DIRECTIVE</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{sop}</p>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectLocation}
            className="flex-1 py-2 px-3 rounded-xl bg-[#009e60] hover:bg-[#00b870] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Set Active Location</span>
          </button>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${pin.lat},${pin.lng}`}
            target="_blank"
            rel="noreferrer"
            className="py-2 px-3 rounded-xl bg-[#0c1f36] border border-[#183a61] hover:bg-[#133152] text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Open in Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Maps</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => onPlanRouteToHere(pin)}
          className="w-full py-2 px-3 rounded-xl bg-[#061424] border border-[#183a61] hover:border-[#00d492] text-cyan-400 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-[#00d492]" />
          <span>Plan Safe Route to {pin.name}</span>
        </button>
      </div>
    </div>
  );
};
