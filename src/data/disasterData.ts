import {
  DisasterNewsItem,
  HotspotZone,
  RiskRankingEntry,
  HistoricalLandslideEvent,
  CorridorSafety,
  ActiveAdvisory,
  SensorTelemetry,
  SimulationScenario,
  UserLocation,
} from '../types';

export const INITIAL_SENSOR_TELEMETRY: SensorTelemetry = {
  precipitation: {
    value: 8.2,
    unit: 'mm',
    intensity: 'Low',
  },
  soilMoisture: {
    value: 67,
    unit: '%',
    saturation: 'Nominal',
  },
  slopeAngle: {
    value: 14.5,
    unit: '°',
    gradient: 'Moderate Incline',
  },
  groundDisplacement: {
    value: 215.3,
    unit: 'mm',
    rate: '+23.6 mm/24h',
  },
  elevation: {
    value: 2100,
    unit: 'm',
    terrain: 'Mountainous Relief',
  },
  temperature: {
    value: 19,
    unit: '°C',
    condition: 'Mild',
  },
  humidity: {
    value: 99,
    unit: '%',
    index: 'Atmospheric Vapor Index',
  },
  groundCondition: {
    value: 34.8,
    unit: 'kPa',
    shearStress: 'Shear Stress: 59 kPa',
  },
};

