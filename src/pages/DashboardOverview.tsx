import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Droplets,
  CloudRain,
  Compass,
  Activity,
  Mountain,
  Thermometer,
  Wind,
  MapPin,
  ChevronRight,
  TrendingUp,
  Map,
  History,
  Clock,
  ArrowUpRight,
  Sparkles,
  Navigation,
  Loader2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimatedNumber } from '../components/common/AnimatedNumber';
import { AqiCard } from '../components/common/AqiCard';
import { DataPipelinesOverview } from '../components/common/DataPipelinesOverview';

export const DashboardOverview: React.FC = () => {
  const {
    userProfile,
    telemetry,
    riskScore,
    riskDelta,
    setIsLocationModalOpen,
    setActiveRoute,
    isDetectingGps,
    detectAndApplyGpsLocation,
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
  const radius = 68;
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
      {/* ========================================================================= */}
      {/* 1. TOP HEADER SECTION: Greeting + Live Time + Location Change Option */}
      {/* ========================================================================= */}
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

        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Risk Index</p>
            <p className={`text-base font-bold ${riskTheme.text}`}>{riskTheme.label}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121214] border border-white/10 text-xs font-mono text-gray-300 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>{currentTime || '08:06 PM'}</span>
          </div>
          <button
            onClick={() => detectAndApplyGpsLocation()}
            disabled={isDetectingGps}
            className="interactive-btn px-3 py-1.5 rounded-xl bg-orange-950/50 hover:bg-orange-900/50 border border-orange-500/40 text-orange-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            title="Detect GPS location from device"
          >
            {isDetectingGps ? (
              <Loader2 className="w-3.5 h-3.5 text-orange-400 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-orange-400" />
            )}
            <span className="hidden sm:inline">My Location</span>
          </button>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="interactive-btn px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_15px_rgba(234,88,12,0.3)]"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Change Area</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. AREA AND AREA DETAILS SECTION */}
      {/* ========================================================================= */}
      <div className="interactive-card bg-[#121214] border border-white/5 hover:border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left side details */}
          <div className="space-y-3 flex-1">
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
                <span className="text-white font-bold flex items-center gap-1 truncate">
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

          {/* Right Action button */}
          <div className="flex flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setActiveRoute('ai-risk-engineering')}
              className="interactive-btn flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-orange-400" />
              <span>XAI Engineering</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FULL-WIDTH AI LAND RISK SCORE (PROMINENT & VISUALLY DOMINANT) */}
      {/* ========================================================================= */}
      <div className="interactive-card w-full bg-[#121214] border border-white/5 hover:border-orange-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  AI Landslide Risk Score
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold uppercase">
                  Primary Telemetry Metric
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Deep Geotechnical Neural Network • Continuous Multi-Parameter Risk Ingestion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10">
              Confidence: 98.4%
            </span>
            <button
              onClick={() => setActiveRoute('ai-risk-engineering')}
              className="interactive-btn text-xs text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 px-3 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Explainable AI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content: Large Gauge + 6 Contributing Factors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center py-6">
          {/* Left Column (5 cols): Prominent Centered Circular Risk Gauge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center lg:border-r lg:border-white/5 lg:pr-8">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
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
                <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  <AnimatedNumber value={riskScore} suffix="%" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mt-1">
                  Instability Index
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-col items-center gap-1.5">
              <span
                className={`text-xs font-mono font-bold px-3.5 py-1 rounded-full border ${riskTheme.badge}`}
              >
                ● {riskTheme.label} ACTIVE ({riskDelta})
              </span>
              <p className="text-[11px] text-gray-400 max-w-xs mt-1">
                Real-time geotechnical edge inference computed from slope dynamics, rainfall saturation, and soil pore metrics.
              </p>
            </div>
          </div>

          {/* Right Column (7 cols): Contributing Risk Factors */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-gray-400 pb-1 border-b border-white/5">
              <span className="font-semibold text-gray-300">Contributing Geological Vectors</span>
              <span>Relative Feature Weight</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 pt-1">
              {contributingFactors.map((f, i) => (
                <div key={i} className="space-y-1.5 bg-[#0a0a0b]/60 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-medium truncate">{f.name}</span>
                    <span className="text-white font-mono font-bold shrink-0">
                      <AnimatedNumber value={f.val} suffix="%" />
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#0a0a0b] rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full bg-gradient-to-r ${f.color} rounded-full transition-all duration-700`}
                      style={{ width: `${f.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Edge Neural Inference Engine (SHAP Vectors active • 22ms latency)</span>
          </div>
          <button
            onClick={() => setActiveRoute('ai-risk-engineering')}
            className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Deep Geotechnical Analysis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 & 5. 50/50 SPLIT: ACQUIRE (LEFT) | SENSOR MESH & LOCAL TELEMETRY (RIGHT) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* LEFT 50%: ACQUIRE (Air Quality Index & Live Pollutants) */}
        <div className="flex flex-col h-full">
          <AqiCard location={userProfile.location} variant="dashboard" className="h-full flex flex-col justify-between" />
        </div>

        {/* RIGHT 50%: SENSOR MESH & LOCAL TELEMETRY */}
        <div className="interactive-card bg-[#121214] border border-white/5 hover:border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                <h3 className="text-sm font-bold text-white">Sensor Mesh & Local Telemetry</h3>
              </div>
              <span className="text-[10px] font-mono text-gray-400">
                8 Real-Time IoT Nodes Connected
              </span>
            </div>

            {/* 8 Sensor Tiles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Tile 1: Precipitation */}
              <div className="interactive-card bg-[#0a0a0b] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-gray-400 truncate">Precipitation</span>
                  <CloudRain className="w-4 h-4 text-blue-400 shrink-0" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white flex items-baseline gap-1">
                    <AnimatedNumber value={telemetry.precipitation.value} decimals={1} />
                    <span className="text-xs font-normal text-gray-500">mm</span>
                  </p>
                  <p className="text-[10px] font-mono text-blue-400 mt-0.5 truncate">
                    {telemetry.precipitation.intensity} Intensity
                  </p>
                </div>
              </div>

              {/* Tile 2: Soil Moisture */}
              <div className="interactive-card bg-[#0a0a0b] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-gray-400 truncate">Soil Moisture</span>
                  <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white flex items-baseline gap-1">
                    <AnimatedNumber value={telemetry.soilMoisture.value} />
                    <span className="text-xs font-normal text-gray-500">%</span>
                  </p>
                  <p className="text-[10px] font-mono text-cyan-400 mt-0.5 truncate">
                    {telemetry.soilMoisture.saturation}
                  </p>
                </div>
              </div>

              {/* Tile 3: Slope Angle */}
              <div className="interactive-card bg-[#0a0a0b] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-gray-400 truncate">Slope Angle</span>
                  <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white flex items-baseline gap-1">
                    <AnimatedNumber value={telemetry.slopeAngle.value} decimals={1} />
                    <span className="text-xs font-normal text-gray-500">°</span>
                  </p>
                  <p className="text-[10px] font-mono text-amber-400 mt-0.5 truncate">
                    {telemetry.slopeAngle.gradient}
                  </p>
                </div>
              </div>

              {/* Tile 4: Ground Displacement */}
              <div className="interactive-card bg-[#0a0a0b] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:border-red-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-gray-400 truncate">Displacement</span>
                  <Activity className="w-4 h-4 text-red-400 shrink-0" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white flex items-baseline gap-1">
                    <AnimatedNumber value={telemetry.groundDisplacement.value} decimals={1} />
                    <span className="text-xs font-normal text-gray-500">mm</span>
                  </p>
                  <p className="text-[10px] font-mono text-red-400 mt-0.5 truncate">
                    {telemetry.groundDisplacement.rate}
                  </p>
                </div>
              </div>

              {/* Tile 5: Elevation */}
              <div className="interactive-card bg-[#0a0a0b] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-gray-400 truncate">Elevation</span>
                  <Mountain className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white flex items-baseline gap-1">
                    <AnimatedNumber value={telemetry.elevation.value} />
                    <span className="text-xs font-normal text-gray-500">m</span>
                  </p>
                  <p className="text-[10px] font-mono text-emerald-400 mt-0.5 truncate">
                    {telemetry.elevation.terrain}
                  </p>
                </div>
              </div>

              {/* Tile 6: Temperature */}
              <div className="interactive-card bg-[#0a0a0b] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:border-orange-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-gray-400 truncate">Temperature</span>
                  <Thermometer className="w-4 h-4 text-orange-400 shrink-0" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white flex items-baseline gap-1">
                    <AnimatedNumber value={telemetry.temperature.value} decimals={1} />
                    <span className="text-xs font-normal text-gray-500">°C</span>
                  </p>
                  <p className="text-[10px] font-mono text-orange-400 mt-0.5 truncate">
                    {telemetry.temperature.condition}
                  </p>
                </div>
              </div>

              {/* Tile 7: Humidity */}
              <div className="interactive-card bg-[#0a0a0b] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:border-teal-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-gray-400 truncate">Humidity</span>
                  <Wind className="w-4 h-4 text-teal-400 shrink-0" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white flex items-baseline gap-1">
                    <AnimatedNumber value={telemetry.humidity.value} />
                    <span className="text-xs font-normal text-gray-500">%</span>
                  </p>
                  <p className="text-[10px] font-mono text-teal-400 mt-0.5 truncate">
                    Vapor Saturation
                  </p>
                </div>
              </div>

              {/* Tile 8: Ground Condition / Pore Pressure */}
              <div className="interactive-card bg-[#0a0a0b] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:border-purple-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-gray-400 truncate">Pore Pressure</span>
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white flex items-baseline gap-1">
                    <AnimatedNumber value={telemetry.groundCondition.value} decimals={1} />
                    <span className="text-xs font-normal text-gray-500">kPa</span>
                  </p>
                  <p className="text-[10px] font-mono text-purple-400 mt-0.5 truncate">
                    {telemetry.groundCondition.shearStress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. DATA PIPELINES & GIS (Directly below AQUA + Sensor Mesh section) */}
      {/* ========================================================================= */}
      <DataPipelinesOverview />

      {/* ========================================================================= */}
      {/* 6. BOTTOM DASHBOARD QUICK ACTIONS & NAVIGATION */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          onClick={() => setActiveRoute('india-map')}
          className="interactive-card p-4 rounded-2xl bg-[#121214] border border-white/5 hover:border-orange-500/40 hover:bg-white/5 flex items-center justify-between transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center gap-3 truncate">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform shrink-0">
              <Map className="w-4 h-4" />
            </div>
            <div className="text-left truncate">
              <span className="text-xs font-bold text-white block truncate">India GIS Risk Map</span>
              <span className="text-[10px] font-mono text-gray-400">Interactive GIS Map</span>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-orange-400 shrink-0" />
        </button>

        <button
          onClick={() => setActiveRoute('indian-risk-ranking')}
          className="interactive-card p-4 rounded-2xl bg-[#121214] border border-white/5 hover:border-amber-500/40 hover:bg-white/5 flex items-center justify-between transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center gap-3 truncate">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-left truncate">
              <span className="text-xs font-bold text-white block truncate">National Risk Rankings</span>
              <span className="text-[10px] font-mono text-gray-400">Hazard Index Table</span>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-amber-400 shrink-0" />
        </button>

        <button
          onClick={() => setActiveRoute('gsi-historical-analysis')}
          className="interactive-card p-4 rounded-2xl bg-[#121214] border border-white/5 hover:border-cyan-500/40 hover:bg-white/5 flex items-center justify-between transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center gap-3 truncate">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div className="text-left truncate">
              <span className="text-xs font-bold text-white block truncate">GSI Historical Records</span>
              <span className="text-[10px] font-mono text-gray-400">Archive & Analytics</span>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 shrink-0" />
        </button>
      </div>
    </div>
  );
};
