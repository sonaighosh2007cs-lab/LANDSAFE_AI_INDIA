import { UserLocation } from '../types';

export interface LocationDistrict {
  id: string;
  name: string;
  isHazardMonitored: boolean;
  elevation: number;
  slopeAngle: number;
  lithology: string;
  coordinates: { lat: number; lng: number };
  defaultRiskScore: number;
  localAreas: string[];
}

export interface LocationState {
  id: string;
  name: string;
  type: 'state' | 'ut';
  isHazardMonitored: boolean;
  districts: LocationDistrict[];
}

export const INDIAN_STATES: LocationState[] = [
  // ==========================================
  // 1. ANDHRA PRADESH
  // ==========================================
  {
    id: 'andhra_pradesh',
    name: 'Andhra Pradesh',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'visakhapatnam',
        name: 'Visakhapatnam (Eastern Ghats)',
        isHazardMonitored: true,
        elevation: 45,
        slopeAngle: 18.2,
        lithology: 'Khondalite & Charnockite Series',
        coordinates: { lat: 17.6868, lng: 83.2185 },
        defaultRiskScore: 38,
        localAreas: ['Kailasagiri Hill', 'Simhachalam Hills', 'Rushikonda', 'Gajuwaka', 'Bheemunipatnam', 'Madhurawada'],
      },
      {
        id: 'alluri_sitharama_raju',
        name: 'Alluri Sitharama Raju (Araku Valley)',
        isHazardMonitored: true,
        elevation: 911,
        slopeAngle: 24.5,
        lithology: 'Eastern Ghats Charnockite Belt',
        coordinates: { lat: 18.3333, lng: 82.8833 },
        defaultRiskScore: 54,
        localAreas: ['Araku Valley', 'Paderu', 'Borra Caves Ghat', 'Lambasingi', 'Chintapalle', 'Ananthagiri Hills'],
      },
      {
        id: 'tirupati',
        name: 'Tirupati (Seshachalam Hills)',
        isHazardMonitored: true,
        elevation: 182,
        slopeAngle: 21.0,
        lithology: 'Cuddapah Quartzite & Sandstone Ridge',
        coordinates: { lat: 13.6288, lng: 79.4192 },
        defaultRiskScore: 42,
        localAreas: ['Tirumala Ghat Road', 'Chandragiri', 'Srikalahasti', 'Renigunta', 'Alipiri Pass'],
      },
      {
        id: 'ntr_vijayawada',
        name: 'NTR (Vijayawada)',
        isHazardMonitored: false,
        elevation: 23,
        slopeAngle: 8.5,
        lithology: 'Krishna Riverine Alluvium & Gneissic Inliers',
        coordinates: { lat: 16.5062, lng: 80.648 },
        defaultRiskScore: 16,
        localAreas: ['Indrakeeladri Hill Slope', 'Gunadala', 'Bhavanipuram', 'Benz Circle', 'Governorpet'],
      },
      {
        id: 'guntur',
        name: 'Guntur',
        isHazardMonitored: false,
        elevation: 33,
        slopeAngle: 5.2,
        lithology: 'Deltaic Alluvium & Clay Loam',
        coordinates: { lat: 16.3067, lng: 80.4365 },
        defaultRiskScore: 12,
        localAreas: ['Mangalagiri Hills', 'Narasaraopet', 'Tenali', 'Sattenapalle', 'Amaravati Corridor'],
      },
    ],
  },

  // ==========================================
  // 2. ARUNACHAL PRADESH
  // ==========================================
  {
    id: 'arunachal_pradesh',
    name: 'Arunachal Pradesh Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'tawang',
        name: 'Tawang',
        isHazardMonitored: true,
        elevation: 3048,
        slopeAngle: 34.0,
        lithology: 'Central Crystallines & Glacio-Fluvial Moraines',
        coordinates: { lat: 27.5861, lng: 91.8594 },
        defaultRiskScore: 78,
        localAreas: ['Sela Pass Corridor', 'Tawang Town', 'Jang', 'Lumla', 'Zemithang', 'Mukto'],
      },
      {
        id: 'west_kameng',
        name: 'West Kameng',
        isHazardMonitored: true,
        elevation: 1800,
        slopeAngle: 30.5,
        lithology: 'Bomdila Gneiss & Gondwana Formations',
        coordinates: { lat: 27.2645, lng: 92.4159 },
        defaultRiskScore: 72,
        localAreas: ['Bomdila Pass', 'Bhalukpong Highway', 'Dirang Valley', 'Rupa', 'Tenga Valley', 'Kalaktang'],
      },
      {
        id: 'papum_pare',
        name: 'Papum Pare (Itanagar Capital)',
        isHazardMonitored: true,
        elevation: 320,
        slopeAngle: 22.0,
        lithology: 'Siwalik Sandstone & Alluvium',
        coordinates: { lat: 27.0844, lng: 93.6053 },
        defaultRiskScore: 56,
        localAreas: ['Itanagar Hill', 'Naharlagun', 'Doimukh', 'Yupia', 'Banderdewa Corridor'],
      },
      {
        id: 'lower_subansiri',
        name: 'Lower Subansiri (Ziro Valley)',
        isHazardMonitored: true,
        elevation: 1572,
        slopeAngle: 26.0,
        lithology: 'Ziro Gneiss & Mica Schist',
        coordinates: { lat: 27.595, lng: 93.83 },
        defaultRiskScore: 64,
        localAreas: ['Hapoli', 'Old Ziro', 'Yachuli', 'Pistana', 'Talo'],
      },
      {
        id: 'changlang',
        name: 'Changlang',
        isHazardMonitored: true,
        elevation: 580,
        slopeAngle: 27.0,
        lithology: 'Tertiary Siltstone & Tipam Sandstone',
        coordinates: { lat: 27.1292, lng: 95.7333 },
        defaultRiskScore: 61,
        localAreas: ['Miao', 'Jairampur (Stillwell Road)', 'Namdapha Sector', 'Bordumsa'],
      },
    ],
  },

  // ==========================================
  // 3. ASSAM
  // ==========================================
  {
    id: 'assam',
    name: 'Assam',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'kamrup_metro',
        name: 'Kamrup Metropolitan (Guwahati)',
        isHazardMonitored: true,
        elevation: 55,
        slopeAngle: 19.5,
        lithology: 'Precambrian Gneissic Inliers & Alluvium',
        coordinates: { lat: 26.1445, lng: 91.7362 },
        defaultRiskScore: 48,
        localAreas: ['Kamakshya Hill Corridor', 'Narakasur Hill', 'Khanapara Slopes', 'Dispur', 'Chandmari Hill', 'Jalukbari', 'Uzan Bazar'],
      },
      {
        id: 'dima_hasao',
        name: 'Dima Hasao (North Cachar Hills)',
        isHazardMonitored: true,
        elevation: 680,
        slopeAngle: 31.0,
        lithology: 'Disang Shales & Barail Sandstone',
        coordinates: { lat: 25.18, lng: 93.02 },
        defaultRiskScore: 84,
        localAreas: ['Haflong Town', 'Jatinga Valley', 'Mahur', 'Maibang', 'Harangajao Rail Corridor', 'Umrangso'],
      },
      {
        id: 'cachar',
        name: 'Cachar (Silchar)',
        isHazardMonitored: true,
        elevation: 35,
        slopeAngle: 16.0,
        lithology: 'Surma Series Siltstone & Barak Alluvium',
        coordinates: { lat: 24.8333, lng: 92.7789 },
        defaultRiskScore: 52,
        localAreas: ['Silchar Town', 'Lakhipur', 'Sonai', 'Udarbond', 'Borkhola'],
      },
      {
        id: 'karbi_anglong',
        name: 'Karbi Anglong',
        isHazardMonitored: true,
        elevation: 320,
        slopeAngle: 21.5,
        lithology: 'Archaean Granite Gneiss Massif',
        coordinates: { lat: 25.84, lng: 93.43 },
        defaultRiskScore: 58,
        localAreas: ['Diphu', 'Bokajan', 'Dokmoka', 'Howraghat', 'Hamren Ridge'],
      },
      {
        id: 'dibrugarh',
        name: 'Dibrugarh',
        isHazardMonitored: false,
        elevation: 108,
        slopeAngle: 3.5,
        lithology: 'Brahmaputra Floodplain Loam',
        coordinates: { lat: 27.4728, lng: 94.912 },
        defaultRiskScore: 14,
        localAreas: ['Chowkidingee', 'Amolapatty', 'Chabua', 'Naharkatiya', 'Dulijan'],
      },
      {
        id: 'jorhat',
        name: 'Jorhat',
        isHazardMonitored: false,
        elevation: 116,
        slopeAngle: 3.8,
        lithology: 'Alluvial Terraces & Clay Mantle',
        coordinates: { lat: 26.7509, lng: 94.2037 },
        defaultRiskScore: 12,
        localAreas: ['Gar-Ali', 'Titabar', 'Mariani', 'Teok', 'Majuli Ferry Point'],
      },
    ],
  },

  // ==========================================
  // 4. BIHAR
  // ==========================================
  {
    id: 'bihar',
    name: 'Bihar',
    type: 'state',
    isHazardMonitored: false,
    districts: [
      {
        id: 'patna',
        name: 'Patna',
        isHazardMonitored: false,
        elevation: 53,
        slopeAngle: 2.1,
        lithology: 'Gangetic Holocene Alluvium',
        coordinates: { lat: 25.5941, lng: 85.1376 },
        defaultRiskScore: 10,
        localAreas: ['Bailey Road', 'Kankarbagh', 'Boring Road', 'Danapur', 'Patna City', 'Patliputra'],
      },
      {
        id: 'gaya',
        name: 'Gaya',
        isHazardMonitored: false,
        elevation: 111,
        slopeAngle: 8.5,
        lithology: 'Chotanagpur Granite Gneiss & Alluvium',
        coordinates: { lat: 24.7914, lng: 85.0002 },
        defaultRiskScore: 15,
        localAreas: ['Bodh Gaya', 'Brahmajuni Hill Slope', 'Ramsagar', 'Tekari', 'Sherghati'],
      },
      {
        id: 'nalanda',
        name: 'Nalanda (Rajgir Hills)',
        isHazardMonitored: true,
        elevation: 67,
        slopeAngle: 18.0,
        lithology: 'Rajgir Quartzite Hills & Fluvial Soil',
        coordinates: { lat: 25.1957, lng: 85.5186 },
        defaultRiskScore: 32,
        localAreas: ['Rajgir Hill Ridge', 'Gridhakuta Peak Sector', 'Bihar Sharif', 'Nalanda University Sector', 'Hilsa'],
      },
      {
        id: 'rohtas',
        name: 'Rohtas (Kaimur Plateau)',
        isHazardMonitored: true,
        elevation: 108,
        slopeAngle: 22.0,
        lithology: 'Vindhyan Sandstone & Shale Scarp',
        coordinates: { lat: 24.95, lng: 84.01 },
        defaultRiskScore: 36,
        localAreas: ['Sasaram', 'Rohtasgarh Fort Escarpment', 'Dehri', 'Nauhatta Ghat', 'Chenari'],
      },
      {
        id: 'muzaffarpur',
        name: 'Muzaffarpur',
        isHazardMonitored: false,
        elevation: 60,
        slopeAngle: 2.0,
        lithology: 'Burhi Gandak Alluvium',
        coordinates: { lat: 26.1226, lng: 85.3906 },
        defaultRiskScore: 9,
        localAreas: ['Kalyani Chowk', 'Brahmpura', 'Mithanpura', 'Kanti', 'Motipur'],
      },
    ],
  },

  // ==========================================
  // 5. CHHATTISGARH
  // ==========================================
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'bastar',
        name: 'Bastar (Jagdalpur)',
        isHazardMonitored: true,
        elevation: 552,
        slopeAngle: 16.5,
        lithology: 'Indravati Limestone & Bailadila Iron Formations',
        coordinates: { lat: 19.07, lng: 82.03 },
        defaultRiskScore: 42,
        localAreas: ['Chitrakote Falls Escarpment', 'Jagdalpur Town', 'Kanger Valley Hills', 'Tokapal', 'Bastanar Ghat'],
      },
      {
        id: 'surguja',
        name: 'Surguja (Mainpat Plateau)',
        isHazardMonitored: true,
        elevation: 620,
        slopeAngle: 19.0,
        lithology: 'Deccan Trap Laterite & Gondwana Sediments',
        coordinates: { lat: 23.12, lng: 83.19 },
        defaultRiskScore: 46,
        localAreas: ['Mainpat (Tibetan Settlement Slope)', 'Ambikapur', 'Sitapur', 'Lundra', 'Darima'],
      },
      {
        id: 'raipur',
        name: 'Raipur',
        isHazardMonitored: false,
        elevation: 298,
        slopeAngle: 3.2,
        lithology: 'Chhattisgarh Basin Shale & Limestone',
        coordinates: { lat: 21.2514, lng: 81.6296 },
        defaultRiskScore: 11,
        localAreas: ['Telibandha', 'Shankar Nagar', 'Pandri', 'Naya Raipur (Atal Nagar)', 'Tatibandh'],
      },
      {
        id: 'bilaspur_cg',
        name: 'Bilaspur',
        isHazardMonitored: false,
        elevation: 264,
        slopeAngle: 5.0,
        lithology: 'Arpa Alluvium & Gondwana Shales',
        coordinates: { lat: 22.0797, lng: 82.1409 },
        defaultRiskScore: 13,
        localAreas: ['Vypar Vihar', 'Civil Lines', 'Ratanpur Escarpment', 'Kota', 'Sipat'],
      },
    ],
  },

  // ==========================================
  // 6. GOA
  // ==========================================
  {
    id: 'goa',
    name: 'Goa',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'north_goa',
        name: 'North Goa (Western Ghats Foothills)',
        isHazardMonitored: true,
        elevation: 10,
        slopeAngle: 18.0,
        lithology: 'Goa Group Metavolcanics & Deep Coastal Laterite',
        coordinates: { lat: 15.4989, lng: 73.8278 },
        defaultRiskScore: 39,
        localAreas: ['Panaji Altinho Hill', 'Mapusa', 'Porvorim', 'Calangute', 'Bicholim Mining Slopes', 'Ponda (Khandepar)'],
      },
      {
        id: 'south_goa',
        name: 'South Goa (Chorla & Anmod Ghats)',
        isHazardMonitored: true,
        elevation: 31,
        slopeAngle: 24.0,
        lithology: 'Dharwar Schist & Western Ghats Basalt/Laterite',
        coordinates: { lat: 15.2832, lng: 73.9862 },
        defaultRiskScore: 55,
        localAreas: ['Chorla Ghat Road', 'Anmod Ghat Corridor', 'Margao', 'Vasco da Gama', 'Canacona (Karmal Ghat)', 'Quepem'],
      },
    ],
  },

  // ==========================================
  // 7. GUJARAT
  // ==========================================
  {
    id: 'gujarat',
    name: 'Gujarat',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'dang',
        name: 'Dang (Saputara Hills)',
        isHazardMonitored: true,
        elevation: 875,
        slopeAngle: 25.0,
        lithology: 'Sahyadri Deccan Basaltic Traps',
        coordinates: { lat: 20.5833, lng: 73.75 },
        defaultRiskScore: 58,
        localAreas: ['Saputara Hill Station', 'Ahwa', 'Waghai Ghat Road', 'Subir', 'Don Hill'],
      },
      {
        id: 'junagadh',
        name: 'Junagadh (Girnar Hills)',
        isHazardMonitored: true,
        elevation: 107,
        slopeAngle: 28.0,
        lithology: 'Girnar Plutonic Complex (Diorite & Monzonite)',
        coordinates: { lat: 21.5222, lng: 70.4579 },
        defaultRiskScore: 49,
        localAreas: ['Girnar Peak Steps Corridor', 'Bhavnath Taleti', 'Moti Baug', 'Visavadar', 'Keshod'],
      },
      {
        id: 'ahmedabad',
        name: 'Ahmedabad',
        isHazardMonitored: false,
        elevation: 53,
        slopeAngle: 2.1,
        lithology: 'Sabarmati Sandy Alluvium',
        coordinates: { lat: 23.0225, lng: 72.5714 },
        defaultRiskScore: 9,
        localAreas: ['SG Highway', 'Navrangpura', 'Maninagar', 'Bodakdev', 'Prahlad Nagar', 'Bopal', 'Chandkheda'],
      },
      {
        id: 'surat',
        name: 'Surat',
        isHazardMonitored: false,
        elevation: 13,
        slopeAngle: 1.8,
        lithology: 'Tapi Deltaic Clay & Alluvium',
        coordinates: { lat: 21.1702, lng: 72.8311 },
        defaultRiskScore: 8,
        localAreas: ['Adajan', 'Athwa', 'Vesu', 'Varachha', 'Katargam', 'Rander'],
      },
      {
        id: 'kutch',
        name: 'Kutch (Bhuj)',
        isHazardMonitored: false,
        elevation: 110,
        slopeAngle: 6.5,
        lithology: 'Jurassic Sandstone & Saline Marsh Sediments',
        coordinates: { lat: 23.242, lng: 69.6669 },
        defaultRiskScore: 22,
        localAreas: ['Bhuj Town', 'Gandhidham', 'Mandvi', 'Anjar', 'Khavda', 'Bhujiyo Hill Slope'],
      },
    ],
  },

  // ==========================================
  // 8. HARYANA
  // ==========================================
  {
    id: 'haryana',
    name: 'Haryana',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'panchkula',
        name: 'Panchkula (Morni Hills)',
        isHazardMonitored: true,
        elevation: 365,
        slopeAngle: 23.0,
        lithology: 'Sub-Himalayan Siwalik Sandstone & Conglomerate',
        coordinates: { lat: 30.6942, lng: 76.8606 },
        defaultRiskScore: 47,
        localAreas: ['Morni Hills Road', 'Tikkar Taal Sector', 'Pinjore Slopes', 'Kalka', 'Sector 5 Panchkula', 'Mansadevi Complex'],
      },
      {
        id: 'gurugram',
        name: 'Gurugram (Aravalli Ridge)',
        isHazardMonitored: false,
        elevation: 217,
        slopeAngle: 5.5,
        lithology: 'Delhi Supergroup Quartzite & Alluvium',
        coordinates: { lat: 28.4595, lng: 77.0266 },
        defaultRiskScore: 10,
        localAreas: ['DLF Phase 1-5', 'Cyber City', 'Golf Course Road', 'Sohna Hill Ridge', 'Manesar', 'Sector 56'],
      },
      {
        id: 'faridabad',
        name: 'Faridabad',
        isHazardMonitored: false,
        elevation: 204,
        slopeAngle: 4.2,
        lithology: 'Aravalli Quartzite Inliers & Alluvium',
        coordinates: { lat: 28.4089, lng: 77.3178 },
        defaultRiskScore: 9,
        localAreas: ['Badkhal Lake Escarpment', 'Surajkund Ridge', 'Sector 15', 'NIT Faridabad', 'Ballabgarh'],
      },
      {
        id: 'ambala',
        name: 'Ambala',
        isHazardMonitored: false,
        elevation: 264,
        slopeAngle: 2.8,
        lithology: 'Indo-Gangetic Alluvium',
        coordinates: { lat: 30.3782, lng: 76.7767 },
        defaultRiskScore: 11,
        localAreas: ['Ambala Cantt', 'Ambala City', 'Naraingarh', 'Barara', 'Saha'],
      },
    ],
  },

  // ==========================================
  // 9. HIMACHAL PRADESH
  // ==========================================
  {
    id: 'himachal_pradesh',
    name: 'Himachal Pradesh Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'shimla',
        name: 'Shimla',
        isHazardMonitored: true,
        elevation: 2276,
        slopeAngle: 28.0,
        lithology: 'Jutogh Metamorphic Group & Carbonaceous Schists',
        coordinates: { lat: 31.1048, lng: 77.1734 },
        defaultRiskScore: 68,
        localAreas: ['Summer Hill', 'Sanjauli', 'Tutikandi', 'Kufri', 'Mashobra', 'Dhalli', 'Rampur Bushahr', 'The Ridge'],
      },
      {
        id: 'kinnaur',
        name: 'Kinnaur',
        isHazardMonitored: true,
        elevation: 2750,
        slopeAngle: 38.5,
        lithology: 'Vaikrita Granites & High-Grade Gneiss',
        coordinates: { lat: 31.651, lng: 78.4754 },
        defaultRiskScore: 88,
        localAreas: ['Reckong Peo', 'Kalpa', 'Nigulsari Slide Zone', 'Sangla Valley', 'Pooh', 'Karcham Dam Axis', 'Ribba'],
      },
      {
        id: 'kullu',
        name: 'Kullu (Manali)',
        isHazardMonitored: true,
        elevation: 1279,
        slopeAngle: 31.0,
        lithology: 'Kullu Quartzite & Banjar Volcanics',
        coordinates: { lat: 31.9579, lng: 77.1095 },
        defaultRiskScore: 76,
        localAreas: ['Manali Mall Road', 'Solang Valley', 'Rohtang Pass Base', 'Bhuntar', 'Naggar', 'Old Manali', 'Kasol (Parvati Valley)'],
      },
      {
        id: 'mandi',
        name: 'Mandi',
        isHazardMonitored: true,
        elevation: 760,
        slopeAngle: 26.5,
        lithology: 'Shali Carbonates & Larji Window Beds',
        coordinates: { lat: 31.7087, lng: 76.932 },
        defaultRiskScore: 72,
        localAreas: ['Pandoh Dam Axis', 'Aut Tunnel Approach', 'Sundernagar', 'Jogindernagar', 'Sarkaghat', 'Karsog'],
      },
      {
        id: 'kangra',
        name: 'Kangra (Dharamshala)',
        isHazardMonitored: true,
        elevation: 1457,
        slopeAngle: 27.5,
        lithology: 'Dhauladhar Granite & Siwalik Conglomerates',
        coordinates: { lat: 32.219, lng: 76.3234 },
        defaultRiskScore: 69,
        localAreas: ['McLeod Ganj', 'Bhagsunag Falls Sector', 'Dharamshala Kotwali', 'Palampur Tea Slopes', 'Baijnath', 'Nurpur'],
      },
      {
        id: 'solan',
        name: 'Solan (Kasauli)',
        isHazardMonitored: true,
        elevation: 1600,
        slopeAngle: 24.0,
        lithology: 'Krol-Tal Sediments & Lower Tertiary Sandstone',
        coordinates: { lat: 30.9084, lng: 77.0999 },
        defaultRiskScore: 59,
        localAreas: ['Kasauli Ridge', 'Solan Bypass', 'Barog Tunnel Escarpment', 'Kandaghat', 'Chail Highway', 'Parwanoo Bypass'],
      },
      {
        id: 'lahaul_spiti',
        name: 'Lahaul and Spiti',
        isHazardMonitored: true,
        elevation: 3350,
        slopeAngle: 36.0,
        lithology: 'Tethyan Sedimentary Sequence & Moraine Debris',
        coordinates: { lat: 32.5534, lng: 77.0278 },
        defaultRiskScore: 81,
        localAreas: ['Keylong', 'Kaza', 'Atal Tunnel North Portal', 'Sissu', 'Tabo', 'Darcha', 'Losar'],
      },
      {
        id: 'chamba',
        name: 'Chamba',
        isHazardMonitored: true,
        elevation: 1006,
        slopeAngle: 32.0,
        lithology: 'Chamba Phyllite & Dalhousie Granites',
        coordinates: { lat: 32.553, lng: 76.1258 },
        defaultRiskScore: 74,
        localAreas: ['Dalhousie Town', 'Khajjiar', 'Bharmour (Mani Mahesh)', 'Killar (Pangi Valley)', 'Chowari'],
      },
    ],
  },

  // ==========================================
  // 10. JHARKHAND
  // ==========================================
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'ranchi',
        name: 'Ranchi',
        isHazardMonitored: false,
        elevation: 651,
        slopeAngle: 11.0,
        lithology: 'Chotanagpur Gneissic Complex',
        coordinates: { lat: 23.3441, lng: 85.3096 },
        defaultRiskScore: 24,
        localAreas: ['Tagore Hill', 'Hundru Falls Ghat', 'Jonha Slopes', 'Kanke', 'Doranda', 'Lalpur', 'Hatia'],
      },
      {
        id: 'east_singhbhum',
        name: 'East Singhbhum (Jamshedpur)',
        isHazardMonitored: false,
        elevation: 135,
        slopeAngle: 9.5,
        lithology: 'Singhbhum Shear Zone & Iron Ore Formations',
        coordinates: { lat: 22.8046, lng: 86.2029 },
        defaultRiskScore: 18,
        localAreas: ['Bistupur', 'Sakchi', 'Kadma', 'Dalma Hill Foothills', 'Ghatshila', 'Musabani'],
      },
      {
        id: 'giridih',
        name: 'Giridih (Parasnath Hills)',
        isHazardMonitored: true,
        elevation: 289,
        slopeAngle: 25.0,
        lithology: 'Granulites & Parasnath Quartzite Massif',
        coordinates: { lat: 24.18, lng: 86.3 },
        defaultRiskScore: 48,
        localAreas: ['Parasnath Peak Trail', 'Madhuban', 'Giridih Town', 'Dumri', 'Tisri'],
      },
      {
        id: 'latehar',
        name: 'Latehar (Netarhat Hills)',
        isHazardMonitored: true,
        elevation: 1071,
        slopeAngle: 22.0,
        lithology: 'Bauxite-Capped Deccan Traps & Granites',
        coordinates: { lat: 23.74, lng: 84.5 },
        defaultRiskScore: 45,
        localAreas: ['Netarhat Sunrise Point', 'Mahuadanr Valley', 'Latehar Town', 'Betla Sector', 'Barwadih'],
      },
      {
        id: 'dhanbad',
        name: 'Dhanbad',
        isHazardMonitored: false,
        elevation: 227,
        slopeAngle: 6.0,
        lithology: 'Damuda Gondwana Coal Measures',
        coordinates: { lat: 23.7957, lng: 86.4304 },
        defaultRiskScore: 21,
        localAreas: ['Bank More', 'Jharia Mine Sector', 'Govindpur', 'Katras', 'Sindri'],
      },
    ],
  },

  // ==========================================
  // 11. KARNATAKA
  // ==========================================
  {
    id: 'karnataka',
    name: 'Karnataka Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'kodagu',
        name: 'Kodagu (Coorg)',
        isHazardMonitored: true,
        elevation: 1061,
        slopeAngle: 26.5,
        lithology: 'Peninsular Gneissic Complex with Thick Humus Cap',
        coordinates: { lat: 12.3375, lng: 75.8069 },
        defaultRiskScore: 67,
        localAreas: ['Madikeri', 'Somwarpet', 'Virajpet', 'Sampaje Ghat Corridor', 'Makkandur Slide Zone', 'Kushalnagar', 'Bhagamandala'],
      },
      {
        id: 'chikkamagaluru',
        name: 'Chikkamagaluru (Mullayanagiri)',
        isHazardMonitored: true,
        elevation: 1090,
        slopeAngle: 27.0,
        lithology: 'Bababudan Banded Iron Formation & Schists',
        coordinates: { lat: 13.3161, lng: 75.772 },
        defaultRiskScore: 63,
        localAreas: ['Mullayanagiri Peak Slopes', 'Baba Budangiri', 'Koppa', 'Mudigere', 'Charmadi Ghat Corridor', 'Kudremukh Ridge', 'Sringeri'],
      },
      {
        id: 'dakshina_kannada',
        name: 'Dakshina Kannada (Mangaluru)',
        isHazardMonitored: true,
        elevation: 22,
        slopeAngle: 18.0,
        lithology: 'Coastal Plain Laterite & Charnockitic Inliers',
        coordinates: { lat: 12.9141, lng: 74.856 },
        defaultRiskScore: 48,
        localAreas: ['Shiradi Ghat Western Exit', 'Bantwal', 'Puttur', 'Belthangady', 'Surathkal', 'Kodialbail', 'Kadri Hills'],
      },
      {
        id: 'uttara_kannada',
        name: 'Uttara Kannada (Karwar)',
        isHazardMonitored: true,
        elevation: 15,
        slopeAngle: 24.0,
        lithology: 'Dharwar Schist Belt & Western Ghats Scarp',
        coordinates: { lat: 14.8185, lng: 74.1416 },
        defaultRiskScore: 59,
        localAreas: ['Anshi Ghat', 'Sirsi (Devimane Ghat)', 'Yellapur (Arbail Ghat)', 'Karwar Hill Slopes', 'Kumta', 'Gokarna', 'Bhatkal'],
      },
      {
        id: 'hassan',
        name: 'Hassan (Sakleshpur)',
        isHazardMonitored: true,
        elevation: 956,
        slopeAngle: 25.0,
        lithology: 'Dharwar Greenstones & Granitoids',
        coordinates: { lat: 12.9716, lng: 75.7876 },
        defaultRiskScore: 61,
        localAreas: ['Sakleshpur Town', 'Shiradi Ghat Entry', 'Donigal Rail Corridor', 'Belur', 'Halebidu', 'Alur'],
      },
      {
        id: 'bengaluru_urban',
        name: 'Bengaluru Urban',
        isHazardMonitored: false,
        elevation: 920,
        slopeAngle: 3.5,
        lithology: 'Bangalore Gneiss & Granitoid Suite',
        coordinates: { lat: 12.9716, lng: 77.5946 },
        defaultRiskScore: 8,
        localAreas: ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Electronic City', 'Hebbal', 'Yelahanka'],
      },
      {
        id: 'mysuru',
        name: 'Mysuru',
        isHazardMonitored: false,
        elevation: 763,
        slopeAngle: 8.0,
        lithology: 'Chamundi Granite & Amphibolites',
        coordinates: { lat: 12.2958, lng: 76.6394 },
        defaultRiskScore: 14,
        localAreas: ['Chamundi Hill Slopes', 'Gokulam', 'Jayalakshmipuram', 'Vijayanagar', 'Saraswathipuram', 'Nanjangud'],
      },
      {
        id: 'shivamogga',
        name: 'Shivamogga (Jog Falls & Agumbe)',
        isHazardMonitored: true,
        elevation: 580,
        slopeAngle: 28.0,
        lithology: 'Shimoga Schist Belt with Heavy Laterite',
        coordinates: { lat: 13.9299, lng: 75.5681 },
        defaultRiskScore: 66,
        localAreas: ['Agumbe Ghat Pass', 'Jog Falls Gorge', 'Thirthahalli', 'Sagar', 'Bhadravathi', 'Hosanagara'],
      },
    ],
  },

  // ==========================================
  // 12. KERALA
  // ==========================================
  {
    id: 'kerala',
    name: 'Kerala Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'wayanad',
        name: 'Wayanad',
        isHazardMonitored: true,
        elevation: 900,
        slopeAngle: 31.0,
        lithology: 'Charnockite & Hornblende Gneiss with Thick Weathered Colluvium',
        coordinates: { lat: 11.6854, lng: 76.132 },
        defaultRiskScore: 92,
        localAreas: ['Meppadi', 'Chooralmala Disaster Sector', 'Mundakkai', 'Vythiri', 'Kalpetta', 'Mananthavady', 'Thamarassery Ghat Base', 'Pookode'],
      },
      {
        id: 'idukki',
        name: 'Idukki',
        isHazardMonitored: true,
        elevation: 1200,
        slopeAngle: 34.5,
        lithology: 'Granulitic Charnockite & Migmatitic Gneiss',
        coordinates: { lat: 9.8494, lng: 76.9804 },
        defaultRiskScore: 84,
        localAreas: ['Munnar Gap Road', 'Devikulam', 'Pettimudi Sector', 'Adimali', 'Peerumade', 'Nedumkandam', 'Kattappana', 'Kuttikkanam'],
      },
      {
        id: 'pathanamthitta',
        name: 'Pathanamthitta (Sabarimala Range)',
        isHazardMonitored: true,
        elevation: 450,
        slopeAngle: 22.0,
        lithology: 'Khondalite & Pyroxene Granulite',
        coordinates: { lat: 9.2648, lng: 76.787 },
        defaultRiskScore: 56,
        localAreas: ['Ranni', 'Konni', 'Sabarimala Forest Route', 'Seethathodu', 'Moozhiyar Dam Road', 'Adoor'],
      },
      {
        id: 'kozhikode',
        name: 'Kozhikode (Thamarassery Churam)',
        isHazardMonitored: true,
        elevation: 20,
        slopeAngle: 29.0,
        lithology: 'Charnockitic Western Ghats Ridge',
        coordinates: { lat: 11.2588, lng: 75.7804 },
        defaultRiskScore: 68,
        localAreas: ['Thamarassery Ghat (Hairpin Bends)', 'Kakkadampoyil', 'Koduvally', 'Thiruvambady', 'Vadakara', 'Kozhikode Beach'],
      },
      {
        id: 'palakkad',
        name: 'Palakkad (Attappadi Hills)',
        isHazardMonitored: true,
        elevation: 84,
        slopeAngle: 24.5,
        lithology: 'Palghat Gap Granulite & Bhavani Shear Zone',
        coordinates: { lat: 10.7867, lng: 76.6548 },
        defaultRiskScore: 58,
        localAreas: ['Attappadi Hills (Agali)', 'Silent Valley Buffer', 'Nelliyampathy Ghat', 'Mannarkkad', 'Palakkad Town', 'Chittur'],
      },
      {
        id: 'thiruvananthapuram',
        name: 'Thiruvananthapuram (Ponmudi Hills)',
        isHazardMonitored: true,
        elevation: 10,
        slopeAngle: 23.0,
        lithology: 'Kerala Khondalite Belt & Coastal Sands',
        coordinates: { lat: 8.5241, lng: 76.9366 },
        defaultRiskScore: 49,
        localAreas: ['Ponmudi Hill Station', 'Vithura Slopes', 'Kowdiar', 'Technopark', 'Kazhakoottam', 'Varkala Cliff', 'Neyyattinkara'],
      },
      {
        id: 'ernakulam',
        name: 'Ernakulam (Kochi)',
        isHazardMonitored: false,
        elevation: 4,
        slopeAngle: 1.5,
        lithology: 'Vembanad Deltaic Alluvium & Beach Ridges',
        coordinates: { lat: 9.9312, lng: 76.2673 },
        defaultRiskScore: 9,
        localAreas: ['Marine Drive', 'Kakkanad (Infopark)', 'Fort Kochi', 'Edappally', 'Aluva', 'Muvattupuzha'],
      },
    ],
  },

  // ==========================================
  // 13. MADHYA PRADESH
  // ==========================================
  {
    id: 'madhya_pradesh',
    name: 'Madhya Pradesh',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'narmadapuram',
        name: 'Narmadapuram (Pachmarhi Hills)',
        isHazardMonitored: true,
        elevation: 1067,
        slopeAngle: 26.0,
        lithology: 'Satpura Gondwana Sandstone & Mahadeva Hills',
        coordinates: { lat: 22.4674, lng: 78.4343 },
        defaultRiskScore: 52,
        localAreas: ['Pachmarhi Hill Station', 'Dhupgarh Peak Ridge', 'Pipariya', 'Itarsi', 'Hoshangabad Ghat'],
      },
      {
        id: 'anuppur',
        name: 'Anuppur (Amarkantak)',
        isHazardMonitored: true,
        elevation: 1048,
        slopeAngle: 23.0,
        lithology: 'Maikal Range Bauxite & Deccan Basalts',
        coordinates: { lat: 22.67, lng: 81.75 },
        defaultRiskScore: 49,
        localAreas: ['Amarkantak Plateau', 'Kapildhara Escarpment', 'Kotma', 'Jaithari', 'Chhatarpur'],
      },
      {
        id: 'bhopal',
        name: 'Bhopal',
        isHazardMonitored: false,
        elevation: 527,
        slopeAngle: 5.5,
        lithology: 'Vindhyan Sandstone & Upper Lake Silt',
        coordinates: { lat: 23.2599, lng: 77.4126 },
        defaultRiskScore: 10,
        localAreas: ['Arera Colony', 'Shyamala Hills', 'MP Nagar', 'Kolar Road', 'Bairagarh', 'Karond'],
      },
      {
        id: 'indore',
        name: 'Indore',
        isHazardMonitored: false,
        elevation: 553,
        slopeAngle: 4.8,
        lithology: 'Malwa Deccan Trap Basalts',
        coordinates: { lat: 22.7196, lng: 75.8577 },
        defaultRiskScore: 8,
        localAreas: ['Vijay Nagar', 'Palasia', 'Rau', 'Bhawarkuan', 'Chappan Dukan', 'Super Corridor'],
      },
      {
        id: 'jabalpur',
        name: 'Jabalpur (Bhedaghat)',
        isHazardMonitored: false,
        elevation: 411,
        slopeAngle: 8.5,
        lithology: 'Narmada Marble Rocks & Lameta Beds',
        coordinates: { lat: 23.1815, lng: 79.9864 },
        defaultRiskScore: 16,
        localAreas: ['Bhedaghat Marble Gorge', 'Civil Lines', 'Wright Town', 'Madan Mahal Hills', 'Adhartal'],
      },
    ],
  },

  // ==========================================
  // 14. MAHARASHTRA
  // ==========================================
  {
    id: 'maharashtra',
    name: 'Maharashtra Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'raigad',
        name: 'Raigad (Western Ghats Esplanade)',
        isHazardMonitored: true,
        elevation: 450,
        slopeAngle: 32.0,
        lithology: 'Deccan Trap Basaltic Flows with Laterite Cap',
        coordinates: { lat: 18.235, lng: 73.444 },
        defaultRiskScore: 82,
        localAreas: ['Mahad', 'Irshalwadi Ridge (Disaster Sector)', 'Poladpur', 'Varandha Ghat', 'Mangaon', 'Alibaug', 'Karjat', 'Khopoli'],
      },
      {
        id: 'pune',
        name: 'Pune (Western Ghats / Sahyadri Sector)',
        isHazardMonitored: true,
        elevation: 560,
        slopeAngle: 27.0,
        lithology: 'Compound Basaltic Pahoehoe & Aa Flows',
        coordinates: { lat: 18.5204, lng: 73.8567 },
        defaultRiskScore: 67,
        localAreas: ['Malin Memorial Sector', 'Lonavala Khandala Ghat', 'Bhor Ghat Corridor', 'Tamhini Ghat', 'Kothrud', 'Viman Nagar', 'Hinjawadi', 'Lavasa Hills', 'Katraj Ghat'],
      },
      {
        id: 'satara',
        name: 'Satara (Mahabaleshwar Ridge)',
        isHazardMonitored: true,
        elevation: 1353,
        slopeAngle: 29.5,
        lithology: 'High-Altitude Laterite & Amygdaloidal Basalt',
        coordinates: { lat: 17.9237, lng: 73.6586 },
        defaultRiskScore: 71,
        localAreas: ['Mahabaleshwar', 'Panchgani Tableland', 'Koyna Valley Dam Sector', 'Patan', 'Ambenali Ghat Pass', 'Wai', 'Satara City'],
      },
      {
        id: 'ratnagiri',
        name: 'Ratnagiri (Konkan Coast)',
        isHazardMonitored: true,
        elevation: 11,
        slopeAngle: 24.0,
        lithology: 'Coastal Basalt & Thick Konkan Laterite Plateaus',
        coordinates: { lat: 16.9902, lng: 73.312 },
        defaultRiskScore: 62,
        localAreas: ['Chiplun (Vashishti River Basin)', 'Khed', 'Kumbharli Ghat', 'Guhagar', 'Rajapur', 'Ratnagiri Town', 'Sangameshwar'],
      },
      {
        id: 'sindhudurg',
        name: 'Sindhudurg (Amboli Ghat)',
        isHazardMonitored: true,
        elevation: 690,
        slopeAngle: 30.0,
        lithology: 'Sahyadri Crest Basalt & Laterite Escarpments',
        coordinates: { lat: 15.9604, lng: 73.8165 },
        defaultRiskScore: 73,
        localAreas: ['Amboli Ghat Waterfall Sector', 'Sawantwadi', 'Kankavli', 'Kudal', 'Malvan', 'Vengurla', 'Phonda Ghat'],
      },
      {
        id: 'mumbai_city',
        name: 'Mumbai City',
        isHazardMonitored: false,
        elevation: 14,
        slopeAngle: 3.5,
        lithology: 'Mumbai Spilite Basalt & Marine Clay',
        coordinates: { lat: 18.922, lng: 72.8347 },
        defaultRiskScore: 12,
        localAreas: ['Nariman Point', 'Colaba', 'Malabar Hill Ridge', 'Worli Seaface', 'Dadar', 'Byculla'],
      },
      {
        id: 'mumbai_suburban',
        name: 'Mumbai Suburban',
        isHazardMonitored: true,
        elevation: 19,
        slopeAngle: 12.0,
        lithology: 'Salsette Island Basalt & Alluvium',
        coordinates: { lat: 19.1136, lng: 72.8697 },
        defaultRiskScore: 36,
        localAreas: ['Asalpha Hill Slopes', 'Kurla (Khadi Slopes)', 'Andheri West', 'Bandra Kurla Complex', 'Borivali (National Park Fringe)', 'Ghatkopar Hills', 'Powai'],
      },
      {
        id: 'thane',
        name: 'Thane',
        isHazardMonitored: true,
        elevation: 25,
        slopeAngle: 16.0,
        lithology: 'Deccan Basalt Ridge & Ulhas Estuary Alluvium',
        coordinates: { lat: 19.2183, lng: 72.9781 },
        defaultRiskScore: 38,
        localAreas: ['Ghodbunder Road Slopes', 'Yeoor Hills Fringe', 'Mumbra Hills Escarpment', 'Kalyan', 'Dombivli', 'Ulhasnagar', 'Shahapur'],
      },
      {
        id: 'nashik',
        name: 'Nashik (Trimbak Hills)',
        isHazardMonitored: true,
        elevation: 600,
        slopeAngle: 21.0,
        lithology: 'Godavari Basin Compact Basalts',
        coordinates: { lat: 19.9975, lng: 73.7898 },
        defaultRiskScore: 44,
        localAreas: ['Trimbakeshwar Brahmagiri Hill', 'Igatpuri (Kasara Ghat Top)', 'Panchavati', 'College Road', 'Sinnar', 'Deolali'],
      },
      {
        id: 'kolhapur',
        name: 'Kolhapur (Gaganbawda Ghat)',
        isHazardMonitored: true,
        elevation: 569,
        slopeAngle: 25.0,
        lithology: 'Panhala Basaltic Plateau & Laterite',
        coordinates: { lat: 16.705, lng: 74.2433 },
        defaultRiskScore: 57,
        localAreas: ['Gaganbawda (Karul Ghat)', 'Panhala Fort Slopes', 'Radhanagari', 'Shahuwadi (Amba Ghat)', 'Rajarampuri', 'Tarabai Park'],
      },
      {
        id: 'nagpur',
        name: 'Nagpur',
        isHazardMonitored: false,
        elevation: 310,
        slopeAngle: 3.2,
        lithology: 'Deccan Traps & Kamthi Sandstone',
        coordinates: { lat: 21.1458, lng: 79.0882 },
        defaultRiskScore: 9,
        localAreas: ['Dharampeth', 'Civil Lines', 'Sitabuldi', 'Manish Nagar', 'Wardha Road', 'Ramdaspeth'],
      },
    ],
  },

  // ==========================================
  // 15. MANIPUR
  // ==========================================
  {
    id: 'manipur',
    name: 'Manipur Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'imphal_west',
        name: 'Imphal West',
        isHazardMonitored: false,
        elevation: 786,
        slopeAngle: 6.5,
        lithology: 'Imphal Valley Lacustrine & Fluvial Alluvium',
        coordinates: { lat: 24.817, lng: 93.9368 },
        defaultRiskScore: 26,
        localAreas: ['Imphal City', 'Thangal Bazar', 'Lamphelpat', 'Langol Hills Fringe', 'Sagolband'],
      },
      {
        id: 'churachandpur',
        name: 'Churachandpur',
        isHazardMonitored: true,
        elevation: 914,
        slopeAngle: 26.5,
        lithology: 'Disang Shales with Flysch Belt',
        coordinates: { lat: 24.3333, lng: 93.6667 },
        defaultRiskScore: 68,
        localAreas: ['Churachandpur Town', 'Tuibong', 'Singngat', 'Henglep Highway', 'Thanlon'],
      },
      {
        id: 'ukhrul',
        name: 'Ukhrul (Shirui Peak)',
        isHazardMonitored: true,
        elevation: 1662,
        slopeAngle: 29.0,
        lithology: 'Ophiolite Complex & Disang Shales',
        coordinates: { lat: 25.1167, lng: 94.3667 },
        defaultRiskScore: 74,
        localAreas: ['Ukhrul Town', 'Shirui Lily Ridge', 'Hundung', 'Jessami Road', 'Kamjong'],
      },
      {
        id: 'tamenglong',
        name: 'Tamenglong',
        isHazardMonitored: true,
        elevation: 1260,
        slopeAngle: 33.0,
        lithology: 'Barail Sandstone & Disang Group',
        coordinates: { lat: 24.9833, lng: 93.4833 },
        defaultRiskScore: 82,
        localAreas: ['Tamenglong Town', 'Noney (Imphal Rail Corridor)', 'Tousem', 'Khongsang', 'Tamei'],
      },
    ],
  },

  // ==========================================
  // 16. MEGHALAYA
  // ==========================================
  {
    id: 'meghalaya',
    name: 'Meghalaya Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'east_khasi_hills',
        name: 'East Khasi Hills (Shillong & Sohra)',
        isHazardMonitored: true,
        elevation: 1525,
        slopeAngle: 32.0,
        lithology: 'Shillong Group Quartzites, Conglomerates & Khasi Greenstones',
        coordinates: { lat: 25.5788, lng: 91.8933 },
        defaultRiskScore: 85,
        localAreas: ['Sohra (Cherrapunji)', 'Shillong Peak Corridor', 'Police Bazar', 'Laitumkhrah', 'Mawkynrew', 'Pynursla (Dawki Escarpment)', 'Elephant Falls Sector', 'Nongthymmai'],
      },
      {
        id: 'west_khasi_hills',
        name: 'West Khasi Hills (Nongstoin)',
        isHazardMonitored: true,
        elevation: 1409,
        slopeAngle: 28.0,
        lithology: 'Granite Gneiss & Weathered Sandstone',
        coordinates: { lat: 25.52, lng: 91.27 },
        defaultRiskScore: 71,
        localAreas: ['Nongstoin Town', 'Mairang', 'Kyllang Rock Corridor', 'Mawkyrwat', 'Ranikor'],
      },
      {
        id: 'ri_bhoi',
        name: 'Ri-Bhoi (NH6 Guwahati-Shillong Corridor)',
        isHazardMonitored: true,
        elevation: 650,
        slopeAngle: 25.0,
        lithology: 'Mylliem Granites & Archaean Gneiss',
        coordinates: { lat: 25.9, lng: 91.88 },
        defaultRiskScore: 69,
        localAreas: ['Nongpoh', 'Umiam (Barapani Lake Slopes)', 'Byrnihat Highway', 'Umsning', 'Jirang'],
      },
      {
        id: 'west_jaintia_hills',
        name: 'West Jaintia Hills (Jowai)',
        isHazardMonitored: true,
        elevation: 1380,
        slopeAngle: 27.5,
        lithology: 'Jaintia Group Limestone, Coal & Sandstone',
        coordinates: { lat: 25.45, lng: 92.2 },
        defaultRiskScore: 72,
        localAreas: ['Jowai Town', 'Thadlaskein Lake Sector', 'Amlarem (Krang Suri)', 'Nartiang', 'Dawki Border Checkpoint'],
      },
      {
        id: 'west_garo_hills',
        name: 'West Garo Hills (Tura)',
        isHazardMonitored: true,
        elevation: 349,
        slopeAngle: 26.0,
        lithology: 'Tura Sandstone & Granite Gneiss Complex',
        coordinates: { lat: 25.52, lng: 90.22 },
        defaultRiskScore: 66,
        localAreas: ['Tura Peak Slopes', 'Rongram', 'Phulbari', 'Dalu Border', 'Tikrikilla'],
      },
    ],
  },

  // ==========================================
  // 17. MIZORAM
  // ==========================================
  {
    id: 'mizoram',
    name: 'Mizoram Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'champhai',
        name: 'Champhai',
        isHazardMonitored: true,
        elevation: 2100,
        slopeAngle: 18.5,
        lithology: 'Alluvial Colluvium & Weathered Bedrock',
        coordinates: { lat: 23.475, lng: 93.328 },
        defaultRiskScore: 28,
        localAreas: ['Khawzawl', 'Champhai Town', 'Zokhawthar Border Gate', 'Vaphai', 'Dungtlang', 'Biate', 'Ngopa'],
      },
      {
        id: 'aizawl',
        name: 'Aizawl Capital District',
        isHazardMonitored: true,
        elevation: 1132,
        slopeAngle: 29.0,
        lithology: 'Surma Group Siltstone, Sandstone & Fragile Shale',
        coordinates: { lat: 23.7271, lng: 92.7176 },
        defaultRiskScore: 78,
        localAreas: ['Laipuitlang Slide Sector', 'Chite Veng', 'Bawngkawn', 'Ramhlun', 'Khatla', 'Tuirial', 'Durtlang Ridge', 'Zarkawt'],
      },
      {
        id: 'lunglei',
        name: 'Lunglei',
        isHazardMonitored: true,
        elevation: 1222,
        slopeAngle: 24.5,
        lithology: 'Tertiary Bhuban Formation with Siltstone Interbeds',
        coordinates: { lat: 22.8872, lng: 92.7397 },
        defaultRiskScore: 62,
        localAreas: ['Hnahthial', 'Rahsi Veng', 'Venglai', 'Serkawn', 'Tlabung'],
      },
      {
        id: 'serchhip',
        name: 'Serchhip (Thenzawl)',
        isHazardMonitored: true,
        elevation: 1296,
        slopeAngle: 21.0,
        lithology: 'Bhuban Formation Sandstone',
        coordinates: { lat: 23.3411, lng: 92.8504 },
        defaultRiskScore: 45,
        localAreas: ['Thenzawl (Vantawng Falls)', 'East Lungdar', 'Chhiahtlang', 'North Vanlaiphai'],
      },
      {
        id: 'kolasib',
        name: 'Kolasib (NH306 Corridor)',
        isHazardMonitored: true,
        elevation: 615,
        slopeAngle: 27.0,
        lithology: 'Bokabil Formation Shales & Clays',
        coordinates: { lat: 24.23, lng: 92.68 },
        defaultRiskScore: 73,
        localAreas: ['Kolasib Town', 'Vairengte Gateway', 'Bairabi Railhead', 'Bilkhawthlir'],
      },
    ],
  },

  // ==========================================
  // 18. NAGALAND
  // ==========================================
  {
    id: 'nagaland',
    name: 'Nagaland Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'kohima',
        name: 'Kohima (Dzükou Valley)',
        isHazardMonitored: true,
        elevation: 1444,
        slopeAngle: 32.0,
        lithology: 'Disang Group Flysch & Unstable Clay Intercalations',
        coordinates: { lat: 25.6701, lng: 94.1077 },
        defaultRiskScore: 82,
        localAreas: ['Dzükou Valley Approach', 'Kohima Town Center', 'Phesama Slide Zone', 'Jotsoma', 'Kigwema', 'Meriema', 'Tseminyu'],
      },
      {
        id: 'dimapur',
        name: 'Dimapur',
        isHazardMonitored: false,
        elevation: 145,
        slopeAngle: 4.5,
        lithology: 'Dhansiri River Alluvium',
        coordinates: { lat: 25.9095, lng: 93.7266 },
        defaultRiskScore: 18,
        localAreas: ['Chumoukedima (Ghat Entry)', 'Purana Bazar', 'Duncan Bosti', 'Padumpukhuri', 'Medziphema'],
      },
      {
        id: 'mokokchung',
        name: 'Mokokchung',
        isHazardMonitored: true,
        elevation: 1325,
        slopeAngle: 27.0,
        lithology: 'Barail Series Sandstones & Coal Beds',
        coordinates: { lat: 26.3256, lng: 94.5204 },
        defaultRiskScore: 68,
        localAreas: ['Mokokchung Town', 'Ungma', 'Mopungchuket', 'Changtongya', 'Tuli'],
      },
      {
        id: 'phek',
        name: 'Phek',
        isHazardMonitored: true,
        elevation: 1524,
        slopeAngle: 30.0,
        lithology: 'Disang Shales & Ophiolitic Melange',
        coordinates: { lat: 25.67, lng: 94.5 },
        defaultRiskScore: 75,
        localAreas: ['Pfütsero', 'Phek Town', 'Chozuba', 'Meluri', 'Shilloi Lake Sector'],
      },
    ],
  },

  // ==========================================
  // 19. ODISHA
  // ==========================================
  {
    id: 'odisha',
    name: 'Odisha',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'koraput',
        name: 'Koraput (Deomali Peak)',
        isHazardMonitored: true,
        elevation: 870,
        slopeAngle: 24.5,
        lithology: 'Eastern Ghats Khondalite & Charnockite Belt',
        coordinates: { lat: 18.8135, lng: 82.7119 },
        defaultRiskScore: 56,
        localAreas: ['Deomali Peak Slopes', 'Koraput Town', 'Jeypore', 'Sunabeda', 'Damanjodi (Bauxite Mine Slopes)', 'Semiliguda'],
      },
      {
        id: 'rayagada',
        name: 'Rayagada',
        isHazardMonitored: true,
        elevation: 207,
        slopeAngle: 21.0,
        lithology: 'Niyamgiri Bauxite & Granite Gneiss',
        coordinates: { lat: 19.1714, lng: 83.4163 },
        defaultRiskScore: 49,
        localAreas: ['Niyamgiri Hills Escarpment', 'Rayagada Town', 'Gunupur', 'Bissam Cuttack', 'Kashipur'],
      },
      {
        id: 'khordha',
        name: 'Khordha (Bhubaneswar Capital)',
        isHazardMonitored: false,
        elevation: 45,
        slopeAngle: 5.5,
        lithology: 'Athgarh Sandstone & Deltaic Laterite',
        coordinates: { lat: 20.2961, lng: 85.8245 },
        defaultRiskScore: 11,
        localAreas: ['Saheed Nagar', 'Nayapalli', 'Patia (Infocity)', 'Khandagiri Hills Fringe', 'Dhauli Hill Ridge', 'Jatni'],
      },
      {
        id: 'cuttack',
        name: 'Cuttack',
        isHazardMonitored: false,
        elevation: 36,
        slopeAngle: 2.2,
        lithology: 'Mahanadi Deltaic Silt & Alluvium',
        coordinates: { lat: 20.4625, lng: 85.8828 },
        defaultRiskScore: 9,
        localAreas: ['Badambadi', 'CDA Sector', 'Buxi Bazar', 'Choudwar', 'Barabati Fort Sector'],
      },
      {
        id: 'mayurbhanj',
        name: 'Mayurbhanj (Similipal)',
        isHazardMonitored: true,
        elevation: 550,
        slopeAngle: 22.0,
        lithology: 'Similipal Volcano-Sedimentary Complex',
        coordinates: { lat: 21.93, lng: 86.73 },
        defaultRiskScore: 47,
        localAreas: ['Baripada', 'Similipal Biosphere Slopes', 'Rairangpur', 'Jashipur', 'Karanjia'],
      },
    ],
  },

  // ==========================================
  // 20. PUNJAB
  // ==========================================
  {
    id: 'punjab',
    name: 'Punjab',
    type: 'state',
    isHazardMonitored: false,
    districts: [
      {
        id: 'amritsar',
        name: 'Amritsar',
        isHazardMonitored: false,
        elevation: 234,
        slopeAngle: 1.8,
        lithology: 'Bari Doab Fertile Alluvium',
        coordinates: { lat: 31.634, lng: 74.8723 },
        defaultRiskScore: 7,
        localAreas: ['Golden Temple Sector', 'Ranjit Avenue', 'Lawrence Road', 'Mall Road', 'Chheharta', 'Attari'],
      },
      {
        id: 'ludhiana',
        name: 'Ludhiana',
        isHazardMonitored: false,
        elevation: 244,
        slopeAngle: 2.1,
        lithology: 'Sutlej Riverine Alluvium',
        coordinates: { lat: 30.901, lng: 75.8573 },
        defaultRiskScore: 8,
        localAreas: ['Sarabha Nagar', 'Model Town', 'Civil Lines', 'Ferozepur Road', 'BRS Nagar', 'Sahnewal'],
      },
      {
        id: 'hoshiarpur',
        name: 'Hoshiarpur (Siwalik Foothills)',
        isHazardMonitored: true,
        elevation: 296,
        slopeAngle: 14.5,
        lithology: 'Siwalik Boulders & Loose Sandy Conglomerates',
        coordinates: { lat: 31.5271, lng: 75.9149 },
        defaultRiskScore: 34,
        localAreas: ['Dholbaha Dam Escarpment', 'Hoshiarpur City', 'Dasuya', 'Mukerian', 'Mahilpur'],
      },
      {
        id: 'rupnagar',
        name: 'Rupnagar (Ropar)',
        isHazardMonitored: true,
        elevation: 260,
        slopeAngle: 12.0,
        lithology: 'Siwalik Boulder Bed & Sutlej Alluvium',
        coordinates: { lat: 30.97, lng: 76.53 },
        defaultRiskScore: 28,
        localAreas: ['Anandpur Sahib Slopes', 'Rupnagar City', 'Nangal Dam Sector', 'Morinda', 'Chamkaur Sahib'],
      },
      {
        id: 'jalandhar',
        name: 'Jalandhar',
        isHazardMonitored: false,
        elevation: 228,
        slopeAngle: 1.9,
        lithology: 'Bist Doab Alluvial Plains',
        coordinates: { lat: 31.326, lng: 75.5762 },
        defaultRiskScore: 7,
        localAreas: ['Model Town', 'Civil Lines', 'Cantt Area', 'Rama Mandi', 'Adampur'],
      },
    ],
  },

  // ==========================================
  // 21. RAJASTHAN
  // ==========================================
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'sirohi',
        name: 'Sirohi (Mount Abu)',
        isHazardMonitored: true,
        elevation: 1220,
        slopeAngle: 27.0,
        lithology: 'Aravalli Mount Abu Granite Pluton',
        coordinates: { lat: 24.5926, lng: 72.7156 },
        defaultRiskScore: 61,
        localAreas: ['Mount Abu Nakki Lake Sector', 'Guru Shikhar Peak Road', 'Abu Road Ghat', 'Delwara', 'Sirohi Town', 'Pindwara'],
      },
      {
        id: 'udaipur',
        name: 'Udaipur (Aravalli Range)',
        isHazardMonitored: true,
        elevation: 598,
        slopeAngle: 18.5,
        lithology: 'Aravalli Quartzite, Phyllite & Marble',
        coordinates: { lat: 24.5854, lng: 73.7125 },
        defaultRiskScore: 36,
        localAreas: ['Sajjangarh Monsoon Palace Ridge', 'Fateh Sagar Slopes', 'Panchwati', 'Hiran Magri', 'Sukher', 'Chirwa Ghat (Tunnel Sector)'],
      },
      {
        id: 'jaipur',
        name: 'Jaipur',
        isHazardMonitored: false,
        elevation: 431,
        slopeAngle: 12.0,
        lithology: 'Alwar Quartzite Hills & Sandy Plains',
        coordinates: { lat: 26.9124, lng: 75.7873 },
        defaultRiskScore: 16,
        localAreas: ['Nahargarh Fort Ridge', 'Jaigarh Hill Slopes', 'Amer Pass', 'Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Mansarovar'],
      },
      {
        id: 'jodhpur',
        name: 'Jodhpur',
        isHazardMonitored: false,
        elevation: 231,
        slopeAngle: 8.0,
        lithology: 'Jodhpur Sandstone & Malani Rhyolite',
        coordinates: { lat: 26.2389, lng: 73.0243 },
        defaultRiskScore: 12,
        localAreas: ['Mehrangarh Fort Scarp', 'Ratanada', 'Shastri Nagar', 'Mandore', 'Paota'],
      },
      {
        id: 'ajmer',
        name: 'Ajmer (Taragarh)',
        isHazardMonitored: true,
        elevation: 480,
        slopeAngle: 19.0,
        lithology: 'Delhi Supergroup Quartzite & Schist',
        coordinates: { lat: 26.4499, lng: 74.6399 },
        defaultRiskScore: 32,
        localAreas: ['Taragarh Hill Road', 'Pushkar Ghat Pass', 'Civil Lines', 'Vaishali Nagar', 'Nasirabad'],
      },
    ],
  },

  // ==========================================
  // 22. SIKKIM
  // ==========================================
  {
    id: 'sikkim',
    name: 'Sikkim Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'mangan',
        name: 'Mangan (North Sikkim)',
        isHazardMonitored: true,
        elevation: 1310,
        slopeAngle: 38.0,
        lithology: 'Higher Himalayan Crystalline Belt & Fluvial Debris',
        coordinates: { lat: 27.5042, lng: 88.5309 },
        defaultRiskScore: 94,
        localAreas: ['Chungthang Dam Sector', 'Lachung Highway Corridor', 'Lachen', 'Dzongu Disaster Sector', 'Singtam Border', 'Dikchu'],
      },
      {
        id: 'gangtok',
        name: 'Gangtok Capital District',
        isHazardMonitored: true,
        elevation: 1650,
        slopeAngle: 28.5,
        lithology: 'Daling Group Phyllites, Schists & Weathered Overburden',
        coordinates: { lat: 27.3389, lng: 88.6065 },
        defaultRiskScore: 76,
        localAreas: ['Tadong Slide Zone', 'Ranipool NH10 Hub', 'Burtuk Slide Corridor', 'Deorali', 'Chandmari', 'MG Marg', 'Syari'],
      },
      {
        id: 'namchi',
        name: 'Namchi (South Sikkim)',
        isHazardMonitored: true,
        elevation: 1315,
        slopeAngle: 25.0,
        lithology: 'Gondwana Sandstone & Shales',
        coordinates: { lat: 27.1666, lng: 88.3666 },
        defaultRiskScore: 64,
        localAreas: ['Jorethang', 'Ravangla (Buddha Park Ridge)', 'Temi Tea Estate', 'Melli Border Bridge', 'Namchi Bazaar'],
      },
      {
        id: 'gyalshing',
        name: 'Gyalshing (West Sikkim)',
        isHazardMonitored: true,
        elevation: 1900,
        slopeAngle: 30.0,
        lithology: 'Kanchenjunga Gneiss & Mica Schist',
        coordinates: { lat: 27.28, lng: 88.23 },
        defaultRiskScore: 72,
        localAreas: ['Pelling Skywalk Ridge', 'Gyalshing Town', 'Yuksom Base', 'Dentam', 'Tashiding'],
      },
      {
        id: 'pakyong',
        name: 'Pakyong',
        isHazardMonitored: true,
        elevation: 1120,
        slopeAngle: 29.0,
        lithology: 'Phyllite & High-Cut Airport Slopes',
        coordinates: { lat: 27.23, lng: 88.58 },
        defaultRiskScore: 78,
        localAreas: ['Pakyong Airport Escarpment', 'Rorathang', 'Rhenock (Silk Route)', 'Rangpo NH10 Corridor'],
      },
    ],
  },

  // ==========================================
  // 23. TAMIL NADU
  // ==========================================
  {
    id: 'tamil_nadu',
    name: 'Tamil Nadu Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'nilgiris',
        name: 'The Nilgiris',
        isHazardMonitored: true,
        elevation: 2240,
        slopeAngle: 29.0,
        lithology: 'Archaean Charnockite Massif with Deep Residual Soils',
        coordinates: { lat: 11.4102, lng: 76.695 },
        defaultRiskScore: 79,
        localAreas: ['Ooty Town (Stone House Hill)', 'Coonoor Ghat Hairpin Sector', 'Kotagiri Road', 'Gudalur', 'Marapalam Slide Zone', 'Ketti Valley', 'Pykara'],
      },
      {
        id: 'dindigul',
        name: 'Dindigul (Kodaikanal Hills)',
        isHazardMonitored: true,
        elevation: 2133,
        slopeAngle: 26.0,
        lithology: 'Charnockitic Gneiss & Leptynites',
        coordinates: { lat: 10.2381, lng: 77.4892 },
        defaultRiskScore: 65,
        localAreas: ['Kodaikanal Ghat Road', 'Pannaikadu', 'Batlagundu Escarpment', 'Perumal Malai', 'Vattakanal', 'Dindigul City'],
      },
      {
        id: 'coimbatore',
        name: 'Coimbatore (Valparai Hills)',
        isHazardMonitored: true,
        elevation: 1193,
        slopeAngle: 28.0,
        lithology: 'Anamalai Hills Charnockite Suite',
        coordinates: { lat: 10.3236, lng: 76.9558 },
        defaultRiskScore: 72,
        localAreas: ['Valparai (40 Hairpin Ghat)', 'Pollachi Base', 'Aliyar Dam Sector', 'Peelamedu', 'Gandhipuram', 'RS Puram', 'Marudhamalai Slopes'],
      },
      {
        id: 'salem',
        name: 'Salem (Yercaud / Shevaroy Hills)',
        isHazardMonitored: true,
        elevation: 1515,
        slopeAngle: 24.0,
        lithology: 'Charnockite & Pyroxene Granulite',
        coordinates: { lat: 11.7753, lng: 78.2093 },
        defaultRiskScore: 54,
        localAreas: ['Yercaud Ghat Road (20 Hairpin Bends)', 'Shevaroy Peak', 'Salem City', 'Suramangalam', 'Hasthampatti'],
      },
      {
        id: 'chennai',
        name: 'Chennai',
        isHazardMonitored: false,
        elevation: 6,
        slopeAngle: 1.5,
        lithology: 'Coromandel Coastal Sands & Adyar/Cooum Alluvium',
        coordinates: { lat: 13.0827, lng: 80.2707 },
        defaultRiskScore: 8,
        localAreas: ['T Nagar', 'Anna Nagar', 'Velachery', 'OMR (IT Corridor)', 'Adyar', 'Mylapore', 'Tambaram', 'St. Thomas Mount Ridge'],
      },
      {
        id: 'tirunelveli',
        name: 'Tirunelveli (Manjolai Hills)',
        isHazardMonitored: true,
        elevation: 1020,
        slopeAngle: 27.0,
        lithology: 'Agasthyamalai Charnockite Belt',
        coordinates: { lat: 8.7139, lng: 77.7567 },
        defaultRiskScore: 61,
        localAreas: ['Manjolai Tea Estate Ghat', 'Kakkachi', 'Manimuthar Dam Sector', 'Palayamkottai', 'Ambasamudram'],
      },
    ],
  },

  // ==========================================
  // 24. TELANGANA
  // ==========================================
  {
    id: 'telangana',
    name: 'Telangana',
    type: 'state',
    isHazardMonitored: false,
    districts: [
      {
        id: 'hyderabad',
        name: 'Hyderabad',
        isHazardMonitored: false,
        elevation: 542,
        slopeAngle: 4.8,
        lithology: 'Hyderabad Granite Pluton & Sheet Rocks',
        coordinates: { lat: 17.385, lng: 78.4867 },
        defaultRiskScore: 9,
        localAreas: ['Banjara Hills', 'Jubilee Hills Ridge', 'Gachibowli', 'Hitec City', 'Madhapur', 'Secunderabad', 'Charminar Sector', 'Kukatpally'],
      },
      {
        id: 'rangareddy',
        name: 'Rangareddy',
        isHazardMonitored: false,
        elevation: 550,
        slopeAngle: 5.2,
        lithology: 'Peninsular Gneissic Inliers',
        coordinates: { lat: 17.34, lng: 78.55 },
        defaultRiskScore: 10,
        localAreas: ['Shamshabad Airport Sector', 'Rajendranagar', 'L.B. Nagar', 'Ibrahimpatnam', 'Manikonda'],
      },
      {
        id: 'bhadradri_kothagudem',
        name: 'Bhadradri Kothagudem',
        isHazardMonitored: true,
        elevation: 120,
        slopeAngle: 16.0,
        lithology: 'Godavari Pranhita Basin Shales & Sandstone',
        coordinates: { lat: 17.55, lng: 80.61 },
        defaultRiskScore: 35,
        localAreas: ['Bhadrachalam Godavari Ridge', 'Kothagudem Mining Sector', 'Palwancha', 'Yellandu', 'Manuguru'],
      },
      {
        id: 'warangal',
        name: 'Warangal',
        isHazardMonitored: false,
        elevation: 266,
        slopeAngle: 4.0,
        lithology: 'Granite Tors & Alluvial Clay',
        coordinates: { lat: 17.9689, lng: 79.5941 },
        defaultRiskScore: 11,
        localAreas: ['Hanamkonda', 'Kazipet', 'Warangal Fort Sector', 'Subedari', 'Narsampet'],
      },
    ],
  },

  // ==========================================
  // 25. TRIPURA
  // ==========================================
  {
    id: 'tripura',
    name: 'Tripura Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'west_tripura',
        name: 'West Tripura (Agartala)',
        isHazardMonitored: false,
        elevation: 15,
        slopeAngle: 6.0,
        lithology: 'Howrah River Alluvium & Tipam Sandstones',
        coordinates: { lat: 23.8315, lng: 91.2868 },
        defaultRiskScore: 22,
        localAreas: ['Agartala Town', 'Banamalipur', 'Kunjaban Hills Fringe', 'Udaipur Highway', 'Amtali'],
      },
      {
        id: 'dhalai',
        name: 'Dhalai (Atharamura Range)',
        isHazardMonitored: true,
        elevation: 250,
        slopeAngle: 24.0,
        lithology: 'Surma & Tipam Folded Siltstone Ridge',
        coordinates: { lat: 23.84, lng: 91.85 },
        defaultRiskScore: 63,
        localAreas: ['Ambassa', 'Atharamura Hill Pass (NH8)', 'Manu Valley', 'Gandacharra', 'Longtharai Valley'],
      },
      {
        id: 'north_tripura',
        name: 'North Tripura (Jampui Hills)',
        isHazardMonitored: true,
        elevation: 930,
        slopeAngle: 28.0,
        lithology: 'Upper Bhuban Siltstone & Clay Bands',
        coordinates: { lat: 24.2, lng: 92.25 },
        defaultRiskScore: 69,
        localAreas: ['Jampui Hills (Vanghmun)', 'Dharmanagar', 'Kanchanpur', 'Damcherra', 'Phuldungsei'],
      },
      {
        id: 'unakoti',
        name: 'Unakoti',
        isHazardMonitored: true,
        elevation: 85,
        slopeAngle: 21.0,
        lithology: 'Tipam Group Sandstone Scarp',
        coordinates: { lat: 24.3, lng: 92.02 },
        defaultRiskScore: 57,
        localAreas: ['Unakoti Rock Carvings Hill', 'Kailashahar', 'Kumarghat', 'Pecharthal'],
      },
    ],
  },

  // ==========================================
  // 26. UTTAR PRADESH
  // ==========================================
  {
    id: 'uttar_pradesh',
    name: 'Uttar Pradesh',
    type: 'state',
    isHazardMonitored: false,
    districts: [
      {
        id: 'lucknow',
        name: 'Lucknow',
        isHazardMonitored: false,
        elevation: 123,
        slopeAngle: 1.8,
        lithology: 'Gomti River Basin Alluvium',
        coordinates: { lat: 26.8467, lng: 80.9462 },
        defaultRiskScore: 7,
        localAreas: ['Hazratganj', 'Gomti Nagar', 'Alambagh', 'Indira Nagar', 'Mahanagar', 'Jankipuram', 'Vibhuti Khand'],
      },
      {
        id: 'varanasi',
        name: 'Varanasi',
        isHazardMonitored: false,
        elevation: 81,
        slopeAngle: 3.5,
        lithology: 'Ganga Kankar & Fine Clay Alluvium',
        coordinates: { lat: 25.3176, lng: 82.9739 },
        defaultRiskScore: 9,
        localAreas: ['Dashashwamedh Ghat', 'Assi Ghat', 'Lanka (BHU)', 'Sigra', 'Cantt', 'Sarnath'],
      },
      {
        id: 'gautam_buddha_nagar',
        name: 'Gautam Buddha Nagar (Noida)',
        isHazardMonitored: false,
        elevation: 200,
        slopeAngle: 2.0,
        lithology: 'Hindon & Yamuna Floodplain Silt',
        coordinates: { lat: 28.5355, lng: 77.391 },
        defaultRiskScore: 8,
        localAreas: ['Sector 18', 'Sector 62', 'Noida Expressway', 'Greater Noida (Knowledge Park)', 'Pari Chowk'],
      },
      {
        id: 'saharanpur',
        name: 'Saharanpur (Shivalik Foothills)',
        isHazardMonitored: true,
        elevation: 269,
        slopeAngle: 18.0,
        lithology: 'Upper Siwalik Conglomerates & River Gravels',
        coordinates: { lat: 29.9671, lng: 77.5452 },
        defaultRiskScore: 38,
        localAreas: ['Shakumbhari Devi Hill Pass', 'Mohand Ghat Corridor', 'Deoband', 'Behat', 'Saharanpur City'],
      },
      {
        id: 'sonbhadra',
        name: 'Sonbhadra (Vindhyan Hills)',
        isHazardMonitored: true,
        elevation: 285,
        slopeAngle: 19.5,
        lithology: 'Kaimur Sandstone & Rihand Schists',
        coordinates: { lat: 24.68, lng: 83.07 },
        defaultRiskScore: 36,
        localAreas: ['Robertsganj', 'Renukoot (Rihand Dam Slopes)', 'Obra', 'Chopan', 'Anpara'],
      },
      {
        id: 'agra',
        name: 'Agra',
        isHazardMonitored: false,
        elevation: 169,
        slopeAngle: 2.5,
        lithology: 'Yamuna Alluvium & Vindhyan Outliers',
        coordinates: { lat: 27.1767, lng: 78.0081 },
        defaultRiskScore: 8,
        localAreas: ['Tajganj', 'Sanjay Place', 'Fatehabad Road', 'Dayalbagh', 'Sikandra', 'Khandari'],
      },
      {
        id: 'kanpur_nagar',
        name: 'Kanpur Nagar',
        isHazardMonitored: false,
        elevation: 126,
        slopeAngle: 2.2,
        lithology: 'Gangetic Sandy Loam',
        coordinates: { lat: 26.4499, lng: 80.3319 },
        defaultRiskScore: 8,
        localAreas: ['Civil Lines', 'Swaroop Nagar', 'Kakadeo', 'Kidwai Nagar', 'Kalyanpur', 'Mall Road'],
      },
      {
        id: 'prayagraj',
        name: 'Prayagraj (Allahabad)',
        isHazardMonitored: false,
        elevation: 98,
        slopeAngle: 2.8,
        lithology: 'Ganga-Yamuna Doab Silt',
        coordinates: { lat: 25.4358, lng: 81.8463 },
        defaultRiskScore: 9,
        localAreas: ['Civil Lines', 'Sangam Sector', 'George Town', 'Naini', 'Katra', 'Tagore Town'],
      },
    ],
  },

  // ==========================================
  // 27. UTTARAKHAND
  // ==========================================
  {
    id: 'uttarakhand',
    name: 'Uttarakhand Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'chamoli',
        name: 'Chamoli (Joshimath & Badrinath)',
        isHazardMonitored: true,
        elevation: 1890,
        slopeAngle: 38.0,
        lithology: 'Garhwal Group Quartzite & Main Central Thrust Shears',
        coordinates: { lat: 30.5544, lng: 79.5422 },
        defaultRiskScore: 91,
        localAreas: ['Joshimath Subsidence Sector', 'Badrinath Highway', 'Gopeshwar', 'Helang', 'Ghat', 'Pipalkoti', 'Nandaprayag', 'Auli'],
      },
      {
        id: 'rudraprayag',
        name: 'Rudraprayag (Kedarnath Corridor)',
        isHazardMonitored: true,
        elevation: 895,
        slopeAngle: 36.0,
        lithology: 'Central Himalayan Crystalline Gneiss & Mica Schists',
        coordinates: { lat: 30.2858, lng: 78.9815 },
        defaultRiskScore: 89,
        localAreas: ['Kedarnath Corridor', 'Guptkashi', 'Ukhimath', 'Sonprayag (Shitlakund)', 'Agastyamuni', 'Rudraprayag Town', 'Gaurikund'],
      },
      {
        id: 'nainital',
        name: 'Nainital',
        isHazardMonitored: true,
        elevation: 2084,
        slopeAngle: 28.0,
        lithology: 'Krol Limestone, Infra-Krol Slates & Balia Ravine Fault',
        coordinates: { lat: 29.3803, lng: 79.4636 },
        defaultRiskScore: 68,
        localAreas: ['Mallital', 'Tallital', 'Bhowali', 'Bhimtal', 'Mukteshwar', 'Jeolikote Ghat', 'Kathgodam Exit'],
      },
      {
        id: 'uttarkashi',
        name: 'Uttarkashi (Gangotri Highway)',
        isHazardMonitored: true,
        elevation: 1158,
        slopeAngle: 34.0,
        lithology: 'Berinag Quartzite & Morainic Colluvium',
        coordinates: { lat: 30.7268, lng: 78.4354 },
        defaultRiskScore: 81,
        localAreas: ['Silkyara Tunnel Corridor', 'Gangotri Highway', 'Barkot', 'Bhatwari', 'Harsil Valley', 'Dharasu Bend'],
      },
      {
        id: 'dehradun',
        name: 'Dehradun (Mussoorie Hills)',
        isHazardMonitored: true,
        elevation: 640,
        slopeAngle: 24.5,
        lithology: 'Mussoorie Syncline Krol Limestone & Doon Gravels',
        coordinates: { lat: 30.3165, lng: 78.0322 },
        defaultRiskScore: 59,
        localAreas: ['Mussoorie Mall Road', 'Kempty Falls Road', 'Rajpur Road Slopes', 'Rishikesh Bypass', 'Sahastradhara', 'Clement Town'],
      },
      {
        id: 'pithoragarh',
        name: 'Pithoragarh (Dharchula)',
        isHazardMonitored: true,
        elevation: 1627,
        slopeAngle: 37.0,
        lithology: 'Main Central Thrust Crystallines & Fluvial Gravels',
        coordinates: { lat: 29.58, lng: 80.22 },
        defaultRiskScore: 86,
        localAreas: ['Dharchula Kali River Corridor', 'Munsyari', 'Berinag', 'Pithoragarh Town', 'Tanakpur-Tawaghat Road'],
      },
      {
        id: 'tehri_garhwal',
        name: 'Tehri Garhwal',
        isHazardMonitored: true,
        elevation: 1550,
        slopeAngle: 31.0,
        lithology: 'Chandpur Phyllites & Dam Reservoir Rim Slopes',
        coordinates: { lat: 30.38, lng: 78.48 },
        defaultRiskScore: 75,
        localAreas: ['New Tehri', 'Chamba (Garhwal)', 'Tehri Dam Rim Sector', 'Devprayag', 'Narendra Nagar Ghat'],
      },
      {
        id: 'almora',
        name: 'Almora (Ranikhet)',
        isHazardMonitored: true,
        elevation: 1638,
        slopeAngle: 25.0,
        lithology: 'Almora Crystallines Granite Gneiss',
        coordinates: { lat: 29.597, lng: 79.659 },
        defaultRiskScore: 58,
        localAreas: ['Ranikhet Mall', 'Almora Bazaar', 'Kausani Ridge', 'Dwarahat', 'Majkhali'],
      },
      {
        id: 'haridwar',
        name: 'Haridwar',
        isHazardMonitored: true,
        elevation: 314,
        slopeAngle: 16.0,
        lithology: 'Mansa Devi / Chandi Devi Siwalik Sandstone',
        coordinates: { lat: 29.9457, lng: 78.1642 },
        defaultRiskScore: 42,
        localAreas: ['Mansa Devi Hill Slope', 'Chandi Devi Ridge', 'Har Ki Pauri Sector', 'Roorkee', 'Shivalik Nagar'],
      },
    ],
  },

  // ==========================================
  // 28. WEST BENGAL
  // ==========================================
  {
    id: 'west_bengal',
    name: 'West Bengal Δ (Hazard Monitored Sector)',
    type: 'state',
    isHazardMonitored: true,
    districts: [
      {
        id: 'darjeeling',
        name: 'Darjeeling (Himalayan Ridge)',
        isHazardMonitored: true,
        elevation: 2042,
        slopeAngle: 32.0,
        lithology: 'Darjeeling Gneiss & Daling Schist Series with High Moisture Retention',
        coordinates: { lat: 27.036, lng: 88.2627 },
        defaultRiskScore: 82,
        localAreas: ['Darjeeling Town', 'Kurseong (Paglajhora Slide Zone)', 'Mirik Lake Hills', 'Batasia Loop Sector', 'Ghoom', 'Lebong', 'Sukhiapokhri', 'Tindharia', 'Pankhabari Ghat', 'Bijanbari'],
      },
      {
        id: 'kalimpong',
        name: 'Kalimpong (Teesta River Gorge)',
        isHazardMonitored: true,
        elevation: 1250,
        slopeAngle: 35.0,
        lithology: 'Daling Group Phyllites, Slates & Sheared Quartzites',
        coordinates: { lat: 27.0594, lng: 88.4695 },
        defaultRiskScore: 88,
        localAreas: ['Kalimpong Town', 'Lava', 'Rishyap', 'Pedong', 'Gorubathan', 'Teesta Bazaar (NH10 Hub)', 'Algara', 'Bhalu Marg'],
      },
      {
        id: 'north_24_parganas',
        name: 'North 24 Parganas',
        isHazardMonitored: false,
        elevation: 11,
        slopeAngle: 2.1,
        lithology: 'Lower Gangetic Deltaic Silt & Clay Alluvium',
        coordinates: { lat: 22.7185, lng: 88.4795 },
        defaultRiskScore: 12,
        localAreas: ['Ashoknagar', 'Habra', 'Barasat (District HQ)', 'Bhatpara', 'Bongaon', 'Barrackpore', 'Madhyamgram', 'Naihati', 'Dum Dum', 'Kanchrapara', 'Basirhat'],
      },
      {
        id: 'kolkata',
        name: 'Kolkata',
        isHazardMonitored: false,
        elevation: 9,
        slopeAngle: 1.5,
        lithology: 'Hooghly Estuarine Tidal Silt & Clay',
        coordinates: { lat: 22.5726, lng: 88.3639 },
        defaultRiskScore: 8,
        localAreas: ['Kolkata Center', 'Park Street', 'Salt Lake (Sector V)', 'New Town', 'Ballygunge', 'Alipore', 'Shyambazar', 'Gariahat', 'Behala', 'Howrah Bridge Approach'],
      },
      {
        id: 'jalpaiguri',
        name: 'Jalpaiguri (Dooars Foothills)',
        isHazardMonitored: true,
        elevation: 89,
        slopeAngle: 12.0,
        lithology: 'Siwalik Alluvium & Riverine Terraces',
        coordinates: { lat: 26.5414, lng: 88.7196 },
        defaultRiskScore: 38,
        localAreas: ['Malbazar', 'Nagrakata (Jaldhaka Valley)', 'Birpara', 'Dhupguri', 'Jalpaiguri Town', 'Maynaguri'],
      },
      {
        id: 'alipurduar',
        name: 'Alipurduar (Buxa Hills)',
        isHazardMonitored: true,
        elevation: 93,
        slopeAngle: 21.0,
        lithology: 'Buxa Dolomite & Bhutan Himalayan Foothills',
        coordinates: { lat: 26.4919, lng: 89.5271 },
        defaultRiskScore: 54,
        localAreas: ['Buxa Fort Ridge', 'Jaigaon (Bhutan Border)', 'Kumargram', 'Falakata', 'Alipurduar Town', 'Madarihat (Jaldapara)'],
      },
      {
        id: 'south_24_parganas',
        name: 'South 24 Parganas (Sundarbans)',
        isHazardMonitored: false,
        elevation: 6,
        slopeAngle: 1.2,
        lithology: 'Mangrove Mudflats & Marine Clay',
        coordinates: { lat: 22.15, lng: 88.4 },
        defaultRiskScore: 15,
        localAreas: ['Diamond Harbour', 'Kakdwip', 'Gosaba (Sundarbans)', 'Canning', 'Baruipur', 'Budge Budge', 'Sagar Island'],
      },
      {
        id: 'howrah',
        name: 'Howrah',
        isHazardMonitored: false,
        elevation: 12,
        slopeAngle: 1.8,
        lithology: 'Hooghly River Alluvial Bank',
        coordinates: { lat: 22.5958, lng: 88.2636 },
        defaultRiskScore: 8,
        localAreas: ['Howrah Station Sector', 'Shibpur', 'Bally', 'Uluberia', 'Santragachi', 'Liluah'],
      },
      {
        id: 'hooghly',
        name: 'Hooghly',
        isHazardMonitored: false,
        elevation: 16,
        slopeAngle: 2.0,
        lithology: 'Gangetic Alluvium',
        coordinates: { lat: 22.8963, lng: 88.3797 },
        defaultRiskScore: 9,
        localAreas: ['Chinsurah', 'Serampore', 'Chandannagar', 'Uttarpara', 'Bandel', 'Tarakeswar', 'Arambagh'],
      },
      {
        id: 'paschim_bardhaman',
        name: 'Paschim Bardhaman (Asansol & Durgapur)',
        isHazardMonitored: false,
        elevation: 97,
        slopeAngle: 6.5,
        lithology: 'Raniganj Coal Measures & Laterite',
        coordinates: { lat: 23.6889, lng: 86.9661 },
        defaultRiskScore: 16,
        localAreas: ['Asansol City', 'Durgapur Steel City', 'Raniganj Mining Fringe', 'Kulti', 'Chittaranjan', 'Andal'],
      },
      {
        id: 'purulia',
        name: 'Purulia (Ayodhya Hills)',
        isHazardMonitored: true,
        elevation: 228,
        slopeAngle: 22.0,
        lithology: 'Chotanagpur Granite Gneiss & Phyllites',
        coordinates: { lat: 23.33, lng: 86.36 },
        defaultRiskScore: 46,
        localAreas: ['Ayodhya Hills Peak Sector', 'Baghmundi', 'Purulia Town', 'Jhalda', 'Raghunathpur', 'Balarampur'],
      },
      {
        id: 'bankura',
        name: 'Bankura (Susunia & Biharinath)',
        isHazardMonitored: true,
        elevation: 78,
        slopeAngle: 19.0,
        lithology: 'Granite Gneiss & Red Laterite',
        coordinates: { lat: 23.23, lng: 87.07 },
        defaultRiskScore: 35,
        localAreas: ['Susunia Hill Slopes', 'Biharinath Peak Sector', 'Mukutmanipur Dam', 'Bankura Town', 'Bishnupur', 'Khatra'],
      },
      {
        id: 'nadia',
        name: 'Nadia (Kalyani & Krishnanagar)',
        isHazardMonitored: false,
        elevation: 14,
        slopeAngle: 1.8,
        lithology: 'Bhagirathi Floodplain Alluvium',
        coordinates: { lat: 23.4, lng: 88.5 },
        defaultRiskScore: 9,
        localAreas: ['Kalyani AIIMS Sector', 'Krishnanagar', 'Ranaghat', 'Nabadwip', 'Santipur', 'Chakdaha'],
      },
      {
        id: 'purba_medinipur',
        name: 'Purba Medinipur (Digha)',
        isHazardMonitored: false,
        elevation: 10,
        slopeAngle: 2.0,
        lithology: 'Bay of Bengal Coastal Dune Sand',
        coordinates: { lat: 21.6266, lng: 87.5074 },
        defaultRiskScore: 14,
        localAreas: ['Digha Sea Beach', 'Tamluk', 'Haldia Port', 'Contai', 'Mandarmani', 'Kolaghat'],
      },
    ],
  },

  // ==========================================
  // 29. ANDAMAN AND NICOBAR ISLANDS (UT)
  // ==========================================
  {
    id: 'andaman_nicobar',
    name: 'Andaman & Nicobar Islands (UT)',
    type: 'ut',
    isHazardMonitored: true,
    districts: [
      {
        id: 'south_andaman',
        name: 'South Andaman (Port Blair)',
        isHazardMonitored: true,
        elevation: 40,
        slopeAngle: 23.5,
        lithology: 'Andaman Flysch Sandstone & Ophiolite Melange',
        coordinates: { lat: 11.6234, lng: 92.7265 },
        defaultRiskScore: 58,
        localAreas: ['Mount Harriet (Mount Manipur) Ridge', 'Port Blair City', 'Havelock (Swaraj Dweep)', 'Neil Island', 'Chidiya Tapu Slopes', 'Ferrargunj'],
      },
      {
        id: 'north_middle_andaman',
        name: 'North and Middle Andaman (Saddle Peak)',
        isHazardMonitored: true,
        elevation: 732,
        slopeAngle: 28.0,
        lithology: 'Ophiolitic Basalt & Ultramafic Complex',
        coordinates: { lat: 12.92, lng: 92.93 },
        defaultRiskScore: 66,
        localAreas: ['Saddle Peak Escarpment', 'Mayabunder', 'Diglipur', 'Rangat', 'Baratang Mud Volcano Sector'],
      },
      {
        id: 'nicobar',
        name: 'Nicobar Islands',
        isHazardMonitored: true,
        elevation: 18,
        slopeAngle: 18.0,
        lithology: 'Coral Limestone & Uplifted Marine Sediments',
        coordinates: { lat: 9.16, lng: 92.78 },
        defaultRiskScore: 52,
        localAreas: ['Car Nicobar', 'Campbell Bay (Great Nicobar)', 'Nancowry', 'Katchal'],
      },
    ],
  },

  // ==========================================
  // 30. CHANDIGARH (UT)
  // ==========================================
  {
    id: 'chandigarh_ut',
    name: 'Chandigarh (UT Capital)',
    type: 'ut',
    isHazardMonitored: false,
    districts: [
      {
        id: 'chandigarh_city',
        name: 'Chandigarh City',
        isHazardMonitored: false,
        elevation: 321,
        slopeAngle: 3.5,
        lithology: 'Siwalik Piedmont Alluvium & Sukhna Silt',
        coordinates: { lat: 30.7333, lng: 76.7794 },
        defaultRiskScore: 9,
        localAreas: ['Sector 17 Plaza', 'Sukhna Lake Sector', 'Sector 35', 'Sector 43 (ISBT)', 'IT Park', 'Manimajra', 'Sector 22'],
      },
    ],
  },

  // ==========================================
  // 31. DADRA AND NAGAR HAVELI AND DAMAN AND DIU (UT)
  // ==========================================
  {
    id: 'dnh_dd_ut',
    name: 'Dadra & Nagar Haveli and Daman & Diu (UT)',
    type: 'ut',
    isHazardMonitored: false,
    districts: [
      {
        id: 'daman',
        name: 'Daman',
        isHazardMonitored: false,
        elevation: 5,
        slopeAngle: 1.5,
        lithology: 'Daman Ganga Estuarine Mud & Coastal Sand',
        coordinates: { lat: 20.3974, lng: 72.8328 },
        defaultRiskScore: 7,
        localAreas: ['Moti Daman', 'Nani Daman', 'Devka Beach', 'Jampore Beach', 'Kachigam'],
      },
      {
        id: 'diu',
        name: 'Diu',
        isHazardMonitored: false,
        elevation: 8,
        slopeAngle: 3.0,
        lithology: 'Miliolite Calcareous Sandstone',
        coordinates: { lat: 20.7144, lng: 70.9874 },
        defaultRiskScore: 8,
        localAreas: ['Diu Fort Cliff', 'Nagoa Beach', 'Ghoghla', 'Fudam', 'Vanakbara'],
      },
      {
        id: 'silvassa',
        name: 'Dadra and Nagar Haveli (Silvassa)',
        isHazardMonitored: false,
        elevation: 32,
        slopeAngle: 8.0,
        lithology: 'Deccan Trap Basalts & Daman Ganga Alluvium',
        coordinates: { lat: 20.2763, lng: 73.0083 },
        defaultRiskScore: 14,
        localAreas: ['Silvassa Town', 'Khanvel Slopes', 'Dadra', 'Rakholi', 'Naroli'],
      },
    ],
  },

  // ==========================================
  // 32. DELHI (NCT) (UT)
  // ==========================================
  {
    id: 'delhi_ncr',
    name: 'Delhi (NCT)',
    type: 'ut',
    isHazardMonitored: false,
    districts: [
      {
        id: 'new_delhi',
        name: 'New Delhi',
        isHazardMonitored: false,
        elevation: 216,
        slopeAngle: 2.1,
        lithology: 'Yamuna Alluvium & Delhi Quartzite Ridge',
        coordinates: { lat: 28.6139, lng: 77.209 },
        defaultRiskScore: 8,
        localAreas: ['Connaught Place', 'Chanakyapuri', 'Barakhamba', 'India Gate Sector', 'Lodhi Estate', 'Khan Market'],
      },
      {
        id: 'south_delhi',
        name: 'South Delhi (Aravalli Ridge)',
        isHazardMonitored: false,
        elevation: 235,
        slopeAngle: 5.5,
        lithology: 'Alwar Group Quartzite Inliers',
        coordinates: { lat: 28.5355, lng: 77.209 },
        defaultRiskScore: 10,
        localAreas: ['Saket', 'Hauz Khas', 'Greater Kailash', 'Vasant Kunj Ridge', 'Mehrauli', 'Lajpat Nagar', 'Kalkaji'],
      },
      {
        id: 'south_west_delhi',
        name: 'South West Delhi (Dwarka)',
        isHazardMonitored: false,
        elevation: 214,
        slopeAngle: 2.0,
        lithology: 'Najafgarh Drain Loamy Alluvium',
        coordinates: { lat: 28.5921, lng: 77.046 },
        defaultRiskScore: 8,
        localAreas: ['Dwarka Sector 1-24', 'Palam', 'Janakpuri', 'Delhi Airport Aerocity', 'Najafgarh'],
      },
      {
        id: 'north_delhi',
        name: 'North Delhi (Ridge Sector)',
        isHazardMonitored: false,
        elevation: 218,
        slopeAngle: 4.8,
        lithology: 'Northern Ridge Quartzite & Yamuna Sand',
        coordinates: { lat: 28.6863, lng: 77.2218 },
        defaultRiskScore: 9,
        localAreas: ['Delhi University Campus', 'Civil Lines', 'Kamla Nagar', 'Model Town', 'Kashmere Gate'],
      },
      {
        id: 'north_west_delhi',
        name: 'North West Delhi (Rohini)',
        isHazardMonitored: false,
        elevation: 212,
        slopeAngle: 2.0,
        lithology: 'Indo-Gangetic Sandy Alluvium',
        coordinates: { lat: 28.7495, lng: 77.0565 },
        defaultRiskScore: 8,
        localAreas: ['Rohini Sector 1-38', 'Pitampura', 'Prashant Vihar', 'Shalimar Bagh', 'Saraswati Vihar'],
      },
    ],
  },

  // ==========================================
  // 33. JAMMU AND KASHMIR (UT)
  // ==========================================
  {
    id: 'jammu_kashmir',
    name: 'Jammu & Kashmir Δ (Hazard Monitored Sector)',
    type: 'ut',
    isHazardMonitored: true,
    districts: [
      {
        id: 'srinagar',
        name: 'Srinagar Capital District',
        isHazardMonitored: true,
        elevation: 1585,
        slopeAngle: 21.0,
        lithology: 'Karewa Lacustrine Silt & Panjal Traps',
        coordinates: { lat: 34.0837, lng: 74.7973 },
        defaultRiskScore: 62,
        localAreas: ['Shankaracharya Hill Slopes', 'Zabarwan Range Fringe', 'Lal Chowk', 'Dal Lake Boulevard', 'Hazratbal', 'Harwan', 'Rajbagh'],
      },
      {
        id: 'ramban',
        name: 'Ramban (NH44 Jammu-Srinagar Corridor)',
        isHazardMonitored: true,
        elevation: 1156,
        slopeAngle: 41.0,
        lithology: 'Ramban Formation Shales, Slates & Sheared Quartzites',
        coordinates: { lat: 33.24, lng: 75.25 },
        defaultRiskScore: 96,
        localAreas: ['Nashri Slide Corridor', 'Panthyal Rockfall Sector', 'Marog Highway', 'Battery Chashma', 'Khooni Nallah', 'Banihal Tunnel Entry', 'Ramban Town'],
      },
      {
        id: 'anantnag',
        name: 'Anantnag (Pahalgam)',
        isHazardMonitored: true,
        elevation: 1600,
        slopeAngle: 28.0,
        lithology: 'Triassic Limestone & Lidder Moraines',
        coordinates: { lat: 33.73, lng: 75.15 },
        defaultRiskScore: 71,
        localAreas: ['Pahalgam Valley', 'Aru Valley Corridor', 'Anantnag Town', 'Bijbehara', 'Kokernag', 'Qazigund'],
      },
      {
        id: 'baramulla',
        name: 'Baramulla (Gulmarg)',
        isHazardMonitored: true,
        elevation: 2650,
        slopeAngle: 32.0,
        lithology: 'Pir Panjal Trap Basalts & Glacial Moraines',
        coordinates: { lat: 34.05, lng: 74.38 },
        defaultRiskScore: 77,
        localAreas: ['Gulmarg Gondola Base', 'Tangmarg Ghat Pass', 'Baramulla Town', 'Uri (LOC Gorge)', 'Pattan', 'Sopore'],
      },
      {
        id: 'reasi',
        name: 'Reasi (Vaishno Devi Shrine)',
        isHazardMonitored: true,
        elevation: 750,
        slopeAngle: 33.5,
        lithology: 'Sirban Dolomite / Great Limestone Scarp',
        coordinates: { lat: 33.08, lng: 74.83 },
        defaultRiskScore: 84,
        localAreas: ['Vaishno Devi Bhawan Track (Trikuta Hills)', 'Katra Base Camp', 'Chenab Rail Bridge (Bakkal Sector)', 'Reasi Town', 'Shivkhori'],
      },
      {
        id: 'doda',
        name: 'Doda (Chenab Valley)',
        isHazardMonitored: true,
        elevation: 1107,
        slopeAngle: 36.0,
        lithology: 'Bhadarwah Slate & Salkhala Crystallines',
        coordinates: { lat: 33.14, lng: 75.54 },
        defaultRiskScore: 88,
        localAreas: ['Thathri Slide Zone', 'Bhadarwah Valley', 'Doda Town', 'Assar Highway', 'Gandoh'],
      },
      {
        id: 'jammu_city',
        name: 'Jammu',
        isHazardMonitored: false,
        elevation: 327,
        slopeAngle: 11.0,
        lithology: 'Upper Siwalik Boulders & Tawi Alluvium',
        coordinates: { lat: 32.7266, lng: 74.857 },
        defaultRiskScore: 24,
        localAreas: ['Bahu Fort Hill', 'Gandhi Nagar', 'Channi Himmat', 'Nagrota Bypass', 'Satwari', 'Trikuta Nagar'],
      },
    ],
  },

  // ==========================================
  // 34. LADAKH (UT)
  // ==========================================
  {
    id: 'ladakh_ut',
    name: 'Ladakh Δ (Hazard Monitored Sector)',
    type: 'ut',
    isHazardMonitored: true,
    districts: [
      {
        id: 'leh',
        name: 'Leh (Khardung La Corridor)',
        isHazardMonitored: true,
        elevation: 3524,
        slopeAngle: 34.0,
        lithology: 'Ladakh Batholith Granite & Periglacial Colluvium',
        coordinates: { lat: 34.1526, lng: 77.5771 },
        defaultRiskScore: 79,
        localAreas: ['Leh Palace Slopes', 'Khardung La Pass', 'Nubra Valley (Diskit)', 'Pangong Lake Road (Chang La)', 'Choglamsar', 'Shey', 'Thiksey'],
      },
      {
        id: 'kargil',
        name: 'Kargil (Zoji La & Dras)',
        isHazardMonitored: true,
        elevation: 2676,
        slopeAngle: 39.0,
        lithology: 'Dras Volcanics & Indus Suture Zone Shales',
        coordinates: { lat: 34.5539, lng: 76.1349 },
        defaultRiskScore: 89,
        localAreas: ['Zoji La Pass Passable Cut', 'Dras (Cold Zone)', 'Kargil Town', 'Zanskar Valley (Padum)', 'Sankoo (Suru Valley)', 'Mulbekh'],
      },
    ],
  },

  // ==========================================
  // 35. LAKSHADWEEP (UT)
  // ==========================================
  {
    id: 'lakshadweep_ut',
    name: 'Lakshadweep (UT)',
    type: 'ut',
    isHazardMonitored: false,
    districts: [
      {
        id: 'kavaratti',
        name: 'Lakshadweep Islands',
        isHazardMonitored: false,
        elevation: 2,
        slopeAngle: 1.0,
        lithology: 'Atoll Coral Reef & Calcareous Sand',
        coordinates: { lat: 10.5667, lng: 72.6417 },
        defaultRiskScore: 6,
        localAreas: ['Kavaratti Island (HQ)', 'Agatti Airport Island', 'Minicoy Island', 'Andrott', 'Amini', 'Kadmat', 'Kalpeni'],
      },
    ],
  },

  // ==========================================
  // 36. PUDUCHERRY (UT)
  // ==========================================
  {
    id: 'puducherry_ut',
    name: 'Puducherry (UT)',
    type: 'ut',
    isHazardMonitored: false,
    districts: [
      {
        id: 'puducherry_city',
        name: 'Puducherry District',
        isHazardMonitored: false,
        elevation: 3,
        slopeAngle: 1.2,
        lithology: 'Coastal Deltaic Silt & Alluvium',
        coordinates: { lat: 11.9416, lng: 79.8083 },
        defaultRiskScore: 7,
        localAreas: ['White Town (French Quarter)', 'Auroville Corridor', 'Gingee Salai', 'Oulgaret', 'Villianur', 'Karaikal', 'Mahe', 'Yanam'],
      },
    ],
  },
];

