import { WeatherData } from '../types/weather';
import { UserLocation } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchDirectClientWeather, classifyWeatherError } from './weatherClient';

/**
 * Coordinate proximity threshold in degrees (~5.5 km) to match cached weather grid points
 */
const COORD_TOLERANCE = 0.08;

/**
 * Cache validity threshold in milliseconds (30 minutes)
 */
const CACHE_FRESHNESS_TTL_MS = 30 * 60 * 1000;

/**
 * Memory fallback cache for offline or transient network operations
 */
const inMemoryWeatherCache = new Map<string, { data: WeatherData; timestamp: number }>();

function getCoordKey(lat: number, lng: number): string {
  return `${lat.toFixed(3)}_${lng.toFixed(3)}`;
}

/**
 * Fetch recently cached weather from Supabase PostgreSQL database
 */
export async function fetchCachedWeatherFromSupabase(
  location: UserLocation
): Promise<WeatherData | null> {
  const { lat, lng } = location.coordinates;
  const key = getCoordKey(lat, lng);

  // 1. Fast in-memory cache check
  const memCached = inMemoryWeatherCache.get(key);
  if (memCached && Date.now() - memCached.timestamp < CACHE_FRESHNESS_TTL_MS) {
    return memCached.data;
  }

  // 2. Query Supabase weather_data table if configured
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const minLat = lat - COORD_TOLERANCE;
    const maxLat = lat + COORD_TOLERANCE;
    const minLng = lng - COORD_TOLERANCE;
    const maxLng = lng + COORD_TOLERANCE;

    const { data, error } = await supabase
      .from('weather_data')
      .select('*')
      .gte('latitude', minLat)
      .lte('latitude', maxLat)
      .gte('longitude', minLng)
      .lte('longitude', maxLng)
      .order('recorded_at', { ascending: false })
      .limit(1);

    if (error) {
      console.warn('Supabase weather query notice:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      const record = data[0];
      const recordedTime = record.recorded_at ? new Date(record.recorded_at).getTime() : 0;
      const isFresh = Date.now() - recordedTime < CACHE_FRESHNESS_TTL_MS;

      if (isFresh && record.raw_json) {
        const parsedWeather = record.raw_json as WeatherData;
        if (parsedWeather && parsedWeather.current && typeof parsedWeather.current.temperature === 'number') {
          // Update location metadata with current active name if needed
          parsedWeather.location = {
            ...parsedWeather.location,
            name: location.area || parsedWeather.location.name,
            district: location.district || parsedWeather.location.district,
            state: location.state || parsedWeather.location.state,
            latitude: lat,
            longitude: lng,
            elevation: location.elevation ?? parsedWeather.location.elevation,
          };
          
          inMemoryWeatherCache.set(key, { data: parsedWeather, timestamp: recordedTime });
          return parsedWeather;
        }
      }
    }
  } catch (err) {
    console.warn('Supabase weather cache fetch error (falling back to live fetch):', err);
  }

  return null;
}

/**
 * Persist/Cache fresh WeatherData into Supabase weather_data table
 */
export async function persistWeatherToSupabase(weatherData: WeatherData): Promise<void> {
  const { lat, lng } = {
    lat: weatherData.location.latitude,
    lng: weatherData.location.longitude,
  };
  const key = getCoordKey(lat, lng);

  // Store in memory cache
  inMemoryWeatherCache.set(key, { data: weatherData, timestamp: Date.now() });

  if (!isSupabaseConfigured) {
    return;
  }

  try {
    const current = weatherData.current;
    const loc = weatherData.location;

    const row = {
      area: loc.name || 'Monitoring Sector',
      district: loc.district || loc.name || 'District',
      state: loc.state || 'India',
      latitude: lat,
      longitude: lng,
      temperature: current.temperature,
      feels_like: current.feelsLike,
      temp_max: current.tempMax,
      temp_min: current.tempMin,
      humidity: current.humidity,
      dew_point: current.dewPoint,
      pressure: current.pressure,
      wind_speed: current.windSpeed,
      wind_direction: current.windDirection,
      wind_direction_degrees: current.windDirectionDegrees,
      wind_gust: current.windGust,
      cloud_cover: current.cloudCover,
      uv_index: current.uvIndex,
      visibility_km: current.visibility,
      weather_condition: current.condition.description,
      weather_type: current.condition.type,
      weather_icon: current.condition.iconName,
      is_daytime: current.isDaytime,
      sunrise: current.sunrise ? new Date().toISOString().split('T')[0] + 'T' + current.sunrise : null,
      sunset: current.sunset ? new Date().toISOString().split('T')[0] + 'T' + current.sunset : null,
      raw_json: weatherData,
      recorded_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + CACHE_FRESHNESS_TTL_MS).toISOString(),
    };

    const { error } = await supabase.from('weather_data').insert([row]);
    if (error) {
      console.warn('Supabase weather persistence notice:', error.message);
    }
  } catch (err) {
    console.warn('Supabase weather persistence warning:', err);
  }
}

