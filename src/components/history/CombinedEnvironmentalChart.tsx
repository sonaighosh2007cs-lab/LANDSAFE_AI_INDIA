import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Layers, Thermometer, Droplets, Wind, ShieldAlert } from 'lucide-react';
import { HistoricalRecordPoint } from '../../types/history';

interface CombinedEnvironmentalChartProps {
  records: HistoricalRecordPoint[];
  locationName: string;
}

export const CombinedEnvironmentalChart: React.FC<CombinedEnvironmentalChartProps> = ({
  records,
  locationName,
}) => {
  const [activeMetrics, setActiveMetrics] = useState<{
    temperature: boolean;
    humidity: boolean;
    aqi: boolean;
    risk: boolean;
  }>({
    temperature: true,
    humidity: true,
    aqi: true,
    risk: true,
  });

  if (!records || records.length === 0) return null;

  const toggleMetric = (key: keyof typeof activeMetrics) => {
    setActiveMetrics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: HistoricalRecordPoint = payload[0].payload;
      return (
        <div className="bg-[#060e19] border border-[#1b385a] p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1.5 min-w-[210px] z-50">
          <div className="flex items-center justify-between border-b border-[#14263c] pb-1.5">
            <span className="text-cyan-400 font-bold">{data.displayTime}</span>
            <span className="text-[10px] text-slate-400">{data.dateOnly}</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            <span className="text-slate-500">Location:</span> {locationName}
          </p>
          <div className="space-y-1 pt-1 text-[11px]">
            {activeMetrics.temperature && (
              <div className="flex items-center justify-between">
                <span className="text-amber-400">Temperature:</span>
                <span className="text-white font-bold">{data.temperature}°C</span>
              </div>
            )}
            {activeMetrics.humidity && (
              <div className="flex items-center justify-between">
                <span className="text-cyan-400">Humidity:</span>
                <span className="text-white font-bold">{data.humidity}%</span>
              </div>
            )}
            {activeMetrics.aqi && (
              <div className="flex items-center justify-between">
                <span className="text-emerald-400">AQI Index:</span>
                <span className="text-white font-bold">{data.aqi}</span>
              </div>
            )}
            {activeMetrics.risk && (
              <div className="flex items-center justify-between">
                <span className="text-orange-400">LandSafe AI Risk:</span>
                <span className="text-white font-bold">{data.riskScore}/100</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-[#14263c]">
              <span>Precipitation:</span>
              <span className="text-sky-300 font-bold">{data.rainfall} mm</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4" id="chart-combined-environmental">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#14263c]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Synchronized Multi-Vector Environmental Matrix
            </h3>
            <p className="text-[11px] text-slate-400">
              Correlated telemetry comparing Thermal, Moisture, Air Quality, and Geotechnical Risk
            </p>
          </div>
        </div>

        {/* Metric Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => toggleMetric('temperature')}
            className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
              activeMetrics.temperature
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[#060e19] text-slate-500 border-[#14263c]'
            }`}
          >
            Temp (°C)
          </button>
          <button
            onClick={() => toggleMetric('humidity')}
            className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
              activeMetrics.humidity
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-[#060e19] text-slate-500 border-[#14263c]'
            }`}
          >
            Humidity (%)
          </button>
          <button
            onClick={() => toggleMetric('aqi')}
            className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
              activeMetrics.aqi
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-[#060e19] text-slate-500 border-[#14263c]'
            }`}
          >
            AQI
          </button>
          <button
            onClick={() => toggleMetric('risk')}
            className={`px-2 py-1 rounded-lg border transition-all cursor-pointer ${
              activeMetrics.risk
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                : 'bg-[#060e19] text-slate-500 border-[#14263c]'
            }`}
          >
            Risk
          </button>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={records} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#14263c" vertical={false} />
            <XAxis
              dataKey="displayTime"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1b385a' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1b385a' }}
            />
            <Tooltip content={<CustomTooltip />} />

            {activeMetrics.temperature && (
              <Line
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            )}
            {activeMetrics.humidity && (
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
              />
            )}
            {activeMetrics.aqi && (
              <Line
                type="monotone"
                dataKey="aqi"
                name="Air Quality Index"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            )}
            {activeMetrics.risk && (
              <Line
                type="monotone"
                dataKey="riskScore"
                name="LandSafe AI Risk"
                stroke="#ea580c"
                strokeWidth={2.5}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-[#14263c]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-amber-500" />
            <span>Temp (°C)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-cyan-500" />
            <span>Humidity (%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-emerald-500" />
            <span>AQI</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-orange-500" />
            <span>Risk Score</span>
          </span>
        </div>
        <span>Real-time normalized cross-comparison</span>
      </div>
    </div>
  );
};
