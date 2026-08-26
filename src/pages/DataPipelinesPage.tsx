import React, { useState } from 'react';
import {
  Server,
  Activity,
  Radio,
  Layers,
  Database,
  Cpu,
  CheckCircle,
  RefreshCw,
  Zap,
  Globe,
  Wifi,
} from 'lucide-react';

export const DataPipelinesPage: React.FC = () => {
  const [pipelineState, setPipelineState] = useState('ALL_STREAMS_ACTIVE');

  const sensorClusters = [
    { name: 'Western Ghats Geophone Array (Kerala-MH)', nodes: 412, status: 'ONLINE', latency: '18ms', throughput: '4.8 MB/s', protocol: 'MQTT over TLS' },
    { name: 'Teesta Basin Piezometer Cluster (Sikkim-WB)', nodes: 288, status: 'ONLINE', latency: '24ms', throughput: '3.2 MB/s', protocol: 'CoAP / LoRaWAN' },
    { name: 'Alaknanda Valley InSAR Surface Reflectors (UK)', nodes: 196, status: 'ONLINE', latency: '31ms', throughput: '2.1 MB/s', protocol: 'Direct Satellite uplink' },
    { name: 'Northeast Mizoram-Arunachal Fiber Extensometers', nodes: 340, status: 'ONLINE', latency: '22ms', throughput: '3.9 MB/s', protocol: 'MQTT / Kafka 3.6' },
    { name: 'Konkan Ghats Tilts & Accelerometer Array (MH)', nodes: 154, status: 'ONLINE', latency: '19ms', throughput: '1.8 MB/s', protocol: 'NB-IoT' },
    { name: 'Himachal Satluj River Basin Acoustic Sensors', nodes: 210, status: 'ONLINE', latency: '26ms', throughput: '2.4 MB/s', protocol: 'MQTT over TLS' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="border-b border-[#14263c] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Server className="w-6 h-6 text-emerald-400" />
            Data Pipelines & GIS Telemetry Infrastructure
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time IoT sensor network mesh, Doppler radar telemetry, and InSAR satellite downlinks.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 w-fit flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          1,600+ Ground Sensors Streaming Live
        </span>
      </div>

      {/* Global Ingestion Metrics Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">System Node Uptime</span>
            <Wifi className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">99.98%</p>
          <p className="text-[10px] text-emerald-400 font-mono mt-1">High Availability Cluster</p>
        </div>

        <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Telemetry Event Rate</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-black text-sky-400">18,450 /sec</p>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Kafka Partition Ingest</p>
        </div>

        <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">End-to-End Latency</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">22 ms</p>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Edge Compute to Model Score</p>
        </div>

        <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Satellite Radar Feeds</span>
            <Globe className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-400">ISRO + Sentinel</p>
          <p className="text-[10px] text-purple-300 font-mono mt-1">X/C-Band SAR Imagery</p>
        </div>
      </div>

      {/* Sensor Cluster Health Table */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00d492]" />
          Regional Telemetry Clusters & Communication Protocols
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sensorClusters.map((c, i) => (
            <div
              key={i}
              className="bg-[#060e19] border border-[#14263c] rounded-xl p-4 flex flex-col justify-between hover:border-[#1d436c] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    ● {c.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{c.protocol}</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-2">{c.name}</h4>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono bg-[#091626] p-2.5 rounded-lg border border-[#12243a]">
                <div>
                  <span className="text-slate-400 block">Nodes:</span>
                  <span className="text-white font-bold">{c.nodes} Units</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Latency:</span>
                  <span className="text-emerald-400 font-bold">{c.latency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Bandwidth:</span>
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