// Helper to find location details by keys
export function resolveLocation(
  stateIdOrName: string,
  districtIdOrName: string,
  areaName: string
): UserLocation {
  const cleanState = (stateIdOrName || '').toLowerCase().trim();
  const cleanDistrict = (districtIdOrName || '').toLowerCase().trim();
  const cleanArea = (areaName || '').toLowerCase().trim();

  // 1. Match State
  const state =
    INDIAN_STATES.find(
      (s) =>
        s.id.toLowerCase() === cleanState ||
        s.name.toLowerCase() === cleanState ||
        s.name.toLowerCase().includes(cleanState) ||
        cleanState.includes(s.id.toLowerCase())
    ) || INDIAN_STATES[0];

  // 2. Match District
  const district =
    state.districts.find(
      (d) =>
        d.id.toLowerCase() === cleanDistrict ||
        d.name.toLowerCase() === cleanDistrict ||
        d.name.toLowerCase().includes(cleanDistrict) ||
        cleanDistrict.includes(d.id.toLowerCase())
    ) || state.districts[0];

  // 3. Match Area (or default to first)
  const matchedArea =
    district.localAreas.find(
      (a) => a.toLowerCase() === cleanArea || a.toLowerCase().includes(cleanArea)
    ) || district.localAreas[0];

  const riskScore = district.defaultRiskScore;
  const riskLevel =
    riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 30 ? 'MODERATE' : 'LOW';

  return {
    state: state.name.replace(' Δ (Hazard Monitored Sector)', '').replace(' (UT)', '').trim(),
    district: district.name.replace(/\([^)]*\)/g, '').trim(),
    area: matchedArea,
    coordinates: district.coordinates,
    elevation: district.elevation,
    slopeAngle: district.slopeAngle,
    lithology: district.lithology,
    riskScore,
    riskLevel,
    isHazardMonitored: district.isHazardMonitored,
  };
}

