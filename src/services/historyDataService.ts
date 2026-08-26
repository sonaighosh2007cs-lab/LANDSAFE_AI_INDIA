import { UserLocation } from '../types';
import { HistoryTimeRange, LocationHistoricalResponse, HistoricalRecordPoint } from '../types/history';

interface HistoryCacheEntry {
  data: LocationHistoricalResponse;
  lat: number;
  lng: number;
  timeRange: HistoryTimeRange;
  timestamp: number;
}

const historyCache = new Map<string, HistoryCacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export function getHistoryCacheKey(lat: number, lng: number, timeRange: HistoryTimeRange): string {
  return `history:${lat.toFixed(4)}:${lng.toFixed(4)}:${timeRange}`;
}

/**
 * Fetch verified location-specific historical telemetry & risk analysis
 */
export async function fetchValidatedHistory(
  location: UserLocation,
  timeRange: HistoryTimeRange,
  signal?: AbortSignal
): Promise<LocationHistoricalResponse> {
  const { lat, lng } = location.coordinates;
  const cacheKey = getHistoryCacheKey(lat, lng, timeRange);

  // Check valid cache entry
  const cached = historyCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const cityParam = encodeURIComponent(location.area || 'Current Sector');
  const districtParam = encodeURIComponent(location.district || '');
  const stateParam = encodeURIComponent(location.state || '');
  const elevParam = location.elevation ? `&elevation=${location.elevation}` : '';
  const slopeParam = location.slopeAngle ? `&slopeAngle=${location.slopeAngle}` : '';
  const lithParam = location.lithology ? `&lithology=${encodeURIComponent(location.lithology)}` : '';

  const url = `/api/history/telemetry?lat=${lat}&lng=${lng}&range=${timeRange}&city=${cityParam}&district=${districtParam}&state=${stateParam}${elevParam}${slopeParam}${lithParam}`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Historical service responded with status ${res.status}`);
  }

  const data: LocationHistoricalResponse = await res.json();

  // Validate location consistency
  data.location = {
    ...data.location,
    city: location.area,
    district: location.district,
    state: location.state,
    latitude: lat,
    longitude: lng,
    elevation: location.elevation,
    slopeAngle: location.slopeAngle,
    lithology: location.lithology,
  };

  // Cache entry
  historyCache.set(cacheKey, {
    data,
    lat,
    lng,
    timeRange,
    timestamp: Date.now(),
  });

  return data;
}

/**
 * Export historical dataset to clean CSV
 */
export function exportHistoryToCsv(
  location: UserLocation,
  timeRange: HistoryTimeRange,
  records: HistoricalRecordPoint[]
) {
  if (!records || records.length === 0) return;

  const headers = [
    'Timestamp (UTC/ISO)',
    'Local Time (IST)',
    'Date',
    'Location City',
    'District',
    'State',
    'Latitude',
    'Longitude',
    'Temperature (°C)',
    'Max Temp (°C)',
    'Min Temp (°C)',
    'Relative Humidity (%)',
    'Precipitation (mm)',
    'Wind Speed (km/h)',
    'Wind Direction',
    'Air Quality Index (AQI)',
    'AQI Category',
    'PM2.5 (µg/m³)',
    'PM10 (µg/m³)',
    'LandSafe AI Risk Score (0-100)',
    'Risk Level',
    'Landslide Risk Tier',
    'Flood Risk Tier',
    'Weather Condition',
  ];

  const rows = records.map((r) => [
    `"${r.timestamp}"`,
    `"${r.displayTime}"`,
    `"${r.dateOnly}"`,
    `"${location.area || ''}"`,
    `"${location.district || ''}"`,
    `"${location.state || ''}"`,
    location.coordinates.lat,
    location.coordinates.lng,
    r.temperature,
    r.tempMax ?? r.temperature,
    r.tempMin ?? r.temperature,
    r.humidity,
    r.rainfall,
    r.windSpeed,
    `"${r.windDirection || 'N'}"`,
    r.aqi,
    `"${r.aqiCategory}"`,
    r.pm25,
    r.pm10,
    r.riskScore,
    `"${r.riskLevel}"`,
    `"${r.landslideRisk}"`,
    `"${r.floodRisk}"`,
    `"${r.weatherCondition.description}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const locSafe = (location.area || location.district || 'Location').replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `${locSafe}_${timeRange}_Historical_Telemetry.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
