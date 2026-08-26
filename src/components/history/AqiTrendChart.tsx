import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { Wind, Activity, Layers } from 'lucide-react';
import { HistoricalRecordPoint } from '../../types/history';

interface AqiTrendChartProps {
  records: HistoricalRecordPoint[];
  locationName: string;
}

export const AqiTrendChart: React.FC<AqiTrendChartProps> = ({ records, locationName }) => {
  const [showPollutants, setShowPollutants] = useState<boolean>(false);

  if (!records || records.length === 0) return null;

  const aqis = records.map((r) => r.aqi);
  const maxAqi = Math.max(250, Math.ceil((Math.max(...aqis) + 25) / 50) * 50);
  const avgAqi = Math.round(aqis.reduce((a, b) => a + b, 0) / aqis.length);

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
            <span className="text-slate-500">Sector:</span> {locationName}
          </p>
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold">AQI Index:</span>
              <span className="text-white font-bold text-sm">{data.aqi}</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Category:</span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                  data.aqi <= 50
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : data.aqi <= 100
                    ? 'text-yellow-400 bg-yellow-500/10'
                    : data.aqi <= 200
                    ? 'text-orange-400 bg-orange-500/10'
                    : data.aqi <= 300
                    ? 'text-red-400 bg-red-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {data.aqiCategory}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-[#14263c]">
              <span>PM2.5:</span>
              <span className="text-slate-200">{data.pm25} µg/m³</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>PM10:</span>
              <span className="text-slate-200">{data.pm10} µg/m³</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4" id="chart-aqi-trend">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#14263c]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Air Quality Index (AQI) & Pollution Trend
            </h3>
            <p className="text-[11px] text-slate-400">
              CPCB & National Ambient Air Quality Monitoring Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPollutants(!showPollutants)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
              showPollutants
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-[#060e19] text-slate-400 border-[#14263c] hover:text-white'
            }`}
          >
            {showPollutants ? 'Hide PM2.5 / PM10' : 'Show PM2.5 / PM10'}
          </button>
          <span className="px-2.5 py-1 rounded-lg bg-[#060e19] border border-[#14263c] text-xs font-mono text-slate-300">
            Avg: <strong className="text-cyan-400">{avgAqi}</strong>
          </span>
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
              domain={[0, maxAqi]}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1b385a' }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Reference safety thresholds */}
            <ReferenceLine y={50} stroke="#10b981" strokeDasharray="2 2" strokeOpacity={0.4} />
            <ReferenceLine y={100} stroke="#eab308" strokeDasharray="2 2" strokeOpacity={0.4} />
            <ReferenceLine y={200} stroke="#f97316" strokeDasharray="2 2" strokeOpacity={0.4} />

            <Line
              type="monotone"
              dataKey="aqi"
              stroke="#00d492"
              strokeWidth={3}
              dot={{ r: records.length > 35 ? 0 : 3, fill: '#00d492', strokeWidth: 1, stroke: '#091626' }}
              activeDot={{ r: 6, fill: '#00d492', stroke: '#fff', strokeWidth: 2 }}
            />

            {showPollutants && (
              <>
                <Line
                  type="monotone"
                  dataKey="pm25"
                  stroke="#38bdf8"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="pm10"
                  stroke="#fb923c"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                  dot={false}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-[#14263c]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>0-50 Good</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#eab308]" />
            <span>51-100 Mod</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f97316]" />
            <span>101-200 Poor</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span>201+ Severe</span>
          </span>
        </div>
        <span>Observations: {records.length}</span>
      </div>
    </div>
  );
};