/**
 * Real-time Supabase subscription for weather_data updates on current coordinates
 */
export function subscribeToWeatherRealtime(
  location: UserLocation,
  onUpdate: (data: WeatherData) => void
): () => void {
  if (!isSupabaseConfigured) {
    return () => {};
  }

  const { lat, lng } = location.coordinates;
  const channelName = `realtime-weather-${lat.toFixed(2)}-${lng.toFixed(2)}-${Date.now()}`;

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'weather_data',
      },
      (payload) => {
        try {
          const newRow = payload.new as any;
          if (newRow && typeof newRow.latitude === 'number' && typeof newRow.longitude === 'number') {
            const dLat = Math.abs(newRow.latitude - lat);
            const dLng = Math.abs(newRow.longitude - lng);
            if (dLat <= COORD_TOLERANCE && dLng <= COORD_TOLERANCE) {
              if (newRow.raw_json) {
                const fresh = newRow.raw_json as WeatherData;
                if (fresh && fresh.current) {
                  onUpdate(fresh);
                }
              }
            }
          }
        } catch (e) {
          console.warn('Realtime weather message processing notice:', e);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * High-performance, location-specific Live Weather Fetcher with Supabase Caching & Realtime
 */
export async function getLiveWeatherForLocation(
  location: UserLocation,
  options: {
    forceRefresh?: boolean;
    signal?: AbortSignal;
  } = {}
): Promise<WeatherData> {
  const { forceRefresh = false, signal } = options;
  const { lat, lng } = location.coordinates;

  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    throw new Error(`Invalid location coordinates for ${location.area || 'selected area'}`);
  }

  // 1. Check Supabase / Memory cache first unless forced refresh
  if (!forceRefresh) {
    const cached = await fetchCachedWeatherFromSupabase(location);
    if (cached) {
      return cached;
    }
  }

  // 2. Fetch fresh 100% real live meteorological telemetry from Open-Meteo
  let freshData: WeatherData;

  // Try server API first if running full-stack
  try {
    const areaParam = encodeURIComponent(location.area || '');
    const districtParam = encodeURIComponent(location.district || '');
    const stateParam = encodeURIComponent(location.state || '');
    const elevParam = location.elevation ? `&elevation=${location.elevation}` : '';

    const url = `/api/weather/live?lat=${lat}&lng=${lng}&area=${areaParam}&district=${districtParam}&state=${stateParam}${elevParam}`;
    const res = await fetch(url, { signal });
    const contentType = res.headers.get('content-type') || '';

    if (res.ok && contentType.includes('application/json')) {
      const serverData: WeatherData = await res.json();
      if (serverData && serverData.current && typeof serverData.current.temperature === 'number') {
        freshData = serverData;
      } else {
        throw new Error('Malformed server weather response');
      }
    } else {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
  } catch (serverErr: any) {
    if (serverErr.name === 'AbortError') {
      throw serverErr;
    }
    // Fallback directly to client Open-Meteo fetcher
    freshData = await fetchDirectClientWeather(location, signal);
  }

  // Ensure metadata matches the exact requested user location
  freshData.location = {
    ...freshData.location,
    name: location.area || freshData.location.name,
    district: location.district || freshData.location.district,
    state: location.state || freshData.location.state,
    latitude: lat,
    longitude: lng,
    elevation: location.elevation ?? freshData.location.elevation,
  };

  // 3. Persist to Supabase asynchronously without blocking client
  persistWeatherToSupabase(freshData).catch((err) => {
    console.warn('Async Supabase weather persistence notice:', err);
  });

  return freshData;
}
