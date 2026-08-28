import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserLocation,
  AppRoute,
  SimulationScenario,
  SensorTelemetry,
  ChatMessage,
  CorridorSafety,
  ActiveAdvisory,
} from '../types';
import { DEFAULT_USER_LOCATION } from '../data/locations';
import { clearClientSession } from '../services/authClient';
import {
  getLocationTelemetry,
  getLocationCorridorSafety,
  getLocationAdvisory,
  INITIAL_CORRIDOR_SAFETY,
  INITIAL_ACTIVE_ADVISORY,
} from '../data/disasterData';
import {
  buildChatbotContext,
  loadChatHistory,
  saveChatHistory,
  clearChatHistory,
  sendChatMessageApi,
} from '../services/aiChatService';
import { fetchValidatedWeather } from '../services/locationDataService';
import { fetchDisasterNews } from '../services/disasterNewsClient';
import {
  getDeviceGpsCoordinates,
  reverseGeocodeCoordinates,
  buildUserLocationFromGps,
  getNextLocationRequestId,
  getCurrentLocationRequestId,
} from '../services/geolocationService';

interface AppContextType {
  userProfile: UserProfile;
  isOnboardingComplete: boolean;
  isAnalyzingLocation: boolean;
  analyzingLocationName: string;
  isDetectingGps: boolean;
  gpsStatusText: string;
  gpsError: string | null;
  detectAndApplyGpsLocation: () => Promise<UserLocation | null>;
  dismissGpsError: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setUserLocation: (location: UserLocation) => void;
  changeUserLocation: (location: UserLocation) => Promise<void>;
  loginUser: (profile: UserProfile) => Promise<void>;
  logoutUser: () => void;
  completeOnboarding: (details: {
    name: string;
    mobile?: string;
    email?: string;
    age?: number;
    ageGroup: any;
    location: UserLocation;
  }) => Promise<void>;
  activeRoute: AppRoute;
  setActiveRoute: (route: AppRoute) => void;
  scenario: SimulationScenario;
  setScenario: (scenario: SimulationScenario) => void;
  telemetry: SensorTelemetry;
  riskScore: number;
  riskDelta: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  corridorSafety: CorridorSafety;
  activeAdvisory: ActiveAdvisory;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
  openAppointmentModal: (serviceType?: string) => void;
  appointmentServiceType: string;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isAiAgentOpen: boolean;
  setIsAiAgentOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendAiMessage: (message: string) => Promise<void>;
  clearChatMessages: () => void;
  isAiTyping: boolean;
  resetOnboarding: () => void;
  savedLocations: UserLocation[];
  toggleSaveLocation: (loc: UserLocation) => void;
}

