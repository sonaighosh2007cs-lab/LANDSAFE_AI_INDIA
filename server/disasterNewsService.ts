export type DisasterCategory =
  | 'All'
  | 'Flood'
  | 'Heavy Rain'
  | 'Landslide'
  | 'Cyclone'
  | 'Storm'
  | 'Earthquake'
  | 'Tsunami'
  | 'Heatwave'
  | 'Wildfire'
  | 'Cloudburst'
  | 'Avalanche'
  | 'Lightning'
  | 'Land Subsidence'
  | 'Other';

export type DisasterSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
export type NewsStatusBadge = 'LIVE' | 'BREAKING' | 'UPDATED' | 'ONGOING';
export type DisasterNewsTimeframe = 'all' | '30days' | 'today' | 'my-location';

export interface VerifiedDisasterNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  imageUrl?: string;
  publishedAt: string; // ISO 8601
  formattedDate: string;
  location: {
    state?: string;
    district?: string;
    area?: string;
    label: string;
  };
  disasterType: DisasterCategory;
  severity: DisasterSeverity;
  statusBadge?: NewsStatusBadge;
  isToday: boolean;
  isOfficialWarning?: boolean;
  officialAuthority?: string;
}

export interface DisasterNewsResponse {
  timeframe: DisasterNewsTimeframe;
  totalResults: number;
  lastUpdated: string;
  locationScope: {
    state?: string;
    district?: string;
    area?: string;
    isFallback?: boolean;
    fallbackLevel?: 'district' | 'state' | 'national' | null;
  };
  articles: VerifiedDisasterNewsItem[];
  error?: string;
}

// In-Memory Cache for fast response & rate protection
interface CacheEntry {
  timestamp: number;
  data: DisasterNewsResponse;
}

const NEWS_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 2.5 * 60 * 1000; // 2.5 minutes cache

// Comprehensive Indian States and Union Territories
const INDIAN_STATES_AND_UTS: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar',
  'Chandigarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

