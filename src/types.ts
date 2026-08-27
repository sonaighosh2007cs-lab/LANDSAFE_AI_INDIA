export type AgeGroup = 'Under 18' | '18–24' | '25–34' | '35–44' | '45–54' | '55+';

export interface UserLocation {
  // Single Source of Truth Coordinates & Full Geographic Hierarchy
  latitude?: number;
  longitude?: number;
  area: string;
  city?: string;
  district: string;
  state: string;
  country?: string;

  // Normalized coordinates object
  coordinates: {
    lat: number;
    lng: number;
  };

  // Dynamic Geological & Terrain Parameters
  elevation: number; // meters
  slopeAngle: number; // degrees
  lithology: string;
  riskScore: number; // 0-100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  isHazardMonitored: boolean;
  isGpsDetected?: boolean;
}

export interface UserProfile {
  id?: string;
  name: string;
  mobile: string;
  email: string;
  age?: number;
  ageGroup: AgeGroup;
  location: UserLocation;
  savedLocations?: UserLocation[];
  onboarded: boolean;
  registeredAt?: string;
}

export type AppRoute =
  | 'dashboard'
  | 'disaster-news'
  | 'live-weather'
  | 'ai-agent'
  | 'my-area'
  | 'india-map'
  | 'ai-risk-engineering'
  | 'active-warning-hotspot'
  | 'indian-risk-ranking'
  | 'gsi-historical-analysis'
  | 'data-pipelines';

export type SimulationScenario =
  | 'MONSOON_SURGE'
  | 'CYCLONIC_DEPRESSION'
  | 'DRY_SPELL'
  | 'SEISMIC_TREMOR';

export interface ContributingFactor {
  name: string;
  value: number; // percentage or normalized
  displayValue: string;
  color: string;
  iconName: string;
}

export interface SensorTelemetry {
  precipitation: {
    value: number;
    unit: string;
    intensity: 'Low' | 'Moderate' | 'Heavy' | 'Extreme';
  };
  soilMoisture: {
    value: number;
    unit: string;
    saturation: 'Dry' | 'Nominal' | 'Saturated' | 'Super-saturated';
  };
  slopeAngle: {
    value: number;
    unit: string;
    gradient: string;
  };
  groundDisplacement: {
    value: number;
    unit: string;
    rate: string;
  };
  elevation: {
    value: number;
    unit: string;
    terrain: string;
  };
  temperature: {
    value: number;
    unit: string;
    condition: string;
  };
  humidity: {
    value: number;
    unit: string;
    index: string;
  };
  groundCondition: {
    value: number;
    unit: string;
    shearStress: string;
  };
}

export interface CorridorSafety {
  id: string;
  name: string;
  status: 'SAFE' | 'WARNING' | 'CRITICAL' | 'CLOSED';
  riskPercentage: number;
  description: string;
  recommendedAction: string;
  alternateRoute?: string;
}

export interface ActiveAdvisory {
  id: string;
  title: string;
  severity: 'Advisory' | 'Watch' | 'Warning' | 'Critical';
  location: string;
  summary: string;
  protocol: string;
  activeAlertsCount: number;
  sheltersAvailable: number;
  issuedAt: string;
  authority: string;
}

export type DisasterCategory =
  | 'All'
  | 'Flood'
  | 'Heavy Rain'
  | 'Landslide'
  | 'Cyclone'
  | 'Storm'
  | 'Earthquake'
  | 'Tsunami'
  | 'Heatwave'
  | 'Wildfire'
  | 'Cloudburst'
  | 'Avalanche'
  | 'Lightning'
  | 'Land Subsidence'
  | 'Other';

export type DisasterSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
export type NewsStatusBadge = 'LIVE' | 'BREAKING' | 'UPDATED' | 'ONGOING';

export interface VerifiedDisasterNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  imageUrl?: string;
  publishedAt: string;
  formattedDate: string;
  location: {
    state?: string;
    district?: string;
    area?: string;
    label: string;
  };
  disasterType: DisasterCategory;
  severity: DisasterSeverity;
  statusBadge?: NewsStatusBadge;
  isToday: boolean;
  isOfficialWarning?: boolean;
  officialAuthority?: string;
}

export interface DisasterNewsResponse {
  timeframe: 'today' | '30days' | 'my-location';
  totalResults: number;
  lastUpdated: string;
  locationScope: {
    state?: string;
    district?: string;
    area?: string;
    isFallback?: boolean;
    fallbackLevel?: 'district' | 'state' | 'national' | null;
  };
  articles: VerifiedDisasterNewsItem[];
}

export interface DisasterNewsItem {
  id: string;
  title: string;
  summary: string;
  source: 'IMD' | 'GSI' | 'NDMA' | 'SDRF' | 'BRO' | 'PTI' | 'DD News' | string;
  timestamp: string;
  severity: 'Normal' | 'Alert' | 'Severe' | 'Critical';
  state: string;
  category: 'Landslide' | 'Cloudburst' | 'Flash Flood' | 'Highway Blockage' | 'Early Warning' | string;
  verified: boolean;
  affectedDistricts: string[];
}

export interface HotspotZone {
  id: string;
  name: string;
  state: string;
  riskScore: number;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  slopeCreepRate: string;
  rainfall24h: number;
  porePressure: string;
  sensorsOnline: number;
  totalSensors: number;
  status: string;
  evacuationStatus: 'Standby' | 'Active Evacuation' | 'Normal' | 'High Vigilance';
  coordinates: { lat: number; lng: number };
}

export interface RiskRankingEntry {
  rank: number;
  state: string;
  district: string;
  vulnerabilityScore: number;
  gsiZone: 'Very High (Zone V)' | 'High (Zone IV)' | 'Moderate (Zone III)' | 'Low (Zone II)';
  populationExposed: string;
  historicalEventsCount: number;
  sensorDensity: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface HistoricalLandslideEvent {
  id: string;
  year: number;
  date: string;
  location: string;
  state: string;
  fatalities: number;
  trigger: 'Monsoon Cloudburst' | 'Excessive Rainfall' | 'Seismic Activity' | 'Road Excavation' | 'Toe Undercutting';
  rainfallAmount: string;
  gsiReportCode: string;
  economicImpact: string;
  geologicalFormation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  source?: string;
}