export function getLocationTelemetry(
  location: UserLocation,
  scenario: SimulationScenario
): {
  telemetry: SensorTelemetry;
  riskScore: number;
  riskDelta: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
} {
  const baseRisk = location.riskScore || 28;
  const isHighRisk = baseRisk >= 60;
  const isModerateRisk = baseRisk >= 35 && baseRisk < 60;

  // Derive realistic terrain descriptor from elevation
  const terrainDesc =
    location.elevation > 2000
      ? 'High Altitude Alpine Ridge'
      : location.elevation > 1000
      ? 'Sub-Himalayan Mountain Relief'
      : location.elevation > 400
      ? 'Ghat Escarpment & Plateau'
      : 'Alluvial Basin / Foothill';

  // Slope gradient descriptor
  const slopeDesc =
    location.slopeAngle > 30
      ? 'Severe Steep Escarpment'
      : location.slopeAngle > 20
      ? 'Steep Mountain Gradient'
      : location.slopeAngle > 10
      ? 'Moderate Incline'
      : 'Gentle Fluvial Terrain';

  // Temperature based on elevation (lapse rate ~6.5C per 1000m)
  const baseTemp = Math.max(10, Math.round(30 - (location.elevation / 1000) * 6.5));

  let precip = 14.5;
  let precipIntensity: 'Low' | 'Moderate' | 'Heavy' | 'Extreme' = 'Low';
  let moisture = isHighRisk ? 68 : isModerateRisk ? 52 : 38;
  let moistureSat: 'Dry' | 'Nominal' | 'Saturated' | 'Super-saturated' = isHighRisk ? 'Saturated' : 'Nominal';
  let displacement = isHighRisk ? 120.4 : isModerateRisk ? 34.2 : 4.1;
  let displacementRate = isHighRisk ? '+24.5 mm/24h' : isModerateRisk ? '+8.2 mm/24h' : '+0.5 mm/24h';
  let tempCondition = 'Stable Mountain Air';
  let humidityVal = isHighRisk ? 82 : 68;
  let porePressureVal = isHighRisk ? 54.2 : 28.5;
  let shearVal = isHighRisk ? 'Shear Stress: 68 kPa' : 'Shear Stress: 34 kPa';
  let scenarioDelta = 'Nominal Base Feed';

  let calculatedScore = baseRisk;

  switch (scenario) {
    case 'MONSOON_SURGE':
      precip = isHighRisk ? 142.5 : isModerateRisk ? 84.0 : 38.5;
      precipIntensity = isHighRisk ? 'Heavy' : isModerateRisk ? 'Moderate' : 'Low';
      moisture = Math.min(98, isHighRisk ? 94 : isModerateRisk ? 82 : 64);
      moistureSat = moisture > 88 ? 'Super-saturated' : moisture > 70 ? 'Saturated' : 'Nominal';
      displacement = Math.round((displacement * 2.8 + 80) * 10) / 10;
      displacementRate = isHighRisk ? '+88.4 mm/24h (Surge)' : '+32.1 mm/24h';
      tempCondition = 'High Precipitation Monsoon Downpour';
      humidityVal = 98;
      porePressureVal = Math.min(96, porePressureVal + 38);
      shearVal = `Shear Stress: ${Math.round(porePressureVal * 1.25)} kPa (Elevated)`;
      calculatedScore = Math.min(98, baseRisk + (isHighRisk ? 32 : isModerateRisk ? 28 : 20));
      scenarioDelta = 'Monsoon Surge (+38%)';
      break;

    case 'CYCLONIC_DEPRESSION':
      precip = isHighRisk ? 188.0 : isModerateRisk ? 124.0 : 62.0;
      precipIntensity = 'Extreme';
      moisture = Math.min(99, isHighRisk ? 98 : isModerateRisk ? 90 : 76);
      moistureSat = 'Super-saturated';
      displacement = Math.round((displacement * 3.6 + 140) * 10) / 10;
      displacementRate = '+142.0 mm/24h (Critical Creep)';
      tempCondition = 'Severe Gale & Convective Squall';
      humidityVal = 100;
      porePressureVal = Math.min(98, porePressureVal + 48);
      shearVal = `Shear Stress: ${Math.round(porePressureVal * 1.32)} kPa (Critical)`;
      calculatedScore = Math.min(99, baseRisk + (isHighRisk ? 42 : isModerateRisk ? 36 : 26));
      scenarioDelta = 'Cyclonic Depression (+52%)';
      break;

    case 'SEISMIC_TREMOR':
      precip = 18.0;
      precipIntensity = 'Low';
      moisture = Math.min(85, moisture + 10);
      moistureSat = 'Nominal';
      displacement = Math.round((displacement * 4.2 + 220) * 10) / 10;
      displacementRate = '+210.5 mm (Fault Jitter / Scree Shake)';
      tempCondition = 'Ground Jitter / Micro-Fracturing';
      humidityVal = 75;
      porePressureVal = Math.min(90, porePressureVal + 22);
      shearVal = `Dynamic Shear Stress: ${Math.round(porePressureVal * 1.4)} kPa`;
      calculatedScore = Math.min(96, baseRisk + (isHighRisk ? 35 : 25));
      scenarioDelta = 'Seismic Tremor Surge (+42%)';
      break;

    case 'DRY_SPELL':
    default:
      precip = 4.2;
      precipIntensity = 'Low';
      moisture = Math.max(18, moisture - 18);
      moistureSat = 'Dry';
      displacementRate = '+0.8 mm/24h (Quiescent)';
      tempCondition = 'Clear Mountain Atmosphere';
      humidityVal = Math.max(45, humidityVal - 22);
      porePressureVal = Math.max(14, porePressureVal - 15);
      shearVal = `Shear Stress: ${Math.round(porePressureVal * 0.9)} kPa (Stable)`;
      calculatedScore = Math.max(10, baseRisk - 8);
      scenarioDelta = 'Nominal Baseline (-8%)';
      break;
  }

  const riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' =
    calculatedScore >= 75
      ? 'CRITICAL'
      : calculatedScore >= 50
      ? 'HIGH'
      : calculatedScore >= 30
      ? 'MODERATE'
      : 'LOW';

  return {
    telemetry: {
      precipitation: {
        value: precip,
        unit: 'mm',
        intensity: precipIntensity,
      },
      soilMoisture: {
        value: moisture,
        unit: '%',
        saturation: moistureSat,
      },
      slopeAngle: {
        value: location.slopeAngle,
        unit: '°',
        gradient: slopeDesc,
      },
      groundDisplacement: {
        value: displacement,
        unit: 'mm',
        rate: displacementRate,
      },
      elevation: {
        value: location.elevation,
        unit: 'm',
        terrain: terrainDesc,
      },
      temperature: {
        value: baseTemp,
        unit: '°C',
        condition: tempCondition,
      },
      humidity: {
        value: humidityVal,
        unit: '%',
        index: humidityVal > 90 ? 'Vapor Saturated' : 'Nominal Atmospheric Index',
      },
      groundCondition: {
        value: porePressureVal,
        unit: 'kPa',
        shearStress: shearVal,
      },
    },
    riskScore: calculatedScore,
    riskDelta: scenarioDelta,
    riskLevel,
  };
}

export function getTelemetryForScenario(
  scenario: SimulationScenario,
  baseRisk: number = 28
): { telemetry: SensorTelemetry; riskScore: number; riskDelta: string } {
  const dummyLocation: UserLocation = {
    state: 'National Network',
    district: 'Active Sector',
    area: 'Monitored Zone',
    coordinates: { lat: 27.05, lng: 88.45 },
    elevation: 2100,
    slopeAngle: 24.5,
    lithology: 'Geotechnical Complex',
    riskScore: baseRisk,
    riskLevel: baseRisk >= 75 ? 'CRITICAL' : baseRisk >= 50 ? 'HIGH' : 'LOW',
    isHazardMonitored: true,
  };

  const res = getLocationTelemetry(dummyLocation, scenario);
  return {
    telemetry: res.telemetry,
    riskScore: res.riskScore,
    riskDelta: res.riskDelta,
  };
}

