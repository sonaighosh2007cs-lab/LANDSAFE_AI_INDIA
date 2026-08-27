import React from 'react';
import {
  Server,
  Activity,
  Zap,
  Globe,
  Wifi,
  Layers,
  ArrowUpRight,
  ChevronRight,
  Database,
  Radio,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DataPipelinesOverview: React.FC = () => {
  const { setActiveRoute } = useApp();

  const sensorClusters = [
    {
      name: 'Western Ghats Geophone Array (Kerala-MH)',
      nodes: 412,
      status: 'ONLINE',
      latency: '18ms',
      throughput: '4.8 MB/s',
      protocol: 'MQTT over TLS',
    },
    {
      name: 'Teesta Basin Piezometer Cluster (Sikkim-WB)',
      nodes: 288,
      status: 'ONLINE',
      latency: '24ms',
      throughput: '3.2 MB/s',
      protocol: 'CoAP / LoRaWAN',
    },
    {
      name: 'Alaknanda Valley InSAR Surface Reflectors (UK)',
      nodes: 196,
      status: 'ONLINE',
      latency: '31ms',
      throughput: '2.1 MB/s',
      protocol: 'Direct Satellite uplink',
    },
    {
      name: 'Northeast Mizoram-Arunachal Fiber Extensometers',
      nodes: 340,
      status: 'ONLINE',
      latency: '22ms',
      throughput: '3.9 MB/s',
      protocol: 'MQTT / Kafka 3.6',
    },
  ];

  return (
    <div className="interactive-card bg-[#121214] border border-white/5 hover:border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Data Pipelines & GIS Telemetry
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                Active Streaming
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Real-time IoT sensor network mesh, Doppler radar telemetry, and InSAR satellite downlinks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            1,600+ Sensors Live
          </span>
          <button
            onClick={() => setActiveRoute('data-pipelines')}
            className="interactive-btn text-xs text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 px-3 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <span>Pipelines Engine</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Bento Metric Cards matching the exact screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: System Node Uptime */}
        <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">SYSTEM NODE UPTIME</span>
            <Wifi className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">99.98%</p>
            <p className="text-[11px] text-emerald-400 font-mono mt-1">High Availability Cluster</p>
          </div>
        </div>

        {/* Card 2: Telemetry Event Rate */}
        <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 flex flex-col justify-between hover:border-sky-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">TELEMETRY EVENT RATE</span>
            <Activity className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-sky-400 tracking-tight">18,450 /sec</p>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Kafka Partition Ingest</p>
          </div>
        </div>

        {/* Card 3: End-to-End Latency */}
        <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">END-TO-END LATENCY</span>
            <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">22 ms</p>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Edge Compute to Model Score</p>
          </div>
        </div>

        {/* Card 4: Satellite Radar Feeds */}
        <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">SATELLITE RADAR FEEDS</span>
            <Globe className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-purple-400 tracking-tight">ISRO + Sentinel</p>
            <p className="text-[11px] text-purple-300 font-mono mt-1">X/C-Band SAR Imagery</p>
          </div>
        </div>
      </div>

      {/* Regional Cluster Status Mini-Grid */}
      <div className="bg-[#0a0a0b] border border-white/5 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Regional IoT Mesh Ingestion Clusters
          </span>
          <span className="text-[10px] font-mono text-gray-500">Live Heartbeat Ingestion</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sensorClusters.map((c, i) => (
            <div
              key={i}
              className="bg-[#060e19] border border-[#14263c] rounded-xl p-3 flex flex-col justify-between hover:border-[#1d436c] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    ● {c.status}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 truncate ml-1">{c.protocol}</span>
                </div>
                <h4 className="text-[11px] font-bold text-white mb-2 truncate" title={c.name}>
                  {c.name}
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-1 text-[9px] font-mono bg-[#091626] p-2 rounded-lg border border-[#12243a]">
                <div>
                  <span className="text-slate-400 block">Nodes</span>
                  <span className="text-white font-bold">{c.nodes}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Ping</span>
                  <span className="text-emerald-400 font-bold">{c.latency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Speed</span>
                  <span className="text-sky-400 font-bold">{c.throughput}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