// Major Indian Disaster-Prone Districts, Cities & Regions mapping to their state
const INDIAN_REGIONAL_MAP: Record<string, { state: string; district?: string }> = {
  wayanad: { state: 'Kerala', district: 'Wayanad' },
  idukki: { state: 'Kerala', district: 'Idukki' },
  munnar: { state: 'Kerala', district: 'Idukki' },
  kozhikode: { state: 'Kerala', district: 'Kozhikode' },
  malappuram: { state: 'Kerala', district: 'Malappuram' },
  palakkad: { state: 'Kerala', district: 'Palakkad' },
  thrissur: { state: 'Kerala', district: 'Thrissur' },
  ernakulam: { state: 'Kerala', district: 'Ernakulam' },
  kottayam: { state: 'Kerala', district: 'Kottayam' },
  alappuzha: { state: 'Kerala', district: 'Alappuzha' },
  pathanamthitta: { state: 'Kerala', district: 'Pathanamthitta' },
  kannur: { state: 'Kerala', district: 'Kannur' },
  kasaragod: { state: 'Kerala', district: 'Kasaragod' },
  thiruvananthapuram: { state: 'Kerala', district: 'Thiruvananthapuram' },
  shimla: { state: 'Himachal Pradesh', district: 'Shimla' },
  manali: { state: 'Himachal Pradesh', district: 'Kullu' },
  kullu: { state: 'Himachal Pradesh', district: 'Kullu' },
  mandi: { state: 'Himachal Pradesh', district: 'Mandi' },
  dharamshala: { state: 'Himachal Pradesh', district: 'Kangra' },
  kangra: { state: 'Himachal Pradesh', district: 'Kangra' },
  chamba: { state: 'Himachal Pradesh', district: 'Chamba' },
  kinnaur: { state: 'Himachal Pradesh', district: 'Kinnaur' },
  lahaul: { state: 'Himachal Pradesh', district: 'Lahaul and Spiti' },
  spiti: { state: 'Himachal Pradesh', district: 'Lahaul and Spiti' },
  solan: { state: 'Himachal Pradesh', district: 'Solan' },
  sirmaur: { state: 'Himachal Pradesh', district: 'Sirmaur' },
  bilaspur: { state: 'Himachal Pradesh', district: 'Bilaspur' },
  dehradun: { state: 'Uttarakhand', district: 'Dehradun' },
  rishikesh: { state: 'Uttarakhand', district: 'Dehradun' },
  haridwar: { state: 'Uttarakhand', district: 'Haridwar' },
  chamoli: { state: 'Uttarakhand', district: 'Chamoli' },
  joshimath: { state: 'Uttarakhand', district: 'Chamoli' },
  kedarnath: { state: 'Uttarakhand', district: 'Rudraprayag' },
  badrinath: { state: 'Uttarakhand', district: 'Chamoli' },
  uttarkashi: { state: 'Uttarakhand', district: 'Uttarkashi' },
  rudraprayag: { state: 'Uttarakhand', district: 'Rudraprayag' },
  tehri: { state: 'Uttarakhand', district: 'Tehri Garhwal' },
  nainital: { state: 'Uttarakhand', district: 'Nainital' },
  almora: { state: 'Uttarakhand', district: 'Almora' },
  pithoragarh: { state: 'Uttarakhand', district: 'Pithoragarh' },
  bageshwar: { state: 'Uttarakhand', district: 'Bageshwar' },
  champawat: { state: 'Uttarakhand', district: 'Champawat' },
  darjeeling: { state: 'West Bengal', district: 'Darjeeling' },
  kalimpong: { state: 'West Bengal', district: 'Kalimpong' },
  kurseong: { state: 'West Bengal', district: 'Darjeeling' },
  siliguri: { state: 'West Bengal', district: 'Darjeeling' },
  jalpaiguri: { state: 'West Bengal', district: 'Jalpaiguri' },
  alipurduar: { state: 'West Bengal', district: 'Alipurduar' },
  'cooch behar': { state: 'West Bengal', district: 'Cooch Behar' },
  kolkata: { state: 'West Bengal', district: 'Kolkata' },
  howrah: { state: 'West Bengal', district: 'Howrah' },
  malda: { state: 'West Bengal', district: 'Malda' },
  murshidabad: { state: 'West Bengal', district: 'Murshidabad' },
  sunderbans: { state: 'West Bengal' },
  digha: { state: 'West Bengal', district: 'Purba Medinipur' },
  gangtok: { state: 'Sikkim', district: 'East Sikkim' },
  mangan: { state: 'Sikkim', district: 'North Sikkim' },
  namchi: { state: 'Sikkim', district: 'South Sikkim' },
  gyalshing: { state: 'Sikkim', district: 'West Sikkim' },
  chungthang: { state: 'Sikkim', district: 'North Sikkim' },
  guwahati: { state: 'Assam', district: 'Kamrup Metropolitan' },
  dibrugarh: { state: 'Assam', district: 'Dibrugarh' },
  silchar: { state: 'Assam', district: 'Cachar' },
  cachar: { state: 'Assam', district: 'Cachar' },
  karimganj: { state: 'Assam', district: 'Karimganj' },
  hailakandi: { state: 'Assam', district: 'Hailakandi' },
  jorhat: { state: 'Assam', district: 'Jorhat' },
  nagaon: { state: 'Assam', district: 'Nagaon' },
  barpeta: { state: 'Assam', district: 'Barpeta' },
  dhubri: { state: 'Assam', district: 'Dhubri' },
  golaghat: { state: 'Assam', district: 'Golaghat' },
  sonitpur: { state: 'Assam', district: 'Sonitpur' },
  dhemaji: { state: 'Assam', district: 'Dhemaji' },
  lakhimpur: { state: 'Assam', district: 'Lakhimpur' },
  kaziranga: { state: 'Assam', district: 'Golaghat' },
  majuli: { state: 'Assam', district: 'Majuli' },
  morigaon: { state: 'Assam', district: 'Morigaon' },
  brahmaputra: { state: 'Assam' },
  teesta: { state: 'West Bengal' },
  mumbai: { state: 'Maharashtra', district: 'Mumbai' },
  pune: { state: 'Maharashtra', district: 'Pune' },
  thane: { state: 'Maharashtra', district: 'Thane' },
  raigad: { state: 'Maharashtra', district: 'Raigad' },
  ratnagiri: { state: 'Maharashtra', district: 'Ratnagiri' },
  sindhudurg: { state: 'Maharashtra', district: 'Sindhudurg' },
  kolhapur: { state: 'Maharashtra', district: 'Kolhapur' },
  satara: { state: 'Maharashtra', district: 'Satara' },
  nashik: { state: 'Maharashtra', district: 'Nashik' },
  konkan: { state: 'Maharashtra' },
  mahabaleshwar: { state: 'Maharashtra', district: 'Satara' },
  puri: { state: 'Odisha', district: 'Puri' },
  cuttack: { state: 'Odisha', district: 'Cuttack' },
  bhubaneswar: { state: 'Odisha', district: 'Khordha' },
  balasore: { state: 'Odisha', district: 'Balasore' },
  bhadrak: { state: 'Odisha', district: 'Bhadrak' },
  ganjam: { state: 'Odisha', district: 'Ganjam' },
  jagatsinghpur: { state: 'Odisha', district: 'Jagatsinghpur' },
  kendrapara: { state: 'Odisha', district: 'Kendrapara' },
  paradeep: { state: 'Odisha', district: 'Jagatsinghpur' },
  chennai: { state: 'Tamil Nadu', district: 'Chennai' },
  nilgiris: { state: 'Tamil Nadu', district: 'Nilgiris' },
  ooty: { state: 'Tamil Nadu', district: 'Nilgiris' },
  kodaikanal: { state: 'Tamil Nadu', district: 'Dindigul' },
  coimbatore: { state: 'Tamil Nadu', district: 'Coimbatore' },
  cuddalore: { state: 'Tamil Nadu', district: 'Cuddalore' },
  nagapattinam: { state: 'Tamil Nadu', district: 'Nagapattinam' },
  patna: { state: 'Bihar', district: 'Patna' },
  bhagalpur: { state: 'Bihar', district: 'Bhagalpur' },
  katihar: { state: 'Bihar', district: 'Katihar' },
  purnia: { state: 'Bihar', district: 'Purnia' },
  araria: { state: 'Bihar', district: 'Araria' },
  kishanganj: { state: 'Bihar', district: 'Kishanganj' },
  supaul: { state: 'Bihar', district: 'Supaul' },
  madhepura: { state: 'Bihar', district: 'Madhepura' },
  saharsa: { state: 'Bihar', district: 'Saharsa' },
  muzaffarpur: { state: 'Bihar', district: 'Muzaffarpur' },
  darbhanga: { state: 'Bihar', district: 'Darbhanga' },
  samastipur: { state: 'Bihar', district: 'Samastipur' },
  srinagar: { state: 'Jammu and Kashmir', district: 'Srinagar' },
  jammu: { state: 'Jammu and Kashmir', district: 'Jammu' },
  anantnag: { state: 'Jammu and Kashmir', district: 'Anantnag' },
  baramulla: { state: 'Jammu and Kashmir', district: 'Baramulla' },
  kupwara: { state: 'Jammu and Kashmir', district: 'Kupwara' },
  doda: { state: 'Jammu and Kashmir', district: 'Doda' },
  kishtwar: { state: 'Jammu and Kashmir', district: 'Kishtwar' },
  ramban: { state: 'Jammu and Kashmir', district: 'Ramban' },
  reasi: { state: 'Jammu and Kashmir', district: 'Reasi' },
  leh: { state: 'Ladakh', district: 'Leh' },
  kargil: { state: 'Ladakh', district: 'Kargil' },
  visakhapatnam: { state: 'Andhra Pradesh', district: 'Visakhapatnam' },
  vijayawada: { state: 'Andhra Pradesh', district: 'NTR' },
  kakinada: { state: 'Andhra Pradesh', district: 'Kakinada' },
  tirupati: { state: 'Andhra Pradesh', district: 'Tirupati' },
  bengaluru: { state: 'Karnataka', district: 'Bengaluru Urban' },
  mangalore: { state: 'Karnataka', district: 'Dakshina Kannada' },
  udupi: { state: 'Karnataka', district: 'Udupi' },
  karwar: { state: 'Karnataka', district: 'Uttara Kannada' },
  coorg: { state: 'Karnataka', district: 'Kodagu' },
  kodagu: { state: 'Karnataka', district: 'Kodagu' },
  chikkamagaluru: { state: 'Karnataka', district: 'Chikkamagaluru' },
  shivamogga: { state: 'Karnataka', district: 'Shivamogga' },
  ahmedabad: { state: 'Gujarat', district: 'Ahmedabad' },
  surat: { state: 'Gujarat', district: 'Surat' },
  vadodara: { state: 'Gujarat', district: 'Vadodara' },
  rajkot: { state: 'Gujarat', district: 'Rajkot' },
  kutch: { state: 'Gujarat', district: 'Kutch' },
  bhuj: { state: 'Gujarat', district: 'Kutch' },
  saurashtra: { state: 'Gujarat' },
  jaipur: { state: 'Rajasthan', district: 'Jaipur' },
  jodhpur: { state: 'Rajasthan', district: 'Jodhpur' },
  udaipur: { state: 'Rajasthan', district: 'Udaipur' },
  kota: { state: 'Rajasthan', district: 'Kota' },
  lucknow: { state: 'Uttar Pradesh', district: 'Lucknow' },
  varanasi: { state: 'Uttar Pradesh', district: 'Varanasi' },
  prayagraj: { state: 'Uttar Pradesh', district: 'Prayagraj' },
  gorakhpur: { state: 'Uttar Pradesh', district: 'Gorakhpur' },
  ayodhya: { state: 'Uttar Pradesh', district: 'Ayodhya' },
  itanagar: { state: 'Arunachal Pradesh', district: 'Papum Pare' },
  tawang: { state: 'Arunachal Pradesh', district: 'Tawang' },
  shillong: { state: 'Meghalaya', district: 'East Khasi Hills' },
  cherrapunji: { state: 'Meghalaya', district: 'East Khasi Hills' },
  mawsynram: { state: 'Meghalaya', district: 'East Khasi Hills' },
  imphal: { state: 'Manipur', district: 'Imphal West' },
  aizawl: { state: 'Mizoram', district: 'Aizawl' },
  kohima: { state: 'Nagaland', district: 'Kohima' },
  agartala: { state: 'Tripura', district: 'West Tripura' },
  bhopal: { state: 'Madhya Pradesh', district: 'Bhopal' },
  indore: { state: 'Madhya Pradesh', district: 'Indore' },
  jabalpur: { state: 'Madhya Pradesh', district: 'Jabalpur' },
  raipur: { state: 'Chhattisgarh', district: 'Raipur' },
  ranchi: { state: 'Jharkhand', district: 'Ranchi' },
  jamshedpur: { state: 'Jharkhand', district: 'East Singhbhum' },
};

