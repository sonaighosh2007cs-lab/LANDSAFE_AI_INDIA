import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { resolveLocation, searchAllIndianLocations, FlatLocationResult } from '../data/locations';
import {
  ALL_INDIAN_STATES_MAP_DATA,
  CRITICAL_HOTSPOTS_DATA,
  StateMapData,
  CriticalHotspot,
  CalculatedRoute,
  DistrictMarker,
} from '../data/indiaMapData';
import { MapHeaderControls, MapFilterTab } from '../components/map/MapHeaderControls';
import { TelemetryCard, SelectedPinData } from '../components/map/TelemetryCard';
import { SafeRoutePlanner } from '../components/map/SafeRoutePlanner';
import { StateSelectorModal } from '../components/map/StateSelectorModal';
import { MapLegend } from '../components/map/MapLegend';

export const IndiaMapPage: React.FC = () => {
  const { userProfile, setUserLocation, setActiveRoute } = useApp();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Active Filter Tab: 'ALL' | 'HIGH' | 'CRITICAL' | 'STATE' | 'SAFE_ROUTE'
  const [activeTab, setActiveTab] = useState<MapFilterTab>('ALL');
  const [selectedState, setSelectedState] = useState<StateMapData | null>(null);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);

  // Pre-calculate all districts across India with risk >= 60%
  const allHighRiskDistricts = useMemo(() => {
    const list: DistrictMarker[] = [];
    ALL_INDIAN_STATES_MAP_DATA.forEach((st) => {
      st.districts.forEach((d) => {
        if (d.risk >= 60) {
          list.push(d);
        }
      });
    });
    return list;
  }, []);

  // Map Tile Style Mode: 'SATELLITE' | 'DARK' | 'TOPO'
  const [mapTileMode, setMapTileMode] = useState<'SATELLITE' | 'DARK' | 'TOPO'>('SATELLITE');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FlatLocationResult[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Selected Pin for Telemetry Card
  const [selectedPin, setSelectedPin] = useState<SelectedPinData | null>(() => {
    const loc = userProfile.location;
    return {
      name: `${loc.area} (${loc.district})`,
      state: loc.state,
      lat: loc.coordinates.lat,
      lng: loc.coordinates.lng,
      riskScore: loc.riskScore,
      elevation: loc.elevation,
      slope: loc.slopeAngle,
      lithology: loc.lithology,
      rainfall: Math.round(loc.riskScore * 0.32 * 10) / 10,
      soilMoisture: Math.min(96, Math.max(22, loc.riskScore + 8)),
      historicalSlips: Math.max(4, Math.floor(loc.riskScore / 2.2)),
      temp: 21,
      humidity: 88,
      wind: 12,
      isMonitored: loc.isHazardMonitored,
    };
  });

  // Automatically update selectedPin when user changes monitored location
  useEffect(() => {
    const loc = userProfile.location;
    if (loc && loc.coordinates) {
      setSelectedPin({
        name: `${loc.area} (${loc.district})`,
        state: loc.state,
        lat: loc.coordinates.lat,
        lng: loc.coordinates.lng,
        riskScore: loc.riskScore,
        elevation: loc.elevation,
        slope: loc.slopeAngle,
        lithology: loc.lithology,
        rainfall: Math.round(loc.riskScore * 0.32 * 10) / 10,
        soilMoisture: Math.min(96, Math.max(22, loc.riskScore + 8)),
        historicalSlips: Math.max(4, Math.floor(loc.riskScore / 2.2)),
        temp: 21,
        humidity: 88,
        wind: 12,
        isMonitored: loc.isHazardMonitored,
      });
    }
  }, [userProfile.location]);

  // Safe Route state
  const [routePlanDestination, setRoutePlanDestination] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | undefined>(undefined);

  // Handle Search Input
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      const results = searchAllIndianLocations(query);
      setSearchResults(results.slice(0, 8));
    } else {
      setSearchResults([]);
    }
  };

  // Select Search Result
  const handleSelectSearchResult = (result: FlatLocationResult) => {
    setSearchQuery(`${result.area}, ${result.district}`);
    setIsSearchFocused(false);

    const pinData: SelectedPinData = {
      name: `${result.area} (${result.district})`,
      state: result.state,
      lat: result.coordinates.lat,
      lng: result.coordinates.lng,
      riskScore: result.score,
      elevation: result.elevation,
      slope: result.slopeAngle,
      lithology: result.lithology,
      rainfall: Math.round(result.score * 0.32 * 10) / 10,
      soilMoisture: Math.min(96, Math.max(22, result.score + 8)),
      historicalSlips: Math.max(4, Math.floor(result.score / 2.2)),
      temp: 21,
      humidity: 88,
      wind: 12,
      isMonitored: result.isMonitored,
    };

    setSelectedPin(pinData);

    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([result.coordinates.lat, result.coordinates.lng], 10, {
        duration: 1.2,
      });
    }
  };

  // Switch Tile Layer
  const updateTileLayers = useCallback((mode: 'SATELLITE' | 'DARK' | 'TOPO') => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }
    if (labelsTileLayerRef.current) {
      map.removeLayer(labelsTileLayerRef.current);
      labelsTileLayerRef.current = null;
    }

    if (mode === 'SATELLITE') {
      baseTileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
          attribution: 'Esri, Maxar',
        }
      ).addTo(map);

      labelsTileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
        {
          subdomains: 'abcd',
          maxZoom: 18,
        }
      ).addTo(map);
    } else if (mode === 'DARK') {
      baseTileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          subdomains: 'abcd',
          maxZoom: 18,
          attribution: 'CartoDB Dark Matter',
        }
      ).addTo(map);
    } else if (mode === 'TOPO') {
      baseTileLayerRef.current = L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 17,
          attribution: 'OpenTopoMap',
        }
      ).addTo(map);
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.8, 82.5],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
      });

      // Layer groups
      const markersGroup = L.layerGroup().addTo(map);
      const routeGroup = L.layerGroup().addTo(map);

      markersLayerGroupRef.current = markersGroup;
      routeLayerGroupRef.current = routeGroup;
      leafletMapRef.current = map;

      // Add zoom control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Initial tiles
      updateTileLayers('SATELLITE');
    }

    return () => {
      // Keep map instance
    };
  }, [updateTileLayers]);

  // Handle map tile mode changes
  const handleMapTileModeChange = (mode: 'SATELLITE' | 'DARK' | 'TOPO') => {
    setMapTileMode(mode);
    updateTileLayers(mode);
  };

  // Re-center on My Location
  const handleRecenterMyLocation = () => {
    const loc = userProfile.location;
    if (leafletMapRef.current && loc) {
      leafletMapRef.current.flyTo([loc.coordinates.lat, loc.coordinates.lng], 9, {
        duration: 1.2,
      });
      setSelectedPin({
        name: `${loc.area} (${loc.district})`,
        state: loc.state,
        lat: loc.coordinates.lat,
        lng: loc.coordinates.lng,
        riskScore: loc.riskScore,
        elevation: loc.elevation,
        slope: loc.slopeAngle,
        lithology: loc.lithology,
        rainfall: Math.round(loc.riskScore * 0.3 * 10) / 10,
        soilMoisture: Math.min(95, loc.riskScore + 10),
        isMonitored: loc.isHazardMonitored,
      });
    }
  };

  // Render Map Markers based on activeTab & selectedState
  useEffect(() => {
    const map = leafletMapRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. STATE MODE: Drilling into selected state or showing 36 State overview pills
    if (activeTab === 'STATE') {
      if (selectedState) {
        map.flyTo([selectedState.lat, selectedState.lng], selectedState.zoom, { duration: 1.2 });

        selectedState.districts.forEach((dist) => {
          const isHigh = dist.risk >= 70;
          const isMed = dist.risk >= 40 && dist.risk < 70;
          const colorBg = isHigh ? 'bg-rose-600' : isMed ? 'bg-amber-600' : 'bg-emerald-600';

          const icon = L.divIcon({
            className: 'custom-district-marker',
            html: `
              <div class="px-2.5 py-1 rounded-full ${colorBg} text-white font-mono text-[10px] font-black shadow-2xl border border-white/60 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transform hover:scale-125 transition-transform">
                <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                <span>${dist.name}</span>
                <span class="bg-black/35 px-1 py-0.2 rounded font-extrabold">${dist.risk}%</span>
              </div>
            `,
            iconSize: [110, 24],
            iconAnchor: [55, 12],
          });

          const marker = L.marker([dist.lat, dist.lng], { icon }).addTo(markersGroup);
          marker.on('click', () => {
            setSelectedPin({
              name: dist.name,
              state: selectedState.name,
              lat: dist.lat,
              lng: dist.lng,
              riskScore: dist.risk,
              elevation: dist.elevation,
              slope: dist.slopeAngle,
              lithology: dist.lithology,
              rainfall: Math.round(dist.risk * 0.3 * 10) / 10,
              soilMoisture: Math.min(95, dist.risk + 8),
              historicalSlips: Math.floor(dist.risk / 2.5),
              isMonitored: dist.isMonitored,
            });
          });
        });
      } else {
        // Show All 36 Indian States & UTs overview pins
        map.flyTo([22.8, 82.5], 5, { duration: 1.2 });

        ALL_INDIAN_STATES_MAP_DATA.forEach((st) => {
          const isHigh = st.risk >= 65;
          const isMed = st.risk >= 40 && st.risk < 65;
          const bgBadge = isHigh ? 'bg-rose-600' : isMed ? 'bg-amber-600' : 'bg-emerald-600';

          const icon = L.divIcon({
            className: 'custom-state-badge-pin',
            html: `
              <div class="px-2 py-0.5 rounded-lg ${bgBadge} text-white font-mono text-[10px] font-black shadow-2xl border border-white/70 flex items-center gap-1 whitespace-nowrap cursor-pointer hover:scale-125 transition-transform">
                <span>${st.code}</span>
                <span class="bg-black/40 px-1 rounded">${st.risk}%</span>
              </div>
            `,
            iconSize: [60, 22],
            iconAnchor: [30, 11],
          });

          const marker = L.marker([st.lat, st.lng], { icon }).addTo(markersGroup);
          marker.on('click', () => {
            setSelectedState(st);
          });
        });
      }
    }

    // 2. HIGH RISK MODE (Overall Risk >= 60% across India)
    else if (activeTab === 'HIGH') {
      map.flyTo([23.5, 82.5], 5, { duration: 1.2 });

      allHighRiskDistricts.forEach((dist) => {
        const isCritical = dist.risk >= 85;
        const colorBg = isCritical ? 'bg-rose-600' : 'bg-amber-600';

        const icon = L.divIcon({
          className: 'custom-highrisk-marker',
          html: `
            <div class="px-2 py-0.5 rounded-full ${colorBg} text-white font-mono text-[9px] font-black shadow-xl border border-white/70 flex items-center gap-1 whitespace-nowrap cursor-pointer hover:scale-125 transition-transform">
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>${dist.name}</span>
              <span class="bg-black/40 px-1 rounded">${dist.risk}%</span>
            </div>
          `,
          iconSize: [95, 20],
          iconAnchor: [47, 10],
        });

        const marker = L.marker([dist.lat, dist.lng], { icon }).addTo(markersGroup);
        marker.on('click', () => {
          setSelectedPin({
            name: dist.name,
            state: dist.stateName,
            lat: dist.lat,
            lng: dist.lng,
            riskScore: dist.risk,
            elevation: dist.elevation,
            slope: dist.slopeAngle,
            lithology: dist.lithology,
            rainfall: Math.round(dist.risk * 0.32 * 10) / 10,
            soilMoisture: Math.min(96, dist.risk + 8),
            historicalSlips: Math.max(4, Math.floor(dist.risk / 2.2)),
            isMonitored: dist.isMonitored,
          });
        });
      });
    }

    // 3. CRITICAL MODE: Highlighting severe hazard spots with pulsing concentric radar waves (>= 85%)
    else if (activeTab === 'CRITICAL') {
      map.flyTo([24.5, 82.0], 5, { duration: 1.2 });

      CRITICAL_HOTSPOTS_DATA.forEach((h) => {
        const isCritical = h.score >= 88;
        const color = isCritical ? 'bg-rose-600' : 'bg-amber-600';
        const ringColor = isCritical ? 'bg-rose-500/40' : 'bg-amber-500/40';

        const icon = L.divIcon({
          className: 'custom-critical-radar-pin',
          html: `
            <div class="relative group cursor-pointer flex items-center justify-center">
              <div class="absolute w-10 h-10 rounded-full ${ringColor} animate-ping"></div>
              <div class="absolute w-7 h-7 rounded-full ${ringColor} animate-pulse"></div>
              <div class="w-7 h-7 rounded-full ${color} text-white font-mono text-[10px] font-black flex items-center justify-center border-2 border-white shadow-2xl relative z-10">
                ${h.score}%
              </div>
              <div class="absolute top-8 px-2 py-0.5 rounded bg-black/85 text-white font-mono text-[9px] whitespace-nowrap border border-white/30 pointer-events-none shadow-lg">
                ${h.name.split('&')[0].trim()}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([h.lat, h.lng], { icon }).addTo(markersGroup);
        marker.on('click', () => {
          setSelectedPin({
            name: h.name,
            state: `${h.district}, ${h.state}`,
            lat: h.lat,
            lng: h.lng,
            riskScore: h.score,
            elevation: h.elevation,
            slope: h.slopeAngle,
            rainfall: h.rainfall24h,
            soilMoisture: h.soilMoisture,
            historicalSlips: h.historicalSlips,
            temp: 18,
            humidity: 95,
            wind: 15,
            sop: h.sdrfProtocol,
            isMonitored: true,
          });
        });
      });
    }

    // 4. ALL INDIA OVERVIEW: Combining state badges + critical hazard radar pins
    else if (activeTab === 'ALL') {
      map.flyTo([22.8, 82.5], 5, { duration: 1.2 });

      // State Overview nodes
      ALL_INDIAN_STATES_MAP_DATA.forEach((st) => {
        const isHigh = st.risk >= 65;
        const isMed = st.risk >= 40 && st.risk < 65;
        const bgBadge = isHigh ? 'bg-rose-600' : isMed ? 'bg-amber-600' : 'bg-emerald-600';

        const icon = L.divIcon({
          className: 'custom-state-badge-pin',
          html: `
            <div class="px-2 py-0.5 rounded-lg ${bgBadge} text-white font-mono text-[10px] font-black shadow-2xl border border-white/70 flex items-center gap-1 whitespace-nowrap cursor-pointer hover:scale-125 transition-transform">
              <span>${st.code}</span>
              <span class="bg-black/40 px-1 rounded">${st.risk}%</span>
            </div>
          `,
          iconSize: [58, 20],
          iconAnchor: [29, 10],
        });

        const marker = L.marker([st.lat, st.lng], { icon }).addTo(markersGroup);
        marker.on('click', () => {
          setSelectedState(st);
          setActiveTab('STATE');
        });
      });

      // Top 8 Critical Hotspots on overview map
      CRITICAL_HOTSPOTS_DATA.slice(0, 8).forEach((h) => {
        const icon = L.divIcon({
          className: 'custom-critical-overview-pin',
          html: `
            <div class="relative group cursor-pointer flex items-center justify-center">
              <div class="absolute w-8 h-8 rounded-full bg-rose-500/40 animate-ping"></div>
              <div class="w-6 h-6 rounded-full bg-rose-600 text-white font-mono text-[9px] font-black flex items-center justify-center border border-white shadow-xl relative z-10">
                ${h.score}%
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([h.lat, h.lng], { icon }).addTo(markersGroup);
        marker.on('click', () => {
          setSelectedPin({
            name: h.name,
            state: `${h.district}, ${h.state}`,
            lat: h.lat,
            lng: h.lng,
            riskScore: h.score,
            elevation: h.elevation,
            slope: h.slopeAngle,
            rainfall: h.rainfall24h,
            soilMoisture: h.soilMoisture,
            historicalSlips: h.historicalSlips,
            sop: h.sdrfProtocol,
            isMonitored: true,
          });
        });
      });
    }
  }, [activeTab, selectedState, allHighRiskDistricts]);

  // Handle Route Calculation and Map Polyline Rendering
  const handleRouteCalculated = (route: CalculatedRoute) => {
    const map = leafletMapRef.current;
    const routeGroup = routeLayerGroupRef.current;
    if (!map || !routeGroup) return;

    routeGroup.clearLayers();

    const latlngs: [number, number][] = route.waypoints.map((w) => [w.lat, w.lng]);

    // Outer glow polyline
    L.polyline(latlngs, {
      color: '#00d492',
      weight: 8,
      opacity: 0.4,
      lineJoin: 'round',
    }).addTo(routeGroup);

    // Inner bright neon polyline
    const polyline = L.polyline(latlngs, {
      color: '#00d492',
      weight: 4,
      opacity: 1,
      dashArray: route.transportMode === 'FLIGHT' ? '6, 8' : undefined,
      lineJoin: 'round',
    }).addTo(routeGroup);

    // Start Pin
    const startIcon = L.divIcon({
      className: 'route-start-pin',
      html: `
        <div class="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-black border border-white shadow-2xl whitespace-nowrap flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>ORIGIN: ${route.originName}</span>
        </div>
      `,
      iconSize: [110, 24],
      iconAnchor: [55, 12],
    });
    L.marker([route.originCoords.lat, route.originCoords.lng], { icon: startIcon }).addTo(routeGroup);

    // Destination Pin
    const destIcon = L.divIcon({
      className: 'route-dest-pin',
      html: `
        <div class="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-black border border-white shadow-2xl whitespace-nowrap flex items-center gap-1.5">
          <span>📍</span>
          <span>DEST: ${route.destName}</span>
        </div>
      `,
      iconSize: [110, 24],
      iconAnchor: [55, 12],
    });
    L.marker([route.destCoords.lat, route.destCoords.lng], { icon: destIcon }).addTo(routeGroup);

    map.fitBounds(polyline.getBounds(), { padding: [80, 80] });
  };

  // Plan Route To Selected Pin
  const handlePlanRouteToPin = (pin: SelectedPinData) => {
    setRoutePlanDestination({
      name: `${pin.name}, ${pin.state}`,
      lat: pin.lat,
      lng: pin.lng,
    });
    setActiveTab('SAFE_ROUTE');
    setSelectedPin(null);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-8 relative">
      {/* Top Map Header Controls */}
      <MapHeaderControls
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'STATE') setSelectedState(null);
        }}
        selectedState={selectedState}
        onClearSelectedState={() => setSelectedState(null)}
        onOpenStateSelector={() => setIsStateModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchResults={searchResults}
        onSelectSearchResult={handleSelectSearchResult}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        onRecenterMyLocation={handleRecenterMyLocation}
        mapTileMode={mapTileMode}
        onMapTileModeChange={handleMapTileModeChange}
        totalHotspotsCount={CRITICAL_HOTSPOTS_DATA.length}
        highRiskCount={allHighRiskDistricts.length}
      />

      {/* Main Map Container */}
      <div className="relative w-full h-[650px] rounded-3xl overflow-hidden border border-[#162d47] shadow-2xl bg-[#050c17]">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Telemetry Card (Pin HUD) */}
        {selectedPin && activeTab !== 'SAFE_ROUTE' && (
          <TelemetryCard
            pin={selectedPin}
            onClose={() => setSelectedPin(null)}
            onPlanRouteToHere={handlePlanRouteToPin}
          />
        )}

        {/* Safe Route & Evacuation Planner Drawer */}
        {activeTab === 'SAFE_ROUTE' && (
          <SafeRoutePlanner
            onClose={() => setActiveTab('ALL')}
            onRouteCalculated={handleRouteCalculated}
            initialDestination={routePlanDestination}
          />
        )}

        {/* Floating Hazard Map Legend */}
        <MapLegend />
      </div>

      {/* 36 States & UTs Selector Modal */}
      <StateSelectorModal
        isOpen={isStateModalOpen}
        onClose={() => setIsStateModalOpen(false)}
        onSelectState={(state) => {
          setSelectedState(state);
          setActiveTab('STATE');
        }}
        selectedStateId={selectedState?.id}
      />
    </div>
  );
};
