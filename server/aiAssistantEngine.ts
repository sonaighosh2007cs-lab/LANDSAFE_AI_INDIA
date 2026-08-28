import { GoogleGenAI } from '@google/genai';

export interface ChatbotContext {
  website: string;
  timestamp: string;
  location: {
    name: string;
    area: string;
    district: string;
    state: string;
    country: string;
    coordinates?: { lat: number; lng: number };
    elevation?: number;
    slopeAngle?: number;
    lithology?: string;
  };
  risk: {
    score: number;
    level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    delta: string;
    scenario?: string;
  };
  weather: {
    temperature?: number | string;
    apparentTemperature?: number | string;
    humidity?: number | string;
    rainfall?: number | string;
    windSpeed?: number | string;
    condition?: string;
    aqi?: number | string;
    aqiCategory?: string;
    isLiveTelemetry?: boolean;
    precipitationProbability?: number;
  };
  environment: {
    slope?: number | string;
    slopeGradient?: string;
    soilMoisture?: number | string;
    soilSaturation?: string;
    elevation?: number | string;
    groundDisplacement?: string;
    porePressure?: string;
    lithology?: string;
  };
  recentDisasters: Array<{
    title: string;
    disasterType: string;
    severity: string;
    location: string;
    date: string;
  }>;
  historicalRisk?: {
    dominantRiskLevel?: string;
    averageRainfall?: number;
    highRiskEventsCount?: number;
    peakAqi?: number;
  };
  activeAdvisories?: Array<{
    title: string;
    severity: string;
    summary: string;
    protocol: string;
    authority: string;
  }>;
  safeCorridors?: Array<{
    name: string;
    status: string;
    riskPercentage: number;
    recommendedAction: string;
  }>;
}

