import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { PieChart, Activity } from 'lucide-react';
import { HistoricalStatistics } from '../../types/history';

interface AqiDistributionChartProps {
  stats: HistoricalStatistics;
  totalPoints: number;
}

export const AqiDistributionChart: React.FC<AqiDistributionChartProps> = ({
  stats,
  totalPoints,
}) => {
  const dist = stats.aqiCategoryDistribution;

  const data = [
    { name: 'Good (0-50)', count: dist.good, color: '#10b981', label: 'Satisfactory' },
    { name: 'Moderate (51-100)', count: dist.moderate, color: '#eab308', label: 'Acceptable' },
    { name: 'Poor (101-200)', count: dist.poor, color: '#f97316', label: 'Discomfort' },
    { name: 'Very Poor (201-300)', count: dist.veryPoor, color: '#ef4444', label: 'Respiratory Risk' },
    { name: 'Severe (300+)', count: dist.severe, color: '#991b1b', label: 'Hazardous' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const pct = totalPoints > 0 ? Math.round((item.count / totalPoints) * 100) : 0;
      return (
        <div className="bg-[#060e19] border border-[#1b385a] p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1 z-50">
          <p className="text-white font-bold">{item.name}</p>
          <p className="text-cyan-400 font-bold">
            {item.count} Readings ({pct}% of period)
          </p>
          <p className="text-slate-400 text-[10px]">Health impact: {item.label}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4" id="chart-aqi-distribution">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#14263c]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Air Quality Health Distribution
            </h3>
            <p className="text-[11px] text-slate-400">
              Breakdown of temporal observations by national ambient air standards
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Total Observations: <strong className="text-white">{totalPoints}</strong>
        </div>
      </div>

      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#14263c" horizontal={false} />
            <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#1b385a' }}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={22}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-[#14263c] text-[10px] font-mono">
        {data.map((d, i) => {
          const pct = totalPoints > 0 ? Math.round((d.count / totalPoints) * 100) : 0;
          return (
            <div key={i} className="p-2 rounded-xl bg-[#060e19] border border-[#14263c] text-center">
              <span className="block truncate text-slate-400">{d.name.split(' ')[0]}</span>
              <span className="text-xs font-bold font-mono" style={{ color: d.color }}>
                {d.count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