export const DEFAULT_USER_LOCATION: UserLocation = {
  state: 'West Bengal',
  district: 'Darjeeling',
  area: 'Kurseong',
  coordinates: { lat: 27.036, lng: 88.2627 },
  elevation: 2042,
  slopeAngle: 32.0,
  lithology: 'Darjeeling Gneiss & Daling Schist Series with High Moisture Retention',
  riskScore: 82,
  riskLevel: 'CRITICAL',
  isHazardMonitored: true,
};

// Search all localities in India
export interface FlatLocationResult {
  state: string;
  stateId: string;
  district: string;
  districtId: string;
  area: string;
  isMonitored: boolean;
  score: number;
  elevation: number;
  slopeAngle: number;
  lithology: string;
  coordinates: { lat: number; lng: number };
}

export function searchAllIndianLocations(query: string): FlatLocationResult[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const results: FlatLocationResult[] = [];

  for (const st of INDIAN_STATES) {
    const cleanStateName = st.name
      .replace(' Δ (Hazard Monitored Sector)', '')
      .replace(' (UT)', '')
      .trim();

    for (const dist of st.districts) {
      const cleanDistName = dist.name.replace(/\([^)]*\)/g, '').trim();

      for (const area of dist.localAreas) {
        const areaLower = area.toLowerCase();
        const distLower = dist.name.toLowerCase();
        const stateLower = cleanStateName.toLowerCase();

        if (
          areaLower.includes(q) ||
          distLower.includes(q) ||
          stateLower.includes(q)
        ) {
          // Calculate search relevance score
          const exactMatch = areaLower === q || distLower === q;
          const startsWithMatch = areaLower.startsWith(q) || distLower.startsWith(q);

          results.push({
            state: cleanStateName,
            stateId: st.id,
            district: cleanDistName,
            districtId: dist.id,
            area,
            isMonitored: dist.isHazardMonitored,
            score: dist.defaultRiskScore,
            elevation: dist.elevation,
            slopeAngle: dist.slopeAngle,
            lithology: dist.lithology,
            coordinates: dist.coordinates,
          });
        }
      }
    }
  }

  // Sort: Exact & startsWith matches first, then monitored hazard areas
  results.sort((a, b) => {
    const aAreaLower = a.area.toLowerCase();
    const bAreaLower = b.area.toLowerCase();
    if (aAreaLower.startsWith(q) && !bAreaLower.startsWith(q)) return -1;
    if (!aAreaLower.startsWith(q) && bAreaLower.startsWith(q)) return 1;
    return b.score - a.score;
  });

  return results.slice(0, 24);
}

