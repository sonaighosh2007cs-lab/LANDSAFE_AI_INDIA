import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  Search,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  Users,
  Database,
  Download,
  Filter,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Radio,
  Copy,
  Check,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { SupabaseLoginActivity, isSupabaseConfigured } from '../../lib/supabase';
import {
  fetchLoginActivity,
  subscribeToLoginActivity,
  LoginActivityStats,
} from '../../services/loginActivityService';

interface AdminLoginActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginActivityModal: React.FC<AdminLoginActivityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activities, setActivities] = useState<SupabaseLoginActivity[]>([]);
  const [stats, setStats] = useState<LoginActivityStats>({
    totalCount: 0,
    emailLogins: 0,
    phoneLogins: 0,
    uniqueUsers: 0,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState<'supabase' | 'cache'>('cache');

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Real-time flash notification banner
  const [recentLiveActivity, setRecentLiveActivity] = useState<SupabaseLoginActivity | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchLoginActivity({
        searchQuery,
        loginMethod: selectedMethod,
        page: currentPage,
        limit: pageSize,
      });

      setActivities(res.records);
      setTotalRecords(res.totalCount);
      setStats(res.stats);
      setDataSource(res.source);
    } catch (e) {
      console.error('Error fetching login activity:', e);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedMethod, currentPage]);

  // Initial load on open and when filters change
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  // Realtime Supabase Subscription
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeToLoginActivity((newRecord) => {
      setActivities((prev) => {
        // Prepend only if unique
        if (prev.some((a) => a.id === newRecord.id)) return prev;
        return [newRecord, ...prev];
      });
      setTotalRecords((prev) => prev + 1);
      setRecentLiveActivity(newRecord);

      // Auto dismiss live banner after 6s
      setTimeout(() => {
        setRecentLiveActivity((cur) => (cur?.id === newRecord.id ? null : cur));
      }, 6000);
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return isoString;
    }
  };

  const getRelativeTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 45) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch (e) {
      return '';
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportLogsAsJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activities, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `landsafe_login_activity_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Export error:', e);
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method?.toUpperCase()) {
      case 'PHONE_AUTH':
      case 'MOBILE_CREDENTIALS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Phone className="w-3 h-3" /> Phone Auth
          </span>
        );
      case 'EMAIL_AUTH':
      case 'EMAIL_PASSWORD':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Mail className="w-3 h-3" /> Email Auth
          </span>
        );
      case 'NEW_REGISTRATION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-3 h-3" /> Registration
          </span>
        );
      case 'SESSION_RESTORE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <KeyRound className="w-3 h-3" /> Session
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-500/10 text-slate-300 border border-slate-500/20">
            <ShieldCheck className="w-3 h-3" /> {method || 'Auth'}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-[#0e1726] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#0a0f1d] border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  Admin Login Activity & Security Audit
                </h3>
                <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isSupabaseConfigured ? 'Supabase Realtime Active' : 'Offline Cache'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Secure audit trail of operator logins, authentication methods & monitoring sectors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportLogsAsJson}
              title="Export activity logs as JSON"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Flash Banner if a new login occurs in realtime */}
        {recentLiveActivity && (
          <div className="px-5 py-2.5 bg-emerald-950/70 border-b border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-emerald-300">Live Login Event Detected:</span>
              <span>
                <strong>{recentLiveActivity.user_name}</strong> just logged in from{' '}
                <strong>{recentLiveActivity.selected_area || 'Sector'}</strong> ({recentLiveActivity.login_method})
              </span>
            </div>
            <button
              onClick={() => setRecentLiveActivity(null)}
              className="text-emerald-400 hover:text-emerald-200 text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Metrics Row */}
        <div className="p-4 sm:p-5 bg-[#0b1120] border-b border-[#1e293b] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#121c2e] border border-[#1e293b] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-mono uppercase text-slate-400">Total Logins</p>
              <p className="text-lg font-bold text-white font-mono leading-none mt-0.5">{stats.totalCount}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#121c2e] border border-[#1e293b] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-mono uppercase text-slate-400">Phone Logins</p>
              <p className="text-lg font-bold text-emerald-400 font-mono leading-none mt-0.5">{stats.phoneLogins}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#121c2e] border border-[#1e293b] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-mono uppercase text-slate-400">Email Logins</p>
              <p className="text-lg font-bold text-cyan-400 font-mono leading-none mt-0.5">{stats.emailLogins}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#121c2e] border border-[#1e293b] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-mono uppercase text-slate-400">Unique Users</p>
              <p className="text-lg font-bold text-purple-400 font-mono leading-none mt-0.5">{stats.uniqueUsers}</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-[#0a0f1d] border-b border-[#1e293b] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by operator name, user ID, email, phone, sector or state..."
              className="w-full pl-9 pr-4 py-2 bg-[#121c2e] border border-[#1e293b] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#121c2e] border border-[#1e293b] rounded-xl px-2.5 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedMethod}
                onChange={(e) => {
                  setSelectedMethod(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#0e1726] text-white">All Methods</option>
                <option value="PHONE_AUTH" className="bg-[#0e1726] text-white">Phone Auth</option>
                <option value="EMAIL_AUTH" className="bg-[#0e1726] text-white">Email Auth</option>
                <option value="NEW_REGISTRATION" className="bg-[#0e1726] text-white">Registrations</option>
                <option value="SESSION_RESTORE" className="bg-[#0e1726] text-white">Session Restore</option>
              </select>
            </div>

            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 bg-[#121c2e] hover:bg-[#1a273f] border border-[#1e293b] rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh activity logs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Activity Table Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {isLoading && activities.length === 0 ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-white">Loading live login audit logs from Supabase...</p>
              <p className="text-xs text-slate-400 mt-1">Checking activity stream and PostgreSQL database</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-[#0b1120] border border-[#1e293b]">
              <ShieldCheck className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">No Login Activities Found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {searchQuery || selectedMethod !== 'ALL'
                  ? 'No audit records match your current search or filter query. Try clearing the filter.'
                  : 'New login activities will automatically appear here via Supabase Realtime when operators authenticate.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {activities.map((act) => {
                const userInitials = act.user_name
                  ? act.user_name
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'OP';

                return (
                  <div
                    key={act.id || `${act.login_at}_${act.user_name}`}
                    className="p-3.5 sm:p-4 rounded-xl bg-[#121c2e]/90 hover:bg-[#16233b] border border-[#1e293b] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* User Identity Column */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white text-xs font-bold font-mono shadow-sm shrink-0">
                        {userInitials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white truncate">{act.user_name}</p>
                          {getMethodBadge(act.login_method)}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 flex-wrap">
                          {act.email && (
                            <span className="flex items-center gap-1 text-slate-300">
                              <Mail className="w-3 h-3 text-cyan-400" />
                              {act.email}
                            </span>
                          )}
                          {act.phone && (
                            <span className="flex items-center gap-1 text-slate-300">
                              <Phone className="w-3 h-3 text-emerald-400" />
                              {act.phone}
                            </span>
                          )}
                          {act.user_id && (
                            <span
                              onClick={() => copyToClipboard(act.user_id!, act.id || '')}
                              title="Click to copy User ID"
                              className="font-mono text-[10.5px] text-slate-400 hover:text-orange-400 flex items-center gap-1 cursor-pointer bg-black/30 px-1.5 py-0.5 rounded"
                            >
                              <span>UID: {act.user_id.slice(0, 8)}...</span>
                              {copiedId === act.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Location & Timestamp Column */}
                    <div className="flex items-center sm:items-end justify-between sm:justify-center flex-row sm:flex-col gap-1 text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-orange-400">
                        <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>
                          {act.selected_area || 'National Overview'}, {act.district || act.state || 'India'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          SUCCESS
                        </span>
                        <span>•</span>
                        <span title={act.login_at}>{formatDateTime(act.login_at)}</span>
                        <span className="text-slate-500">({getRelativeTime(act.login_at)})</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer & Pagination */}
        <div className="px-5 py-3.5 bg-[#0a0f1d] border-t border-[#1e293b] flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>
              Showing {activities.length} of {totalRecords} logged activities
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-[11px] text-slate-400">
              Source: {dataSource === 'supabase' ? 'PostgreSQL (Live)' : 'Local Storage Cache'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || isLoading}
              className="p-1.5 rounded-lg bg-[#121c2e] hover:bg-[#1a273f] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-[#1e293b] cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || isLoading}
              className="p-1.5 rounded-lg bg-[#121c2e] hover:bg-[#1a273f] text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-[#1e293b] cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
