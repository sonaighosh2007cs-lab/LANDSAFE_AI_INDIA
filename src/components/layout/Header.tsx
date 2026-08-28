import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Menu,
  X,
  Check,
  AlertTriangle,
  LogOut,
  Shield,
  Sliders,
  MapPin,
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
    setIsLocationModalOpen,
    scenario,
    setScenario,
    setIsNotificationDrawerOpen,
    openLoginActivityModal,
    logoutUser,
    setActiveRoute,
    gpsError,
    dismissGpsError,
  } = useApp();

  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const scenarioDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsDropdownRef.current &&
        !settingsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSettingsDropdownOpen(false);
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

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Change Location Button (Connected to active location) */}
          <button
            id="header-change-location-btn"
            onClick={() => setIsLocationModalOpen(true)}
            className="interactive-btn flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#121214] border border-orange-500/30 hover:border-orange-500/70 hover:bg-orange-950/30 text-[13px] text-white transition-all cursor-pointer shadow-sm group"
            title="Change or Select Monitoring Location"
            aria-label="Change Location"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-white max-w-[85px] sm:max-w-[130px] md:max-w-[160px] truncate">
              {userProfile.location.area || 'Location'}
            </span>
            <span className="text-orange-400 font-mono text-[11px] sm:text-xs font-semibold pl-1.5 border-l border-white/10 flex items-center gap-1">
              <span>Change</span>
            </span>
          </button>

          {/* Live Simulation Scenario Selector Dropdown */}
          <div className="relative" ref={scenarioDropdownRef}>
            <button
              onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
              className="interactive-btn flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121214] border border-white/10 hover:border-white/20 text-[13px] font-mono text-orange-400 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-gray-400 text-xs hidden sm:inline">Telemetry:</span>
              <span className="font-semibold text-white">{scenario.replace('_', ' ')}</span>
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

          {/* Clean Settings / Session Action Dropdown */}
          <div className="relative" ref={settingsDropdownRef}>
            <button
              id="header-settings-btn"
              onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
              className="interactive-btn p-2 rounded-xl bg-[#121214] border border-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="System Settings & Audit"
              title="System Controls & Audit"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {isSettingsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#121214] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => {
                    setIsSettingsDropdownOpen(false);
                    openLoginActivityModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-gray-300 hover:text-white hover:bg-white/5 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Login Activity Audit</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    LIVE
                  </span>
                </button>

                <div className="my-1 border-t border-white/5" />

                <button
                  onClick={() => {
                    setIsSettingsDropdownOpen(false);
                    logoutUser();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Reset Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
