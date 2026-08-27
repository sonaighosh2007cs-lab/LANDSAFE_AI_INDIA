import { UserLocation } from '../types';

export interface GeolocationErrorDetails {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNSUPPORTED' | 'UNKNOWN';
  message: string;
  userFriendlyMessage: string;
}

export interface DynamicGpsResult {
  latitude: number;
  longitude: number;
  area: string;
  city: string;
  district: string;
  state: string;
  country: string;
  displayLocation: string;
  fullAddress?: string;
  elevation: number;
  slopeAngle: number;
  lithology: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  isHazardMonitored: boolean;
}

// Global sequence counter to prevent race conditions across concurrent location changes
let globalLocationRequestId = 0;

export function getNextLocationRequestId(): number {
  globalLocationRequestId += 1;
  return globalLocationRequestId;
}

export function getCurrentLocationRequestId(): number {
  return globalLocationRequestId;
}

/**
 * Obtain device GPS coordinates using the browser's Geolocation API.
 * Asks for permission and handles user denial, timeout, or lack of hardware support cleanly.
 */
export function getDeviceGpsCoordinates(
  timeoutMs = 12000
): Promise<{ latitude: number; longitude: number; accuracy: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator || !navigator.geolocation) {
      const err: GeolocationErrorDetails = {
        code: 'UNSUPPORTED',
        message: 'Geolocation is not supported by your browser.',
        userFriendlyMessage: 'Geolocation is not supported on this device or browser. You can select your location manually.',
      };
      return reject(err);
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: timeoutMs,
      maximumAge: 0, // Always request fresh GPS coordinates
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let code: GeolocationErrorDetails['code'] = 'UNKNOWN';
        let userFriendlyMessage = 'Unable to detect your GPS position. Please select your location manually.';

        if (error.code === error.PERMISSION_DENIED) {
          code = 'PERMISSION_DENIED';
          userFriendlyMessage =
            'Location permission was denied. Please allow location access in your browser settings or select an area manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          code = 'POSITION_UNAVAILABLE';
          userFriendlyMessage =
            'GPS location is currently unavailable on your device. Please ensure location services are enabled.';
        } else if (error.code === error.TIMEOUT) {
          code = 'TIMEOUT';
          userFriendlyMessage =
            'GPS detection request timed out. Please try again or select your location manually.';
        }

        reject({
          code,
          message: error.message || 'Geolocation error',
          userFriendlyMessage,
        });
      },
      options
    );
  });
}

/**
 * Reverse geocode latitude and longitude into an exact locality name and geographical hierarchy.
 * Fallback order strictly respects: Locality / Suburb -> City/Town -> District -> State
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<DynamicGpsResult> {
  // 1. Try server proxy endpoint (/api/geocode/reverse)
  try {
    const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`, { signal });
    if (res.ok) {
      const data = await res.json();
      if (data && data.area) {
        return data;
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    // Server endpoint unreachable; continue to client-side reverse geocoding
  }

  // 2. Client-side reverse geocoding fallback (BigDataCloud Free Reverse Geocode or Nominatim)
  let area = '';
  let city = '';
  let district = '';
  let state = 'India';
  let country = 'India';

  try {
    const bdcRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal }
    );
    if (bdcRes.ok) {
      const bdcData = await bdcRes.json();
      const locality = bdcData.locality || bdcData.localitySubdivision || bdcData.neighbourhood;
      city = bdcData.city || bdcData.principalSubdivisionCity || 'Detected City';
      district = bdcData.localityDistrict || bdcData.principalSubdivision || city;
      state = bdcData.principalSubdivision || 'India';
      country = bdcData.countryName || 'India';

      // Locality -> City/Town -> District -> State
      area = locality || city || district || state;
    }
  } catch (e: any) {
    if (e.name === 'AbortError') throw e;
  }

  if (!area) {
    try {
      const osmRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`,
        {
          headers: { 'Accept-Language': 'en' },
          signal,
        }
      );
      if (osmRes.ok) {
        const osmData = await osmRes.json();
        const addr = osmData.address || {};
        const locality =
          addr.suburb ||
          addr.neighbourhood ||
          addr.quarter ||
          addr.village ||
          addr.residential ||
          addr.town ||
          addr.city_district ||
          addr.city;
        city = addr.city || addr.town || addr.municipality || 'Detected City';
        district = addr.state_district || addr.district || addr.county || city;
        state = addr.state || 'India';
        country = addr.country || 'India';
        area = locality || city || district || state;
      }
    } catch (e: any) {
      if (e.name === 'AbortError') throw e;
    }
  }

  // If still unavailable, create a clean coordinate label
  if (!area) {
    area = `GPS Locality (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`;
    city = 'Local Sector';
    district = 'Detected District';
    state = 'India';
  }

  // Terrain estimation based on geographical zones
  const isHimalayan = lat > 26 && lat < 36 && lng > 73 && lng < 96;
  const isWesternGhats = lat >= 8 && lat <= 20 && lng >= 73 && lng <= 77.5;
  const isNorthEast = lat > 22 && lat <= 29 && lng >= 89 && lng <= 97;

  let elevation = 200;
  let slopeAngle = 10;
  let lithology = 'Quaternary Alluvial Silt & Sedimentary Deposit';
  let isHazardMonitored = false;
  let riskScore = 20;

  if (isHimalayan || isNorthEast) {
    elevation = 1850;
    slopeAngle = 36;
    lithology = 'Gneissic Metamorphic Colluvium & Weathered Phyllite Schist';
    isHazardMonitored = true;
    riskScore = 78;
  } else if (isWesternGhats) {
    elevation = 920;
    slopeAngle = 28;
    lithology = 'Lateritic Basalt & Weathered Khondalite Plateau';
    isHazardMonitored = true;
    riskScore = 64;
  }

  const riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' =
    riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 30 ? 'MODERATE' : 'LOW';

  return {
    latitude: lat,
    longitude: lng,
    area,
    city,
    district,
    state,
    country,
    displayLocation: `${area}, ${state}`,
    elevation,
    slopeAngle,
    lithology,
    riskScore,
    riskLevel,
    isHazardMonitored,
  };
}

/**
 * Constructs a fully normalized UserLocation object from dynamic GPS coordinates & geocoded payload.
 */
export function buildUserLocationFromGps(
  lat: number,
  lng: number,
  details: DynamicGpsResult
): UserLocation {
  const roundedLat = Math.round(lat * 10000) / 10000;
  const roundedLng = Math.round(lng * 10000) / 10000;

  return {
    latitude: roundedLat,
    longitude: roundedLng,
    area: details.area,
    city: details.city || details.district || details.area,
    district: details.district || details.area,
    state: details.state || 'India',
    country: details.country || 'India',
    coordinates: {
      lat: roundedLat,
      lng: roundedLng,
    },
    elevation: details.elevation || 200,
    slopeAngle: details.slopeAngle || 10,
    lithology: details.lithology || 'Alluvial & Metamorphic Rock Mix',
    riskScore: details.riskScore || 25,
    riskLevel: details.riskLevel || 'LOW',
    isHazardMonitored: details.isHazardMonitored ?? false,
    isGpsDetected: true,
  };
}
