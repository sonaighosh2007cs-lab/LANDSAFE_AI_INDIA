import {
  DisasterCategory,
  DisasterNewsResponse,
  DisasterNewsTimeframe,
  UserLocation,
} from '../types';

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

  // Build cache key
  const cacheKey = `${timeframe}:${state || 'all'}:${district || 'all'}:${area || 'all'}:${disasterType}:${searchQuery.trim().toLowerCase()}`;

  if (!forceRefresh) {
    const cached = CLIENT_CACHE.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CLIENT_CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const queryParams = new URLSearchParams();
  queryParams.set('timeframe', timeframe);
  if (state && state !== 'India') queryParams.set('state', state);
  if (district && district !== 'District') queryParams.set('district', district);
  if (area && area !== 'Current Sector' && !area.includes('Sector')) queryParams.set('area', area);
  if (disasterType && disasterType !== 'All') queryParams.set('disasterType', disasterType);
  if (searchQuery.trim()) queryParams.set('search', searchQuery.trim());
  if (forceRefresh) queryParams.set('refresh', 'true');

  try {
    const response = await fetch(`/api/news/disaster?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Server responded with HTTP ${response.status}`);
    }

    const data: DisasterNewsResponse = await response.json();

    // Cache result
    CLIENT_CACHE.set(cacheKey, {
      timestamp: Date.now(),
      data,
    });

    return data;
  } catch (error: any) {
    // If request was deliberately aborted by tab change / unmount, rethrow
    if (error.name === 'AbortError') {
      throw error;
    }

    console.error('Error fetching live disaster news:', error);

    // Return empty state with clean error message
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