// Pure Foreign Exclusions (unless directly impacting India)
const FOREIGN_ENTITIES = [
  'kathmandu',
  'pokhara',
  'nepal army',
  'dhaka',
  'chittagong',
  'bangladesh government',
  'islamabad',
  'karachi',
  'lahore',
  'colombo',
  'sri lanka navy',
  'yangon',
  'myanmar military',
  'beijing',
  'tibet border post',
  'florida',
  'texas',
  'california',
  'tokyo',
  'philippines storm',
  'indonesia volcano',
];

const DISASTER_KEYWORDS = [
  'flood',
  'flooding',
  'flash flood',
  'inundat',
  'submerged',
  'waterlogg',
  'landslide',
  'mudslide',
  'rockfall',
  'slope collapse',
  'slope failure',
  'land subsidence',
  'subsidence',
  'sinking',
  'cloudburst',
  'cyclone',
  'cyclonic',
  'depression in bay',
  'storm',
  'thunderstorm',
  'heavy rain',
  'extremely heavy rain',
  'torrential rain',
  'downpour',
  'monsoon surge',
  'monsoon deluge',
  'red alert',
  'orange alert',
  'yellow alert',
  'flood alert',
  'earthquake',
  'tremor',
  'seismic',
  'tsunami',
  'heatwave',
  'heat wave',
  'wildfire',
  'forest fire',
  'avalanche',
  'snow slide',
  'glof',
  'glacial burst',
  'lightning',
  'thunderbolt',
  'dam overflow',
  'dam gate',
  'river water level',
  'danger mark',
  'ndrf',
  'sdrf',
  'disaster management',
  'evacuation',
  'relief camp',
];

