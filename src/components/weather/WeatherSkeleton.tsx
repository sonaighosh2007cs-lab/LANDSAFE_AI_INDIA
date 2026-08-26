import React from 'react';

export const WeatherSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" id="weather-skeleton-loader">
      {/* Hero Card Skeleton */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-[#14263c] rounded-md" />
            <div className="h-4 w-72 bg-[#0f1d2e] rounded-md" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-28 bg-[#14263c] rounded-full" />
            <div className="h-8 w-24 bg-[#14263c] rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-[#14263c]">
          <div className="md:col-span-6 space-y-3">
            <div className="h-20 w-44 bg-[#14263c] rounded-2xl" />
            <div className="h-5 w-60 bg-[#0f1d2e] rounded-md" />
          </div>
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-[#07111e] rounded-xl border border-[#13273f]" />
            ))}
          </div>
        </div>
      </div>

      {/* Rain Window Skeleton */}
      <div className="h-28 bg-[#091626] border border-[#182f4d] rounded-2xl p-4" />

      {/* Hourly Section Skeleton */}
      <div className="bg-[#091626] border border-[#182f4d] rounded-2xl p-5 space-y-4">
        <div className="h-5 w-40 bg-[#14263c] rounded-md" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-36 w-28 shrink-0 bg-[#07111e] rounded-xl border border-[#13273f]" />
          ))}
        </div>
      </div>

      {/* Daily & Metrics Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-96 bg-[#091626] border border-[#182f4d] rounded-2xl" />
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-[#091626] border border-[#182f4d] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
