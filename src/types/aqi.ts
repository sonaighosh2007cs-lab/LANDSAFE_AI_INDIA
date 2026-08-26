export interface AqiPollutantDetail {
  name: string;
  code: string;
  value: number;
  unit: string;
  status: 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
}

export interface AqiData {
  aqi: number;
  category: 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  categoryColor: string;
  dominantPollutant: string;
  healthRecommendation: string;
  pollutants: {
    pm2_5: AqiPollutantDetail;
    pm10: AqiPollutantDetail;
    no2: AqiPollutantDetail;
    so2: AqiPollutantDetail;
    co: AqiPollutantDetail;
    o3: AqiPollutantDetail;
  };
  source: string;
  updatedAt: string;
  location: {
    area: string;
    district: string;
    state: string;
    lat: number;
    lng: number;
  };
}