const EXCLUSION_KEYWORDS = [
  'box office',
  'trailer',
  'bollywood',
  'tollywood',
  'cricket match',
  'ipl 202',
  'stock market',
  'sensex',
  'nifty',
  'election campaign',
  'political rally',
  'movie review',
  'web series',
  'celebrity wedding',
];

/**
 * Classify disaster category from title and text
 */
export function classifyDisasterType(text: string): DisasterCategory {
  const lower = text.toLowerCase();

  if (lower.includes('landslide') || lower.includes('mudslide') || lower.includes('rockfall') || lower.includes('slope collapse')) {
    return 'Landslide';
  }
  if (lower.includes('land subsidence') || lower.includes('sinking') || lower.includes('ground crack')) {
    return 'Land Subsidence';
  }
  if (lower.includes('cloudburst')) {
    return 'Cloudburst';
  }
  if (lower.includes('flash flood') || lower.includes('flash floods') || lower.includes('deluge')) {
    return 'Flood';
  }
  if (lower.includes('flood') || lower.includes('inundat') || lower.includes('submerged') || lower.includes('waterlogg') || lower.includes('dam overflow') || lower.includes('danger mark')) {
    return 'Flood';
  }
  if (lower.includes('heavy rain') || lower.includes('torrential') || lower.includes('downpour') || lower.includes('rainfall') || lower.includes('monsoon surge')) {
    return 'Heavy Rain';
  }
  if (lower.includes('cyclone') || lower.includes('cyclonic') || lower.includes('deep depression') || lower.includes('bay of bengal depression')) {
    return 'Cyclone';
  }
  if (lower.includes('earthquake') || lower.includes('tremor') || lower.includes('richter scale') || lower.includes('seismic')) {
    return 'Earthquake';
  }
  if (lower.includes('tsunami') || lower.includes('tidal surge')) {
    return 'Tsunami';
  }
  if (lower.includes('avalanche') || lower.includes('snow slide') || lower.includes('glof') || lower.includes('glacial burst')) {
    return 'Avalanche';
  }
  if (lower.includes('lightning') || lower.includes('thunderbolt')) {
    return 'Lightning';
  }
  if (lower.includes('heatwave') || lower.includes('heat wave') || lower.includes('extreme heat')) {
    return 'Heatwave';
  }
  if (lower.includes('wildfire') || lower.includes('forest fire') || lower.includes('jungle fire')) {
    return 'Wildfire';
  }
  if (lower.includes('storm') || lower.includes('thunderstorm') || lower.includes('squall') || lower.includes('hailstorm')) {
    return 'Storm';
  }

  return 'Other';
}

/**
 * Assess disaster severity
 */
