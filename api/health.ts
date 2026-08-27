import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    status: 'ok',
    system: 'LandSafe AI Telemetry & Risk Intelligence Mesh',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production',
  }));
}