// Generate location-specific highway corridor safety intelligence
export function getLocationCorridorSafety(
  location: UserLocation,
  riskScore: number
): CorridorSafety {
  const isCritical = riskScore >= 75;
  const isHigh = riskScore >= 50;
  const state = location.state.toLowerCase();
  const district = location.district.toLowerCase();

  let corridorName = `${location.district} – Regional State Highway Corridor`;
  let alternate = `Ridge Crest Arterial Bypass (Safe Elevation)`;

  if (state.includes('west bengal') || district.includes('darjeeling') || district.includes('kalimpong')) {
    corridorName = 'NH-10 Sevoke – Teesta Bridge – Gangtok Corridor';
    alternate = 'Gorubathan – Lava – Algarah Ridge Bypass (Clear)';
  } else if (state.includes('uttarakhand') || district.includes('rudraprayag') || district.includes('chamoli')) {
    corridorName = 'NH-58 Rishikesh – Devprayag – Rudraprayag – Badrinath Axis';
    alternate = 'Chamba – Tehri Dam Crest Bypass Route (Monitored)';
  } else if (state.includes('kerala') || district.includes('wayanad') || district.includes('idukki')) {
    corridorName = 'SH-59 Thamarassery – Meppadi – Chooralmala Ghat Highway';
    alternate = 'Kuttiady – Mananthavady Stabilized Valley Road';
  } else if (state.includes('himachal') || district.includes('kinnaur') || district.includes('shimla')) {
    corridorName = 'NH-05 Hindustan-Tibet Road (Shimla – Rampur – Nigulsari)';
    alternate = 'Jalori Pass Link Corridor / Sub-Ridge Tunnel Axis';
  } else if (state.includes('sikkim') || district.includes('mangan')) {
    corridorName = 'Dikchu – Chungthang – Lachen Military Supply Corridor';
    alternate = 'Singtam – Melli Alternative River Spur Bypass';
  } else if (state.includes('maharashtra') || district.includes('raigad') || district.includes('satara')) {
    corridorName = 'NH-66 Mumbai-Goa Highway (Kashedi & Varandha Ghat Sectors)';
    alternate = 'Tamhini Ghat Stabilized Concrete Escarpment Road';
  } else if (state.includes('mizoram') || district.includes('champhai')) {
    corridorName = 'Champhai – Khawzawl State Highway Corridor';
    alternate = 'North Dungtlang Ridge Link (Safe Clearance)';
  }

  return {
    id: `corridor-${location.district.toLowerCase().replace(/\s+/g, '-')}`,
    name: corridorName,
    status: isCritical ? 'CRITICAL' : isHigh ? 'WARNING' : 'SAFE',
    riskPercentage: riskScore,
    description: isCritical
      ? `Active scree displacement and heavy pore-pressure saturation detected along ${location.district} ghat sector. Heavy transit restricted.`
      : isHigh
      ? `Elevated geotechnical moisture index across ${location.area}. Night driving regulated by local authorities.`
      : `Geotechnical sensor mesh reports nominal slope equilibrium across ${location.district} sector. Safe for all vehicular traffic.`,
    recommendedAction: isCritical
      ? `Suspend commercial freight. Divert essential traffic to ${alternate}. Pre-position BRO heavy earthmovers.`
      : isHigh
      ? `Exercise vigilance in blind curves. Follow convoy discipline and observe real-time LED warning gantries.`
      : `Clear passage. Maintain standard mountain driving speeds and monitor IMD weather updates.`,
    alternateRoute: alternate,
  };
}

// Generate location-specific disaster advisory
export function getLocationAdvisory(
  location: UserLocation,
  riskScore: number
): ActiveAdvisory {
  const isCritical = riskScore >= 75;
  const isHigh = riskScore >= 50;

  return {
    id: `adv-${location.district.toLowerCase().replace(/\s+/g, '-')}`,
    title: isCritical
      ? `CRITICAL: Elevated Slope Creep & Debris Flow Warning`
      : isHigh
      ? `ALERT: Heightened Pore-Pressure & Soil Moisture Saturation`
      : `NOMINAL: Geotechnical Stability & Early Warning Baseline`,
    severity: isCritical ? 'Critical' : isHigh ? 'Warning' : 'Advisory',
    location: `${location.area}, ${location.district} (${location.state})`,
    summary: isCritical
      ? `Automated piezometers and borehole strain gauges across ${location.area} show shear-stress thresholds approaching critical failure envelope (${riskScore}% AI Vulnerability Index).`
      : isHigh
      ? `Recent convective precipitation over ${location.district} has increased subsurface saturation to ${Math.min(92, riskScore + 20)}%. SDRF teams placed on stage-2 alert.`
      : `All slope inclinometers and InSAR satellites indicate stable geological equilibrium across ${location.district} with no immediate slope movement detected.`,
    protocol: isCritical
      ? `Immediate activation of Section 144 on vulnerable escarpments. Evacuation of low-lying toe settlements to certified community shelters.`
      : isHigh
      ? `Pre-position quick response medical teams and earthmoving equipment. SDMA emergency toll-free 1077 active.`
      : `Routine sensor polling every 15 minutes. Regular BRO maintenance patrols active along primary highway stretches.`,
    activeAlertsCount: isCritical ? 3 : isHigh ? 1 : 0,
    sheltersAvailable: isCritical ? 8 : 12,
    issuedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    authority: 'GSI National Landslide Forecast Centre • NDMA • SDMA',
  };
}