export function assessSeverity(text: string, category: DisasterCategory): DisasterSeverity {
  const lower = text.toLowerCase();
  if (
    lower.includes('critical') ||
    lower.includes('massive') ||
    lower.includes('catastrophic') ||
    lower.includes('red alert') ||
    lower.includes('evacuat') ||
    lower.includes('killed') ||
    lower.includes('dead') ||
    lower.includes('high casualty') ||
    lower.includes('ndrf deployed') ||
    lower.includes('submerged villages')
  ) {
    return 'CRITICAL';
  }
  if (
    lower.includes('severe') ||
    lower.includes('heavy damage') ||
    lower.includes('orange alert') ||
    lower.includes('blocked') ||
    lower.includes('stranded') ||
    lower.includes('rescue underway') ||
    lower.includes('highway closed')
  ) {
    return 'HIGH';
  }
  if (
    lower.includes('moderate') ||
    lower.includes('yellow alert') ||
    lower.includes('advisory') ||
    lower.includes('watch') ||
    lower.includes('forecast')
  ) {
    return 'MODERATE';
  }
  return 'LOW';
}

/**
 * Determine dynamic status badge
 */
export function determineStatusBadge(pubDate: Date, text: string): NewsStatusBadge | undefined {
  const lower = text.toLowerCase();
  const now = new Date();
  const diffHours = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60);

  if (lower.includes('live') || lower.includes('live updates') || lower.includes('breaking')) {
    return 'LIVE';
  }
  if (diffHours <= 4 && (lower.includes('urgent') || lower.includes('alert') || lower.includes('red alert'))) {
    return 'BREAKING';
  }
  if (lower.includes('ongoing') || lower.includes('rescue underway') || lower.includes('relief operations')) {
    return 'ONGOING';
  }
  if (diffHours <= 18) {
    return 'UPDATED';
  }
  return undefined;
}

/**
 * Check if an article was published today (IST or reference system date)
 */
export function isPublishedToday(pubDate: Date, referenceDate: Date = new Date()): boolean {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const pubIst = new Date(pubDate.getTime() + IST_OFFSET_MS);
  const refIst = new Date(referenceDate.getTime() + IST_OFFSET_MS);

  const sameCalendarDay =
    pubIst.getUTCFullYear() === refIst.getUTCFullYear() &&
    pubIst.getUTCMonth() === refIst.getUTCMonth() &&
    pubIst.getUTCDate() === refIst.getUTCDate();

  const diffHours = (referenceDate.getTime() - pubDate.getTime()) / (1000 * 60 * 60);

  // Must be same calendar day in IST and within 26 hours
  return sameCalendarDay && diffHours >= -1 && diffHours <= 26;
}

/**
 * Format publication date dynamically
 */
export function formatPubDate(pubDate: Date, referenceDate: Date = new Date()): { formatted: string; isToday: boolean } {
  const today = isPublishedToday(pubDate, referenceDate);

  const timeStr = pubDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const dateStr = pubDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return {
    formatted: today ? `Today • ${timeStr}` : `${dateStr} • ${timeStr}`,
    isToday: today,
  };
}

/**
 * Extract and strictly verify Indian location from text.
 * Returns null if purely unrelated foreign event.
 */
export function extractIndiaLocation(
  title: string,
  desc: string
): { state?: string; district?: string; area?: string; label: string } | null {
  const combined = `${title} ${desc}`.toLowerCase();

  // 1. Direct State / UT matching
  for (const st of INDIAN_STATES_AND_UTS) {
    if (combined.includes(st.toLowerCase())) {
      return {
        state: st,
        label: `${st}, India`,
      };
    }
  }

  // 2. City / District / Regional mapping
  for (const [key, mapping] of Object.entries(INDIAN_REGIONAL_MAP)) {
    if (combined.includes(key)) {
      const stateName = mapping.state;
      const distName = mapping.district;
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
      return {
        state: stateName,
        district: distName,
        area: formattedKey,
        label: distName ? `${formattedKey}, ${stateName}` : `${formattedKey} (${stateName}), India`,
      };
    }
  }

  // 3. Check for Indian government / agency involvement or cross-border impact on India
  const hasIndiaKeyword =
    combined.includes('india') ||
    combined.includes('indian') ||
    combined.includes('imd') ||
    combined.includes('ndma') ||
    combined.includes('ndrf') ||
    combined.includes('sdrf') ||
    combined.includes('gsi') ||
    combined.includes('cwc') ||
    combined.includes('bay of bengal') ||
    combined.includes('arabian sea') ||
    combined.includes('himalayan region') ||
    combined.includes('western ghats');

  // Check if pure foreign without Indian mention
  const isPureForeign = FOREIGN_ENTITIES.some((f) => combined.includes(f));
  if (isPureForeign && !hasIndiaKeyword) {
    return null;
  }

  if (hasIndiaKeyword) {
    if (combined.includes('himalaya') || combined.includes('western himalayas')) {
      return { state: 'Himachal Pradesh', label: 'Western Himalayan Region, India' };
    }
    if (combined.includes('western ghats')) {
      return { state: 'Kerala', label: 'Western Ghats, India' };
    }
    if (combined.includes('bay of bengal') || combined.includes('coastal')) {
      return { state: 'Odisha', label: 'East Coast / Bay of Bengal, India' };
    }
    if (combined.includes('arabian sea')) {
      return { state: 'Gujarat', label: 'West Coast / Arabian Sea, India' };
    }
    return { label: 'Across India' };
  }

  // If no Indian location found and no explicit India context, reject
  return null;
}

