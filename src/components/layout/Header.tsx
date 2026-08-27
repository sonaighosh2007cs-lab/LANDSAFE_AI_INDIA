import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  MapPin,
  ChevronDown,
  Bell,
  Sparkles,
  Menu,
  X,
  User,
  Shield,
  LogOut,
  Sliders,
  Check,
  AlertTriangle,
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
    <header className="sticky top-0 z-30 w-full h-14 border-b border-white/10 bg-[#0e0e10]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
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
          className="flex items-center gap-3 cursor-pointer group"
        >
          <LandSafeLogo size="sm" className="w-8 h-8 group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-lg font-bold tracking-tight text-white">
                LandSafe <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">
              Disaster & Landslide Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Middle & Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Location Switcher Pill */}
        <button
          id="header-location-pill"
          onClick={() => setIsLocationModalOpen(true)}
          className="interactive-btn flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121214] border border-white/10 hover:border-orange-500/50 text-xs text-white transition-all cursor-pointer shadow-sm group"
        >
          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span className="font-medium max-w-[120px] sm:max-w-[180px] truncate">
            {userProfile.location.area} • {userProfile.location.district}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-500 transition-colors" />
        </button>

        {/* Live Simulation Scenario Selector Dropdown */}
        <div className="relative" ref={scenarioDropdownRef}>
          <button
            onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
            className="interactive-btn hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#121214] border border-white/10 hover:border-white/20 text-xs font-mono text-orange-400 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-gray-400 text-[11px]">Telemetry:</span>
            <span className="font-semibold text-white">{scenario.replace('_', ' ')}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {isScenarioDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#121214] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 border-b border-white/5 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
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
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    scenario === sc.id
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <p className="font-medium text-white">{sc.label}</p>
                    <p className={`text-[10px] ${sc.color}`}>{sc.tag}</p>
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
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold border border-[#0e0e10]">
            02
          </span>
        </button>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            id="user-profile-menu-btn"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="interactive-btn flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-[#121214] border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer"
            aria-label="User profile menu"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              {getInitials(userProfile.name)}
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#121214] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="font-bold text-white text-xs truncate">
                  {userProfile.name || 'LandSafe User'}
                </p>
                <p className="text-[11px] text-gray-400 font-mono truncate">
                  {userProfile.mobile || userProfile.email || 'Authenticated Profile'}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {userProfile.age ? `Age ${userProfile.age}` : userProfile.ageGroup}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                    {userProfile.location?.district || 'India'}
                  </span>
                </div>
              </div>

              <button
                id="header-change-location-btn"
                onClick={() => {
                  setIsLocationModalOpen(true);
                  setIsProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>Change Monitoring Area</span>
              </button>

              <button
                id="header-my-area-btn"
                onClick={() => {
                  setActiveRoute('my-area');
                  setIsProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-orange-400" />
                <span>My Area Telemetry</span>
              </button>

              <div className="my-1 border-t border-white/5" />

              <button
                id="header-logout-btn"
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  logoutUser();
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Log Out / Exit Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
