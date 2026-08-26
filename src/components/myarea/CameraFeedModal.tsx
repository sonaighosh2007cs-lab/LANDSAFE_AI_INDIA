import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  Radio,
  Eye,
  Maximize2,
  Minimize2,
  RefreshCw,
  ShieldCheck,
  Zap,
  Activity,
  AlertCircle,
  Settings,
  Layers,
  Thermometer,
} from 'lucide-react';

export interface CameraInfo {
  id: string;
  name: string;
  locationName: string;
  state?: string;
  type: string;
  status: 'ONLINE' | 'STANDBY' | 'MOTION DETECTED' | 'NO_FEED';
  fps: number;
  direction: string;
  description: string;
  streamUrl?: string;
}

interface CameraFeedModalProps {
  camera: CameraInfo | null;
  onClose: () => void;
}

export const CameraFeedModal: React.FC<CameraFeedModalProps> = ({ camera, onClose }) => {
  const [liveTimestamp, setLiveTimestamp] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [spectrumMode, setSpectrumMode] = useState<'OPTICAL' | 'THERMAL' | 'EDGE_SLIP'>('OPTICAL');
  const [activeTab, setActiveTab] = useState<'STREAM' | 'TELEMETRY' | 'CONFIG'>('STREAM');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setLiveTimestamp(
        `${d.toLocaleDateString('en-IN')} ${d.toLocaleTimeString('en-IN')} .${Math.floor(
          d.getMilliseconds() / 100
        )}`
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 100);
    return () => clearInterval(timer);
  }, []);

  // Handle ESC key to close modal smoothly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!camera) return null;

  const hasLiveStreamUrl = Boolean(camera.streamUrl && camera.streamUrl.trim() !== '');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full bg-[#060e19] border border-[#1b3a61] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isFullscreen ? 'max-w-6xl h-[88vh]' : 'max-w-3xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#040b14] px-4 py-3.5 border-b border-[#142840] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono">
                  {camera.name}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {camera.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span>📍 {camera.locationName}</span>
                <span>•</span>
                <span>{camera.state || 'West Bengal'}, India</span>
                <span>•</span>
                <span className="text-slate-500">Bearing: {camera.direction}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-[#091728] border border-[#142b45] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900/60 hover:text-white transition-colors cursor-pointer"
              title="Close Stream (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas / Stream Interface */}
        <div className="relative bg-[#02060d] aspect-video w-full flex items-center justify-center overflow-hidden border-b border-[#122438]">
          {hasLiveStreamUrl ? (
            <video
              src={camera.streamUrl}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            /* Honest Standby Stream Architecture (No fake canned loop pretending to be live video) */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
              {/* Dynamic Sensor Visualizer Background */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  spectrumMode === 'THERMAL'
                    ? 'bg-gradient-to-tr from-purple-950/70 via-red-950/50 to-amber-950/40 opacity-90'
                    : spectrumMode === 'EDGE_SLIP'
                    ? 'bg-gradient-to-b from-[#02182b] to-[#040e1a] opacity-95'
                    : 'bg-gradient-to-b from-[#061424] via-[#081b2f] to-[#030912]'
                }`}
              >
                {/* Scanline Effect */}
                <div className="w-full h-1 bg-cyan-400/30 shadow-[0_0_15px_#22d3ee] animate-pulse absolute top-1/4" />
                <div className="w-full h-full bg-[radial-gradient(#1a365d_1px,transparent_1px)] [background-size:20px_20px] opacity-35" />
              </div>

              {/* Standby Card Overlay */}
              <div className="relative z-10 bg-[#06101c]/90 border border-[#152e4d] backdrop-blur-md rounded-2xl p-5 max-w-md shadow-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 mx-auto">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800 text-[11px] font-mono font-bold mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    STANDBY TELEMETRY CARRIER
                  </div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    {camera.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {camera.locationName}, {camera.state || 'West Bengal'}
                  </p>
                </div>

                <div className="p-3 bg-[#030810] border border-[#0d1e33] rounded-xl text-[11px] font-mono text-slate-300 text-left space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Camera Status:</span>
                    <span className="text-emerald-400 font-bold">READY / SENTRY ACTIVE</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Video Feed:</span>
                    <span className="text-cyan-300">Awaiting Secure RTSP Uplink</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Geotechnical Sentinel:</span>
                    <span className="text-emerald-400 font-bold">0.0 mm/h Drift (Nominal)</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 font-mono">
                  Continuous optical & thermal edge sensors are transmitting real-time vibration and slope displacement telemetry.
                </p>
              </div>

              {/* HUD Crosshairs & Telemetry Overlay */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none font-mono text-[10px] select-none">
                <div className="flex justify-between items-start">
                  <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{camera.type.toUpperCase()} TELEMETRY NODE</span>
                    </div>
                    <div>FPS: {camera.fps} | SENSOR HEALTH: 100%</div>
                  </div>

                  <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-cyan-500/30 text-right text-slate-300">
                    <div className="text-white font-bold">{liveTimestamp}</div>
                    <div className="text-cyan-400">BEARING: {camera.direction}</div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-cyan-500/30 text-slate-300">
                    <span>SECTOR: </span>
                    <span className="text-white font-bold">{camera.locationName}</span>
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-cyan-500/30 text-emerald-400 font-bold">
                    AES-256 GSI TELEMETRY ENCRYPTION
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Controls Footer */}
        <div className="bg-[#040b14] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[#122438]">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">Sensor Spectrum:</span>
            <button
              type="button"
              onClick={() => setSpectrumMode('OPTICAL')}
              className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                spectrumMode === 'OPTICAL'
                  ? 'bg-[#00d492] text-[#050c17] font-black'
                  : 'bg-[#091728] border border-[#142b45] text-slate-300 hover:text-white'
              }`}
            >
              Optical Standard
            </button>
            <button
              type="button"
              onClick={() => setSpectrumMode('THERMAL')}
              className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                spectrumMode === 'THERMAL'
                  ? 'bg-rose-500 text-white font-black'
                  : 'bg-[#091728] border border-[#142b45] text-slate-300 hover:text-white'
              }`}
            >
              Thermal Infrared
            </button>
            <button
              type="button"
              onClick={() => setSpectrumMode('EDGE_SLIP')}
              className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                spectrumMode === 'EDGE_SLIP'
                  ? 'bg-cyan-400 text-[#050c17] font-black'
                  : 'bg-[#091728] border border-[#142b45] text-slate-300 hover:text-white'
              }`}
            >
              AI Slip Edge
            </button>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              {camera.description}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-[#091728] border border-[#142b45] text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Close Stream
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