export const INITIAL_CORRIDOR_SAFETY: CorridorSafety = {
  id: 'champhai-khawzawl',
  name: 'Champhai – Khawzawl State Highway Corridor',
  status: 'CRITICAL',
  riskPercentage: 91,
  description: 'Severe toe undercutting and 88% soil moisture saturation causing active creeping failure along KM 42–48.',
  recommendedAction: 'Immediate heavy vehicle suspension. Reroute light traffic via North Dungtlang link road.',
  alternateRoute: 'North Dungtlang Ridge Link (Safe Clearance)',
};

export const INITIAL_ACTIVE_ADVISORY: ActiveAdvisory = {
  id: 'adv-001',
  title: 'Severe Pore-Water Saturation Warning',
  severity: 'Critical',
  location: 'Khawzawl & Champhai North Slopes',
  summary: 'Severe pore-water pressure buildup and soil saturation exceeding safe thresholds near Khawzawl.',
  protocol: 'Immediate traffic suspension and pre-positioning of SDRF quick response teams. Community shelters open.',
  activeAlertsCount: 2,
  sheltersAvailable: 7,
  issuedAt: '08:06 PM Today',
  authority: 'NDMA & State Disaster Management Authority (SDMA)',
};

export const DISASTER_NEWS_FEED: DisasterNewsItem[] = [
  {
    id: 'news-1',
    title: 'IMD Issues Red Alert for Nilgiris & Wayanad Ghats Following 180mm Overnight Downpour',
    summary: 'Doppler weather radars detect convective storm clusters over the Western Ghats. InSAR ground telemetry reports 42mm displacement in Meppadi sector.',
    source: 'IMD',
    timestamp: '14 mins ago',
    severity: 'Critical',
    state: 'Kerala',
    category: 'Landslide',
    verified: true,
    affectedDistricts: ['Wayanad', 'Nilgiris', 'Idukki', 'Kozhikode'],
  },
  {
    id: 'news-2',
    title: 'Geological Survey of India Deploys Slope Stability AI Sensors Along Teesta River Basin',
    summary: 'Automated piezometers and LiDAR surface deformation detectors installed across 18 vulnerable slopes along NH-10 connecting Siliguri with Gangtok.',
    source: 'GSI',
    timestamp: '1 hour ago',
    severity: 'Alert',
    state: 'West Bengal',
    category: 'Early Warning',
    verified: true,
    affectedDistricts: ['Darjeeling', 'Kalimpong', 'Pakhyong', 'Gangtok'],
  },
  {
    id: 'news-3',
    title: 'BRO Clears Debris at Sela Pass Corridor in Arunachal Pradesh; Traffic Regulated',
    summary: 'Border Roads Organisation Project Vartak engineers removed rockfall debris near KM 78 within 3 hours. Sensor mesh reports stabilized shear stress.',
    source: 'BRO',
    timestamp: '2 hours ago',
    severity: 'Normal',
    state: 'Arunachal Pradesh',
    category: 'Highway Blockage',
    verified: true,
    affectedDistricts: ['Tawang', 'West Kameng'],
  },
  {
    id: 'news-4',
    title: 'NDMA Coordinates with SDRF in Chamoli District for Joshimath Aquifer Outflow Monitoring',
    summary: 'Continuous borehole pressure logging shows stabilized pore-pressure despite 45mm rainfall in Garhwal Himalayas. No fresh subsidence fissures reported.',
    source: 'NDMA',
    timestamp: '3 hours ago',
    severity: 'Normal',
    state: 'Uttarakhand',
    category: 'Landslide',
    verified: true,
    affectedDistricts: ['Chamoli', 'Rudraprayag', 'Pauri Garhwal'],
  },
  {
    id: 'news-5',
    title: 'Flash Flood & Mudflow Watch Activated for Shimla-Kinnaur NH-05 Ghat Stretch',
    summary: 'State Emergency Operation Centre warns of loose scree movement near Nigulsari. Heavy earthmovers pre-positioned at 5 strategic transit points.',
    source: 'SDRF',
    timestamp: '4 hours ago',
    severity: 'Severe',
    state: 'Himachal Pradesh',
    category: 'Flash Flood',
    verified: true,
    affectedDistricts: ['Kinnaur', 'Shimla', 'Kullu'],
  },
  {
    id: 'news-6',
    title: 'Western Ghats Early Warning Sensor Array Detects Accelerated Creep in Mahad Sector',
    summary: 'IoT inclinometers on the Irshalwadi-Mahad escarpment recorded 18mm lateral creep. Local administration placed rescue teams on stage-2 alert.',
    source: 'GSI',
    timestamp: '5 hours ago',
    severity: 'Severe',
    state: 'Maharashtra',
    category: 'Early Warning',
    verified: true,
    affectedDistricts: ['Raigad', 'Satara', 'Ratnagiri'],
  },
];

