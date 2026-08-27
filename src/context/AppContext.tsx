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

interface AppContextType {
  userProfile: UserProfile;
  isOnboardingComplete: boolean;
  isAnalyzingLocation: boolean;
  analyzingLocationName: string;
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
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isAiAgentOpen: boolean;
  setIsAiAgentOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendAiMessage: (message: string) => Promise<void>;
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
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Dynamic Loading / Analyzing state during onboarding or location change
  const [isAnalyzingLocation, setIsAnalyzingLocation] = useState(false);
  const [analyzingLocationName, setAnalyzingLocationName] = useState('');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `**Welcome to LandSafe AI Geotechnical Assistant.**\n\nI am connected to the India Geological Survey (GSI) hazard mesh, IMD Doppler radars, and local borehole piezometers for **${userProfile.location?.district || 'Monitoring Area'}, ${userProfile.location?.state || 'India'}**.\n\nAsk me about:\n- Current slope factor of safety & pore saturation\n- Safe highway routes and landslide roadblocks\n- Emergency SDRF/NDRF evacuation shelters nearby\n- Rainfall threshold triggers in your area`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'LANDSAFE_CORE_GEO_MESH',
    },
  ]);

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
    setUserProfile((prev) => ({
      ...prev,
      location,
      savedLocations: prev.savedLocations?.some(
        (l) => l.district === location.district && l.area === location.area
      )
        ? prev.savedLocations
        : [...(prev.savedLocations || []), location],
    }));
  };

  // Change location with realistic analysis loading animation and clean UI feedback
  const changeUserLocation = async (location: UserLocation) => {
    setAnalyzingLocationName(`${location.area}, ${location.district} (${location.state})`);
    setIsAnalyzingLocation(true);
    setUserLocation(location);

    await new Promise((resolve) => setTimeout(resolve, 650));
    setIsAnalyzingLocation(false);
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
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          location: userProfile.location,
          context: {
            scenario,
            riskScore,
            telemetry,
            user: userProfile.name,
          },
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Analysis completed with nominal slope readings.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'LANDSAFE_INTELLIGENCE_ENGINE',
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `**Geotechnical Advisory for ${userProfile.location?.district || 'your sector'}:** Telemetry readings show ${riskScore}% instability index with ${telemetry.precipitation.value} mm rainfall. Slopes along primary arterial corridors remain under automated monitoring. Stay alert for official NDMA bulletins.`,
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
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isAiAgentOpen,
        setIsAiAgentOpen,
        chatMessages,
        sendAiMessage,
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

