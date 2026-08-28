import {
  DisasterCategory,
  DisasterNewsResponse,
  DisasterNewsTimeframe,
  UserLocation,
} from '../types';
import { executeDisasterNewsAggregation } from './disasterNewsEngine';

export interface FetchNewsOptions {
  timeframe: DisasterNewsTimeframe;
  location?: UserLocation;
  disasterType?: DisasterCategory;
  searchQuery?: string;
  forceRefresh?: boolean;
  signal?: AbortSignal;
}

// In-Memory Client Cache
const CLIENT_CACHE = new Map<string, { timestamp: number; data: DisasterNewsResponse }>();
const CLIENT_CACHE_TTL_MS = 2.0 * 60 * 1000; // 2 minutes

/**
 * Fetch real, verified disaster news for India
 * Tier 1: Try server-side API endpoint (/api/news/disaster)
 * Tier 2 (GitHub Pages / Static Deployment Fallback): Universal client-side aggregation engine
 */
export async function fetchDisasterNews(
  options: FetchNewsOptions
): Promise<DisasterNewsResponse> {
  const {
    timeframe,
    location,
    disasterType = 'All',
    searchQuery = '',
    forceRefresh = false,
    signal,
  } = options;

  const state = location?.state;
  const district = location?.district;
  const area = location?.area;
  const lat = location?.coordinates?.[0];
  const lng = location?.coordinates?.[1];

  // Build cache key
  const cacheKey = `${timeframe}:${state || 'all'}:${district || 'all'}:${area || 'all'}:${lat || 0}:${lng || 0}:${disasterType}:${searchQuery.trim().toLowerCase()}`;

  if (!forceRefresh) {
    const cached = CLIENT_CACHE.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CLIENT_CACHE_TTL_MS) {
      return cached.data;
    }
  }

  // 1. Tier 1: Attempt Server Route (/api/news/disaster)
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('timeframe', timeframe);
    if (state && state !== 'India') queryParams.set('state', state);
    if (district && district !== 'District') queryParams.set('district', district);
    if (area && area !== 'Current Sector' && !area.includes('Sector')) queryParams.set('area', area);
    if (lat !== undefined && !isNaN(lat)) queryParams.set('lat', lat.toString());
    if (lng !== undefined && !isNaN(lng)) queryParams.set('lng', lng.toString());
    if (disasterType && disasterType !== 'All') queryParams.set('disasterType', disasterType);
    if (searchQuery.trim()) queryParams.set('search', searchQuery.trim());
    if (forceRefresh) queryParams.set('refresh', 'true');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);

    const onAbort = () => controller.abort();
    if (signal) signal.addEventListener('abort', onAbort);

    const response = await fetch(`/api/news/disaster?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timer);
    if (signal) signal.removeEventListener('abort', onAbort);

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data: DisasterNewsResponse = await response.json();
      if (data && Array.isArray(data.articles) && data.articles.length > 0) {
        CLIENT_CACHE.set(cacheKey, {
          timestamp: Date.now(),
          data,
        });
        return data;
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError' && signal?.aborted) {
      throw err;
    }
    // Server route unavailable (e.g. GitHub Pages static deployment) -> Fall through to Tier 2
  }

  // 2. Tier 2: Universal Live Client Aggregation Engine (For GitHub Pages & Static Hosts)
  try {
    const clientData = await executeDisasterNewsAggregation({
      timeframe,
      state,
      district,
      area,
      lat,
      lng,
      disasterType,
      searchQuery,
      forceRefresh,
      signal,
    });

    CLIENT_CACHE.set(cacheKey, {
      timestamp: Date.now(),
      data: clientData,
    });

    return clientData;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error;
    }

    console.error('Tier-2 disaster news client engine error:', error);

    return {
      timeframe,
      totalResults: 0,
      lastUpdated: new Date().toISOString(),
      locationScope: {
        state,
        district,
        area,
        isFallback: false,
        fallbackLevel: null,
      },
      articles: [],
      error: 'Live news is temporarily unavailable. Please try again shortly.',
    };
  }
}

/**
 * Clear client cache on demand
 */
export function clearDisasterNewsClientCache() {
  CLIENT_CACHE.clear();
}
