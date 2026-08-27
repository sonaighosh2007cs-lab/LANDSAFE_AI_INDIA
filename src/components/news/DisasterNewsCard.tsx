import React from 'react';
import {
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  CloudRain,
  Mountain,
  Wind,
  Activity,
  Waves,
  Sun,
  Zap,
  Radio,
  Share2,
  ShieldAlert,
} from 'lucide-react';
import { VerifiedDisasterNewsItem, DisasterCategory, DisasterSeverity } from '../../types';

interface DisasterNewsCardProps {
  article: VerifiedDisasterNewsItem;
  onOpenDetails: (article: VerifiedDisasterNewsItem) => void;
}

// Icon mapper for disaster types
const getDisasterIcon = (type: DisasterCategory) => {
  switch (type) {
    case 'Landslide':
    case 'Land Subsidence':
      return Mountain;
    case 'Flood':
      return Waves;
    case 'Heavy Rain':
    case 'Cloudburst':
      return CloudRain;
    case 'Cyclone':
    case 'Storm':
      return Wind;
    case 'Earthquake':
      return Activity;
    case 'Tsunami':
      return Waves;
    case 'Wildfire':
      return Flame;
    case 'Heatwave':
      return Sun;
    case 'Lightning':
      return Zap;
    default:
      return AlertTriangle;
  }
};

// Theme styling for disaster types
const getDisasterStyle = (type: DisasterCategory) => {
  switch (type) {
    case 'Landslide':
    case 'Land Subsidence':
      return {
        badge: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
        iconColor: 'text-amber-400',
        glow: 'hover:border-amber-500/40',
      };
    case 'Flood':
    case 'Tsunami':
      return {
        badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
        iconColor: 'text-cyan-400',
        glow: 'hover:border-cyan-500/40',
      };
    case 'Heavy Rain':
    case 'Cloudburst':
      return {
        badge: 'bg-blue-950/80 text-blue-300 border-blue-800/80',
        iconColor: 'text-blue-400',
        glow: 'hover:border-blue-500/40',
      };
    case 'Cyclone':
    case 'Storm':
      return {
        badge: 'bg-teal-950/80 text-teal-300 border-teal-800/80',
        iconColor: 'text-teal-400',
        glow: 'hover:border-teal-500/40',
      };
    case 'Earthquake':
      return {
        badge: 'bg-purple-950/80 text-purple-300 border-purple-800/80',
        iconColor: 'text-purple-400',
        glow: 'hover:border-purple-500/40',
      };
    case 'Wildfire':
    case 'Heatwave':
      return {
        badge: 'bg-orange-950/80 text-orange-300 border-orange-800/80',
        iconColor: 'text-orange-400',
        glow: 'hover:border-orange-500/40',
      };
    case 'Lightning':
      return {
        badge: 'bg-yellow-950/80 text-yellow-300 border-yellow-800/80',
        iconColor: 'text-yellow-400',
        glow: 'hover:border-yellow-500/40',
      };
    default:
      return {
        badge: 'bg-slate-900 text-slate-300 border-slate-700',
        iconColor: 'text-slate-400',
        glow: 'hover:border-slate-500/40',
      };
  }
};

const getSeverityBadge = (severity: DisasterSeverity) => {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-rose-950/90 text-rose-300 border-rose-800';
    case 'HIGH':
      return 'bg-orange-950/90 text-orange-300 border-orange-800';
    case 'MODERATE':
      return 'bg-amber-950/90 text-amber-300 border-amber-800';
    case 'LOW':
      return 'bg-emerald-950/90 text-emerald-300 border-emerald-800';
  }
};

export const DisasterNewsCard: React.FC<DisasterNewsCardProps> = ({
  article,
  onOpenDetails,
}) => {
  const IconComponent = getDisasterIcon(article.disasterType);
  const style = getDisasterStyle(article.disasterType);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: article.sourceUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.title}\n${article.sourceUrl}`);
    }
  };

  const handleReadFull = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(article.sourceUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={() => onOpenDetails(article)}
      className={`bg-[#091626] border border-[#162c46] rounded-2xl p-5 shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${style.glow}`}
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Disaster Type Badge */}
            <span
              className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 ${style.badge}`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${style.iconColor}`} />
              {article.disasterType}
            </span>

            {/* Live / Breaking Badge */}
            {article.statusBadge && (
              <span
                className={`text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                  article.statusBadge === 'LIVE'
                    ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                    : article.statusBadge === 'BREAKING'
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                }`}
              >
                {article.statusBadge === 'LIVE' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                )}
                {article.statusBadge}
              </span>
            )}

            {/* Official Authority Badge */}
            {article.isOfficialWarning && (
              <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-cyan-400" />
                Official Alert
              </span>
            )}
          </div>

          {/* Severity & Timestamp */}
          <div className="flex items-center gap-2">
            <span
              title="LandSafe AI Hazard Severity Assessment"
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getSeverityBadge(
                article.severity
              )}`}
            >
              {article.severity}
            </span>

            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{article.formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug group-hover:text-[#00d492] transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* 2-4 Line Summary */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
          {article.summary}
        </p>
      </div>

      {/* Footer Info & Read Action */}
      <div className="pt-3 border-t border-[#14263c] flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Source & Location */}
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <div className="flex items-center gap-1.5 bg-[#06101d] px-2.5 py-1 rounded-lg border border-[#142942]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-medium text-slate-200 truncate max-w-[140px] sm:max-w-[180px]">
              {article.source}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-[150px] sm:max-w-[200px]">
            <MapPin className="w-3 h-3 text-[#00d492] shrink-0" />
            <span className="truncate">{article.location.label}</span>
          </div>
        </div>

        {/* Read Article Button & Share */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            title="Share article details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#122842] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReadFull}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0f2845] hover:bg-[#009e60] border border-[#1d426a] hover:border-[#00d492] px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span>Read Full Article</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
