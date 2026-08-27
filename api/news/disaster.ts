import type { IncomingMessage, ServerResponse } from 'http';
import { getIndianDisasterNews, DisasterCategory } from '../../server/disasterNewsService';

export default async function handler(
  req: IncomingMessage & { url?: string },
  res: ServerResponse
) {
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
    const timeframe = (url.searchParams.get('timeframe') as 'today' | '30days' | 'my-location') || 'today';
    const state = url.searchParams.get('state') || undefined;
    const district = url.searchParams.get('district') || undefined;
    const area = url.searchParams.get('area') || undefined;
    const disasterType = (url.searchParams.get('disasterType') as DisasterCategory) || 'All';
    const searchQuery = url.searchParams.get('search') || '';
    const forceRefresh = url.searchParams.get('refresh') === 'true';

    const newsData = await getIndianDisasterNews({
      timeframe,
      state,
      district,
      area,
      disasterType,
      searchQuery,
      forceRefresh,
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=180');
    res.end(JSON.stringify(newsData));
  } catch (error: any) {
    console.error('Vercel API error in news/disaster:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: error.message || 'Failed to fetch disaster news',
        articles: [],
      })
    );
  }
}