// Calculate Haversine distance in km between two lat/lng pairs
function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Reverse geocode lat/lng to the closest Indian district and area
export function findNearestLocationByCoordinates(lat: number, lng: number): UserLocation {
  let closestDistance = Infinity;
  let bestState = INDIAN_STATES[0];
  let bestDistrict = INDIAN_STATES[0].districts[0];

  for (const st of INDIAN_STATES) {
    for (const dist of st.districts) {
      const d = getHaversineDistanceKm(lat, lng, dist.coordinates.lat, dist.coordinates.lng);
      if (d < closestDistance) {
        closestDistance = d;
        bestState = st;
        bestDistrict = dist;
      }
    }
  }

  const cleanState = bestState.name.replace(' Δ (Hazard Monitored Sector)', '').replace(' (UT)', '').trim();
  const cleanDistrict = bestDistrict.name.replace(/\([^)]*\)/g, '').trim();
  const area = bestDistrict.localAreas[0] || cleanDistrict;

  const riskScore = bestDistrict.defaultRiskScore;
  const riskLevel =
    riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 30 ? 'MODERATE' : 'LOW';

  return {
    state: cleanState,
    district: cleanDistrict,
    area,
    coordinates: {
      lat: Math.round(lat * 10000) / 10000,
      lng: Math.round(lng * 10000) / 10000,
    },
    elevation: bestDistrict.elevation,
    slopeAngle: bestDistrict.slopeAngle,
    lithology: bestDistrict.lithology,
    riskScore,
    riskLevel,
    isHazardMonitored: bestDistrict.isHazardMonitored,
  };
}

