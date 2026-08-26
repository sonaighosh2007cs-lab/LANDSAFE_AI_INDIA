export type HistoryTimeRange = '24h' | '7d' | '1m' | '6m' | '1y';

export interface HistoricalRecordPoint {
  timestamp: string;
  displayTime: string;
  fullDate: string;
  dateOnly: string;
  temperature: number;
  tempMax?: number;
  tempMin?: number;
  humidity: number;
  rainfall: number;
  precipitation: number;
  windSpeed: number;
  windDirection?: string;
  aqi: number;
  aqiCategory: 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  pm25: number;
  pm10: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  floodRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'UNAVAILABLE';
  landslideRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  weatherCondition: {
    type: string;
    description: string;
    iconName: string;
    isDaytime: boolean;
  };
}

export interface HistoricalStatistics {
  averageAQI: number;
  highestAQI: number;
  lowestAQI: number;
  aqiCategoryDistribution: {
    good: number;
    moderate: number;
    poor: number;
    veryPoor: number;
    severe: number;
  };
  averageTemperature: number;
  highestTemperature: number;
  lowestTemperature: number;
  averageHumidity: number;
  highestHumidity: number;
  lowestHumidity: number;
  totalRainfall: number;
  averageRainfall: number;
  highestRainfall: number;
  rainyDaysCount: number;
  averageRisk: number;
  highestRisk: number;
  dominantRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  highRiskEventsCount: number;
  averageWindSpeed: number;
  highestWindSpeed: number;
}

export interface LocationHistoricalResponse {
  location: {
    city: string;
    district: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    slopeAngle?: number;
    lithology?: string;
    timezone: string;
  };
  timeRange: HistoryTimeRange;
  timeRangeLabel: string;
  startDate: string;
  endDate: string;
  totalPoints: number;
  statistics: HistoricalStatistics;
  records: HistoricalRecordPoint[];
  sources: {
    weatherSource: string;
    aqiSource: string;
    geotechnicalSource: string;
  };
  generatedAt: string;
}
