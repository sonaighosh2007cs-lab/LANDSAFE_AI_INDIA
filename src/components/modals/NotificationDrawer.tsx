import React from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  Radio,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationDrawerOpen, setIsNotificationDrawerOpen, userProfile, setActiveRoute } =
    useApp();

  if (!isNotificationDrawerOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      type: 'critical',
      title: 'State Highway Corridor Advisory: Heavy Pore Saturation',
      location: `${userProfile.location.district} Sector (KM 42–48)`,
      time: '12 mins ago',
      desc: 'Deep sensor piezometers recorded 88% soil moisture saturation following continuous mountain rain. Pre-emptive heavy axle restriction applied.',
      source: 'State Disaster Management Authority (SDMA)',
    },
    {
      id: 'notif-2',
      type: 'warning',
      title: 'IMD Doppler Convective Cloudburst Alert',
      location: 'Eastern Ridge Watershed',
      time: '38 mins ago',
      desc: 'Moderate to heavy rain bands moving north-eastwards. Catchment rainfall expected to reach 65mm in 6 hours.',
      source: 'India Meteorological Department (IMD)',
    },
    {
      id: 'notif-3',
      type: 'info',
      title: 'SDRF 1st Battalion Quick Response Units Deployed',
      location: 'Community Staging Shelter 02',
      time: '2 hours ago',
      desc: 'Equipped with rescue boats, satellite communication rigs, and medical first-responders.',
      source: 'National Disaster Response Force (NDRF)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsNotificationDrawerOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#08121f] border-l border-[#162d47] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#14263c] flex items-center justify-between bg-[#060e19]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800/40 flex items-center justify-center text-rose-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Emergency Broadcasts & Alerts</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {userProfile.location.district} Early Warning Stream
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0c1e33] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Alerts */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Active Telemetry Warnings (02)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Broadcast
              </span>
            </div>

            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition-all ${
                  n.type === 'critical'
                    ? 'bg-[#150d14] border-rose-800/60 shadow-lg shadow-rose-950/20'
                    : n.type === 'warning'
                    ? 'bg-[#16120a] border-amber-800/60'
                    : 'bg-[#0a1829] border-[#183457]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      n.type === 'critical'
                        ? 'bg-rose-950 text-rose-300 border-rose-700'
                        : n.type === 'warning'
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-teal-950 text-teal-300 border-teal-700'
                    }`}
                  >
                    {n.type}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{n.time}</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-white mb-1 leading-snug">{n.title}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">{n.desc}</p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#00d492]" />
                    {n.location}
                  </span>
                  <span className="text-slate-400">{n.source}</span>
                </div>
              </div>
            ))}

            {/* Quick Emergency Action Box */}
            <div className="bg-[#0b1b2d] border border-[#1a385a] rounded-xl p-4 mt-6">
              <h5 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                Emergency Control Helplines
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-[#071322] p-2 rounded-lg border border-[#162d47]">
                  <span className="text-[10px] text-slate-400 block">NDMA Helpline</span>
                  <span className="text-emerald-400 font-bold">112 / 1078</span>
                </div>
                <div className="bg-[#071322] p-2 rounded-lg border border-[#162d47]">
                  <span className="text-[10px] text-slate-400 block">District Control</span>
                  <span className="text-emerald-400 font-bold">1077</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-[#14263c] bg-[#060e19]">
            <button
              onClick={() => {
                setActiveRoute('my-area');
                setIsNotificationDrawerOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#009e60] hover:bg-[#00b870] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Local Safe Shelters & Telemetry</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
