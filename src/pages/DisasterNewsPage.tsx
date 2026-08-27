import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Radio,
  Sparkles,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Search,
  ArrowRight,
  ShieldAlert,
  Globe,
  Calendar,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DisasterCategory, VerifiedDisasterNewsItem, DisasterNewsResponse, DisasterNewsTimeframe } from '../types';
import { fetchDisasterNews } from '../services/disasterNewsClient';
import { DisasterNewsCard } from '../components/news/DisasterNewsCard';
import { DisasterNewsModal } from '../components/news/DisasterNewsModal';
import { DisasterNewsFilters } from '../components/news/DisasterNewsFilters';

export const DisasterNewsPage: React.FC = () => {
  const { userProfile, setIsLocationModalOpen } = useApp();
  const location = userProfile.location;

  // Active view filters (default 'all' to show comprehensive all-India news)
  const [timeframe, setTimeframe] = useState<DisasterNewsTimeframe>('all');
  const [disasterType, setDisasterType] = useState<DisasterCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // News items state
  const [articles, setArticles] = useState<VerifiedDisasterNewsItem[]>([]);
  const [locationScope, setLocationScope] = useState<DisasterNewsResponse['locationScope']>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeAgoText, setTimeAgoText] = useState<string>('Just now');

  // Selected article for compact details modal
  const [selectedArticle, setSelectedArticle] = useState<VerifiedDisasterNewsItem | null>(null);

  // Pagination state (Load more)
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // AbortController ref to prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null);

  // Function to load disaster news
  const loadNews = useCallback(
    async (force = false) => {
      // Abort previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (!force) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        const response = await fetchDisasterNews({
          timeframe,
          location,
          disasterType,
          searchQuery,
          forceRefresh: force,
          signal: controller.signal,
        });

        if (response.error && (!response.articles || response.articles.length === 0)) {
          setError(response.error);
        } else {
          setArticles(response.articles || []);
          setLocationScope(response.locationScope || {});
          setError(null);
        }
        setLastUpdated(new Date());
        setIsLoading(false);
        setIsRefreshing(false);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Request was intentionally aborted for a newer query
          return;
        }
        console.error('Error loading disaster news:', err);
        setError('Live news is temporarily unavailable. Please try again shortly.');
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [timeframe, location, disasterType, searchQuery]
  );

  // Fetch news whenever timeframe, location, or filters change
  useEffect(() => {
    setVisibleCount(10);
    loadNews(false);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadNews]);

  // Periodic auto-refresh every 3 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      loadNews(true);
    }, 180000);

    return () => clearInterval(refreshInterval);
  }, [loadNews]);

  // Update "Last updated X ago" string every 15 seconds
  useEffect(() => {
    const updateRelativeTime = () => {
      const diffMs = Date.now() - lastUpdated.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 30) {
        setTimeAgoText('Just now');
      } else if (diffSec < 90) {
        setTimeAgoText('1 min ago');
      } else if (diffSec < 3600) {
        setTimeAgoText(`${Math.floor(diffSec / 60)} mins ago`);
      } else {
        setTimeAgoText(
          lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        );
      }
    };

    updateRelativeTime();
    const timer = setInterval(updateRelativeTime, 15000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  const handleManualRefresh = () => {
    loadNews(true);
  };

  // Visible sliced articles for pagination
  const visibleArticles = articles.slice(0, visibleCount);

  // Dynamic empty state message based on user requirements
  const getEmptyStateMessage = () => {
    if (timeframe === 'today') {
      return {
        title: 'No major India natural-disaster news reported today.',
        subtitle: 'The system scanned live national meteorological and disaster monitoring agencies (IMD, NDMA, State Disaster Management Authorities). No catastrophic or severe alerts were published today.',
      };
    }
    if (timeframe === '30days') {
      return {
        title: 'No disaster news reported in India over the past 30 days.',
        subtitle: 'No disaster articles matching the active category filters were recorded during the previous 30-day window.',
      };
    }
    if (timeframe === 'my-location') {
      return {
        title: `No local disaster bulletins found for ${location.area || location.district}, ${location.state}.`,
        subtitle: 'Local area stations and regional SDRF units report nominal conditions without major disruption.',
      };
    }
    return {
      title: 'No natural disaster reports found matching the selected criteria.',
      subtitle: 'Try clearing your search query or choosing a broader category to explore all available verified Indian disaster reports.',
    };
  };

  const emptyInfo = getEmptyStateMessage();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* 1. Header Banner */}
      <div className="border-b border-[#14263c] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              India Natural Disaster & Geological News
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time verified incident intelligence across Indian states from IMD, GSI, NDMA, and leading publications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 w-fit flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            Live National Feed
          </span>
        </div>
      </div>

      {/* 2. Top AI Geotechnical Synthesis Summary */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00d492]">
            <Sparkles className="w-4 h-4 text-[#00d492]" />
            <span>LandSafe AI Incident Intelligence Summary</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-[#06101c] px-2 py-0.5 rounded border border-[#152a42]">
            {timeframe === 'all'
              ? 'ALL INDIA'
              : timeframe === 'today'
              ? 'TODAY FOCUS'
              : timeframe === '30days'
              ? '30-DAY ARCHIVE'
              : 'LOCATION SYNC'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {timeframe === 'my-location' ? (
            <>
              Currently monitoring geological and hydrometeorological risk vectors for{' '}
              <strong className="text-white">
                {location.area}, {location.district} ({location.state})
              </strong>
              . Slope pore-saturation index and upstream catchment rainfall data are being correlated with state emergency SDRF units and local district disaster control rooms.
            </>
          ) : timeframe === 'today' ? (
            <>
              Displaying exclusively verified natural disaster reports published <strong className="text-white">today in India</strong>. Information is aggregated live from IMD Doppler networks, NDMA national operations, CWC river gauge feeds, and regional emergency services.
            </>
          ) : (
            <>
              Monsoon depressions and seismic telemetry continue to be mapped across the Western Himalayas (Himachal, Uttarakhand), Western Ghats (Wayanad, Idukki, Nilgiris), Brahmaputra basin (Assam), and coastal zones. National disaster response battalions (NDRF/SDRF) remain on active standby for flood and landslide-prone transportation corridors.
            </>
          )}
        </p>
      </div>

      {/* 3. Filter Controls Bar */}
      <DisasterNewsFilters
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        disasterType={disasterType}
        setDisasterType={setDisasterType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={location}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        lastUpdatedTime={timeAgoText}
      />

      {/* 4. Active Filter Scope Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-300">
            Showing {articles.length} {articles.length === 1 ? 'verified report' : 'verified reports'}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 font-mono">
            {timeframe === 'all'
              ? 'All-India Disaster & Weather Feed'
              : timeframe === 'today'
              ? "Today's Verified Events"
              : timeframe === '30days'
              ? 'Past 30 Days Rolling India Archive'
              : `Disaster Updates for ${location.area || location.district}, ${location.state}`}
          </span>
          {disasterType !== 'All' && (
            <span className="bg-[#0c1f35] text-[#00d492] px-2 py-0.5 rounded text-[11px] font-mono border border-[#16314f]">
              Type: {disasterType}
            </span>
          )}
          {locationScope.isFallback && (
            <span className="text-[11px] text-amber-300 bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded">
              Showing Regional {locationScope.state || 'State'} News
            </span>
          )}
        </div>

        {timeframe === 'my-location' && (
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="text-[11px] text-[#00d492] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="w-3 h-3" />
            <span>Switch Area</span>
          </button>
        )}
      </div>

      {/* 5. News Grid / Loading / Error / Empty States */}
      {isLoading ? (
        <div className="space-y-4 py-8">
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#081525] border border-[#17304d] text-xs text-[#00d492] font-mono animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>
                Retrieving real-time disaster news across {timeframe === 'my-location' ? `${location.district}, ${location.state}` : 'India'}...
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-[#091626] border border-[#162c46] rounded-2xl p-5 shadow-xl space-y-3 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-[#11243b] rounded" />
                  <div className="h-4 w-16 bg-[#11243b] rounded" />
                </div>
                <div className="h-5 w-3/4 bg-[#142c49] rounded" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-[#0d1e33] rounded" />
                  <div className="h-3 w-5/6 bg-[#0d1e33] rounded" />
                </div>
                <div className="pt-3 border-t border-[#14263c] flex items-center justify-between">
                  <div className="h-4 w-28 bg-[#11243b] rounded" />
                  <div className="h-6 w-24 bg-[#142c49] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-[#091626] border border-rose-900/60 rounded-2xl p-8 text-center space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Live news is temporarily unavailable. Please try again shortly.</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            The national news telemetry pipeline could not establish a connection to the live data stream.
          </p>
          <button
            onClick={() => loadNews(true)}
            className="px-4 py-2 bg-[#009e60] hover:bg-[#00b870] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-10 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#0c1e33] border border-[#183454] flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white">
              {emptyInfo.title}
            </h3>
            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              {emptyInfo.subtitle}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2.5 pt-2 flex-wrap">
            {disasterType !== 'All' && (
              <button
                onClick={() => setDisasterType('All')}
                className="px-3.5 py-1.5 rounded-xl bg-[#0e243c] border border-[#1a3d66] text-xs font-medium text-slate-200 hover:text-white cursor-pointer"
              >
                Clear Category Filter
              </button>
            )}
            {timeframe !== 'all' && (
              <button
                onClick={() => setTimeframe('all')}
                className="px-3.5 py-1.5 rounded-xl bg-[#009e60] text-white text-xs font-bold hover:bg-[#00b870] cursor-pointer inline-flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>View All India News</span>
              </button>
            )}
            <button
              onClick={() => loadNews(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#0e243c] border border-[#1a3d66] text-xs font-medium text-slate-200 hover:text-white cursor-pointer"
            >
              Refresh Feed
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleArticles.map((article) => (
              <DisasterNewsCard
                key={article.id}
                article={article}
                onOpenDetails={setSelectedArticle}
              />
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < articles.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="px-6 py-2.5 rounded-xl bg-[#0a1b2d] hover:bg-[#0e2742] border border-[#18385c] hover:border-[#00d492] text-xs font-bold text-slate-200 hover:text-white transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <span>Load More Disaster Reports ({articles.length - visibleCount} remaining)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#00d492]" />
              </button>
            </div>
          )}
        </>
      )}

      {/* 6. Details Modal */}
      <DisasterNewsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
};
