import type { IncomingMessage, ServerResponse } from 'http';
import { fetchLiveAqiData } from '../../server/aqiService';

export default async function handler(req: IncomingMessage & { query?: any; url?: string }, res: ServerResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

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

    const aqiData = await fetchLiveAqiData(lat, lng, { area, district, state });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(aqiData));
  } catch (error: any) {
    console.error('Vercel API error in air-quality/live:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message || 'Failed to fetch AQI data' }));
  }
}
