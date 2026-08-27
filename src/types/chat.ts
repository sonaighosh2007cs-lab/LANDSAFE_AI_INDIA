export interface ChatLocationContext {
  name: string;
  area: string;
  district: string;
  state: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  elevation?: number;
  slopeAngle?: number;
  lithology?: string;
}

export interface ChatRiskContext {
  score: number;
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  delta: string;
  scenario: string;
}

export interface ChatWeatherContext {
  temperature?: number | string;
  apparentTemperature?: number | string;
  humidity?: number | string;
  rainfall?: number | string;
  windSpeed?: number | string;
  condition?: string;
  aqi?: number | string;
  aqiCategory?: string;
  isLiveTelemetry: boolean;
  precipitationProbability?: number;
}

export interface ChatEnvironmentContext {
  slope?: number | string;
  slopeGradient?: string;
  soilMoisture?: number | string;
  soilSaturation?: string;
  elevation?: number | string;
  groundDisplacement?: string;
  porePressure?: string;
  lithology?: string;
}

export interface ChatDisasterItem {
  title: string;
  disasterType: string;
  severity: string;
  location: string;
  date: string;
}

export interface ChatbotContext {
  website: string;
  timestamp: string;
  location: ChatLocationContext;
  risk: ChatRiskContext;
  weather: ChatWeatherContext;
  environment: ChatEnvironmentContext;
  recentDisasters: ChatDisasterItem[];
  historicalRisk?: {
    dominantRiskLevel?: string;
    averageRainfall?: number;
    highRiskEventsCount?: number;
    peakAqi?: number;
  };
  activeAdvisories?: Array<{
    title: string;
    severity: string;
    summary: string;
    protocol: string;
    authority: string;
  }>;
  safeCorridors?: Array<{
    name: string;
    status: string;
    riskPercentage: number;
    recommendedAction: string;
  }>;
}

export interface StoredChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  source?: string;
  locationName?: string;
}
