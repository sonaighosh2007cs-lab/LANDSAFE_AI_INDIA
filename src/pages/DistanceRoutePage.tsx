import React, { useState, useEffect } from 'react';
import {
  Route,
  Navigation,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Shield,
  Clock,
  ArrowRight,
  TrendingDown,
  Compass,
  Layers,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getDynamicLocationCorridors } from '../services/locationDataService';

export const DistanceRoutePage: React.FC = () => {
  const { userProfile, telemetry, riskScore } = useApp();

  const dynamicData = getDynamicLocationCorridors(userProfile.location, riskScore);

  const [origin, setOrigin] = useState(dynamicData.origin);
  const [destination, setDestination] = useState(dynamicData.destination);
  const [selectedCorridor, setSelectedCorridor] = useState<string>('safe-bypass');

  // Reactively sync origin and destination when user switches location
  useEffect(() => {
    setOrigin(dynamicData.origin);
    setDestination(dynamicData.destination);
  }, [userProfile.location, dynamicData.origin, dynamicData.destination]);

  const corridors = dynamicData.corridors;
  const profile = dynamicData.elevationProfile;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="border-b border-[#14263c] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Route className="w-6 h-6 text-emerald-400" />
            Distance & Safe Highway Corridors
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time geological hazard routing and mountain ghat detour optimization for {userProfile.location.district} ({userProfile.location.state}).
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#091626] border border-[#1b385a] text-emerald-400 w-fit">
          ● BRO & SDMA Live Corridor Feed
        </span>
      </div>

      {/* Origin / Destination Search Box */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-5 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 relative">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              ORIGIN LOCATION (ACTIVE REGION)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-[#060e19] border border-[#18314e] focus:border-[#00d492] rounded-xl pl-10 pr-3 py-2.5 text-xs font-medium text-white outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-[#0c1e33] border border-[#1a385a] flex items-center justify-center text-slate-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="md:col-span-5 relative">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              DESTINATION POINT (HUB / SAFE SHELTER)
            </label>
            <div className="relative">
              <Compass className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#060e19] border border-[#18314e] focus:border-[#00d492] rounded-xl pl-10 pr-3 py-2.5 text-xs font-medium text-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Route Options Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {corridors.map((c) => {
          const isSelected = selectedCorridor === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCorridor(c.id)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `${c.color} ring-2 ring-[#00d492]/40 shadow-xl`
                  : 'bg-[#091626] border-[#182f4d] hover:border-[#224874]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10 uppercase">
                    {c.riskTier}
                  </span>
                  <span className="text-xs font-bold">{c.status}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{c.name}</h3>
                <p className="text-xs leading-relaxed text-slate-300 mb-4">{c.warning}</p>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-black/30 p-3 rounded-xl border border-white/5 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <span className="text-white font-bold">{c.distance}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Time</span>
                    <span className="text-white font-bold">{c.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Elevation</span>
                    <span className="text-white font-bold">{c.elevationGain}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-slate-400">Ghat Stability: {c.ghatSections}</span>
                <span className="font-bold text-[#00d492] flex items-center gap-1">
                  {isSelected ? '✓ Selected Route' : 'Click to Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Elevation & Slope Gradient Profile Visualizer */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00d492]" />
          Topographical Slope Elevation Profile & Landslide Danger Zones
        </h3>
        <p className="text-xs text-slate-400 mb-4 font-mono">
          Route Cross-Section: {userProfile.location.area} ({profile.startElev}m) → Crest Altitude ({profile.peakElev}m) → {destination} ({profile.destElev}m)
        </p>

        {/* SVG Profile Chart */}
        <div className="h-44 w-full bg-[#060e19] rounded-xl border border-[#14263c] p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>{profile.startElev}m (Start: {userProfile.location.area})</span>
            <span className="text-rose-400 font-bold">⚠ Danger Zone ({profile.dangerPointDesc})</span>
            <span>{profile.destElev}m (Destination)</span>
          </div>

          <div className="relative w-full h-24">
            <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d492" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00d492" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 35 Q 120 10 240 40 T 360 65 T 500 80 L 500 100 L 0 100 Z"
                fill="url(#elevationGrad)"
              />
              <path
                d="M 0 35 Q 120 10 240 40 T 360 65 T 500 80"
                fill="none"
                stroke="#00d492"
                strokeWidth="2.5"
              />
              {/* Hazard point marker */}
              <circle cx="160" cy="20" r="5" fill="#f43f5e" className="animate-ping" />
              <circle cx="160" cy="20" r="4" fill="#f43f5e" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-[#12243a] pt-1">
            <span>0 km (Start)</span>
            <span>{Math.round(profile.totalKm * 0.35)} km</span>
            <span>{Math.round(profile.totalKm * 0.7)} km</span>
            <span>{profile.totalKm} km (Arrive)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