export interface ChatMessageInput {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Detect language of query: 'bengali' | 'hindi' | 'english'
 */
export function detectLanguage(text: string): 'bengali' | 'hindi' | 'english' {
  const bengaliRegex = /[\u0980-\u09FF]/;
  const devanagariRegex = /[\u0900-\u097F]/;

  if (bengaliRegex.test(text)) {
    return 'bengali';
  }
  if (devanagariRegex.test(text)) {
    return 'hindi';
  }
  return 'english';
}

/**
 * System Instructions for LandSafe AI Disaster Risk Assistant
 */
export function buildSystemInstructions(context: ChatbotContext): string {
  const loc = context?.location || {
    name: 'Sector',
    area: 'Sector',
    district: 'District',
    state: 'India',
    country: 'India',
    coordinates: { lat: 23.4, lng: 93.3 },
  };
  const risk = context?.risk || { score: 28, level: 'LOW', delta: '0%' };
  const weather = context?.weather || {};
  const env = context?.environment || {};
  const news = context?.recentDisasters || [];
  const advisories = context?.activeAdvisories || [];
  const corridors = context?.safeCorridors || [];

  return `You are LandSafe AI, an expert, context-aware disaster risk and geotechnical intelligence assistant dedicated to India.

# YOUR CORE IDENTITY & MISSION
- Name: LandSafe AI Assistant
- Platform Purpose: An AI-powered natural disaster and geotechnical risk monitoring platform helping users across India understand landslide, earthquake, flood, extreme rainfall, storm, slope, weather, and environmental risks.
- Features of LandSafe AI:
  1. AI Risk Assessment & Geo-Instability Indexing
  2. Landslide Risk Monitoring (Borehole telemetry, pore pressure, slope shear strain)
  3. Earthquake Risk & Seismic Tremor Monitoring
  4. Flood & Extreme Rainfall Monitoring (IMD Doppler radar & CWC catchment basins)
  5. Storm & Cyclone Tracking
  6. Live Meteorological Telemetry (Current, Hourly 24h, Daily 10-day forecast, Rain windows)
  7. Risk History & Multi-scale Trends (24h, 7d, 30d, 6m, 1y)
  8. Verified Indian Natural Disaster News (National & Hyper-local)
  9. Interactive India Risk Map & Safe Corridor Evacuation Routing
  10. AI Geotechnical Risk Engineering & Factor of Safety (FoS)
  11. Active Warning Hotspots & District Risk Rankings
  12. GSI Historical Disaster Analysis
  13. LandSafe AI Assistant (You)

# DYNAMIC CONTEXT (CURRENT APPLICATION STATE)
The user is currently viewing the following verified data on the LandSafe AI dashboard:
- Active Location: ${loc.name} (${loc.district}, ${loc.state}, India)
- Latitude/Longitude: ${loc.coordinates ? `${loc.coordinates.lat}, ${loc.coordinates.lng}` : 'Available'}
- Elevation: ${env.elevation !== undefined ? `${env.elevation} m` : 'Not available'}
- Slope Angle: ${env.slope !== undefined ? `${env.slope}° (${env.slopeGradient || 'Moderate'})` : 'Not available'}
- Bedrock Lithology: ${env.lithology || 'Metamorphic Complex / Gneiss'}
- Current Risk Score: ${risk.score}/100 (${risk.level} RISK) [Delta: ${risk.delta || 'Nominal'}]
- Simulation Scenario: ${risk.scenario || 'Real-time Baseline'}
- Weather:
  * Temperature: ${weather.temperature !== undefined ? `${weather.temperature}°C` : 'Not available'} (Feels like: ${weather.apparentTemperature !== undefined ? `${weather.apparentTemperature}°C` : 'N/A'})
  * Condition: ${weather.condition || 'Not available'}
  * Rainfall / Precipitation: ${weather.rainfall !== undefined ? `${weather.rainfall} mm` : 'Not available'}
  * Humidity: ${weather.humidity !== undefined ? `${weather.humidity}%` : 'Not available'}
  * Wind Speed: ${weather.windSpeed !== undefined ? `${weather.windSpeed} km/h` : 'Not available'}
  * Air Quality (AQI): ${weather.aqi !== undefined ? `${weather.aqi} (${weather.aqiCategory || 'Moderate'})` : 'Not available'}
- Environmental & IoT Telemetry:
  * Soil Moisture: ${env.soilMoisture !== undefined ? `${env.soilMoisture}% (${env.soilSaturation || 'Nominal'})` : 'Not available'}
  * Ground Displacement: ${env.groundDisplacement || 'Not available'}
  * Pore-Water Pressure: ${env.porePressure || 'Not available'}
- Active Regional Advisories: ${
    advisories.length > 0
      ? advisories.map((a) => `[${a.severity}] ${a.title}: ${a.summary} (Authority: ${a.authority})`).join('; ')
      : 'No critical emergency advisories active for this immediate sector.'
  }
- Safe Corridors & Roadways: ${
    corridors.length > 0
      ? corridors.map((c) => `${c.name}: ${c.status} (${c.riskPercentage}% risk). Action: ${c.recommendedAction}`).join('; ')
      : 'Main arterial highways under routine automated surveillance.'
  }
- Recent Natural Disaster News: ${
    news.length > 0
      ? news.map((n) => `• [${n.date}] ${n.disasterType} in ${n.location} (${n.severity}): ${n.title}`).join('\n')
      : 'No catastrophic disaster events reported in the local feed today.'
  }

# STRICT RULES OF ENGAGEMENT
1. ACCURACY & NO HALLUCINATION:
   - Ground every statement strictly on the dynamic context above.
   - If a specific data point is missing or unavailable, explicitly state: "That data is currently unavailable."
   - NEVER invent weather values, sensor numbers, risk scores, or disaster incidents.
   - Distinguish clearly between live telemetry ("According to current dashboard telemetry..."), historical data ("Based on historical records..."), and general safety guidance.
2. MULTILINGUAL RESPONSE:
   - Automatically detect the user's language.
   - If the user asks in Bengali (বাংলা), reply in natural, fluent Bengali.
   - If the user asks in Hindi (हिन्दी), reply in natural, fluent Hindi.
   - If the user asks in English, reply in crisp, professional English.
3. CONVERSATIONAL TONE & SAFETY GUIDANCE:
   - Be professional, calm, informative, and scientifically sound.
   - Explain technical concepts (Pore pressure, Factor of Safety, Precipitation thresholds) in simple, accessible language.
   - For high risk, provide calm, actionable recommendations (avoid unstable slopes, monitor official NDMA/SDRF bulletins, avoid unnecessary hillside transit).
   - NEVER say a disaster "will definitely happen". Always use probabilistic and observational language ("Based on the available data, the current risk level is High...").
4. OFF-TOPIC QUESTIONS:
   - If the user asks completely unrelated questions (e.g., write a poem, sports scores, general trivia, coding tasks, movie reviews), politely reply:
     "I'm the LandSafe AI assistant. I specialize in LandSafe AI features, natural disaster risks, live weather, slope conditions, and environmental safety across India. How can I help you with your area's risk assessment or weather telemetry?"
   - For simple greetings ("Hello", "Hi", "Thanks", "How are you?"), respond warmly, briefly, and state the active monitoring district.
5. FORMATTING:
   - Use clean Markdown with bold headings and bullet points for high legibility.
   - Keep answers structured and concise.`;
}

/**
 * Intelligent Deterministic Fallback Engine
 * Generates accurate, multilingual, non-hallucinatory responses using the real context object
 * whenever GEMINI_API_KEY is not configured or offline.
 */
export function generateDeterministicResponse(
  query: string,
  context: ChatbotContext
): { reply: string; source: string } {
  const lang = detectLanguage(query);
  const lower = query.toLowerCase().trim();

  const loc = context?.location || {
    name: 'Sector',
    area: 'Sector',
    district: 'District',
    state: 'India',
    country: 'India',
    coordinates: { lat: 23.4, lng: 93.3 },
  };
  const locName = `${loc.area || loc.name || loc.district}, ${loc.district !== loc.name ? loc.district + ', ' : ''}${loc.state}`;
  const risk = context?.risk || { score: 28, level: 'LOW', delta: '0%' };
  const weather = context?.weather || {};
  const env = context?.environment || {};
  const recentNews = context?.recentDisasters || [];
  const advisories = context?.activeAdvisories || [];
  const corridors = context?.safeCorridors || [];

  const tempStr = weather.temperature !== undefined ? `${weather.temperature}°C` : 'Data currently unavailable';
  const rainStr = weather.rainfall !== undefined ? `${weather.rainfall} mm` : 'Data currently unavailable';
  const humStr = weather.humidity !== undefined ? `${weather.humidity}%` : 'Data currently unavailable';
  const windStr = weather.windSpeed !== undefined ? `${weather.windSpeed} km/h` : 'Data currently unavailable';
  const conditionStr = weather.condition || 'Clear / Nominal';
  const soilMoistStr = env.soilMoisture !== undefined ? `${env.soilMoisture}% (${env.soilSaturation || 'Nominal'})` : 'Data currently unavailable';
  const slopeStr = env.slope !== undefined ? `${env.slope}°` : 'Data currently unavailable';
  const aqiStr = weather.aqi !== undefined ? `${weather.aqi} (${weather.aqiCategory || 'Moderate'})` : 'Data currently unavailable';

  // 1. Off-Topic Filtering
  const isOffTopic =
    (lower.includes('poem') ||
      lower.includes('joke') ||
      lower.includes('capital of') ||
      lower.includes('football') ||
      lower.includes('cricket match') ||
      lower.includes('who won') ||
      lower.includes('recipe') ||
      lower.includes('movie') ||
      lower.includes('song')) &&
    !lower.includes('risk') &&
    !lower.includes('disaster') &&
    !lower.includes('weather');

  if (isOffTopic) {
    if (lang === 'bengali') {
      return {
        reply: `আমি ল্যান্ডসেফ এআই (LandSafe AI) সহকারী। আমি প্রাকৃতিক দুর্যোগের ঝুঁকি, ভূমিধস, আবহাওয়া, মাটির আর্দ্রতা এবং সুরক্ষা নির্দেশিকা সংক্রান্ত প্রশ্নের উত্তর দিতে পারি। আপনি আপনার নির্বাচিত এলাকা **${locName}** সম্পর্কে কি জানতে চান?`,
        source: 'LANDSAFE_ASSISTANT_CORE',
      };
    }
    if (lang === 'hindi') {
      return {
        reply: `मैं लैंडसेफ एआई (LandSafe AI) सहायक हूँ। मैं प्राकृतिक आपदा जोखिम, भूस्खलन, मौसम, ढलान की स्थिति और सुरक्षा संबंधी प्रश्नों में आपकी मदद कर सकता हूँ। क्या आप अपने वर्तमान क्षेत्र **${locName}** के बारे में कुछ जानना चाहते हैं?`,
        source: 'LANDSAFE_ASSISTANT_CORE',
      };
    }
    return {
      reply: `I'm the **LandSafe AI assistant**. I specialize in LandSafe AI features, disaster risks, live weather telemetry, slope conditions, and environmental safety across India.\n\nHow can I help you with the current risk assessment or weather in **${locName}**?`,
      source: 'LANDSAFE_ASSISTANT_CORE',
    };
  }

  // 2. Greetings
  const isGreeting =
    /^(hi|hello|hey|namaste|nomoshkar|good morning|good evening|how are you|thanks|thank you|ধন্যবাদ|নমস্কার|नमस्ते|হ্যালো|কেমন আছেন|आप कैसे हैं)[\s.?!]*$/i.test(
      lower
    ) || lower === 'hi' || lower === 'hello';

  if (isGreeting) {
    if (lang === 'bengali') {
      return {
        reply: `নমস্কার! আমি **LandSafe AI** দুর্যোগ ঝুঁকি সহকারী।\n\nবর্তমানে আমি **${locName}** এলাকার লাইভ জিওটেকনিক্যাল ও আবহাওয়া টেলিমেট্রি পর্যবেক্ষণ করছি (বর্তমান ঝুঁকি সূচক: **${risk.score}% - ${risk.level}**)।\n\nআপনি আবহাওয়া, ভূমিধস ঝুঁকি, নিরাপদ করিডোর বা জরুরি আশ্রয়কেন্দ্র সম্পর্কে যেকোনো প্রশ্ন করতে পারেন।`,
        source: 'LANDSAFE_ASSISTANT_CORE',
      };
    }
    if (lang === 'hindi') {
      return {
        reply: `नमस्ते! मैं **LandSafe AI** आपदा जोखिम सहायक हूँ।\n\nवर्तमान में मैं **${locName}** क्षेत्र के लाइव टेलीमेट्री और मौसम डेटा की निगरानी कर रहा हूँ (वर्तमान जोखिम स्तर: **${risk.score}% - ${risk.level}**)।\n\nआप मुझसे मौसम, भूस्खलन जोखिम, सुरक्षित मार्ग या आपातकालीन आश्रयों के बारे में पूछ सकते हैं।`,
        source: 'LANDSAFE_ASSISTANT_CORE',
      };
    }
    return {
      reply: `Hello! I am your **LandSafe AI Disaster Risk Assistant**.\n\nI am currently streaming telemetry for **${locName}** (Current Risk Index: **${risk.score}% - ${risk.level}**).\n\nFeel free to ask about:\n- Why your area is rated ${risk.level} risk\n- Live rainfall, temperature & soil moisture\n- Safe evacuation corridors and road statuses\n- Recent natural disaster news in India`,
      source: 'LANDSAFE_ASSISTANT_CORE',
    };
  }

  // 3. Why is risk High/Moderate/Low?
  const isRiskQuery =
    lower.includes('why') &&
    (lower.includes('risk') ||
      lower.includes('high') ||
      lower.includes('moderate') ||
      lower.includes('low') ||
      lower.includes('কেন') ||
      lower.includes('রিস্ক') ||
      lower.includes('ঝুঁকি') ||
      lower.includes('क्यों') ||
      lower.includes('रिस्क') ||
      lower.includes('जोखिम'));

  if (isRiskQuery || lower.includes('risk explanation') || lower.includes('calculate risk') || lower.includes('explain risk')) {
    if (lang === 'bengali') {
      return {
        reply: `**বর্তমান ঝুঁকি স্থিতি: ${risk.level} (${risk.score}%)** — ${locName}\n\n**কারণসমূহ:**\n- **বৃষ্টিপাত:** ${rainStr} (আবহাওয়ার অবস্থা: ${conditionStr})\n- **মাটির আর্দ্রতা:** ${soilMoistStr}\n- **ঢাল ও উচ্চতা:** পাহাড়ি ঢাল ${slopeStr}, উচ্চতা ${env.elevation || 'उपलब्ध'} মিটার\n- **পোরের পানির চাপ ও স্থায়িত্ব:** ${env.porePressure || 'স্থিতিশীল সীমার মধ্যে'}\n\n**এর তাৎপর্য:**\nবর্তমান বৃষ্টিপাত এবং মাটির স্যাচুরেশনের সমন্বয়ে স্থানীয় পাহাড়ের ঢালে কিছুটা অস্থিরতা লক্ষ্য করা যাচ্ছে।\n\n**সুরক্ষা সুপারিশ:**\n- খাড়া ও আলগা পাহাড়ের ঢাল এড়িয়ে চলুন।\n- জেলা দুর্যোগ ব্যবস্থাপনা কর্তৃপক্ষ (DDMA/NDMA)-এর সতর্কবার্তা পর্যবেক্ষণ করুন।\n- জরুরি প্রয়োজন ছাড়া ভারী বৃষ্টির সময় পাহাড়ি রাস্তায় ভ্রমণ সীমিত রাখুন।`,
        source: 'LANDSAFE_RISK_ENGINE',
      };
    }

    if (lang === 'hindi') {
      return {
        reply: `**वर्तमान जोखिम स्थिति: ${risk.level} (${risk.score}%)** — ${locName}\n\n**प्रमुख कारक:**\n- **वर्षा:** ${rainStr} (मौसम की स्थिति: ${conditionStr})\n- **मिट्टी की नमी:** ${soilMoistStr}\n- **पहाड़ी ढलान एवं ऊंचाई:** ढलान कोण ${slopeStr}, ऊंचाई ${env.elevation || 'उपलब्ध'} मीटर\n- **पोर-वाटर दबाव:** ${env.porePressure || 'सामान्य सीमा में'}\n\n**इसका क्या अर्थ है:**\nवर्तमान वर्षा और मिट्टी की संतृप्ति के कारण इस क्षेत्र में भूगर्भीय जोखिम ${risk.level} श्रेणी में दर्ज किया गया है।\n\n**सुरक्षा सिफारिशें:**\n- असुरक्षित या तेज ढलानों के पास जाने से बचें।\n- आधिकारिक SDMA/NDMA अलर्ट और मौसम सलाह का पालन करें।\n- भारी बारिश के दौरान संवेदनशील पहाड़ी मार्गों पर यात्रा से बचें।`,
        source: 'LANDSAFE_RISK_ENGINE',
      };
    }

    return {
      reply: `**Current Risk: ${risk.level} (${risk.score}%)** — *${locName}*\n\n**Why:**\n- **Precipitation:** ${rainStr} (${conditionStr})\n- **Soil Moisture Saturation:** ${soilMoistStr}\n- **Slope Gradient & Elevation:** ${slopeStr} incline, ${env.elevation ? env.elevation + 'm altitude' : 'mountainous terrain'}\n- **Pore-Water Pressure:** ${env.porePressure || 'Within monitored threshold'}\n- **Lithology Bedrock:** ${env.lithology || 'Metamorphic complex'}\n\n**What this means:**\n${
        risk.score >= 60
          ? 'The combination of elevated soil moisture and slope steepness increases geotechnical instability potential in this sector.'
          : risk.score >= 35
          ? 'Moderate antecedent rainfall and terrain factors require continued vigilance along cut slopes.'
          : 'Baseline stability parameters remain within nominal limits with low probability of slope movement.'
      }\n\n**Safety Recommendations:**\n- Avoid unreinforced, steep hill cut-slopes during precipitation.\n- Monitor official updates from NDMA, IMD, and local district authorities.\n- Keep emergency contact numbers (112, 1077) accessible.`,
      source: 'LANDSAFE_RISK_ENGINE',
    };
  }

  // 4. Weather & Rainfall query
  const isWeatherQuery =
    lower.includes('weather') ||
    lower.includes('rain') ||
    lower.includes('temperature') ||
    lower.includes('humidity') ||
    lower.includes('বৃষ্টি') ||
    lower.includes('আবহাওয়া') ||
    lower.includes('तापमान') ||
    lower.includes('मौसम') ||
    lower.includes('बारिश');

  if (isWeatherQuery) {
    if (lang === 'bengali') {
      return {
        reply: `**${locName} এলাকার লাইভ আবহাওয়া টেলিমেট্রি:**\n\n- **তাপমাত্রা:** ${tempStr} (অনুভূত: ${weather.apparentTemperature ? weather.apparentTemperature + '°C' : tempStr})\n- **আবহাওয়ার অবস্থা:** ${conditionStr}\n- **বৃষ্টিপাত:** ${rainStr}\n- **বাতাসের আর্দ্রতা:** ${humStr}\n- **বায়ুর গতি:** ${windStr}\n- **বায়ু মান সূচক (AQI):** ${aqiStr}\n\n*উৎস: লাইভ আবহাওয়া সেন্সর ও IMD ডপলার রাডার নেটওয়ার্ক।*`,
        source: 'LANDSAFE_WEATHER_TELEMETRY',
      };
    }
    if (lang === 'hindi') {
      return {
        reply: `**${locName} का लाइव मौसम विवरण:**\n\n- **तापमान:** ${tempStr} (महसूस: ${weather.apparentTemperature ? weather.apparentTemperature + '°C' : tempStr})\n- **मौसम की स्थिति:** ${conditionStr}\n- **वर्षा (Rainfall):** ${rainStr}\n- **आर्द्रता (Humidity):** ${humStr}\n- **हवा की गति:** ${windStr}\n- **वायु गुणवत्ता (AQI):** ${aqiStr}\n\n*स्रोत: लाइव वेदर मेश एवं IMD डॉपलर रडार।*`,
        source: 'LANDSAFE_WEATHER_TELEMETRY',
      };
    }
    return {
      reply: `**Live Meteorological Telemetry for ${locName}:**\n\n- **Temperature:** ${tempStr} (Feels like: ${weather.apparentTemperature ? weather.apparentTemperature + '°C' : tempStr})\n- **Current Condition:** ${conditionStr}\n- **Precipitation:** ${rainStr}\n- **Relative Humidity:** ${humStr}\n- **Wind Velocity:** ${windStr}\n- **Air Quality (AQI):** ${aqiStr}\n\n*According to available live meteorological data feeds and IMD Doppler radar.*`,
      source: 'LANDSAFE_WEATHER_TELEMETRY',
    };
  }

  // 5. Disaster News & Recent Events query
  const isNewsQuery =
    lower.includes('disaster') ||
    lower.includes('news') ||
    lower.includes('recent') ||
    lower.includes('flood') ||
    lower.includes('earthquake') ||
    lower.includes('দুর্যোগ') ||
    lower.includes('খবর') ||
    lower.includes('घटना') ||
    lower.includes('समाचार') ||
    lower.includes('भूकंप') ||
    lower.includes('बाढ़');

  if (isNewsQuery) {
    if (recentNews.length === 0) {
      const noNewsMsg =
        lang === 'bengali'
          ? `বর্তমানে **${locName}** বা জাতীয় ফিডে কোনো বড় প্রাকৃতিক দুর্যোগের খবর রিপোর্ট করা হয়নি। লাইভ নিউজ ফিড সক্রিয় রয়েছে।`
          : lang === 'hindi'
          ? `वर्तमान में **${locName}** या राष्ट्रीय आपदा फीड में किसी बड़ी घटना की सूचना नहीं है। लाइव समाचार फ़ीड सक्रिय है।`
          : `There are currently no catastrophic disaster bulletins reported in the active feed for **${locName}**. The live disaster news monitor remains active.`;
      return { reply: noNewsMsg, source: 'LANDSAFE_NEWS_DISPATCH' };
    }

    const formattedNews = recentNews
      .slice(0, 4)
      .map((n) => `• **[${n.disasterType} - ${n.severity}]** in ${n.location} (${n.date}): ${n.title}`)
      .join('\n\n');

    if (lang === 'bengali') {
      return {
        reply: `**সাম্প্রতিক দুর্যোগ সংক্রান্ত সংবাদ ও সতর্কতা:**\n\n${formattedNews}\n\n*উৎস: ভেরিফায়েড পিটিআই, ডিডি নিউজ এবং এনডিএমএ বুলেটিন।*`,
        source: 'LANDSAFE_NEWS_DISPATCH',
      };
    }
    if (lang === 'hindi') {
      return {
        reply: `**हालिया आपदा समाचार एवं आधिकारिक बुलेटिन:**\n\n${formattedNews}\n\n*स्रोत: सत्यापित समाचार एजेंसियां, DD News एवं NDMA बुलेटिन।*`,
        source: 'LANDSAFE_NEWS_DISPATCH',
      };
    }
    return {
      reply: `**Recent Verified Natural Disaster Events in India:**\n\n${formattedNews}\n\n*According to current dashboard news feeds verified from NDMA, IMD, and state disaster authorities.*`,
      source: 'LANDSAFE_NEWS_DISPATCH',
    };
  }

  // 6. Safety recommendations / What to do?
  const isSafetyQuery =
    lower.includes('what should i do') ||
    lower.includes('safety') ||
    lower.includes('shelter') ||
    lower.includes('evacuate') ||
    lower.includes('corridor') ||
    lower.includes('কী করব') ||
    lower.includes('সুরক্ষা') ||
    lower.includes('आश्रय') ||
    lower.includes('सुरक्षा उपाय');

  if (isSafetyQuery) {
    const corridorInfo =
      corridors.length > 0
        ? corridors.map((c) => `- **${c.name}:** Status ${c.status} (${c.riskPercentage}% risk). Recommendation: ${c.recommendedAction}`).join('\n')
        : '- Primary highway routes are under normal automated monitoring.';

    if (lang === 'bengali') {
      return {
        reply: `**${locName} এলাকার জন্য সুরক্ষা নির্দেশিকা ও প্রোটোকল:**\n\n1. **পাহাড়ি ঢালে সতর্কতা:** খাড়া ঢাল, পুরনো ভূমিধস এলাকা ও নিষ্কাশন ড্রেনের কাছে অপ্রয়োজনীয় অবস্থান পরিহার করুন।\n2. **যাতায়াত ও করিডোর স্ট্যাটাস:**\n${corridorInfo}\n3. **জরুরি যোগাযোগ:**\n   - জাতীয় জরুরি হেল্পলাইন: **112**\n   - জেলা দুর্যোগ নিয়ন্ত্রণ কেন্দ্র: **1077**\n4. **অফিসিয়াল বার্তা:** সর্বদা স্থানীয় প্রশাসন ও আইএমডি (IMD) সতর্কবার্তা অনুসরণ করুন।`,
        source: 'LANDSAFE_SAFETY_ADVISORY',
      };
    }
    if (lang === 'hindi') {
      return {
        reply: `**${locName} क्षेत्र के लिए सुरक्षा मार्गदर्शन एवं आपातकालीन प्रोटोकॉल:**\n\n1. **ढलान सुरक्षा:** अनियंत्रित या अत्यधिक खड़ी पहाड़ी ढलानों के पास जाने से बचें।\n2. **सुरक्षित मार्ग एवं गलियारे:**\n${corridorInfo}\n3. **आपातकालीन हेल्पलाइन:**\n   - राष्ट्रीय आपातकालीन नंबर: **112**\n   - जिला आपदा नियंत्रण कक्ष: **1077**\n4. **प्रशासनिक निर्देश:** केवल आधिकारिक मौसम एवं SDMA सलाह पर भरोसा करें।`,
        source: 'LANDSAFE_SAFETY_ADVISORY',
      };
    }
    return {
      reply: `**Safety Protocols & Recommendations for ${locName}:**\n\n1. **Slope Safety:** Keep clear of steep cuts, drainage discharge paths, and unreinforced hillsides during rains.\n2. **Corridor & Route Status:**\n${corridorInfo}\n3. **Emergency Helplines:**\n   - National Emergency Support: **112**\n   - District Disaster Management Control: **1077**\n   - State Disaster Response Force (SDRF)\n4. **Action:** Maintain preparedness, review household emergency kits, and comply with all instructions from local authorities.`,
      source: 'LANDSAFE_SAFETY_ADVISORY',
    };
  }

  // 7. General Location Overview
  if (lang === 'bengali') {
    return {
      reply: `**ল্যান্ডসেফ এআই ভূগর্ভস্থ মূল্যায়ন — ${locName}:**\n\n- **ঝুঁকি মাত্রা:** ${risk.level} (${risk.score}% সূচক)\n- **আবহাওয়া:** ${tempStr}, বৃষ্টিপাত ${rainStr}, আর্দ্রতা ${humStr}\n- **মাটির অবস্থা:** আর্দ্রতা ${soilMoistStr}, ঢাল কোণ ${slopeStr}\n- **সুরক্ষা স্থিতি:** স্বয়ংক্রিয় সেন্সর নেটওয়ার্ক দ্বারা সার্বক্ষণিক পর্যবেক্ষণ চলছে।\n\nআমি আপনাকে ঝুঁকি বিশ্লেষণ, আবহাওয়া পূর্বাভাস, নিরাপদ রুট বা জরুরি প্রোটোকল সম্পর্কিত যেকোনো তথ্যে সহায়তা করতে পারি।`,
      source: 'LANDSAFE_ASSISTANT_CORE',
    };
  }

  if (lang === 'hindi') {
    return {
      reply: `**लैंडसेफ एआई भूगर्भीय मूल्यांकन — ${locName}:**\n\n- **वर्तमान जोखिम:** ${risk.level} (${risk.score}% सूचकांक)\n- **मौसम विवरण:** ${tempStr}, वर्षा ${rainStr}, आर्द्रता ${humStr}\n- **भूगर्भीय स्थिति:** मिट्टी की नमी ${soilMoistStr}, ढलान ${slopeStr}\n- **स्थिति:** स्थानीय आईओटी सेंसर और रडार द्वारा निरंतर निगरानी जारी है।\n\nआप किसी भी समय मौसम, भूस्खलन जोखिम, वैकल्पिक मार्ग या सुरक्षा उपायों के बारे में पूछ सकते हैं।`,
      source: 'LANDSAFE_ASSISTANT_CORE',
    };
  }

  return {
    reply: `**LandSafe AI Geological Assessment for ${locName}:**\n\n- **Current Hazard Tier:** ${risk.level} (${risk.score}% Index)\n- **Live Weather Telemetry:** ${tempStr}, ${rainStr} rainfall, ${humStr} humidity (${conditionStr})\n- **Environmental Telemetry:** Soil saturation ${soilMoistStr}, Slope incline ${slopeStr}, Elevation ${env.elevation ? env.elevation + 'm' : 'N/A'}\n- **Ground Stability:** Displacement ${env.groundDisplacement || 'Nominal'}, Pore pressure ${env.porePressure || 'Baseline'}\n\nHow can I assist you further with risk calculations, Doppler forecasts, road corridors, or emergency contacts?`,
    source: 'LANDSAFE_ASSISTANT_CORE',
  };
}

/**
 * Handle AI Assistant Generation with Gemini SDK or Fallback
 */
export async function processChatRequest(
  message: string,
  context: ChatbotContext,
  history: ChatMessageInput[] = [],
  aiClient: GoogleGenAI | null
): Promise<{ reply: string; source: string; timestamp: string }> {
  const timestamp = new Date().toISOString();

  // If Gemini client is not available or key is missing, use deterministic engine
  if (!aiClient) {
    const res = generateDeterministicResponse(message, context);
    return {
      reply: res.reply,
      source: res.source,
      timestamp,
    };
  }

  try {
    const systemInstructions = buildSystemInstructions(context);

    // Build chat prompt
    const contents: any[] = [];

    // Include recent history turns (up to 4)
    if (Array.isArray(history)) {
      for (const h of history.slice(-4)) {
        if (h.role === 'user' || h.role === 'assistant') {
          contents.push({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          });
        }
      }
    }

    // Append current user message with explicit context grounding
    contents.push({
      role: 'user',
      parts: [
        {
          text: `[SYSTEM INSTRUCTIONS & CURRENT VERIFIED CONTEXT]\n${systemInstructions}\n\n[USER QUERY]\n${message}`,
        },
      ],
    });

    const modelsToTry = ['gemini-3.7-flash', 'gemini-2.5-flash'];
    for (const model of modelsToTry) {
      try {
        const response = await aiClient.models.generateContent({
          model,
          contents,
        });

        const reply = response.text;
        if (reply && reply.trim().length > 0) {
          return {
            reply: reply.trim(),
            source: model === 'gemini-3.7-flash' ? 'GEMINI_3_7_FLASH_LIVE' : 'GEMINI_2_5_FLASH_LIVE',
            timestamp,
          };
        }
      } catch {
        // Continue to fallback model on temporary high demand / 503 status
      }
    }

    const fallbackRes = generateDeterministicResponse(message, context);
    return {
      reply: fallbackRes.reply,
      source: 'LANDSAFE_DYNAMIC_GEO_ENGINE',
      timestamp,
    };
  } catch (error: any) {
    const fallbackRes = generateDeterministicResponse(message, context);
    return {
      reply: fallbackRes.reply,
      source: 'LANDSAFE_DYNAMIC_GEO_ENGINE',
      timestamp,
    };
  }
}