/**
 * Check if text is genuine natural disaster or extreme weather
 */
function isDisasterArticle(title: string, desc: string): boolean {
  const combined = `${title} ${desc}`.toLowerCase();

  // Exclude non-disaster topics
  const hasExclusion = EXCLUSION_KEYWORDS.some((ex) => combined.includes(ex));
  if (hasExclusion && !combined.includes('flood') && !combined.includes('landslide') && !combined.includes('cyclone') && !combined.includes('red alert')) {
    return false;
  }

  return DISASTER_KEYWORDS.some((kw) => combined.includes(kw));
}

function cleanHtmlText(text: string): string {
  if (!text) return '';
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse Google News RSS XML response
 */
function parseRssItems(xmlText: string): Array<{
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}> {
  const items: Array<{
    title: string;
    link: string;
    pubDate: string;
    description: string;
    source: string;
  }> = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];

    // Title
    const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    let rawTitle = titleMatch ? titleMatch[1].trim() : '';

    // Link
    const linkMatch = itemContent.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
    const link = linkMatch ? linkMatch[1].trim() : '';

    // PubDate
    const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';

    // Description / Snippet
    const descMatch = itemContent.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
    const rawDesc = descMatch ? descMatch[1].trim() : '';
    const description = cleanHtmlText(rawDesc);

    // Extract Source Name
    let source = 'Verified News Agency';
    const sourceMatch = itemContent.match(/<source[^>]*url="([^"]*)"[^>]*>([\s\S]*?)<\/source>/i);
    if (sourceMatch && sourceMatch[2]) {
      source = cleanHtmlText(sourceMatch[2]);
    } else if (rawTitle.includes(' - ')) {
      const parts = rawTitle.split(' - ');
      source = parts.pop()?.trim() || 'Verified News Agency';
      rawTitle = parts.join(' - ').trim();
    }

    const fullTitle = cleanHtmlText(rawTitle);

    if (fullTitle && link) {
      items.push({
        title: fullTitle,
        link,
        pubDate,
        description,
        source,
      });
    }
  }

  return items;
}

/**
 * Deduplicate articles by normalized token similarity
 */
function areDuplicates(titleA: string, titleB: string): boolean {
  const normalize = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3);

  const tokensA = new Set(normalize(titleA));
  const tokensB = new Set(normalize(titleB));

  if (tokensA.size === 0 || tokensB.size === 0) return false;

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersection++;
    }
  }

  const union = tokensA.size + tokensB.size - intersection;
  const similarity = intersection / union;

  return similarity > 0.60;
}

function deduplicateArticles(articles: VerifiedDisasterNewsItem[]): VerifiedDisasterNewsItem[] {
  const unique: VerifiedDisasterNewsItem[] = [];

  for (const article of articles) {
    const isDup = unique.some((existing) => areDuplicates(existing.title, article.title));
    if (!isDup) {
      unique.push(article);
    }
  }

  return unique;
}

/**
 * Fetch USGS Real-Time Earthquakes for India region (Lat 6°-38°N, Lng 68°-98°E)
 */
