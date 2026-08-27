import React, { useState } from 'react';
import {
  X,
  Search,
  MapPin,
  Navigation,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  INDIAN_STATES,
  searchAllIndianLocations,
  resolveLocation,
} from '../../data/locations';

export const LocationSelectorModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    userProfile,
    changeUserLocation,
    detectAndApplyGpsLocation,
    isDetectingGps,
    gpsStatusText,
    gpsError,
    dismissGpsError,
  } = useApp();

  const [tab, setTab] = useState<'quick' | 'cascade' | 'search'>('quick');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateId, setSelectedStateId] = useState('mizoram');
  const [selectedDistrictId, setSelectedDistrictId] = useState('champhai');
  const [selectedArea, setSelectedArea] = useState('Khawzawl');

  if (!isLocationModalOpen) return null;

  const currentStateObj =
    INDIAN_STATES.find((s) => s.id === selectedStateId) || INDIAN_STATES[0];
  const currentDistrictObj =
    currentStateObj.districts.find((d) => d.id === selectedDistrictId) ||
    currentStateObj.districts[0];

  const quickSectors = [
    { area: 'Khawzawl', district: 'Champhai', state: 'Mizoram', stateId: 'mizoram', distId: 'champhai', risk: 28, tag: 'Nominal', region: 'Northeast' },
    { area: 'Meppadi', district: 'Wayanad', state: 'Kerala', stateId: 'kerala', distId: 'wayanad', risk: 89, tag: 'Critical Alert', region: 'Western Ghats' },
    { area: 'Kurseong', district: 'Darjeeling', state: 'West Bengal', stateId: 'west_bengal', distId: 'darjeeling', risk: 68, tag: 'Elevated Hazard', region: 'East Himalaya' },
    { area: 'Joshimath', district: 'Chamoli', state: 'Uttarakhand', stateId: 'uttarakhand', distId: 'chamoli', risk: 82, tag: 'Subsidence Zone', region: 'West Himalaya' },
    { area: 'Summer Hill', district: 'Shimla', state: 'Himachal Pradesh', stateId: 'himachal_pradesh', distId: 'shimla', risk: 61, tag: 'Slope Watch', region: 'North Himalaya' },
    { area: 'Mahad', district: 'Raigad', state: 'Maharashtra', stateId: 'maharashtra', distId: 'raigad', risk: 76, tag: 'Ghat Hazard', region: 'Western Ghats' },
    { area: 'Ooty Town', district: 'The Nilgiris', state: 'Tamil Nadu', stateId: 'tamil_nadu', distId: 'nilgiris', risk: 63, tag: 'Active Watch', region: 'Nilgiri Biosphere' },
    { area: 'Madikeri', district: 'Kodagu (Coorg)', state: 'Karnataka', stateId: 'karnataka', distId: 'kodagu', risk: 57, tag: 'Moderate Risk', region: 'Western Ghats' },
    { area: 'Cherrapunji', district: 'East Khasi Hills', state: 'Meghalaya', stateId: 'meghalaya', distId: 'east_khasi', risk: 72, tag: 'High Rainfall', region: 'Northeast' },
    { area: 'Mangan', district: 'North Sikkim', state: 'Sikkim', stateId: 'sikkim', distId: 'north_sikkim', risk: 79, tag: 'Glacial Corridor', region: 'East Himalaya' },
    { area: 'Ramban', district: 'Ramban', state: 'Jammu & Kashmir', stateId: 'jk', distId: 'ramban', risk: 84, tag: 'NH-44 Slips', region: 'Pir Panjal' },
    { area: 'Kohima Town', district: 'Kohima', state: 'Nagaland', stateId: 'nagaland', distId: 'kohima', risk: 59, tag: 'Debris Flow', region: 'Naga Hills' },
  ];

  const handleSelectQuick = async (s: (typeof quickSectors)[0]) => {
    setIsLocationModalOpen(false);
    const loc = resolveLocation(s.stateId, s.distId, s.area);
    await changeUserLocation(loc);
  };

  const handleApplyCascade = async () => {
    setIsLocationModalOpen(false);
    const loc = resolveLocation(selectedStateId, selectedDistrictId, selectedArea);
    await changeUserLocation(loc);
  };

  const handleAutoDetectGps = async () => {
    const loc = await detectAndApplyGpsLocation();
    if (loc) {
      setIsLocationModalOpen(false);
    }
  };

  const searchResults = searchAllIndianLocations(searchQuery);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0b1522] border border-[#1b385a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#142942] flex items-center justify-between bg-[#07111e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Switch India Monitoring Location</h3>
              <p className="text-[11px] text-slate-400">
                Currently tracking: <span className="text-orange-400 font-semibold">{userProfile.location.area}, {userProfile.location.district} ({userProfile.location.state})</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="interactive-btn p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0c1e33] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Detect Bar */}
        <div className="px-6 pt-4 pb-2 bg-[#091524] border-b border-[#142942]">
          <button
            onClick={handleAutoDetectGps}
            disabled={isDetectingGps}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-orange-950/60 to-amber-950/60 hover:from-orange-900/70 hover:to-amber-900/70 border border-orange-500/40 hover:border-orange-400 text-white flex items-center justify-between transition-all cursor-pointer shadow-sm group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                {isDetectingGps ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5" />
                )}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{isDetectingGps ? gpsStatusText : 'Auto-Detect My Current GPS Location'}</span>
                  {!isDetectingGps && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-500/30 text-orange-300 font-normal">
                      Browser Geolocation
                    </span>
                  )}
                </p>
                <p className="text-[10px] text-slate-300">
                  {isDetectingGps
                    ? 'Retrieving device coordinates & reverse geocoding locality...'
                    : 'Get real-time device coordinates and reverse geocode exact area/town name'}
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-mono text-orange-400 group-hover:translate-x-1 inline-block transition-transform">
                {isDetectingGps ? 'Detecting...' : 'Detect Now →'}
              </span>
            </div>
          </button>

          {/* GPS Error Alert */}
          {gpsError && (
            <div className="mt-2 p-2.5 rounded-lg bg-rose-950/80 border border-rose-600/30 flex items-center justify-between text-xs text-rose-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{gpsError}</span>
              </div>
              <button
                onClick={dismissGpsError}
                className="p-1 text-rose-300 hover:text-white rounded hover:bg-rose-900/50 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-[#142942] bg-[#081321] px-6 pt-2 gap-2">
          <button
            onClick={() => setTab('quick')}
            className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              tab === 'quick'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Popular Hazard Sectors
          </button>
          <button
            onClick={() => setTab('search')}
            className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              tab === 'search'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Search All India (36 States/UTs)
          </button>
          <button
            onClick={() => setTab('cascade')}
            className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              tab === 'cascade'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            State & District Selector
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {tab === 'quick' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Click any key monitored geological sector to instantly sync real-time telemetry and hazard sensors:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickSectors.map((s, idx) => {
                  const isCurrent = userProfile.location.area === s.area;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuick(s)}
                      className={`interactive-card p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#0f283d] border-orange-500 ring-1 ring-orange-500/50'
                          : 'bg-[#071322] border-[#162d47] hover:border-orange-500/40 hover:bg-[#0c1e33]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">{s.area}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({s.district})</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{s.state} • <span className="text-orange-400/80">{s.region}</span></p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-white block">
                          {s.risk}%
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                            s.risk >= 75
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                              : s.risk >= 50
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          }`}
                        >
                          {s.tag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'search' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type any Indian district, hill station, capital, or town..."
                  className="w-full bg-[#08121f] border border-[#1c385c] focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  autoFocus
                />
              </div>

              <div className="max-h-72 overflow-y-auto bg-[#071322] border border-[#162d47] rounded-xl divide-y divide-[#12243a]">
                {searchResults.length > 0 ? (
                  searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      onClick={async () => {
                        setIsLocationModalOpen(false);
                        await changeUserLocation({
                          state: res.state,
                          district: res.district,
                          area: res.area,
                          coordinates: res.coordinates,
                          elevation: res.elevation,
                          slopeAngle: res.slopeAngle,
                          lithology: res.lithology,
                          riskScore: res.score,
                          riskLevel: res.score >= 75 ? 'CRITICAL' : res.score >= 50 ? 'HIGH' : 'LOW',
                          isHazardMonitored: res.isMonitored,
                        });
                      }}
                      className="w-full text-left p-3.5 hover:bg-[#0c1f36] flex items-center justify-between text-xs transition-colors cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white group-hover:text-orange-400 transition-colors">{res.area}</span>
                          <span className="text-slate-400">
                            ({res.district}, {res.state})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Elev: {res.elevation}m • Slope: {res.slopeAngle}° • Lith: {res.lithology}
                        </div>
                      </div>
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                        res.isMonitored
                          ? 'text-orange-400 bg-orange-950/60 border-orange-800/50'
                          : 'text-slate-400 bg-slate-800/40 border-slate-700/50'
                      }`}>
                        {res.isMonitored ? 'Hazard Monitored' : 'Standard Node'}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">
                    {searchQuery ? `No matching locations found for "${searchQuery}"` : 'Type to search across 36 states and union territories.'}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'cascade' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  1. STATE / UNION TERRITORY ({INDIAN_STATES.length} TOTAL)
                </label>
                <select
                  value={selectedStateId}
                  onChange={(e) => {
                    setSelectedStateId(e.target.value);
                    const st = INDIAN_STATES.find((s) => s.id === e.target.value) || INDIAN_STATES[0];
                    setSelectedDistrictId(st.districts[0].id);
                    setSelectedArea(st.districts[0].localAreas[0]);
                  }}
                  className="w-full bg-[#08121f] border border-[#1c385c] focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st.id} value={st.id} className="bg-[#08121f]">
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  2. DISTRICT / REVENUE DIVISION
                </label>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => {
                    setSelectedDistrictId(e.target.value);
                    const dist = currentStateObj.districts.find((d) => d.id === e.target.value) || currentStateObj.districts[0];
                    setSelectedArea(dist.localAreas[0]);
                  }}
                  className="w-full bg-[#08121f] border border-[#1c385c] focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  {currentStateObj.districts.map((dist) => (
                    <option key={dist.id} value={dist.id} className="bg-[#08121f]">
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  3. LOCAL AREA / TOWN / SENSOR REGION
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full bg-[#08121f] border border-[#1c385c] focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  {currentDistrictObj.localAreas.map((area) => (
                    <option key={area} value={area} className="bg-[#08121f]">
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleApplyCascade}
                className="interactive-btn w-full py-3 mt-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(234,88,12,0.3)]"
              >
                Apply Location Selection ({selectedArea}, {currentStateObj.name})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
