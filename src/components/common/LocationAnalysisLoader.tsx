import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Radio, ShieldAlert, Cpu, CheckCircle2, Satellite, Activity } from 'lucide-react';

interface LocationAnalysisLoaderProps {
  locationName: string;
  onComplete?: () => void;
}

export const LocationAnalysisLoader: React.FC<LocationAnalysisLoaderProps> = ({
  locationName,
  onComplete,
}) => {
  const [progress, setProgress] = useState(15);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const p1 = setTimeout(() => {
      setProgress(45);
      setStage(1);
    }, 200);

    const p2 = setTimeout(() => {
      setProgress(78);
      setStage(2);
    }, 450);

    const p3 = setTimeout(() => {
      setProgress(100);
      setStage(3);
    }, 700);

    const finish = setTimeout(() => {
      if (onComplete) onComplete();
    }, 850);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(finish);
    };
  }, [onComplete]);

  const checklistItems = [
    { title: 'Connecting to GSI National Geological Hazard Mesh', done: stage >= 1 },
    { title: 'Ingesting IMD Doppler Radar Precipitation & Soil Saturation', done: stage >= 2 },
    { title: 'Calculating Slope Factor of Safety & Pore-Water Index', done: stage >= 3 },
    { title: 'Calibrating Deep Neural Network Risk Model (98% Conf)', done: stage >= 3 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050b14]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#091524] border border-[#1b385a] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Animated Background Scanner Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-emerald-500/10 animate-ping pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-teal-500/20 animate-pulse pointer-events-none" />

        {/* Central Satellite / Radar Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-[#00d492] mb-5 shadow-lg shadow-emerald-950/60">
          <Satellite className="w-8 h-8 animate-pulse text-[#00d492]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Status Headings */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 uppercase mb-2">
          <Radio className="w-3 h-3 animate-spin" />
          <span>INITIALIZING LANDSCAPE AI ENGINE</span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mb-1">
          Analyzing Monitoring Sector
        </h3>

        <p className="text-xs sm:text-sm text-[#00d492] font-semibold mb-6 font-mono truncate">
          📍 {locationName || 'Indian Geotechnical Sector'}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#06101c] rounded-full overflow-hidden border border-[#162d47] mb-6">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-[#00d492]"
            initial={{ width: '10%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Checklist */}
        <div className="space-y-2.5 text-left bg-[#071322] border border-[#142840] rounded-xl p-3.5 mb-2">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs">
              {item.done ? (
                <CheckCircle2 className="w-4 h-4 text-[#00d492] shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                </div>
              )}
              <span className={item.done ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                {item.title}
              </span>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-slate-400 font-mono mt-4 flex items-center justify-between">
          <span>NDMA • GSI Framework</span>
          <span className="text-emerald-400 font-bold">{progress}% Complete</span>
        </div>
      </div>
    </div>
  );
};
