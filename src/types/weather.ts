export interface WeatherCondition {
  type: string;
  description: string;
  iconName: string;
  isDaytime: boolean;
}

export interface CurrentWeather {
  temperature: number; // °C
  feelsLike: number; // °C
  tempMax: number; // °C
  tempMin: number; // °C
  condition: WeatherCondition;
  humidity: number; // %
  dewPoint: number; // °C
  heatIndex: number; // °C
  precipitation: number; // mm
  precipitationProbability: number; // %
  precipitationType: string;
  thunderstormProbability: number; // %
  uvIndex: number; // 0-15
  uvDescription: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  windSpeed: number; // km/h
  windDirection: string; // e.g. 'NW', 'SSE'
  windDirectionDegrees: number;
  windGust: number; // km/h
  cloudCover: number; // %
  visibility: number; // km
  visibilityStatus: 'Good' | 'Moderate' | 'Poor';
  pressure: number; // hPa
  isDaytime: boolean;
  sunrise: string;
  sunset: string;
  dayLength: string;
  daylightStatus: 'Daylight' | 'Twilight' | 'Night';
  moonrise: string;
  moonset: string;
  moonPhase: string;
  moonIllumination: number; // %
}

export interface HourlyForecastItem {
  time: string;
  displayTime: string; // 'Now', '2 PM', '3 PM'...
  fullDate: string;
  temperature: number; // °C
  feelsLike: number;
  precipitationProbability: number; // %
  precipitationMm: number; // mm
  condition: WeatherCondition;
  humidity: number;
  uvIndex: number;
  windSpeed: number;
  windDirection: string;
  isDaytime: boolean;
}

export interface DailyForecastItem {
  date: string;
  displayDate: string; // 'Today', 'Tomorrow', 'Thu, 28 Aug'
  dayName: string;
  shortDate: string;
  tempMax: number;
  tempMin: number;
  condition: WeatherCondition;
  precipitationProbability: number;
  precipitationMm: number;
  uvIndexMax: number;
  windSpeedMax: number;
  humidityAvg: number;
  sunrise: string;
  sunset: string;
  moonPhase?: string;
  detailedSummary?: string;
}

export interface HistoricalHourItem {
  time: string;
  displayTime: string;
  temperature: number;
  precipitationMm: number;
  humidity: number;
  condition: WeatherCondition;
}

export interface RainWindowInfo {
  status: 'NO_RAIN' | 'RAIN_LIKELY' | 'ACTIVE_RAIN' | 'INTERMITTENT';
  headline: string;
  details: string;
  expectedStartTime?: string;
  expectedEndTime?: string;
  maxProbabilityNext6h: number;
  totalExpectedRain24h: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: 'WARNING' | 'WATCH' | 'ADVISORY' | 'EXTREME';
  source: string;
  effectiveTime: string;
  expireTime: string;
  description: string;
}

export interface WeatherData {
  location: {
    name: string;
    district: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    elevation?: number;
  };
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  history24h: HistoricalHourItem[];
  rainWindow: RainWindowInfo;
  alerts: WeatherAlert[];
  summary: string;
  dataSource: string;
  lastUpdated: string;
  attributionText?: string;
}
