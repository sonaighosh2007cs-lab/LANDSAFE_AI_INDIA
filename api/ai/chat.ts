import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';
import { processChatRequest } from '../../server/aiAssistantEngine';

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    const { message, context, location, history } = await parseBody(req);
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Message is required' }));
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isPlaceholder =
      !apiKey ||
      apiKey === 'MY_GEMINI_API_KEY' ||
      apiKey.trim() === '' ||
      apiKey.startsWith('AIzaSyDummy');

    const ai = isPlaceholder
      ? null
      : new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

    const finalContext = context?.website
      ? context
      : {
          website: 'LandSafe AI',
          timestamp: new Date().toISOString(),
          location: {
            name: location?.area || location?.district || context?.location?.name || 'Current Sector',
            area: location?.area || context?.location?.area || 'Sector',
            district: location?.district || context?.location?.district || 'District',
            state: location?.state || context?.location?.state || 'India',
            country: 'India',
            coordinates: location?.coordinates || context?.location?.coordinates,
            elevation: location?.elevation || context?.environment?.elevation,
            slopeAngle: location?.slopeAngle || context?.environment?.slope,
            lithology: location?.lithology || context?.environment?.lithology,
          },
          risk: {
            score: location?.riskScore ?? context?.risk?.score ?? 28,
            level: location?.riskLevel ?? context?.risk?.level ?? 'LOW',
            delta: context?.risk?.delta ?? '0%',
            scenario: context?.scenario || context?.risk?.scenario || 'MONSOON_SURGE',
          },
          weather: context?.weather || {
            temperature: context?.telemetry?.temperature?.value ?? 22,
            apparentTemperature: context?.telemetry?.temperature?.value ?? 22,
            humidity: context?.telemetry?.humidity?.value ?? 80,
            rainfall: context?.telemetry?.precipitation?.value ?? 8.2,
            windSpeed: 14,
            condition: 'Monitored Conditions',
            aqi: 45,
            aqiCategory: 'Good',
            isLiveTelemetry: false,
          },
          environment: context?.environment || {
            slope: location?.slopeAngle ?? context?.telemetry?.slopeAngle?.value ?? 14.5,
            slopeGradient: context?.telemetry?.slopeAngle?.gradient ?? 'Moderate Incline',
            soilMoisture: context?.telemetry?.soilMoisture?.value ?? 67,
            soilSaturation: context?.telemetry?.soilMoisture?.saturation ?? 'Nominal',
            elevation: location?.elevation ?? context?.telemetry?.elevation?.value ?? 1800,
            groundDisplacement: context?.telemetry?.groundDisplacement
              ? `${context.telemetry.groundDisplacement.value} mm`
              : 'Nominal',
            porePressure: context?.telemetry?.groundCondition
              ? `${context.telemetry.groundCondition.value} kPa`
              : 'Baseline',
          },
          recentDisasters: context?.recentDisasters || [],
          activeAdvisories: context?.activeAdvisories || [],
          safeCorridors: context?.safeCorridors || [],
        };

    const result = await processChatRequest(message.trim(), finalContext, history || [], ai);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (error: any) {
    console.error('Vercel API error in ai/chat:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'AI analysis service error', details: error.message || String(error) }));
  }
}

