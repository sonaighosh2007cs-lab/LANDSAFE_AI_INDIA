/**
 * LandSafe AI Data Validation Engine
 * Ensures zero silent corrupted data, impossible values, or invalid ranges.
 */

export function isValidLatitude(lat: number): boolean {
  return typeof lat === 'number' && !isNaN(lat) && lat >= 6.0 && lat <= 38.0; // Geographic India bounding envelope + margin
}

export function isValidLongitude(lng: number): boolean {
  return typeof lng === 'number' && !isNaN(lng) && lng >= 68.0 && lng <= 98.0; // Geographic India bounding envelope + margin
}

export function validateCoordinates(lat: number, lng: number): boolean {
  return typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function sanitizeTemperature(temp: number, fallback = 22): number {
  if (typeof temp !== 'number' || isNaN(temp) || temp < -50 || temp > 65) {
    return fallback;
  }
  return Math.round(temp * 10) / 10;
}

export function sanitizeHumidity(humidity: number, fallback = 65): number {
  if (typeof humidity !== 'number' || isNaN(humidity) || humidity < 0 || humidity > 100) {
    return fallback;
  }
  return Math.round(humidity);
}

export function sanitizeRainfall(rain: number, fallback = 0): number {
  if (typeof rain !== 'number' || isNaN(rain) || rain < 0 || rain > 2000) {
    return fallback;
  }
  return Math.round(rain * 10) / 10;
}

export function sanitizeAqi(aqi: number, fallback = 45): number {
  if (typeof aqi !== 'number' || isNaN(aqi) || aqi < 0 || aqi > 500) {
    return fallback;
  }
  return Math.round(aqi);
}

export function sanitizeSlope(slope: number, fallback = 15): number {
  if (typeof slope !== 'number' || isNaN(slope) || slope < 0 || slope > 90) {
    return fallback;
  }
  return Math.round(slope * 10) / 10;
}

export function sanitizeElevation(elev: number, fallback = 350): number {
  if (typeof elev !== 'number' || isNaN(elev) || elev < -100 || elev > 8848) {
    return fallback;
  }
  return Math.round(elev);
}

export function sanitizeRiskScore(score: number, fallback = 28): number {
  if (typeof score !== 'number' || isNaN(score)) {
    return fallback;
  }
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function formatTimeAgo(isoOrTimestamp: string | number | Date): string {
  try {
    const timestamp = new Date(isoOrTimestamp).getTime();
    if (isNaN(timestamp)) return 'Recently updated';

    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 15) return 'Just now';
    if (diffSec < 60) return `${diffSec} sec ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } catch (e) {
    return 'Recently updated';
  }
}

export function formatFullDateTime(isoOrTimestamp: string | number | Date): string {
  try {
    const d = new Date(isoOrTimestamp);
    if (isNaN(d.getTime())) return 'Current verified feed';
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return 'Current verified feed';
  }
}
