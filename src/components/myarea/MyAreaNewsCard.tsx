import React, { useState, useEffect } from 'react';
import { Newspaper, ChevronRight, MapPin, Radio, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fetchDisasterNews } from '../../services/disasterNewsClient';
import { UserLocation, VerifiedDisasterNewsItem } from '../../types';

interface MyAreaNewsCardProps {
  location: UserLocation;
}

export const MyAreaNewsCard: React.FC<MyAreaNewsCardProps> = ({ location }) => {
  const { setActiveRoute } = useApp();
  const [newsItem, setNewsItem] = useState<VerifiedDisasterNewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadAreaBulletin() {
      try {
        setLoading(true);
        const response = await fetchDisasterNews({
          timeframe: 'my-location',
          location,
          signal: controller.signal,
        });

        if (isMounted) {
          if (response.articles && response.articles.length > 0) {
            setNewsItem(response.articles[0]);
          } else {
            setNewsItem(null);
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError' && isMounted) {
          setLoading(false);
        }
      }
    }

    loadAreaBulletin();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [location.state, location.district, location.area]);

  const handleOpenLocalNews = () => {
    setActiveRoute('disaster-news');
  };

  return (
    <div className="bg-gradient-to-r from-[#060e19] via-[#09182a] to-[#060e19] border border-[#14263c] hover:border-[#1d436c] rounded-2xl p-4 sm:p-5 shadow-xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left side info */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#00d492]/10 border border-[#00d492]/30 flex items-center justify-center text-[#00d492] shrink-0 shadow-lg">
          <Newspaper className="w-5 h-5" />
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>My Area Disaster News</span>
              <span className="text-slate-400 font-normal">•</span>
              <span className="text-cyan-400 text-xs font-mono">
                {location.district}, {location.state}
              </span>
            </h4>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              LATEST LOCAL BULLETIN
            </span>
          </div>

          {loading ? (
            <div className="h-4 w-3/4 bg-[#0d1e33] rounded animate-pulse" />
          ) : newsItem ? (
            <p className="text-xs text-slate-300 line-clamp-1 leading-relaxed">
              <span className="text-white font-semibold">{newsItem.title}: </span>
              {newsItem.summary}
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              No active disaster alerts reported for {location.district} today. Tap to view India-wide intelligence.
            </p>
          )}
        </div>
      </div>

      {/* Action Gateway Button */}
      <button
        type="button"
        onClick={handleOpenLocalNews}
        className="px-4 py-2 rounded-xl bg-[#0c1f36] border border-[#1b3e66] hover:bg-[#122e50] hover:border-[#00d492] text-cyan-300 hover:text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap self-end md:self-center shadow-md hover:scale-105"
      >
        <span>Open News Feed</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#00d492]" />
      </button>
    </div>
  );
};
