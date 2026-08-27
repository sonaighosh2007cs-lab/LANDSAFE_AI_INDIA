import { UserLocation, SensorTelemetry, SimulationScenario } from '../../types';
import { WeatherData } from '../../types/weather';
import { AqiData } from '../../types/aqi';
import { VerifiedDisasterNewsItem } from '../../../server/disasterNewsService';

/**
 * Data provenance classification as mandated by LandSafe AI architectural specifications.
 */
export type ProvenanceCategory =
  | 'OBSERVED'          // Raw verified measurements from meteorological / environmental APIs
  | 'MODEL_PREDICTION'  // Physics-grounded Limit Equilibrium & ML inference
  | 'HISTORICAL_DATA'   // Archived official datasets (GSI, IMD, CPCB)
  | 'UNAVAILABLE';      // When no reliable feed exists or API is unreachable

export interface ProvenanceMetadata {
  category: ProvenanceCategory;
  source: string;
  lastUpdated: string; // ISO 8601 string
  lastUpdatedFormatted: string; // Human readable string e.g. "Updated 2 min ago"
  isLive: boolean;
  reliabilityScore: number; // 0 - 100%
  statusNotice?: string;
}

export interface LiveLocationTelemetry {
  location: UserLocation;
  weather: WeatherData | null;
  aqi: AqiData | null;
  sensorMesh: SensorTelemetry;
  riskScore: number;
  riskDelta: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  metadata: {
    weatherProvenance: ProvenanceMetadata;
    aqiProvenance: ProvenanceMetadata;
    sensorMeshProvenance: ProvenanceMetadata;
    riskProvenance: ProvenanceMetadata;
  };
  isLoading: boolean;
  error: string | null;
}

export interface LiveDisasterFeedState {
  articles: VerifiedDisasterNewsItem[];
  totalResults: number;
  lastUpdated: string;
  lastUpdatedFormatted: string;
  provenance: ProvenanceMetadata;
  isLoading: boolean;
  error: string | null;
}

export interface DynamicStateRiskRanking {
  rank: number;
  state: string;
  region: string;
  riskScore: number; // 0 - 100 dynamically calculated
  hazardTier: 'Critical Hazard' | 'High Hazard' | 'Moderate Hazard' | 'Monitored';
  populationAtRisk: string;
  gsiSusceptibilityIndex: number; // 0 - 100 GSI base
  activeAlertLevel: 'Red Alert' | 'Orange Alert' | 'Yellow Watch' | 'Green Normal';
  liveRainfallAnomaly: string;
  incidentsThisYear: number;
  sensorCoverage: number;
  keyVulnerabilityFactors: string[];
  lastUpdated: string;
  source: string;
}
