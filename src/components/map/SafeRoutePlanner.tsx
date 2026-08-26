import React, { useState } from 'react';
import {
  Navigation,
  Car,
  Bike,
  Train,
  Plane,
  Footprints,
  ExternalLink,
  Shield,
  Compass,
  RefreshCw,
  X,
  MapPin,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Mountain,
  Gauge,
} from 'lucide-react';
import {
  CalculatedRoute,
  POPULAR_SAFE_ROUTES,
  computeSafeCorridorRoute,
} from '../../data/indiaMapData';
import { searchAllIndianLocations, FlatLocationResult } from '../../data/locations';
import { useApp } from '../../context/AppContext';

interface SafeRoutePlannerProps {
  onClose: () => void;
  onRouteCalculated: (route: CalculatedRoute) => void;
  initialDestination?: { name: string; lat: number; lng: number };
}

export const SafeRoutePlanner: React.FC<SafeRoutePlannerProps> = ({
  onClose,
  onRouteCalculated,
  initialDestination,
}) => {
  const { userProfile } = useApp();

  const [originSearch, setOriginSearch] = useState(
    userProfile.location?.area
      ? `${userProfile.location.area}, ${userProfile.location.district}, ${userProfile.location.state}`
      : 'Kolkata, West Bengal, India'
  );
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number }>(
    userProfile.location?.coordinates || { lat: 22.5726, lng: 88.3639 }
  );

  const [destSearch, setDestSearch] = useState(
    initialDestination?.name || 'Dum Dum, Kolkata Metropolitan Area, Barrackpore'
  );
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number }>(
    initialDestination
      ? { lat: initialDestination.lat, lng: initialDestination.lng }
      : { lat: 22.6528, lng: 88.4325 }
  );

  const [originSuggestions, setOriginSuggestions] = useState<FlatLocationResult[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<FlatLocationResult[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const [transportMode, setTransportMode] = useState<'CAR' | 'BIKE' | 'TRAIN' | 'FLIGHT' | 'WALK'>('CAR');
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<CalculatedRoute | null>(null);

  // Initial calculation on mount if initialDestination is provided
  React.useEffect(() => {
    if (initialDestination) {
      setDestSearch(initialDestination.name);
      setDestCoords({ lat: initialDestination.lat, lng: initialDestination.lng });
      const initialRes = computeSafeCorridorRoute(
        originSearch.split(',')[0],
        originCoords,
        initialDestination.name.split(',')[0],
        { lat: initialDestination.lat, lng: initialDestination.lng },
        transportMode
      );
      setCurrentRoute(initialRes);
      onRouteCalculated(initialRes);
    }
  }, [initialDestination]);

  // Handle origin text input
  const handleOriginChange = (val: string) => {
    setOriginSearch(val);
    if (val.trim().length >= 2) {
      const results = searchAllIndianLocations(val);
      setOriginSuggestions(results.slice(0, 6));
      setShowOriginDropdown(true);
    } else {
      setOriginSuggestions([]);
      setShowOriginDropdown(false);
    }
  };

  // Handle destination text input
  const handleDestChange = (val: string) => {
    setDestSearch(val);
    if (val.trim().length >= 2) {
      const results = searchAllIndianLocations(val);
      setDestSuggestions(results.slice(0, 6));
      setShowDestDropdown(true);
    } else {
      setDestSuggestions([]);
      setShowDestDropdown(false);
    }
  };

  // Execute Route Computation
  const handleFindRoute = () => {
    setIsCalculating(true);

    setTimeout(() => {
      setIsCalculating(false);
      const res = computeSafeCorridorRoute(
        originSearch.split(',')[0],
        originCoords,
        destSearch.split(',')[0],
        destCoords,
        transportMode
      );
      setCurrentRoute(res);
      onRouteCalculated(res);
    }, 600);
  };

  // Quick sample selection
  const handleSelectSample = (sample: (typeof POPULAR_SAFE_ROUTES)[0]) => {
    setOriginSearch(sample.origin);
    setDestSearch(sample.destination);

    // Approximate coords for popular samples
    const originMatches = searchAllIndianLocations(sample.origin.split(',')[0]);
    const destMatches = searchAllIndianLocations(sample.destination.split(',')[0]);

    const oCoord = originMatches[0]?.coordinates || { lat: 22.57, lng: 88.36 };
    const dCoord = destMatches[0]?.coordinates || { lat: 22.65, lng: 88.43 };

    setOriginCoords(oCoord);
    setDestCoords(dCoord);
    setTransportMode(sample.mode);

    const res = computeSafeCorridorRoute(
      sample.origin.split(',')[0],
      oCoord,
      sample.destination.split(',')[0],
      dCoord,
      sample.mode
    );
    setCurrentRoute(res);
    onRouteCalculated(res);
  };

  return (
    <div className="absolute top-4 left-4 z-20 w-84 sm:w-96 max-w-[calc(100vw-2rem)] bg-[#081322]/98 border border-[#18314e] rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-left-4 max-h-[calc(100%-2rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#12243a]">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#00d492]" />
          <span className="font-extrabold text-white text-sm tracking-wide">
            SAFE ROUTE & TRAVEL PLANNER
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
          title="Close Route Planner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Origin Input */}
      <div className="mb-3 relative">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">
            FROM (ORIGIN)
          </label>
          <button
            type="button"
            onClick={() => {
              const loc = userProfile.location;
              setOriginSearch(`${loc.area}, ${loc.district}, ${loc.state}`);
              setOriginCoords(loc.coordinates);
            }}
            className="text-[10px] text-[#00d492] font-mono hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Compass className="w-3 h-3" />
            <span>Use My GPS</span>
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={originSearch}
            onChange={(e) => handleOriginChange(e.target.value)}
            onFocus={() => setShowOriginDropdown(originSuggestions.length > 0)}
            placeholder="Search starting city, area or district in India..."
            className="w-full bg-[#050d18] border border-[#162d47] focus:border-[#00d492] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none font-medium"
          />

          {showOriginDropdown && originSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#060e19] border border-[#18314e] rounded-xl shadow-2xl z-30 max-h-44 overflow-y-auto divide-y divide-[#10243a]">
              {originSuggestions.map((s, idx) => (
                <div
                  key={`orig-${idx}`}
                  onClick={() => {
                    setOriginSearch(`${s.area}, ${s.district}, ${s.state}`);
                    setOriginCoords(s.coordinates);
                    setShowOriginDropdown(false);
                  }}
                  className="p-2.5 hover:bg-[#0c1f36] text-xs text-slate-200 cursor-pointer"
                >
                  <p className="font-bold text-white">{s.area}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {s.district}, {s.state}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Destination Input */}
      <div className="mb-3 relative">
        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold mb-1">
          TO (DESTINATION)
        </label>
        <div className="relative">
          <input
            type="text"
            value={destSearch}
            onChange={(e) => handleDestChange(e.target.value)}
            onFocus={() => setShowDestDropdown(destSuggestions.length > 0)}
            placeholder="Search destination anywhere in India..."
            className="w-full bg-[#050d18] border border-[#162d47] focus:border-[#00d492] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none font-medium"
          />

          {showDestDropdown && destSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#060e19] border border-[#18314e] rounded-xl shadow-2xl z-30 max-h-44 overflow-y-auto divide-y divide-[#10243a]">
              {destSuggestions.map((s, idx) => (
                <div
                  key={`dest-${idx}`}
                  onClick={() => {
                    setDestSearch(`${s.area}, ${s.district}, ${s.state}`);
                    setDestCoords(s.coordinates);
                    setShowDestDropdown(false);
                  }}
                  className="p-2.5 hover:bg-[#0c1f36] text-xs text-slate-200 cursor-pointer"
                >
                  <p className="font-bold text-white">{s.area}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {s.district}, {s.state}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transport Mode Selector (5 modes: Car, Bike, Train, Flight, Walk) */}
      <div className="mb-3">
        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
          TRANSPORT MODE
        </label>
        <div className="grid grid-cols-5 gap-1 bg-[#050d18] p-1 rounded-xl border border-[#122338]">
          {[
            { mode: 'CAR', icon: Car },
            { mode: 'BIKE', icon: Bike },
            { mode: 'TRAIN', icon: Train },
            { mode: 'FLIGHT', icon: Plane },
            { mode: 'WALK', icon: Footprints },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = transportMode === item.mode;
            return (
              <button
                key={item.mode}
                type="button"
                onClick={() => setTransportMode(item.mode as any)}
                className={`py-1.5 flex flex-col items-center justify-center rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 mb-0.5" />
                <span>{item.mode}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Sample Routes */}
      <div className="mb-3">
        <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
          POPULAR SAFE HIGHWAY CORRIDORS
        </label>
        <div className="flex flex-wrap gap-1 text-[10px]">
          {POPULAR_SAFE_ROUTES.slice(0, 4).map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectSample(r)}
              className="px-2 py-1 bg-[#050d18] border border-[#162d47] hover:border-[#00d492] text-slate-300 hover:text-white rounded-lg text-[10px] cursor-pointer transition-colors"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Find Safe Route Button */}
      <button
        type="button"
        onClick={handleFindRoute}
        disabled={isCalculating}
        className="w-full py-2.5 rounded-xl bg-[#009e60] hover:bg-[#00b870] active:scale-[0.99] text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer uppercase mb-3"
      >
        {isCalculating ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Evaluating Geological Hazard Corridors...</span>
          </>
        ) : (
          <>
            <Navigation className="w-3.5 h-3.5" />
            <span>FIND SAFE ROUTE</span>
          </>
        )}
      </button>

      {/* Route Result Card */}
      {currentRoute && (
        <div className="bg-[#050d18] border border-[#18314e] rounded-xl p-3 animate-in fade-in slide-in-from-bottom-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>OPTIMIZED SAFE CORRIDOR</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              {currentRoute.transportMode}
            </span>
          </div>

          <p className="text-sm font-black text-white leading-tight">
            {currentRoute.originName} → {currentRoute.destName}
          </p>

          {/* Key Metric Triplets */}
          <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-xs">
            <div className="bg-[#081322] p-2 rounded-lg border border-[#12243a]">
              <span className="text-[9px] text-slate-400 block">DISTANCE</span>
              <span className="font-black text-white text-xs">{currentRoute.distanceKm} km</span>
            </div>
            <div className="bg-[#081322] p-2 rounded-lg border border-[#12243a]">
              <span className="text-[9px] text-slate-400 block">EST. TIME</span>
              <span className="font-black text-white text-xs">{currentRoute.durationFormatted}</span>
            </div>
            <div className="bg-[#081322] p-2 rounded-lg border border-[#12243a]">
              <span className="text-[9px] text-slate-400 block">SAFETY SCORE</span>
              <span
                className={`font-black text-xs ${
                  currentRoute.safetyScore >= 80
                    ? 'text-emerald-400'
                    : currentRoute.safetyScore >= 60
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {currentRoute.safetyScore}%
              </span>
            </div>
          </div>

          {/* Environmental Telemetry along Path */}
          <div className="bg-[#0c1f36] p-2.5 rounded-lg border border-[#17385c] text-[11px] font-mono space-y-1">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-sky-400" />
                <span>Precipitation:</span>
              </span>
              <span>{currentRoute.precipMm} mm (Peak: {currentRoute.peakPrecipMm}mm)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-amber-400" />
                <span>Soil Moisture:</span>
              </span>
              <span>{currentRoute.soilMoisturePercent}% Saturation</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1">
                <Mountain className="w-3 h-3 text-emerald-400" />
                <span>Elev. Gain / Max Slope:</span>
              </span>
              <span>+{currentRoute.elevationGainM}m / {currentRoute.maxSlopeAngle}°</span>
            </div>
            <div className="flex justify-between text-slate-300 pt-1 border-t border-[#1a416a]">
              <span className="text-slate-400">Hazard Class:</span>
              <span
                className={`font-bold ${
                  currentRoute.safetyScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {currentRoute.corridorStatus}
              </span>
            </div>
          </div>

          {/* Advisory */}
          <div className="p-2 rounded-lg bg-[#071322] border border-[#142944] text-[10px] text-slate-300 leading-relaxed font-sans">
            <span className="font-bold text-amber-400">Geotechnical Route Advisory: </span>
            {currentRoute.advisory}
          </div>

          {/* Direct Google Maps Navigation Button (GO NOW) */}
          <a
            href={currentRoute.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>START LIVE NAVIGATION (GOOGLE MAPS)</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      )}
    </div>
  );
};
