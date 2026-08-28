import React from 'react';
import {
  X,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Share2,
  Radio,
  FileText,
  Compass,
} from 'lucide-react';
import { VerifiedDisasterNewsItem } from '../../types';

interface DisasterNewsModalProps {
  article: VerifiedDisasterNewsItem | null;
  onClose: () => void;
}

export const DisasterNewsModal: React.FC<DisasterNewsModalProps> = ({
  article,
  onClose,
}) => {
  if (!article) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: article.sourceUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.title}\n\n${article.summary}\n\nRead original: ${article.sourceUrl}`);
    }
  };

  const handleOpenSource = () => {
    window.open(article.sourceUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0b1522] border border-[#1b385a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#142942] flex items-center justify-between bg-[#07111e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00d492]/10 border border-[#00d492]/30 flex items-center justify-center text-[#00d492]">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Verified Incident Report
              </span>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{article.disasterType} Report</span>
                {article.statusBadge && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    {article.statusBadge}
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share report"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0c1e33] transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0c1e33] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-200 text-sm">
          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-[#081525] border border-[#162d47] px-3 py-1 rounded-lg text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00d492]" />
              <span className="font-semibold text-white">{article.location.label}</span>
            </span>

            <span className="bg-[#081525] border border-[#162d47] px-3 py-1 rounded-lg text-slate-300 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.formattedDate}</span>
            </span>

            <span className="bg-[#081525] border border-[#162d47] px-3 py-1 rounded-lg text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Source: <strong className="text-white">{article.source}</strong></span>
            </span>

            <span
              className={`px-3 py-1 rounded-lg border font-mono text-xs font-bold uppercase ${
                article.severity === 'CRITICAL'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                  : article.severity === 'HIGH'
                  ? 'bg-orange-950/80 text-orange-300 border-orange-800'
                  : article.severity === 'MODERATE'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              }`}
            >
              {article.severity} Severity
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
            {article.title}
          </h2>

          {/* Official Advisory Banner if present */}
          {article.isOfficialWarning && (
            <div className="bg-cyan-950/40 border border-cyan-800/80 rounded-xl p-3.5 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-cyan-200">
                <p className="font-bold text-white mb-0.5">
                  Official Warning / Bulletin: {article.officialAuthority || 'Disaster Management Authority'}
                </p>
                <p className="text-cyan-300/90">
                  This advisory is transmitted directly through verified meteorological and geotechnical reporting channels.
                </p>
              </div>
            </div>
          )}

          {/* Summary Box */}
          <div className="bg-[#071322] border border-[#142840] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-[#00d492]" />
              <span>Incident Overview</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-sm">
              {article.summary}
            </p>
          </div>

          {/* LandSafe AI Context Note */}
          <div className="bg-[#091829] border border-[#16314f] rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#00d492]">
              <Compass className="w-3.5 h-3.5" />
              <span>LandSafe AI Geotechnical Context</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Real-time radar precipitation, geotechnical borehole displacement, and highway transit data for {article.location.label} are continuously synchronized with SDRF/NDRF emergency desks.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#142942] bg-[#07111e] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span>Publisher: </span>
            <strong className="text-slate-200">{article.source}</strong>
            <span className="text-slate-500 ml-1.5">• Verified Canonical Source</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#0f2137] hover:bg-[#163150] transition-colors cursor-pointer"
            >
              Close
            </button>

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#009e60] hover:bg-[#00b870] transition-all shadow-lg cursor-pointer whitespace-nowrap"
            >
              <span>Read Full Article on {article.source.split(' ')[0]}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
