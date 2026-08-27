import type { IncomingMessage, ServerResponse } from 'http';
import { getHistoricalTelemetry, type HistoryTimeRange } from '../../server/historyService';

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
    const city = url.searchParams.get('city') || url.searchParams.get('area') || 'Connaught Place';
    const district = url.searchParams.get('district') || 'New Delhi';
    const state = url.searchParams.get('state') || 'Delhi';
    const range = (url.searchParams.get('range') || '7d') as HistoryTimeRange;
    const elevation = url.searchParams.get('elevation') ? parseFloat(url.searchParams.get('elevation')!) : 500;
    const slopeAngle = url.searchParams.get('slopeAngle') ? parseFloat(url.searchParams.get('slopeAngle')!) : 18;
    const lithology = url.searchParams.get('lithology') || 'Gneissic Metamorphic Complex';

    const historyData = await getHistoricalTelemetry(range, {
      city,
      district,
      state,
      lat,
      lng,
      elevation,
      slopeAngle,
      lithology,
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(historyData));
  } catch (error: any) {
    console.error('Vercel API error in history/telemetry:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message || 'Failed to fetch telemetry history' }));
  }
}
