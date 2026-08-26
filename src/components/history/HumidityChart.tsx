import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Droplets } from 'lucide-react';
import { HistoricalRecordPoint } from '../../types/history';

interface HumidityChartProps {
  records: HistoricalRecordPoint[];
  locationName: string;
}

export const HumidityChart: React.FC<HumidityChartProps> = ({ records, locationName }) => {
  if (!records || records.length === 0) return null;

  const humidities = records.map((r) => r.humidity);
  const avgHumidity = Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: HistoricalRecordPoint = payload[0].payload;
      return (
        <div className="bg-[#060e19] border border-[#1b385a] p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1.5 min-w-[200px] z-50">
          <div className="flex items-center justify-between border-b border-[#14263c] pb-1.5">
            <span className="text-cyan-400 font-bold">{data.displayTime}</span>
            <span className="text-[10px] text-slate-400">{data.dateOnly}</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            <span className="text-slate-500">Location:</span> {locationName}
          </p>
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold">Relative Humidity:</span>
              <span className="text-white font-bold text-sm">{data.humidity}%</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Moisture Level:</span>
              <span className={data.humidity >= 85 ? 'text-cyan-300 font-bold' : 'text-slate-200'}>
                {data.humidity >= 85 ? 'Saturated Atmospheric Vapor' : data.humidity >= 60 ? 'Moderate Humidity' : 'Dry'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Temperature:</span>
              <span className="text-slate-200">{data.temperature}°C</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4" id="chart-humidity-trend">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#14263c]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Atmospheric Moisture & Humidity History
            </h3>
            <p className="text-[11px] text-slate-400">
              Relative humidity (%) sensor telemetry and pore vapor saturation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-[#060e19] border border-[#14263c] text-slate-300">
            Mean Humidity: <strong className="text-cyan-400">{avgHumidity}%</strong>
          </span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={records} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#14263c" vertical={false} />
            <XAxis
              dataKey="displayTime"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1b385a' }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1b385a' }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={avgHumidity} stroke="#06b6d4" strokeDasharray="4 4" strokeOpacity={0.6} />
            <Area
              type="monotone"
              dataKey="humidity"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#humidityGradient)"
              dot={{ r: records.length > 35 ? 0 : 3, fill: '#06b6d4', strokeWidth: 1, stroke: '#091626' }}
              activeDot={{ r: 6, fill: '#22d3ee', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-[#14263c]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span>Relative Humidity (%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-cyan-400" />
            <span>Average ({avgHumidity}%)</span>
          </span>
        </div>
        <span>Span: {records.length} readings</span>
      </div>
    </div>
  );
};
