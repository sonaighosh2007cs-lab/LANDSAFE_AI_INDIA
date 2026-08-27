import type { IncomingMessage, ServerResponse } from 'http';
import { fetchCompleteWeatherData } from '../../server/weatherService';

export default async function handler(req: IncomingMessage & { url?: string }, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
    const lat = parseFloat(url.searchParams.get('lat') || '28.6139');
    const lng = parseFloat(url.searchParams.get('lng') || '77.2090');
    const area = url.searchParams.get('area') || 'Connaught Place';
    const district = url.searchParams.get('district') || 'New Delhi';
    const state = url.searchParams.get('state') || 'Delhi';
    const elevation = url.searchParams.get('elevation') ? parseFloat(url.searchParams.get('elevation')!) : undefined;

    const weatherData = await fetchCompleteWeatherData(lat, lng, { area, district, state, elevation });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(weatherData));
  } catch (error: any) {
    console.error('Vercel API error in weather/live:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message || 'Failed to fetch weather data' }));
  }
}
