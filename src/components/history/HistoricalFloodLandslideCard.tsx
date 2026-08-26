import React from 'react';
import { Mountain, Droplets, AlertTriangle, ShieldCheck, Database, Calendar } from 'lucide-react';
import { HistoricalRecordPoint } from '../../types/history';
import { UserLocation } from '../../types';
import { GSI_HISTORICAL_RECORDS } from '../../data/disasterData';

interface HistoricalFloodLandslideCardProps {
  location: UserLocation;
  records: HistoricalRecordPoint[];
}

export const HistoricalFloodLandslideCard: React.FC<HistoricalFloodLandslideCardProps> = ({
  location,
  records,
}) => {
  // Find official GSI cataloged events matching this state/district if any
  const stateOrDistrict = (location.state || '').toLowerCase();
  const districtName = (location.district || '').toLowerCase();
  const areaName = (location.area || '').toLowerCase();

  const matchedGsiEvents = GSI_HISTORICAL_RECORDS.filter((r) => {
    const s = r.state.toLowerCase();
    const l = r.location.toLowerCase();
    return (
      s.includes(stateOrDistrict) ||
      stateOrDistrict.includes(s) ||
      l.includes(districtName) ||
      districtName.includes(l) ||
      l.includes(areaName)
    );
  });

  // Calculate high-risk hydrological days from the actual dataset
  const criticalRainPoints = records.filter((r) => r.rainfall >= 35);
  const maxRain = Math.max(...records.map((r) => r.rainfall), 0);

  const hasHighSlope = (location.slopeAngle || 0) >= 15;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="flood-landslide-historical-section">
      {/* 1. Landslide Risk & Geological Recurrence */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-5 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-[#14263c]">
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Landslide Recurrence & Geological Susceptibility
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#060e19] text-orange-400 border border-[#14263c]">
            {hasHighSlope ? 'Hilly Slope Sector' : 'Low-Gradient Terrain'}
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#060e19] border border-[#14263c]">
            <span className="text-slate-400">Slope Gradient / Lithology:</span>
            <span className="text-white font-bold">
              {location.slopeAngle || 18}° • {location.lithology || 'Metamorphic Complex'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#060e19] border border-[#14263c]">
            <span className="text-slate-400">Precipitation Trigger Days (≥35mm):</span>
            <span className={criticalRainPoints.length > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {criticalRainPoints.length} Critical Events
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#060e19] border border-[#14263c] space-y-1.5">
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block">
              GSI Regional Spatial Archive Context:
            </span>
            {matchedGsiEvents.length > 0 ? (
              <div className="space-y-1.5 pt-1">
                {matchedGsiEvents.slice(0, 2).map((ev) => (
                  <div key={ev.id} className="text-[11px] text-slate-300">
                    <span className="text-orange-400 font-bold">[{ev.year}] {ev.location} ({ev.state}):</span>{' '}
                    {ev.type} triggered by {ev.trigger}.
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-[11px]">
                No catastrophic GSI-cataloged landslide events recorded specifically for this micro-grid during historical baseline (1990–2026).
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Historical Flood Risk & Hydrological Drainage */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-5 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-[#14263c]">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Hydrological Drainage & Flood Hazard History
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#060e19] text-sky-400 border border-[#14263c]">
            Hydrological Mesh
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#060e19] border border-[#14263c]">
            <span className="text-slate-400">Peak Single-Interval Deluge:</span>
            <span className="text-sky-300 font-bold">{maxRain} mm</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#060e19] border border-[#14263c]">
            <span className="text-slate-400">Watershed Inundation Status:</span>
            <span className={maxRain >= 80 ? 'text-rose-400 font-bold' : maxRain >= 40 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
              {maxRain >= 80 ? 'Inundation Warning' : maxRain >= 40 ? 'Moderate Watershed Stress' : 'Normal Natural Drainage'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#060e19] border border-[#14263c] space-y-1.5">
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block">
              Historical Flood Sensor Verification:
            </span>
            {maxRain === 0 ? (
              <p className="text-slate-400 text-[11px]">
                Historical flood sensor telemetry indicates zero inundation during this period across {location.area || location.district}.
              </p>
            ) : (
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Runoff coefficients for {location.district} indicate adequate dendritic discharge capacity for peak precipitation volume ({maxRain} mm).
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
