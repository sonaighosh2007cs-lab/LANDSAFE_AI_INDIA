import React from 'react';
import {
  LayoutDashboard,
  Route,
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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppRoute } from '../../types';

interface SidebarProps {
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileNavOpen, setIsMobileNavOpen }) => {
  const { activeRoute, setActiveRoute, userProfile } = useApp();

  const navItems: {
    id: AppRoute;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: { text: string; color: string };
  }[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'distance', label: 'Distance & Safe Corridor', icon: Route },
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
    if (!name) return 'SO';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
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
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">
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
                className={`interactive-nav-item w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-white/5 text-orange-500 font-semibold border border-white/10 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${item.badge.color}`}
                    >
                      {item.badge.text}
                    </span>
                  )}
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(234,88,12,0.8)]" />}
                </div>
              </button>
            );
          })}

          {/* System Status Widget */}
          <div className="pt-3 px-1">
            <div className="rounded-xl bg-gradient-to-br from-orange-600/20 to-transparent p-3.5 border border-orange-600/20">
              <p className="text-[10px] uppercase tracking-widest text-orange-400 font-semibold mb-1">
                System Status
              </p>
              <p className="text-xs text-white">Real-time Analysis: Online</p>
              <div className="mt-2 h-1 w-full bg-white/10 overflow-hidden rounded-full">
                <div className="h-full w-4/5 bg-orange-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* User Mini Profile Box at bottom of Sidebar */}
        <div className="p-3 border-t border-white/10 bg-[#0a0a0b]">
          <div
            onClick={() => setActiveRoute('my-area')}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#121214] border border-white/5 hover:border-white/15 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                {getInitials(userProfile.name)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[130px]">
                  {userProfile.name || 'Sonai ghosh'}
                </p>
                <p className="text-[10px] text-orange-400 flex items-center gap-1 font-mono mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  <span>{userProfile.location.area || 'Khawzawl'}</span>
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </div>
      </aside>
    </>
  );
};