const STORAGE_KEY = 'landsafe_ai_user_profile_v3';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load saved profile strictly if valid and onboarded
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.onboarded && parsed.name && parsed.location) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved profile:', e);
      }
    }
    return {
      name: '',
      mobile: '',
      email: '',
      age: undefined,
      ageGroup: '18–24',
      location: DEFAULT_USER_LOCATION,
      savedLocations: [DEFAULT_USER_LOCATION],
      onboarded: false,
    };
  });

  const [activeRoute, setActiveRoute] = useState<AppRoute>('dashboard');
  const [scenario, setScenario] = useState<SimulationScenario>('MONSOON_SURGE');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentServiceType, setAppointmentServiceType] = useState('Geotechnical Slope Stability & FoS Audit');
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const openAppointmentModal = (serviceType?: string) => {
    if (serviceType) {
      setAppointmentServiceType(serviceType);
    }
    setIsAppointmentModalOpen(true);
  };

  // Dynamic Loading / Analyzing state during onboarding or location change
  const [isAnalyzingLocation, setIsAnalyzingLocation] = useState(false);
  const [analyzingLocationName, setAnalyzingLocationName] = useState('');

  // GPS Location Detection States
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState('Detecting your location...');
  const [gpsError, setGpsError] = useState<string | null>(null);

  const dismissGpsError = () => {
    setGpsError(null);
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = loadChatHistory();
    if (saved && saved.length > 0) {
      return saved.map((s) => ({
        id: s.id,
        role: s.role,
        content: s.content,
        timestamp: s.timestamp,
        source: s.source,
      }));
    }
    return [
      {
        id: 'msg-init',
        role: 'assistant',
        content: `**Welcome to LandSafe AI Disaster Risk Assistant.**\n\nI am connected to the live telemetry stream for **${userProfile.location?.area || 'Monitoring Sector'}, ${userProfile.location?.district || 'District'} (${userProfile.location?.state || 'India'})**.\n\nAsk me about:\n- **Why is the risk high / moderate / low in ${userProfile.location?.area || 'your area'}?**\n- **Live rainfall, temperature, humidity & soil moisture**\n- **Safe evacuation corridors & highway statuses**\n- **Recent natural disaster news in India**\n\n*(You can ask in English, বাংলা, or हिन्दी)*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'LANDSAFE_CORE_GEO_MESH',
      },
    ];
  });

  // Keep chat history in local storage
  useEffect(() => {
    if (chatMessages && chatMessages.length > 0) {
      saveChatHistory(
        chatMessages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
          source: m.source,
          locationName: userProfile.location?.area,
        }))
      );
    }
  }, [chatMessages, userProfile.location?.area]);

  const clearChatMessages = () => {
    clearChatHistory();
    const loc = userProfile.location || DEFAULT_USER_LOCATION;
    const initialGreeting: ChatMessage = {
      id: `msg-init-${Date.now()}`,
      role: 'assistant',
      content: `**Welcome to LandSafe AI Disaster Risk Assistant.**\n\nI am connected to the live telemetry stream for **${loc.area || 'Monitoring Sector'}, ${loc.district || 'District'} (${loc.state || 'India'})**.\n\nAsk me about:\n- **Why is the risk high / moderate / low in ${loc.area || 'your area'}?**\n- **Live rainfall, temperature, humidity & soil moisture**\n- **Safe evacuation corridors & highway statuses**\n- **Recent natural disaster news in India**\n\n*(You can ask in English, বাংলা, or हिन्दी)*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'LANDSAFE_CORE_GEO_MESH',
    };
    setChatMessages([initialGreeting]);
  };

  // Persist profile whenever onboarded
  useEffect(() => {
    if (userProfile.onboarded && userProfile.name) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Dynamic telemetry & risk calculations derived from the active user's location and simulation scenario
  const locationObj = userProfile.location || DEFAULT_USER_LOCATION;
  const { telemetry, riskScore, riskDelta, riskLevel } = getLocationTelemetry(locationObj, scenario);
  const corridorSafety = getLocationCorridorSafety(locationObj, riskScore);
  const activeAdvisory = getLocationAdvisory(locationObj, riskScore);

  const isOnboardingComplete = Boolean(userProfile.onboarded && userProfile.name);

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const setUserLocation = (location: UserLocation) => {
    // Invalidate any ongoing GPS requests so manual or newer actions always prevail
    getNextLocationRequestId();

    setUserProfile((prev) => {
      const updatedProfile: UserProfile = {
        ...prev,
        location,
        savedLocations: prev.savedLocations?.some(
          (l) => l.district === location.district && l.area === location.area
        )
          ? prev.savedLocations
          : [...(prev.savedLocations || []), location],
      };

      // Persist immediately to localStorage
      if (updatedProfile.onboarded && updatedProfile.name) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
        } catch (e) {
          console.error('Storage error:', e);
        }
      }

      return updatedProfile;
    });
  };

  // Change location with realistic analysis loading animation and clean UI feedback
  const changeUserLocation = async (location: UserLocation) => {
    setAnalyzingLocationName(`${location.area}, ${location.district} (${location.state})`);
    setIsAnalyzingLocation(true);
    setUserLocation(location);

    await new Promise((resolve) => setTimeout(resolve, 650));
    setIsAnalyzingLocation(false);
  };

  // Real-time GPS Location Detection with Device Geolocation API & Reverse Geocoding
  const detectAndApplyGpsLocation = async (): Promise<UserLocation | null> => {
    const reqId = getNextLocationRequestId();
    setIsDetectingGps(true);
    setGpsStatusText('Detecting your location...');
    setGpsError(null);

    try {
      // 1. Get real GPS coordinates from browser Geolocation API
      const { latitude, longitude } = await getDeviceGpsCoordinates(12000);

      // Check for race condition
      if (reqId !== getCurrentLocationRequestId()) {
        return null;
      }

      setGpsStatusText('Reverse geocoding area name...');

      // 2. Reverse geocode to exact locality name following: Locality -> City/Town -> District -> State
      const geoResult = await reverseGeocodeCoordinates(latitude, longitude);

      if (reqId !== getCurrentLocationRequestId()) {
        return null;
      }

      // 3. Build comprehensive UserLocation
      const newGpsLocation = buildUserLocationFromGps(latitude, longitude, geoResult);

      // 4. Update the single source of truth
      setUserLocation(newGpsLocation);
      setAnalyzingLocationName(`${newGpsLocation.area}, ${newGpsLocation.state}`);

      return newGpsLocation;
    } catch (err: any) {
      if (reqId === getCurrentLocationRequestId()) {
        const errorMsg =
          err.userFriendlyMessage ||
          err.message ||
          'Unable to detect your GPS position. Please choose a location manually.';
        setGpsError(errorMsg);
      }
      return null;
    } finally {
      if (reqId === getCurrentLocationRequestId()) {
        setIsDetectingGps(false);
        setGpsStatusText('Detecting your location...');
      }
    }
  };

  // Login existing user directly and restore dashboard and location
  const loginUser = async (profile: UserProfile) => {
    const loc = profile.location || DEFAULT_USER_LOCATION;
    setAnalyzingLocationName(`${loc.area}, ${loc.district} (${loc.state})`);
    setIsAnalyzingLocation(true);

    const fullProfile: UserProfile = {
      ...profile,
      location: loc,
      savedLocations: profile.savedLocations && profile.savedLocations.length > 0 ? profile.savedLocations : [loc],
      onboarded: true,
    };

    setUserProfile(fullProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullProfile));
    setActiveRoute('dashboard');

    await new Promise((resolve) => setTimeout(resolve, 750));
    setIsAnalyzingLocation(false);
  };

  // Complete onboarding seamlessly with validation, loading animation, and immediate dashboard launch
  const completeOnboarding = async (details: {
    name: string;
    mobile?: string;
    email?: string;
    age?: number;
    ageGroup: any;
    location: UserLocation;
  }) => {
    setAnalyzingLocationName(`${details.location.area}, ${details.location.district} (${details.location.state})`);
    setIsAnalyzingLocation(true);

    const fullProfile: UserProfile = {
      name: details.name.trim(),
      mobile: details.mobile?.trim() || '',
      email: details.email?.trim() || '',
      age: details.age,
      ageGroup: details.ageGroup || '18–24',
      location: details.location || DEFAULT_USER_LOCATION,
      savedLocations: [details.location || DEFAULT_USER_LOCATION],
      onboarded: true,
      registeredAt: new Date().toISOString(),
    };

    setUserProfile(fullProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullProfile));
    setActiveRoute('dashboard');

    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsAnalyzingLocation(false);
  };

  const toggleSaveLocation = (loc: UserLocation) => {
    setUserProfile((prev) => {
      const exists = prev.savedLocations?.some(
        (l) => l.district === loc.district && l.area === loc.area
      );
      if (exists) {
        return {
          ...prev,
          savedLocations: prev.savedLocations?.filter(
            (l) => !(l.district === loc.district && l.area === loc.area)
          ),
        };
      } else {
        return {
          ...prev,
          savedLocations: [...(prev.savedLocations || []), loc],
        };
      }
    });
  };

  const logoutUser = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('landsafe_auth_token_v3');
      sessionStorage.removeItem('landsafe_auth_token_v3');
      sessionStorage.clear();
      clearClientSession();
    } catch (e) {
      console.error('Error clearing auth storage:', e);
    }

    // Reset modals & drawer states
    setIsLocationModalOpen(false);
    setIsNotificationDrawerOpen(false);
    setIsAiAgentOpen(false);
    setIsAnalyzingLocation(false);

    // Reset profile to non-onboarded state
    setUserProfile({
      name: '',
      mobile: '',
      email: '',
      age: undefined,
      ageGroup: '18–24',
      location: DEFAULT_USER_LOCATION,
      savedLocations: [DEFAULT_USER_LOCATION],
      onboarded: false,
    });

    setActiveRoute('dashboard');

    try {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    } catch (err) {
      // safe fallback
    }
  };

  const resetOnboarding = () => {
    logoutUser();
  };

  const sendAiMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    try {
      // 1. Fetch live weather telemetry
      let weatherData: any = null;
      try {
        weatherData = await fetchValidatedWeather(locationObj);
      } catch (e) {
        // non-blocking fallback
      }

      // 2. Fetch live natural disaster news
      let newsItems: any[] = [];
      try {
        const newsResp = await fetchDisasterNews({ timeframe: 'today', location: locationObj });
        newsItems = newsResp.articles || [];
      } catch (e) {
        // non-blocking
      }

      // 3. Build comprehensive structured context
      const chatbotContext = buildChatbotContext({
        location: locationObj,
        telemetry,
        riskScore,
        riskDelta,
        riskLevel,
        scenario,
        weatherData,
        newsItems,
        corridorSafety,
        activeAdvisory,
      });

      // 4. Send to secure backend API
      const result = await sendChatMessageApi(
        messageText.trim(),
        chatbotContext,
        chatMessages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        }))
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: result.reply || 'Analysis completed with nominal telemetry readings.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: result.source || 'LANDSAFE_ASSISTANT_ENGINE',
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `**Geotechnical Advisory for ${userProfile.location?.area || userProfile.location?.district || 'your sector'}:** Live sensor readings report a calculated instability probability of **${riskScore}%** with **${telemetry.precipitation.value} mm** precipitation and **${telemetry.soilMoisture.value}%** soil saturation. Slopes remain under continuous telemetry monitoring.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'LANDSAFE_OFFLINE_GEO_CACHE',
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        isOnboardingComplete,
        isAnalyzingLocation,
        analyzingLocationName,
        isDetectingGps,
        gpsStatusText,
        gpsError,
        detectAndApplyGpsLocation,
        dismissGpsError,
        updateUserProfile,
        setUserLocation,
        changeUserLocation,
        completeOnboarding,
        activeRoute,
        setActiveRoute,
        scenario,
        setScenario,
        telemetry,
        riskScore,
        riskDelta,
        riskLevel,
        corridorSafety,
        activeAdvisory,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isAppointmentModalOpen,
        setIsAppointmentModalOpen,
        openAppointmentModal,
        appointmentServiceType,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isAiAgentOpen,
        setIsAiAgentOpen,
        chatMessages,
        sendAiMessage,
        clearChatMessages,
        isAiTyping,
        resetOnboarding,
        loginUser,
        logoutUser,
        savedLocations: userProfile.savedLocations || [DEFAULT_USER_LOCATION],
        toggleSaveLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

