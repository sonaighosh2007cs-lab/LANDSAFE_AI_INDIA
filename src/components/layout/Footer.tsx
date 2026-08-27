import React from 'react';
import {
  Shield,
  Radio,
  FileText,
  PhoneCall,
  ExternalLink,
  CheckCircle,
  Globe,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveRoute } = useApp();

  return (
    <footer className="w-full border-t border-white/10 bg-[#0e0e10] text-gray-400 text-xs py-8 px-4 sm:px-8 mt-12 z-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Grid: Compliance badges and Authority affiliations */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-white/5">
          <div className="bg-[#121214] border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-xs font-mono">
              GSI
            </div>
            <div>
              <p className="text-[11px] font-bold text-white leading-tight">Geological Survey</p>
              <p className="text-[10px] text-gray-400">Landslide Hazard Data</p>
            </div>
          </div>

          <div className="bg-[#121214] border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-xs font-mono">
              IMD
            </div>
            <div>
              <p className="text-[11px] font-bold text-white leading-tight">Meteorological Dept</p>
              <p className="text-[10px] text-gray-400">Doppler Radar Feeds</p>
            </div>
          </div>

          <div className="bg-[#121214] border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs font-mono">
              NDMA
            </div>
            <div>
              <p className="text-[11px] font-bold text-white leading-tight">Disaster Management</p>
              <p className="text-[10px] text-gray-400">National Early Warning</p>
            </div>
          </div>

          <div className="bg-[#121214] border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xs font-mono">
              BRO
            </div>
            <div>
              <p className="text-[11px] font-bold text-white leading-tight">Border Roads Org</p>
              <p className="text-[10px] text-gray-400">Ghat Corridor Clearance</p>
            </div>
          </div>
        </div>

        {/* Middle row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-white font-bold">LandSafe AI • India Disaster Network</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">Continuous 24/7 Geotechnical Sensor Mesh</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveRoute('gsi-historical-analysis')}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              GSI Records
            </button>
            <button
              onClick={() => setActiveRoute('data-pipelines')}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Sensor Telemetry Health
            </button>
          </div>
        </div>

        {/* Emergency helpline banner */}
        <div className="bg-[#121214] border border-white/5 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-300 gap-2">
          <span className="flex items-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-red-400" />
            <span className="text-white font-semibold">24x7 India Disaster Helplines:</span>
            <span>NDMA: 112 / 1078 • District Emergency: 1077 • SDRF: 1070</span>
          </span>
          <span className="font-mono text-[10px] text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded border border-green-500/20">
            SYSTEM HEALTH: OPTIMAL (100% NODES ONLINE)
          </span>
        </div>
      </div>
    </footer>
  );
};