export const WARNING_HOTSPOTS: HotspotZone[] = [
  {
    id: 'hotspot-1',
    name: 'Darjeeling – Sikkim Teesta Axis',
    state: 'West Bengal / Sikkim',
    riskScore: 92,
    threatLevel: 'CRITICAL',
    slopeCreepRate: '+118 mm/24h',
    rainfall24h: 142.4,
    porePressure: '89.4 kPa (Critical)',
    sensorsOnline: 34,
    totalSensors: 36,
    status: 'Debris Flow Active / NH-10 Transit Suspended',
    evacuationStatus: 'Active Evacuation',
    coordinates: { lat: 27.05, lng: 88.45 },
  },
  {
    id: 'hotspot-2',
    name: 'Wayanad – Meppadi Chooralmala Sector',
    state: 'Kerala',
    riskScore: 89,
    threatLevel: 'CRITICAL',
    slopeCreepRate: '+94 mm/24h',
    rainfall24h: 168.0,
    porePressure: '92.1 kPa (Extreme)',
    sensorsOnline: 28,
    totalSensors: 30,
    status: 'Saturated Colluvium Slippage Watch',
    evacuationStatus: 'Active Evacuation',
    coordinates: { lat: 11.55, lng: 76.12 },
  },
  {
    id: 'hotspot-3',
    name: 'Kinnaur – Nigulsari NH-05 Zone',
    state: 'Himachal Pradesh',
    riskScore: 84,
    threatLevel: 'HIGH',
    slopeCreepRate: '+64 mm/24h',
    rainfall24h: 58.2,
    porePressure: '64.2 kPa (Elevated)',
    sensorsOnline: 22,
    totalSensors: 24,
    status: 'Overhanging Rockfall Prone',
    evacuationStatus: 'High Vigilance',
    coordinates: { lat: 31.62, lng: 78.41 },
  },
  {
    id: 'hotspot-4',
    name: 'Joshimath – Helang Corridor',
    state: 'Uttarakhand',
    riskScore: 78,
    threatLevel: 'HIGH',
    slopeCreepRate: '+42 mm/24h',
    rainfall24h: 46.5,
    porePressure: '55.0 kPa (Watch)',
    sensorsOnline: 45,
    totalSensors: 48,
    status: 'Perched Aquifer Seepage Monitored',
    evacuationStatus: 'Standby',
    coordinates: { lat: 30.55, lng: 79.56 },
  },
  {
    id: 'hotspot-5',
    name: 'Raigad – Varandha Ghat Sector',
    state: 'Maharashtra',
    riskScore: 74,
    threatLevel: 'HIGH',
    slopeCreepRate: '+38 mm/24h',
    rainfall24h: 110.0,
    porePressure: '68.5 kPa (Elevated)',
    sensorsOnline: 19,
    totalSensors: 20,
    status: 'Basaltic Weathered Layer Saturated',
    evacuationStatus: 'Standby',
    coordinates: { lat: 18.15, lng: 73.55 },
  },
  {
    id: 'hotspot-6',
    name: 'Champhai – Khawzawl Ridge Corridor',
    state: 'Mizoram',
    riskScore: 28,
    threatLevel: 'LOW',
    slopeCreepRate: '+23.6 mm/24h (Nominal)',
    rainfall24h: 8.2,
    porePressure: '34.8 kPa (Safe)',
    sensorsOnline: 19,
    totalSensors: 21,
    status: 'Alluvial Colluvium Stable',
    evacuationStatus: 'Normal',
    coordinates: { lat: 23.475, lng: 93.328 },
  },
];

