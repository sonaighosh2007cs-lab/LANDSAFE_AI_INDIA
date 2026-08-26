import React, { useState, useMemo } from 'react';
import {
  Table,
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Droplets,
  Wind,
  Thermometer,
} from 'lucide-react';
import { HistoricalRecordPoint, HistoryTimeRange } from '../../types/history';
import { UserLocation } from '../../types';
import { exportHistoryToCsv } from '../../services/historyDataService';

interface HistoricalDataTableProps {
  records: HistoricalRecordPoint[];
  location: UserLocation;
  timeRange: HistoryTimeRange;
}

export const HistoricalDataTable: React.FC<HistoricalDataTableProps> = ({
  records,
  location,
  timeRange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.fullDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.displayTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.weatherCondition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.aqiCategory.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRisk = riskFilter === 'ALL' || r.riskLevel === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [records, searchTerm, riskFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));
  const displayedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const handleExport = () => {
    exportHistoryToCsv(location, timeRange, records);
  };

  const getAqiPill = (aqi: number, category: string) => {
    if (aqi <= 50) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (aqi <= 100) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    if (aqi <= 200) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    if (aqi <= 300) return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-rose-400 bg-rose-500/20 border-rose-500/40';
  };

  const getRiskPill = (level: string) => {
    if (level === 'CRITICAL') return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (level === 'HIGH') return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    if (level === 'MODERATE') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4" id="historical-data-table-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#14263c]">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
            Detailed Historical Sensor & Risk Logs
          </h3>
          <p className="text-[11px] text-slate-400">
            Granular observations for {location.area || location.district}, {location.state}
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition-all cursor-pointer w-fit"
          id="btn-export-csv"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV Dataset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search date, time, weather..."
            className="w-full bg-[#060e19] border border-[#18314e] focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {(['ALL', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setRiskFilter(lvl);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap text-[11px] ${
                riskFilter === lvl
                  ? 'bg-orange-500 text-white font-bold'
                  : 'bg-[#060e19] border border-[#14263c] text-slate-400 hover:text-white'
              }`}
            >
              {lvl === 'ALL' ? 'All Risk' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#14263c]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#060e19] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#14263c]">
            <tr>
              <th className="py-3 px-3">Date & Time</th>
              <th className="py-3 px-3">Temp (°C)</th>
              <th className="py-3 px-3">Humidity</th>
              <th className="py-3 px-3">Precipitation</th>
              <th className="py-3 px-3">AQI Level</th>
              <th className="py-3 px-3">Wind</th>
              <th className="py-3 px-3">LandSafe Risk</th>
              <th className="py-3 px-3">Conditions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#14263c] text-slate-300">
            {displayedRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                  No historical records match your filter criteria.
                </td>
              </tr>
            ) : (
              displayedRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-[#0c1e33] transition-colors">
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="text-white font-bold block">{r.displayTime}</span>
                    <span className="text-[10px] text-slate-500">{r.dateOnly}</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-bold text-amber-300">
                    {r.temperature}°C
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-cyan-300">
                    {r.humidity}%
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={r.rainfall > 0 ? 'text-sky-300 font-bold' : 'text-slate-500'}>
                      {r.rainfall} mm
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getAqiPill(r.aqi, r.aqiCategory)}`}>
                      {r.aqi} • {r.aqiCategory}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-300">
                    {r.windSpeed} km/h {r.windDirection}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getRiskPill(r.riskLevel)}`}>
                      {r.riskScore}/100 • {r.riskLevel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                    {r.weatherCondition.description}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1}–
          {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-[#060e19] border border-[#14263c] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0e2238] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-white font-bold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-[#060e19] border border-[#14263c] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0e2238] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
