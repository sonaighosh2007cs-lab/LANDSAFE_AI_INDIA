import React from 'react';
import {
  LayoutDashboard,
  Radio,
  CloudRain,
  Bot,
  MapPin,
  Map,
  Cpu,
  Flame,
  TrendingUp,
  History,
  Server,
  ChevronRight,
  Shield,
  Activity,
  LogOut,
  Calendar,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppRoute } from '../../types';

interface SidebarProps {
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileNavOpen, setIsMobileNavOpen }) => {
  const {
    activeRoute,
    setActiveRoute,
    userProfile,
    logoutUser,
    openAppointmentModal,
    openLoginActivityModal,
  } = useApp();

  const navItems: {
    id: AppRoute;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: { text: string; color: string };
  }[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    {
      id: 'disaster-news',
      label: 'Disaster News',
      icon: Radio,
      badge: { text: 'LIVE', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    },
    { id: 'live-weather', label: 'Live Weather', icon: CloudRain },
    {
      id: 'ai-agent',
      label: 'Own AI Bot (Agent)',
      icon: Bot,
      badge: { text: 'AI', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    },
    {
      id: 'my-area',
      label: 'My Area (Local Alert)',
      icon: MapPin,
      badge: { text: '02', color: 'bg-red-500/15 text-red-300 border-red-500/30' },
    },
    { id: 'india-map', label: 'LandSafe India Map', icon: Map },
    { id: 'ai-risk-engineering', label: 'AI Risk Engineering', icon: Cpu },
    {
      id: 'active-warning-hotspot',
      label: 'Active Warning Hotspots',
      icon: Flame,
      badge: { text: '17', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    },
    { id: 'indian-risk-ranking', label: 'Indian Risk Ranking', icon: TrendingUp },
    { id: 'gsi-historical-analysis', label: 'Risk History & Analytics', icon: History, badge: { text: 'REAL-TIME', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' } },
    { id: 'data-pipelines', label: 'Data Pipelines & GIS', icon: Server },
  ];

  const handleNavClick = (route: AppRoute) => {
    setActiveRoute(route);
    setIsMobileNavOpen(false);
  };

  const getInitials = (name: string) => {
    if (!name || !name.trim()) return 'OP';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[parts.length - 1]) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-72 bg-[#0e0e10] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Link List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-mono uppercase tracking-widest text-gray-400 font-semibold">
            Intelligence Modules
          </div>

          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`interactive-nav-item w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-white/5 text-orange-500 font-semibold border border-white/10 shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-orange-500/10 text-orange-500'
                        : 'text-gray-400 group-hover:text-white group-hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${item.badge.color}`}
                    >
                      {item.badge.text}
                    </span>
                  )}
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(234,88,12,0.8)]" />}
                </div>
              </button>
            );
          })}

          {/* Geotechnical Survey Booking Widget */}
          <div className="pt-2 px-1">
            <div className="rounded-xl bg-[#142033] p-3 border border-[#1e385a] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono uppercase text-orange-400 font-bold flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-orange-400" />
                  Site Consultation
                </span>
                <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Supabase
                </span>
              </div>
              <p className="text-[12px] text-slate-300 leading-snug">
                Need an on-site geotechnical slope stability audit or sensor deployment?
              </p>
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  openAppointmentModal();
                }}
                className="w-full py-1.5 px-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11.5px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Book Site Survey</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Admin Login Activity Audit Widget */}
          <div className="pt-1 px-1">
            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                openLoginActivityModal();
              }}
              className="w-full text-left rounded-xl bg-[#0e1726] hover:bg-[#121d30] p-2.5 border border-[#1e293b] hover:border-emerald-500/30 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    Login Activity Audit
                  </p>
                  <p className="text-[10.5px] text-slate-400 font-mono flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    Supabase Stream
                  </p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
            </button>
          </div>

          {/* System Status Widget */}
          <div className="pt-3 px-1">
            <div className="rounded-xl bg-gradient-to-br from-orange-600/20 to-transparent p-3.5 border border-orange-600/20">
              <p className="text-[11px] uppercase tracking-widest text-orange-400 font-semibold mb-1">
                System Status
              </p>
              <p className="text-[13px] text-white">Real-time Analysis: Online</p>
              <div className="mt-2 h-1.5 w-full bg-white/10 overflow-hidden rounded-full">
                <div className="h-full w-4/5 bg-orange-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* User Mini Profile Box at bottom of Sidebar with Logout Action */}
        <div className="p-3 border-t border-white/10 bg-[#0a0a0b] flex items-center gap-2">
          <div
            id="sidebar-user-profile-btn"
            onClick={() => {
              setActiveRoute('my-area');
              setIsMobileNavOpen(false);
            }}
            className="flex-1 flex items-center justify-between p-2 rounded-xl bg-[#121214] border border-white/5 hover:border-white/15 transition-all cursor-pointer group min-w-0"
            title="View Monitoring Sector Telemetry"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center font-bold text-xs text-orange-400 font-mono shadow-sm shrink-0">
                {getInitials(userProfile.name)}
              </div>
              <div className="text-left min-w-0">
                <p className="text-[13px] font-bold text-white uppercase tracking-tight leading-tight truncate">
                  {userProfile.name || 'Operator'}
                </p>
                <p className="text-[11px] text-orange-400 flex items-center gap-1.5 font-mono mt-0.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate">
                    {userProfile.location.area || 'Active'}
                    {userProfile.location.district && userProfile.location.district !== userProfile.location.area ? `, ${userProfile.location.district}` : ''}
                  </span>
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0 ml-1" />
          </div>

          {/* Quick Logout Button */}
          <button
            id="sidebar-logout-btn"
            onClick={() => {
              setIsMobileNavOpen(false);
              logoutUser();
            }}
            className="p-2.5 rounded-xl bg-[#121214] border border-white/5 hover:border-red-500/40 hover:bg-red-950/30 text-gray-400 hover:text-red-400 transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Reset Session"
            aria-label="Reset Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