export const RISK_RANKING_DATA: RiskRankingEntry[] = [
  {
    rank: 1,
    state: 'Kerala',
    district: 'Wayanad',
    vulnerabilityScore: 94.2,
    gsiZone: 'Very High (Zone V)',
    populationExposed: '340,000',
    historicalEventsCount: 182,
    sensorDensity: '1.8 nodes/sq km',
    trend: 'increasing',
  },
  {
    rank: 2,
    state: 'Uttarakhand',
    district: 'Rudraprayag',
    vulnerabilityScore: 91.8,
    gsiZone: 'Very High (Zone V)',
    populationExposed: '242,000',
    historicalEventsCount: 245,
    sensorDensity: '2.1 nodes/sq km',
    trend: 'increasing',
  },
  {
    rank: 3,
    state: 'West Bengal',
    district: 'Kalimpong',
    vulnerabilityScore: 89.5,
    gsiZone: 'Very High (Zone V)',
    populationExposed: '190,000',
    historicalEventsCount: 210,
    sensorDensity: '1.6 nodes/sq km',
    trend: 'increasing',
  },
  {
    rank: 4,
    state: 'Himachal Pradesh',
    district: 'Kinnaur',
    vulnerabilityScore: 88.0,
    gsiZone: 'Very High (Zone V)',
    populationExposed: '84,000',
    historicalEventsCount: 164,
    sensorDensity: '1.4 nodes/sq km',
    trend: 'stable',
  },
  {
    rank: 5,
    state: 'Sikkim',
    district: 'Mangan (North Sikkim)',
    vulnerabilityScore: 86.4,
    gsiZone: 'Very High (Zone V)',
    populationExposed: '43,000',
    historicalEventsCount: 198,
    sensorDensity: '1.2 nodes/sq km',
    trend: 'increasing',
  },
  {
    rank: 6,
    state: 'Uttarakhand',
    district: 'Chamoli',
    vulnerabilityScore: 85.1,
    gsiZone: 'Very High (Zone V)',
    populationExposed: '391,000',
    historicalEventsCount: 280,
    sensorDensity: '2.4 nodes/sq km',
    trend: 'stable',
  },
  {
    rank: 7,
    state: 'Maharashtra',
    district: 'Raigad',
    vulnerabilityScore: 82.3,
    gsiZone: 'High (Zone IV)',
    populationExposed: '620,000',
    historicalEventsCount: 142,
    sensorDensity: '1.1 nodes/sq km',
    trend: 'increasing',
  },
  {
    rank: 8,
    state: 'West Bengal',
    district: 'Darjeeling',
    vulnerabilityScore: 80.9,
    gsiZone: 'High (Zone IV)',
    populationExposed: '810,000',
    historicalEventsCount: 310,
    sensorDensity: '2.0 nodes/sq km',
    trend: 'stable',
  },
  {
    rank: 9,
    state: 'Kerala',
    district: 'Idukki',
    vulnerabilityScore: 79.4,
    gsiZone: 'High (Zone IV)',
    populationExposed: '510,000',
    historicalEventsCount: 175,
    sensorDensity: '1.5 nodes/sq km',
    trend: 'increasing',
  },
  {
    rank: 10,
    state: 'Arunachal Pradesh',
    district: 'Tawang',
    vulnerabilityScore: 76.5,
    gsiZone: 'High (Zone IV)',
    populationExposed: '52,000',
    historicalEventsCount: 88,
    sensorDensity: '0.8 nodes/sq km',
    trend: 'stable',
  },
  {
    rank: 11,
    state: 'Himachal Pradesh',
    district: 'Shimla',
    vulnerabilityScore: 74.0,
    gsiZone: 'High (Zone IV)',
    populationExposed: '814,000',
    historicalEventsCount: 220,
    sensorDensity: '1.9 nodes/sq km',
    trend: 'stable',
  },
  {
    rank: 12,
    state: 'Tamil Nadu',
    district: 'The Nilgiris',
    vulnerabilityScore: 71.2,
    gsiZone: 'Moderate (Zone III)',
    populationExposed: '735,000',
    historicalEventsCount: 150,
    sensorDensity: '1.3 nodes/sq km',
    trend: 'decreasing',
  },
  {
    rank: 13,
    state: 'Mizoram',
    district: 'Champhai',
    vulnerabilityScore: 28.0,
    gsiZone: 'Moderate (Zone III)',
    populationExposed: '125,000',
    historicalEventsCount: 32,
    sensorDensity: '1.0 nodes/sq km',
    trend: 'stable',
  },
];

