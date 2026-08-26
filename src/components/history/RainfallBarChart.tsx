import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { CloudRain, Droplets } from 'lucide-react';
import { HistoricalRecordPoint } from '../../types/history';

interface RainfallBarChartProps {
  records: HistoricalRecordPoint[];
  locationName: string;
}

export const RainfallBarChart: React.FC<RainfallBarChartProps> = ({ records, locationName }) => {
  if (!records || records.length === 0) return null;

  const rains = records.map((r) => r.rainfall);
  const totalRain = Math.round(rains.reduce((a, b) => a + b, 0) * 10) / 10;
  const maxRain = Math.max(10, Math.ceil((Math.max(...rains) + 5) / 5) * 5);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: HistoricalRecordPoint = payload[0].payload;
      return (
        <div className="bg-[#060e19] border border-[#1b385a] p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1.5 min-w-[200px] z-50">
          <div className="flex items-center justify-between border-b border-[#14263c] pb-1.5">
            <span className="text-sky-400 font-bold">{data.displayTime}</span>
            <span className="text-[10px] text-slate-400">{data.dateOnly}</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            <span className="text-slate-500">Location:</span> {locationName}
          </p>
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-sky-400 font-bold">Precipitation:</span>
              <span className="text-white font-bold text-sm">{data.rainfall} mm</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Weather:</span>
              <span className="text-slate-200">{data.weatherCondition.description}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Humidity:</span>
              <span className="text-slate-200">{data.humidity}%</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Hydrological Impact:</span>
              <span className={data.rainfall > 35 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                {data.rainfall > 50 ? 'Severe Infiltration' : data.rainfall > 20 ? 'Moderate Saturation' : 'Baseline'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4" id="chart-rainfall-trend">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#14263c]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Precipitation & Rainfall Distribution
            </h3>
            <p className="text-[11px] text-slate-400">
              IMD Doppler radar & rain gauge volumetric accumulation in millimeters (mm)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-[#060e19] border border-[#14263c] text-slate-300">
            Total Rain: <strong className="text-sky-400">{totalRain} mm</strong>
          </span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={records} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#14263c" vertical={false} />
            <XAxis
              dataKey="displayTime"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1b385a' }}
            />
            <YAxis
              domain={[0, maxRain]}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1b385a' }}
              tickFormatter={(v) => `${v}mm`}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Warning trigger line for high rainfall */}
            <ReferenceLine
              y={35}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: 'Pore Saturation Trigger (35mm)', fill: '#f87171', fontSize: 10, position: 'top' }}
            />
            <Bar
              dataKey="rainfall"
              fill="#38bdf8"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-[#14263c]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
            <span>Rainfall Accumulation</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500" />
            <span>Landslide Pore Trigger (35mm)</span>
          </span>
        </div>
        <span>Total Records: {records.length}</span>
      </div>
    </div>
  );
};
