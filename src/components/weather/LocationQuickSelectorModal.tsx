import React, { useState, useMemo } from 'react';
import { Search, MapPin, X, Check, ChevronRight, Mountain } from 'lucide-react';
import { INDIAN_STATES } from '../../data/locations';
import { UserLocation } from '../../types';

interface LocationQuickSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: UserLocation;
  onSelectLocation: (loc: UserLocation) => void;
}

export const LocationQuickSelectorModal: React.FC<LocationQuickSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStateId, setSelectedStateId] = useState<string>('');

  // Flattened searchable list
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();

    const results: Array<{
      stateName: string;
      districtName: string;
      areaName: string;
      coordinates: { lat: number; lng: number };
      elevation: number;
      slopeAngle: number;
      lithology: string;
      riskScore: number;
      isHazardMonitored: boolean;
    }> = [];

    INDIAN_STATES.forEach((state) => {
      state.districts.forEach((dist) => {
        // Match state, district or local area
        const stateMatches = state.name.toLowerCase().includes(term);
        const distMatches = dist.name.toLowerCase().includes(term);

        dist.localAreas.forEach((area) => {
          if (stateMatches || distMatches || area.toLowerCase().includes(term)) {
            results.push({
              stateName: state.name,
              districtName: dist.name,
              areaName: area,
              coordinates: dist.coordinates,
              elevation: dist.elevation,
              slopeAngle: dist.slopeAngle,
              lithology: dist.lithology,
              riskScore: dist.defaultRiskScore,
              isHazardMonitored: dist.isHazardMonitored,
            });
          }
        });
      });
    });

    return results.slice(0, 15);
  }, [searchTerm]);

  const activeState = useMemo(() => {
    return INDIAN_STATES.find((s) => s.id === selectedStateId) || INDIAN_STATES[0];
  }, [selectedStateId]);

  if (!isOpen) return null;

  const handlePick = (item: {
    stateName: string;
    districtName: string;
    areaName: string;
    coordinates: { lat: number; lng: number };
    elevation: number;
    slopeAngle: number;
    lithology: string;
    riskScore: number;
    isHazardMonitored: boolean;
  }) => {
    const riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' =
      item.riskScore >= 70 ? 'CRITICAL' : item.riskScore >= 50 ? 'HIGH' : item.riskScore >= 30 ? 'MODERATE' : 'LOW';

    onSelectLocation({
      state: item.stateName,
      district: item.districtName,
      area: item.areaName,
      coordinates: item.coordinates,
      elevation: item.elevation,
      slopeAngle: item.slopeAngle,
      lithology: item.lithology,
      riskScore: item.riskScore,
      riskLevel,
      isHazardMonitored: item.isHazardMonitored,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      id="location-picker-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="bg-[#091626] border border-[#1b385a] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        id="location-picker-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#14263c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-bold text-white">Select Location for Live Weather</h2>
              <p className="text-xs text-slate-400">Search any district, city, or ghat corridor across India</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#14263c] transition-colors"
            id="close-location-picker-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-[#14263c] bg-[#060e19]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search e.g. Darjeeling, Shimla, Wayanad, Mumbai, Gangtok, Shillong..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#091626] border border-[#1b385a] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
              autoFocus
              id="weather-location-search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh]">
          {searchTerm.trim() ? (
            /* Search Results */
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase text-slate-400 px-1">Search Results ({searchResults.length})</p>
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No matching locations found for "{searchTerm}". Try another Indian district or state name.
                </div>
              ) : (
                searchResults.map((item, idx) => {
                  const isCurrent =
                    item.areaName === currentLocation.area && item.districtName === currentLocation.district;
                  return (
                    <button
                      key={idx}
                      onClick={() => handlePick(item)}
                      className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-[#0f2d4a] border-sky-400 text-white'
                          : 'bg-[#071322] border-[#14263c] hover:bg-[#0c1f36] hover:border-[#1b385a] text-slate-200'
                      }`}
                      id={`search-result-loc-${idx}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0e2238] flex items-center justify-center text-sky-400 shrink-0">
                          <Mountain className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white flex items-center gap-1.5">
                            {item.areaName}
                            {isCurrent && <Check className="w-3.5 h-3.5 text-sky-400" />}
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.districtName}, {item.stateName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-xs font-mono text-slate-400">
                        <span>{item.elevation}m elev</span>
                        <p className="text-[10px] text-sky-400">
                          {item.coordinates.lat.toFixed(2)}°N, {item.coordinates.lng.toFixed(2)}°E
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            /* State & District Explorer */
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* States column */}
              <div className="sm:col-span-5 space-y-1.5 max-h-[45vh] overflow-y-auto pr-1">
                <p className="text-[11px] font-mono uppercase text-slate-400 px-1 mb-1">Select State / UT</p>
                {INDIAN_STATES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStateId(st.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      (selectedStateId || INDIAN_STATES[0].id) === st.id
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'text-slate-300 hover:bg-[#0c1f36] border border-transparent'
                    }`}
                    id={`state-pick-${st.id}`}
                  >
                    <span className="truncate">{st.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Districts & Areas Column */}
              <div className="sm:col-span-7 space-y-2 max-h-[45vh] overflow-y-auto pl-1 border-t sm:border-t-0 sm:border-l border-[#14263c] pt-2 sm:pt-0">
                <p className="text-[11px] font-mono uppercase text-slate-400 px-1 mb-1">
                  {activeState.name} Districts ({activeState.districts.length})
                </p>
                {activeState.districts.map((dist) => (
                  <div key={dist.id} className="bg-[#071322] border border-[#14263c] rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{dist.name}</h4>
                      <span className="text-[10px] font-mono text-sky-400">{dist.elevation}m</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {dist.localAreas.map((area, aIdx) => {
                        const isCurrent =
                          dist.name === currentLocation.district && area === currentLocation.area;
                        return (
                          <button
                            key={aIdx}
                            onClick={() =>
                              handlePick({
                                stateName: activeState.name,
                                districtName: dist.name,
                                areaName: area,
                                coordinates: dist.coordinates,
                                elevation: dist.elevation,
                                slopeAngle: dist.slopeAngle,
                                lithology: dist.lithology,
                                riskScore: dist.defaultRiskScore,
                                isHazardMonitored: dist.isHazardMonitored,
                              })
                            }
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                              isCurrent
                                ? 'bg-sky-500 text-white font-bold'
                                : 'bg-[#0c1f36] text-slate-300 hover:bg-[#132d4e] hover:text-white border border-[#1b385a]'
                            }`}
                            id={`area-btn-${dist.id}-${aIdx}`}
                          >
                            {area}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
