import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  Camera,
  Layers,
  CheckCircle,
  AlertTriangle,
  Radio,
  Eye,
  Sliders,
  ChevronRight,
  Droplet,
  Power,
} from 'lucide-react';
import { UserLocation } from '../../types';
import { CameraFeedModal, CameraInfo } from './CameraFeedModal';

interface MyAreaInfrastructureMeshProps {
  location: UserLocation;
  riskScore: number;
}

export const MyAreaInfrastructureMesh: React.FC<MyAreaInfrastructureMeshProps> = ({
  location,
  riskScore,
}) => {
  const [selectedCamera, setSelectedCamera] = useState<CameraInfo | null>(null);
  const [isLiftInterlockActive, setIsLiftInterlockActive] = useState(true);
  const [isPerimeterArmed, setIsPerimeterArmed] = useState(true);

  const isCritical = riskScore >= 75;
  const isHigh = riskScore >= 50 && riskScore < 75;

  // Local camera mesh dynamically named for the selected location
  const localCameras: CameraInfo[] = [
    {
      id: 'cam-01',
      name: `${location.area} North Retaining Wall & Slope Incline Cam`,
      locationName: `${location.area} North Ridge Cut`,
      state: location.state,
      type: 'Optical + Thermal HD',
      status: isCritical ? 'MOTION DETECTED' : 'ONLINE',
      fps: 30,
      direction: '045° NE',
      description: 'Continuous optical slope edge monitoring covering upper colluvial mantle.',
    },
    {
      id: 'cam-02',
      name: `${location.district} Hairpin Ghat Access Corridor Cam`,
      locationName: `${location.district} Sector Bypass`,
      state: location.state,
      type: 'Thermal IR Night Cam',
      status: 'ONLINE',
      fps: 25,
      direction: '180° S',
      description: 'Thermal heat and moisture anomaly detection along arterial hillside switchbacks.',
    },
    {
      id: 'cam-03',
      name: `${location.area} Arterial Culvert & Drainage Runoff Cam`,
      locationName: `${location.area} Lower Basin`,
      state: location.state,
      type: 'Multispectral Optical Cam',
      status: 'ONLINE',
      fps: 30,
      direction: '270° W',
      description: 'Silt sedimentation and flash runoff rate tracking at municipal discharge basin.',
    },
    {
      id: 'cam-04',
      name: `${location.district} Emergency Relief Camp Perimeter Sentry`,
      locationName: `${location.district} Central Camp`,
      state: location.state,
      type: 'Optical HD Sentry',
      status: 'ONLINE',
      fps: 30,
      direction: '360° N',
      description: 'Staging ground ingress, emergency power generator, and helipad perimeter sentry.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Local Smart Infrastructure & Safety Mesh
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live Node Sync: {location.area}, {location.district}
        </span>
      </div>

      {/* Grid of 4 Key Infrastructure Monitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Habra / Local Area Profile & Municipal Ward Command */}
        <div className="bg-[#060e19] border border-[#14263c] rounded-2xl p-4 shadow-xl hover:border-[#1d3d63] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                LOCAL WARD PROFILE
              </span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>

            <h4 className="text-sm font-bold text-white mb-1 leading-snug">
              {location.area} Area Command
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              {location.district} District • {location.state}
            </p>

            <div className="space-y-1.5 text-[10px] font-mono bg-[#091626] p-2.5 rounded-xl border border-[#11243a] mb-3">
              <div className="flex justify-between">
                <span className="text-slate-400">WDMC Disaster Cell:</span>
                <span className="text-emerald-400 font-bold">OPERATIONAL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Local Vulnerability:</span>
                <span
                  className={`font-bold ${
                    isCritical ? 'text-rose-400' : isHigh ? 'text-orange-400' : 'text-emerald-400'
                  }`}
                >
                  {location.riskLevel || 'TIER 1'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nodal Duty Officer:</span>
                <span className="text-white font-bold">Insp. R. Sharma</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#10243a] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Control Room Fix</span>
            <span className="text-cyan-400 font-bold">
              {location.coordinates.lat.toFixed(2)}°N, {location.coordinates.lng.toFixed(2)}°E
            </span>
          </div>
        </div>

        {/* 2. High Security Skill & Perimeter Monitoring */}
        <div className="bg-[#060e19] border border-[#14263c] rounded-2xl p-4 shadow-xl hover:border-[#1d3d63] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  isPerimeterArmed
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                {isPerimeterArmed ? 'HIGH SECURITY ACTIVE' : 'PERIMETER STANDBY'}
              </span>
              <button
                type="button"
                onClick={() => setIsPerimeterArmed(!isPerimeterArmed)}
                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                title="Toggle Perimeter Sentinel"
              >
                <Power className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="text-sm font-bold text-white mb-1 leading-snug">
              Perimeter & Sentry Mesh
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Geotechnical Borehole & Perimeter Array
            </p>

            <div className="space-y-1.5 text-[10px] font-mono bg-[#091626] p-2.5 rounded-xl border border-[#11243a] mb-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Piezometer Array:</span>
                <span className="text-emerald-400 font-bold">8/8 Online (100%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Micro-Seismic Geophones:</span>
                <span className="text-cyan-400 font-bold">0.14 Hz (Nominal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Intrusion/Rockfall Sentry:</span>
                <span className="text-emerald-400 font-bold">SECURED</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#10243a] flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Skill Engine</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              ISO 22301 Certified
            </span>
          </div>
        </div>

        {/* 3. Smart Lift / Elevator Seismic Telemetry */}
        <div className="bg-[#060e19] border border-[#14263c] rounded-2xl p-4 shadow-xl hover:border-[#1d3d63] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  isLiftInterlockActive
                    ? 'bg-purple-950/80 text-purple-300 border-purple-800'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                SMART LIFT INTERLOCK
              </span>
              <button
                type="button"
                onClick={() => setIsLiftInterlockActive(!isLiftInterlockActive)}
                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                title="Toggle Seismic Brake Interlock"
              >
                <Power className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="text-sm font-bold text-white mb-1 leading-snug">
              Vertical Transit Interlock
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Seismic Hoist & Hydraulic Auto-Park
            </p>

            <div className="space-y-1.5 text-[10px] font-mono bg-[#091626] p-2.5 rounded-xl border border-[#11243a] mb-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Seismic Brake Safety:</span>
                <span className="text-purple-400 font-bold">ARMED & READY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tremor Auto-Park:</span>
                <span className="text-white font-bold">&gt;2.5 Richter (Level 1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Diagnostic Check:</span>
                <span className="text-emerald-400 font-bold">PASSED (2m ago)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#10243a] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Shaft Status</span>
            <span className="text-purple-400 font-bold">Nominal Level 0</span>
          </div>
        </div>

        {/* 4. Culvert & Drainage Silt Sensor */}
        <div className="bg-[#060e19] border border-[#14263c] rounded-2xl p-4 shadow-xl hover:border-[#1d3d63] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800">
                DRAINAGE TELEMETRY
              </span>
              <Droplet className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
            </div>

            <h4 className="text-sm font-bold text-white mb-1 leading-snug">
              Arterial Culvert Flow
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Stormwater & Debris Silt Sensor
            </p>

            <div className="space-y-1.5 text-[10px] font-mono bg-[#091626] p-2.5 rounded-xl border border-[#11243a] mb-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Flow Throughput:</span>
                <span className="text-sky-400 font-bold">42 L/s (Normal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Silt Sediment Level:</span>
                <span className="text-white font-bold">14% (Cleared)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hydraulic Choke:</span>
                <span className="text-emerald-400 font-bold">ZERO BLOCKAGE</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#10243a] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Siphon Culverts</span>
            <span className="text-sky-400 font-bold">Auto-Flushed</span>
          </div>
        </div>
      </div>

      {/* Local CCTV / Slope Cam Mesh Grid */}
      <div className="bg-[#060e19] border border-[#14263c] rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#10243a]">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#00d492]" />
            <h4 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
              Live Optical & Thermal Slope Cameras ({location.area} Sector)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Click any camera to launch stream HUD
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {localCameras.map((cam) => (
            <button
              key={cam.id}
              type="button"
              onClick={() => setSelectedCamera(cam)}
              className="group text-left bg-[#091626] border border-[#12243a] hover:border-[#00d492] rounded-xl p-3 transition-all cursor-pointer hover:scale-[1.02] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/50 text-cyan-300 border border-cyan-800/60">
                    {cam.type}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                </div>

                <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-1 mb-1">
                  {cam.name}
                </h5>
                <p className="text-[10px] text-slate-400 font-mono mb-2">
                  {cam.locationName}
                </p>
              </div>

              <div className="pt-2 border-t border-[#12243a] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-slate-500">FPS: {cam.fps}</span>
                <span className="text-cyan-400 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <Eye className="w-3 h-3" />
                  View Stream
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Camera Live Modal */}
      <CameraFeedModal camera={selectedCamera} onClose={() => setSelectedCamera(null)} />
    </div>
  );
};