async function fetchUsgsEarthquakesForIndia(timeframe: DisasterNewsTimeframe): Promise<VerifiedDisasterNewsItem[]> {
  try {
    const days = timeframe === 'today' ? 1.2 : 30;
    const startTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&minmagnitude=3.0&minlatitude=6.0&maxlatitude=38.0&minlongitude=68.0&maxlongitude=98.0&orderby=time&limit=30`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return [];

    const data = await res.json();
    if (!data || !data.features || !Array.isArray(data.features)) return [];

    const items: VerifiedDisasterNewsItem[] = [];
    const now = new Date();

    for (const feature of data.features) {
      const props = feature.properties;
      const mag = props.mag || 3.5;
      const place = props.place || 'India Region';
      const eventTime = new Date(props.time);

      if (isNaN(eventTime.getTime())) continue;

      const diffDays = (now.getTime() - eventTime.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 30.0) continue;

      const isToday = isPublishedToday(eventTime, now);
      if (timeframe === 'today' && !isToday) continue;

      const { formatted } = formatPubDate(eventTime, now);

      const title = `Magnitude ${mag.toFixed(1)} Earthquake Detected near ${place}`;
      const depth = feature.geometry?.coordinates?.[2] ? `${Math.round(feature.geometry.coordinates[2])} km` : 'shallow focal depth';
      const summary = `A seismic event of magnitude ${mag.toFixed(1)} was recorded at a focal depth of ${depth}. Seismological telemetry stations across the National Centre for Seismology (NCS) and USGS network registered the tremor.`;

      items.push({
        id: `usgs-eq-${feature.id || Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title,
        summary,
        source: 'National Centre for Seismology / USGS',
        sourceUrl: props.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${feature.id}`,
        publishedAt: eventTime.toISOString(),
        formattedDate: formatted,
        location: {
          label: place.includes('India') ? place : `${place}, India`,
        },
        disasterType: 'Earthquake',
        severity: mag >= 5.5 ? 'CRITICAL' : mag >= 4.5 ? 'HIGH' : mag >= 3.5 ? 'MODERATE' : 'LOW',
        statusBadge: isToday ? 'LIVE' : undefined,
        isToday,
        isOfficialWarning: true,
        officialAuthority: 'NCS / USGS Seismological Network',
      });
    }

    return items;
  } catch (err) {
    console.warn('USGS earthquake fetch warning:', err);
    return [];
  }
}

/**
 * Fetch a single Google News RSS query with timeout
 */
async function fetchSingleGoogleNewsRss(query: string): Promise<Array<{
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}>> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-IN&gl=IN&ceid=IN:en`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 LandSafeAI/3.0',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return [];
    }

    const xmlText = await response.text();
    return parseRssItems(xmlText);
  } catch (err) {
    return [];
  }
}

/**
 * Main Service Method to fetch live Indian Disaster News
 */