export const INDIAN_STATES_RISK_RANKING = [
  {
    rank: 1,
    state: 'Kerala',
    region: 'Western Ghats Escarpment',
    hazardTier: 'Critical Hazard',
    riskScore: 94,
    populationAtRisk: '3.4M in High Slopes',
    incidentsThisYear: 38,
    sensorCoverage: 88,
  },
  {
    rank: 2,
    state: 'Uttarakhand',
    region: 'Central Himalayas (Garhwal/Kumaon)',
    hazardTier: 'Critical Hazard',
    riskScore: 91,
    populationAtRisk: '2.8M in River Basins',
    incidentsThisYear: 44,
    sensorCoverage: 92,
  },
  {
    rank: 3,
    state: 'West Bengal (Hill Region)',
    region: 'Eastern Himalayas / Darjeeling',
    hazardTier: 'Critical Hazard',
    riskScore: 89,
    populationAtRisk: '1.2M along NH-10',
    incidentsThisYear: 27,
    sensorCoverage: 84,
  },
  {
    rank: 4,
    state: 'Himachal Pradesh',
    region: 'Western Himalayas (Satluj/Beas)',
    hazardTier: 'Critical Hazard',
    riskScore: 88,
    populationAtRisk: '2.1M in Valley Corridors',
    incidentsThisYear: 36,
    sensorCoverage: 86,
  },
  {
    rank: 5,
    state: 'Sikkim',
    region: 'Teesta Watershed (Mangan/Pakyong)',
    hazardTier: 'High Hazard',
    riskScore: 86,
    populationAtRisk: '480K along NH-310A',
    incidentsThisYear: 22,
    sensorCoverage: 79,
  },
  {
    rank: 6,
    state: 'Maharashtra (Western Ghats)',
    region: 'Konkan Escarpment / Sahyadri',
    hazardTier: 'High Hazard',
    riskScore: 82,
    populationAtRisk: '4.6M in Foot-hill Villages',
    incidentsThisYear: 19,
    sensorCoverage: 75,
  },
  {
    rank: 7,
    state: 'Arunachal Pradesh',
    region: 'Eastern Himalayan Front',
    hazardTier: 'High Hazard',
    riskScore: 76,
    populationAtRisk: '650K in Trans-Himalayan roads',
    incidentsThisYear: 16,
    sensorCoverage: 62,
  },
  {
    rank: 8,
    state: 'Mizoram',
    region: 'Surma Basin / Mizo Hills',
    hazardTier: 'Moderate Hazard',
    riskScore: 68,
    populationAtRisk: '820K in Ridge settlements',
    incidentsThisYear: 8,
    sensorCoverage: 71,
  },
  {
    rank: 9,
    state: 'Nagaland',
    region: 'Naga Hills / Patkai Belt',
    hazardTier: 'Moderate Hazard',
    riskScore: 64,
    populationAtRisk: '910K in Terrace Towns',
    incidentsThisYear: 7,
    sensorCoverage: 58,
  },
  {
    rank: 10,
    state: 'Tamil Nadu (Nilgiris)',
    region: 'Southern Western Ghats',
    hazardTier: 'Moderate Hazard',
    riskScore: 62,
    populationAtRisk: '740K in Tea Estate Slopes',
    incidentsThisYear: 5,
    sensorCoverage: 82,
  },
];

export const GSI_HISTORICAL_RECORDS = [
  {
    id: 'gsi-rec-2024-01',
    year: 2024,
    location: 'Chooralmala & Mundakkai (Wayanad)',
    state: 'Kerala',
    type: 'Debris Flow',
    trigger: 'Monsoon Cloudburst (572mm / 48h)',
    fatalities: '420+ Fatalities',
    lessons: 'Mandatory sub-surface piezometer arrays along all tea-estate colluvium mantles.',
  },
  {
    id: 'gsi-rec-2023-01',
    year: 2023,
    location: 'Irshalwadi, Khalapur (Raigad)',
    state: 'Maharashtra',
    type: 'Debris Flow',
    trigger: 'Extreme Orographic Rain (498mm in 72h)',
    fatalities: '87 Fatalities',
    lessons: 'InSAR early-warning thresholds reduced to 15mm creep on basaltic caprock.',
  },
  {
    id: 'gsi-rec-2023-02',
    year: 2023,
    location: 'Summer Hill & Shiv Baoli (Shimla)',
    state: 'Himachal Pradesh',
    type: 'Rotational Slump',
    trigger: 'Extreme Monsoonal Rainfall (320mm / 24h)',
    fatalities: '71 Fatalities',
    lessons: 'Strict municipal hillside slope loading restrictions and drainage channel desilting.',
  },
  {
    id: 'gsi-rec-2021-01',
    year: 2021,
    location: 'Chamoli / Rishiganga Valley',
    state: 'Uttarakhand',
    type: 'Complex Flow',
    trigger: 'Glacial Rock-Ice Wedge Detachment',
    fatalities: '204 Fatalities',
    lessons: 'High-altitude thermal satellite scanning above 5,000m altitude permafrost zones.',
  },
  {
    id: 'gsi-rec-2014-01',
    year: 2014,
    location: 'Malin Village (Ambegaon, Pune)',
    state: 'Maharashtra',
    type: 'Debris Flow',
    trigger: 'Continuous Rainfall on Terraced Slopes (108mm)',
    fatalities: '151 Fatalities',
    lessons: 'Banned unengineered hill-slope flattening for agricultural subsidies.',
  },
  {
    id: 'gsi-rec-2013-01',
    year: 2013,
    location: 'Kedarnath Basin & Mandakini River',
    state: 'Uttarakhand',
    type: 'Complex Flow',
    trigger: 'Cloudburst + Chorabari Lake Breach',
    fatalities: '5,700+ Fatalities',
    lessons: 'Creation of National Early Warning Doppler Radar mesh across all Himalayan corridors.',
  },
];

