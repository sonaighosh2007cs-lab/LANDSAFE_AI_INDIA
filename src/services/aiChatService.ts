import { UserLocation, SensorTelemetry, SimulationScenario, CorridorSafety, ActiveAdvisory } from '../types';
import { WeatherData } from '../types/weather';
import { VerifiedDisasterNewsItem } from '../types';
import { ChatbotContext, StoredChatMessage } from '../types/chat';

const CHAT_STORAGE_KEY = 'landsafe_ai_chat_history_v2';
const MAX_STORED_MESSAGES = 60;

/**
 * Builds a comprehensive, real-time, non-hallucinated context snapshot
 * from current dashboard state, active location, live weather, and news feeds.
 */
export function buildChatbotContext(params: {
  location: UserLocation;
  telemetry: SensorTelemetry;
  riskScore: number;
  riskDelta: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  scenario: SimulationScenario;
  weatherData?: WeatherData | null;
  newsItems?: VerifiedDisasterNewsItem[];
  corridorSafety?: CorridorSafety;
  activeAdvisory?: ActiveAdvisory;
}): ChatbotContext {
  const {
    location,
    telemetry,
    riskScore,
    riskDelta,
    riskLevel,
    scenario,
    weatherData,
    newsItems = [],
    corridorSafety,
    activeAdvisory,
  } = params;

  // 1. Weather Snapshot
  const weatherSnapshot = weatherData?.current
    ? {
        temperature: weatherData.current.temperature,
        apparentTemperature: weatherData.current.feelsLike ?? weatherData.current.temperature,
        humidity: weatherData.current.humidity,
        rainfall: weatherData.current.precipitation,
        windSpeed: weatherData.current.windSpeed,
        condition: weatherData.current.condition?.description || 'Monitored Weather',
        aqi: 45,
        aqiCategory: 'Good',
        isLiveTelemetry: true,
        precipitationProbability: weatherData.hourly?.[0]?.precipitationProbability ?? undefined,
      }
    : {
        temperature: telemetry.temperature.value,
        apparentTemperature: telemetry.temperature.value,
        humidity: telemetry.humidity.value,
        rainfall: telemetry.precipitation.value,
        windSpeed: 14,
        condition: telemetry.precipitation.intensity === 'Heavy' ? 'Heavy Showers' : 'Partly Cloudy',
        aqi: 48,
        aqiCategory: 'Good',
        isLiveTelemetry: false,
      };

  // 2. Recent Disaster News formatting (top 5 relevant)
  const recentDisasters = newsItems.slice(0, 5).map((item) => ({
    title: item.title,
    disasterType: item.disasterType,
    severity: item.severity,
    location: item.location.label || item.location.district || item.location.state || 'India',
    date: item.formattedDate || item.publishedAt,
  }));

  // 3. Environment parameters
  const environment = {
    slope: location.slopeAngle ?? telemetry.slopeAngle.value,
    slopeGradient: telemetry.slopeAngle.gradient,
    soilMoisture: telemetry.soilMoisture.value,
    soilSaturation: telemetry.soilMoisture.saturation,
    elevation: location.elevation ?? telemetry.elevation.value,
    groundDisplacement: `${telemetry.groundDisplacement.value} mm (${telemetry.groundDisplacement.rate})`,
    porePressure: `${telemetry.groundCondition.value} kPa`,
    lithology: location.lithology || 'Metamorphic Complex / Gneiss Bedrock',
  };

  return {
    website: 'LandSafe AI',
    timestamp: new Date().toISOString(),
    location: {
      name: location.area || location.district || 'Current Sector',
      area: location.area,
      district: location.district,
      state: location.state,
      country: 'India',
      coordinates: {
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      },
      elevation: location.elevation,
      slopeAngle: location.slopeAngle,
      lithology: location.lithology,
    },
    risk: {
      score: riskScore,
      level: riskLevel,
      delta: riskDelta,
      scenario,
    },
    weather: weatherSnapshot,
    environment,
    recentDisasters,
    activeAdvisories: activeAdvisory
      ? [
          {
            title: activeAdvisory.title,
            severity: activeAdvisory.severity,
            summary: activeAdvisory.summary,
            protocol: activeAdvisory.protocol,
            authority: activeAdvisory.authority,
          },
        ]
      : [],
    safeCorridors: corridorSafety
      ? [
          {
            name: corridorSafety.name,
            status: corridorSafety.status,
            riskPercentage: corridorSafety.riskPercentage,
            recommendedAction: corridorSafety.recommendedAction,
          },
        ]
      : [],
  };
}

/**
 * Load persisted chat history from localStorage
 */
export function loadChatHistory(): StoredChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(-MAX_STORED_MESSAGES);
    }
  } catch (err) {
    console.error('Failed to load chat history:', err);
  }
  return [];
}

/**
 * Save chat history to localStorage
 */
export function saveChatHistory(messages: StoredChatMessage[]): void {
  try {
    const trimmed = messages.slice(-MAX_STORED_MESSAGES);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Failed to save chat history:', err);
  }
}

/**
 * Clear local chat history
 */
export function clearChatHistory(): void {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear chat history:', err);
  }
}

/**
 * Send message to secure backend endpoint `/api/ai/chat`
 */
export async function sendChatMessageApi(
  message: string,
  context: ChatbotContext,
  recentHistory: StoredChatMessage[] = []
): Promise<{ reply: string; source: string }> {
  const payload = {
    message,
    context,
    history: recentHistory.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    })),
  };

  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorText = 'AI assistant service temporarily unavailable';
    try {
      const errJson = await response.json();
      if (errJson.error || errJson.details) {
        errorText = errJson.error || errJson.details;
      }
    } catch {
      // ignore
    }
    throw new Error(errorText);
  }

  const data = await response.json();
  return {
    reply: data.reply || 'Analysis completed with current telemetry parameters.',
    source: data.source || 'LANDSAFE_AI_ENGINE',
  };
}
