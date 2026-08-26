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
import { ShieldAlert, Mountain, AlertTriangle } from 'lucide-react';
import { HistoricalRecordPoint } from '../../types/history';

interface RiskTrendChartProps {
  records: HistoricalRecordPoint[];
  locationName: string;
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ records, locationName }) => {
  if (!records || records.length === 0) return null;

  const risks = records.map((r) => r.riskScore);
  const avgRisk = Math.round(risks.reduce((a, b) => a + b, 0) / risks.length);
  const peakRisk = Math.max(...risks);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: HistoricalRecordPoint = payload[0].payload;
      return (
        <div className="bg-[#060e19] border border-[#1b385a] p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1.5 min-w-[220px] z-50">
          <div className="flex items-center justify-between border-b border-[#14263c] pb-1.5">
            <span className="text-orange-400 font-bold">{data.displayTime}</span>
            <span className="text-[10px] text-slate-400">{data.dateOnly}</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            <span className="text-slate-500">Sector:</span> {locationName}
          </p>
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-orange-400 font-bold">LandSafe AI Risk:</span>
              <span className="text-white font-bold text-sm">{data.riskScore}/100</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Risk Tier:</span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
                  data.riskLevel === 'CRITICAL'
                    ? 'text-rose-400 bg-rose-500/10'
                    : data.riskLevel === 'HIGH'
                    ? 'text-orange-400 bg-orange-500/10'
                    : data.riskLevel === 'MODERATE'
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-emerald-400 bg-emerald-500/10'
                }`}
              >
                {data.riskLevel}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-[#14263c]">
              <span>Landslide Susceptibility:</span>
              <span className="text-slate-200">{data.landslideRisk}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Precipitation Driver:</span>
              <span className="text-sky-300">{data.rainfall} mm</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4" id="chart-risk-trend">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#14263c]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              LandSafe AI Historical Risk Assessment & Stability Trend
            </h3>
            <p className="text-[11px] text-slate-400">
              Slope pore-pressure, antecedent rainfall triggers, and terrain vulnerability index (0–100)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-[#060e19] border border-[#14263c] text-slate-300">
            Mean Risk: <strong className="text-orange-400">{avgRisk}/100</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#060e19] border border-[#14263c] text-slate-300">
            Peak: <strong className={peakRisk >= 50 ? 'text-rose-400' : 'text-amber-400'}>{peakRisk}/100</strong>
          </span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={records} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
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
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Risk Tier Thresholds */}
            <ReferenceLine y={30} stroke="#10b981" strokeDasharray="2 2" strokeOpacity={0.4} />
            <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="2 2" strokeOpacity={0.4} />
            <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="2 2" strokeOpacity={0.4} />
            <ReferenceLine y={avgRisk} stroke="#ea580c" strokeDasharray="4 4" strokeOpacity={0.7} />

            <Area
              type="monotone"
              dataKey="riskScore"
              stroke="#ea580c"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#riskGradient)"
              dot={{ r: records.length > 35 ? 0 : 3, fill: '#ea580c', strokeWidth: 1, stroke: '#091626' }}
              activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-[#14263c]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>0-29 Low</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>30-49 Moderate</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>50-74 High</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>75-100 Critical</span>
          </span>
        </div>
        <span>Computation Model: Limit-Equilibrium Slope Mesh</span>
      </div>
    </div>
  );
};
