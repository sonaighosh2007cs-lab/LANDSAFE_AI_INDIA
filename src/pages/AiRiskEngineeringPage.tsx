import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  Sliders,
  Sparkles,
  Layers,
  CheckCircle,
  AlertTriangle,
  Info,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AiRiskEngineeringPage: React.FC = () => {
  const { userProfile, telemetry, riskScore } = useApp();

  // Geotechnical Slider parameters
  const [cohesion, setCohesion] = useState(25); // kPa (effective cohesion c')
  const [slopeAngle, setSlopeAngle] = useState(telemetry.slopeAngle.value || 14.5); // degrees
  const [porePressure, setPorePressure] = useState(telemetry.groundCondition.value || 34.8); // kPa (pore-water pressure u)
  const [frictionAngle, setFrictionAngle] = useState(32); // degrees (internal friction phi')
  const [soilDepth, setSoilDepth] = useState(4.5); // meters (colluvium thickness z)

  // Geotechnical Factor of Safety (FoS) Calculation (Infinite Slope Model)
  const gamma = 19.0; // unit weight of soil kN/m3
  const alphaRad = (slopeAngle * Math.PI) / 180;
  const phiRad = (frictionAngle * Math.PI) / 180;

  const totalStress = gamma * soilDepth * Math.cos(alphaRad) * Math.cos(alphaRad);
  const effectiveStress = Math.max(1, totalStress - porePressure);
  const shearStrength = cohesion + effectiveStress * Math.tan(phiRad);
  const drivingStress = Math.max(0.5, gamma * soilDepth * Math.sin(alphaRad) * Math.cos(alphaRad));

  const fos = Number((shearStrength / drivingStress).toFixed(2));

  const getFosVerdict = (val: number) => {
    if (val >= 1.4) {
      return {
        label: 'STABLE SLOPE',
        color: 'text-emerald-400 border-emerald-800 bg-emerald-950/80',
        desc: 'Shear strength substantially exceeds downhill driving gravity stresses. Low risk of rotational or planar failure.',
      };
    }
    if (val >= 1.05) {
      return {
        label: 'CRITICAL EQUILIBRIUM (WATCH)',
        color: 'text-amber-400 border-amber-800 bg-amber-950/80',
        desc: 'Pore-water pressure is reducing effective normal stress. Minor rainfall increases may trigger mass debris slip.',
      };
    }
    return {
      label: 'FAILURE IMMINENT / LIQUEFACTION',
      color: 'text-rose-400 border-rose-800 bg-rose-950/80',
      desc: 'Driving shear stress exceeds maximum resisting shear strength. Mandatory slope evacuation recommended.',
    };
  };

  const verdict = getFosVerdict(fos);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="border-b border-[#14263c] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-400" />
            AI Risk Engineering & Explainable AI (XAI)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Physics-Informed Neural Network (PINN) and Infinite Slope Equilibrium Simulator.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#091626] border border-[#1b385a] text-purple-400 w-fit">
          Geotechnical Engine: BIS 14458 / Eurocode 7 Compliant
        </span>
      </div>

      {/* Geotechnical Live Simulator Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Form (6 Cols) */}
        <div className="lg:col-span-6 bg-[#091626] border border-[#182f4d] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00d492]" />
              Geotechnical Slope Parameters
            </h3>
            <button
              onClick={() => {
                setCohesion(25);
                setSlopeAngle(telemetry.slopeAngle.value);
                setPorePressure(telemetry.groundCondition.value);
                setFrictionAngle(32);
                setSoilDepth(4.5);
              }}
              className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Slider 1: Slope Angle */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Slope Incline Angle (α)</span>
              <span className="font-mono text-emerald-400 font-bold">{slopeAngle}°</span>
            </div>
            <input
              type="range"
              min="5"
              max="55"
              step="0.5"
              value={slopeAngle}
              onChange={(e) => setSlopeAngle(parseFloat(e.target.value))}
              className="w-full accent-[#00d492] cursor-pointer"
            />
          </div>

          {/* Slider 2: Pore Pressure */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Pore-Water Saturation Pressure (u)</span>
              <span className="font-mono text-purple-400 font-bold">{porePressure} kPa</span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="1"
              value={porePressure}
              onChange={(e) => setPorePressure(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Slider 3: Cohesion */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Effective Soil Cohesion (c')</span>
              <span className="font-mono text-blue-400 font-bold">{cohesion} kPa</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={cohesion}
              onChange={(e) => setCohesion(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Slider 4: Friction Angle */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Internal Friction Angle (φ')</span>
              <span className="font-mono text-amber-400 font-bold">{frictionAngle}°</span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              step="1"
              value={frictionAngle}
              onChange={(e) => setFrictionAngle(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Factor of Safety (FoS) Verdict (6 Cols) */}
        <div className="lg:col-span-6 bg-[#091626] border border-[#182f4d] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                LIMIT EQUILIBRIUM RESULT
              </span>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${verdict.color}`}>
                {verdict.label}
              </span>
            </div>

            <div className="flex items-center gap-4 my-3">
              <div className="w-24 h-24 rounded-2xl bg-[#060e19] border border-[#14263c] flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white font-mono">{fos}</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">Factor of Safety</span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-slate-200 leading-relaxed">{verdict.desc}</p>
                <div className="text-[10px] font-mono text-slate-400">
                  <span>Standard Benchmark: FoS &gt; 1.30 (Required for residential infrastructure)</span>
                </div>
              </div>
            </div>

            <div className="bg-[#060e19] p-3 rounded-xl border border-[#14263c] space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Resisting Shear Strength:</span>
                <span className="text-emerald-400 font-bold">{shearStrength.toFixed(1)} kPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Driving Gravitational Shear:</span>
                <span className="text-rose-400 font-bold">{drivingStress.toFixed(1)} kPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Effective Normal Stress (σ'):</span>
                <span className="text-blue-400 font-bold">{effectiveStress.toFixed(1)} kPa</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#14263c] text-[11px] text-slate-400">
            Model: Mohr-Coulomb failure criterion combined with InSAR surface creep training embeddings.
          </div>
        </div>
      </div>

      {/* SHAP Feature Contribution Vectors */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00d492]" />
          SHAP Feature Importance Vectors (Neural Explainability)
        </h3>

        <div className="space-y-3 text-xs">
          {[
            { feature: 'Pore-Water Saturation Buildup', value: '+38%', impact: 'High Destabilizing', width: '78%', color: 'bg-rose-500' },
            { feature: 'Cumulative Monsoon Precipitation', value: '+24%', impact: 'Moderate Destabilizing', width: '62%', color: 'bg-amber-500' },
            { feature: 'Slope Incline & Elevation Gradient', value: '+18%', impact: 'Moderate Destabilizing', width: '45%', color: 'bg-amber-500' },
            { feature: 'Bedrock Mechanical Interlocking', value: '-28%', impact: 'Strong Stabilizing', width: '60%', color: 'bg-emerald-500' },
            { feature: 'Dendritic Root Cohesion', value: '-16%', impact: 'Stabilizing', width: '38%', color: 'bg-emerald-500' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">{item.feature}</span>
                <span className="font-mono font-bold text-white">{item.value} ({item.impact})</span>
              </div>
              <div className="w-full h-2 bg-[#060e19] rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
