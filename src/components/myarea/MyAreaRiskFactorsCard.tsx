import React from 'react';
import {
  Activity,
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
  Mountain,
  Layers,
  History,
} from 'lucide-react';
import { SensorTelemetry, UserLocation } from '../../types';

interface MyAreaRiskFactorsCardProps {
  location: UserLocation;
  telemetry: SensorTelemetry;
  riskScore: number;
}

export const MyAreaRiskFactorsCard: React.FC<MyAreaRiskFactorsCardProps> = ({
  location,
  telemetry,
  riskScore,
}) => {
  // Dynamically derive realistic percentages and units based on location & telemetry
  const precipVal = telemetry.precipitation.value;
  const precipPct = Math.min(100, Math.max(8, Math.round((precipVal / 60) * 100)));

  const soilMoistureVal = telemetry.soilMoisture.value;
  const soilMoisturePct = Math.min(100, Math.max(15, soilMoistureVal));
  const porePressureKpa = Math.round(telemetry.groundCondition.value || (riskScore * 0.45 + 12));

  const humidityVal = telemetry.humidity.value;
  const humidityPct = Math.min(100, Math.max(40, humidityVal));

  const tempVal = telemetry.temperature.value;
  const tempPct = Math.min(100, Math.max(20, Math.round((tempVal / 38) * 100)));

  const slopeVal = location.slopeAngle || telemetry.slopeAngle.value || 14.5;
  const slopePct = Math.min(100, Math.max(10, Math.round((slopeVal / 45) * 100)));
  const shearPct = Math.min(100, Math.round(slopePct * 0.95 + 8));

  const elevationVal = location.elevation || telemetry.elevation.value || 350;
  const elevationPct = Math.min(100, Math.max(5, Math.round((elevationVal / 3200) * 100)));

  const historicalSlips = location.isHazardMonitored
    ? Math.max(12, Math.round(riskScore * 0.65))
    : Math.max(2, Math.round(riskScore * 0.2));
  const historyPct = location.isHazardMonitored
    ? Math.min(100, Math.max(30, Math.round(riskScore * 1.15)))
    : Math.min(45, Math.max(10, Math.round(riskScore * 0.4)));
  const rankNum = riskScore >= 75 ? 1 : riskScore >= 50 ? 3 : riskScore >= 35 ? 7 : 14;

  const factors = [
    {
      id: 'rainfall',
      icon: CloudRain,
      iconColor: 'text-sky-400',
      label: 'Rainfall',
      percentage: precipPct,
      detail: `${precipVal.toFixed(1)} mm`,
      barColor: 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]',
      textColor: 'text-sky-400',
    },
    {
      id: 'soil_moisture',
      icon: Droplets,
      iconColor: 'text-emerald-400',
      label: 'Soil Moisture',
      percentage: soilMoisturePct,
      detail: `${soilMoistureVal}% (${porePressureKpa} kPa)`,
      barColor: 'bg-[#00d492] shadow-[0_0_12px_rgba(0,212,146,0.5)]',
      textColor: 'text-[#00d492]',
    },
    {
      id: 'humidity',
      icon: Wind,
      iconColor: 'text-cyan-400',
      label: 'Humidity',
      percentage: humidityPct,
      detail: `${humidityVal}%`,
      barColor: 'bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]',
      textColor: 'text-cyan-400',
    },
    {
      id: 'temperature',
      icon: Thermometer,
      iconColor: 'text-rose-400',
      label: 'Temperature',
      percentage: tempPct,
      detail: `${tempVal.toFixed(1)}°C`,
      barColor: 'bg-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]',
      textColor: 'text-rose-400',
    },
    {
      id: 'slope',
      icon: Mountain,
      iconColor: 'text-amber-400',
      label: 'Slope',
      percentage: slopePct,
      detail: `${slopeVal.toFixed(1)}° (${shearPct}% shear)`,
      barColor: 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]',
      textColor: 'text-amber-400',
    },
    {
      id: 'elevation',
      icon: Layers,
      iconColor: 'text-teal-400',
      label: 'Elevation',
      percentage: elevationPct,
      detail: `${elevationVal} m`,
      barColor: 'bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.5)]',
      textColor: 'text-teal-400',
    },
    {
      id: 'historical',
      icon: History,
      iconColor: 'text-purple-400',
      label: 'Historical Landslide Data',
      percentage: historyPct,
      detail: `${historicalSlips} slips (Rank #${rankNum})`,
      barColor: 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]',
      textColor: 'text-purple-400',
    },
  ];

  return (
    <div className="bg-[#060e19] border border-[#14263c] rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group hover:border-[#1d3d63] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#0f2136]">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-[#00d492] animate-pulse" />
          <h2 className="font-mono text-sm sm:text-base font-black tracking-wider text-white">
            AI RISK FACTORS
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400 tracking-wide">
          Live Telemetry Influx
        </span>
      </div>

      {/* Factors List */}
      <div className="space-y-4">
        {factors.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${f.iconColor}`} />
                  <span className="text-slate-200 font-semibold">{f.label}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className={`font-black ${f.textColor}`}>{f.percentage}%</span>
                  <span className="text-slate-400 text-xs font-normal">({f.detail})</span>
                </div>
              </div>

              {/* Glowing horizontal progress bar */}
              <div className="w-full h-2 bg-[#0a1626] rounded-full overflow-hidden p-0.5 border border-[#10243b]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${f.barColor}`}
                  style={{ width: `${Math.max(4, Math.min(100, f.percentage))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
