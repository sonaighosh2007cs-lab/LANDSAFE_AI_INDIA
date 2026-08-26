import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Flame,
  Droplets,
  CloudRain,
  Compass,
  Activity,
  Mountain,
  Thermometer,
  Wind,
  MapPin,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Radio,
  Map,
  History,
  Clock,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_CORRIDOR_SAFETY, INITIAL_ACTIVE_ADVISORY } from '../data/disasterData';
import { AnimatedNumber } from '../components/common/AnimatedNumber';
import { AqiCard } from '../components/common/AqiCard';

export const DashboardOverview: React.FC = () => {
  const {
    userProfile,
    telemetry,
    riskScore,
    riskDelta,
    scenario,
    corridorSafety,
    activeAdvisory,
    setIsLocationModalOpen,
    setActiveRoute,
    setIsNotificationDrawerOpen,
  } = useApp();

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine risk theme colors
  const getRiskColor = (score: number) => {
    if (score >= 75)
      return {
        badge: 'bg-red-500/10 text-red-400 border-red-500/20',
        stroke: '#ef4444',
        text: 'text-red-500',
        label: 'CRITICAL RISK',
        glow: 'glow-red',
      };
    if (score >= 50)
      return {
        badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        stroke: '#ea580c',
        text: 'text-orange-500',
        label: 'HIGH RISK',
        glow: 'glow-orange',
      };
    if (score >= 35)
      return {
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        stroke: '#f59e0b',
        text: 'text-amber-400',
        label: 'MODERATE RISK',
        glow: 'glow-amber',
      };
    return {
      badge: 'bg-green-500/10 text-green-400 border-green-500/20',
      stroke: '#22c55e',
      text: 'text-green-400',
      label: 'LOW RISK',
      glow: 'glow-emerald',
    };
  };

  const riskTheme = getRiskColor(riskScore);

  // SVG Gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  // 6 Contributing Factors
  const contributingFactors = [
    { name: 'Rainfall Intensity', val: Math.min(100, Math.round(telemetry.precipitation.value * 1.3)), color: 'from-orange-500 to-amber-400' },
    { name: 'Soil Moisture Saturation', val: telemetry.soilMoisture.value, color: 'from-amber-500 to-yellow-400' },
    { name: 'Atmospheric Humidity', val: telemetry.humidity.value, color: 'from-blue-500 to-cyan-400' },
    { name: 'Temperature Fluctuation', val: Math.min(100, telemetry.temperature.value * 3), color: 'from-orange-600 to-red-500' },
    { name: 'Slope Instability Index', val: Math.min(100, Math.round(telemetry.slopeAngle.value * 2.4)), color: 'from-red-500 to-rose-400' },
    { name: 'Historical Susceptibility', val: userProfile.location.isHazardMonitored ? 64 : 20, color: 'from-purple-500 to-violet-400' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Banner: Greeting + Live Time */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hello, {userProfile.name || 'Rishi'}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Current Location:{' '}
            <span className="text-orange-500 font-medium uppercase tracking-wide">
              {userProfile.location.area}, {userProfile.location.district} ({userProfile.location.state})
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Risk Index</p>
            <p className={`text-base font-bold ${riskTheme.text}`}>{riskTheme.label}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121214] border border-white/10 text-xs font-mono text-gray-300 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>{currentTime || '08:06 PM'}</span>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="interactive-btn px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(234,88,12,0.3)]"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Change Area</span>
          </button>
        </div>
      </div>

      {/* Selected Monitoring Area Card */}
      <div className="interactive-card bg-[#121214] border border-white/5 hover:border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left side details */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                📍 {userProfile.location.area} ({userProfile.location.state})
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                Live Telemetry
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${riskTheme.badge}`}
              >
                ● {riskTheme.label} (<AnimatedNumber value={riskScore} suffix="%" />)
              </span>
            </div>

            {/* Geographical Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
              <div className="interactive-card bg-[#0a0a0b] p-3 rounded-xl border border-white/5 hover:border-orange-500/20">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Coordinates</span>
                <span className="text-white font-bold flex items-center gap-1">
                  <AnimatedNumber value={userProfile.location.coordinates.lat} decimals={3} />° N,{' '}
                  <AnimatedNumber value={userProfile.location.coordinates.lng} decimals={3} />° E
                </span>
              </div>
              <div className="interactive-card bg-[#0a0a0b] p-3 rounded-xl border border-white/5 hover:border-orange-500/20">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Elevation</span>
                <span className="text-white font-bold">
                  <AnimatedNumber value={telemetry.elevation.value} suffix=" m ASL" />
                </span>
              </div>
              <div className="interactive-card bg-[#0a0a0b] p-3 rounded-xl border border-white/5 hover:border-orange-500/20">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Slope Gradient</span>
                <span className="text-white font-bold">
                  <AnimatedNumber value={telemetry.slopeAngle.value} decimals={1} suffix="° Incline" />
                </span>
              </div>
              <div className="interactive-card bg-[#0a0a0b] p-3 rounded-xl border border-white/5 hover:border-orange-500/20">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Lithology</span>
                <span className="text-orange-400 font-semibold truncate block">
                  {userProfile.location.lithology}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setActiveRoute('ai-risk-engineering')}
              className="interactive-btn flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-orange-400" />
              <span>XAI Engineering</span>
            </button>
            <button
              onClick={() => setActiveRoute('distance')}
              className="interactive-btn flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Safe Corridor Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Air Quality Index (AQI) - Synced to Selected Location */}
      <AqiCard location={userProfile.location} variant="dashboard" />

      {/* Main Grid: AI Risk Score vs 8 Sensor Mesh Tiles (Shifted cleanly below AQI) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): AI Landslide Risk Score */}
        <div className="interactive-card lg:col-span-5 bg-[#121214] border border-white/5 hover:border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Landslide Risk Score</h3>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Deep Geotechnical Neural Network
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                Confidence: 98%
              </span>
            </div>

            {/* Circular Risk Gauge Ring */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    className="text-white/5"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke={riskTheme.stroke}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    <AnimatedNumber value={riskScore} suffix="%" />
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500">
                    Instability Index
                  </span>
                </div>
              </div>
              <span
                className={`mt-2 text-xs font-mono font-bold px-3 py-1 rounded-full border ${riskTheme.badge}`}
              >
                ● {riskTheme.label} ACTIVE ({riskDelta})
              </span>
            </div>

            {/* Contributing Factors Bars */}
            <div className="space-y-2.5 mt-6">
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>Contributing Factors</span>
                <span>Relative Weight</span>
              </div>
              {contributingFactors.map((f, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-medium">{f.name}</span>
                    <span className="text-white font-mono font-bold">
                      <AnimatedNumber value={f.val} suffix="%" />
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0a0a0b] rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full bg-gradient-to-r ${f.color} rounded-full transition-all duration-700`}
                      style={{ width: `${f.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => setActiveRoute('ai-risk-engineering')}
              className="interactive-btn text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Explainable AI Engine (SHAP Vectors)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column (7 Cols): 8 Sensor Mesh Telemetry Tiles */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Sensor Mesh & Local Telemetry</h3>
            </div>
            <span className="text-[10px] font-mono text-gray-400">
              8 Real-Time IoT Nodes Connected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Tile 1: Precipitation */}
            <div className="interactive-card bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">Precipitation</span>
                <CloudRain className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white flex items-baseline gap-1">
                  <AnimatedNumber value={telemetry.precipitation.value} decimals={1} />
                  <span className="text-xs font-normal text-gray-500">mm</span>
                </p>
                <p className="text-[10px] font-mono text-blue-400 mt-0.5">
                  {telemetry.precipitation.intensity} Intensity
                </p>
              </div>
            </div>

            {/* Tile 2: Soil Moisture */}
            <div className="interactive-card bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">Soil Moisture</span>
                <Droplets className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white flex items-baseline gap-1">
                  <AnimatedNumber value={telemetry.soilMoisture.value} />
                  <span className="text-xs font-normal text-gray-500">%</span>
                </p>
                <p className="text-[10px] font-mono text-cyan-400 mt-0.5">
                  {telemetry.soilMoisture.saturation}
                </p>
              </div>
            </div>

            {/* Tile 3: Slope Angle */}
            <div className="interactive-card bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">Slope Angle</span>
                <Compass className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white flex items-baseline gap-1">
                  <AnimatedNumber value={telemetry.slopeAngle.value} decimals={1} />
                  <span className="text-xs font-normal text-gray-500">°</span>
                </p>
                <p className="text-[10px] font-mono text-amber-400 mt-0.5">
                  {telemetry.slopeAngle.gradient}
                </p>
              </div>
            </div>

            {/* Tile 4: Ground Displacement */}
            <div className="interactive-card bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-red-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">Displacement</span>
                <Activity className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white flex items-baseline gap-1">
                  <AnimatedNumber value={telemetry.groundDisplacement.value} decimals={1} />
                  <span className="text-xs font-normal text-gray-500">mm</span>
                </p>
                <p className="text-[10px] font-mono text-red-400 mt-0.5">
                  {telemetry.groundDisplacement.rate}
                </p>
              </div>
            </div>

            {/* Tile 5: Elevation */}
            <div className="interactive-card bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">Elevation</span>
                <Mountain className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white flex items-baseline gap-1">
                  <AnimatedNumber value={telemetry.elevation.value} />
                  <span className="text-xs font-normal text-gray-500">m</span>
                </p>
                <p className="text-[10px] font-mono text-emerald-400 mt-0.5">
                  {telemetry.elevation.terrain}
                </p>
              </div>
            </div>

            {/* Tile 6: Temperature */}
            <div className="interactive-card bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-orange-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">Temperature</span>
                <Thermometer className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white flex items-baseline gap-1">
                  <AnimatedNumber value={telemetry.temperature.value} decimals={1} />
                  <span className="text-xs font-normal text-gray-500">°C</span>
                </p>
                <p className="text-[10px] font-mono text-orange-400 mt-0.5">
                  {telemetry.temperature.condition}
                </p>
              </div>
            </div>

            {/* Tile 7: Humidity */}
            <div className="interactive-card bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-teal-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">Humidity</span>
                <Wind className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white flex items-baseline gap-1">
                  <AnimatedNumber value={telemetry.humidity.value} />
                  <span className="text-xs font-normal text-gray-500">%</span>
                </p>
                <p className="text-[10px] font-mono text-teal-400 mt-0.5 truncate">
                  Vapor Saturation
                </p>
              </div>
            </div>

            {/* Tile 8: Ground Condition / Pore Pressure */}
            <div className="interactive-card bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400">Pore Pressure</span>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white flex items-baseline gap-1">
                  <AnimatedNumber value={telemetry.groundCondition.value} decimals={1} />
                  <span className="text-xs font-normal text-gray-500">kPa</span>
                </p>
                <p className="text-[10px] font-mono text-purple-400 mt-0.5 truncate">
                  {telemetry.groundCondition.shearStress}
                </p>
              </div>
            </div>
          </div>

          {/* Quick System Navigation Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => setActiveRoute('india-map')}
              className="interactive-card p-3.5 rounded-xl bg-[#121214] border border-white/5 hover:border-orange-500/40 hover:bg-white/5 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Map className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Pan-India Risk Map</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-orange-400" />
            </button>

            <button
              onClick={() => setActiveRoute('indian-risk-ranking')}
              className="interactive-card p-3.5 rounded-xl bg-[#121214] border border-white/5 hover:border-orange-500/40 hover:bg-white/5 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Vulnerability Rankings</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-amber-400" />
            </button>

            <button
              onClick={() => setActiveRoute('gsi-historical-analysis')}
              className="interactive-card p-3.5 rounded-xl bg-[#121214] border border-white/5 hover:border-orange-500/40 hover:bg-white/5 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">GSI Historical Records</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 2 Critical Cards: Road Corridor Safety & Active Advisory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Road & Highway Corridor Safety */}
        <div className="interactive-card bg-[#121214] border border-white/5 hover:border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                HIGHWAY CORRIDOR TELEMETRY
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                (corridorSafety?.status || 'CAUTION').includes('CLOSED') || (corridorSafety?.status || 'CAUTION').includes('BLOCKED')
                  ? 'bg-red-500/10 text-red-300 border-red-500/20'
                  : (corridorSafety?.status || 'CAUTION').includes('OPEN')
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}>
                {corridorSafety?.status || INITIAL_CORRIDOR_SAFETY.status}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {corridorSafety?.name || INITIAL_CORRIDOR_SAFETY.name}
            </h3>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              {corridorSafety?.description || INITIAL_CORRIDOR_SAFETY.description}
            </p>

            <div className="bg-[#0a0a0b] p-3 rounded-xl border border-white/5 text-xs mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block mb-1">
                Recommended Action
              </span>
              <p className="text-orange-300 font-medium">{corridorSafety?.recommendedAction || INITIAL_CORRIDOR_SAFETY.recommendedAction}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveRoute('distance')}
            className="interactive-btn w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-orange-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>View Distance & Safe Highway Corridors</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Active Advisory & Emergency Protocol */}
        <div className="interactive-card bg-[#121214] border border-white/5 hover:border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                ACTIVE ADVISORY & PROTOCOL
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                (activeAdvisory?.severity || 'HIGH').includes('HIGH') || (activeAdvisory?.severity || 'HIGH').includes('CRITICAL')
                  ? 'bg-red-500/10 text-red-300 border-red-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}>
                {activeAdvisory?.severity || INITIAL_ACTIVE_ADVISORY.severity}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {activeAdvisory?.title || INITIAL_ACTIVE_ADVISORY.title}
            </h3>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              {activeAdvisory?.summary || INITIAL_ACTIVE_ADVISORY.summary}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
              <div className="interactive-card bg-[#0a0a0b] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 block">Active Alerts</span>
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <AnimatedNumber value={activeAdvisory?.activeAlertsCount ?? INITIAL_ACTIVE_ADVISORY.activeAlertsCount} />
                  <span>Active Hotspots</span>
                </span>
              </div>
              <div className="interactive-card bg-[#0a0a0b] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 block">Relief Shelters</span>
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <AnimatedNumber value={activeAdvisory?.sheltersAvailable ?? INITIAL_ACTIVE_ADVISORY.sheltersAvailable} />
                  <span>Open & Ready</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveRoute('active-warning-hotspot')}
            className="interactive-btn w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-orange-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>View All Monitored Warning Hotspots</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Regional Threat Pulse Bar */}
      <div className="interactive-card bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-white font-bold">INDIA REGIONAL RISK PULSE:</span>
          <span className="text-orange-400 flex items-center gap-1">
            {userProfile.location.state} Nominal (<AnimatedNumber value={riskScore} suffix="/100" />)
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <span>THREAT:</span>
          <span className="text-green-400 font-bold">LOW</span>
          <span>→</span>
          <span className="text-amber-400">MEDIUM</span>
          <span>→</span>
          <span className="text-red-400 font-bold">CRITICAL (Darjeeling-Sikkim Axis)</span>
        </div>
      </div>
    </div>
  );
};
