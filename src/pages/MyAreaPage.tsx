import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Radio,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MyAreaRiskFactorsCard } from '../components/myarea/MyAreaRiskFactorsCard';
import { MyAreaRiskScoreCard } from '../components/myarea/MyAreaRiskScoreCard';
import { AqiCard } from '../components/common/AqiCard';
import { MyAreaInfrastructureMesh } from '../components/myarea/MyAreaInfrastructureMesh';
import { MyAreaNewsCard } from '../components/myarea/MyAreaNewsCard';
import { MyAreaSheltersCard } from '../components/myarea/MyAreaSheltersCard';
import { MyAreaEmergencyContacts } from '../components/myarea/MyAreaEmergencyContacts';

export const MyAreaPage: React.FC = () => {
  const {
    userProfile,
    telemetry,
    riskScore,
    setIsLocationModalOpen,
    isAnalyzingLocation,
  } = useApp();

  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');

  // Live ticking clock for the local dashboard
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDateStr(
        now.toLocaleDateString([], {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const location = userProfile.location;

  return (
    <div
      key={`${location.state}-${location.district}-${location.area}`}
      className="space-y-6 animate-in fade-in duration-300 pb-16"
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & LOCAL TIME STATUS BAR */}
      {/* ========================================================================= */}
      <div className="bg-[#060e19] border border-[#14263c] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded bg-emerald-950/90 text-[#00d492] border border-emerald-800 flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-[#00d492] animate-pulse" />
              {location.isHazardMonitored ? 'GSI Hazard Monitored Sector' : 'Active Telemetry Node'}
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-[#0c1d30] px-2 py-0.5 rounded border border-[#163456]">
              Node ID: {location.district.substring(0, 3).toUpperCase()}-{Math.round(location.coordinates.lat * 10)}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#00d492] shrink-0" />
            <span>
              {location.area},{' '}
              <span className="text-slate-400 font-normal">
                {location.district} ({location.state})
              </span>
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Hyper-local geotechnical sensor telemetry, AI risk factors, smart infrastructure mesh, and district emergency response dispatch.
          </p>
        </div>

        {/* Right Header Side: Real-Time Clock & Change Location Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="bg-[#091626] border border-[#12243a] px-3.5 py-2 rounded-xl text-right">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 justify-end">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTimeStr || '09:42:00 PM'}</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              {currentDateStr || 'Wednesday, 26 August 2026'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#00d492] hover:bg-[#00b870] text-[#050c17] text-xs font-black font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-950/50 hover:scale-105"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Change Monitored Area</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRIMARY SCREENSHOT-INSPIRED UPPER SECTION: AI RISK FACTORS & AI RISK SCORE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): AI Risk Factors Card (Live Telemetry Influx) */}
        <div className="lg:col-span-7 flex flex-col">
          <MyAreaRiskFactorsCard
            location={location}
            telemetry={telemetry}
            riskScore={riskScore}
          />
        </div>

        {/* Right Column (5 cols): AI Risk Score Card & Circular Gauge */}
        <div className="lg:col-span-5 flex flex-col">
          <MyAreaRiskScoreCard
            riskScore={riskScore}
            riskLevel={location.riskLevel || (riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 35 ? 'MODERATE' : 'LOW')}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. AIR QUALITY INDEX (AQI) - LOCATION SYNCED TELEMETRY */}
      {/* ========================================================================= */}
      <AqiCard location={location} variant="myarea" />

      {/* ========================================================================= */}
      {/* 4. COMPACT MY AREA NEWS GATEWAY */}
      {/* ========================================================================= */}
      <MyAreaNewsCard location={location} />

      {/* ========================================================================= */}
      {/* 5. LOCAL SMART INFRASTRUCTURE & SAFETY MESH (Habra, High Security, Lift, Cam) */}
      {/* ========================================================================= */}
      <MyAreaInfrastructureMesh location={location} riskScore={riskScore} />

      {/* ========================================================================= */}
      {/* 6. DESIGNATED EMERGENCY EVACUATION SHELTERS & RELIEF CAMPS */}
      {/* ========================================================================= */}
      <MyAreaSheltersCard location={location} />

      {/* ========================================================================= */}
      {/* 7. DISTRICT EMERGENCY FIRST RESPONDER MATRIX */}
      {/* ========================================================================= */}
      <MyAreaEmergencyContacts location={location} />
    </div>
  );
};