export const GSI_HISTORICAL_EVENTS: HistoricalLandslideEvent[] = [
  {
    id: 'gsi-2024-01',
    year: 2024,
    date: '30 July 2024',
    location: 'Chooralmala & Mundakkai (Meppadi)',
    state: 'Kerala',
    fatalities: 420,
    trigger: 'Monsoon Cloudburst',
    rainfallAmount: '572 mm in 48 hours',
    gsiReportCode: 'GSI-KL-2024-L09',
    economicImpact: '₹1,200 Cr infrastructure damage',
    geologicalFormation: 'Charnockitic residual soil overburden with steep 32° bedrock interface',
  },
  {
    id: 'gsi-2023-01',
    year: 2023,
    date: '19 July 2023',
    location: 'Irshalwadi, Khalapur (Raigad)',
    state: 'Maharashtra',
    fatalities: 87,
    trigger: 'Excessive Rainfall',
    rainfallAmount: '498 mm in 3 days',
    gsiReportCode: 'GSI-MH-2023-08',
    economicImpact: 'Complete village buried',
    geologicalFormation: 'Lateritic clay capping over Deccan Trap basalt escarpment',
  },
  {
    id: 'gsi-2023-02',
    year: 2023,
    date: '14 August 2023',
    location: 'Summer Hill & Sanjauli (Shimla)',
    state: 'Himachal Pradesh',
    fatalities: 71,
    trigger: 'Monsoon Cloudburst',
    rainfallAmount: '320 mm in 24 hours',
    gsiReportCode: 'GSI-HP-2023-14',
    economicImpact: '₹850 Cr municipal damages',
    geologicalFormation: 'Jutogh Group weathered mica schist & saturated slope fill',
  },
  {
    id: 'gsi-2021-01',
    year: 2021,
    date: '07 February 2021',
    location: 'Chamoli / Rishiganga Gorge',
    state: 'Uttarakhand',
    fatalities: 204,
    trigger: 'Seismic Activity',
    rainfallAmount: 'Rock-ice avalanche (Glacial detachment)',
    gsiReportCode: 'GSI-UK-2021-02',
    economicImpact: '₹1,500 Cr (Tapovan Vishnugad Hydro project)',
    geologicalFormation: 'Vaikrita metamorphic crystalline rock wedge failure at 5,600m altitude',
  },
  {
    id: 'gsi-2014-01',
    year: 2014,
    date: '30 July 2014',
    location: 'Malin Village (Ambegaon)',
    state: 'Maharashtra',
    fatalities: 151,
    trigger: 'Excessive Rainfall',
    rainfallAmount: '108 mm in 24 hours on saturated base',
    gsiReportCode: 'GSI-MH-2014-01',
    economicImpact: 'Entire settlement destroyed',
    geologicalFormation: 'Terraced slope levelling in deeply weathered amygdaloidal basalt',
  },
  {
    id: 'gsi-2013-01',
    year: 2013,
    date: '16 June 2013',
    location: 'Kedarnath Valley & Mandakini Basin',
    state: 'Uttarakhand',
    fatalities: 5700,
    trigger: 'Monsoon Cloudburst',
    rainfallAmount: '385 mm in 24 hours + Chorabari Moraine breach',
    gsiReportCode: 'GSI-UK-2013-NATIONAL',
    economicImpact: '₹4,500 Cr across 5 hill districts',
    geologicalFormation: 'Glacio-fluvial debris fan destabilization over Higher Himalayan Gneiss',
  },
];