export async function getIndianDisasterNews(options: {
  timeframe?: DisasterNewsTimeframe;
  state?: string;
  district?: string;
  area?: string;
  disasterType?: DisasterCategory;
  searchQuery?: string;
  forceRefresh?: boolean;
}): Promise<DisasterNewsResponse> {
  const {
    timeframe = 'all',
    state,
    district,
    area,
    disasterType = 'All',
    searchQuery = '',
    forceRefresh = false,
  } = options;

  // Cache Key
  const cacheKey = `disasterNews:${timeframe}:${state || 'all'}:${district || 'all'}:${area || 'all'}:${disasterType}:${searchQuery.trim().toLowerCase()}`;

  if (!forceRefresh) {
    const cached = NEWS_CACHE.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const now = new Date();

  // Construct diverse high-yield queries based on timeframe
  const queries: string[] = [];

  if (timeframe === 'my-location') {
    const locParts: string[] = [];
    if (area && area !== 'Current Sector' && !area.includes('Sector')) locParts.push(`"${area}"`);
    if (district && district !== 'District') locParts.push(`"${district}"`);
    if (state && state !== 'India') locParts.push(`"${state}"`);

    const locationStr = locParts.length > 0 ? `(${locParts.join(' OR ')})` : 'India';
    queries.push(`(flood OR landslide OR "heavy rain" OR cloudburst OR cyclone OR earthquake OR alert OR disaster) ${locationStr} India`);
    if (state && state !== 'India') {
      queries.push(`(flood OR landslide OR "heavy rain" OR alert) "${state}" India`);
    }
  } else {
    // Multi-query parallel fetching across India
    queries.push('(flood OR landslide OR "heavy rain" OR cloudburst OR cyclone OR earthquake) India');
    queries.push('(landslide OR "flash flood" OR cloudburst OR "heavy rainfall" OR "slope failure") (Himachal OR Uttarakhand OR Kerala OR Assam OR Wayanad OR Darjeeling OR Sikkim OR Nilgiris OR India)');
    queries.push('(flood OR inundation OR "river water" OR "dam overflow" OR "waterlogging" OR "danger mark") (Assam OR Bihar OR "Uttar Pradesh" OR Odisha OR Maharashtra OR Gujarat OR "Tamil Nadu" OR "West Bengal" OR India)');
    queries.push('(cyclone OR "deep depression" OR thunderstorm OR lightning OR "severe storm" OR gale) (India OR "Bay of Bengal" OR "Arabian Sea" OR Odisha OR "Andhra Pradesh" OR Gujarat)');
    queries.push('(IMD alert OR "red alert" OR "orange alert" OR "flood alert" OR "landslide warning" OR NDMA OR NDRF) India');
    queries.push('(earthquake OR tremor OR avalanche OR "land subsidence" OR GSI OR "National Centre for Seismology") India');
  }

  // Fetch all RSS feeds + USGS Earthquakes concurrently
  const [rssFeedResults, usgsEarthquakes] = await Promise.all([
    Promise.all(queries.map((q) => fetchSingleGoogleNewsRss(q))),
    fetchUsgsEarthquakesForIndia(timeframe),
  ]);

  const rawParsedItems = rssFeedResults.flat();
  const verifiedArticles: VerifiedDisasterNewsItem[] = [];

  for (let i = 0; i < rawParsedItems.length; i++) {
    const item = rawParsedItems[i];

    if (!item.link || (!item.link.startsWith('http://') && !item.link.startsWith('https://'))) {
      continue;
    }

    const pubDate = item.pubDate ? new Date(item.pubDate) : null;
    if (!pubDate || isNaN(pubDate.getTime())) continue;

    const diffDays = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24);

    // 1. Timeframe Check
    if (timeframe === '30days') {
      // Must be within rolling 30 days
      if (diffDays > 30.0 || diffDays < -0.1) continue;
    } else if (timeframe === 'today') {
      // Must be published today
      if (!isPublishedToday(pubDate, now)) continue;
    } else if (timeframe === 'all' || timeframe === 'my-location') {
      // Reasonable freshness window (up to 45 days)
      if (diffDays > 45.0 || diffDays < -0.1) continue;
    }

    // 2. Disaster Relevance Check
    if (!isDisasterArticle(item.title, item.description)) {
      continue;
    }

    // 3. Strict India Location Verification
    const indiaLoc = extractIndiaLocation(item.title, item.description);
    if (!indiaLoc) {
      // Excluded: pure foreign event
      continue;
    }

    const category = classifyDisasterType(`${item.title} ${item.description}`);
    const severity = assessSeverity(`${item.title} ${item.description}`, category);
    const isToday = isPublishedToday(pubDate, now);
    const { formatted } = formatPubDate(pubDate, now);
    const statusBadge = determineStatusBadge(pubDate, item.title);

    // Create a concise 1-2 sentence readable summary
    let summary = item.description;
    if (!summary || summary.length < 35) {
      summary = `${item.title}. Disaster management authorities and meteorological teams are actively monitoring conditions across the region.`;
    } else if (summary.length > 250) {
      const truncated = summary.slice(0, 240);
      const lastPeriod = truncated.lastIndexOf('.');
      summary = lastPeriod > 100 ? truncated.slice(0, lastPeriod + 1) : truncated + '...';
    }

    const isOfficial =
      item.source.toLowerCase().includes('imd') ||
      item.source.toLowerCase().includes('ndma') ||
      item.source.toLowerCase().includes('gsi') ||
      item.source.toLowerCase().includes('ndrf') ||
      item.source.toLowerCase().includes('air') ||
      item.source.toLowerCase().includes('pib') ||
      item.title.toLowerCase().includes('alert') ||
      item.title.toLowerCase().includes('warning');

    verifiedArticles.push({
      id: `gn-${Buffer.from(item.link).toString('base64').slice(0, 22)}-${i}`,
      title: item.title,
      summary,
      source: item.source || 'Verified Indian News Source',
      sourceUrl: item.link,
      publishedAt: pubDate.toISOString(),
      formattedDate: formatted,
      location: indiaLoc,
      disasterType: category,
      severity,
      statusBadge,
      isToday,
      isOfficialWarning: isOfficial,
      officialAuthority: isOfficial ? item.source : undefined,
    });
  }

  // Combine Google News + USGS Earthquakes
  let allCombined = [...verifiedArticles, ...usgsEarthquakes];

  // Deduplicate substantially identical stories
  let filtered = deduplicateArticles(allCombined);

  // Apply Disaster Category Filter if specified
  if (disasterType && disasterType !== 'All') {
    filtered = filtered.filter((item) => item.disasterType === disasterType);
  }

  // Apply Search Query Filter if specified
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        (item.location.label && item.location.label.toLowerCase().includes(q)) ||
        (item.location.state && item.location.state.toLowerCase().includes(q)) ||
        (item.location.district && item.location.district.toLowerCase().includes(q))
    );
  }

  // Apply Strict Today Filter if timeframe is 'today'
  if (timeframe === 'today') {
    filtered = filtered.filter((item) => item.isToday);
  }

  // Apply Strict 30-Day Filter if timeframe is '30days'
  if (timeframe === '30days') {
    filtered = filtered.filter((item) => {
      const pubTime = new Date(item.publishedAt).getTime();
      const diffDays = (now.getTime() - pubTime) / (1000 * 60 * 60 * 24);
      return diffDays >= -0.1 && diffDays <= 30.0;
    });
  }

  // Sort strictly Newest -> Oldest (with priority to LIVE alerts)
  filtered.sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();

    const priorityA = (a.statusBadge === 'LIVE' ? 1000000000 : 0) + timeA;
    const priorityB = (b.statusBadge === 'LIVE' ? 1000000000 : 0) + timeB;

    return priorityB - priorityA;
  });

  const responsePayload: DisasterNewsResponse = {
    timeframe,
    totalResults: filtered.length,
    lastUpdated: new Date().toISOString(),
    locationScope: {
      state,
      district,
      area,
      isFallback: false,
      fallbackLevel: null,
    },
    articles: filtered,
  };

  // Cache response
  NEWS_CACHE.set(cacheKey, {
    timestamp: Date.now(),
    data: responsePayload,
  });

  return responsePayload;
}
