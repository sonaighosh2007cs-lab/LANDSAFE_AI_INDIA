import React from 'react';
import { PhoneCall, Shield, AlertCircle, Radio, Flame, HeartPulse } from 'lucide-react';
import { UserLocation } from '../../types';

interface MyAreaEmergencyContactsProps {
  location: UserLocation;
}

export const MyAreaEmergencyContacts: React.FC<MyAreaEmergencyContactsProps> = ({ location }) => {
  const isWestBengal =
    location.state.toLowerCase().includes('bengal') ||
    location.area.toLowerCase().includes('habra');

  const contacts = isWestBengal
    ? [
        {
          title: `West Bengal State Disaster Control`,
          number: '1070',
          altNumber: '033-22143526',
          subtitle: 'Nabanna State Emergency Operation Centre (SEOC)',
          icon: Shield,
          color: 'text-amber-400 border-amber-800/80 bg-amber-950/40',
          btnColor: 'bg-amber-600 hover:bg-amber-500 text-white',
        },
        {
          title: `${location.district} District Emergency Cell`,
          number: '1077',
          altNumber: '033-25840000',
          subtitle: '24/7 District Magistrate Disaster Command',
          icon: Radio,
          color: 'text-cyan-400 border-cyan-800/80 bg-cyan-950/40',
          btnColor: 'bg-cyan-600 hover:bg-cyan-500 text-white',
        },
        {
          title: 'WB Fire & Emergency Services',
          number: '101',
          altNumber: '033-22521165',
          subtitle: 'Disaster Rescue & Hazard Response Unit',
          icon: Flame,
          color: 'text-rose-400 border-rose-800/80 bg-rose-950/40',
          btnColor: 'bg-rose-600 hover:bg-rose-500 text-white',
        },
        {
          title: 'National Emergency Response (ERSS)',
          number: '112',
          altNumber: '108',
          subtitle: 'Unified Police, Trauma Ambulance & NDRF',
          icon: AlertCircle,
          color: 'text-emerald-400 border-emerald-800/80 bg-emerald-950/40',
          btnColor: 'bg-emerald-600 hover:bg-emerald-500 text-white',
        },
      ]
    : [
        {
          title: `${location.district} Disaster Control Room`,
          number: '1077',
          altNumber: '1070',
          subtitle: '24/7 District Magistrate Emergency Cell',
          icon: Shield,
          color: 'text-amber-400 border-amber-800/80 bg-amber-950/40',
          btnColor: 'bg-amber-600 hover:bg-amber-500 text-white',
        },
        {
          title: `${location.state} SDRF Battalion`,
          number: '0354-2254100',
          altNumber: '1070',
          subtitle: 'State Disaster Response Mountain Battalion',
          icon: Radio,
          color: 'text-rose-400 border-rose-800/80 bg-rose-950/40',
          btnColor: 'bg-rose-600 hover:bg-rose-500 text-white',
        },
        {
          title: 'Emergency Trauma & Ambulance',
          number: '108',
          altNumber: '102',
          subtitle: 'Advanced Life Support (ALS) Dispatch',
          icon: HeartPulse,
          color: 'text-emerald-400 border-emerald-800/80 bg-emerald-950/40',
          btnColor: 'bg-emerald-600 hover:bg-emerald-500 text-white',
        },
        {
          title: 'National Disaster Helpline',
          number: '112',
          altNumber: '1078',
          subtitle: 'Single Emergency Response Support System (ERSS)',
          icon: AlertCircle,
          color: 'text-cyan-400 border-cyan-800/80 bg-cyan-950/40',
          btnColor: 'bg-cyan-600 hover:bg-cyan-500 text-white',
        },
      ];

  return (
    <div className="bg-[#060e19] border border-[#14263c] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#10243a]">
        <div>
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-amber-400" />
            District Emergency Dispatch & First Responder Matrix
          </h3>
          <p className="text-[11px] text-slate-400">
            Dedicated emergency hotlines and rapid rescue channels for {location.district} ({location.state}).
          </p>
        </div>
        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-full w-fit">
          Direct Line Active • {isWestBengal ? 'West Bengal Emergency Network' : 'National Disaster Mesh'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {contacts.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`rounded-2xl border p-4 flex flex-col justify-between transition-all hover:scale-[1.01] ${c.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-mono font-black text-white px-2 py-0.5 rounded bg-black/40">
                    {c.number}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-0.5 line-clamp-1">{c.title}</h4>
                <p className="text-[10px] text-slate-300 mb-3">{c.subtitle}</p>
              </div>

              <a
                href={`tel:${c.number.replace(/[^0-9]/g, '')}`}
                className={`w-full py-2 px-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${c.btnColor}`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {c.number}</span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
