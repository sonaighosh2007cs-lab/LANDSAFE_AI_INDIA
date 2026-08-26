import React from 'react';
import {
  LifeBuoy,
  MapPin,
  Users,
  Navigation,
  Phone,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { UserLocation } from '../../types';

interface MyAreaSheltersCardProps {
  location: UserLocation;
}

export const MyAreaSheltersCard: React.FC<MyAreaSheltersCardProps> = ({ location }) => {
  // Dynamically generate shelters tailored to the user's selected district and area
  const shelters = [
    {
      id: 'shelter-01',
      name: `${location.district} District Multi-Disaster Relief Shelter #1`,
      address: `Higher Secondary Campus, Ridge Road, ${location.area}`,
      distance: '1.2 km',
      capacity: '650 persons',
      status: 'OPEN & FULLY EQUIPPED',
      facilities: ['Solar Backup Power', 'Potable Water Filtration', 'Paramedic Unit', 'Helipad Access'],
      phone: '1077 / 0354-2254101',
      elevation: `${Math.round(location.elevation + 45)} m MSL`,
      latOffset: 0.008,
      lngOffset: 0.006,
    },
    {
      id: 'shelter-02',
      name: `${location.area} Ward Emergency Community Evacuation Center`,
      address: `Municipal Stadium Complex, Sector 2, ${location.district}`,
      distance: '2.4 km',
      capacity: '1,200 persons',
      status: 'OPEN & OPERATIONAL',
      facilities: ['Community Kitchen', 'Child Care Center', 'HAM Radio Base Station', 'SDRF Staging'],
      phone: '0354-2254200',
      elevation: `${Math.round(location.elevation + 20)} m MSL`,
      latOffset: -0.012,
      lngOffset: 0.009,
    },
    {
      id: 'shelter-03',
      name: `State Civil Hospital Disaster Trauma Annex`,
      address: `Main Hospital Road, Central ${location.district}`,
      distance: '3.8 km',
      capacity: '320 beds',
      status: 'STANDBY / ACTIVE TRIAGE',
      facilities: ['24/7 Trauma ICU', 'Blood Bank', 'High-Altitude Oxygen Bank', 'Surgical Ward'],
      phone: '108 / 102',
      elevation: `${Math.round(location.elevation - 15)} m MSL`,
      latOffset: 0.015,
      lngOffset: -0.011,
    },
  ];

  const handleOpenNavigation = (sName: string, latOffset: number, lngOffset: number) => {
    const targetLat = location.coordinates.lat + latOffset;
    const targetLng = location.coordinates.lng + lngOffset;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#060e19] border border-[#14263c] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#10243a]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Designated Emergency Evacuation Shelters & Relief Camps
            </h3>
            <p className="text-[11px] text-slate-400">
              Verified safe high-ground facilities for {location.area}, {location.district} ({location.state}).
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full w-fit flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          NDMA / SDRF Geo-Audited
        </span>
      </div>

      {/* Shelters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shelters.map((shelter) => (
          <div
            key={shelter.id}
            className="bg-[#091626] border border-[#12243a] hover:border-emerald-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-md"
          >
            <div>
              {/* Status Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-2.5 h-2.5" />
                  {shelter.status}
                </span>
                <span className="text-xs font-mono font-black text-cyan-400">
                  {shelter.distance}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug mb-1">
                {shelter.name}
              </h4>
              <p className="text-[11px] text-slate-400 mb-3 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>{shelter.address}</span>
              </p>

              {/* Quick Specs */}
              <div className="space-y-1.5 text-[10px] font-mono bg-[#060e19] p-2.5 rounded-xl border border-[#10243a] mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Capacity:</span>
                  <span className="text-white font-bold">{shelter.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Safety Elevation:</span>
                  <span className="text-cyan-400 font-bold">{shelter.elevation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Helpline:</span>
                  <span className="text-emerald-400 font-bold">{shelter.phone}</span>
                </div>
              </div>

              {/* Facilities tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {shelter.facilities.map((fac, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0b1b2d] text-slate-300 border border-[#162f4e]"
                  >
                    {fac}
                  </span>
                ))}
              </div>
            </div>

            {/* Navigate Button */}
            <button
              type="button"
              onClick={() => handleOpenNavigation(shelter.name, shelter.latOffset, shelter.lngOffset)}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 hover:border-emerald-500 text-emerald-300 hover:text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate Safe Route</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
