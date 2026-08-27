import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  ChevronDown,
  Bell,
  Menu,
  X,
  Sliders,
  Check,
  AlertTriangle,
  Loader2,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationScenario } from '../../types';
import { LandSafeLogo } from '../common/LandSafeLogo';

interface HeaderProps {
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isMobileNavOpen, setIsMobileNavOpen }) => {
  const {
    userProfile,
    scenario,
    setScenario,
    setIsLocationModalOpen,
    setIsNotificationDrawerOpen,
    logoutUser,
    setActiveRoute,
    isDetectingGps,
    gpsStatusText,
    gpsError,
    detectAndApplyGpsLocation,
    dismissGpsError,
  } = useApp();

  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const scenarioDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        scenarioDropdownRef.current &&
        !scenarioDropdownRef.current.contains(event.target as Node)
      ) {
        setIsScenarioDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMyLocationClick = async () => {
    await detectAndApplyGpsLocation();
  };

  const getInitials = (name: string) => {
    if (!name || !name.trim()) return 'OP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2 && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const scenarios: { id: SimulationScenario; label: string; tag: string; color: string }[] = [
    { id: 'MONSOON_SURGE', label: 'Monsoon Surge (Peak)', tag: 'Active Risk', color: 'text-orange-400' },
    { id: 'CYCLONIC_DEPRESSION', label: 'Cyclonic Depression', tag: 'Critical Alert', color: 'text-red-400' },
    { id: 'DRY_SPELL', label: 'Dry Baseline / Post-Monsoon', tag: 'Nominal', color: 'text-emerald-400' },
    { id: 'SEISMIC_TREMOR', label: 'Seismic Micro-Tremor', tag: 'High Creep', color: 'text-amber-400' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#0e0e10]/95 backdrop-blur-md">
      {/* GPS Error Notification Toast */}
      {gpsError && (
        <div className="w-full bg-rose-950/90 border-b border-rose-600/30 px-4 py-2 flex items-center justify-between text-xs text-rose-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{gpsError}</span>
          </div>
          <button
            onClick={dismissGpsError}
            className="p-1 text-rose-300 hover:text-white rounded hover:bg-rose-900/50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="h-14 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            id="header-brand-logo"
            onClick={() => setActiveRoute('dashboard')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
          >
            <LandSafeLogo size="sm" className="group-hover:scale-105 transition-transform duration-200" />
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white font-display">
                  LandSafe <span className="text-emerald-400">AI</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block font-mono tracking-wide">
                Disaster & Landslide Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Middle & Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* My Location GPS Action Button */}
          <button
            id="header-my-location-btn"
            onClick={handleMyLocationClick}
            disabled={isDetectingGps}
            title="Use current device GPS location"
            className="interactive-btn flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-orange-950/40 border border-orange-500/40 hover:border-orange-400 hover:bg-orange-900/40 text-[13px] font-semibold text-orange-300 transition-all cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDetectingGps ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-orange-400 animate-spin" />
                <span className="hidden sm:inline font-mono text-xs">{gpsStatusText || 'Detecting...'}</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="hidden sm:inline">My Location</span>
              </>
            )}
          </button>

          {/* Active Location Switcher Pill */}
          <button
            id="header-location-pill"
            onClick={() => setIsLocationModalOpen(true)}
            className="interactive-btn flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121214] border border-white/10 hover:border-orange-500/50 text-[13px] text-white transition-all cursor-pointer shadow-sm group"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="font-medium max-w-[110px] sm:max-w-[170px] truncate">
              {userProfile.location.area} • {userProfile.location.state}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </button>

          {/* Live Simulation Scenario Selector Dropdown */}
          <div className="relative" ref={scenarioDropdownRef}>
            <button
              onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
              className="interactive-btn hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#121214] border border-white/10 hover:border-white/20 text-[13px] font-mono text-orange-400 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-gray-400 text-xs">Telemetry:</span>
              <span className="font-semibold text-white">{scenario.replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isScenarioDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#121214] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 border-b border-white/5 mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold">
                    Select Disaster Simulation Feed
                  </span>
                </div>
                {scenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setScenario(sc.id);
                      setIsScenarioDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] flex items-center justify-between transition-colors cursor-pointer ${
                      scenario === sc.id
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-white">{sc.label}</p>
                      <p className={`text-[11px] ${sc.color}`}>{sc.tag}</p>
                    </div>
                    {scenario === sc.id && <Check className="w-4 h-4 text-orange-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell with Red Badge */}
          <button
            id="header-notification-bell"
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="interactive-btn relative p-2 rounded-xl bg-[#121214] border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold border border-[#0e0e10]">
              02
            </span>
          </button>

          {/* User Profile Avatar / Logout Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              id="header-profile-btn"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="interactive-btn flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-[#121214] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              aria-label="User menu"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white text-xs font-bold font-mono shadow-sm">
                {getInitials(userProfile.name)}
              </div>
              <span className="text-[13px] font-medium text-gray-200 hidden sm:inline max-w-[100px] truncate">
                {userProfile.name || 'User'}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:inline" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#121214] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-[13.5px] font-semibold text-white truncate">{userProfile.name}</p>
                  <p className="text-xs text-gray-400 truncate">{userProfile.email || userProfile.mobile || 'Registered User'}</p>
                  <p className="text-[11px] text-orange-400 font-mono mt-1">
                    Sector: {userProfile.location.area}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setActiveRoute('my-area');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>My Area Analytics</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setIsLocationModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Switch Monitoring Sector</span>
                </button>

                <div className="my-1 border-t border-white/5" />

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    logoutUser();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out & Reset Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
